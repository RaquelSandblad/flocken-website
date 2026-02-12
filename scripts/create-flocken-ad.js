// Script för att skapa en Flocken ad med video
// Baserat på NastaHem's beprövade workflow

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

const ACCESS_TOKEN = 
  process.env.META_ACCESS_TOKEN || 
  envVars.META_ACCESS_TOKEN || 
  envVars.META_ADS_API_TOKEN ||
  envVars.META_MARKETING_API_TOKEN;

const AD_ACCOUNT_ID = 
  process.env.META_AD_ACCOUNT_ID ||
  envVars.META_AD_ACCOUNT_ID ||
  'act_1648246706340725';

const PAGE_ID = '936579286197312'; // Flocken Facebook Page
const LANDING_PAGE = 'https://flocken.info/valkommen';

if (!ACCESS_TOKEN) {
  console.error('❌ Ingen access token hittad!');
  process.exit(1);
}

// API helper
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
            console.error('API Error:', JSON.stringify(parsed.error, null, 2));
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
    if (postData) req.write(postData);
    req.end();
  });
}

// Ladda upp video via file_url (enklare approach)
async function uploadVideo(videoPath, title) {
  console.log(`\n🎬 Laddar upp video: ${title}...`);
  
  if (!fs.existsSync(videoPath)) {
    throw new Error(`Video ej funnen: ${videoPath}`);
  }
  
  const fileSize = fs.statSync(videoPath).size;
  console.log(`   Storlek: ${(fileSize / 1024 / 1024).toFixed(2)} MB`);
  
  // Starta upload session
  const startResult = await makeRequest(
    `/${AD_ACCOUNT_ID}/advideos`,
    'POST',
    {
      upload_phase: 'start',
      file_size: fileSize,
    }
  );
  
  const uploadSessionId = startResult.upload_session_id;
  const videoId = startResult.video_id;
  console.log(`   Session: ${uploadSessionId}`);
  console.log(`   Video ID: ${videoId}`);
  
  // Ladda upp i chunks
  const chunkSize = 4 * 1024 * 1024; // 4MB chunks
  const videoBuffer = fs.readFileSync(videoPath);
  let startOffset = 0;
  
  while (startOffset < fileSize) {
    const endOffset = Math.min(startOffset + chunkSize, fileSize);
    const chunk = videoBuffer.slice(startOffset, endOffset);
    
    console.log(`   Uploading ${startOffset}-${endOffset} of ${fileSize}...`);
    
    // För chunk upload behöver vi multipart form
    const formData = new URLSearchParams();
    formData.append('upload_phase', 'transfer');
    formData.append('upload_session_id', uploadSessionId);
    formData.append('start_offset', startOffset.toString());
    formData.append('video_file_chunk', chunk.toString('base64'));
    formData.append('access_token', ACCESS_TOKEN);
    
    const transferResult = await new Promise((resolve, reject) => {
      const req = https.request({
        hostname: 'graph-video.facebook.com',
        path: `/v21.0/${AD_ACCOUNT_ID}/advideos`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(e);
          }
        });
      });
      req.on('error', reject);
      req.write(formData.toString());
      req.end();
    });
    
    if (transferResult.error) {
      console.error('Transfer error:', transferResult.error);
      throw new Error(transferResult.error.message);
    }
    
    startOffset = parseInt(transferResult.start_offset) || endOffset;
  }
  
  // Finish upload
  const finishResult = await makeRequest(
    `/${AD_ACCOUNT_ID}/advideos`,
    'POST',
    {
      upload_phase: 'finish',
      upload_session_id: uploadSessionId,
      title: title,
    }
  );
  
  console.log(`   ✅ Video uppladdad! ID: ${videoId}`);
  
  // Vänta på att videon ska processas
  console.log('   ⏳ Väntar på video-processning...');
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  return videoId;
}

// Enklare: Ladda upp video med raw bytes
async function uploadVideoSimple(videoPath, title) {
  console.log(`\n🎬 Laddar upp video: ${title}...`);
  
  if (!fs.existsSync(videoPath)) {
    throw new Error(`Video ej funnen: ${videoPath}`);
  }
  
  const fileSize = fs.statSync(videoPath).size;
  console.log(`   Storlek: ${(fileSize / 1024 / 1024).toFixed(2)} MB`);
  
  // Använd source parameter med base64
  const videoBuffer = fs.readFileSync(videoPath);
  
  // Om filen är för stor, använd file_url approach istället
  if (fileSize > 100 * 1024 * 1024) {
    throw new Error('Video är för stor (>100MB). Använd en mindre fil.');
  }
  
  // POST med multipart form-data
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
            console.error('Upload error:', result.error);
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

// Hämta video thumbnails
async function getVideoThumbnails(videoId) {
  console.log(`\n🖼️  Hämtar video thumbnails...`);
  
  const result = await makeRequest(
    `/${videoId}/thumbnails?fields=uri,id,is_preferred`
  );
  
  if (result.data && result.data.length > 0) {
    // Hitta preferred eller första
    const preferred = result.data.find(t => t.is_preferred) || result.data[0];
    console.log(`   ✅ Thumbnail hittad: ${preferred.uri}`);
    return preferred.uri;
  }
  
  return null;
}

// Skapa ad creative med video
async function createVideoCreative(config) {
  console.log(`\n🎨 Skapar video ad creative...`);
  
  // Build URL with UTM
  const utmParams = new URLSearchParams({
    utm_source: 'meta',
    utm_medium: 'paid_social',
    utm_campaign: config.campaign_name || 'flocken_h01',
    utm_content: config.ad_name,
  });
  const finalUrl = `${LANDING_PAGE}?${utmParams.toString()}`;
  
  const videoData = {
    video_id: config.video_id,
    title: config.headline,
    message: config.primary_text,
    link_description: config.description || '',
    call_to_action: {
      type: 'DOWNLOAD',
      value: { link: finalUrl }
    },
  };
  
  // Lägg till thumbnail om vi har en
  if (config.thumbnail_url) {
    videoData.image_url = config.thumbnail_url;
  }
  
  const creativeData = {
    name: `${config.ad_name} Creative`,
    object_story_spec: {
      page_id: PAGE_ID,
      video_data: videoData,
    },
  };
  
  const result = await makeRequest(
    `/${AD_ACCOUNT_ID}/adcreatives`,
    'POST',
    creativeData
  );
  
  console.log(`   ✅ Creative skapad! ID: ${result.id}`);
  return result.id;
}

// Skapa ad
async function createAd(config) {
  console.log(`\n🚀 Skapar ad: ${config.name}...`);
  
  const result = await makeRequest(
    `/${AD_ACCOUNT_ID}/ads`,
    'POST',
    {
      name: config.name,
      adset_id: config.adset_id,
      creative: { creative_id: config.creative_id },
      status: 'PAUSED',
    }
  );
  
  console.log(`   ✅ Ad skapad! ID: ${result.id}`);
  return result.id;
}

// Main
async function createFlockenAd() {
  console.log('='.repeat(80));
  console.log('🐕 Flocken Meta Ad Creator');
  console.log('='.repeat(80));
  
  const adSetId = process.argv[2];
  const cid = process.argv[3] || '001';
  
  if (!adSetId) {
    console.log('\n📝 Användning:');
    console.log('   node create-flocken-ad.js <adset_id> [cid]');
    console.log('\nExempel:');
    console.log('   node create-flocken-ad.js 120239834356860455 001');
    process.exit(0);
  }
  
  // CB002 Para - video ad
  const videoPath = path.join(__dirname, '..', 'flocken_ads', 'creative_bases', 'cb002', 'assets', 'vid', 'fl_vid_para_malua_freddy_match_v01_9x16.mp4');
  
  // Copy från CB002
  const headline = 'Flocken – appen för hundägare';
  const primaryText = `🐾 Flocken – appen för ett enklare liv som hundägare

Hitta lekkamrater, parningspartners och hundvakter.
Upptäck hundvänliga caféer och restauranger nära dig.
Logga promenader och samla poäng längs vägen.

Kontakta andra hundägare direkt i appen.

Ladda ner Flocken nu
Gratis premium i 6 månader när du skapar konto!`;
  
  const description = 'Hitta lekkamrater, hundvakter och hundvänliga platser';
  
  // Ad name enligt spec
  const adName = `ad_h01a_cb002_v01_hk_para_src_ai_cid${cid}`;
  
  console.log(`\n📋 Ad Configuration:`);
  console.log(`   Ad Set ID: ${adSetId}`);
  console.log(`   CID: ${cid}`);
  console.log(`   Ad Name: ${adName}`);
  console.log(`   Video: ${path.basename(videoPath)}`);
  
  try {
    // 1. Ladda upp video
    const videoId = await uploadVideoSimple(videoPath, 'Flocken Para - Malua & Freddy Match');
    
    // Vänta på video-processning
    console.log('\n⏳ Väntar på video-processning (15 sek)...');
    await new Promise(resolve => setTimeout(resolve, 15000));
    
    // 2. Hämta thumbnail
    let thumbnailUrl = null;
    try {
      thumbnailUrl = await getVideoThumbnails(videoId);
    } catch (e) {
      console.log('   ⚠️  Kunde inte hämta thumbnail, fortsätter ändå...');
    }
    
    // 3. Skapa creative
    const creativeId = await createVideoCreative({
      video_id: videoId,
      ad_name: adName,
      headline: headline,
      primary_text: primaryText,
      description: description,
      campaign_name: 'h01_cid' + cid,
      thumbnail_url: thumbnailUrl,
    });
    
    // 4. Skapa ad
    const adId = await createAd({
      name: adName,
      adset_id: adSetId,
      creative_id: creativeId,
    });
    
    console.log('\n' + '='.repeat(80));
    console.log('✅ SUCCESS! Flocken ad skapad!');
    console.log('='.repeat(80));
    console.log(`\n📋 Summary:`);
    console.log(`   Video ID: ${videoId}`);
    console.log(`   Creative ID: ${creativeId}`);
    console.log(`   Ad ID: ${adId}`);
    console.log(`   Ad Name: ${adName}`);
    console.log(`\n🔗 Meta Ads Manager:`);
    console.log(`   https://business.facebook.com/adsmanager/manage/ads?act=${AD_ACCOUNT_ID.replace('act_', '')}`);
    console.log('\n⚠️  Ad skapad som PAUSED - aktivera manuellt när du är redo.');
    console.log('='.repeat(80));
    
  } catch (error) {
    console.error('\n❌ Fel:', error.message);
    process.exit(1);
  }
}

createFlockenAd();
