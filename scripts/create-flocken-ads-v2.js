// Script för att skapa Flocken ads med alla copy-varianter
// v2 - Stödjer flera varianter, display link, och LANDING_PAGE_VIEWS

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
const LANDING_PAGE = 'https://flocken.info/valkommen';
const DISPLAY_LINK = 'flocken.info/om-appen';

if (!ACCESS_TOKEN) {
  console.error('❌ Ingen access token hittad!');
  process.exit(1);
}

function makeRequest(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(`https://graph.facebook.com/v21.0${path}`);
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
            console.error('API Error:', JSON.stringify(parsed.error, null, 2));
            reject(new Error(`Meta API Error: ${parsed.error.message}`));
          } else {
            resolve(parsed);
          }
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
  console.log(`\n🎬 Laddar upp video: ${path.basename(videoPath)}...`);
  
  if (!fs.existsSync(videoPath)) {
    throw new Error(`Video ej funnen: ${videoPath}`);
  }
  
  const fileSize = fs.statSync(videoPath).size;
  console.log(`   Storlek: ${(fileSize / 1024 / 1024).toFixed(2)} MB`);
  
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
            console.log(`   ✅ Video uppladdad! ID: ${result.id}`);
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
  console.log(`   🖼️  Hämtar thumbnail...`);
  const result = await makeRequest(`/${videoId}/thumbnails?fields=uri,is_preferred`);
  if (result.data && result.data.length > 0) {
    const preferred = result.data.find(t => t.is_preferred) || result.data[0];
    console.log(`   ✅ Thumbnail hittad`);
    return preferred.uri;
  }
  return null;
}

// Skapa video creative med display link
async function createVideoCreative(config) {
  console.log(`\n🎨 Skapar creative för variant ${config.variant}...`);
  
  const utmParams = new URLSearchParams({
    utm_source: 'meta',
    utm_medium: 'paid_social',
    utm_campaign: `h${config.hypotes}_cid${config.cid}`,
    utm_content: config.adName,
  });
  const finalUrl = `${LANDING_PAGE}?${utmParams.toString()}`;
  
  const videoData = {
    video_id: config.videoId,
    title: config.headline,
    message: config.primaryText,
    link_description: config.description || '',
    call_to_action: {
      type: 'DOWNLOAD',
      value: { link: finalUrl }
    },
  };
  
  // Lägg till thumbnail
  if (config.thumbnailUrl) {
    videoData.image_url = config.thumbnailUrl;
  }
  
  const creativeData = {
    name: `${config.adName} Creative`,
    object_story_spec: {
      page_id: PAGE_ID,
      video_data: videoData,
    },
  };
  
  // Lägg till display link via URL tags
  if (config.displayLink) {
    creativeData.url_tags = `display_link=${encodeURIComponent(config.displayLink)}`;
  }
  
  const result = await makeRequest(`/${AD_ACCOUNT_ID}/adcreatives`, 'POST', creativeData);
  console.log(`   ✅ Creative skapad! ID: ${result.id}`);
  return result.id;
}

// Skapa ad
async function createAd(config) {
  console.log(`\n🚀 Skapar ad: ${config.name}...`);
  const result = await makeRequest(`/${AD_ACCOUNT_ID}/ads`, 'POST', {
    name: config.name,
    adset_id: config.adsetId,
    creative: { creative_id: config.creativeId },
    status: 'PAUSED',
  });
  console.log(`   ✅ Ad skapad! ID: ${result.id}`);
  return result.id;
}

// Parsa copy.md för att extrahera alla varianter
// Hanterar två format:
// 1. CB002-format: "p01: Headline\n\nBody text..."
// 2. CB005-format: "p01: Full text" + separate "## Headlines" section
function parseCopyVariants(copyPath) {
  const content = fs.readFileSync(copyPath, 'utf8');
  const variants = [];
  
  // Kolla om det finns separata Headlines-sektion (CB005-format)
  const hasHeadlinesSection = content.includes('## Headlines');
  
  if (hasHeadlinesSection) {
    // CB005-format: Extrahera primary texts, headlines och descriptions separat
    const primaryTexts = [];
    const headlines = [];
    const descriptions = [];
    
    // Primary texts
    const primaryMatch = content.match(/## Primary text\s*\n([\s\S]*?)(?=##|$)/);
    if (primaryMatch) {
      const lines = primaryMatch[1].split('\n').filter(l => l.match(/^p\d{2}:/));
      lines.forEach(line => {
        const m = line.match(/^p(\d{2}):\s*(.+)/);
        if (m) primaryTexts.push({ num: m[1], text: m[2].trim() });
      });
    }
    
    // Headlines
    const headlineMatch = content.match(/## Headlines\s*\n([\s\S]*?)(?=##|$)/);
    if (headlineMatch) {
      const lines = headlineMatch[1].split('\n').filter(l => l.match(/^h\d{2}:/));
      lines.forEach(line => {
        const m = line.match(/^h(\d{2}):\s*(.+)/);
        if (m) headlines.push({ num: m[1], text: m[2].trim() });
      });
    }
    
    // Descriptions
    const descMatch = content.match(/## Descriptions\s*\n([\s\S]*?)(?=##|$)/);
    if (descMatch) {
      const lines = descMatch[1].split('\n').filter(l => l.match(/^d\d{2}:/));
      lines.forEach(line => {
        const m = line.match(/^d(\d{2}):\s*(.+)/);
        if (m) descriptions.push(m[2].trim());
      });
    }
    
    // Kombinera - skapa en variant per primary text
    primaryTexts.forEach((pt, i) => {
      const headline = headlines[i % headlines.length]?.text || headlines[0]?.text || 'Ladda ner Flocken';
      const description = descriptions[i % descriptions.length] || descriptions[0] || '';
      
      variants.push({
        num: pt.num,
        headline: headline,
        primaryText: pt.text,
        description: description,
      });
    });
  } else {
    // CB002-format: Primary text med headline på första raden
    const sections = content.split(/(?=p\d{2}:)/);
    
    for (const section of sections) {
      const match = section.match(/^p(\d{2}):\s*(.+)/);
      if (!match) continue;
      
      const variantNum = match[1];
      const headline = match[2].trim();
      
      // Resten av sektionen är body
      const bodyStart = section.indexOf('\n');
      if (bodyStart === -1) continue;
      
      const bodyText = section.substring(bodyStart).trim();
      const bodyLines = bodyText.split('\n').filter(l => l.trim()).map(l => l.trim());
      const body = bodyLines.join('\n');
      
      variants.push({
        num: variantNum,
        headline: headline,
        primaryText: body ? `${headline}\n\n${body}` : headline,
      });
    }
  }
  
  return variants;
}

// Main
async function createFlockenAds() {
  console.log('='.repeat(80));
  console.log('🐕 Flocken Meta Ads Creator v2');
  console.log('   - Alla copy-varianter');
  console.log('   - Display link');
  console.log('   - LANDING_PAGE_VIEWS optimering');
  console.log('='.repeat(80));
  
  const cbNum = process.argv[2];
  const videoFile = process.argv[3];
  const adSetId = process.argv[4] || '120239834356860455';
  const cid = process.argv[5] || '001';
  const hypotes = process.argv[6] || '01';
  
  if (!cbNum || !videoFile) {
    console.log('\n📝 Användning:');
    console.log('   node create-flocken-ads-v2.js <cb_num> <video_file> [adset_id] [cid] [hypotes]');
    console.log('\nExempel:');
    console.log('   node create-flocken-ads-v2.js 2 fl_vid_para_malua_freddy_match_v01_9x16.mp4');
    console.log('   node create-flocken-ads-v2.js 2 fl_vid_para_malua_freddy_match_v01_4x5.mp4');
    console.log('   node create-flocken-ads-v2.js 5 fl_vid_besoka_v01_9x16.mp4');
    process.exit(0);
  }
  
  const cbPath = path.join(__dirname, '..', 'flocken_ads', 'creative_bases', `cb${cbNum.toString().padStart(3, '0')}`);
  const videoPath = path.join(cbPath, 'assets', 'vid', videoFile);
  const copyPath = path.join(cbPath, 'copy.md');
  
  if (!fs.existsSync(videoPath)) {
    console.error(`❌ Video ej funnen: ${videoPath}`);
    process.exit(1);
  }
  
  if (!fs.existsSync(copyPath)) {
    console.error(`❌ Copy.md ej funnen: ${copyPath}`);
    process.exit(1);
  }
  
  // Hook token baserat på CB
  const hookMap = {
    '001': 'all',
    '002': 'para',
    '003': 'passa',
    '004': 'rasta',
    '005': 'besoka',
  };
  const hookToken = hookMap[cbNum.toString().padStart(3, '0')] || 'all';
  
  console.log(`\n📋 Konfiguration:`);
  console.log(`   CB: ${cbNum.toString().padStart(3, '0')}`);
  console.log(`   Video: ${videoFile}`);
  console.log(`   Ad Set: ${adSetId}`);
  console.log(`   CID: ${cid}`);
  console.log(`   Hook: ${hookToken}`);
  console.log(`   Display Link: ${DISPLAY_LINK}`);
  
  try {
    // 1. Parsa copy-varianter
    const variants = parseCopyVariants(copyPath);
    console.log(`\n📝 Hittade ${variants.length} copy-varianter`);
    
    // 2. Ladda upp video
    const videoId = await uploadVideo(videoPath, `Flocken CB${cbNum.toString().padStart(3, '0')} - ${videoFile}`);
    
    // 3. Vänta på processning
    console.log('\n⏳ Väntar på video-processning (15 sek)...');
    await new Promise(resolve => setTimeout(resolve, 15000));
    
    // 4. Hämta thumbnail
    const thumbnailUrl = await getVideoThumbnail(videoId);
    
    // 5. Skapa ads för alla varianter
    const createdAds = [];
    
    for (const variant of variants) {
      const adName = `ad_h${hypotes}a_cb${cbNum.toString().padStart(3, '0')}_v${variant.num.padStart(2, '0')}_hk_${hookToken}_src_ai_cid${cid}`;
      
      console.log(`\n${'─'.repeat(60)}`);
      console.log(`📦 Variant ${variant.num}: ${variant.headline.substring(0, 40)}...`);
      
      // Skapa creative
      const creativeId = await createVideoCreative({
        videoId,
        thumbnailUrl,
        headline: variant.headline,
        primaryText: variant.primaryText,
        description: 'Ladda ner gratis',
        displayLink: DISPLAY_LINK,
        adName,
        hypotes,
        cid,
        variant: variant.num,
      });
      
      // Skapa ad
      const adId = await createAd({
        name: adName,
        adsetId: adSetId,
        creativeId,
      });
      
      createdAds.push({
        variant: variant.num,
        adName,
        adId,
        creativeId,
        headline: variant.headline,
      });
    }
    
    // Sammanfattning
    console.log('\n' + '='.repeat(80));
    console.log('✅ KLART! Skapade annonser:');
    console.log('='.repeat(80));
    console.log(`\n📋 Video ID: ${videoId}`);
    console.log(`\n📢 Ads skapade (${createdAds.length} st):\n`);
    
    createdAds.forEach(ad => {
      console.log(`   v${ad.variant}: ${ad.adName}`);
      console.log(`       ID: ${ad.adId}`);
      console.log(`       Headline: ${ad.headline.substring(0, 50)}...`);
      console.log('');
    });
    
    console.log(`\n🔗 Meta Ads Manager:`);
    console.log(`   https://business.facebook.com/adsmanager/manage/ads?act=${AD_ACCOUNT_ID.replace('act_', '')}`);
    console.log('\n⚠️  Alla ads skapade som PAUSED - aktivera manuellt.');
    console.log('='.repeat(80));
    
  } catch (error) {
    console.error('\n❌ Fel:', error.message);
    process.exit(1);
  }
}

createFlockenAds();
