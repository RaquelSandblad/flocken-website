/**
 * BigQuery: Check which GA4 attribution columns exist
 */

const { BigQuery } = require('@google-cloud/bigquery');
const fs = require('fs');
const path = require('path');

const PROJECT_ID = process.env.BQ_PROJECT_ID || 'nastahem-tracking';
const DATASET_ID = process.env.GA4_DATASET_ID || 'analytics_518338757';
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

  console.log(`📊 Project: ${PROJECT_ID}`);
  console.log(`📦 Dataset: ${DATASET_ID}`);
  console.log(`📍 Location: ${LOCATION}`);
  console.log(`🔑 Auth: ${keyFile ? path.basename(keyFile) : 'ADC'}\n`);

  const bq = new BigQuery(config);

  const query = `
    SELECT column_name, data_type
    FROM \`${PROJECT_ID}.${DATASET_ID}.INFORMATION_SCHEMA.COLUMNS\`
    WHERE table_name LIKE 'events_%'
      AND column_name IN (
        'traffic_source',
        'collected_traffic_source',
        'session_traffic_source_last_click',
        'event_params',
        'user_properties'
      )
    GROUP BY 1, 2
    ORDER BY 1;
  `;

  const [rows] = await bq.query({ query, location: LOCATION });
  console.log('✅ Columns found:');
  rows.forEach((r) => console.log(`- ${r.column_name}: ${r.data_type}`));
}

run().catch((err) => {
  console.error('❌ Error:', err?.message || err);
  process.exit(1);
});

