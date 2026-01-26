// Script för att analysera kampanjresultat på Meta
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

// Funktion för att göra API-anrop med timeout och bättre felhantering
function makeRequest(path, timeout = 30000) {
  return new Promise((resolve, reject) => {
    const url = new URL(`https://graph.facebook.com/v21.0${path}`);
    url.searchParams.set('access_token', ACCESS_TOKEN);
    
    const req = https.request(url, (res) => {
      let responseData = '';
      
      res.on('data', chunk => {
        responseData += chunk;
        // Begränsa storlek för att undvika minnesproblem
        if (responseData.length > 10 * 1024 * 1024) { // 10MB max
          req.destroy();
          reject(new Error('Response too large'));
        }
      });
      
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
    
    // Timeout
    req.setTimeout(timeout, () => {
      req.destroy();
      reject(new Error(`Request timeout after ${timeout}ms`));
    });
    
    req.end();
  });
}

// Formatera valuta
// Meta API returnerar belopp direkt i SEK (inte i öre)
function formatCurrency(amount, currency = 'SEK') {
  if (!amount) return '0.00';
  return parseFloat(amount).toFixed(2) + ' ' + currency;
}

// Formatera nummer - använd Number() för att hantera stora nummer korrekt
function formatNumber(num) {
  if (!num && num !== 0) return '0';
  const value = Number(num);
  if (isNaN(value)) return '0';
  return Math.floor(value).toLocaleString('sv-SE');
}

async function analyzeCampaigns(days = 7) {
  try {
    console.log('📊 Analyserar kampanjresultat...\n');
    console.log(`📅 Period: Senaste ${days} dagarna\n`);
    console.log('='.repeat(80));

    // Beräkna datum
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - days);
    const since = startDate.toISOString().split('T')[0];
    const until = today.toISOString().split('T')[0];

    // 1. Hämta account-level insights
    console.log('\n1️⃣  Account-level prestanda:\n');
    const accountInsights = await makeRequest(
      `/${AD_ACCOUNT_ID}/insights?fields=impressions,reach,clicks,spend,cpc,cpm,ctr,actions,action_values&time_range={'since':'${since}','until':'${until}'}`
    );

    if (accountInsights.data && accountInsights.data.length > 0) {
      const stats = accountInsights.data[0];
      console.log(`   Impressions: ${formatNumber(stats.impressions || 0)}`);
      console.log(`   Reach: ${formatNumber(stats.reach || 0)}`);
      console.log(`   Clicks: ${formatNumber(stats.clicks || 0)}`);
      console.log(`   CTR: ${parseFloat(stats.ctr || 0).toFixed(2)}%`);
      console.log(`   Spend: ${formatCurrency(stats.spend || 0)}`);
      console.log(`   CPC: ${formatCurrency(stats.cpc || 0)}`);
      console.log(`   CPM: ${formatCurrency(stats.cpm || 0)}`);
      
      if (stats.actions && stats.actions.length > 0) {
        console.log(`\n   Conversions:`);
        stats.actions.forEach(action => {
          console.log(`      ${action.action_type}: ${action.value}`);
        });
      }
      
      if (stats.action_values && stats.action_values.length > 0) {
        const totalValue = stats.action_values.reduce((sum, av) => sum + Number(av.value || 0), 0);
        console.log(`\n   Total Conversion Value: ${formatCurrency(totalValue)}`);
        if (stats.spend) {
          const roas = Number(totalValue) / Number(stats.spend);
          console.log(`   ROAS: ${roas.toFixed(2)}x`);
        }
      }
    } else {
      console.log('   ⚠️  Ingen data för denna period');
    }

    // 2. Hämta kampanjer med insights
    console.log('\n\n2️⃣  Kampanjprestanda:\n');
    const campaigns = await makeRequest(
      `/${AD_ACCOUNT_ID}/campaigns?fields=id,name,status,objective,daily_budget,lifetime_budget,created_time&limit=50`
    );

    if (campaigns.data.length === 0) {
      console.log('   ⚠️  Inga kampanjer hittades');
      return;
    }

    console.log(`   Totalt ${campaigns.data.length} kampanjer\n`);

    // Hämta insights för varje kampanj
    for (const campaign of campaigns.data) {
      try {
        const campaignInsights = await makeRequest(
          `/${campaign.id}/insights?fields=impressions,reach,clicks,spend,cpc,cpm,ctr,actions,action_values&time_range={'since':'${since}','until':'${until}'}`
        );

        if (campaignInsights.data && campaignInsights.data.length > 0) {
          const stats = campaignInsights.data[0];
          console.log(`   📌 ${campaign.name}`);
          console.log(`      Status: ${campaign.status}`);
          console.log(`      Objective: ${campaign.objective || 'N/A'}`);
          if (campaign.daily_budget) {
            console.log(`      Daily Budget: ${formatCurrency(campaign.daily_budget)}`);
          }
          console.log(`      Impressions: ${formatNumber(stats.impressions || 0)}`);
          console.log(`      Clicks: ${formatNumber(stats.clicks || 0)}`);
          console.log(`      CTR: ${parseFloat(stats.ctr || 0).toFixed(2)}%`);
          console.log(`      Spend: ${formatCurrency(stats.spend || 0)}`);
          console.log(`      CPC: ${formatCurrency(stats.cpc || 0)}`);
          
          if (stats.actions && stats.actions.length > 0) {
            const conversions = stats.actions.filter(a => 
              a.action_type.includes('link_click') || 
              a.action_type.includes('onsite_conversion') ||
              a.action_type.includes('lead')
            );
            if (conversions.length > 0) {
              console.log(`      Conversions:`);
              conversions.forEach(c => {
                console.log(`         ${c.action_type}: ${c.value}`);
              });
            }
          }
          console.log('');
        } else {
          console.log(`   📌 ${campaign.name} - Ingen data för denna period\n`);
        }
      } catch (error) {
        console.log(`   📌 ${campaign.name} - Fel vid hämtning: ${error.message}\n`);
      }
    }

    // 3. Hämta ad sets med insights
    console.log('\n\n3️⃣  Ad Set-prestanda (top 10):\n');
    const adsets = await makeRequest(
      `/${AD_ACCOUNT_ID}/adsets?fields=id,name,status,campaign_id,daily_budget,lifetime_budget&limit=10`
    );

    for (const adset of adsets.data.slice(0, 10)) {
      try {
        const adsetInsights = await makeRequest(
          `/${adset.id}/insights?fields=impressions,clicks,spend,cpc,ctr&time_range={'since':'${since}','until':'${until}'}`
        );

        if (adsetInsights.data && adsetInsights.data.length > 0) {
          const stats = adsetInsights.data[0];
          console.log(`   📌 ${adset.name}`);
          console.log(`      Impressions: ${formatNumber(stats.impressions || 0)}`);
          console.log(`      Clicks: ${formatNumber(stats.clicks || 0)}`);
          console.log(`      CTR: ${parseFloat(stats.ctr || 0).toFixed(2)}%`);
          console.log(`      Spend: ${formatCurrency(stats.spend || 0)}`);
          console.log(`      CPC: ${formatCurrency(stats.cpc || 0)}\n`);
        }
      } catch (error) {
        // Ignorera fel för ad sets
      }
    }

    console.log('='.repeat(80));
    console.log('✅ Analys klar!\n');

  } catch (error) {
    console.error('\n❌ FEL vid analys:');
    console.error(`   ${error.message}\n`);
    process.exit(1);
  }
}

// Kör analys
const days = process.argv[2] ? parseInt(process.argv[2]) : 7;
analyzeCampaigns(days).catch(err => {
  console.error('❌ Oväntat fel:', err);
  process.exit(1);
});


