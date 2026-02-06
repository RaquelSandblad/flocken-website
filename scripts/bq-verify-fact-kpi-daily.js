/**
 * BigQuery: verify analytics_core.fact_kpi_daily
 * - last 14 days for selected metrics
 * - NULL checks for required columns
 */

const { BigQuery } = require('@google-cloud/bigquery');
const fs = require('fs');
const path = require('path');

const PROJECT_ID = process.env.BQ_PROJECT_ID || 'nastahem-tracking';
const LOCATION = process.env.BQ_LOCATION || 'EU';
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

async function run() {
  const keyFile = detectKeyFile();
  const config = { projectId: PROJECT_ID };
  if (keyFile) config.keyFilename = keyFile;

  console.log(`📊 Project: ${PROJECT_ID}`);
  console.log(`📍 Location: ${LOCATION}`);
  console.log(`🧩 App: ${APP_ID}`);
  console.log(`🔑 Auth: ${keyFile ? path.basename(keyFile) : 'ADC'}\n`);

  const bq = new BigQuery(config);

  const query = `
    SELECT
      date,
      metric,
      SUM(value) AS value
    FROM \`${PROJECT_ID}.analytics_core.fact_kpi_daily\`
    WHERE app_id = @app_id
      AND metric IN ('sign_up','listing_published')
      AND date >= DATE_SUB(CURRENT_DATE(), INTERVAL 14 DAY)
    GROUP BY 1, 2
    ORDER BY date DESC, metric;
  `;

  const [rows] = await bq.query({ query, location: LOCATION, params: { app_id: APP_ID } });
  console.table(rows);

  const nullCheck = `
    SELECT
      COUNT(*) AS rows_checked,
      COUNTIF(date IS NULL) AS null_date,
      COUNTIF(app_id IS NULL) AS null_app_id,
      COUNTIF(metric IS NULL) AS null_metric,
      COUNTIF(value IS NULL) AS null_value
    FROM \`${PROJECT_ID}.analytics_core.fact_kpi_daily\`
    WHERE app_id = @app_id
      AND date >= DATE_SUB(CURRENT_DATE(), INTERVAL 14 DAY);
  `;

  const [rows2] = await bq.query({ query: nullCheck, location: LOCATION, params: { app_id: APP_ID } });
  console.log('\n✅ NULL checks:', rows2[0]);
}

run().catch((err) => {
  console.error('❌ Error:', err?.message || err);
  process.exit(1);
});

