// Script för att lista hela kampanjstrukturen (campaigns, ad sets, ads)
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

// Lista hela strukturen
async function listFullStructure() {
  try {
    console.log('📋 Listar hela kampanjstrukturen...\n');
    console.log('='.repeat(80));
    console.log('');

    // 1. Hämta alla kampanjer
    const campaigns = await makeRequest(
      `/${AD_ACCOUNT_ID}/campaigns?fields=id,name,status,objective,daily_budget,lifetime_budget,created_time&limit=100`
    );

    if (campaigns.data.length === 0) {
      console.log('   ✅ Inga kampanjer hittades\n');
      return;
    }

    console.log(`📌 Totalt ${campaigns.data.length} kampanjer:\n`);

    for (const campaign of campaigns.data) {
      console.log(`🎯 Campaign: ${campaign.name}`);
      console.log(`   ID: ${campaign.id}`);
      console.log(`   Status: ${campaign.status}`);
      console.log(`   Objective: ${campaign.objective || 'N/A'}`);
      if (campaign.daily_budget) {
        console.log(`   Daily Budget: ${(campaign.daily_budget / 100).toFixed(2)} SEK`);
      }
      console.log(`   Created: ${campaign.created_time || 'N/A'}`);
      console.log('');

      // 2. Hämta ad sets för denna kampanj
      try {
        const adsets = await makeRequest(
          `/${campaign.id}/adsets?fields=id,name,status,daily_budget,lifetime_budget&limit=50`
        );

        if (adsets.data.length > 0) {
          console.log(`   📦 Ad Sets (${adsets.data.length}):`);
          for (const adset of adsets.data) {
            console.log(`      - ${adset.name}`);
            console.log(`        ID: ${adset.id}`);
            console.log(`        Status: ${adset.status}`);
            if (adset.daily_budget) {
              console.log(`        Daily Budget: ${(adset.daily_budget / 100).toFixed(2)} SEK`);
            }
            console.log('');

            // 3. Hämta ads för detta ad set
            try {
              const ads = await makeRequest(
                `/${adset.id}/ads?fields=id,name,status,creative&limit=50`
              );

              if (ads.data.length > 0) {
                console.log(`         📢 Ads (${ads.data.length}):`);
                for (const ad of ads.data) {
                  console.log(`            - ${ad.name}`);
                  console.log(`              ID: ${ad.id}`);
                  console.log(`              Status: ${ad.status}`);
                  console.log('');
                }
              } else {
                console.log(`         (Inga ads i detta ad set)`);
                console.log('');
              }
            } catch (adError) {
              console.log(`         ⚠️  Kunde inte hämta ads: ${adError.message}`);
              console.log('');
            }
          }
        } else {
          console.log(`   (Inga ad sets i denna kampanj)`);
          console.log('');
        }
      } catch (adsetError) {
        console.log(`   ⚠️  Kunde inte hämta ad sets: ${adsetError.message}`);
        console.log('');
      }

      console.log('   ' + '-'.repeat(76));
      console.log('');
    }

    console.log('='.repeat(80));
    console.log('✅ Listning klar!\n');

  } catch (error) {
    console.error('\n❌ FEL vid listning:');
    console.error(`   ${error.message}\n`);
    throw error;
  }
}

// Main
if (require.main === module) {
  listFullStructure().catch(err => {
    console.error('❌ Oväntat fel:', err);
    process.exit(1);
  });
}

module.exports = { listFullStructure, makeRequest, AD_ACCOUNT_ID };
