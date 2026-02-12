// Script för att skapa Dynamic Creative-annonser
// Meta testar automatiskt kombinationer av copy och headlines

const https = require('https');
const fs = require('fs');
const path = require('path');

// Läs .env.local
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

const ACCESS_TOKEN = envVars.META_ACCESS_TOKEN || envVars.META_ADS_API_TOKEN || envVars.META_MARKETING_API_TOKEN;
const AD_ACCOUNT_ID = envVars.META_AD_ACCOUNT_ID || 'act_1648246706340725';
const PAGE_ID = '936579286197312';
const CAMPAIGN_ID = '120239834352180455';
const LANDING_PAGE = 'https://flocken.info/valkommen';

// Ad set IDs som skapades
const ADSET_PARA = '120239835157500455';
const ADSET_BESOKA = '120239835158880455';

if (!ACCESS_TOKEN) {
  console.error('❌ Ingen access token hittad!');
  process.exit(1);
}

function makeRequest(urlPath, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(`https://graph.facebook.com/v21.0${urlPath}`);
    url.searchParams.set('access_token', ACCESS_TOKEN);
    const postData = data ? JSON.stringify(data) : null;
    const options = { method, headers: { 'Content-Type': 'application/json' } };

    const req = https.request(url, options, (res) => {
      let responseData = '';
      res.on('data', chunk => responseData += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          if (parsed.error) {
            console.error('API Error:', parsed.error.message);
            if (parsed.error.error_user_msg) {
              console.error('   User msg:', parsed.error.error_user_msg);
            }
          }
          resolve(parsed);
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

// Hämta video thumbnail
async function getVideoThumbnail(videoId) {
  const result = await makeRequest(`/${videoId}/thumbnails?fields=uri,is_preferred`);
  if (result.data && result.data.length > 0) {
    const preferred = result.data.find(t => t.is_preferred) || result.data[0];
    return preferred.uri;
  }
  return null;
}

// Skapa Dynamic Creative ad
async function createDCOAd(config) {
  console.log(`\n🎨 Skapar DCO ad: ${config.name}...`);
  console.log(`   Video: ${config.videoId}`);
  console.log(`   Primary texts: ${config.primaryTexts.length}`);
  console.log(`   Headlines: ${config.headlines.length}`);
  
  // Bygg URL med UTM
  const utmParams = new URLSearchParams({
    utm_source: 'meta',
    utm_medium: 'paid_social',
    utm_campaign: config.utmCampaign,
    utm_content: config.name,
  });
  const finalUrl = `${LANDING_PAGE}?${utmParams.toString()}`;
  
  // asset_feed_spec för Dynamic Creative
  const assetFeedSpec = {
    videos: [{
      video_id: config.videoId,
      thumbnail_url: config.thumbnailUrl,
    }],
    bodies: config.primaryTexts.map(text => ({ text })),
    titles: config.headlines.map(text => ({ text })),
    descriptions: config.descriptions.map(text => ({ text })),
    ad_formats: ['SINGLE_VIDEO'],
    call_to_action_types: ['DOWNLOAD'],
    link_urls: [{ website_url: finalUrl }],
  };
  
  // Skapa creative
  const creativeData = {
    name: `${config.name} Creative`,
    asset_feed_spec: assetFeedSpec,
  };
  
  console.log('   Skapar creative...');
  const creativeResult = await makeRequest(`/${AD_ACCOUNT_ID}/adcreatives`, 'POST', creativeData);
  
  if (!creativeResult.id) {
    console.error('   ❌ Creative misslyckades');
    console.error('   ', JSON.stringify(creativeResult.error || creativeResult, null, 2));
    return null;
  }
  
  console.log(`   ✅ Creative ID: ${creativeResult.id}`);
  
  // Skapa ad
  const adResult = await makeRequest(`/${AD_ACCOUNT_ID}/ads`, 'POST', {
    name: config.name,
    adset_id: config.adsetId,
    creative: { creative_id: creativeResult.id },
    status: 'PAUSED',
  });
  
  if (adResult.id) {
    console.log(`   ✅ Ad ID: ${adResult.id}`);
    return adResult.id;
  }
  
  console.error('   ❌ Ad misslyckades');
  console.error('   ', JSON.stringify(adResult.error || adResult, null, 2));
  return null;
}

// Uppdatera ad set för Dynamic Creative
async function enableDynamicCreative(adsetId) {
  console.log(`\n⚙️  Aktiverar Dynamic Creative på ad set ${adsetId}...`);
  
  const result = await makeRequest(`/${adsetId}`, 'POST', {
    is_dynamic_creative: true,
  });
  
  if (result.success !== false) {
    console.log('   ✅ Dynamic Creative aktiverat');
    return true;
  }
  console.error('   ❌ Kunde inte aktivera:', result.error?.message);
  return false;
}

// Parsa copy.md
function parseCopy(copyPath) {
  const content = fs.readFileSync(copyPath, 'utf8');
  const result = { primaryTexts: [], headlines: [], descriptions: [] };
  
  // Primary texts - hantera båda formaten
  const sections = content.split(/(?=p\d{2}:)/);
  for (const section of sections) {
    const match = section.match(/^p(\d{2}):\s*(.+)/);
    if (!match) continue;
    
    const firstLine = match[2].trim();
    const bodyStart = section.indexOf('\n');
    
    if (bodyStart !== -1) {
      const rest = section.substring(bodyStart);
      const bodyLines = rest.split('\n')
        .filter(l => l.trim() && !l.startsWith('##') && !l.match(/^[hd]\d{2}:/))
        .map(l => l.trim());
      
      if (bodyLines.length > 0) {
        result.primaryTexts.push(`${firstLine}\n\n${bodyLines.join('\n')}`);
      } else {
        result.primaryTexts.push(firstLine);
      }
    } else {
      result.primaryTexts.push(firstLine);
    }
  }
  
  // Headlines
  const headlineMatch = content.match(/## Headlines\s*\n([\s\S]*?)(?=##|$)/);
  if (headlineMatch) {
    const lines = headlineMatch[1].split('\n').filter(l => l.match(/^h\d{2}:/));
    lines.forEach(line => {
      const m = line.match(/^h\d{2}:\s*(.+)/);
      if (m) result.headlines.push(m[1].trim());
    });
  }
  
  // Descriptions
  const descMatch = content.match(/## Descriptions\s*\n([\s\S]*?)(?=##|$)/);
  if (descMatch) {
    const lines = descMatch[1].split('\n').filter(l => l.match(/^d\d{2}:/));
    lines.forEach(line => {
      const m = line.match(/^d\d{2}:\s*(.+)/);
      if (m) result.descriptions.push(m[1].trim());
    });
  }
  
  // Fallback descriptions
  if (result.descriptions.length === 0) {
    result.descriptions = ['Gratis att testa'];
  }
  
  return result;
}

// Main
async function main() {
  console.log('='.repeat(80));
  console.log('🐕 Flocken - Dynamic Creative Ads');
  console.log('='.repeat(80));
  
  // 1. Aktivera Dynamic Creative på ad sets
  await enableDynamicCreative(ADSET_PARA);
  await enableDynamicCreative(ADSET_BESOKA);
  
  // 2. Läs copy
  console.log('\n📝 Läser copy...');
  const copyCb002 = parseCopy(path.join(__dirname, '..', 'flocken_ads', 'creative_bases', 'cb002', 'copy.md'));
  const copyCb005 = parseCopy(path.join(__dirname, '..', 'flocken_ads', 'creative_bases', 'cb005', 'copy.md'));
  
  console.log(`   CB002: ${copyCb002.primaryTexts.length} texts, ${copyCb002.headlines.length} headlines`);
  console.log(`   CB005: ${copyCb005.primaryTexts.length} texts, ${copyCb005.headlines.length} headlines`);
  
  // 3. Hämta thumbnails för de uppladdade videorna
  console.log('\n🖼️  Hämtar thumbnails...');
  
  // Video IDs från förra körningen
  const VIDEO_CB002_9x16 = '900158252492547';
  const VIDEO_CB002_4x5 = '1365736635297866';
  const VIDEO_CB005_9x16 = '1429367792031101';
  const VIDEO_CB005_4x5 = '917764604256281';
  
  const thumb002_9x16 = await getVideoThumbnail(VIDEO_CB002_9x16);
  const thumb002_4x5 = await getVideoThumbnail(VIDEO_CB002_4x5);
  const thumb005_9x16 = await getVideoThumbnail(VIDEO_CB005_9x16);
  const thumb005_4x5 = await getVideoThumbnail(VIDEO_CB005_4x5);
  
  console.log('   ✅ Thumbnails hämtade');
  
  // 4. Skapa DCO ads
  console.log('\n' + '='.repeat(80));
  console.log('📢 Skapar Dynamic Creative ads...');
  console.log('='.repeat(80));
  
  // CB002 Para - 9x16
  const ad1 = await createDCOAd({
    name: 'ad_h01a_cb002_dco_9x16_hk_para_cid001',
    adsetId: ADSET_PARA,
    videoId: VIDEO_CB002_9x16,
    thumbnailUrl: thumb002_9x16,
    primaryTexts: copyCb002.primaryTexts,
    headlines: copyCb002.headlines,
    descriptions: copyCb002.descriptions,
    utmCampaign: 'h01_para_cid001',
  });
  
  // CB002 Para - 4x5
  const ad2 = await createDCOAd({
    name: 'ad_h01a_cb002_dco_4x5_hk_para_cid001',
    adsetId: ADSET_PARA,
    videoId: VIDEO_CB002_4x5,
    thumbnailUrl: thumb002_4x5,
    primaryTexts: copyCb002.primaryTexts,
    headlines: copyCb002.headlines,
    descriptions: copyCb002.descriptions,
    utmCampaign: 'h01_para_cid001',
  });
  
  // CB005 Besoka - 9x16
  const ad3 = await createDCOAd({
    name: 'ad_h01a_cb005_dco_9x16_hk_besoka_cid001',
    adsetId: ADSET_BESOKA,
    videoId: VIDEO_CB005_9x16,
    thumbnailUrl: thumb005_9x16,
    primaryTexts: copyCb005.primaryTexts,
    headlines: copyCb005.headlines,
    descriptions: copyCb005.descriptions,
    utmCampaign: 'h01_besoka_cid001',
  });
  
  // CB005 Besoka - 4x5
  const ad4 = await createDCOAd({
    name: 'ad_h01a_cb005_dco_4x5_hk_besoka_cid001',
    adsetId: ADSET_BESOKA,
    videoId: VIDEO_CB005_4x5,
    thumbnailUrl: thumb005_4x5,
    primaryTexts: copyCb005.primaryTexts,
    headlines: copyCb005.headlines,
    descriptions: copyCb005.descriptions,
    utmCampaign: 'h01_besoka_cid001',
  });
  
  // Sammanfattning
  const created = [ad1, ad2, ad3, ad4].filter(Boolean);
  
  console.log('\n' + '='.repeat(80));
  console.log(`✅ KLART! Skapade ${created.length}/4 DCO-annonser`);
  console.log('='.repeat(80));
  console.log(`
📋 Struktur:

Campaign: c_flo_swe_init_dogowner_inst_h01_cid001
├── Ad Set: as_para_swe_opt_lpv_cid001 (CB002)
│   ├── Ad: 9x16 video + ${copyCb002.primaryTexts.length} texts + ${copyCb002.headlines.length} headlines
│   └── Ad: 4x5 video + ${copyCb002.primaryTexts.length} texts + ${copyCb002.headlines.length} headlines
│
└── Ad Set: as_besoka_swe_opt_lpv_cid001 (CB005)
    ├── Ad: 9x16 video + ${copyCb005.primaryTexts.length} texts + ${copyCb005.headlines.length} headlines
    └── Ad: 4x5 video + ${copyCb005.primaryTexts.length} texts + ${copyCb005.headlines.length} headlines

🔗 Meta Ads Manager:
   https://business.facebook.com/adsmanager/manage/campaigns?act=${AD_ACCOUNT_ID.replace('act_', '')}
  `);
}

main().catch(err => {
  console.error('❌ Fel:', err.message);
  process.exit(1);
});
