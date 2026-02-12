// Duplicera kampanj med nya förutsättningar: Göteborg + smartphones, bästa ad sets och ads
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

const OLD_CAMPAIGN_ID = '120239834352180455'; // c_flo_swe_init_dogowner_inst_h01_cid001

// Bästa ad sets baserat på analys
const BEST_ADSETS = [
  {
    oldId: '120239866430560455', // as_para_puppies_swe_opt_lpv_cid001
    name: 'as_para_puppies_swe_opt_lpv_cid002', // Nytt CID
    dailyBudget: 5000, // 50 SEK
    bestAds: [
      '120239866455310455', // ad_h01a_cb002_v06_9x16_hk_para_puppies_cid001 (4.41% CTR, 43 clicks)
      '120239866476520455', // ad_h01a_cb002_v06_1x1_hk_para_puppies_cid001 (5.43% CTR, 36 clicks)
    ]
  },
  {
    oldId: '120239835158880455', // as_besoka_swe_opt_lpv_cid001
    name: 'as_besoka_swe_opt_lpv_cid002', // Nytt CID
    dailyBudget: 5000, // 50 SEK
    bestAds: [
      '120239855456700455', // ad_h01a_cb005_v01_9x16_hk_besoka_cid001 (4.40% CTR, 66 clicks)
      '120239855474260455', // ad_h01a_cb005_v02_9x16_hk_besoka_cid001 (3.95% CTR, 21 clicks)
    ]
  }
];

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
    console.log('🔄 Duplicerar kampanj med nya förutsättningar');
    console.log('='.repeat(80));
    console.log('\n📋 Plan:');
    console.log('   1. Pausa nuvarande kampanj');
    console.log('   2. Skapa ny kampanj (cid002)');
    console.log('   3. Skapa 2 bästa ad sets med Göteborg + smartphones targeting');
    console.log('   4. Kopiera 2 bästa ads från varje ad set');
    console.log('\n🎯 Ny targeting:');
    console.log('   • Geo: Göteborg + 80 km (manuellt i Ads Manager)');
    console.log('   • Device: Smartphones (iOS + Android)');
    console.log('   • Age: 18-65');
    console.log('   • Platform: Facebook + Instagram\n');

    // 1. Pausa nuvarande kampanj
    console.log('1️⃣  Pausar nuvarande kampanj...');
    try {
      await makeRequest(`/${OLD_CAMPAIGN_ID}`, 'POST', { status: 'PAUSED' });
      console.log('   ✅ Kampanj pausad\n');
    } catch (error) {
      console.log(`   ⚠️  Kunde inte pausa: ${error.message}\n`);
    }

    // 2. Hämta info om nuvarande kampanj för att kopiera inställningar
    console.log('2️⃣  Hämtar info om nuvarande kampanj...');
    const oldCampaign = await makeRequest(`/${OLD_CAMPAIGN_ID}?fields=name,objective,status`);
    console.log(`   Kampanj: ${oldCampaign.name}`);
    console.log(`   Objective: ${oldCampaign.objective}\n`);

    // 3. Skapa ny kampanj
    console.log('3️⃣  Skapar ny kampanj...');
    const newCampaignName = oldCampaign.name.replace('cid001', 'cid002');
    const newCampaign = await makeRequest(`/${AD_ACCOUNT_ID}/campaigns`, 'POST', {
      name: newCampaignName,
      objective: oldCampaign.objective,
      status: 'PAUSED', // Pausad tills targeting är uppdaterad
      is_adset_budget_sharing_enabled: false,
      special_ad_categories: [], // Ingen special ad category
    });
    console.log(`   ✅ Ny kampanj skapad: ${newCampaign.id}`);
    console.log(`   Namn: ${newCampaignName}\n`);

    const NEW_CAMPAIGN_ID = newCampaign.id;

    // 4. Skapa nya ad sets med korrekt targeting
    console.log('4️⃣  Skapar nya ad sets med korrekt targeting...\n');
    
    const newAdsets = [];
    
    for (const adsetConfig of BEST_ADSETS) {
      console.log(`📦 ${adsetConfig.name}`);
      
      // Hämta info om gamla ad set för att kopiera inställningar
      const oldAdset = await makeRequest(`/${adsetConfig.oldId}?fields=optimization_goal,billing_event,bid_strategy`);
      
      // Skapa nytt ad set med Göteborg + smartphones targeting
      // Förenklad targeting först - positions kan läggas till senare
      const newAdset = await makeRequest(`/${AD_ACCOUNT_ID}/adsets`, 'POST', {
        name: adsetConfig.name,
        campaign_id: NEW_CAMPAIGN_ID,
        status: 'PAUSED', // Pausad tills targeting är uppdaterad manuellt
        daily_budget: adsetConfig.dailyBudget,
        optimization_goal: oldAdset.optimization_goal || 'LANDING_PAGE_VIEWS',
        billing_event: oldAdset.billing_event || 'IMPRESSIONS',
        bid_strategy: oldAdset.bid_strategy || 'LOWEST_COST_WITHOUT_CAP',
        targeting: {
          geo_locations: { countries: ['SE'] }, // Temporärt - uppdatera manuellt till Göteborg
          age_min: 18,
          age_max: 65,
          device_platforms: ['mobile'], // Smartphones (iOS + Android)
          // INTE user_os - så både iOS och Android ingår!
        },
      });
      
      console.log(`   ✅ Ad set skapad: ${newAdset.id}`);
      console.log(`   Budget: ${(adsetConfig.dailyBudget / 100).toFixed(2)} SEK/dag\n`);
      
      newAdsets.push({
        newId: newAdset.id,
        name: adsetConfig.name,
        bestAds: adsetConfig.bestAds,
      });
    }

    // 5. Kopiera bästa ads
    console.log('5️⃣  Kopierar bästa ads från varje ad set...\n');
    
    for (const newAdset of newAdsets) {
      console.log(`📦 ${newAdset.name}`);
      
      for (const oldAdId of newAdset.bestAds) {
        try {
          // Hämta info om gammal ad
          const oldAd = await makeRequest(`/${oldAdId}?fields=name,creative`);
          
          // Hämta creative info med object_story_spec
          const creative = await makeRequest(`/${oldAd.creative.id}?fields=object_story_spec,name`);
          
          // Kopiera object_story_spec och uppdatera UTM-parametrar
          const newObjectStorySpec = JSON.parse(JSON.stringify(creative.object_story_spec));
          
          // Ta bort image_url - Meta kan ha problem med att kopiera den direkt
          // image_hash räcker för att identifiera bilden
          if (newObjectStorySpec.video_data?.image_url) {
            delete newObjectStorySpec.video_data.image_url;
          }
          
          // Uppdatera UTM-parametrar i link om det finns
          if (newObjectStorySpec.video_data?.call_to_action?.value?.link) {
            const oldLink = newObjectStorySpec.video_data.call_to_action.value.link;
            const url = new URL(oldLink);
            url.searchParams.set('utm_campaign', url.searchParams.get('utm_campaign')?.replace('cid001', 'cid002') || 'h01_cid002');
            url.searchParams.set('utm_content', url.searchParams.get('utm_content')?.replace('cid001', 'cid002') || '');
            newObjectStorySpec.video_data.call_to_action.value.link = url.toString();
          }
          
          // Skapa ny creative med uppdaterad spec
          const newCreativeName = `${creative.name.replace('cid001', 'cid002').split(' ')[0]} Creative`;
          const newCreative = await makeRequest(`/${AD_ACCOUNT_ID}/adcreatives`, 'POST', {
            name: newCreativeName,
            object_story_spec: newObjectStorySpec,
          });
          
          if (!newCreative.id) {
            throw new Error(`Kunde inte skapa creative: ${JSON.stringify(newCreative)}`);
          }
          
          // Skapa ny ad med ny creative
          const newAdName = oldAd.name.replace('cid001', 'cid002');
          const newAd = await makeRequest(`/${AD_ACCOUNT_ID}/ads`, 'POST', {
            name: newAdName,
            adset_id: newAdset.newId,
            status: 'PAUSED', // Pausad tills kampanj är redo
            creative: { creative_id: newCreative.id },
          });
          
          console.log(`   ✅ ${newAdName} (${newAd.id})`);
          
        } catch (error) {
          console.log(`   ⚠️  Kunde inte kopiera ad ${oldAdId}: ${error.message}`);
          // Visa mer detaljer om felet
          if (error.message.includes('Invalid parameter')) {
            console.log(`      (Kontrollera creative-struktur)`);
          }
        }
      }
      console.log('');
    }

    console.log('='.repeat(80));
    console.log('✅ Duplicering klar!\n');
    console.log('📋 Nästa steg:');
    console.log('   1. Öppna Meta Ads Manager');
    console.log('   2. Gå till varje ad set i den nya kampanjen');
    console.log('   3. Uppdatera geo-targeting till Göteborg + 80 km');
    console.log('   4. Verifiera att targeting är korrekt');
    console.log('   5. Aktivera kampanj när redo\n');
    console.log('🔗 Meta Ads Manager:');
    console.log(`   https://business.facebook.com/adsmanager/manage/campaigns?act=${AD_ACCOUNT_ID.replace('act_', '')}\n`);
    console.log('📊 Ny kampanj ID:');
    console.log(`   ${NEW_CAMPAIGN_ID}\n`);

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
