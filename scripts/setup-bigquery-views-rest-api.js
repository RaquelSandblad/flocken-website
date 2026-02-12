/**
 * BigQuery Views Setup via REST API
 * This approach uses REST API directly which handles cross-location queries better
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const PROJECT_ID = 'nastahem-tracking';
const GA4_DATASET_ID = 'analytics_518338757';

// Get service account key
const scriptsDir = __dirname;
const keyFiles = fs.readdirSync(scriptsDir)
  .filter(file => file.endsWith('-key.json') || file.endsWith('-credentials.json') || file.includes('service-account'))
  .map(file => path.join(scriptsDir, file))
  .filter(file => fs.existsSync(file));

const keyFile = keyFiles[0] || process.env.GOOGLE_APPLICATION_CREDENTIALS;
if (!keyFile || !fs.existsSync(keyFile)) {
  console.error('❌ Service account key file not found');
  process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(keyFile, 'utf8'));

// Get access token
async function getAccessToken() {
  const jwt = require('jsonwebtoken');
  
  const now = Math.floor(Date.now() / 1000);
  const token = jwt.sign(
    {
      iss: serviceAccount.client_email,
      scope: 'https://www.googleapis.com/auth/bigquery',
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now,
    },
    serviceAccount.private_key,
    { algorithm: 'RS256' }
  );

  return new Promise((resolve, reject) => {
    const postData = `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${token}`;
    const options = {
      hostname: 'oauth2.googleapis.com',
      path: '/token',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': postData.length,
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          resolve(response.access_token);
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

// Run query via REST API
async function runQueryViaREST(query, accessToken) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      query: query,
      useLegacySql: false,
      // Don't specify location - let BigQuery auto-detect
    });

    const options = {
      hostname: 'bigquery.googleapis.com',
      path: `/bigquery/v2/projects/${PROJECT_ID}/queries`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Content-Length': postData.length,
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (response.error) {
            reject(new Error(response.error.message));
          } else {
            resolve(response);
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function setupViews() {
  console.log('🚀 Starting BigQuery Views Setup via REST API...');
  console.log(`📊 Project: ${PROJECT_ID}`);
  console.log(`📦 GA4 Dataset: ${GA4_DATASET_ID}\n`);

  try {
    // Get access token
    console.log('🔑 Getting access token...');
    const accessToken = await getAccessToken();
    console.log('   ✅ Access token obtained\n');

    // Read SQL file
    const sqlPath = path.join(__dirname, 'setup-bigquery-views-flocken.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');

    // Split into statements
    const statements = sqlContent
      .split(/;\s*\n/)
      .map(s => s.trim())
      .filter(s => {
        const cleaned = s.replace(/--.*$/gm, '').trim();
        return cleaned.length > 10;
      });

    console.log(`📄 Found ${statements.length} SQL statements to execute\n`);

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      const commentMatch = statement.match(/--\s*(.+)/);
      const description = commentMatch ? commentMatch[1].trim() : `Statement ${i + 1}`;

      console.log(`\n🔍 Running: ${description}...`);
      
      try {
        const result = await runQueryViaREST(statement, accessToken);
        console.log(`   ✅ Completed: ${description}`);
        if (result.jobReference) {
          console.log(`   ⏳ Job ID: ${result.jobReference.jobId}`);
        }
      } catch (error) {
        if (error.message.includes('already exists') || error.message.includes('Already Exists')) {
          console.log(`   ⚠️  Skipping (already exists)`);
          continue;
        }
        throw error;
      }
    }

    console.log('\n✅ BigQuery Views Setup completed successfully!');
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

setupViews();

