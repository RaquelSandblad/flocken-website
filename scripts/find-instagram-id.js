// Hitta rätt Instagram-konto ID
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
      if (m) {
        envVars[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '');
      }
    }
  });
}

const token = envVars.META_ACCESS_TOKEN || envVars.META_ADS_API_TOKEN || envVars.META_MARKETING_API_TOKEN;
const pageId = '936579286197312';
const adAccountId = 'act_1648246706340725';

console.log('Token found:', token ? 'Yes (' + token.substring(0, 20) + '...)' : 'No');

function makeRequest(urlPath) {
  return new Promise((resolve, reject) => {
    const url = new URL(`https://graph.facebook.com/v21.0${urlPath}`);
    url.searchParams.set('access_token', token);
    
    https.get(url.toString(), res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve({ error: data });
        }
      });
    }).on('error', reject);
  });
}

async function main() {
  console.log('\n🔍 Söker efter Instagram-konton...\n');
  
  // 1. Instagram-konton kopplade till Facebook-sidan
  console.log('1. Instagram-konton via Facebook-sidan:');
  const pageIG = await makeRequest(`/${pageId}/instagram_accounts?fields=id,username`);
  console.log(JSON.stringify(pageIG, null, 2));
  
  // 2. Page-backed Instagram account
  console.log('\n2. Page-backed Instagram account:');
  const pageBacked = await makeRequest(`/${pageId}?fields=instagram_business_account`);
  console.log(JSON.stringify(pageBacked, null, 2));
  
  // 3. Instagram-konton via Ad Account
  console.log('\n3. Instagram-konton via Ad Account:');
  const adAccountIG = await makeRequest(`/${adAccountId}/instagram_accounts?fields=id,username`);
  console.log(JSON.stringify(adAccountIG, null, 2));
  
  // 4. Kolla det ID användaren gav
  console.log('\n4. Kontrollerar ID 17841479914513348:');
  const userIG = await makeRequest(`/17841479914513348?fields=id,username`);
  console.log(JSON.stringify(userIG, null, 2));
}

main();
