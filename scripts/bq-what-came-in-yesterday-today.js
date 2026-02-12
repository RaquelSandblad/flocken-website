/**
 * BigQuery: What data came in yesterday & today?
 *
 * Reads GA4 export tables in BigQuery and prints:
 * - summary per day (yesterday + today)
 * - top events per day (yesterday + today)
 * - latest events (intraday if available)
 *
 * Auth:
 * - Uses GOOGLE_APPLICATION_CREDENTIALS if set
 * - Else auto-detects a key file in scripts/ matching:
 *   *-key.json, *-credentials.json, or containing "service-account"
 *
 * NOTE: Never commit key files. They are .gitignored.
 */

const { BigQuery } = require('@google-cloud/bigquery');
const fs = require('fs');
const path = require('path');

const PROJECT_ID = process.env.BQ_PROJECT_ID || 'nastahem-tracking';
const DEFAULT_LOCATION = process.env.BQ_LOCATION || 'EU';
const GA4_DATASET_ID = process.env.GA4_DATASET_ID || 'analytics_518338757';

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

async function run() {
  const keyFile = detectKeyFile();
  const bigqueryConfig = { projectId: PROJECT_ID };
  if (keyFile) bigqueryConfig.keyFilename = keyFile;

  console.log(`📊 Project: ${PROJECT_ID}`);
  console.log(`📍 Location: ${DEFAULT_LOCATION}`);
  console.log(`📦 GA4 dataset: ${GA4_DATASET_ID}`);
  console.log(`🔑 Auth: ${keyFile ? path.basename(keyFile) : 'ADC (gcloud / default creds)'}\n`);

  const bq = new BigQuery(bigqueryConfig);

  // 0) Sanity: list analytics_* datasets (helps if GA4 dataset id changed)
  {
    const query = `
      SELECT schema_name
      FROM \`${PROJECT_ID}.INFORMATION_SCHEMA.SCHEMATA\`
      WHERE schema_name LIKE 'analytics_%'
      ORDER BY schema_name
    `;
    const [rows] = await bq.query({ query, location: DEFAULT_LOCATION });
    console.log('🧭 analytics_* datasets found:');
    if (!rows.length) console.log('  (none)');
    else rows.forEach((r) => console.log(`  - ${r.schema_name}`));
    console.log('');
  }

  // 1) Summary per day: yesterday + today (based on table suffix)
  {
    const query = `
      SELECT
        event_date,
        COUNT(*) AS events,
        COUNT(DISTINCT user_pseudo_id) AS users,
        COUNT(DISTINCT user_id) AS users_logged_in,
        COUNTIF(event_name = 'page_view') AS page_views,
        COUNTIF(event_name = 'session_start') AS sessions,
        COUNTIF(event_name = 'first_visit') AS first_visits,
        COUNTIF(event_name = 'sign_up') AS sign_ups
      FROM \`${PROJECT_ID}.${GA4_DATASET_ID}.events_*\`
      WHERE _TABLE_SUFFIX >= FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY))
      GROUP BY event_date
      ORDER BY event_date DESC
    `;
    const [rows] = await bq.query({ query, location: DEFAULT_LOCATION });
    console.log('📅 Summary (yesterday + today):');
    console.table(rows);
  }

  // 1b) Platform breakdown (web / ios / android)
  {
    const query = `
      SELECT
        event_date,
        platform,
        COUNT(*) AS events,
        COUNT(DISTINCT user_pseudo_id) AS users
      FROM \`${PROJECT_ID}.${GA4_DATASET_ID}.events_*\`
      WHERE _TABLE_SUFFIX >= FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY))
      GROUP BY event_date, platform
      ORDER BY event_date DESC, events DESC
    `;
    const [rows] = await bq.query({ query, location: DEFAULT_LOCATION });
    console.log('\n🧩 Platform breakdown (yesterday + today):');
    console.table(rows);
  }

  // 1c) Stream breakdown (confirms which GA4 data streams are in this export)
  {
    const query = `
      SELECT
        event_date,
        platform,
        stream_id,
        COUNT(*) AS events,
        COUNT(DISTINCT user_pseudo_id) AS users
      FROM \`${PROJECT_ID}.${GA4_DATASET_ID}.events_*\`
      WHERE _TABLE_SUFFIX >= FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY))
      GROUP BY event_date, platform, stream_id
      ORDER BY event_date DESC, events DESC
      LIMIT 50
    `;
    const [rows] = await bq.query({ query, location: DEFAULT_LOCATION });
    console.log('\n🧷 Stream breakdown (yesterday + today, limit 50):');
    console.table(rows);
  }

  // 1d) Stream + platform presence over last 30 days (to detect app streams)
  {
    const query = `
      SELECT
        platform,
        stream_id,
        MIN(event_date) AS first_event_date,
        MAX(event_date) AS last_event_date,
        COUNT(*) AS events,
        COUNT(DISTINCT user_pseudo_id) AS users
      FROM \`${PROJECT_ID}.${GA4_DATASET_ID}.events_*\`
      WHERE _TABLE_SUFFIX >= FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY))
      GROUP BY platform, stream_id
      ORDER BY events DESC
      LIMIT 50
    `;
    const [rows] = await bq.query({ query, location: DEFAULT_LOCATION });
    console.log('\n🧭 Stream presence (last 30 days, limit 50):');
    console.table(rows);
  }

  // 1e) App-only quick check (last 7 days)
  {
    const query = `
      SELECT
        event_date,
        platform,
        stream_id,
        COUNT(*) AS events,
        COUNT(DISTINCT user_pseudo_id) AS users
      FROM \`${PROJECT_ID}.${GA4_DATASET_ID}.events_*\`
      WHERE _TABLE_SUFFIX >= FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY))
        AND platform IN ('ANDROID', 'IOS')
      GROUP BY event_date, platform, stream_id
      ORDER BY event_date DESC, events DESC
      LIMIT 100
    `;
    const [rows] = await bq.query({ query, location: DEFAULT_LOCATION });
    console.log('\n📱 App streams check (last 7 days):');
    if (!rows.length) console.log('  (no ANDROID/IOS events found in this export yet)');
    else console.table(rows);
  }

  // 1f) App event names (last 7 days)
  {
    const query = `
      SELECT
        event_name,
        COUNT(*) AS cnt,
        COUNT(DISTINCT user_pseudo_id) AS users
      FROM \`${PROJECT_ID}.${GA4_DATASET_ID}.events_*\`
      WHERE _TABLE_SUFFIX >= FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY))
        AND platform IN ('ANDROID', 'IOS')
      GROUP BY event_name
      ORDER BY cnt DESC
      LIMIT 50
    `;
    const [rows] = await bq.query({ query, location: DEFAULT_LOCATION });
    console.log('\n📱 App event names (last 7 days, top 50):');
    if (!rows.length) console.log('  (no app events found)');
    else console.table(rows);
  }

  // 1g) Look for account_type (event_params + user_properties) in app events
  {
    const queryEventParams = `
      SELECT
        event_date,
        platform,
        event_name,
        (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'account_type') AS account_type,
        COUNT(*) AS events,
        COUNT(DISTINCT user_pseudo_id) AS users
      FROM \`${PROJECT_ID}.${GA4_DATASET_ID}.events_*\`
      WHERE _TABLE_SUFFIX >= FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY))
        AND platform IN ('ANDROID', 'IOS')
        AND EXISTS (SELECT 1 FROM UNNEST(event_params) WHERE key = 'account_type')
      GROUP BY 1,2,3,4
      ORDER BY event_date DESC, events DESC
      LIMIT 50
    `;
    const [rowsEventParams] = await bq.query({ query: queryEventParams, location: DEFAULT_LOCATION });

    const queryUserProps = `
      SELECT
        event_date,
        platform,
        event_name,
        (SELECT value.string_value FROM UNNEST(user_properties) WHERE key = 'account_type') AS account_type,
        COUNT(*) AS events,
        COUNT(DISTINCT user_pseudo_id) AS users
      FROM \`${PROJECT_ID}.${GA4_DATASET_ID}.events_*\`
      WHERE _TABLE_SUFFIX >= FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY))
        AND platform IN ('ANDROID', 'IOS')
        AND EXISTS (SELECT 1 FROM UNNEST(user_properties) WHERE key = 'account_type')
      GROUP BY 1,2,3,4
      ORDER BY event_date DESC, events DESC
      LIMIT 50
    `;
    const [rowsUserProps] = await bq.query({ query: queryUserProps, location: DEFAULT_LOCATION });

    console.log('\n👤 account_type found in app data (last 30 days):');
    if (!rowsEventParams.length && !rowsUserProps.length) {
      console.log('  (no account_type found yet in event_params or user_properties)');
    } else {
      if (rowsEventParams.length) {
        console.log('  event_params.account_type:');
        console.table(rowsEventParams);
      }
      if (rowsUserProps.length) {
        console.log('  user_properties.account_type:');
        console.table(rowsUserProps);
      }
    }
  }

  // 2) Top events per day
  {
    const query = `
      SELECT
        event_date,
        event_name,
        COUNT(*) AS cnt,
        COUNT(DISTINCT user_pseudo_id) AS users
      FROM \`${PROJECT_ID}.${GA4_DATASET_ID}.events_*\`
      WHERE _TABLE_SUFFIX >= FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY))
      GROUP BY event_date, event_name
      ORDER BY event_date DESC, cnt DESC
      LIMIT 50
    `;
    const [rows] = await bq.query({ query, location: DEFAULT_LOCATION });
    console.log('\n🔥 Top events (yesterday + today, limit 50 rows):');
    console.table(rows);
  }

  // 2b) UTM breakdown (from page_location on page_view)
  {
    const query = `
      WITH pv AS (
        SELECT
          event_date,
          user_pseudo_id,
          (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'page_location') AS page_location
        FROM \`${PROJECT_ID}.${GA4_DATASET_ID}.events_*\`
        WHERE _TABLE_SUFFIX >= FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY))
          AND event_name = 'page_view'
      )
      SELECT
        event_date,
        COALESCE(REGEXP_EXTRACT(page_location, r'[?&]utm_source=([^&]+)'), '(none)') AS utm_source,
        COALESCE(REGEXP_EXTRACT(page_location, r'[?&]utm_medium=([^&]+)'), '(none)') AS utm_medium,
        COALESCE(REGEXP_EXTRACT(page_location, r'[?&]utm_campaign=([^&]+)'), '(none)') AS utm_campaign,
        COUNT(*) AS page_views,
        COUNT(DISTINCT user_pseudo_id) AS users
      FROM pv
      GROUP BY 1, 2, 3, 4
      ORDER BY event_date DESC, page_views DESC
      LIMIT 30
    `;
    const [rows] = await bq.query({ query, location: DEFAULT_LOCATION });
    console.log('\n🎯 UTM breakdown from page_view.page_location (limit 30):');
    console.table(rows);
  }

  // 3) Latest events (intraday if present)
  {
    const query = `
      SELECT
        TIMESTAMP_MICROS(event_timestamp) AS event_time,
        event_name,
        user_pseudo_id,
        (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'page_location') AS page_location,
        traffic_source.source AS source,
        traffic_source.medium AS medium,
        traffic_source.name AS campaign
      FROM \`${PROJECT_ID}.${GA4_DATASET_ID}.events_intraday_*\`
      WHERE _TABLE_SUFFIX = FORMAT_DATE('%Y%m%d', CURRENT_DATE())
      ORDER BY event_timestamp DESC
      LIMIT 25
    `;

    try {
      const [rows] = await bq.query({ query, location: DEFAULT_LOCATION });
      console.log('\n⏱️ Latest intraday events (today, limit 25):');
      console.table(rows);
    } catch (e) {
      console.log('\nℹ️ No intraday table found or not enabled yet (this is OK).');
      console.log(`   ${e.message}`);
    }
  }
}

run().catch((e) => {
  console.error('\n❌ Failed:', e.message);
  process.exitCode = 1;
});

