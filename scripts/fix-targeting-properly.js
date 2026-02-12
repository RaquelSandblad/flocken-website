// Ta bort tom annons och fixa Android-targeting ordentligt
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
  console.log('🔧 Fixar annonser och targeting');
  console.log('='.repeat(60));
  
  // 1. Hitta och ta bort tomma/namnlösa annonser
  console.log('\n🗑️  Letar efter tomma annonser att ta bort...');
  
  for (const adset of ADSETS) {
    const ads = await makeRequest(`/${adset.id}/ads?fields=id,name,status,creative`);
    console.log(`\n📦 ${adset.name}:`);
    
    if (ads.data) {
      for (const ad of ads.data) {
        console.log(`   - ${ad.name || '(INGEN NAMN)'} (${ad.id})`);
        
        // Ta bort annonser utan namn eller med tomma/gamla namn
        if (!ad.name || ad.name === '' || ad.name.includes('gamma')) {
          console.log(`     🗑️  Tar bort denna...`);
          const deleteResult = await makeRequest(`/${ad.id}`, 'DELETE');
          if (deleteResult.success) {
            console.log(`     ✅ Borttagen!`);
          }
        }
      }
    }
  }
  
  // 2. Sätt Android-targeting med device_platforms
  console.log('\n' + '='.repeat(60));
  console.log('📱 Sätter Android-targeting (med device_platforms)...');
  console.log('='.repeat(60));
  
  for (const adset of ADSETS) {
    console.log(`\n📦 ${adset.name}:`);
    
    // Hämta nuvarande targeting
    const current = await makeRequest(`/${adset.id}?fields=targeting`);
    
    // Uppdatera med explicit Android och mobil
    const updateResult = await makeRequest(`/${adset.id}`, 'POST', {
      targeting: {
        geo_locations: { countries: ['SE'] },
        age_min: 18,
        age_max: 65,
        device_platforms: ['mobile'],
        user_os: ['Android'],
        user_device: ['Android_Smartphone', 'Android_Tablet'],
      },
    });
    
    if (updateResult.success !== false && !updateResult.error) {
      console.log('   ✅ Targeting uppdaterad!');
    } else {
      console.log('   ❌ Fel vid uppdatering');
    }
    
    // Verifiera
    const verify = await makeRequest(`/${adset.id}?fields=targeting`);
    console.log('   Verifierar:');
    console.log('     device_platforms:', JSON.stringify(verify.targeting?.device_platforms));
    console.log('     user_os:', JSON.stringify(verify.targeting?.user_os));
    console.log('     user_device:', JSON.stringify(verify.targeting?.user_device));
  }
  
  // 3. Lista kvarvarande annonser
  console.log('\n' + '='.repeat(60));
  console.log('📋 Kvarvarande annonser:');
  console.log('='.repeat(60));
  
  for (const adset of ADSETS) {
    const ads = await makeRequest(`/${adset.id}/ads?fields=id,name,status`);
    console.log(`\n📦 ${adset.name}:`);
    
    if (ads.data && ads.data.length > 0) {
      for (const ad of ads.data) {
        console.log(`   - ${ad.name} (${ad.status})`);
      }
    } else {
      console.log('   (inga annonser)');
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('✅ Klart!');
  console.log('='.repeat(60));
}

main();
