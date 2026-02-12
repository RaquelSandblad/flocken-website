// Uppdatera annonser med korrekta primärtexter
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
const AD_ACCOUNT_ID = 'act_1648246706340725';
const PAGE_ID = '936579286197312';
const LANDING_PAGE = 'https://flocken.info/valkommen';
const DISPLAY_LINK = 'flocken.info/om-appen';

// Korrekta primärtexter
const PRIMARY_TEXT_V01 = `🐾 Flocken – appen för ett enklare liv som hundägare 

Hitta lekkamrater, parningspartners och hundvakter.
Upptäck hundvänliga caféer och restauranger nära dig.
Logga promenader och samla poäng längs vägen.

Kontakta andra hundägare direkt i appen.

Ladda ner Flocken nu
Gratis premium i 6 månader när du skapar konto före 28 februari 🎉`;

const PRIMARY_TEXT_V02 = `Appen för alla hundägare 🐶

Para, passa, rasta och besöka – allt i samma app.

Filtrera på ras, storlek, kön och område.
Hitta hundar som matchar din och ta kontakt direkt.

Ladda ner Flocken före 28 februari
✔️ Få gratis premium i 6 månader.
✔️ Inga betalningsuppgifter krävs`;

// Headlines
const HEADLINE_V01 = 'Hela hundlivet i en app';
const HEADLINE_V02 = 'Gå med i Flocken nu';
const DESCRIPTION = 'Gratis att testa';

// Ad sets och videos
const ADSET_PARA = '120239835157500455';
const ADSET_BESOKA = '120239835158880455';

const VIDEOS = {
  cb002_9x16: '900158252492547',
  cb002_4x5: '1365736635297866',
  cb005_9x16: '1429367792031101',
  cb005_4x5: '917764604256281',
};

// Befintliga ads att ta bort
const OLD_ADS = [
  '120239835616190455', '120239835625210455', '120239835634770455', '120239835647510455',
  '120239835655240455', '120239835658800455', '120239835660690455', '120239835662620455',
];

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

async function main() {
  console.log('='.repeat(70));
  console.log('🐕 Flocken - Uppdaterar annonser med korrekt copy');
  console.log('='.repeat(70));
  
  // 1. Ta bort gamla annonser
  console.log('\n🗑️  Tar bort gamla annonser...');
  for (const adId of OLD_ADS) {
    const result = await makeRequest(`/${adId}`, 'DELETE');
    if (result.success) {
      console.log(`   ✅ Borttagen: ${adId}`);
    }
  }
  
  // 2. Hämta thumbnails
  console.log('\n🖼️  Hämtar thumbnails...');
  const thumbnails = {
    cb002_9x16: await getVideoThumbnail(VIDEOS.cb002_9x16),
    cb002_4x5: await getVideoThumbnail(VIDEOS.cb002_4x5),
    cb005_9x16: await getVideoThumbnail(VIDEOS.cb005_9x16),
    cb005_4x5: await getVideoThumbnail(VIDEOS.cb005_4x5),
  };
  console.log('   ✅ Klart');
  
  // 3. Skapa nya annonser
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
    primaryText: PRIMARY_TEXT_V01,
    headline: HEADLINE_V01,
    description: DESCRIPTION,
    utmCampaign: 'h01_para_cid001',
  }));
  
  // CB002 - 9x16 - v02
  createdAds.push(await createVideoAd({
    name: 'ad_h01a_cb002_v02_9x16_hk_para_cid001',
    adsetId: ADSET_PARA,
    videoId: VIDEOS.cb002_9x16,
    thumbnailUrl: thumbnails.cb002_9x16,
    primaryText: PRIMARY_TEXT_V02,
    headline: HEADLINE_V02,
    description: DESCRIPTION,
    utmCampaign: 'h01_para_cid001',
  }));
  
  // CB002 - 4x5 - v01
  createdAds.push(await createVideoAd({
    name: 'ad_h01a_cb002_v01_4x5_hk_para_cid001',
    adsetId: ADSET_PARA,
    videoId: VIDEOS.cb002_4x5,
    thumbnailUrl: thumbnails.cb002_4x5,
    primaryText: PRIMARY_TEXT_V01,
    headline: HEADLINE_V01,
    description: DESCRIPTION,
    utmCampaign: 'h01_para_cid001',
  }));
  
  // CB002 - 4x5 - v02
  createdAds.push(await createVideoAd({
    name: 'ad_h01a_cb002_v02_4x5_hk_para_cid001',
    adsetId: ADSET_PARA,
    videoId: VIDEOS.cb002_4x5,
    thumbnailUrl: thumbnails.cb002_4x5,
    primaryText: PRIMARY_TEXT_V02,
    headline: HEADLINE_V02,
    description: DESCRIPTION,
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
    primaryText: PRIMARY_TEXT_V01,
    headline: HEADLINE_V01,
    description: DESCRIPTION,
    utmCampaign: 'h01_besoka_cid001',
  }));
  
  // CB005 - 9x16 - v02
  createdAds.push(await createVideoAd({
    name: 'ad_h01a_cb005_v02_9x16_hk_besoka_cid001',
    adsetId: ADSET_BESOKA,
    videoId: VIDEOS.cb005_9x16,
    thumbnailUrl: thumbnails.cb005_9x16,
    primaryText: PRIMARY_TEXT_V02,
    headline: HEADLINE_V02,
    description: DESCRIPTION,
    utmCampaign: 'h01_besoka_cid001',
  }));
  
  // CB005 - 4x5 - v01
  createdAds.push(await createVideoAd({
    name: 'ad_h01a_cb005_v01_4x5_hk_besoka_cid001',
    adsetId: ADSET_BESOKA,
    videoId: VIDEOS.cb005_4x5,
    thumbnailUrl: thumbnails.cb005_4x5,
    primaryText: PRIMARY_TEXT_V01,
    headline: HEADLINE_V01,
    description: DESCRIPTION,
    utmCampaign: 'h01_besoka_cid001',
  }));
  
  // CB005 - 4x5 - v02
  createdAds.push(await createVideoAd({
    name: 'ad_h01a_cb005_v02_4x5_hk_besoka_cid001',
    adsetId: ADSET_BESOKA,
    videoId: VIDEOS.cb005_4x5,
    thumbnailUrl: thumbnails.cb005_4x5,
    primaryText: PRIMARY_TEXT_V02,
    headline: HEADLINE_V02,
    description: DESCRIPTION,
    utmCampaign: 'h01_besoka_cid001',
  }));
  
  const successful = createdAds.filter(Boolean).length;
  
  console.log('\n' + '='.repeat(70));
  console.log(`✅ KLART! Skapade ${successful}/8 annonser med korrekt copy`);
  console.log('='.repeat(70));
  
  console.log('\n📝 Primärtext v01:');
  console.log('-'.repeat(50));
  console.log(PRIMARY_TEXT_V01);
  
  console.log('\n📝 Primärtext v02:');
  console.log('-'.repeat(50));
  console.log(PRIMARY_TEXT_V02);
  
  console.log('\n🔗 Meta Ads Manager:');
  console.log('   https://business.facebook.com/adsmanager/manage/campaigns?act=1648246706340725');
}

main().catch(err => {
  console.error('❌ Fel:', err.message);
  process.exit(1);
});
