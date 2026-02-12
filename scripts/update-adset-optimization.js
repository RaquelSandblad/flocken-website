// Script för att uppdatera ad set optimization goal
const https = require('https');
const fs = require('fs');
const path = require('path');

// Läs .env.local
let envVars = {};
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const match = trimmed.match(/^([^#=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim().replace(/^["']|["']$/g, '');
        envVars[key] = value;
      }
    }
  });
}

const ACCESS_TOKEN = envVars.META_ACCESS_TOKEN || envVars.META_ADS_API_TOKEN || envVars.META_MARKETING_API_TOKEN;

function makeRequest(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(`https://graph.facebook.com/v21.0${path}`);
    url.searchParams.set('access_token', ACCESS_TOKEN);
    
    const postData = data ? JSON.stringify(data) : null;
    
    const options = {
      method: method,
      headers: { 'Content-Type': 'application/json' },
    };

    const req = https.request(url, options, (res) => {
      let responseData = '';
      res.on('data', chunk => responseData += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          resolve(parsed);
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

async function updateAdSet(adSetId) {
  console.log(`\n📊 Uppdaterar ad set ${adSetId}...`);
  console.log('   Ändrar optimization_goal till LANDING_PAGE_VIEWS\n');
  
  const result = await makeRequest(
    `/${adSetId}`,
    'POST',
    {
      optimization_goal: 'LANDING_PAGE_VIEWS',
    }
  );
  
  if (result.error) {
    console.error('❌ Fel:', result.error.message);
    console.error('   Details:', JSON.stringify(result.error, null, 2));
  } else {
    console.log('✅ Ad set uppdaterad!');
    console.log('   Optimization goal: LANDING_PAGE_VIEWS');
  }
  
  return result;
}

const adSetId = process.argv[2] || '120239834356860455';
updateAdSet(adSetId);
