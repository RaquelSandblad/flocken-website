// Kolla och fixa Android-targeting
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

const ADSETS = [
  { id: '120239835157500455', name: 'as_para_swe_opt_lpv_cid001' },
  { id: '120239835158880455', name: 'as_besoka_swe_opt_lpv_cid001' },
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
            if (parsed.error.error_user_msg) console.error('  ', parsed.error.error_user_msg);
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
  console.log('📱 Kollar och fixar Android-targeting');
  console.log('='.repeat(60));
  
  for (const adset of ADSETS) {
    console.log(`\n📦 ${adset.name}:`);
    
    // Hämta nuvarande targeting
    const current = await makeRequest(`/${adset.id}?fields=targeting`);
    console.log('\n   Nuvarande targeting:');
    console.log('   ' + JSON.stringify(current.targeting, null, 2).replace(/\n/g, '\n   '));
    
    // Kolla om user_os är satt
    if (!current.targeting?.user_os || !current.targeting.user_os.includes('Android')) {
      console.log('\n   ⚠️  Android INTE satt! Fixar...');
      
      // Sätt Android-targeting
      const updateResult = await makeRequest(`/${adset.id}`, 'POST', {
        targeting: {
          geo_locations: current.targeting?.geo_locations || { countries: ['SE'] },
          age_min: current.targeting?.age_min || 18,
          age_max: current.targeting?.age_max || 65,
          user_os: ['Android'],
        },
      });
      
      if (updateResult.success !== false && !updateResult.error) {
        console.log('   ✅ Android-targeting satt!');
      } else {
        console.log('   ❌ Kunde inte sätta targeting');
      }
      
      // Verifiera
      const verify = await makeRequest(`/${adset.id}?fields=targeting`);
      console.log('\n   Efter uppdatering:');
      console.log('   user_os:', JSON.stringify(verify.targeting?.user_os));
    } else {
      console.log('\n   ✅ Android redan satt:', current.targeting.user_os);
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('Klart!');
  console.log('='.repeat(60));
}

main();
