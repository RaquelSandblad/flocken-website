// Detaljerat analysscript för Meta-annonser med ad-level data
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
  // Använd Number() istället för parseInt() för att hantera stora nummer korrekt
  const value = Number(num);
  if (isNaN(value)) return '0';
  return Math.floor(value).toLocaleString('sv-SE');
}

async function analyzeDetailed(days = 30) {
  try {
    console.log('📊 Detaljerad analys av Meta-annonser...\n');
    console.log(`📅 Period: Senaste ${days} dagarna\n`);
    console.log('='.repeat(80));

    // Beräkna datum
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - days);
    const since = startDate.toISOString().split('T')[0];
    const until = today.toISOString().split('T')[0];
    const timeRange = `{'since':'${since}','until':'${until}'}`;

    // Hämta alla kampanjer
    const campaigns = await makeRequest(
      `/${AD_ACCOUNT_ID}/campaigns?fields=id,name,status,objective,daily_budget&limit=100`
    );

    if (campaigns.data.length === 0) {
      console.log('⚠️  Inga kampanjer hittades\n');
      return;
    }

    const allAdData = [];

    for (const campaign of campaigns.data) {
      console.log(`\n🎯 ${campaign.name}`);
      console.log(`   Status: ${campaign.status}`);
      console.log(`   Objective: ${campaign.objective || 'N/A'}\n`);

      // Hämta ad sets
      const adsets = await makeRequest(
        `/${campaign.id}/adsets?fields=id,name,status,daily_budget&limit=100`
      );

      for (const adset of adsets.data) {
        console.log(`   📦 ${adset.name}`);
        console.log(`      Status: ${adset.status}`);
        if (adset.daily_budget) {
          console.log(`      Budget: ${formatCurrency(adset.daily_budget)}/dag`);
        }

        // Hämta ad set insights med retry-logik
        let adsetInsights = null;
        let retries = 0;
        const maxRetries = 3;
        
        while (retries < maxRetries && !adsetInsights) {
          try {
            adsetInsights = await makeRequest(
              `/${adset.id}/insights?fields=impressions,clicks,spend,cpc,cpm,ctr,actions&time_range=${timeRange}`
            );
          } catch (error) {
            retries++;
            if (retries >= maxRetries) {
              console.log(`      ⚠️  Kunde inte hämta insights efter ${maxRetries} försök: ${error.message}`);
              break;
            }
            // Vänta lite innan retry
            await new Promise(resolve => setTimeout(resolve, 1000 * retries));
          }
        }
        
        if (adsetInsights) {
          if (adsetInsights.data && adsetInsights.data.length > 0) {
            const stats = adsetInsights.data[0];
            console.log(`      Impressions: ${formatNumber(stats.impressions || 0)}`);
            console.log(`      Clicks: ${formatNumber(stats.clicks || 0)}`);
            console.log(`      CTR: ${parseFloat(stats.ctr || 0).toFixed(2)}%`);
            console.log(`      Spend: ${formatCurrency(stats.spend || 0)}`);
            console.log(`      CPC: ${formatCurrency(stats.cpc || 0)}`);
            console.log(`      CPM: ${formatCurrency(stats.cpm || 0)}`);

            if (stats.actions && stats.actions.length > 0) {
              const linkClicks = stats.actions.find(a => a.action_type === 'link_click');
              const landingPageViews = stats.actions.find(a => a.action_type === 'landing_page_view');
              if (linkClicks) console.log(`      Link Clicks: ${linkClicks.value}`);
              if (landingPageViews) console.log(`      Landing Page Views: ${landingPageViews.value}`);
            }
          }
        }

        // Hämta ads
        try {
          const ads = await makeRequest(
            `/${adset.id}/ads?fields=id,name,status&limit=100`
          );

          if (ads.data && ads.data.length > 0) {
            console.log(`\n      📢 Ads (${ads.data.length}):`);

            for (const ad of ads.data) {
              // Hämta ad insights med retry-logik
              let adInsights = null;
              let adRetries = 0;
              const maxAdRetries = 2;
              
              while (adRetries < maxAdRetries && !adInsights) {
                try {
                  adInsights = await makeRequest(
                    `/${ad.id}/insights?fields=impressions,clicks,spend,cpc,cpm,ctr,actions&time_range=${timeRange}`
                  );
                } catch (error) {
                  adRetries++;
                  if (adRetries >= maxAdRetries) {
                    console.log(`         ⚠️  Kunde inte hämta insights: ${error.message}`);
                    break;
                  }
                  await new Promise(resolve => setTimeout(resolve, 500 * adRetries));
                }
              }
              
              if (adInsights) {
                if (adInsights.data && adInsights.data.length > 0) {
                  const stats = adInsights.data[0];
                  const linkClicks = stats.actions?.find(a => a.action_type === 'link_click');
                  
                  console.log(`         - ${ad.name}`);
                  console.log(`           Status: ${ad.status}`);
                  console.log(`           Impressions: ${formatNumber(stats.impressions || 0)}`);
                  console.log(`           Clicks: ${formatNumber(stats.clicks || 0)}`);
                  console.log(`           CTR: ${parseFloat(stats.ctr || 0).toFixed(2)}%`);
                  console.log(`           Spend: ${formatCurrency(stats.spend || 0)}`);
                  console.log(`           CPC: ${formatCurrency(stats.cpc || 0)}`);
                  if (linkClicks) {
                    console.log(`           Link Clicks: ${linkClicks.value}`);
                  }
                  console.log('');

                  // Spara för sortering - använd Number() för att hantera stora nummer korrekt
                  allAdData.push({
                    name: ad.name,
                    adset: adset.name,
                    status: ad.status,
                    impressions: Number(stats.impressions || 0),
                    clicks: Number(stats.clicks || 0),
                    ctr: Number(stats.ctr || 0),
                    spend: Number(stats.spend || 0),
                    cpc: Number(stats.cpc || 0),
                    linkClicks: linkClicks ? Number(linkClicks.value) : 0,
                  });
                } else {
                  console.log(`         - ${ad.name} (Ingen data)\n`);
                }
              }
            }
          }
        } catch (error) {
          console.log(`      ⚠️  Kunde inte hämta ads: ${error.message}`);
        }

        console.log('');
      }
    }

    // Sortera och visa top performers
    if (allAdData.length > 0) {
      console.log('\n' + '='.repeat(80));
      console.log('🏆 TOP PERFORMERS - Ad Level\n');

      // Sortera efter CTR
      const topByCTR = [...allAdData].sort((a, b) => b.ctr - a.ctr).slice(0, 5);
      console.log('📈 Högsta CTR:');
      topByCTR.forEach((ad, i) => {
        console.log(`   ${i + 1}. ${ad.name}`);
        console.log(`      CTR: ${ad.ctr.toFixed(2)}% | Clicks: ${formatNumber(ad.clicks)} | Spend: ${formatCurrency(ad.spend)}`);
      });

      // Sortera efter clicks
      const topByClicks = [...allAdData].sort((a, b) => b.clicks - a.clicks).slice(0, 5);
      console.log('\n👆 Mest clicks:');
      topByClicks.forEach((ad, i) => {
        console.log(`   ${i + 1}. ${ad.name}`);
        console.log(`      Clicks: ${formatNumber(ad.clicks)} | CTR: ${ad.ctr.toFixed(2)}% | Spend: ${formatCurrency(ad.spend)}`);
      });

      // Sortera efter lägsta CPC
      const topByCPC = [...allAdData]
        .filter(ad => ad.cpc > 0)
        .sort((a, b) => a.cpc - b.cpc)
        .slice(0, 5);
      console.log('\n💰 Lägsta CPC:');
      topByCPC.forEach((ad, i) => {
        console.log(`   ${i + 1}. ${ad.name}`);
        console.log(`      CPC: ${formatCurrency(ad.cpc)} | Clicks: ${formatNumber(ad.clicks)} | CTR: ${ad.ctr.toFixed(2)}%`);
      });
    }

    console.log('\n' + '='.repeat(80));
    console.log('✅ Detaljerad analys klar!\n');

  } catch (error) {
    console.error('\n❌ FEL vid analys:');
    console.error(`   ${error.message}\n`);
    process.exit(1);
  }
}

// Kör analys
const days = process.argv[2] ? parseInt(process.argv[2]) : 30;
analyzeDetailed(days).catch(err => {
  console.error('❌ Oväntat fel:', err);
  process.exit(1);
});
