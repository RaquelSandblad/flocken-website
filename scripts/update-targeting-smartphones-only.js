// Steg 1: Ta bort Android-begränsning, behåll Sverige (testa först)
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

const CAMPAIGN_ID = '120239834352180455';

if (!ACCESS_TOKEN) {
  console.error('❌ Ingen access token hittad!');
  process.exit(1);
}

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
    console.log('📱 Steg 1: Ta bort Android-begränsning, behåll Sverige');
    console.log('='.repeat(80));
    console.log('\n📋 Ny targeting:');
    console.log('   • Geo: Sverige (behålls)');
    console.log('   • Device: Smartphones (iOS + Android)');
    console.log('   • Age: 18-65\n');

    const adsets = await makeRequest(
      `/${CAMPAIGN_ID}/adsets?fields=id,name,status,targeting&limit=100`
    );

    if (!adsets.data || adsets.data.length === 0) {
      console.log('⚠️  Inga ad sets hittades');
      return;
    }

    console.log(`📦 Hittade ${adsets.data.length} ad sets:\n`);

    // Enklare targeting - bara ta bort user_os och user_device
    const newTargeting = {
      geo_locations: { countries: ['SE'] },
      age_min: 18,
      age_max: 65,
      device_platforms: ['mobile'], // Smartphones (både iOS och Android)
      // INTE user_os - så både iOS och Android ingår!
      // INTE user_device - så alla smartphones ingår!
    };

    let successCount = 0;
    let errorCount = 0;

    for (const adset of adsets.data) {
      console.log(`\n📦 ${adset.name}`);
      console.log(`   ID: ${adset.id}`);

      try {
        console.log('   Uppdaterar targeting...');
        const updateResult = await makeRequest(`/${adset.id}`, 'POST', {
          targeting: newTargeting
        });

        if (updateResult.success !== false && !updateResult.error) {
          console.log('   ✅ Targeting uppdaterad!');
          successCount++;
        } else {
          console.log(`   ❌ Fel: ${updateResult.error?.message || JSON.stringify(updateResult)}`);
          errorCount++;
        }

      } catch (error) {
        console.log(`   ❌ Fel: ${error.message}`);
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
      console.log('   Kör update-targeting-goteborg-smartphones.js för att uppdatera geo-targeting\n');
    }

  } catch (error) {
    console.error('\n❌ FEL:');
    console.error(`   ${error.message}\n`);
    process.exit(1);
  }
}

main().catch(err => {
  console.error('❌ Oväntat fel:', err);
  process.exit(1);
});
