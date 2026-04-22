// Aktivera kampanjen
const https = require('https');
const fs = require('fs');
const path = require('path');

let envVars = {};
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const m = trimmed.match(/^([^#=]+)=(.*)$/);
      if (m) envVars[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '');
    }
  });
}

const token = envVars.META_ACCESS_TOKEN || envVars.META_ADS_API_TOKEN || envVars.META_MARKETING_API_TOKEN;

const CAMPAIGN_ID = '120239834352180455';
const ADSETS = [
  '120239835157500455',
  '120239835158880455',
];

function makeRequest(urlPath, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(`https://graph.facebook.com/v24.0${urlPath}`);
    url.searchParams.set('access_token', token);
    const postData = data ? JSON.stringify(data) : null;
    const options = { method, headers: { 'Content-Type': 'application/json' } };
    const req = https.request(url, options, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(d);
          if (parsed.error) {
            console.error('API Error:', parsed.error.message);
          }
          resolve(parsed);
        } catch (e) {
          resolve({ error: d });
        }
      });
    });
    if (postData) req.write(postData);
    req.end();
  });
}

async function main() {
  console.log('='.repeat(60));
  console.log('🚀 Aktiverar Flocken-kampanjen');
  console.log('='.repeat(60));
  
  // 1. Aktivera kampanj
  console.log('\n📢 Aktiverar kampanj...');
  const campResult = await makeRequest(`/${CAMPAIGN_ID}`, 'POST', { status: 'ACTIVE' });
  if (!campResult.error) {
    console.log('   ✅ Kampanj aktiverad!');
  }
  
  // 2. Aktivera ad sets
  console.log('\n📦 Aktiverar ad sets...');
  for (const adsetId of ADSETS) {
    const result = await makeRequest(`/${adsetId}`, 'POST', { status: 'ACTIVE' });
    if (!result.error) {
      console.log(`   ✅ Ad set ${adsetId} aktiverat`);
    }
  }
  
  // 3. Aktivera ads
  console.log('\n🎬 Aktiverar annonser...');
  for (const adsetId of ADSETS) {
    const ads = await makeRequest(`/${adsetId}/ads?fields=id,name`);
    if (ads.data) {
      for (const ad of ads.data) {
        const result = await makeRequest(`/${ad.id}`, 'POST', { status: 'ACTIVE' });
        if (!result.error) {
          console.log(`   ✅ ${ad.name}`);
        }
      }
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('🎉 KAMPANJEN ÄR LIVE!');
  console.log('='.repeat(60));
  console.log(`
📊 Nästa steg - övervaka i Ads Manager:
   https://business.facebook.com/adsmanager/manage/campaigns?act=1648246706340725

💰 Budget: 100 SEK/dag (50 SEK per ad set)
📱 Targeting: Android, Sverige, 18-65
🎯 Optimering: Landing Page Views
  `);
}

main();
