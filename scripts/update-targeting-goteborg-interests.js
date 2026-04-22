// Uppdatera targeting för CID002: Göteborg + smartphones + hundintressen
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

const NEW_CAMPAIGN_ID = '120240081009290455'; // c_flo_swe_init_dogowner_inst_h01_cid002

// Hundintressen från sökning
const DOG_INTERESTS = [
  '6003332344237', // Hundar (djur)
  '6004037726009', // Husdjur (djur)
  '6003545396227', // Hundträning (husdjur)
  '6002934241659', // Hundras (hundar)
];

if (!ACCESS_TOKEN) {
  console.error('❌ Ingen access token hittad!');
  process.exit(1);
}

function makeRequest(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(`https://graph.facebook.com/v24.0${path}`);
    url.searchParams.set('access_token', ACCESS_TOKEN);
    
    const postData = data ? JSON.stringify(data) : null;
    
    const options = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = https.request(url, options, (res) => {
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
          reject(new Error(`Parse error: ${e.message}\nResponse: ${responseData.substring(0, 500)}`));
        }
      });
    });

    req.on('error', reject);
    
    if (postData) {
      req.write(postData);
    }
    
    req.end();
  });
}

async function main() {
  try {
    console.log('='.repeat(80));
    console.log('📍 Uppdaterar targeting: Göteborg + Smartphones + Hundintressen');
    console.log('='.repeat(80));
    console.log('\n📋 Ny targeting:');
    console.log('   • Geo: Göteborg (försöker via API, annars manuellt)');
    console.log('   • Device: Smartphones (iOS + Android)');
    console.log('   • Age: 18-65');
    console.log('   • Interests: Hundar, Husdjur, Hundträning, Hundras');
    console.log('   • Platform: Facebook + Instagram\n');

    // Hämta alla ad sets för nya kampanjen
    const adsets = await makeRequest(
      `/${NEW_CAMPAIGN_ID}/adsets?fields=id,name,status,targeting&limit=100`
    );

    if (!adsets.data || adsets.data.length === 0) {
      console.log('⚠️  Inga ad sets hittades');
      return;
    }

    console.log(`📦 Hittade ${adsets.data.length} ad sets:\n`);

    // Försök hitta Göteborg city ID
    console.log('🔍 Söker efter Göteborg city ID...');
    let goteborgCityId = null;
    try {
      const citySearch = await makeRequest(
        `/search?type=adgeolocation&q=Göteborg&location_types=['city']&limit=20`
      );
      const goteborg = citySearch.data.find(c => 
        (c.name === 'Göteborg' || c.name === 'Gothenburg') && 
        c.country_code === 'SE' && 
        c.type === 'city'
      );
      if (goteborg) {
        goteborgCityId = goteborg.key;
        console.log(`   ✅ Hittade: ${goteborg.name} (ID: ${goteborgCityId})\n`);
      } else {
        console.log('   ⚠️  Kunde inte hitta Göteborg city ID');
        console.log('   → Uppdatera geo-targeting manuellt till Göteborg + 80 km\n');
      }
    } catch (error) {
      console.log(`   ⚠️  Kunde inte söka: ${error.message}\n`);
    }

    // Targeting med intressen och geo
    // Meta API kräver att vi behåller countries när vi lägger till cities
    const newTargeting = {
      geo_locations: goteborgCityId 
        ? { 
            countries: ['SE'], // Måste finnas kvar
            cities: [goteborgCityId] // Lägg till Göteborg
          }
        : { countries: ['SE'] }, // Annars behåll Sverige (uppdatera manuellt)
      age_min: 18,
      age_max: 65,
      device_platforms: ['mobile'], // Smartphones (iOS + Android)
      interests: DOG_INTERESTS.map(id => ({ id: id })), // Hundintressen som objekt med id
      // INTE user_os - så både iOS och Android ingår!
    };

    let successCount = 0;
    let errorCount = 0;

    for (const adset of adsets.data) {
      console.log(`📦 ${adset.name}`);
      console.log(`   ID: ${adset.id}`);
      console.log(`   Status: ${adset.status}`);

      try {
        // Visa nuvarande targeting
        if (adset.targeting) {
          console.log('\n   Nuvarande targeting:');
          if (adset.targeting.geo_locations?.countries) {
            console.log(`     Geo: ${adset.targeting.geo_locations.countries.join(', ')}`);
          }
          if (adset.targeting.interests) {
            console.log(`     Interests: ${adset.targeting.interests.length} st`);
          }
        }

        // Uppdatera targeting
        console.log('\n   Uppdaterar targeting...');
        const updateResult = await makeRequest(`/${adset.id}`, 'POST', {
          targeting: newTargeting
        });

        if (updateResult.success !== false && !updateResult.error) {
          console.log('   ✅ Targeting uppdaterad!');

          // Verifiera
          const verify = await makeRequest(`/${adset.id}?fields=targeting`);
          console.log('\n   Verifierad targeting:');
          if (verify.targeting.geo_locations?.cities) {
            console.log(`     Geo: Göteborg (city ID: ${verify.targeting.geo_locations.cities[0]})`);
          } else if (verify.targeting.geo_locations?.countries) {
            console.log(`     Geo: ${verify.targeting.geo_locations.countries.join(', ')} (uppdatera manuellt till Göteborg)`);
          }
          if (verify.targeting.interests) {
            console.log(`     Interests: ${verify.targeting.interests.length} st`);
            // Interests kan vara array av IDs eller objekt
            const interestIds = verify.targeting.interests.map(i => typeof i === 'object' ? i.id : i);
            interestIds.forEach(id => {
              console.log(`       - Interest ID: ${id}`);
            });
          }
          console.log(`     Devices: ${verify.targeting.device_platforms?.join(', ') || 'N/A'}`);
          console.log(`     OS: ${verify.targeting.user_os ? verify.targeting.user_os.join(', ') : 'Alla (iOS + Android)'}`);

          successCount++;
        } else {
          console.log(`   ❌ Fel: ${updateResult.error?.message || 'Okänt fel'}`);
          console.log(`   Response: ${JSON.stringify(updateResult).substring(0, 200)}`);
          errorCount++;
        }

      } catch (error) {
        console.log(`   ❌ Fel vid uppdatering: ${error.message}`);
        errorCount++;
      }
      console.log('');
    }

    console.log('='.repeat(80));
    console.log('📊 Sammanfattning:');
    console.log(`   ✅ Uppdaterade: ${successCount}`);
    console.log(`   ❌ Fel: ${errorCount}`);
    console.log('='.repeat(80));

    if (successCount > 0) {
      console.log('\n💡 Nästa steg:');
      if (!goteborgCityId) {
        console.log('   ⚠️  Geo-targeting är fortfarande Sverige');
        console.log('   → Uppdatera manuellt till Göteborg + 80 km i Ads Manager');
      }
      console.log('   1. Kontrollera targeting i Meta Ads Manager');
      console.log('   2. Verifiera att intressen är korrekta');
      console.log('   3. Om geo är Sverige, uppdatera till Göteborg + 80 km');
      console.log('   4. Aktivera kampanj när redo\n');
      console.log('🔗 Meta Ads Manager:');
      console.log(`   https://business.facebook.com/adsmanager/manage/campaigns?act=${AD_ACCOUNT_ID.replace('act_', '')}\n`);
    }

  } catch (error) {
    console.error('\n❌ FEL:');
    console.error(`   ${error.message}\n`);
    console.error(error.stack);
    process.exit(1);
  }
}

main().catch(err => {
  console.error('❌ Oväntat fel:', err);
  process.exit(1);
});
