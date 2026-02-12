// Script för att skapa Dynamic Creative-annonser
// En annons med flera copy-varianter + headlines som Meta testar automatiskt

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
const OLD_ADSET_ID = '120239834356860455';
const LANDING_PAGE = 'https://flocken.info/valkommen';

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

// Ladda upp video
async function uploadVideo(videoPath, title) {
  console.log(`   🎬 Laddar upp: ${path.basename(videoPath)}...`);
  
  const fileSize = fs.statSync(videoPath).size;
  const videoBuffer = fs.readFileSync(videoPath);
  const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);
  
  return new Promise((resolve, reject) => {
    let body = '';
    body += `--${boundary}\r\n`;
    body += `Content-Disposition: form-data; name="access_token"\r\n\r\n${ACCESS_TOKEN}\r\n`;
    body += `--${boundary}\r\n`;
    body += `Content-Disposition: form-data; name="title"\r\n\r\n${title}\r\n`;
    body += `--${boundary}\r\n`;
    body += `Content-Disposition: form-data; name="source"; filename="${path.basename(videoPath)}"\r\n`;
    body += `Content-Type: video/mp4\r\n\r\n`;
    
    const ending = `\r\n--${boundary}--\r\n`;
    const bodyBuffer = Buffer.concat([
      Buffer.from(body, 'utf8'),
      videoBuffer,
      Buffer.from(ending, 'utf8'),
    ]);
    
    const req = https.request({
      hostname: 'graph-video.facebook.com',
      path: `/v21.0/${AD_ACCOUNT_ID}/advideos`,
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': bodyBuffer.length,
      },
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (result.error) {
            reject(new Error(result.error.message));
          } else {
            console.log(`      ✅ Video ID: ${result.id}`);
            resolve(result.id);
          }
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on('error', reject);
    req.write(bodyBuffer);
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

// Skapa ad set
async function createAdSet(name, dailyBudget = 5000) {
  console.log(`\n📦 Skapar ad set: ${name}...`);
  
  const result = await makeRequest(`/${AD_ACCOUNT_ID}/adsets`, 'POST', {
    name: name,
    campaign_id: CAMPAIGN_ID,
    daily_budget: dailyBudget,
    billing_event: 'IMPRESSIONS',
    optimization_goal: 'LANDING_PAGE_VIEWS',
    bid_strategy: 'LOWEST_COST_WITHOUT_CAP',
    targeting: {
      geo_locations: { countries: ['SE'] },
      age_min: 18,
      age_max: 65,
    },
    status: 'PAUSED',
  });
  
  if (result.id) {
    console.log(`   ✅ Ad set skapad! ID: ${result.id}`);
    return result.id;
  }
  throw new Error('Failed to create ad set');
}

// Skapa Dynamic Creative ad
async function createDynamicCreativeAd(config) {
  console.log(`\n🎨 Skapar Dynamic Creative ad: ${config.name}...`);
  
  // Bygg URL med UTM
  const utmParams = new URLSearchParams({
    utm_source: 'meta',
    utm_medium: 'paid_social',
    utm_campaign: config.utmCampaign,
    utm_content: config.name,
  });
  const finalUrl = `${LANDING_PAGE}?${utmParams.toString()}`;
  
  // För Dynamic Creative med video
  const creativeResult = await makeRequest(`/${AD_ACCOUNT_ID}/adcreatives`, 'POST', {
    name: `${config.name} Creative`,
    object_story_spec: {
      page_id: PAGE_ID,
      video_data: {
        video_id: config.videoId,
        image_url: config.thumbnailUrl,
        title: config.headlines[0], // Första headline som default
        message: config.primaryTexts[0], // Första primary text som default
        link_description: config.descriptions[0] || 'Gratis att testa',
        call_to_action: {
          type: 'DOWNLOAD',
          value: { link: finalUrl }
        },
      }
    },
  });
  
  if (!creativeResult.id) {
    console.error('   ❌ Creative creation failed');
    console.error('   ', JSON.stringify(creativeResult, null, 2));
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
  
  console.error('   ❌ Ad creation failed');
  return null;
}

// Ta bort alla ads i ett ad set
async function deleteAllAdsInAdSet(adsetId) {
  console.log(`\n🗑️  Tar bort annonser i ad set ${adsetId}...`);
  
  const ads = await makeRequest(`/${adsetId}/ads?fields=id,name&limit=50`);
  
  if (!ads.data || ads.data.length === 0) {
    console.log('   Inga annonser att ta bort.');
    return;
  }
  
  for (const ad of ads.data) {
    const result = await makeRequest(`/${ad.id}`, 'DELETE');
    if (result.success) {
      console.log(`   ✅ Borttagen: ${ad.name}`);
    } else {
      console.log(`   ❌ Kunde ej ta bort: ${ad.name}`);
    }
  }
}

// Parsa copy.md
function parseCopy(copyPath) {
  const content = fs.readFileSync(copyPath, 'utf8');
  const result = { primaryTexts: [], headlines: [], descriptions: [] };
  
  // Primary texts
  const sections = content.split(/(?=p\d{2}:)/);
  for (const section of sections) {
    const match = section.match(/^p(\d{2}):\s*(.+)/);
    if (!match) continue;
    
    const firstLine = match[2].trim();
    const bodyStart = section.indexOf('\n');
    
    if (bodyStart !== -1) {
      const bodyText = section.substring(bodyStart).trim();
      const bodyLines = bodyText.split('\n').filter(l => l.trim() && !l.startsWith('##')).map(l => l.trim());
      
      // Om det finns body-text, kombinera med första raden
      if (bodyLines.length > 0 && !bodyLines[0].startsWith('h0') && !bodyLines[0].startsWith('d0')) {
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
  
  return result;
}

// Main
async function main() {
  console.log('='.repeat(80));
  console.log('🐕 Flocken Meta Ads - Dynamic Creative Setup');
  console.log('='.repeat(80));
  
  // 1. Ta bort befintliga annonser
  await deleteAllAdsInAdSet(OLD_ADSET_ID);
  
  // 2. Ta bort det gamla ad set:et
  console.log(`\n🗑️  Tar bort gammalt ad set...`);
  await makeRequest(`/${OLD_ADSET_ID}`, 'DELETE');
  console.log('   ✅ Gammalt ad set borttaget');
  
  // 3. Skapa nya ad sets
  const adsetPara = await createAdSet('as_para_swe_opt_lpv_cid001', 2500); // 25 SEK/dag
  const adsetBesoka = await createAdSet('as_besoka_swe_opt_lpv_cid001', 2500); // 25 SEK/dag
  
  // 4. Ladda upp videos och vänta på processning
  console.log('\n📹 Laddar upp videos...');
  
  const cb002Path = path.join(__dirname, '..', 'flocken_ads', 'creative_bases', 'cb002', 'assets', 'vid');
  const cb005Path = path.join(__dirname, '..', 'flocken_ads', 'creative_bases', 'cb005', 'assets', 'vid');
  
  const video_cb002_9x16 = await uploadVideo(
    path.join(cb002Path, 'fl_vid_para_malua_freddy_match_v01_9x16.mp4'),
    'CB002 Para 9x16'
  );
  const video_cb002_4x5 = await uploadVideo(
    path.join(cb002Path, 'fl_vid_para_malua_freddy_match_v01_4x5.mp4'),
    'CB002 Para 4x5'
  );
  const video_cb005_9x16 = await uploadVideo(
    path.join(cb005Path, 'fl_vid_besoka_freddy_walk_v01_9x16.mp4'),
    'CB005 Besoka 9x16'
  );
  const video_cb005_4x5 = await uploadVideo(
    path.join(cb005Path, 'fl_vid_besoka_freddy_walk_v01_4x5.mp4'),
    'CB005 Besoka 4x5'
  );
  
  console.log('\n⏳ Väntar på video-processning (20 sek)...');
  await new Promise(resolve => setTimeout(resolve, 20000));
  
  // 5. Hämta thumbnails
  console.log('\n🖼️  Hämtar thumbnails...');
  const thumb_cb002_9x16 = await getVideoThumbnail(video_cb002_9x16);
  const thumb_cb002_4x5 = await getVideoThumbnail(video_cb002_4x5);
  const thumb_cb005_9x16 = await getVideoThumbnail(video_cb005_9x16);
  const thumb_cb005_4x5 = await getVideoThumbnail(video_cb005_4x5);
  console.log('   ✅ Thumbnails hämtade');
  
  // 6. Läs copy
  console.log('\n📝 Läser copy...');
  const copyCb002 = parseCopy(path.join(__dirname, '..', 'flocken_ads', 'creative_bases', 'cb002', 'copy.md'));
  const copyCb005 = parseCopy(path.join(__dirname, '..', 'flocken_ads', 'creative_bases', 'cb005', 'copy.md'));
  
  console.log(`   CB002: ${copyCb002.primaryTexts.length} primary texts, ${copyCb002.headlines.length} headlines`);
  console.log(`   CB005: ${copyCb005.primaryTexts.length} primary texts, ${copyCb005.headlines.length} headlines`);
  
  // 7. Skapa Dynamic Creative ads
  console.log('\n' + '='.repeat(80));
  console.log('📢 Skapar Dynamic Creative ads...');
  console.log('='.repeat(80));
  
  // CB002 Para - 9x16
  await createDynamicCreativeAd({
    name: 'ad_h01a_cb002_dco_9x16_hk_para_cid001',
    adsetId: adsetPara,
    videoId: video_cb002_9x16,
    thumbnailUrl: thumb_cb002_9x16,
    primaryTexts: copyCb002.primaryTexts,
    headlines: copyCb002.headlines,
    descriptions: copyCb002.descriptions.length > 0 ? copyCb002.descriptions : ['Gratis att testa'],
    utmCampaign: 'h01_para_cid001',
  });
  
  // CB002 Para - 4x5
  await createDynamicCreativeAd({
    name: 'ad_h01a_cb002_dco_4x5_hk_para_cid001',
    adsetId: adsetPara,
    videoId: video_cb002_4x5,
    thumbnailUrl: thumb_cb002_4x5,
    primaryTexts: copyCb002.primaryTexts,
    headlines: copyCb002.headlines,
    descriptions: copyCb002.descriptions.length > 0 ? copyCb002.descriptions : ['Gratis att testa'],
    utmCampaign: 'h01_para_cid001',
  });
  
  // CB005 Besoka - 9x16
  await createDynamicCreativeAd({
    name: 'ad_h01a_cb005_dco_9x16_hk_besoka_cid001',
    adsetId: adsetBesoka,
    videoId: video_cb005_9x16,
    thumbnailUrl: thumb_cb005_9x16,
    primaryTexts: copyCb005.primaryTexts,
    headlines: copyCb005.headlines,
    descriptions: copyCb005.descriptions.length > 0 ? copyCb005.descriptions : ['Gratis att testa'],
    utmCampaign: 'h01_besoka_cid001',
  });
  
  // CB005 Besoka - 4x5
  await createDynamicCreativeAd({
    name: 'ad_h01a_cb005_dco_4x5_hk_besoka_cid001',
    adsetId: adsetBesoka,
    videoId: video_cb005_4x5,
    thumbnailUrl: thumb_cb005_4x5,
    primaryTexts: copyCb005.primaryTexts,
    headlines: copyCb005.headlines,
    descriptions: copyCb005.descriptions.length > 0 ? copyCb005.descriptions : ['Gratis att testa'],
    utmCampaign: 'h01_besoka_cid001',
  });
  
  // Sammanfattning
  console.log('\n' + '='.repeat(80));
  console.log('✅ KLART! Dynamic Creative-struktur skapad');
  console.log('='.repeat(80));
  console.log(`
📋 Struktur:

Campaign: c_flo_swe_init_dogowner_inst_h01_cid001
├── Ad Set: as_para_swe_opt_lpv_cid001 (${adsetPara})
│   ├── Ad: 9x16 video + 5 primary texts + 5 headlines
│   └── Ad: 4x5 video + 5 primary texts + 5 headlines
│
└── Ad Set: as_besoka_swe_opt_lpv_cid001 (${adsetBesoka})
    ├── Ad: 9x16 video + 2 primary texts + 5 headlines
    └── Ad: 4x5 video + 2 primary texts + 5 headlines

🔗 Meta Ads Manager:
   https://business.facebook.com/adsmanager/manage/campaigns?act=${AD_ACCOUNT_ID.replace('act_', '')}

⚠️  Alla ads skapade som PAUSED - aktivera manuellt.
  `);
}

main().catch(err => {
  console.error('❌ Fel:', err.message);
  process.exit(1);
});
