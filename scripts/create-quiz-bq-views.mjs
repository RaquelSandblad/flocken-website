/**
 * Creates BigQuery views for quiz analytics in nastahem-tracking project.
 * Uses service account from .google-credentials.json
 *
 * Run: node scripts/create-quiz-bq-views.mjs
 */

import { BigQuery } from '@google-cloud/bigquery';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const credentials = JSON.parse(
  readFileSync(join(__dirname, '../.google-credentials.json'), 'utf8')
);

const bq = new BigQuery({
  projectId: 'nastahem-tracking',
  credentials,
});

const PROJECT = 'nastahem-tracking';
const RAW_DATASET = 'analytics_518338757';
const CURATED = 'flocken_curated';
const MARTS = 'flocken_marts';
const FIRST_DAY = '20260216'; // First day quiz tracking was live

// ─── SQL definitions ────────────────────────────────────────────────────────

const VIEWS = [
  {
    name: 'quiz_events',
    dataset: CURATED,
    sql: `
CREATE OR REPLACE VIEW \`${PROJECT}.${CURATED}.quiz_events\` AS
SELECT
  event_date,
  TIMESTAMP_MICROS(event_timestamp) AS event_timestamp,
  event_name,
  user_pseudo_id,

  (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'quiz_slug')   AS quiz_slug,
  (SELECT value.int_value    FROM UNNEST(event_params) WHERE key = 'quiz_score')  AS quiz_score,
  (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'quiz_bucket') AS quiz_bucket,
  (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'quiz_cta')    AS quiz_cta,

  (SELECT value.int_value    FROM UNNEST(event_params) WHERE key = 'ga_session_id') AS session_id,
  (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'source')        AS traffic_source,
  (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'medium')        AS traffic_medium,
  (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'campaign')      AS campaign,

  device.category         AS device_category,
  device.operating_system AS operating_system,
  geo.country             AS country,
  geo.region              AS region

FROM \`${PROJECT}.${RAW_DATASET}.events_*\`
WHERE event_name IN (
  'quiz_start',
  'quiz_complete',
  'quiz_score_bucket',
  'quiz_cta_click',
  'quiz_cta_download_click',
  'quiz_share'
)
AND _TABLE_SUFFIX >= '${FIRST_DAY}'
`,
  },

  {
    name: 'quiz_funnel',
    dataset: CURATED,
    sql: `
CREATE OR REPLACE VIEW \`${PROJECT}.${CURATED}.quiz_funnel\` AS
WITH starts AS (
  SELECT
    quiz_slug,
    COUNT(DISTINCT user_pseudo_id) AS unique_starters,
    COUNT(*)                       AS total_starts,
    MIN(event_date)                AS first_start_date
  FROM \`${PROJECT}.${CURATED}.quiz_events\`
  WHERE event_name = 'quiz_start' AND quiz_slug IS NOT NULL
  GROUP BY quiz_slug
),
completions AS (
  SELECT
    quiz_slug,
    COUNT(DISTINCT user_pseudo_id)                           AS unique_completers,
    COUNT(*)                                                 AS total_completions,
    ROUND(AVG(quiz_score), 1)                                AS avg_score,
    COUNTIF(quiz_score >= 8)                                 AS gold_count,
    COUNTIF(quiz_score BETWEEN 5 AND 7)                      AS silver_count,
    COUNTIF(quiz_score <= 4)                                 AS bronze_count
  FROM \`${PROJECT}.${CURATED}.quiz_events\`
  WHERE event_name = 'quiz_complete' AND quiz_slug IS NOT NULL
  GROUP BY quiz_slug
),
cta_clicks AS (
  SELECT
    quiz_slug,
    COUNT(DISTINCT user_pseudo_id)                           AS users_clicked_cta,
    COUNTIF(quiz_cta = 'download')                           AS download_clicks
  FROM \`${PROJECT}.${CURATED}.quiz_events\`
  WHERE event_name = 'quiz_cta_click' AND quiz_slug IS NOT NULL
  GROUP BY quiz_slug
)
SELECT
  s.quiz_slug,
  s.unique_starters,
  s.total_starts,
  COALESCE(c.unique_completers, 0)                           AS unique_completers,
  COALESCE(c.total_completions, 0)                           AS total_completions,
  ROUND(SAFE_DIVIDE(c.unique_completers, s.unique_starters) * 100, 1) AS completion_rate_pct,
  c.avg_score,
  COALESCE(c.gold_count,   0)                                AS gold_badges,
  COALESCE(c.silver_count, 0)                                AS silver_badges,
  COALESCE(c.bronze_count, 0)                                AS bronze_badges,
  COALESCE(ct.users_clicked_cta, 0)                          AS cta_clicks,
  COALESCE(ct.download_clicks,   0)                          AS download_clicks,
  ROUND(SAFE_DIVIDE(ct.download_clicks, c.unique_completers) * 100, 1) AS download_conversion_pct,
  s.first_start_date
FROM starts s
LEFT JOIN completions c ON s.quiz_slug = c.quiz_slug
LEFT JOIN cta_clicks  ct ON s.quiz_slug = ct.quiz_slug
ORDER BY s.total_starts DESC
`,
  },
];

const DAILY_TABLE_SQL = `
CREATE OR REPLACE TABLE \`${PROJECT}.${MARTS}.quiz_daily\`
PARTITION BY date
AS
SELECT
  PARSE_DATE('%Y%m%d', event_date)                              AS date,
  quiz_slug,
  COUNTIF(event_name = 'quiz_start')                           AS starts,
  COUNTIF(event_name = 'quiz_complete')                        AS completions,
  ROUND(
    SAFE_DIVIDE(
      COUNTIF(event_name = 'quiz_complete'),
      NULLIF(COUNTIF(event_name = 'quiz_start'), 0)
    ) * 100, 1
  )                                                            AS completion_rate_pct,
  ROUND(AVG(CASE WHEN event_name = 'quiz_complete' THEN quiz_score END), 1) AS avg_score,
  COUNTIF(event_name = 'quiz_cta_download_click')              AS download_clicks,
  COUNT(DISTINCT user_pseudo_id)                               AS unique_users
FROM \`${PROJECT}.${CURATED}.quiz_events\`
WHERE quiz_slug IS NOT NULL
GROUP BY date, quiz_slug
`;

// ─── Ensure datasets exist ───────────────────────────────────────────────────

async function ensureDataset(datasetId) {
  const dataset = bq.dataset(datasetId);
  const [exists] = await dataset.exists();
  if (!exists) {
    await bq.createDataset(datasetId, { location: 'EU' });
    console.log(`  Created dataset: ${datasetId}`);
  }
}

// ─── Run a DDL query ─────────────────────────────────────────────────────────

async function runQuery(sql, label) {
  console.log(`\nRunning: ${label}...`);
  try {
    const [job] = await bq.createQueryJob({ query: sql, location: 'EU' });
    await job.getQueryResults();
    console.log(`  ✅ ${label} — done`);
  } catch (err) {
    console.error(`  ❌ ${label} — FAILED:`, err.message);
    throw err;
  }
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('=== Flocken Quiz BigQuery Setup ===\n');

  // Make sure destination datasets exist
  await ensureDataset(CURATED);
  await ensureDataset(MARTS);

  // Create views
  for (const view of VIEWS) {
    await runQuery(view.sql, `CREATE VIEW ${view.dataset}.${view.name}`);
  }

  // Create daily partitioned table
  await runQuery(DAILY_TABLE_SQL, `CREATE TABLE ${MARTS}.quiz_daily`);

  console.log('\n✅ All quiz analytics objects created in BigQuery.');
  console.log('   They will have data after the first quiz events export (tomorrow ~06:00 UTC).');
  console.log(`\n   Query funnel anytime:\n   SELECT * FROM \`${PROJECT}.${CURATED}.quiz_funnel\`;`);
}

main().catch((err) => {
  console.error('\nFatal error:', err);
  process.exit(1);
});
