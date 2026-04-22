// Debug creative structure för att se vad som orsakar problemet
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

// Test ad ID från CID002
const TEST_AD_ID = '120240082173100455'; // Ersätt med ett riktigt ad ID

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
          reject(new Error(`Parse error: ${e.message}`));
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
    // Hitta CID002 kampanjen
    const campaigns = await makeRequest(`/${AD_ACCOUNT_ID}/campaigns?fields=id,name&limit=100`);
    const cid002Campaign = campaigns.data.find(c => c.name.includes('cid002'));
    
    if (!cid002Campaign) {
      console.error('❌ Kunde inte hitta CID002 kampanj');
      process.exit(1);
    }
    
    console.log(`✅ Hittade kampanj: ${cid002Campaign.name} (${cid002Campaign.id})\n`);
    
    // Hämta första ad set
    const adsets = await makeRequest(`/${cid002Campaign.id}/adsets?fields=id,name&limit=1`);
    if (adsets.data.length === 0) {
      console.error('❌ Inga ad sets hittades');
      process.exit(1);
    }
    
    const adset = adsets.data[0];
    console.log(`📦 Ad Set: ${adset.name} (${adset.id})\n`);
    
    // Hämta första ad
    const ads = await makeRequest(`/${adset.id}/ads?fields=id,name,creative&limit=1`);
    if (ads.data.length === 0) {
      console.error('❌ Inga ads hittades');
      process.exit(1);
    }
    
    const ad = ads.data[0];
    console.log(`📢 Ad: ${ad.name} (${ad.id})\n`);
    
    // Hämta creative
    const creative = await makeRequest(`/${ad.creative.id}?fields=object_story_spec,name`);
    
    console.log('='.repeat(80));
    console.log('Creative Structure:');
    console.log('='.repeat(80));
    console.log(JSON.stringify(creative.object_story_spec, null, 2));
    console.log('='.repeat(80));
    
    // Testa att skapa en ny creative med uppdaterad UTM
    const updatedSpec = JSON.parse(JSON.stringify(creative.object_story_spec));
    
    if (updatedSpec.video_data?.call_to_action?.value?.link) {
      const oldLink = updatedSpec.video_data.call_to_action.value.link;
      const url = new URL(oldLink);
      url.searchParams.set('utm_campaign', 'h01_cid002');
      url.searchParams.set('utm_content', ad.name.replace(/_\d+x\d+_/g, '_').replace(/cid001/g, 'cid002'));
      updatedSpec.video_data.call_to_action.value.link = url.toString();
      
      console.log('\n📝 Uppdaterad Link:');
      console.log(`   Gammal: ${oldLink}`);
      console.log(`   Ny:     ${updatedSpec.video_data.call_to_action.value.link}\n`);
      
      // Ta bort image_url om det finns
      if (updatedSpec.video_data?.image_url) {
        console.log('⚠️  Tar bort image_url från spec...');
        delete updatedSpec.video_data.image_url;
      }
      
      console.log('\n🧪 Försöker skapa ny creative...');
      try {
        const newCreative = await makeRequest(`/${AD_ACCOUNT_ID}/adcreatives`, 'POST', {
          name: `${creative.name} (Test UTM Update)`,
          object_story_spec: updatedSpec,
        });
        
        console.log('✅ Creative skapad!');
        console.log(`   ID: ${newCreative.id}`);
        console.log(`   Namn: ${newCreative.name}`);
        
        // Ta bort test-creative direkt
        console.log('\n🗑️  Tar bort test-creative...');
        await makeRequest(`/${newCreative.id}`, 'DELETE');
        console.log('✅ Test-creative borttagen');
        
      } catch (error) {
        console.error('❌ Fel vid skapande av creative:');
        console.error(`   ${error.message}`);
        console.error('\nSpec som skickades:');
        console.log(JSON.stringify(updatedSpec, null, 2));
      }
    }
    
  } catch (error) {
    console.error('\n❌ FEL:');
    console.error(`   ${error.message}\n`);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

main().catch(err => {
  console.error('❌ Oväntat fel:', err);
  process.exit(1);
});
