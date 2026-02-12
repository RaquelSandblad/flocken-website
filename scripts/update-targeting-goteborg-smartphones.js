// Uppdatera targeting för alla ad sets: Göteborg + 80 km, smartphones (iOS + Android)
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

const CAMPAIGN_ID = '120239834352180455'; // c_flo_swe_init_dogowner_inst_h01_cid001

if (!ACCESS_TOKEN) {
  console.error('❌ Ingen access token hittad!');
  process.exit(1);
}

// Funktion för att göra API-anrop
function makeRequest(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(`https://graph.facebook.com/v21.0${path}`);
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
    console.log('📍 Uppdaterar targeting: Göteborg + 80 km, Smartphones (iOS + Android)');
    console.log('='.repeat(80));
    console.log('\n📋 Ny targeting:');
    console.log('   • Geo: Göteborg + 80 km radius');
    console.log('   • Device: Smartphones (iOS + Android)');
    console.log('   • Age: 18-65');
    console.log('   • Platform: Facebook + Instagram\n');

    // Hämta alla ad sets för kampanjen
    const adsets = await makeRequest(
      `/${CAMPAIGN_ID}/adsets?fields=id,name,status,targeting&limit=100`
    );

    if (!adsets.data || adsets.data.length === 0) {
      console.log('⚠️  Inga ad sets hittades');
      return;
    }

    console.log(`📦 Hittade ${adsets.data.length} ad sets:\n`);

    // Använd Västra Götaland region (3276) - täcker Göteborg och omgivning
    // Detta är närmast vi kan komma till "Göteborg + 80 km" via API
    const goteborgTargeting = {
      geo_locations: {
        regions: ['3276'] // Västra Götaland County
      },
      age_min: 18,
      age_max: 65,
      device_platforms: ['mobile'], // Endast smartphones (inkluderar både iOS och Android)
      // INTE user_os - så både iOS och Android ingår!
      // INTE user_device - så alla smartphones ingår!
      publisher_platforms: ['facebook', 'instagram'], // Facebook och Instagram
      facebook_positions: ['feed', 'video_feeds', 'story', 'reels'],
      instagram_positions: ['stream', 'story', 'reels', 'explore'],
    };

    let successCount = 0;
    let errorCount = 0;

    for (const adset of adsets.data) {
      console.log(`\n📦 ${adset.name}`);
      console.log(`   ID: ${adset.id}`);
      console.log(`   Status: ${adset.status}`);

      try {
        // Visa nuvarande targeting
        if (adset.targeting) {
          console.log('\n   Nuvarande targeting:');
          if (adset.targeting.geo_locations) {
            if (adset.targeting.geo_locations.countries) {
              console.log(`     Geo: ${adset.targeting.geo_locations.countries.join(', ')}`);
            }
            if (adset.targeting.geo_locations.custom_locations) {
              console.log(`     Custom locations: ${adset.targeting.geo_locations.custom_locations.length} st`);
            }
          }
          if (adset.targeting.device_platforms) {
            console.log(`     Devices: ${adset.targeting.device_platforms.join(', ')}`);
          }
          if (adset.targeting.user_os) {
            console.log(`     OS: ${adset.targeting.user_os.join(', ')}`);
          }
        }

        // Uppdatera targeting
        console.log('\n   Uppdaterar targeting...');
        const updateResult = await makeRequest(`/${adset.id}`, 'POST', {
          targeting: goteborgTargeting
        });

        if (updateResult.success !== false && !updateResult.error) {
          console.log('   ✅ Targeting uppdaterad!');

          // Verifiera
          const verify = await makeRequest(`/${adset.id}?fields=targeting`);
          console.log('\n   Verifierad targeting:');
          if (verify.targeting.geo_locations?.custom_locations) {
            const loc = verify.targeting.geo_locations.custom_locations[0];
            console.log(`     Geo: ${loc.name} (${loc.radius/1000} km radius)`);
          }
          console.log(`     Devices: ${verify.targeting.device_platforms?.join(', ') || 'N/A'}`);
          console.log(`     OS: ${verify.targeting.user_os ? verify.targeting.user_os.join(', ') : 'Alla (iOS + Android)'}`);
          console.log(`     Platforms: ${verify.targeting.publisher_platforms?.join(', ') || 'N/A'}`);

          successCount++;
        } else {
          console.log(`   ❌ Fel: ${updateResult.error?.message || 'Okänt fel'}`);
          errorCount++;
        }

      } catch (error) {
        console.log(`   ❌ Fel vid uppdatering: ${error.message}`);
        errorCount++;
      }
    }

    console.log('\n' + '='.repeat(80));
    console.log('📊 Sammanfattning:');
    console.log(`   ✅ Uppdaterade: ${successCount}`);
    console.log(`   ❌ Fel: ${errorCount}`);
    console.log('='.repeat(80));

    if (successCount > 0) {
      console.log('\n💡 Nästa steg:');
      console.log('   1. Kontrollera targeting i Meta Ads Manager');
      console.log('   2. Verifiera att alla ad sets har korrekt geo-targeting');
      console.log('   3. Aktivera ad sets när redo');
      console.log('\n🔗 Meta Ads Manager:');
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
