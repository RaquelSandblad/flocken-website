/**
 * Production-safe checklist helper (v1)
 *
 * Shows evidence for:
 * - fact_kpi_daily idempotence (row counts unchanged across re-runs)
 * - analytics_ops.pipeline_runs: 1 row per run_id
 * - freshness/volume/value-quality check statuses
 *
 * Usage examples:
 *   node scripts/production-safe-checks.js --expected=2026-02-03
 *   node scripts/production-safe-checks.js --start=2026-02-01 --end=2026-02-03
 *   node scripts/production-safe-checks.js --expected=1999-01-01 --run-freshness
 *   node scripts/production-safe-checks.js --expected=2026-02-03 --run-checks
 *
 * Env (optional):
 *   BQ_PROJECT_ID (default: nastahem-tracking)
 *   BQ_LOCATION (default: EU)
 *   GA4_DATASET_ID (default: analytics_518338757)
 *   APP_ID (default: flocken)
 */

const { BigQuery } = require('@google-cloud/bigquery');
const fs = require('fs');
const path = require('path');

const PROJECT_ID = process.env.BQ_PROJECT_ID || 'nastahem-tracking';
const LOCATION = process.env.BQ_LOCATION || 'EU';
const GA4_DATASET_ID = process.env.GA4_DATASET_ID || 'analytics_518338757';
const APP_ID = process.env.APP_ID || 'flocken';

function detectKeyFile() {
  const envKey = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (envKey && fs.existsSync(envKey)) return envKey;

  const scriptsDir = __dirname;
  const candidates = fs
    .readdirSync(scriptsDir)
    .filter(
      (file) =>
        file.endsWith('-key.json') ||
        file.endsWith('-credentials.json') ||
        file.includes('service-account')
    )
    .map((file) => path.join(scriptsDir, file))
    .filter((p) => fs.existsSync(p));

  return candidates[0] || null;
}

function parseArgs(argv) {
  const out = {
    appId: APP_ID,
    expected: null,
    start: null,
    end: null,
    runFreshness: false,
    runVolume: false,
    runQuality: false,
    runChecks: false,
    runVolumeWeek: false,
    findListingCreatedDate: false,
    findRawListingCreatedDate: false,
  };

  for (const a of argv.slice(2)) {
    if (a.startsWith('--app_id=')) out.appId = a.split('=')[1];
    else if (a.startsWith('--expected=')) out.expected = a.split('=')[1];
    else if (a.startsWith('--start=')) out.start = a.split('=')[1];
    else if (a.startsWith('--end=')) out.end = a.split('=')[1];
    else if (a === '--run-freshness') out.runFreshness = true;
    else if (a === '--run-volume') out.runVolume = true;
    else if (a === '--run-quality') out.runQuality = true;
    else if (a === '--run-checks') out.runChecks = true;
    else if (a === '--run-volume-week') out.runVolumeWeek = true;
    else if (a === '--find-listing-created-date') out.findListingCreatedDate = true;
    else if (a === '--find-raw-listing-created-date') out.findRawListingCreatedDate = true;
  }

  if (out.runChecks) {
    out.runFreshness = true;
    out.runVolume = true;
    out.runQuality = true;
  }

  return out;
}

function readSql(rel) {
  return fs.readFileSync(path.join(__dirname, rel), 'utf8');
}

function substitute(sql) {
  return sql.replaceAll('{{PROJECT_ID}}', PROJECT_ID).replaceAll('{{GA4_DATASET_ID}}', GA4_DATASET_ID);
}

async function query(bq, q, params) {
  const [rows] = await bq.query({ query: q, location: LOCATION, useLegacySql: false, params });
  return rows;
}

async function runSqlFile(bq, relPath, params) {
  const sql = substitute(readSql(relPath));
  const [rows] = await bq.query({ query: sql, location: LOCATION, useLegacySql: false, params });
  return rows;
}

async function main() {
  const args = parseArgs(process.argv);

  const keyFile = detectKeyFile();
  const config = { projectId: PROJECT_ID };
  if (keyFile) config.keyFilename = keyFile;
  const bq = new BigQuery(config);

  // Default expected date = yesterday Europe/Stockholm
  let expected = args.expected;
  if (!expected) {
    const rows = await query(
      bq,
      "SELECT FORMAT_DATE('%Y-%m-%d', DATE_SUB(CURRENT_DATE('Europe/Stockholm'), INTERVAL 1 DAY)) AS d",
      {}
    );
    expected = rows?.[0]?.d;
  }

  const start = args.start || expected;
  const end = args.end || expected;

  console.log(`📊 Project: ${PROJECT_ID}`);
  console.log(`📍 Location: ${LOCATION}`);
  console.log(`📦 GA4 dataset: ${GA4_DATASET_ID}`);
  console.log(`🧩 App: ${args.appId}`);
  console.log(`📅 expected_date: ${expected}`);
  console.log(`🗓️  range: ${start} → ${end}\n`);

  if (args.findListingCreatedDate) {
    const rows = await query(
      bq,
      `
        SELECT date, SUM(value) AS listing_created
        FROM \`${PROJECT_ID}.analytics_core.fact_kpi_daily\`
        WHERE app_id=@app_id
          AND source_system='ga4'
          AND metric='listing_created'
          AND date >= DATE_SUB(PARSE_DATE('%Y-%m-%d', @expected), INTERVAL 30 DAY)
        GROUP BY date
        HAVING listing_created > 0
        ORDER BY date DESC
        LIMIT 10
      `,
      { app_id: args.appId, expected }
    );
    console.table(rows);
    return;
  }

  if (args.findRawListingCreatedDate) {
    const rows = await query(
      bq,
      `
        SELECT
          PARSE_DATE('%Y%m%d', _TABLE_SUFFIX) AS date,
          COUNT(*) AS events
        FROM \`${PROJECT_ID}.${GA4_DATASET_ID}.events_*\`
        WHERE _TABLE_SUFFIX BETWEEN FORMAT_DATE('%Y%m%d', DATE_SUB(PARSE_DATE('%Y-%m-%d', @expected), INTERVAL 30 DAY))
                                AND FORMAT_DATE('%Y%m%d', PARSE_DATE('%Y-%m-%d', @expected))
          AND event_name = 'listing_created'
        GROUP BY _TABLE_SUFFIX
        HAVING events > 0
        ORDER BY date DESC
        LIMIT 20
      `,
      { expected }
    );
    console.table(rows);
    return;
  }

  // 1) fact_kpi_daily row counts for the range (should remain stable across reruns)
  const factCounts = await query(
    bq,
    `
      SELECT
        COUNT(*) AS rows_total,
        COUNT(DISTINCT CONCAT(CAST(date AS STRING),'|',app_id,'|',platform,'|',source_system,'|',metric)) AS rows_distinct_key
      FROM \`${PROJECT_ID}.analytics_core.fact_kpi_daily\`
      WHERE app_id=@app_id
        AND source_system='ga4'
        AND date BETWEEN PARSE_DATE('%Y-%m-%d', @start) AND PARSE_DATE('%Y-%m-%d', @end)
    `,
    { app_id: args.appId, start, end }
  );
  console.log('fact_kpi_daily counts (range):', factCounts[0]);

  const byMetric = await query(
    bq,
    `
      SELECT date, platform, metric, value, run_id, ingested_at
      FROM \`${PROJECT_ID}.analytics_core.fact_kpi_daily\`
      WHERE app_id=@app_id
        AND source_system='ga4'
        AND date = PARSE_DATE('%Y-%m-%d', @expected)
        AND metric IN ('sign_up','listing_published')
      ORDER BY platform, metric
    `,
    { app_id: args.appId, expected }
  );
  console.log('\nfact_kpi_daily (expected_date, critical metrics):');
  console.table(byMetric);

  // 2) pipeline_runs: latest + check run_id uniqueness
  const latestRuns = await query(
    bq,
    `
      SELECT started_at, ended_at, run_id, status, records_written, error_message
      FROM \`${PROJECT_ID}.analytics_ops.pipeline_runs\`
      WHERE app_id=@app_id AND source_system='ga4'
      ORDER BY started_at DESC
      LIMIT 10
    `,
    { app_id: args.appId }
  );
  console.log('\npipeline_runs (latest 10):');
  console.table(latestRuns);

  const badRunIds = await query(
    bq,
    `
      SELECT run_id, COUNT(*) AS c
      FROM \`${PROJECT_ID}.analytics_ops.pipeline_runs\`
      WHERE app_id=@app_id AND source_system='ga4'
      GROUP BY run_id
      HAVING c != 1
      ORDER BY c DESC
      LIMIT 10
    `,
    { app_id: args.appId }
  );
  console.log('\npipeline_runs run_id duplicates (should be empty):');
  console.table(badRunIds);

  // 3) checks: latest for expected_date
  const freshness = await query(
    bq,
    `
      SELECT *
      FROM \`${PROJECT_ID}.analytics_ops.check_freshness_daily\`
      WHERE app_id=@app_id AND expected_date=PARSE_DATE('%Y-%m-%d', @expected)
      ORDER BY checked_at DESC
      LIMIT 1
    `,
    { app_id: args.appId, expected }
  );
  console.log('\ncheck_freshness_daily (latest for expected_date):');
  console.table(freshness);

  const volume = await query(
    bq,
    `
      SELECT *
      FROM \`${PROJECT_ID}.analytics_ops.check_volume_daily\`
      WHERE app_id=@app_id AND expected_date=PARSE_DATE('%Y-%m-%d', @expected)
      ORDER BY checked_at DESC, metric
      LIMIT 20
    `,
    { app_id: args.appId, expected }
  );
  console.log('\ncheck_volume_daily (for expected_date):');
  console.table(volume);

  const quality = await query(
    bq,
    `
      SELECT *
      FROM \`${PROJECT_ID}.analytics_ops.check_value_quality_daily\`
      WHERE app_id=@app_id AND expected_date=PARSE_DATE('%Y-%m-%d', @expected)
      ORDER BY checked_at DESC
      LIMIT 1
    `,
    { app_id: args.appId, expected }
  );
  console.log('\ncheck_value_quality_daily (latest for expected_date):');
  console.table(quality);

  // Optional: run checks ad-hoc for given expected_date
  if (args.runFreshness) {
    const rows = await runSqlFile(bq, 'check-freshness-daily.sql', { expected_date: expected, app_id: args.appId });
    console.log('\n[ran] check-freshness-daily.sql:');
    console.table(rows);
  }
  if (args.runVolume) {
    const rows = await runSqlFile(bq, 'check-volume-daily.sql', { expected_date: expected, app_id: args.appId });
    console.log('\n[ran] check-volume-daily.sql:');
    console.table(rows);
  }
  if (args.runVolumeWeek) {
    // Run check-volume for expected-6 .. expected (7 days)
    const dates = await query(
      bq,
      `
        WITH ds AS (
          SELECT d
          FROM UNNEST(GENERATE_DATE_ARRAY(DATE_SUB(PARSE_DATE('%Y-%m-%d', @expected), INTERVAL 6 DAY), PARSE_DATE('%Y-%m-%d', @expected))) d
        )
        SELECT FORMAT_DATE('%Y-%m-%d', d) AS d
        FROM ds
        ORDER BY d
      `,
      { expected }
    );

    for (const r of dates) {
      await runSqlFile(bq, 'check-volume-daily.sql', { expected_date: r.d, app_id: args.appId });
    }

    const rows = await query(
      bq,
      `
        SELECT expected_date, metric, status, reason, value_yesterday, median_prev7
        FROM \`${PROJECT_ID}.analytics_ops.check_volume_daily\`
        WHERE app_id=@app_id
          AND check_date = CURRENT_DATE('Europe/Stockholm')
          AND expected_date BETWEEN DATE_SUB(PARSE_DATE('%Y-%m-%d', @expected), INTERVAL 6 DAY) AND PARSE_DATE('%Y-%m-%d', @expected)
        ORDER BY expected_date DESC, metric
      `,
      { app_id: args.appId, expected }
    );
    console.log('\n[ran] check-volume-daily.sql for last 7 days (today as check_date):');
    console.table(rows);
  }
  if (args.runQuality) {
    const rows = await runSqlFile(bq, 'check-value-quality-daily.sql', { expected_date: expected, app_id: args.appId });
    console.log('\n[ran] check-value-quality-daily.sql:');
    console.table(rows);
  }
}

main().catch((err) => {
  console.error('❌ Error:', err?.message || err);
  process.exit(1);
});

