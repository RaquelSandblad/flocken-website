/**
 * BigQuery: sanity check flocken_curated.events_attribution view
 */

const { BigQuery } = require('@google-cloud/bigquery');
const fs = require('fs');
const path = require('path');

const PROJECT_ID = process.env.BQ_PROJECT_ID || 'nastahem-tracking';
const LOCATION = process.env.BQ_LOCATION || 'EU';

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
  const config = { projectId: PROJECT_ID };
  if (keyFile) config.keyFilename = keyFile;

  const bq = new BigQuery(config);

  const query = `
    SELECT
      event_date,
      event_name,
      platform,
      attr_source,
      attr_medium,
      attr_campaign,
      evt_gclid,
      page_location
    FROM \`${PROJECT_ID}.flocken_curated.events_attribution\`
    WHERE event_date >= FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY))
      AND platform = 'web'
      AND event_name IN ('page_view', 'app_install', 'generate_lead', 'sign_up')
    ORDER BY event_timestamp DESC
    LIMIT 20;
  `;

  const [rows] = await bq.query({ query, location: LOCATION });
  console.table(rows);
}

run().catch((err) => {
  console.error('❌ Error:', err?.message || err);
  process.exit(1);
});

