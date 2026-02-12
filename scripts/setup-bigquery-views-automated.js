/**
 * Automated BigQuery Views Setup för Flocken
 * Kör detta script för att automatiskt skapa views och tables i BigQuery
 * 
 * Requirements:
 * - npm install @google-cloud/bigquery
 * - gcloud auth application-default login (eller set GOOGLE_APPLICATION_CREDENTIALS)
 * - BigQuery API enabled i projektet
 * - GA4 data måste finnas i analytics_518338757 dataset
 */

const { BigQuery } = require('@google-cloud/bigquery');
const fs = require('fs');
const path = require('path');

const PROJECT_ID = 'nastahem-tracking';
const LOCATION = 'EU'; // BigQuery processing location (can be 'EU' or 'europe-west1')
const GA4_DATASET_ID = 'analytics_518338757'; // GA4 skapade egen dataset

// Try to detect dataset location automatically
async function detectDatasetLocation(datasetId, bigqueryClient) {
  try {
    const dataset = bigqueryClient.dataset(datasetId);
    const [metadata] = await dataset.getMetadata();
    const detectedLocation = metadata.location || LOCATION;
    console.log(`   Dataset ${datasetId} location: ${detectedLocation}`);
    // Normalize location: 'EU' and 'europe-west1' are equivalent for queries
    // But BigQuery requires exact match, so return as-is
    return detectedLocation;
  } catch (error) {
    console.log(`   Dataset ${datasetId} not found or error: ${error.message}`);
    // If dataset doesn't exist, return default
    return LOCATION;
  }
}

// Check for service account key file (flexible - any key file in scripts folder)
const scriptsDir = __dirname;
const keyFiles = fs.readdirSync(scriptsDir)
  .filter(file => file.endsWith('-key.json') || file.endsWith('-credentials.json') || file.includes('service-account'))
  .map(file => path.join(scriptsDir, file))
  .filter(file => fs.existsSync(file));

// Also check environment variable
const envKeyFile = process.env.GOOGLE_APPLICATION_CREDENTIALS;

// Initialize BigQuery client
// Don't specify location - let BigQuery auto-detect from datasets
const bigqueryConfig = {
  projectId: PROJECT_ID,
};

// Use service account key if available (priority: env var > scripts folder > default credentials)
if (envKeyFile && fs.existsSync(envKeyFile)) {
  console.log(`🔑 Using service account key from GOOGLE_APPLICATION_CREDENTIALS: ${envKeyFile}`);
  bigqueryConfig.keyFilename = envKeyFile;
} else if (keyFiles.length > 0) {
  const keyFile = keyFiles[0]; // Use first found key file
  console.log(`🔑 Using service account key: ${keyFile}`);
  bigqueryConfig.keyFilename = keyFile;
} else {
  console.log(`🔑 Using default credentials (gcloud auth or GOOGLE_APPLICATION_CREDENTIALS)`);
  console.log(`   💡 Tip: Place any service account key JSON file in scripts/ folder`);
  console.log(`   💡 Or set: $env:GOOGLE_APPLICATION_CREDENTIALS = "path/to/key.json"`);
}

const bigquery = new BigQuery(bigqueryConfig);

async function runQuery(query, description, queryLocation = null) {
  console.log(`\n🔍 Running: ${description}...`);
  
  // Use provided location or default to EU
  const targetLocation = queryLocation || 'EU';
  
  console.log(`   📍 Using location: ${targetLocation}`);
  
  try {
    // Use query() method directly - this might handle cross-location better
    const options = {
      query: query,
      location: targetLocation,
      useLegacySql: false,
    };
    
    // Try using query() directly instead of createQueryJob()
    const [rows] = await bigquery.query(options);
    
    console.log(`   ✅ Completed: ${description}`);
    
    if (rows && rows.length > 0) {
      console.log(`   📊 Rows returned: ${rows.length}`);
    } else {
      console.log(`   ✅ Query executed successfully (DDL - no rows returned)`);
    }
    
    return rows || [];
  } catch (error) {
    console.error(`   ❌ Error: ${description}`);
    console.error(`   ${error.message}`);
    
    // Don't throw for certain errors (e.g., view already exists)
    if (error.message.includes('already exists') || error.message.includes('Already Exists')) {
      console.log(`   ⚠️  Skipping (already exists)`);
      return null;
    }
    
    throw error;
  }
}

async function setupViews() {
  console.log('🚀 Starting BigQuery Views Setup for Flocken...');
  console.log(`📊 Project: ${PROJECT_ID}`);
  console.log(`📍 Location: ${LOCATION}`);
  console.log(`📦 GA4 Dataset: ${GA4_DATASET_ID}\n`);

  try {
    // Detect actual dataset location (for query execution)
    console.log('🔍 Detecting dataset locations...');
    const curatedLocation = await detectDatasetLocation('flocken_curated', bigquery);
    const martsLocation = await detectDatasetLocation('flocken_marts', bigquery);
    const ga4Location = await detectDatasetLocation(GA4_DATASET_ID, bigquery);
    
    // Note: Queries reference datasets in different locations:
    // - analytics_518338757: EU (source data)
    // - flocken_curated/flocken_marts: europe-west1 (target for views/tables)
    // Strategy: Use 'EU' location - BigQuery documentation says EU can query both EU and europe-west1
    // This is the recommended approach for cross-location queries in EU region
    console.log(`   ℹ️  Using 'EU' location (can query both EU and europe-west1 datasets)\n`);
    const queryLocation = 'EU'; // Use EU which should work for both locations
    // Read SQL file
    const sqlPath = path.join(__dirname, 'setup-bigquery-views-flocken.sql');
    
    if (!fs.existsSync(sqlPath)) {
      throw new Error(`SQL file not found: ${sqlPath}`);
    }
    
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    // Split SQL into individual statements
    // Split by semicolon followed by newline or end of string
    const statements = sqlContent
      .split(/;\s*\n/)
      .map(s => s.trim())
      .filter(s => {
        // Filter out empty statements and comments-only lines
        const cleaned = s.replace(/--.*$/gm, '').trim();
        return cleaned.length > 10; // Minimum statement length
      });

    console.log(`📄 Found ${statements.length} SQL statements to execute\n`);

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      // Extract description from comment if available
      const commentMatch = statement.match(/--\s*(.+)/);
      const description = commentMatch 
        ? commentMatch[1].trim()
        : `Statement ${i + 1}`;
      
      // Use detected location for queries
      await runQuery(statement, description, queryLocation);
    }

    console.log('\n✅ BigQuery Views Setup completed successfully!');
    console.log('\n📋 Created:');
    console.log('   ✅ flocken_curated.events - Standardized events view');
    console.log('   ✅ flocken_marts.daily_metrics - Daily metrics table');
    console.log('   ✅ flocken_curated.user_journey - User journey view');
    console.log('   ✅ flocken_curated.conversion_funnel - Conversion funnel view');
    
    console.log('\n🧪 Test queries:');
    console.log('   See docs/BIGQUERY_DATA_FOUND.md for test queries');
    console.log('\n🔗 BigQuery Console: https://console.cloud.google.com/bigquery');

  } catch (error) {
    console.error('\n❌ Error during BigQuery Views Setup:');
    console.error(error.message);
    
    if (error.message.includes('does not match any table')) {
      console.error('\n💡 Troubleshooting:');
      console.error('   GA4 dataset might have different ID. Check:');
      console.error('   1. List datasets: SELECT schema_name FROM `nastahem-tracking.INFORMATION_SCHEMA.SCHEMATA` WHERE schema_name LIKE \'analytics_%\'');
      console.error('   2. Update GA4_DATASET_ID in this script if different');
    } else if (error.message.includes('credentials') || error.message.includes('authentication')) {
      console.error('\n💡 Troubleshooting:');
      console.error('   1. Run: gcloud auth application-default login');
      console.error('   2. Or set GOOGLE_APPLICATION_CREDENTIALS environment variable');
      console.error('   3. Verify BigQuery API is enabled');
    } else {
      console.error('\n💡 Troubleshooting:');
      console.error('   1. Verify BigQuery API is enabled');
      console.error('   2. Verify you have BigQuery Admin permissions');
      console.error('   3. Check that datasets exist: flocken_curated, flocken_marts');
      console.error('   4. Verify GA4 data exists in analytics_518338757');
    }
    
    process.exit(1);
  }
}

// Run setup
setupViews().catch(console.error);

