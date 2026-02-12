// Debug script för att se rådata från Meta API
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
function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const url = new URL(`https://graph.facebook.com/v21.0${path}`);
    url.searchParams.set('access_token', ACCESS_TOKEN);
    
    const req = https.request(url, (res) => {
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
    req.end();
  });
}

async function debugAPI() {
  try {
    console.log('🔍 Debug: Hämtar rådata från Meta API...\n');
    
    // Beräkna datum (senaste 30 dagarna)
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 30);
    const since = startDate.toISOString().split('T')[0];
    const until = today.toISOString().split('T')[0];
    const timeRange = `{'since':'${since}','until':'${until}'}`;

    console.log(`📅 Period: ${since} till ${until}\n`);
    console.log('='.repeat(80));

    // Hämta account-level insights
    console.log('\n1️⃣  Account-level insights (RÅDATA):\n');
    const accountInsights = await makeRequest(
      `/${AD_ACCOUNT_ID}/insights?fields=impressions,reach,clicks,spend,cpc,cpm,ctr,actions,action_values&time_range=${timeRange}`
    );

    console.log('Rådata från API:');
    console.log(JSON.stringify(accountInsights, null, 2));

    if (accountInsights.data && accountInsights.data.length > 0) {
      const stats = accountInsights.data[0];
      console.log('\n\n📊 Tolkat värden:');
      console.log(`   impressions (typ: ${typeof stats.impressions}): ${stats.impressions}`);
      console.log(`   reach (typ: ${typeof stats.reach}): ${stats.reach}`);
      console.log(`   clicks (typ: ${typeof stats.clicks}): ${stats.clicks}`);
      console.log(`   ctr (typ: ${typeof stats.ctr}): ${stats.ctr}`);
      console.log(`   spend (typ: ${typeof stats.spend}, värde: ${stats.spend}): ${stats.spend}`);
      console.log(`   cpc (typ: ${typeof stats.cpc}, värde: ${stats.cpc}): ${stats.cpc}`);
      console.log(`   cpm (typ: ${typeof stats.cpm}, värde: ${stats.cpm}): ${stats.cpm}`);
      
      console.log('\n💰 Valuta-värden (olika tolkningar):');
      console.log(`   spend som SEK: ${stats.spend} SEK`);
      console.log(`   spend / 100: ${stats.spend / 100} SEK`);
      console.log(`   spend * 1: ${stats.spend * 1} SEK`);
      console.log(`   cpc som SEK: ${stats.cpc} SEK`);
      console.log(`   cpc / 100: ${stats.cpc / 100} SEK`);
      console.log(`   cpm som SEK: ${stats.cpm} SEK`);
      console.log(`   cpm / 100: ${stats.cpm / 100} SEK`);
    }

    // Hämta kampanjer
    console.log('\n\n2️⃣  Kampanj insights (RÅDATA):\n');
    const campaigns = await makeRequest(
      `/${AD_ACCOUNT_ID}/campaigns?fields=id,name,status,objective,daily_budget&limit=5`
    );

    if (campaigns.data && campaigns.data.length > 0) {
      const campaign = campaigns.data[0];
      console.log(`Kampanj: ${campaign.name}`);
      console.log(`daily_budget (typ: ${typeof campaign.daily_budget}): ${campaign.daily_budget}`);
      
      const campaignInsights = await makeRequest(
        `/${campaign.id}/insights?fields=impressions,clicks,spend,cpc,cpm,ctr&time_range=${timeRange}`
      );
      
      console.log('\nRådata från kampanj insights:');
      console.log(JSON.stringify(campaignInsights, null, 2));
      
      if (campaignInsights.data && campaignInsights.data.length > 0) {
        const stats = campaignInsights.data[0];
        console.log('\n📊 Tolkat värden:');
        console.log(`   spend: ${stats.spend} (typ: ${typeof stats.spend})`);
        console.log(`   spend / 100: ${stats.spend / 100}`);
        console.log(`   cpc: ${stats.cpc} (typ: ${typeof stats.cpc})`);
        console.log(`   cpc / 100: ${stats.cpc / 100}`);
      }
    }

    console.log('\n' + '='.repeat(80));
    console.log('✅ Debug klar!\n');

  } catch (error) {
    console.error('\n❌ FEL:');
    console.error(`   ${error.message}\n`);
    console.error(error.stack);
    process.exit(1);
  }
}

debugAPI().catch(err => {
  console.error('❌ Oväntat fel:', err);
  process.exit(1);
});
