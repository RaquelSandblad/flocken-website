/**
 * Check if A/B test events exist in BigQuery
 */

const { BigQuery } = require('@google-cloud/bigquery');
const fs = require('fs');
const path = require('path');

const PROJECT_ID = process.env.BQ_PROJECT_ID || 'nastahem-tracking';
const DATASET_ID = process.env.BQ_DATASET_ID || process.env.GA4_DATASET_ID || 'analytics_518338757';

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
  const bigqueryConfig = { projectId: PROJECT_ID };
  if (keyFile) {
    bigqueryConfig.keyFilename = keyFile;
  }

  const bigquery = new BigQuery(bigqueryConfig);

  console.log(`\n🔍 Söker efter A/B-test events i ${PROJECT_ID}.${DATASET_ID}\n`);

  // Check for experiment_impression events
  const query = `
    SELECT 
      event_date,
      event_name,
      COUNT(*) as event_count,
      COUNT(DISTINCT user_pseudo_id) as unique_users,
      COUNT(DISTINCT (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'experiment_id')) as unique_experiments,
      COUNT(DISTINCT (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'variant_id')) as unique_variants
    FROM \`${PROJECT_ID}.${DATASET_ID}.events_*\`
    WHERE event_name IN ('experiment_impression', 'cta_click', 'experiment_conversion')
      AND _TABLE_SUFFIX >= FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY))
    GROUP BY event_date, event_name
    ORDER BY event_date DESC, event_name;
  `;

  try {
    const [rows] = await bigquery.query(query);

    if (!rows || rows.length === 0) {
      console.log('❌ Inga A/B-test events hittades i BigQuery.');
      console.log('\n💡 Möjliga orsaker:');
      console.log('   1. Experimentet har inte kört tillräckligt länge');
      console.log('   2. Events skickas inte korrekt till GA4');
      console.log('   3. GA4 → BigQuery export är inte konfigurerad för dessa events');
      console.log('\n📋 Kontrollera:');
      console.log('   - Är experimentet aktivt i lib/ab-testing/experiments.ts?');
      console.log('   - Skickas experiment_impression när sidan laddas?');
      console.log('   - Skickas cta_click när användare klickar på CTA?');
      return;
    }

    console.log('✅ A/B-test events hittades:\n');
    console.table(rows);

    // Check specific experiment
    const experimentQuery = `
      SELECT 
        event_date,
        (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'experiment_id') as experiment_id,
        (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'variant_id') as variant_id,
        COUNT(DISTINCT user_pseudo_id) as users
      FROM \`${PROJECT_ID}.${DATASET_ID}.events_*\`
      WHERE event_name = 'experiment_impression'
        AND _TABLE_SUFFIX >= FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY))
        AND (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'experiment_id') IS NOT NULL
      GROUP BY event_date, experiment_id, variant_id
      ORDER BY event_date DESC, experiment_id, variant_id;
    `;

    const [experimentRows] = await bigquery.query(experimentQuery);
    
    if (experimentRows && experimentRows.length > 0) {
      console.log('\n📊 Experiment breakdown:\n');
      console.table(experimentRows);
    }

  } catch (error) {
    console.error('\n❌ Fel vid sökning:', error.message);
  }
}

main().catch(console.error);
