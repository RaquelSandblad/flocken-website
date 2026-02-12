/**
 * Delete and Recreate BigQuery Datasets in EU Location
 */

const { BigQuery } = require('@google-cloud/bigquery');
const fs = require('fs');
const path = require('path');

const PROJECT_ID = 'nastahem-tracking';
const LOCATION = 'EU';

// Find service account key
const scriptsDir = __dirname;
const keyFiles = fs.readdirSync(scriptsDir)
  .filter(file => file.endsWith('-key.json') || file.endsWith('-credentials.json'))
  .map(file => path.join(scriptsDir, file))
  .filter(file => fs.existsSync(file));

const bigqueryConfig = {
  projectId: PROJECT_ID,
};

if (keyFiles.length > 0) {
  console.log(`🔑 Using service account key: ${keyFiles[0]}`);
  bigqueryConfig.keyFilename = keyFiles[0];
} else {
  console.log(`🔑 Using default credentials`);
}

const bigquery = new BigQuery(bigqueryConfig);

async function deleteAndRecreateDatasets() {
  console.log('🚀 Starting Dataset Recreation...');
  console.log(`📊 Project: ${PROJECT_ID}`);
  console.log(`📍 Location: ${LOCATION}\n`);

  try {
    // 1. Delete flocken_curated
    console.log('🗑️  Deleting flocken_curated...');
    try {
      await bigquery.dataset('flocken_curated').delete({ force: true });
      console.log('   ✅ Deleted flocken_curated');
    } catch (error) {
      if (error.code === 404) {
        console.log('   ⚠️  flocken_curated does not exist (OK)');
      } else {
        throw error;
      }
    }

    // 2. Delete flocken_marts
    console.log('🗑️  Deleting flocken_marts...');
    try {
      await bigquery.dataset('flocken_marts').delete({ force: true });
      console.log('   ✅ Deleted flocken_marts');
    } catch (error) {
      if (error.code === 404) {
        console.log('   ⚠️  flocken_marts does not exist (OK)');
      } else {
        throw error;
      }
    }

    // 3. Create flocken_curated in EU
    console.log('\n📦 Creating flocken_curated in EU...');
    await bigquery.createDataset('flocken_curated', {
      location: LOCATION,
      description: 'Flocken Curated Analytics Data - Cleaned and standardized events'
    });
    console.log('   ✅ Created flocken_curated in EU');

    // 4. Create flocken_marts in EU
    console.log('📦 Creating flocken_marts in EU...');
    await bigquery.createDataset('flocken_marts', {
      location: LOCATION,
      description: 'Flocken Data Marts - Business-ready analytics tables'
    });
    console.log('   ✅ Created flocken_marts in EU');

    console.log('\n✅ Datasets recreated successfully in EU location!');
    console.log('\n📋 Next step: Run views creation script');
    console.log('   node scripts/setup-bigquery-views-automated.js');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

deleteAndRecreateDatasets();

