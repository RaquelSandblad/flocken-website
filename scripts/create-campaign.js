// Script för att skapa nya kampanjer på Meta
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

// Exempel: Skapa en kampanj
async function createCampaign(config) {
  try {
    console.log('🚀 Skapar ny kampanj...\n');
    console.log('Konfiguration:');
    console.log(`   Namn: ${config.name}`);
    console.log(`   Objective: ${config.objective}`);
    console.log(`   Status: ${config.status || 'PAUSED'}`);
    console.log(`   Daily Budget: ${config.daily_budget ? (config.daily_budget / 100).toFixed(2) + ' SEK' : 'N/A'}\n`);

    const campaignData = {
      name: config.name,
      objective: config.objective,
      status: config.status || 'PAUSED',
      special_ad_categories: config.special_ad_categories || [],
    };

    if (config.daily_budget) {
      campaignData.daily_budget = config.daily_budget; // i cent/öre
    } else if (config.lifetime_budget) {
      campaignData.lifetime_budget = config.lifetime_budget;
    }

    const result = await makeRequest(
      `/${AD_ACCOUNT_ID}/campaigns`,
      'POST',
      campaignData
    );

    console.log('✅ Kampanj skapad!');
    console.log(`   ID: ${result.id}`);
    console.log(`   Namn: ${result.name || config.name}`);
    console.log(`\n🔗 Meta Ads Manager:`);
    console.log(`   https://business.facebook.com/adsmanager/manage/campaigns?act=${AD_ACCOUNT_ID.replace('act_', '')}\n`);

    return result;

  } catch (error) {
    console.error('\n❌ FEL vid skapande av kampanj:');
    console.error(`   ${error.message}\n`);
    throw error;
  }
}

// Om scriptet körs direkt med argument
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('📝 Användning:');
    console.log('   node create-campaign.js <namn> <objective> <daily_budget_sek> [status]');
    console.log('');
    console.log('Exempel:');
    console.log('   node create-campaign.js "Ny kampanj" OUTCOME_TRAFFIC 100 ACTIVE');
    console.log('');
    console.log('Objectives:');
    console.log('   - OUTCOME_TRAFFIC (Web Traffic)');
    console.log('   - OUTCOME_LEADS (Leads)');
    console.log('   - OUTCOME_ENGAGEMENT (Engagement)');
    console.log('   - OUTCOME_AWARENESS (Awareness)');
    console.log('   - OUTCOME_SALES (Conversions)');
    console.log('');
    console.log('Status:');
    console.log('   - PAUSED (pausad, standard)');
    console.log('   - ACTIVE (aktiv)');
    process.exit(0);
  }

  const name = args[0];
  const objective = args[1];
  const dailyBudgetSEK = parseFloat(args[2]) || 0;
  const status = args[3] || 'PAUSED';

  if (!name || !objective) {
    console.error('❌ Namn och objective krävs!');
    process.exit(1);
  }

  const config = {
    name,
    objective,
    daily_budget: dailyBudgetSEK ? Math.round(dailyBudgetSEK * 100) : undefined, // Konvertera till öre
    status: status.toUpperCase(),
  };

  createCampaign(config).catch(err => {
    console.error('❌ Oväntat fel:', err);
    process.exit(1);
  });
}

module.exports = { createCampaign, makeRequest, AD_ACCOUNT_ID };


