// Test script för att verifiera åtkomst till Flocken Meta Ads account
try {
  require('dotenv').config({ path: '.env.local' });
} catch (e) {
  console.log('⚠️  dotenv inte installerat, försöker läsa .env.local direkt...');
}

const https = require('https');
const fs = require('fs');
const path = require('path');

// Försök läsa .env.local direkt
let envVars = {};
const envPath = path.join(__dirname, '..', '.env.local');
console.log('🔍 Läser .env.local från:', envPath);
console.log('   Existerar:', fs.existsSync(envPath) ? '✅ Ja' : '❌ Nej');
console.log('');

if (fs.existsSync(envPath)) {
  try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    console.log('📄 Innehåll i .env.local:');
    console.log('─'.repeat(60));
    
    envContent.split('\n').forEach((line, idx) => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const match = trimmed.match(/^([^#=]+)=(.*)$/);
        if (match) {
          const key = match[1].trim();
          let value = match[2].trim().replace(/^["']|["']$/g, '');
          // Maskera känsliga värden
          if (key.toUpperCase().includes('TOKEN') || key.toUpperCase().includes('SECRET') || key.toUpperCase().includes('KEY')) {
            value = value.length > 10 ? value.substring(0, 10) + '...' + value.substring(value.length - 4) : '***';
          }
          envVars[key] = match[2].trim().replace(/^["']|["']$/g, ''); // Spara fullt värde
          console.log(`   ${key} = ${value}`);
        }
      }
    });
    console.log('─'.repeat(60));
    console.log('');
  } catch (e) {
    console.error('❌ Kunde inte läsa .env.local:', e.message);
  }
} else {
  console.log('⚠️  .env.local finns inte i:', envPath);
  console.log('');
}

// Sök efter alla möjliga variabelnamn
// OBS: META_CAPI_ACCESS_TOKEN är för Conversions API, inte Marketing API!
const ACCESS_TOKEN = 
  process.env.META_ACCESS_TOKEN || 
  process.env.META_ADS_API_TOKEN ||
  process.env.META_MARKETING_API_TOKEN ||
  process.env.FACEBOOK_ACCESS_TOKEN ||
  process.env.FLOCKEN_META_TOKEN ||
  envVars.META_ACCESS_TOKEN ||
  envVars.META_ADS_API_TOKEN ||
  envVars.META_MARKETING_API_TOKEN ||
  envVars.FACEBOOK_ACCESS_TOKEN ||
  envVars.FLOCKEN_META_TOKEN;

// Notera om CAPI token finns (men den fungerar inte för Marketing API)
const CAPI_TOKEN = 
  process.env.META_CAPI_ACCESS_TOKEN ||
  envVars.META_CAPI_ACCESS_TOKEN;

const AD_ACCOUNT_ID = 
  process.env.META_AD_ACCOUNT_ID ||
  process.env.FACEBOOK_AD_ACCOUNT_ID ||
  process.env.FLOCKEN_AD_ACCOUNT_ID ||
  envVars.META_AD_ACCOUNT_ID ||
  envVars.FACEBOOK_AD_ACCOUNT_ID ||
  envVars.FLOCKEN_AD_ACCOUNT_ID;

// Visa sammanfattning av vad som hittades
console.log('\n📊 SAMMANFATTNING:');
console.log('─'.repeat(60));
const allVars = Object.keys(envVars);
if (allVars.length > 0) {
  console.log(`✅ Totalt ${allVars.length} variabler i .env.local`);
} else {
  console.log('⚠️  Inga variabler hittades i .env.local');
}

const foundVars = Object.keys(envVars).filter(k => 
  k.toUpperCase().includes('META') || 
  k.toUpperCase().includes('FACEBOOK') || 
  k.toUpperCase().includes('FLOCKEN')
);
if (foundVars.length > 0) {
  console.log(`\n🔍 Meta-relaterade variabler (${foundVars.length}):`);
  foundVars.forEach(v => console.log(`   ✓ ${v}`));
} else {
  console.log('\n⚠️  Inga Meta-relaterade variabler hittades');
}
console.log('─'.repeat(60));
console.log('');

if (CAPI_TOKEN) {
  console.log('ℹ️  Du har META_CAPI_ACCESS_TOKEN (Conversions API)');
  console.log('   Denna token är för att skicka konverteringsdata TILL Meta.\n');
}

// Tips om att använda samma token som Nästa Hem
console.log('💡 TIPS: Om System Usern har access till både Nästa Hem och Flocken ad accounts,');
console.log('   kan du använda samma META_ACCESS_TOKEN som i nastahem repot!');
console.log('   Du behöver bara ändra META_AD_ACCOUNT_ID till Flocken ad account ID.\n');

if (!ACCESS_TOKEN) {
  console.error('❌ Marketing API Access Token saknas!');
  console.error('   Sökte efter: META_ACCESS_TOKEN, META_ADS_API_TOKEN, META_MARKETING_API_TOKEN');
  console.error('');
  console.error('💡 Du behöver en Marketing API token (inte CAPI token)');
  console.error('   Se instruktioner i: docs/meta/META_ADS_API_SETUP_GUIDE.md');
  console.error('   Eller lägg till i .env.local: META_ACCESS_TOKEN=din_marketing_api_token');
  console.error('');
  if (CAPI_TOKEN) {
    console.error('   Du har redan META_CAPI_ACCESS_TOKEN, men behöver en annan token för Marketing API.');
  }
  process.exit(1);
} else {
  console.log('✅ Marketing API Access Token hittad!');
}

if (!AD_ACCOUNT_ID) {
  console.error('❌ Ad Account ID saknas!');
  console.error('   Sökte efter: META_AD_ACCOUNT_ID, FACEBOOK_AD_ACCOUNT_ID, FLOCKEN_AD_ACCOUNT_ID');
  console.error('   Lägg till i .env.local: META_AD_ACCOUNT_ID=act_123456789');
  process.exit(1);
} else {
  console.log(`✅ Ad Account ID hittad: ${AD_ACCOUNT_ID}\n`);
}

async function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const url = `https://graph.facebook.com/v21.0${path}${path.includes('?') ? '&' : '?'}access_token=${ACCESS_TOKEN}`;
    
    console.log(`🔗 Request: ${path.substring(0, 100)}...`);
    
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.error) {
            reject(new Error(`Meta API Error: ${parsed.error.message} (Code: ${parsed.error.code}, Type: ${parsed.error.type})`));
          } else {
            resolve(parsed);
          }
        } catch (e) {
          reject(new Error(`Parse error: ${e.message}\nResponse: ${data.substring(0, 500)}`));
        }
      });
    }).on('error', reject);
  });
}

async function testFlockenAccess() {
  console.log('🔍 Testar åtkomst till Flocken Meta Ads account...\n');
  console.log(`📋 Ad Account ID: ${AD_ACCOUNT_ID}\n`);
  console.log('='.repeat(80));
  
  try {
    // 1. Testa grundläggande account access
    console.log('\n1️⃣  Testar grundläggande account access...');
    const accountInfo = await makeRequest(`/${AD_ACCOUNT_ID}?fields=id,name,account_id,currency,timezone_name,timezone_offset_hours_utc,business`);
    
    console.log('✅ Account info hämtad:');
    console.log(`   ID: ${accountInfo.id}`);
    console.log(`   Name: ${accountInfo.name || 'N/A'}`);
    console.log(`   Account ID: ${accountInfo.account_id}`);
    console.log(`   Currency: ${accountInfo.currency || 'N/A'}`);
    console.log(`   Timezone: ${accountInfo.timezone_name || 'N/A'}`);
    if (accountInfo.business) {
      console.log(`   Business: ${accountInfo.business.name || accountInfo.business.id}`);
    }
    
    // 2. Lista kampanjer
    console.log('\n2️⃣  Hämtar kampanjer...');
    const campaigns = await makeRequest(`/${AD_ACCOUNT_ID}/campaigns?fields=id,name,status,objective,daily_budget,lifetime_budget,created_time&limit=10`);
    
    console.log(`✅ Hittade ${campaigns.data.length} kampanjer:`);
    campaigns.data.forEach((campaign, idx) => {
      console.log(`\n   ${idx + 1}. ${campaign.name}`);
      console.log(`      ID: ${campaign.id}`);
      console.log(`      Status: ${campaign.status}`);
      console.log(`      Objective: ${campaign.objective}`);
      if (campaign.daily_budget) {
        console.log(`      Daily Budget: ${(campaign.daily_budget / 100).toFixed(2)} ${accountInfo.currency || 'SEK'}`);
      }
      if (campaign.lifetime_budget) {
        console.log(`      Lifetime Budget: ${(campaign.lifetime_budget / 100).toFixed(2)} ${accountInfo.currency || 'SEK'}`);
      }
      console.log(`      Created: ${campaign.created_time}`);
    });
    
    // 3. Testa insights access (senaste 7 dagarna)
    console.log('\n3️⃣  Testar insights access (senaste 7 dagar)...');
    const today = new Date().toISOString().split('T')[0];
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const insights = await makeRequest(
      `/${AD_ACCOUNT_ID}/insights?fields=impressions,clicks,spend,cpc,cpm,ctr,reach,actions,action_values&time_range={'since':'${weekAgo}','until':'${today}'}`
    );
    
    if (insights.data && insights.data.length > 0) {
      const stats = insights.data[0];
      console.log('✅ Account-level insights:');
      console.log(`   Impressions: ${parseInt(stats.impressions || 0).toLocaleString()}`);
      console.log(`   Reach: ${parseInt(stats.reach || 0).toLocaleString()}`);
      console.log(`   Clicks: ${parseInt(stats.clicks || 0).toLocaleString()}`);
      console.log(`   CTR: ${parseFloat(stats.ctr || 0).toFixed(2)}%`);
      console.log(`   Spend: ${parseFloat(stats.spend || 0).toFixed(2)} ${accountInfo.currency || 'SEK'}`);
      console.log(`   CPC: ${parseFloat(stats.cpc || 0).toFixed(2)} ${accountInfo.currency || 'SEK'}`);
      console.log(`   CPM: ${parseFloat(stats.cpm || 0).toFixed(2)} ${accountInfo.currency || 'SEK'}`);
      
      if (stats.actions && stats.actions.length > 0) {
        console.log(`\n   Conversions:`);
        stats.actions.forEach(action => {
          console.log(`      ${action.action_type}: ${action.value}`);
        });
      }
    } else {
      console.log('⚠️  Ingen insights data (ingen aktivitet senaste 7 dagarna)');
    }
    
    // 4. Testa ad sets access
    console.log('\n4️⃣  Testar ad sets access...');
    const adsets = await makeRequest(`/${AD_ACCOUNT_ID}/adsets?fields=id,name,status&limit=5`);
    console.log(`✅ Hittade ${adsets.data.length} ad sets (visar första 5)`);
    
    // 5. Testa ads access
    console.log('\n5️⃣  Testar ads access...');
    const ads = await makeRequest(`/${AD_ACCOUNT_ID}/ads?fields=id,name,status&limit=5`);
    console.log(`✅ Hittade ${ads.data.length} ads (visar första 5)`);
    
    console.log('\n' + '='.repeat(80));
    console.log('✅ ALLA TESTER GENOMFÖRDA - API-åtkomst fungerar!');
    console.log('='.repeat(80));
    console.log('\n📊 Sammanfattning:');
    console.log(`   ✅ Account access: OK`);
    console.log(`   ✅ Campaigns access: OK (${campaigns.data.length} kampanjer)`);
    console.log(`   ✅ Insights access: OK`);
    console.log(`   ✅ Ad sets access: OK (${adsets.data.length} ad sets)`);
    console.log(`   ✅ Ads access: OK (${ads.data.length} ads)`);
    console.log('\n🎯 Du kan nu använda Meta API för att:');
    console.log('   - Hämta kampanjdata');
    console.log('   - Synka till BigQuery');
    console.log('   - Skapa nya annonser');
    console.log('   - Uppdatera kampanjer');
    console.log('\n🔗 Meta Ads Manager:');
    console.log(`   https://business.facebook.com/adsmanager/manage/campaigns?act=${AD_ACCOUNT_ID.replace('act_', '')}\n`);
    
  } catch (error) {
    console.error('\n❌ FEL vid API-anrop:');
    console.error(`   ${error.message}\n`);
    
    if (error.message.includes('Invalid OAuth')) {
      console.error('💡 Lösning:');
      console.error('   - Token kan vara ogiltig eller utgången');
      console.error('   - Generera ny token i Meta Business Manager');
      console.error('   - Se: docs/meta/META_ADS_API_SETUP_GUIDE.md\n');
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

testFlockenAccess().catch(err => {
  console.error('❌ Oväntat fel:', err);
  process.exit(1);
});

