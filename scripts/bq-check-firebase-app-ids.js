/**
 * BigQuery: check which firebase_app_id(s) and platforms exist in GA4 export dataset.
 *
 * Use this to confirm the mobile app sends events into the same GA4 property
 * that exports to BigQuery dataset analytics_518338757.
 *
 * Usage:
 *   node scripts/bq-check-firebase-app-ids.js
 *   DAYS=30 node scripts/bq-check-firebase-app-ids.js
 *
 * Env:
 *   BQ_PROJECT_ID (default: nastahem-tracking)
 *   BQ_LOCATION (default: EU)
 *   GA4_DATASET_ID (default: analytics_518338757)
 */

const { BigQuery } = require('@google-cloud/bigquery');
const fs = require('fs');
const path = require('path');

const PROJECT_ID = process.env.BQ_PROJECT_ID || 'nastahem-tracking';
const LOCATION = process.env.BQ_LOCATION || 'EU';
const GA4_DATASET_ID = process.env.GA4_DATASET_ID || 'analytics_518338757';
const DAYS = Number(process.env.DAYS || 30);

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

async function main() {
  const keyFile = detectKeyFile();
  const config = { projectId: PROJECT_ID };
  if (keyFile) config.keyFilename = keyFile;

  console.log(`📊 Project: ${PROJECT_ID}`);
  console.log(`📍 Location: ${LOCATION}`);
  console.log(`📦 GA4 dataset: ${GA4_DATASET_ID}`);
  console.log(`🗓️  Window: last ${DAYS} days`);
  console.log(`🔑 Auth: ${keyFile ? path.basename(keyFile) : 'ADC'}\n`);

  const bq = new BigQuery(config);

  const q = `
    SELECT
      platform,
      app_info.firebase_app_id AS firebase_app_id,
      COUNT(*) AS events
    FROM \`${PROJECT_ID}.${GA4_DATASET_ID}.events_*\`
    WHERE _TABLE_SUFFIX >= FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE('Europe/Stockholm'), INTERVAL @days DAY))
    GROUP BY 1, 2
    ORDER BY events DESC
    LIMIT 50
  `;

  const [rows] = await bq.query({
    query: q,
    location: LOCATION,
    useLegacySql: false,
    params: { days: DAYS },
  });

  console.table(rows);

  const q2 = `
    SELECT
      platform,
      event_name,
      COUNT(*) AS events
    FROM \`${PROJECT_ID}.${GA4_DATASET_ID}.events_*\`
    WHERE _TABLE_SUFFIX >= FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE('Europe/Stockholm'), INTERVAL @days DAY))
      AND event_name IN ('listing_created','dog_created','sign_up','first_open')
    GROUP BY 1, 2
    ORDER BY events DESC
  `;

  const [rows2] = await bq.query({
    query: q2,
    location: LOCATION,
    useLegacySql: false,
    params: { days: DAYS },
  });

  console.log('\nSelected event counts (last window):');
  console.table(rows2);
}

main().catch((err) => {
  console.error('❌ Error:', err?.message || err);
  process.exit(1);
});

