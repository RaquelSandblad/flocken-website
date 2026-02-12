// Skapa nytt ad set för puppies_nursing videos med p06/h06/d03
const https = require('https');
const fs = require('fs');
const path = require('path');

// Läs env
let envVars = {};
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const m = trimmed.match(/^([^#=]+)=(.*)$/);
      if (m) envVars[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '');
    }
  });
}

const token = envVars.META_ACCESS_TOKEN || envVars.META_ADS_API_TOKEN;
const AD_ACCOUNT_ID = 'act_1648246706340725';
const PAGE_ID = '936579286197312';
const CAMPAIGN_ID = '120239834352180455';

// Ny copy (p06, h06, d03)
const PRIMARY_TEXT = `Gå med i Flocken och ta hunden med dig.
Flocken är appen för alla hundälskare 🐶

Lägg upp information om din hund.
📍Hitta andra hundar på kartan.

Vi vill hjälpa Sveriges alla hundälskare att hitta varandra och att förenkla livet med hund.

I appen:
☕ Hundvänliga caféer och verksamheter nära dig
🐕‍🦺 Registrera dina rastrundor.
🏠 Hitta en hundvakt när du behöver.

Ladda ner Flocken gratis.
Just nu 6 månaders gratis premium (gäller till 28 februari).`;

const HEADLINE = 'Gå med i Flocken - lägg upp din hund';
const DESCRIPTION = 'Appen för hundälskare';
const LANDING_PAGE = 'https://flocken.info/valkommen';
const DISPLAY_LINK = 'flocken.info/om-appen';

// Videos att använda (9x16 för stories, 1x1 för feed)
const VIDEOS = [
  {
    path: path.join(__dirname, '..', 'flocken_ads', 'creative_bases', 'cb002', 'assets', 'vid', 'fl_vid_para_puppies_nursing_v01_9x16.mp4'),
    format: '9x16',
    variant: 'v01',
  },
  {
    path: path.join(__dirname, '..', 'flocken_ads', 'creative_bases', 'cb002', 'assets', 'vid', 'fl_vid_para_puppies_nursing_v01_1x1.mp4'),
    format: '1x1',
    variant: 'v01',
  },
];

// Ad set namn enligt konvention
const ADSET_NAME = 'as_para_puppies_swe_opt_lpv_cid001';

function makeRequest(urlPath, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(`https://graph.facebook.com/v21.0${urlPath}`);
    url.searchParams.set('access_token', token);
    const postData = data ? JSON.stringify(data) : null;
    const options = { method, headers: { 'Content-Type': 'application/json' } };
    const req = https.request(url, options, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(d);
          if (parsed.error) {
            console.error('API Error:', parsed.error.message);
            if (parsed.error.error_user_msg) console.error('User msg:', parsed.error.error_user_msg);
          }
          resolve(parsed);
        } catch (e) {
          resolve({ error: d });
        }
      });
    });
    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

function uploadVideo(videoPath) {
  return new Promise((resolve, reject) => {
    const videoBuffer = fs.readFileSync(videoPath);
    const boundary = '----FormBoundary' + Math.random().toString(36).substr(2);
    
    let body = '';
    body += `--${boundary}\r\n`;
    body += `Content-Disposition: form-data; name="access_token"\r\n\r\n`;
    body += `${token}\r\n`;
    body += `--${boundary}\r\n`;
    body += `Content-Disposition: form-data; name="source"; filename="${path.basename(videoPath)}"\r\n`;
    body += `Content-Type: video/mp4\r\n\r\n`;
    
    const bodyStart = Buffer.from(body, 'utf8');
    const bodyEnd = Buffer.from(`\r\n--${boundary}--\r\n`, 'utf8');
    const fullBody = Buffer.concat([bodyStart, videoBuffer, bodyEnd]);
    
    const req = https.request({
      hostname: 'graph-video.facebook.com',
      path: `/v21.0/${AD_ACCOUNT_ID}/advideos`,
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': fullBody.length,
      },
    }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(d);
          if (parsed.error) {
            console.error('Upload Error:', parsed.error.message);
          }
          resolve(parsed);
        } catch (e) {
          resolve({ error: d });
        }
      });
    });
    req.on('error', reject);
    req.write(fullBody);
    req.end();
  });
}

async function getThumbnail(videoId) {
  // Vänta på processning
  await new Promise(r => setTimeout(r, 15000));
  const thumbs = await makeRequest(`/${videoId}/thumbnails?fields=uri,is_preferred`);
  if (thumbs.data && thumbs.data.length > 0) {
    return thumbs.data.find(t => t.is_preferred)?.uri || thumbs.data[0].uri;
  }
  return null;
}

async function main() {
  console.log('='.repeat(60));
  console.log('🐶 Skapar nytt ad set för puppies_nursing videos');
  console.log('='.repeat(60));
  
  // 1. Skapa ad set
  console.log('\n📦 Skapar ad set...');
  const adsetResult = await makeRequest(`/${AD_ACCOUNT_ID}/adsets`, 'POST', {
    name: ADSET_NAME,
    campaign_id: CAMPAIGN_ID,
    daily_budget: 5000,  // 50 SEK
    billing_event: 'IMPRESSIONS',
    optimization_goal: 'LANDING_PAGE_VIEWS',
    bid_strategy: 'LOWEST_COST_WITHOUT_CAP',
    targeting: {
      geo_locations: { countries: ['SE'] },
      age_min: 18,
      age_max: 65,
      device_platforms: ['mobile'],
      user_os: ['Android'],
      user_device: ['Android_Smartphone', 'Android_Tablet'],
    },
    status: 'PAUSED',
  });
  
  if (adsetResult.error) {
    console.error('❌ Kunde inte skapa ad set');
    return;
  }
  
  const adsetId = adsetResult.id;
  console.log(`   ✅ Ad set skapat: ${adsetId}`);
  console.log(`   Namn: ${ADSET_NAME}`);
  
  // 2. Ladda upp videos och skapa ads
  console.log('\n🎬 Laddar upp videos och skapar annonser...');
  
  for (const video of VIDEOS) {
    console.log(`\n   📹 Laddar upp ${path.basename(video.path)}...`);
    
    // Kolla att filen finns
    if (!fs.existsSync(video.path)) {
      console.error(`   ❌ Filen finns inte: ${video.path}`);
      continue;
    }
    
    // Ladda upp video
    const uploadResult = await uploadVideo(video.path);
    if (!uploadResult.id) {
      console.error('   ❌ Upload misslyckades');
      continue;
    }
    const videoId = uploadResult.id;
    console.log(`   ✅ Video uppladdad: ${videoId}`);
    
    // Hämta thumbnail
    console.log('   ⏳ Väntar på thumbnail...');
    const thumbnailUrl = await getThumbnail(videoId);
    if (!thumbnailUrl) {
      console.error('   ❌ Kunde inte hämta thumbnail');
      continue;
    }
    console.log('   ✅ Thumbnail hämtad');
    
    // Skapa ad namn
    const adName = `ad_h01a_cb002_v06_${video.format}_hk_para_puppies_cid001`;
    const utmUrl = `${LANDING_PAGE}?utm_source=meta&utm_medium=paid_social&utm_campaign=${ADSET_NAME}&utm_content=${adName}`;
    
    // Skapa creative
    console.log('   📝 Skapar creative...');
    const creativeResult = await makeRequest(`/${AD_ACCOUNT_ID}/adcreatives`, 'POST', {
      name: `${adName} Creative`,
      object_story_spec: {
        page_id: PAGE_ID,
        video_data: {
          video_id: videoId,
          image_url: thumbnailUrl,
          title: HEADLINE,
          message: PRIMARY_TEXT,
          link_description: DESCRIPTION,
          call_to_action: {
            type: 'DOWNLOAD',
            value: {
              link: utmUrl,
              link_caption: DISPLAY_LINK,
            },
          },
        },
      },
    });
    
    if (!creativeResult.id) {
      console.error('   ❌ Creative misslyckades');
      continue;
    }
    console.log(`   ✅ Creative skapat: ${creativeResult.id}`);
    
    // Skapa ad
    console.log('   🎯 Skapar annons...');
    const adResult = await makeRequest(`/${AD_ACCOUNT_ID}/ads`, 'POST', {
      name: adName,
      adset_id: adsetId,
      creative: { creative_id: creativeResult.id },
      status: 'PAUSED',
    });
    
    if (adResult.id) {
      console.log(`   ✅ Annons skapad: ${adName}`);
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('✅ KLART!');
  console.log('='.repeat(60));
  console.log(`
📦 Nytt ad set: ${ADSET_NAME}
💰 Budget: 50 SEK/dag
📱 Targeting: Android, Sverige, 18-65
🎯 Optimering: Landing Page Views
📝 Copy: p06 + h06 + d03

⚠️  Status: PAUSED - aktivera när redo med:
    node scripts/activate-adset-puppies.js
  `);
}

main();
