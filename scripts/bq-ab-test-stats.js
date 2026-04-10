/**
 * BigQuery: A/B Test Statistics
 *
 * Hämtar statistik för A/B-testexperiment från BigQuery (GA4 export).
 * Använder samma logik som MCP-servern men körs direkt som script.
 *
 * Usage:
 *   node scripts/bq-ab-test-stats.js valkommen_hero_v1
 *   node scripts/bq-ab-test-stats.js valkommen_hero_v1 --days 7
 *   node scripts/bq-ab-test-stats.js valkommen_hero_v1 --conversion cta_click
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

// Normal CDF approximation
function normalCDF(x) {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x) / Math.sqrt(2);

  const t = 1.0 / (1.0 + p * x);
  const y = 1.0 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

  return 0.5 * (1.0 + sign * y);
}

// Z-test for proportions
function zTestForProportions(controlVisitors, controlConversions, variantVisitors, variantConversions) {
  const controlRate = controlConversions / controlVisitors;
  const variantRate = variantConversions / variantVisitors;

  const absoluteLift = variantRate - controlRate;
  const relativeLift = controlRate > 0 ? (variantRate - controlRate) / controlRate : 0;

  const pooledRate = (controlConversions + variantConversions) / (controlVisitors + variantVisitors);
  const standardError = Math.sqrt(
    pooledRate * (1 - pooledRate) * (1 / controlVisitors + 1 / variantVisitors)
  );

  const zScore = standardError > 0 ? absoluteLift / standardError : 0;
  const pValue = 2 * (1 - normalCDF(Math.abs(zScore)));
  const confidenceLevel = (1 - pValue) * 100;
  const isSignificant = pValue < 0.05;

  let winner = 'none';
  if (isSignificant) {
    winner = variantRate > controlRate ? 'variant' : 'control';
  }

  return {
    controlRate,
    variantRate,
    absoluteLift,
    relativeLift,
    zScore,
    pValue,
    confidenceLevel,
    isSignificant,
    winner,
  };
}

async function getExperimentStats(bigquery, experimentId, conversionEvent, daysBack) {
  const query = `
    WITH experiment_impressions AS (
      SELECT
        user_pseudo_id,
        event_date,
        (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'variant_id') AS variant_id,
        MIN(event_timestamp) AS first_impression
      FROM \`${PROJECT_ID}.${DATASET_ID}.events_*\`
      WHERE event_name = 'experiment_impression'
        AND (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'experiment_id') = @experimentId
        AND _TABLE_SUFFIX >= FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL @daysBack DAY))
      GROUP BY user_pseudo_id, event_date, variant_id
    ),

    conversions AS (
      SELECT
        user_pseudo_id,
        event_date,
        (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'variant_id') AS variant_id,
        event_name AS conversion_event
      FROM \`${PROJECT_ID}.${DATASET_ID}.events_*\`
      WHERE event_name = @conversionEventName
        AND (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'experiment_id') = @experimentId
        AND _TABLE_SUFFIX >= FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL @daysBack DAY))
    ),

    variant_stats AS (
      SELECT
        ei.variant_id,
        COUNT(DISTINCT ei.user_pseudo_id) AS impressions,
        COUNT(DISTINCT c.user_pseudo_id) AS conversions
      FROM experiment_impressions ei
      LEFT JOIN conversions c
        ON ei.user_pseudo_id = c.user_pseudo_id
        AND ei.variant_id = c.variant_id
      GROUP BY ei.variant_id
    ),

    date_range AS (
      SELECT
        MIN(event_date) AS start_date,
        MAX(event_date) AS end_date
      FROM experiment_impressions
    )

    SELECT
      vs.variant_id,
      vs.impressions,
      vs.conversions,
      dr.start_date,
      dr.end_date,
      DATE_DIFF(PARSE_DATE('%Y%m%d', dr.end_date), PARSE_DATE('%Y%m%d', dr.start_date), DAY) + 1 AS days_running
    FROM variant_stats vs
    CROSS JOIN date_range dr
    ORDER BY vs.variant_id;
  `;

  const options = {
    query,
    params: {
      experimentId,
      conversionEventName: conversionEvent,
      daysBack,
    },
  };

  const [rows] = await bigquery.query(options);
  return rows;
}

async function main() {
  const args = process.argv.slice(2);
  const experimentId = args[0];

  if (!experimentId) {
    console.error('❌ Ange experiment ID som argument');
    console.error('   Exempel: node scripts/bq-ab-test-stats.js valkommen_hero_v1');
    process.exit(1);
  }

  const daysBack = args.includes('--days') 
    ? parseInt(args[args.indexOf('--days') + 1]) || 30
    : 30;
  
  const conversionEvent = args.includes('--conversion')
    ? args[args.indexOf('--conversion') + 1] || 'cta_click'
    : 'cta_click';

  const keyFile = detectKeyFile();
  const bigqueryConfig = { projectId: PROJECT_ID };
  if (keyFile) {
    bigqueryConfig.keyFilename = keyFile;
    console.log(`🔑 Använder service account: ${path.basename(keyFile)}`);
  } else {
    console.log('⚠️  Ingen service account key hittad – använder application-default credentials');
  }

  const bigquery = new BigQuery(bigqueryConfig);

  console.log(`\n📊 Hämtar statistik för experiment: ${experimentId}`);
  console.log(`   Konverteringsevent: ${conversionEvent}`);
  console.log(`   Dagar bakåt: ${daysBack}\n`);

  try {
    const rows = await getExperimentStats(bigquery, experimentId, conversionEvent, daysBack);

    if (!rows || rows.length === 0) {
      console.log('❌ Ingen data hittades för detta experiment.');
      console.log('   Kontrollera att:');
      console.log('   1. Experimentet är aktivt (status: "running")');
      console.log('   2. GA4 → BigQuery export fungerar');
      console.log('   3. Events skickas korrekt (experiment_impression, cta_click)');
      process.exit(1);
    }

    // Find control and variant
    const control = rows.find((r) => r.variant_id === 'control') || rows[0];
    const variant = rows.find((r) => r.variant_id !== 'control') || rows[1];

    if (!control || !variant) {
      console.log('⚠️  Endast en variant hittades. A/B-test kräver minst två varianter.');
      console.log('   Variants:', rows.map((r) => r.variant_id).join(', '));
      process.exit(1);
    }

    const controlVisitors = Number(control.impressions);
    const controlConversions = Number(control.conversions);
    const variantVisitors = Number(variant.impressions);
    const variantConversions = Number(variant.conversions);
    const daysRunning = Number(control.days_running) || 0;

    const stats = zTestForProportions(
      controlVisitors,
      controlConversions,
      variantVisitors,
      variantConversions
    );

    // Format report
    console.log('═'.repeat(60));
    console.log(`📈 A/B Test Rapport: ${experimentId}`);
    console.log('═'.repeat(60));
    console.log(`\n📅 Dagar aktiv: ${daysRunning}`);
    console.log(`   Period: ${control.start_date} → ${control.end_date}\n`);

    console.log('📊 Resultat:\n');
    console.log('┌───────────┬────────────┬─────────────────┬──────────────────┐');
    console.log('│ Variant   │ Visningar  │ Konverteringar  │ Konverteringsgrad│');
    console.log('├───────────┼────────────┼─────────────────┼──────────────────┤');
    console.log(
      `│ Kontroll  │ ${String(controlVisitors).padStart(10)} │ ${String(controlConversions).padStart(15)} │ ${(stats.controlRate * 100).toFixed(2).padStart(16)}% │`
    );
    console.log(
      `│ ${variant.variant_id.padEnd(9)} │ ${String(variantVisitors).padStart(10)} │ ${String(variantConversions).padStart(15)} │ ${(stats.variantRate * 100).toFixed(2).padStart(16)}% │`
    );
    console.log('└───────────┴────────────┴─────────────────┴──────────────────┘\n');

    console.log('📈 Analys:\n');
    console.log(`   Relativ förändring: ${(stats.relativeLift * 100).toFixed(1)}%`);
    console.log(`   Statistisk signifikans: ${stats.confidenceLevel.toFixed(1)}% ${stats.isSignificant ? '✅' : '⏳'}`);
    console.log(`   P-värde: ${stats.pValue.toFixed(4)}`);
    console.log(`   Z-score: ${stats.zScore.toFixed(2)}\n`);

    console.log('💡 Rekommendation:\n');
    if (stats.isSignificant && stats.winner === 'variant') {
      console.log(`   🏆 ${variant.variant_id} är vinnare!`);
      console.log(`   Statistiskt signifikant med ${stats.confidenceLevel.toFixed(1)}% säkerhet.`);
      console.log(`   Du kan avsluta testet och implementera varianten permanent.\n`);
    } else if (stats.isSignificant && stats.winner === 'control') {
      console.log(`   📊 Kontroll är bättre.`);
      console.log(`   Statistiskt signifikant med ${stats.confidenceLevel.toFixed(1)}% säkerhet.`);
      console.log(`   Behåll nuvarande version.\n`);
    } else {
      console.log(`   ⏳ Ingen vinnare ännu.`);
      if (controlVisitors + variantVisitors < 1000) {
        console.log(`   Rekommendation: Fortsätt tills du har minst 500 visningar per variant.\n`);
      } else {
        console.log(`   Rekommendation: Fortsätt samla data eller överväg att testa en mer distinkt variant.\n`);
      }
    }

    console.log('═'.repeat(60));
  } catch (error) {
    console.error('\n❌ Fel vid hämtning av statistik:');
    console.error(error.message);
    if (error.message.includes('does not exist')) {
      console.error('\n💡 Tips:');
      console.error('   - Kontrollera att dataset finns: ' + DATASET_ID);
      console.error('   - Kontrollera att GA4 → BigQuery export är aktiverad');
    }
    process.exit(1);
  }
}

main().catch(console.error);
