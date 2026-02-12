// Script för att uppdatera ad sets
// - Öka budget till 50 SEK/dag
// - Begränsa till Android-användare

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

// Ad sets att uppdatera
const ADSETS = [
  { id: '120239835157500455', name: 'as_para_swe_opt_lpv_cid001' },
  { id: '120239835158880455', name: 'as_besoka_swe_opt_lpv_cid001' },
];

if (!ACCESS_TOKEN) {
  console.error('❌ Ingen access token hittad!');
  process.exit(1);
}

function makeRequest(urlPath, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(`https://graph.facebook.com/v21.0${urlPath}`);
    url.searchParams.set('access_token', ACCESS_TOKEN);
    const postData = data ? JSON.stringify(data) : null;
    const options = { method, headers: { 'Content-Type': 'application/json' } };

    const req = https.request(url, options, (res) => {
      let responseData = '';
      res.on('data', chunk => responseData += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          if (parsed.error) {
            console.error('API Error:', parsed.error.message);
            if (parsed.error.error_user_msg) {
              console.error('   User msg:', parsed.error.error_user_msg);
            }
          }
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

async function updateAdSet(adsetId, name) {
  console.log(`\n📦 Uppdaterar: ${name}...`);
  
  const result = await makeRequest(`/${adsetId}`, 'POST', {
    daily_budget: 5000, // 50 SEK (i öre)
    targeting: {
      geo_locations: { countries: ['SE'] },
      age_min: 18,
      age_max: 65,
      user_os: ['Android'],
    },
  });
  
  if (result.success !== false && !result.error) {
    console.log('   ✅ Budget: 50 SEK/dag');
    console.log('   ✅ Targeting: Android only');
    return true;
  }
  
  console.error('   ❌ Misslyckades');
  return false;
}

async function main() {
  console.log('='.repeat(60));
  console.log('🐕 Uppdaterar Flocken Ad Sets');
  console.log('='.repeat(60));
  
  for (const adset of ADSETS) {
    await updateAdSet(adset.id, adset.name);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('✅ KLART!');
  console.log('='.repeat(60));
  console.log(`
📋 Uppdateringar:

├── as_para_swe_opt_lpv_cid001
│   ├── Budget: 50 SEK/dag
│   └── Targeting: Android only (Sverige, 18-65)
│
└── as_besoka_swe_opt_lpv_cid001
    ├── Budget: 50 SEK/dag
    └── Targeting: Android only (Sverige, 18-65)

💰 Total budget: 100 SEK/dag

🔗 Meta Ads Manager:
   https://business.facebook.com/adsmanager/manage/campaigns?act=1648246706340725
  `);
}

main().catch(err => {
  console.error('❌ Fel:', err.message);
  process.exit(1);
});
