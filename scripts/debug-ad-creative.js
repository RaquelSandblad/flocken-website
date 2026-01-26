// Debug: Hämta creative info från en ad
const https = require('https');
const fs = require('fs');
const path = require('path');

// Läs .env.local direkt
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

const ACCESS_TOKEN = 
  process.env.META_ACCESS_TOKEN || 
  process.env.META_ADS_API_TOKEN ||
  process.env.META_MARKETING_API_TOKEN ||
  envVars.META_ACCESS_TOKEN || 
  envVars.META_ADS_API_TOKEN ||
  envVars.META_MARKETING_API_TOKEN;

const AD_ACCOUNT_ID = 
  process.env.META_AD_ACCOUNT_ID ||
  envVars.META_AD_ACCOUNT_ID ||
  'act_1648246706340725';

if (!ACCESS_TOKEN) {
  console.error('❌ Ingen access token hittad!');
  process.exit(1);
}

function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const url = new URL(`https://graph.facebook.com/v21.0${path}`);
    url.searchParams.set('access_token', ACCESS_TOKEN);
    
    const req = https.request(url, (res) => {
      let responseData = '';
      res.on('data', chunk => responseData += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          if (parsed.error) {
            reject(new Error(`Meta API Error: ${parsed.error.message} (Code: ${parsed.error.code})`));
          } else {
            resolve(parsed);
          }
        } catch (e) {
          reject(new Error(`Parse error: ${e.message}`));
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

async function debugAd(adId) {
  try {
    console.log(`🔍 Debug: Ad ${adId}\n`);
    
    // Hämta ad info
    const ad = await makeRequest(`/${adId}?fields=id,name,creative`);
    console.log('Ad:');
    console.log(JSON.stringify(ad, null, 2));
    
    // Hämta creative med alla fält
    const creative = await makeRequest(`/${ad.creative.id}?fields=id,name,object_story_spec,object_story_id`);
    console.log('\nCreative:');
    console.log(JSON.stringify(creative, null, 2));
    
  } catch (error) {
    console.error('\n❌ FEL:');
    console.error(`   ${error.message}\n`);
  }
}

// Testa med en av de bästa ads
const testAdId = process.argv[2] || '120239866455310455'; // ad_h01a_cb002_v06_9x16_hk_para_puppies_cid001
debugAd(testAdId);
