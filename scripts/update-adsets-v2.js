// Script för att uppdatera ad sets
// - Budget 50 SEK/dag
// - Android only targeting
// - Lägg till Instagram-konto

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
const AD_ACCOUNT_ID = 'act_1648246706340725';
const PAGE_ID = '936579286197312';
const INSTAGRAM_ACCOUNT_ID = '17841479914513348'; // @flocken_app

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
    const url = new URL(`https://graph.facebook.com/v24.0${urlPath}`);
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
            if (parsed.error.error_data) {
              console.error('   Error data:', JSON.stringify(parsed.error.error_data));
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

// Hämta nuvarande targeting för debug
async function getAdSetTargeting(adsetId) {
  const result = await makeRequest(`/${adsetId}?fields=targeting,daily_budget`);
  return result;
}

// Uppdatera ad set targeting
async function updateAdSetTargeting(adsetId, name) {
  console.log(`\n📦 Uppdaterar targeting: ${name}...`);
  
  // Targeting med Android och placeringar som stödjer det
  const targetingData = {
    geo_locations: { 
      countries: ['SE'] 
    },
    age_min: 18,
    age_max: 65,
    user_os: ['Android'],
    publisher_platforms: ['facebook', 'instagram', 'audience_network'],
    facebook_positions: ['feed', 'video_feeds', 'story', 'reels'],
    instagram_positions: ['stream', 'story', 'reels', 'explore'],
  };
  
  const result = await makeRequest(`/${adsetId}`, 'POST', {
    daily_budget: 5000,
    targeting: targetingData,
  });
  
  if (result.success !== false && !result.error) {
    console.log('   ✅ Budget: 50 SEK/dag');
    console.log('   ✅ Targeting: Android only, Sverige, 18-65');
    return true;
  }
  
  console.error('   ❌ Targeting-uppdatering misslyckades');
  return false;
}

// Hämta alla ads och deras creatives
async function getAdsWithCreatives(adsetId) {
  const result = await makeRequest(`/${adsetId}/ads?fields=id,name,creative{id}`);
  return result.data || [];
}

// Uppdatera creative med Instagram-konto
async function updateCreativeWithInstagram(creativeId, adName) {
  console.log(`   Uppdaterar creative för: ${adName}...`);
  
  // Hämta befintlig creative
  const creative = await makeRequest(`/${creativeId}?fields=object_story_spec`);
  
  if (!creative.object_story_spec) {
    console.log('      ⚠️  Kunde inte läsa object_story_spec');
    return false;
  }
  
  // Lägg till instagram_actor_id
  const updatedSpec = {
    ...creative.object_story_spec,
    instagram_actor_id: INSTAGRAM_ACCOUNT_ID,
  };
  
  // Skapa ny creative med Instagram
  const newCreative = await makeRequest(`/${AD_ACCOUNT_ID}/adcreatives`, 'POST', {
    name: `${adName} Creative (IG)`,
    object_story_spec: updatedSpec,
  });
  
  if (newCreative.id) {
    console.log(`      ✅ Ny creative: ${newCreative.id}`);
    return newCreative.id;
  }
  
  console.log('      ❌ Misslyckades');
  return null;
}

// Uppdatera ad med ny creative
async function updateAdCreative(adId, newCreativeId) {
  const result = await makeRequest(`/${adId}`, 'POST', {
    creative: { creative_id: newCreativeId },
  });
  return result.success !== false && !result.error;
}

async function main() {
  console.log('='.repeat(70));
  console.log('🐕 Flocken - Uppdaterar Ad Sets & Instagram');
  console.log('='.repeat(70));
  
  // 1. Visa nuvarande targeting (debug)
  console.log('\n📊 Nuvarande inställningar:');
  for (const adset of ADSETS) {
    const current = await getAdSetTargeting(adset.id);
    console.log(`   ${adset.name}:`);
    console.log(`      Budget: ${current.daily_budget / 100} SEK`);
    console.log(`      user_os: ${JSON.stringify(current.targeting?.user_os || 'ej satt')}`);
  }
  
  // 2. Uppdatera targeting
  console.log('\n' + '='.repeat(70));
  console.log('📱 Uppdaterar targeting till Android only...');
  console.log('='.repeat(70));
  
  for (const adset of ADSETS) {
    await updateAdSetTargeting(adset.id, adset.name);
  }
  
  // 3. Verifiera targeting
  console.log('\n📊 Verifierar targeting:');
  for (const adset of ADSETS) {
    const updated = await getAdSetTargeting(adset.id);
    console.log(`   ${adset.name}:`);
    console.log(`      user_os: ${JSON.stringify(updated.targeting?.user_os || 'ej satt')}`);
  }
  
  // 4. Uppdatera creatives med Instagram-konto
  console.log('\n' + '='.repeat(70));
  console.log('📸 Lägger till Instagram-konto (@flocken_app)...');
  console.log('='.repeat(70));
  
  for (const adset of ADSETS) {
    console.log(`\n📦 ${adset.name}:`);
    const ads = await getAdsWithCreatives(adset.id);
    
    for (const ad of ads) {
      if (ad.creative?.id) {
        const newCreativeId = await updateCreativeWithInstagram(ad.creative.id, ad.name);
        if (newCreativeId) {
          const success = await updateAdCreative(ad.id, newCreativeId);
          if (success) {
            console.log(`      ✅ Ad uppdaterad med Instagram`);
          }
        }
      }
    }
  }
  
  console.log('\n' + '='.repeat(70));
  console.log('✅ KLART!');
  console.log('='.repeat(70));
  console.log(`
📋 Uppdateringar:

├── Targeting: Android only (Sverige, 18-65)
├── Budget: 50 SEK/dag per ad set
└── Instagram: @flocken_app (${INSTAGRAM_ACCOUNT_ID})

💰 Total budget: 100 SEK/dag

🔗 Meta Ads Manager:
   https://business.facebook.com/adsmanager/manage/campaigns?act=1648246706340725
  `);
}

main().catch(err => {
  console.error('❌ Fel:', err.message);
  process.exit(1);
});
