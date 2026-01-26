// Fixa UTM-taggar för CID002 ads
// Uppdaterar utm_campaign och utm_content i alla ads i CID002 kampanjen
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

// CID002 kampanj ID (hitta den automatiskt eller sätt manuellt)
const CAMPAIGN_NAME_PATTERN = 'c_flo_got_init_dogowner_inst_h01_cid002';

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

// Funktion för att uppdatera UTM-taggar i en ad
function updateUTMTags(adName, oldLink) {
  try {
    const url = new URL(oldLink);
    
    // Hämta nuvarande UTM-parametrar
    const currentCampaign = url.searchParams.get('utm_campaign') || '';
    const currentContent = url.searchParams.get('utm_content') || '';
    
    // Uppdatera utm_campaign: ändra cid001 → cid002
    // Behåll strukturen men uppdatera CID
    // Exempel: h01_besoka_cid001 → h01_besoka_cid002
    // Eller: as_para_puppies_swe_opt_lpv_cid001 → h01_cid002 (förenkla)
    let newCampaign = currentCampaign.replace(/cid001/g, 'cid002');
    
    // Om campaign-taggen är ett ad set-namn, förenkla till h01_cid002
    if (newCampaign.includes('as_') || newCampaign.includes('opt_')) {
      newCampaign = 'h01_cid002';
    }
    
    // Om det inte finns någon campaign-tagg, skapa en från ad-namnet
    if (!newCampaign || newCampaign === '') {
      newCampaign = 'h01_cid002';
    }
    
    // Uppdatera utm_content: ta bort format (9x16, 1x1, 4x5), lägg till src_ai, ändra cid001 → cid002
    // Speciell hantering: om det är 1x1-format, ändra v06 → v07 för att skilja dem
    let newContent = currentContent
      .replace(/cid001/g, 'cid002')
      .replace(/_\d+x\d+_/g, '_') // Ta bort format som _9x16_, _1x1_, _4x5_
      .replace(/(_\d+x\d+)$/, '') // Ta bort format i slutet
      .replace(/cid002$/, 'src_ai_cid002'); // Lägg till src_ai före cid002
    
    // Om det inte finns någon content-tagg, skapa en från ad-namnet
    if (!newContent || newContent === currentContent) {
      // Extrahera ad-namnet utan format
      newContent = adName
        .replace(/_\d+x\d+_/g, '_')
        .replace(/(_\d+x\d+)$/, '')
        .replace(/cid001/g, 'cid002');
      
      // Lägg till src_ai om det saknas
      if (!newContent.includes('src_ai')) {
        newContent = newContent.replace(/cid002$/, 'src_ai_cid002');
      }
    }
    
    // Speciell hantering för 1x1-format: ändra v06 → v07 i utm_content
    // Detta för att skilja 1x1 från 9x16 när format tas bort
    if (currentContent.includes('1x1') || adName.includes('1x1')) {
      newContent = newContent.replace(/_v06_/g, '_v07_').replace(/_v06$/g, '_v07');
    }
    
    // Uppdatera URL-parametrar
    url.searchParams.set('utm_campaign', newCampaign);
    url.searchParams.set('utm_content', newContent);
    
    return url.toString();
  } catch (error) {
    console.error(`   ⚠️  Kunde inte uppdatera UTM-taggar: ${error.message}`);
    return oldLink;
  }
}

async function main() {
  try {
    console.log('='.repeat(80));
    console.log('🔧 Fixar UTM-taggar för CID002');
    console.log('='.repeat(80));
    
    // 1. Hitta CID002 kampanjen
    console.log('\n📋 Söker efter kampanj...');
    const campaigns = await makeRequest(`/${AD_ACCOUNT_ID}/campaigns?fields=id,name,status&limit=100`);
    
    const cid002Campaign = campaigns.data.find(c => c.name === CAMPAIGN_NAME_PATTERN);
    
    if (!cid002Campaign) {
      console.error(`❌ Kunde inte hitta kampanj: ${CAMPAIGN_NAME_PATTERN}`);
      console.log('\nTillgängliga kampanjer:');
      campaigns.data.forEach(c => console.log(`   - ${c.name} (${c.id})`));
      process.exit(1);
    }
    
    console.log(`✅ Hittade kampanj: ${cid002Campaign.name} (${cid002Campaign.id})\n`);
    
    // 2. Hämta alla ad sets i kampanjen
    console.log('📦 Hämtar ad sets...');
    const adsets = await makeRequest(`/${cid002Campaign.id}/adsets?fields=id,name&limit=100`);
    console.log(`   Hittade ${adsets.data.length} ad sets\n`);
    
    let totalAds = 0;
    let updatedAds = 0;
    let errorAds = 0;
    
    // 3. Gå igenom varje ad set och uppdatera ads
    for (const adset of adsets.data) {
      console.log(`📦 ${adset.name}`);
      
      // Hämta alla ads i ad set
      const ads = await makeRequest(`/${adset.id}/ads?fields=id,name,creative&limit=100`);
      
      for (const ad of ads.data) {
        totalAds++;
        try {
          // Hämta creative info
          const creative = await makeRequest(`/${ad.creative.id}?fields=object_story_spec,name`);
          
          if (!creative.object_story_spec) {
            console.log(`   ⚠️  ${ad.name}: Ingen object_story_spec`);
            continue;
          }
          
          // Kopiera object_story_spec
          const updatedSpec = JSON.parse(JSON.stringify(creative.object_story_spec));
          let needsUpdate = false;
          
          // Uppdatera UTM i video_data.call_to_action.value.link
          if (updatedSpec.video_data?.call_to_action?.value?.link) {
            const oldLink = updatedSpec.video_data.call_to_action.value.link;
            const newLink = updateUTMTags(ad.name, oldLink);
            
            if (newLink !== oldLink) {
              updatedSpec.video_data.call_to_action.value.link = newLink;
              needsUpdate = true;
              
              console.log(`   📝 ${ad.name}`);
              console.log(`      Gammal: ${oldLink}`);
              console.log(`      Ny:     ${newLink}`);
            }
          }
          
          // Uppdatera om något ändrades
          if (needsUpdate) {
            // Hämta ad status
            const adStatus = await makeRequest(`/${ad.id}?fields=status`);
            const wasActive = adStatus.status === 'ACTIVE';
            
            // Ta bort image_url från spec innan vi skapar ny creative
            if (updatedSpec.video_data?.image_url) {
              delete updatedSpec.video_data.image_url;
            }
            
            // Skapa ny creative med uppdaterad spec
            const newCreative = await makeRequest(`/${AD_ACCOUNT_ID}/adcreatives`, 'POST', {
              name: `${ad.name} Creative (UTM Updated)`,
              object_story_spec: updatedSpec,
            });
            
            if (newCreative.id) {
              // Uppdatera ad-namnet om det är 1x1-format (ändra v06 → v07)
              let newAdName = ad.name;
              if (ad.name.includes('1x1')) {
                newAdName = ad.name.replace(/_v06_/g, '_v07_').replace(/_v06$/g, '_v07').replace(/_1x1_/g, '_').replace(/_1x1$/g, '');
                // Lägg till src_ai om det saknas
                if (!newAdName.includes('src_ai')) {
                  newAdName = newAdName.replace(/cid002$/, 'src_ai_cid002');
                }
              } else {
                // Ta bort format och lägg till src_ai för alla andra
                newAdName = ad.name.replace(/_\d+x\d+_/g, '_').replace(/(_\d+x\d+)$/, '');
                if (!newAdName.includes('src_ai')) {
                  newAdName = newAdName.replace(/cid002$/, 'src_ai_cid002');
                }
              }
              
              // Skapa ny ad med uppdaterad creative och korrigerat namn
              // Meta API tillåter inte att ändra creative på befintlig ad direkt
              const newAd = await makeRequest(`/${AD_ACCOUNT_ID}/ads`, 'POST', {
                name: newAdName,
                adset_id: adset.id,
                creative: { creative_id: newCreative.id },
                status: 'PAUSED', // Behåll pausad, användaren aktiverar manuellt efter verifiering
              });
              
              if (newAd.id) {
                // Ta bort gamla ad:en
                await makeRequest(`/${ad.id}`, 'DELETE');
                
                updatedAds++;
                console.log(`      ✅ Uppdaterad!`);
                console.log(`         Ny ad ID: ${newAd.id}`);
                console.log(`         Status: PAUSED (aktivera manuellt efter verifiering)\n`);
              } else {
                console.log(`      ❌ Kunde inte skapa ny ad: ${JSON.stringify(newAd)}`);
                // Ta bort creative om ad-skapande misslyckades
                try {
                  await makeRequest(`/${newCreative.id}`, 'DELETE');
                } catch (e) {
                  // Ignorera fel vid borttagning av creative
                }
                errorAds++;
              }
            } else {
              console.log(`      ❌ Kunde inte skapa ny creative: ${JSON.stringify(newCreative)}\n`);
              errorAds++;
            }
          } else {
            console.log(`   ✅ ${ad.name}: UTM-taggar är redan korrekta\n`);
          }
          
        } catch (error) {
          console.log(`   ❌ ${ad.name}: ${error.message}\n`);
          errorAds++;
        }
      }
    }
    
    console.log('='.repeat(80));
    console.log('📊 Sammanfattning:');
    console.log(`   Totalt ads: ${totalAds}`);
    console.log(`   ✅ Uppdaterade: ${updatedAds}`);
    console.log(`   ❌ Fel: ${errorAds}`);
    console.log('='.repeat(80));
    
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
