// Script för att lista och ta ner gamla kampanjer (innan ny struktur)
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

// Lista alla kampanjer
async function listCampaigns() {
  try {
    console.log('📋 Listar alla kampanjer...\n');
    
    const campaigns = await makeRequest(
      `/${AD_ACCOUNT_ID}/campaigns?fields=id,name,status,objective,daily_budget,lifetime_budget,created_time&limit=100`
    );

    if (campaigns.data.length === 0) {
      console.log('   ✅ Inga kampanjer hittades\n');
      return [];
    }

    console.log(`   Totalt ${campaigns.data.length} kampanjer:\n`);
    campaigns.data.forEach((campaign, index) => {
      console.log(`   ${index + 1}. ${campaign.name}`);
      console.log(`      ID: ${campaign.id}`);
      console.log(`      Status: ${campaign.status}`);
      console.log(`      Objective: ${campaign.objective || 'N/A'}`);
      if (campaign.daily_budget) {
        console.log(`      Daily Budget: ${(campaign.daily_budget / 100).toFixed(2)} SEK`);
      }
      console.log(`      Created: ${campaign.created_time || 'N/A'}`);
      console.log('');
    });

    return campaigns.data;

  } catch (error) {
    console.error('\n❌ FEL vid listning av kampanjer:');
    console.error(`   ${error.message}\n`);
    throw error;
  }
}

// Ta ner en kampanj (pausa och markera för borttagning)
async function deleteCampaign(campaignId) {
  try {
    // Först pausa kampanjen
    await makeRequest(
      `/${campaignId}`,
      'POST',
      { status: 'PAUSED' }
    );

    // Sedan ta bort den
    const result = await makeRequest(
      `/${campaignId}`,
      'DELETE'
    );

    return result;
  } catch (error) {
    // Om borttagning misslyckas, försök bara pausa
    console.warn(`   ⚠️  Kunde inte ta bort kampanj ${campaignId}, pausade istället`);
    try {
      await makeRequest(
        `/${campaignId}`,
        'POST',
        { status: 'PAUSED' }
      );
    } catch (pauseError) {
      throw new Error(`Kunde varken ta bort eller pausa: ${pauseError.message}`);
    }
  }
}

// Ta ner alla kampanjer
async function deleteAllCampaigns(confirm = false) {
  try {
    const campaigns = await listCampaigns();

    if (campaigns.length === 0) {
      return;
    }

    if (!confirm) {
      console.log('⚠️  Detta kommer ta ner ALLA kampanjer ovan.');
      console.log('   Kör med --confirm för att bekräfta.\n');
      return;
    }

    console.log(`\n🗑️  Tar ner ${campaigns.length} kampanjer...\n`);

    for (const campaign of campaigns) {
      try {
        console.log(`   Tar ner: ${campaign.name} (${campaign.id})...`);
        await deleteCampaign(campaign.id);
        console.log(`   ✅ Borttagen\n`);
      } catch (error) {
        console.error(`   ❌ Fel: ${error.message}\n`);
      }
    }

    console.log('✅ Klart!\n');

  } catch (error) {
    console.error('\n❌ FEL:');
    console.error(`   ${error.message}\n`);
    process.exit(1);
  }
}

// Main
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];

  if (command === 'list' || !command) {
    listCampaigns().catch(err => {
      console.error('❌ Oväntat fel:', err);
      process.exit(1);
    });
  } else if (command === 'delete-all' && args[1] === '--confirm') {
    deleteAllCampaigns(true).catch(err => {
      console.error('❌ Oväntat fel:', err);
      process.exit(1);
    });
  } else if (command === 'delete' && args[1]) {
    const campaignId = args[1];
    deleteCampaign(campaignId)
      .then(() => {
        console.log('✅ Kampanj borttagen!\n');
      })
      .catch(err => {
        console.error('❌ Oväntat fel:', err);
        process.exit(1);
      });
  } else {
    console.log('📝 Användning:');
    console.log('   node list-and-delete-campaigns.js list                    # Lista alla kampanjer');
    console.log('   node list-and-delete-campaigns.js delete <campaign_id>     # Ta ner en kampanj');
    console.log('   node list-and-delete-campaigns.js delete-all --confirm     # Ta ner ALLA kampanjer');
    console.log('');
    process.exit(0);
  }
}

module.exports = { listCampaigns, deleteCampaign, deleteAllCampaigns, makeRequest, AD_ACCOUNT_ID };
