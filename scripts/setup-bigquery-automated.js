/**
 * Automated BigQuery Setup Script för Flocken
 * Kör detta script för att automatiskt skapa datasets och views i BigQuery
 * 
 * Requirements:
 * - npm install @google-cloud/bigquery
 * - gcloud auth application-default login (eller set GOOGLE_APPLICATION_CREDENTIALS)
 * - BigQuery API enabled i projektet
 */

const { BigQuery } = require('@google-cloud/bigquery');
const fs = require('fs');
const path = require('path');

const PROJECT_ID = 'nastahem-tracking';
const LOCATION = 'europe-west1';

// Initialize BigQuery client
const bigquery = new BigQuery({
  projectId: PROJECT_ID,
  location: LOCATION,
});

async function createDataset(datasetId, description) {
  console.log(`\n📦 Creating dataset: ${datasetId}...`);
  
  try {
    const [dataset] = await bigquery.createDataset(datasetId, {
      location: LOCATION,
      description: description,
    });
    console.log(`✅ Dataset ${datasetId} created successfully`);
    return dataset;
  } catch (error) {
    if (error.code === 409) {
      console.log(`⚠️  Dataset ${datasetId} already exists, skipping...`);
      return await bigquery.dataset(datasetId);
    }
    throw error;
  }
}

async function runQuery(query, description) {
  console.log(`\n🔍 Running query: ${description}...`);
  
  try {
    const [job] = await bigquery.createQueryJob({
      query: query,
      location: LOCATION,
    });
    
    await job.getQueryResults();
    console.log(`✅ Query completed: ${description}`);
  } catch (error) {
    console.error(`❌ Error running query: ${description}`);
    console.error(error.message);
    throw error;
  }
}

async function setupBigQuery() {
  console.log('🚀 Starting BigQuery setup for Flocken...');
  console.log(`📊 Project: ${PROJECT_ID}`);
  console.log(`📍 Location: ${LOCATION}\n`);

  try {
    // Step 1: Create datasets
    await createDataset('flocken_raw', 'Raw GA4 export data för Flocken. Data exporteras automatiskt från GA4 property G-7B1SVKL89Q.');
    await createDataset('flocken_curated', 'Processed and standardized GA4 data för Flocken. Data är cleaned och ready för analysis.');
    await createDataset('flocken_marts', 'Pre-calculated business metrics för Flocken. Optimized för dashboard queries.');

    // Step 2: Read SQL file
    const sqlPath = path.join(__dirname, 'setup-bigquery-datasets.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    // Split SQL into individual statements (split by semicolon + newline)
    const statements = sqlContent
      .split(/;\s*\n/)
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    // Step 3: Run each SQL statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      // Skip comments and empty statements
      if (statement.startsWith('--') || statement.length < 10) {
        continue;
      }

      // Extract description from comment if available
      const description = statement.match(/--\s*(.+)/)?.[1] || `Statement ${i + 1}`;
      
      await runQuery(statement, description);
    }

    console.log('\n✅ BigQuery setup completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Enable GA4 → BigQuery linking in GA4 Admin');
    console.log('2. Select project: nastahem-tracking');
    console.log('3. Select dataset: flocken_raw');
    console.log('4. Enable daily export and streaming export');
    console.log('\n🔗 GA4 Admin: https://analytics.google.com → Admin → BigQuery Linking');

  } catch (error) {
    console.error('\n❌ Error during BigQuery setup:');
    console.error(error.message);
    console.error('\n💡 Troubleshooting:');
    console.error('1. Verify gcloud auth: gcloud auth application-default login');
    console.error('2. Verify BigQuery API is enabled');
    console.error('3. Verify you have BigQuery Admin permissions');
    console.error('4. Check that project nastahem-tracking exists');
    process.exit(1);
  }
}

// Run setup
setupBigQuery().catch(console.error);

