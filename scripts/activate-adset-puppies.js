// Aktivera puppies ad set
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

const token = envVars.META_ACCESS_TOKEN || envVars.META_ADS_API_TOKEN;
const ADSET_ID = '120239866430560455';

function makeRequest(urlPath, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(`https://graph.facebook.com/v21.0${urlPath}`);
    url.searchParams.set('access_token', token);
    const postData = data ? JSON.stringify(data) : null;
    const options = { method, headers: { 'Content-Type': 'application/json' } };
    const req = https.request(url, options, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(d);
          if (parsed.error) console.error('API Error:', parsed.error.message);
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
  console.log('🚀 Aktiverar puppies ad set...\n');
  
  // Aktivera ad set
  const adsetResult = await makeRequest(`/${ADSET_ID}`, 'POST', { status: 'ACTIVE' });
  if (!adsetResult.error) {
    console.log('✅ Ad set aktiverat: as_para_puppies_swe_opt_lpv_cid001');
  }
  
  // Aktivera ads
  const ads = await makeRequest(`/${ADSET_ID}/ads?fields=id,name`);
  if (ads.data) {
    for (const ad of ads.data) {
      const result = await makeRequest(`/${ad.id}`, 'POST', { status: 'ACTIVE' });
      if (!result.error) {
        console.log(`✅ Annons aktiverad: ${ad.name}`);
      }
    }
  }
  
  console.log('\n🎉 Puppies ad set är nu LIVE!');
  console.log('📊 Kolla i Ads Manager: https://business.facebook.com/adsmanager');
}

main();
