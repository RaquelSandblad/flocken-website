// Script för att återuppta pausade annonskampanjer på Meta
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

// Hämta credentials från .env.local
const ACCESS_TOKEN = 
  process.env.META_ACCESS_TOKEN || 
  process.env.META_ADS_API_TOKEN ||
  process.env.META_MARKETING_API_TOKEN ||
  process.env.META_CAPI_ACCESS_TOKEN ||
  envVars.META_ACCESS_TOKEN || 
  envVars.META_ADS_API_TOKEN ||
  envVars.META_MARKETING_API_TOKEN ||
  envVars.META_CAPI_ACCESS_TOKEN; // Försök med CAPI token också

const AD_ACCOUNT_ID = 
  process.env.META_AD_ACCOUNT_ID ||
  envVars.META_AD_ACCOUNT_ID ||
  'act_1648246706340725'; // Flocken ad account ID från dokumentation

if (!ACCESS_TOKEN) {
  console.error('❌ Ingen access token hittad!');
  console.error('   Lägg till META_ACCESS_TOKEN i .env.local');
  process.exit(1);
}

if (!AD_ACCOUNT_ID) {
  console.error('❌ Ingen ad account ID hittad!');
  process.exit(1);
}

console.log('🔍 Söker efter pausade kampanjer...\n');
console.log(`📋 Ad Account: ${AD_ACCOUNT_ID}\n`);

// Funktion för att göra API-anrop
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
            reject(new Error(`Meta API Error: ${parsed.error.message} (Code: ${parsed.error.code}, Type: ${parsed.error.type})`));
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

async function resumePausedCampaigns() {
  try {
    // 1. Hämta alla kampanjer med status
    console.log('1️⃣  Hämtar kampanjer...');
    const campaigns = await makeRequest(
      `/${AD_ACCOUNT_ID}/campaigns?fields=id,name,status,objective,daily_budget,lifetime_budget,created_time&limit=100`
    );
    
    console.log(`✅ Hittade ${campaigns.data.length} kampanjer totalt\n`);

    // 2. Filtrera pausade kampanjer
    const pausedCampaigns = campaigns.data.filter(c => c.status === 'PAUSED');
    
    if (pausedCampaigns.length === 0) {
      console.log('✅ Inga pausade kampanjer hittades!');
      return;
    }

    console.log(`📊 Hittade ${pausedCampaigns.length} pausade kampanjer:\n`);
    pausedCampaigns.forEach((campaign, idx) => {
      console.log(`   ${idx + 1}. ${campaign.name}`);
      console.log(`      ID: ${campaign.id}`);
      console.log(`      Status: ${campaign.status}`);
      console.log(`      Objective: ${campaign.objective || 'N/A'}`);
      if (campaign.daily_budget) {
        console.log(`      Daily Budget: ${(campaign.daily_budget / 100).toFixed(2)} SEK`);
      }
      console.log('');
    });

    // 3. Återuppta alla pausade kampanjer
    console.log('2️⃣  Återupptar kampanjer...\n');
    
    const results = [];
    for (const campaign of pausedCampaigns) {
      try {
        console.log(`   ⏳ Återupptar: ${campaign.name}...`);
        const result = await makeRequest(
          `/${campaign.id}`,
          'POST',
          { status: 'ACTIVE' }
        );
        
        results.push({
          campaign: campaign.name,
          id: campaign.id,
          success: true,
          result: result
        });
        console.log(`   ✅ ${campaign.name} är nu aktiv!\n`);
      } catch (error) {
        results.push({
          campaign: campaign.name,
          id: campaign.id,
          success: false,
          error: error.message
        });
        console.log(`   ❌ Kunde inte återuppta ${campaign.name}: ${error.message}\n`);
      }
    }

    // 4. Sammanfattning
    console.log('='.repeat(80));
    console.log('📊 SAMMANFATTNING:');
    console.log('='.repeat(80));
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    
    console.log(`\n✅ Framgångsrikt återupptagna: ${successful}/${pausedCampaigns.length}`);
    if (successful > 0) {
      console.log('\n   Återupptagna kampanjer:');
      results.filter(r => r.success).forEach(r => {
        console.log(`   ✓ ${r.campaign}`);
      });
    }
    
    if (failed > 0) {
      console.log(`\n❌ Misslyckade: ${failed}/${pausedCampaigns.length}`);
      console.log('\n   Misslyckade kampanjer:');
      results.filter(r => !r.success).forEach(r => {
        console.log(`   ✗ ${r.campaign}: ${r.error}`);
      });
    }
    
    console.log('\n' + '='.repeat(80));
    console.log('🎯 Klart!');
    console.log('='.repeat(80));
    console.log(`\n🔗 Meta Ads Manager:`);
    console.log(`   https://business.facebook.com/adsmanager/manage/campaigns?act=${AD_ACCOUNT_ID.replace('act_', '')}\n`);

  } catch (error) {
    console.error('\n❌ FEL vid API-anrop:');
    console.error(`   ${error.message}\n`);
    
    if (error.message.includes('Invalid OAuth')) {
      console.error('💡 Lösning:');
      console.error('   - Token kan vara ogiltig eller utgången');
      console.error('   - CAPI token fungerar inte för Marketing API');
      console.error('   - Du behöver en Marketing API token med permissions: ads_read, ads_management');
      console.error('   - Se: docs/META_MARKETING_API_TOKEN_GUIDE.md\n');
    } else if (error.message.includes('Permission denied') || error.message.includes('Insufficient permission')) {
      console.error('💡 Lösning:');
      console.error('   - Token saknar nödvändiga permissions');
      console.error('   - Behöver: ads_read, ads_management, business_management');
      console.error('   - Generera ny token med rätt permissions\n');
    } else if (error.message.includes('Invalid account')) {
      console.error('💡 Lösning:');
      console.error('   - Ad Account ID kan vara felaktigt');
      console.error('   - Kontrollera att det börjar med "act_"');
      console.error('   - Verifiera att kontot finns i din Business Manager\n');
    }
    
    process.exit(1);
  }
}

resumePausedCampaigns().catch(err => {
  console.error('❌ Oväntat fel:', err);
  process.exit(1);
});

