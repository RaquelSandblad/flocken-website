// Script för att skapa Flocken-annonser
// 2 copy-varianter per video = 8 annonser totalt

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
const DISPLAY_LINK = 'flocken.info/om-appen';

// Ad sets från tidigare körning
const ADSET_PARA = '120239835157500455';
const ADSET_BESOKA = '120239835158880455';

// Videos från tidigare körning
const VIDEOS = {
  cb002_9x16: '900158252492547',
  cb002_4x5: '1365736635297866',
  cb005_9x16: '1429367792031101',
  cb005_4x5: '917764604256281',
};

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

// Skapa en video-annons
async function createVideoAd(config) {
  console.log(`\n📢 Skapar: ${config.name}`);
  
  // Bygg URL med UTM
  const utmParams = new URLSearchParams({
    utm_source: 'meta',
    utm_medium: 'paid_social',
    utm_campaign: config.utmCampaign,
    utm_content: config.name,
  });
  const finalUrl = `${LANDING_PAGE}?${utmParams.toString()}`;
  
  // Skapa creative
  const creativeResult = await makeRequest(`/${AD_ACCOUNT_ID}/adcreatives`, 'POST', {
    name: `${config.name} Creative`,
    object_story_spec: {
      page_id: PAGE_ID,
      video_data: {
        video_id: config.videoId,
        image_url: config.thumbnailUrl,
        title: config.headline,
        message: config.primaryText,
        link_description: config.description,
        call_to_action: {
          type: 'DOWNLOAD',
          value: { link: finalUrl, link_caption: DISPLAY_LINK }
        },
      }
    },
  });
  
  if (!creativeResult.id) {
    console.error('   ❌ Creative misslyckades');
    return null;
  }
  
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
  return null;
}

// Parsa copy.md - returnera bara de två första varianterna
function parseCopy(copyPath) {
  const content = fs.readFileSync(copyPath, 'utf8');
  const result = { primaryTexts: [], headlines: [], descriptions: [] };
  
  // Primary texts (ta bara första 2)
  const sections = content.split(/(?=p\d{2}:)/);
  let count = 0;
  for (const section of sections) {
    if (count >= 2) break;
    const match = section.match(/^p(\d{2}):\s*(.+)/);
    if (!match) continue;
    
    const firstLine = match[2].trim();
    const bodyStart = section.indexOf('\n');
    
    if (bodyStart !== -1) {
      const bodyText = section.substring(bodyStart).trim();
      const bodyLines = bodyText.split('\n')
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
    count++;
  }
  
  // Headlines (ta bara första 2)
  const headlineMatch = content.match(/## Headlines\s*\n([\s\S]*?)(?=##|$)/);
  if (headlineMatch) {
    const lines = headlineMatch[1].split('\n').filter(l => l.match(/^h\d{2}:/)).slice(0, 2);
    lines.forEach(line => {
      const m = line.match(/^h\d{2}:\s*(.+)/);
      if (m) result.headlines.push(m[1].trim());
    });
  }
  
  // Descriptions (ta bara första)
  const descMatch = content.match(/## Descriptions\s*\n([\s\S]*?)(?=##|$)/);
  if (descMatch) {
    const lines = descMatch[1].split('\n').filter(l => l.match(/^d\d{2}:/)).slice(0, 1);
    lines.forEach(line => {
      const m = line.match(/^d\d{2}:\s*(.+)/);
      if (m) result.descriptions.push(m[1].trim());
    });
  }
  
  // Fallback
  if (result.headlines.length === 0) result.headlines = ['Hela hundlivet i en app', 'Gå med i Flocken nu'];
  if (result.descriptions.length === 0) result.descriptions = ['Gratis att testa'];
  
  return result;
}

// Main
async function main() {
  console.log('='.repeat(70));
  console.log('🐕 Flocken Meta Ads - 2 copy per video');
  console.log('='.repeat(70));
  
  // Hämta thumbnails
  console.log('\n🖼️  Hämtar thumbnails...');
  const thumbnails = {
    cb002_9x16: await getVideoThumbnail(VIDEOS.cb002_9x16),
    cb002_4x5: await getVideoThumbnail(VIDEOS.cb002_4x5),
    cb005_9x16: await getVideoThumbnail(VIDEOS.cb005_9x16),
    cb005_4x5: await getVideoThumbnail(VIDEOS.cb005_4x5),
  };
  console.log('   ✅ Klart');
  
  // Läs copy
  console.log('\n📝 Läser copy (2 första varianterna)...');
  const copyCb002 = parseCopy(path.join(__dirname, '..', 'flocken_ads', 'creative_bases', 'cb002', 'copy.md'));
  const copyCb005 = parseCopy(path.join(__dirname, '..', 'flocken_ads', 'creative_bases', 'cb005', 'copy.md'));
  
  console.log(`   CB002: ${copyCb002.primaryTexts.length} texts, ${copyCb002.headlines.length} headlines`);
  console.log(`   CB005: ${copyCb005.primaryTexts.length} texts, ${copyCb005.headlines.length} headlines`);
  
  // Skapa annonser
  console.log('\n' + '='.repeat(70));
  console.log('📢 AD SET: PARA (CB002)');
  console.log('='.repeat(70));
  
  const createdAds = [];
  
  // CB002 - 9x16 - v01
  createdAds.push(await createVideoAd({
    name: 'ad_h01a_cb002_v01_9x16_hk_para_cid001',
    adsetId: ADSET_PARA,
    videoId: VIDEOS.cb002_9x16,
    thumbnailUrl: thumbnails.cb002_9x16,
    primaryText: copyCb002.primaryTexts[0],
    headline: copyCb002.headlines[0],
    description: copyCb002.descriptions[0],
    utmCampaign: 'h01_para_cid001',
  }));
  
  // CB002 - 9x16 - v02
  createdAds.push(await createVideoAd({
    name: 'ad_h01a_cb002_v02_9x16_hk_para_cid001',
    adsetId: ADSET_PARA,
    videoId: VIDEOS.cb002_9x16,
    thumbnailUrl: thumbnails.cb002_9x16,
    primaryText: copyCb002.primaryTexts[1],
    headline: copyCb002.headlines[1],
    description: copyCb002.descriptions[0],
    utmCampaign: 'h01_para_cid001',
  }));
  
  // CB002 - 4x5 - v01
  createdAds.push(await createVideoAd({
    name: 'ad_h01a_cb002_v01_4x5_hk_para_cid001',
    adsetId: ADSET_PARA,
    videoId: VIDEOS.cb002_4x5,
    thumbnailUrl: thumbnails.cb002_4x5,
    primaryText: copyCb002.primaryTexts[0],
    headline: copyCb002.headlines[0],
    description: copyCb002.descriptions[0],
    utmCampaign: 'h01_para_cid001',
  }));
  
  // CB002 - 4x5 - v02
  createdAds.push(await createVideoAd({
    name: 'ad_h01a_cb002_v02_4x5_hk_para_cid001',
    adsetId: ADSET_PARA,
    videoId: VIDEOS.cb002_4x5,
    thumbnailUrl: thumbnails.cb002_4x5,
    primaryText: copyCb002.primaryTexts[1],
    headline: copyCb002.headlines[1],
    description: copyCb002.descriptions[0],
    utmCampaign: 'h01_para_cid001',
  }));
  
  console.log('\n' + '='.repeat(70));
  console.log('📢 AD SET: BESÖKA (CB005)');
  console.log('='.repeat(70));
  
  // CB005 - 9x16 - v01
  createdAds.push(await createVideoAd({
    name: 'ad_h01a_cb005_v01_9x16_hk_besoka_cid001',
    adsetId: ADSET_BESOKA,
    videoId: VIDEOS.cb005_9x16,
    thumbnailUrl: thumbnails.cb005_9x16,
    primaryText: copyCb005.primaryTexts[0],
    headline: copyCb005.headlines[0],
    description: copyCb005.descriptions[0],
    utmCampaign: 'h01_besoka_cid001',
  }));
  
  // CB005 - 9x16 - v02
  createdAds.push(await createVideoAd({
    name: 'ad_h01a_cb005_v02_9x16_hk_besoka_cid001',
    adsetId: ADSET_BESOKA,
    videoId: VIDEOS.cb005_9x16,
    thumbnailUrl: thumbnails.cb005_9x16,
    primaryText: copyCb005.primaryTexts[1] || copyCb005.primaryTexts[0],
    headline: copyCb005.headlines[1] || copyCb005.headlines[0],
    description: copyCb005.descriptions[0],
    utmCampaign: 'h01_besoka_cid001',
  }));
  
  // CB005 - 4x5 - v01
  createdAds.push(await createVideoAd({
    name: 'ad_h01a_cb005_v01_4x5_hk_besoka_cid001',
    adsetId: ADSET_BESOKA,
    videoId: VIDEOS.cb005_4x5,
    thumbnailUrl: thumbnails.cb005_4x5,
    primaryText: copyCb005.primaryTexts[0],
    headline: copyCb005.headlines[0],
    description: copyCb005.descriptions[0],
    utmCampaign: 'h01_besoka_cid001',
  }));
  
  // CB005 - 4x5 - v02
  createdAds.push(await createVideoAd({
    name: 'ad_h01a_cb005_v02_4x5_hk_besoka_cid001',
    adsetId: ADSET_BESOKA,
    videoId: VIDEOS.cb005_4x5,
    thumbnailUrl: thumbnails.cb005_4x5,
    primaryText: copyCb005.primaryTexts[1] || copyCb005.primaryTexts[0],
    headline: copyCb005.headlines[1] || copyCb005.headlines[0],
    description: copyCb005.descriptions[0],
    utmCampaign: 'h01_besoka_cid001',
  }));
  
  // Sammanfattning
  const successful = createdAds.filter(Boolean).length;
  
  console.log('\n' + '='.repeat(70));
  console.log(`✅ KLART! Skapade ${successful}/8 annonser`);
  console.log('='.repeat(70));
  console.log(`
📋 Struktur:

Campaign: c_flo_swe_init_dogowner_inst_h01_cid001
│
├── Ad Set: as_para_swe_opt_lpv_cid001 (Para/CB002)
│   ├── 9x16 video + copy v01
│   ├── 9x16 video + copy v02
│   ├── 4x5 video + copy v01
│   └── 4x5 video + copy v02
│
└── Ad Set: as_besoka_swe_opt_lpv_cid001 (Besöka/CB005)
    ├── 9x16 video + copy v01
    ├── 9x16 video + copy v02
    ├── 4x5 video + copy v01
    └── 4x5 video + copy v02

🔗 Meta Ads Manager:
   https://business.facebook.com/adsmanager/manage/campaigns?act=1648246706340725

⚠️  Alla ads skapade som PAUSED - aktivera när du är redo.
  `);
}

main().catch(err => {
  console.error('❌ Fel:', err.message);
  process.exit(1);
});
