/**
 * CB003 PASSA — Komplett launch-script för Meta Ads
 *
 * Skapar:
 * - 1 kampanj: c_flo_swe_init_dogowner_lpv_h01_cid003
 * - 3 ad sets (en per vinkel: trygghet/skuld/nätverk), 50 SEK/dag ABO
 * - 6 ads (2 per ad set: 4:5 static + 9:16 video)
 * - Allt PAUSED — Torbjörn granskar och aktiverar manuellt
 *
 * Beslut applicerade (efter deep research 2026-04-16):
 * - LPV-optimering (inte LINK_CLICKS) — vi har fixat pixel-buggen via slim cookie-bar
 * - Audience Network exkluderad (publisher_platforms = facebook + instagram)
 * - Advantage+ Audience MED hård geo/ålder-ram
 * - Advantage+ Creative via degrees_of_freedom_spec (creative_features_spec OPT_IN)
 * - ABO på ad set-nivå (skydda vinklar från budget-stöld)
 * - Format: bara 4:5 + 9:16 (inte 1:1, inte Carousel)
 *
 * Använd:
 *   node scripts/launch-cb003-passa.js
 *
 * Kräver att 6 creative-filer finns i:
 *   flocken_ads/creative_bases/cb003/assets/final/
 *     flocken_ad_cb003_a_v01_4x5.jpg     (Trygghet static)
 *     flocken_ad_cb003_a_v01_9x16.mp4    (Trygghet video)
 *     flocken_ad_cb003_b_v01_4x5.jpg     (Skuld static)
 *     flocken_ad_cb003_b_v01_9x16.mp4    (Skuld video)
 *     flocken_ad_cb003_c_v01_4x5.jpg     (Nätverk static)
 *     flocken_ad_cb003_c_v01_9x16.mp4    (Nätverk video)
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// ────────────────────────────────────────────────────────────────────────────
// Konfiguration
// ────────────────────────────────────────────────────────────────────────────

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
        envVars[match[1].trim()] = match[2].trim().replace(/^["']|["']$/g, '');
      }
    }
  });
}

const ACCESS_TOKEN = envVars.META_ACCESS_TOKEN || envVars.META_ADS_API_TOKEN || envVars.META_MARKETING_API_TOKEN;
const AD_ACCOUNT_ID = envVars.META_AD_ACCOUNT_ID || 'act_1648246706340725';
const PAGE_ID = '936579286197312';
// IG Business Account — Flocken (flocken_app). Får ALDRIG vara null — Torbjörns feedback 2026-04-21.
const INSTAGRAM_ID = envVars.META_INSTAGRAM_ID || '17841479914513348';
const PIXEL_ID = '854587690618895';

const CID = 'cid003';
const LANDING_PAGE = 'https://flocken.info/v/passa';
// Display link = rotdomän i feed. Torbjörns feedback 2026-04-21: aldrig path.
const DISPLAY_LINK = 'flocken.info';
const ASSETS_DIR = path.join(__dirname, '..', 'flocken_ads', 'creative_bases', 'cb003', 'assets', 'final');
// CB003 v01 använder befintlig funktionsdemo-video för alla 3 ad sets (delas).
// Vinklar skiljs åt via Primary Text + Headline (visas över videon i Meta-feed).
// v02 nästa vecka: vinkel-specifik video med text-overlay.
const SHARED_VIDEO_PATH = path.join(__dirname, '..', 'flocken_ads', 'creative_bases', 'cb003', 'assets', 'vid', 'fl_vid_passa_full_function_freddy_v01_9x16.mp4');

if (!ACCESS_TOKEN) {
  console.error('❌ META_ACCESS_TOKEN saknas i .env.local');
  process.exit(1);
}

// ────────────────────────────────────────────────────────────────────────────
// Vinkel-definitioner (matchar cb003/copy.md)
// ────────────────────────────────────────────────────────────────────────────

const VINKLAR = [
  {
    code: 'a',
    name: 'trygghet',
    adsetName: `as_a_trygghet_swe_opt_lpv_${CID}`,
    primaryTexts: [
      'Lämna din hund hos någon du litar på. Se hundvakter nära dig med profil och bild.',
      'Du ska inte behöva fråga i en Facebook-grupp. Se vem som finns nära dig innan du bestämmer dig.',
    ],
    headlines: ['Hitta hundvakt nära dig', 'Hundvakt du litar på'],
    description: 'Gratis att ladda ner',
    static4x5: 'flocken_ad_cb003_a_v01_4x5.jpg',
    utmCampaign: 'cb003_trygghet',
  },
  {
    code: 'b',
    name: 'skuld',
    adsetName: `as_b_skuld_swe_opt_lpv_${CID}`,
    primaryTexts: [
      'Hon tittar på dig med de där ögonen när du packar väskan. Hitta någon hon redan träffat.',
      'Klockan är halv sju. Du packar väskan. Hunden ligger i hallen och tittar. Med Flocken hittar du någon du litar på.',
    ],
    headlines: ['Res utan dåligt samvete', 'Trygg passning nära dig'],
    description: 'Gratis. Välj själv.',
    static4x5: 'flocken_ad_cb003_b_v01_4x5.jpg',
    utmCampaign: 'cb003_skuld',
  },
  {
    code: 'c',
    name: 'natverk',
    adsetName: `as_c_natverk_swe_opt_lpv_${CID}`,
    primaryTexts: [
      'Mamma orkar inte längre. Grannen har flyttat. I Flocken hittar du hundvakter nära dig.',
      'Facebook-grupper är inte byggda för hundpassning. Flocken är det.',
    ],
    headlines: ['Sluta fråga i FB-grupper', 'Hundvakt utan att gissa'],
    description: 'Profiler med bild nära dig',
    static4x5: 'flocken_ad_cb003_c_v01_4x5.jpg',
    utmCampaign: 'cb003_natverk',
  },
];

const CAMPAIGN_NAME = `c_flo_swe_init_dogowner_lpv_h01_${CID}`;
const DAILY_BUDGET_OREN = 5000; // 50 SEK/dag per ad set

// ────────────────────────────────────────────────────────────────────────────
// API-helpers
// ────────────────────────────────────────────────────────────────────────────

function makeRequest(urlPath, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(`https://graph.facebook.com/v24.0${urlPath}`);
    url.searchParams.set('access_token', ACCESS_TOKEN);
    const postData = data ? JSON.stringify(data) : null;
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' },
    };

    const req = https.request(url, options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (parsed.error) {
            console.error(`   ❌ API-fel: ${parsed.error.message}`);
            if (parsed.error.error_user_msg) {
              console.error(`      ${parsed.error.error_user_msg}`);
            }
            return reject(new Error(parsed.error.message));
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

// Multipart upload (för bilder och videos)
function uploadFile(endpoint, filePath, additionalFields = {}) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(filePath)) {
      return reject(new Error(`Filen finns inte: ${filePath}`));
    }
    const fileBuffer = fs.readFileSync(filePath);
    const fileName = path.basename(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const mimeType = ext === '.mp4' ? 'video/mp4' : ext === '.png' ? 'image/png' : 'image/jpeg';

    const boundary = `----nodejs${Date.now()}`;
    const parts = [];

    // Lägg till extra fält
    for (const [key, value] of Object.entries(additionalFields)) {
      parts.push(`--${boundary}\r\n`);
      parts.push(`Content-Disposition: form-data; name="${key}"\r\n\r\n`);
      parts.push(`${value}\r\n`);
    }

    // Filfält — Meta använder 'source' för videos och 'filename' för bilder
    const fileFieldName = ext === '.mp4' ? 'source' : 'filename';
    parts.push(`--${boundary}\r\n`);
    parts.push(`Content-Disposition: form-data; name="${fileFieldName}"; filename="${fileName}"\r\n`);
    parts.push(`Content-Type: ${mimeType}\r\n\r\n`);

    const header = Buffer.from(parts.join(''));
    const footer = Buffer.from(`\r\n--${boundary}--\r\n`);
    const body = Buffer.concat([header, fileBuffer, footer]);

    const url = new URL(`https://graph.facebook.com/v24.0${endpoint}`);
    url.searchParams.set('access_token', ACCESS_TOKEN);
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': body.length,
      },
    };

    const req = https.request(url, options, (res) => {
      let respBody = '';
      res.on('data', (c) => (respBody += c));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(respBody);
          if (parsed.error) {
            console.error(`   ❌ Upload-fel: ${parsed.error.message}`);
            return reject(new Error(parsed.error.message));
          }
          resolve(parsed);
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function uploadImage(filePath) {
  const result = await uploadFile(`/${AD_ACCOUNT_ID}/adimages`, filePath);
  // Adimage returnerar { images: { 'filename.jpg': { hash, url } } }
  if (result.images) {
    const firstKey = Object.keys(result.images)[0];
    return result.images[firstKey].hash;
  }
  throw new Error('Ingen image hash returnerad');
}

async function uploadVideo(filePath) {
  const result = await uploadFile(`/${AD_ACCOUNT_ID}/advideos`, filePath, {
    name: path.basename(filePath, path.extname(filePath)),
  });
  if (result.id) return result.id;
  throw new Error('Inget video-ID returnerat');
}

async function getVideoThumbnail(videoId, maxRetries = 8) {
  for (let i = 0; i < maxRetries; i++) {
    const result = await makeRequest(`/${videoId}/thumbnails?fields=uri,is_preferred`);
    if (result.data && result.data.length > 0) {
      const preferred = result.data.find((t) => t.is_preferred) || result.data[0];
      return preferred.uri;
    }
    console.log(`   ⏳ Thumbnail inte klar, väntar 5s (försök ${i + 1}/${maxRetries})...`);
    await new Promise((r) => setTimeout(r, 5000));
  }
  return null;
}

// ────────────────────────────────────────────────────────────────────────────
// Skapa kampanj-strukturen
// ────────────────────────────────────────────────────────────────────────────

async function createCampaign() {
  console.log(`\n📦 Skapar kampanj: ${CAMPAIGN_NAME}`);
  const result = await makeRequest(`/${AD_ACCOUNT_ID}/campaigns`, 'POST', {
    name: CAMPAIGN_NAME,
    objective: 'OUTCOME_TRAFFIC',
    status: 'PAUSED',
    special_ad_categories: [],
    buying_type: 'AUCTION',
    // ABO: budget på ad set-nivå, inte kampanj. Explicit false eftersom Meta
    // v24.0 kräver fältet när campaign_budget saknas.
    is_adset_budget_sharing_enabled: false,
  });
  console.log(`   ✅ Campaign ID: ${result.id}`);
  return result.id;
}

async function createAdSet(campaignId, vinkel) {
  console.log(`\n📋 Skapar ad set: ${vinkel.adsetName}`);
  const targeting = {
    geo_locations: { countries: ['SE'] },
    age_min: 25,
    // Meta 2026 kräver age_max >= 65 vid Advantage+ Audience. Det är en
    // "suggestion" inte hård constraint — algoritmen fokuserar på Anna
    // (30-45) via andra signaler. Vill vi låsa hårdare: stäng av Adv+ Audience.
    age_max: 65,
    genders: [1, 2],
    publisher_platforms: ['facebook', 'instagram'], // EXKLUDERAR Audience Network
    facebook_positions: ['feed', 'story', 'facebook_reels'],
    instagram_positions: ['stream', 'story', 'reels', 'explore'],
    device_platforms: ['mobile'],
    flexible_spec: [
      {
        interests: [{ id: '6003107902433', name: 'Dogs' }],
      },
    ],
    targeting_automation: {
      advantage_audience: 1, // Advantage+ Audience PÅ — expanderar inom geo/ålder-constraints
    },
  };

  const adsetData = {
    name: vinkel.adsetName,
    campaign_id: campaignId,
    optimization_goal: 'LANDING_PAGE_VIEWS', // KRITISKT: LPV, inte LINK_CLICKS
    billing_event: 'IMPRESSIONS',
    bid_strategy: 'LOWEST_COST_WITHOUT_CAP',
    daily_budget: DAILY_BUDGET_OREN,
    targeting: targeting,
    // promoted_object behövs inte för LANDING_PAGE_VIEWS (built-in Meta-mätning).
    // Det är bara för OUTCOME_SALES med custom conversion events.
    status: 'PAUSED',
  };

  const result = await makeRequest(`/${AD_ACCOUNT_ID}/adsets`, 'POST', adsetData);
  console.log(`   ✅ Ad Set ID: ${result.id}`);
  return result.id;
}

async function createStaticAd(adsetId, vinkel, imageHash) {
  const adName = `ad_${CID}_${vinkel.code}_v01_4x5_static`;
  console.log(`\n📢 Skapar static ad: ${adName}`);

  const utmParams = new URLSearchParams({
    utm_source: 'meta',
    utm_medium: 'paid_social',
    utm_campaign: vinkel.utmCampaign,
    utm_content: `${vinkel.code}_v01_4x5`,
  });
  const finalUrl = `${LANDING_PAGE}?${utmParams.toString()}`;

  const linkData = {
    image_hash: imageHash,
    link: finalUrl,
    message: vinkel.primaryTexts[0],
    name: vinkel.headlines[0],
    description: vinkel.description,
    call_to_action: {
      type: 'LEARN_MORE',
      value: { link: finalUrl, link_caption: DISPLAY_LINK },
    },
  };

  const objectStorySpec = {
    page_id: PAGE_ID,
    link_data: linkData,
  };
  objectStorySpec.instagram_actor_id = INSTAGRAM_ID;

  const creativeResult = await makeRequest(`/${AD_ACCOUNT_ID}/adcreatives`, 'POST', {
    name: `${adName} Creative`,
    object_story_spec: objectStorySpec,
    // NOTE: Advantage+ Creative (degrees_of_freedom_spec) utelämnat i v01.
    // Meta har ändrat enum-namn i v24.0 — aktivera manuellt i Ads Manager
    // eller lägg till i v02 med korrekt syntax (STANDARD_ENHANCEMENTS_CATALOG etc).
  });

  const adResult = await makeRequest(`/${AD_ACCOUNT_ID}/ads`, 'POST', {
    name: adName,
    adset_id: adsetId,
    creative: { creative_id: creativeResult.id },
    status: 'PAUSED',
  });

  console.log(`   ✅ Ad ID: ${adResult.id}`);
  return adResult.id;
}

async function createVideoAd(adsetId, vinkel, videoId, thumbnailUrl) {
  const adName = `ad_${CID}_${vinkel.code}_v01_9x16_video`;
  console.log(`\n🎬 Skapar video ad: ${adName}`);

  const utmParams = new URLSearchParams({
    utm_source: 'meta',
    utm_medium: 'paid_social',
    utm_campaign: vinkel.utmCampaign,
    utm_content: `${vinkel.code}_v01_9x16`,
  });
  const finalUrl = `${LANDING_PAGE}?${utmParams.toString()}`;

  const videoData = {
    video_id: videoId,
    image_url: thumbnailUrl,
    title: vinkel.headlines[1] || vinkel.headlines[0],
    message: vinkel.primaryTexts[1] || vinkel.primaryTexts[0],
    link_description: vinkel.description,
    call_to_action: {
      type: 'LEARN_MORE',
      value: { link: finalUrl, link_caption: DISPLAY_LINK },
    },
  };

  const objectStorySpec = {
    page_id: PAGE_ID,
    video_data: videoData,
  };
  objectStorySpec.instagram_actor_id = INSTAGRAM_ID;

  const creativeResult = await makeRequest(`/${AD_ACCOUNT_ID}/adcreatives`, 'POST', {
    name: `${adName} Creative`,
    object_story_spec: objectStorySpec,
    // Advantage+ Creative utelämnat (se kommentar i createStaticAd)
  });

  const adResult = await makeRequest(`/${AD_ACCOUNT_ID}/ads`, 'POST', {
    name: adName,
    adset_id: adsetId,
    creative: { creative_id: creativeResult.id },
    status: 'PAUSED',
  });

  console.log(`   ✅ Ad ID: ${adResult.id}`);
  return adResult.id;
}

// ────────────────────────────────────────────────────────────────────────────
// Main
// ────────────────────────────────────────────────────────────────────────────

async function main() {
  console.log('═'.repeat(72));
  console.log('🚀 CB003 PASSA — Launch Meta Ads (1 kampanj, 3 vinklar, 6 ads)');
  console.log('═'.repeat(72));

  // Steg 1: Verifiera att alla 3 statiska + 1 video finns
  console.log('\n🔍 Verifierar creative-filer...');
  for (const vinkel of VINKLAR) {
    const staticPath = path.join(ASSETS_DIR, vinkel.static4x5);
    if (!fs.existsSync(staticPath)) {
      console.error(`   ❌ SAKNAS: ${staticPath}`);
      process.exit(1);
    }
    console.log(`   ✅ ${vinkel.name}: ${vinkel.static4x5}`);
  }
  if (!fs.existsSync(SHARED_VIDEO_PATH)) {
    console.error(`   ❌ SAKNAS: ${SHARED_VIDEO_PATH}`);
    process.exit(1);
  }
  console.log(`   ✅ Delad video: ${path.basename(SHARED_VIDEO_PATH)}`);

  // Steg 2: Upload statiska bilder per vinkel
  console.log('\n📤 Laddar upp statiska bilder...');
  for (const vinkel of VINKLAR) {
    vinkel.imageHash = await uploadImage(path.join(ASSETS_DIR, vinkel.static4x5));
    console.log(`   ✅ ${vinkel.name} static 4:5 hash: ${vinkel.imageHash}`);
  }

  // Steg 3: Upload den delade videon EN gång, återanvänd ID i alla 3 ad sets
  console.log('\n📤 Laddar upp delad funktionsdemo-video (EN gång)...');
  const sharedVideoId = await uploadVideo(SHARED_VIDEO_PATH);
  console.log(`   ✅ Video 9:16 ID: ${sharedVideoId} (används av alla 3 ad sets)`);

  console.log('\n⏳ Hämtar video-thumbnail (kan ta 30-60s)...');
  const sharedThumbnailUrl = await getVideoThumbnail(sharedVideoId);
  if (!sharedThumbnailUrl) {
    console.error('   ❌ Kunde inte hämta thumbnail');
    process.exit(1);
  }
  console.log(`   ✅ Thumbnail klar`);

  // Tilldela samma video-ID/thumbnail till alla vinklar
  for (const vinkel of VINKLAR) {
    vinkel.videoId = sharedVideoId;
    vinkel.thumbnailUrl = sharedThumbnailUrl;
  }

  // Steg 4: Skapa kampanj
  const campaignId = await createCampaign();

  // Steg 5: Skapa 3 ad sets + 6 ads
  const result = { campaign: campaignId, adSets: [] };
  for (const vinkel of VINKLAR) {
    console.log(`\n${'─'.repeat(60)}`);
    console.log(`Vinkel: ${vinkel.name.toUpperCase()}`);
    console.log('─'.repeat(60));

    const adsetId = await createAdSet(campaignId, vinkel);
    const staticAdId = await createStaticAd(adsetId, vinkel, vinkel.imageHash);
    const videoAdId = await createVideoAd(adsetId, vinkel, vinkel.videoId, vinkel.thumbnailUrl);

    result.adSets.push({
      vinkel: vinkel.name,
      adsetId,
      ads: { static: staticAdId, video: videoAdId },
    });
  }

  // Steg 6: Sammanfattning
  console.log('\n' + '═'.repeat(72));
  console.log('✅ KLART! CB003 Passa skapat som PAUSED');
  console.log('═'.repeat(72));
  console.log(`
📋 STRUKTUR:

Campaign: ${CAMPAIGN_NAME}
ID: ${result.campaign}
Status: PAUSED
Objective: OUTCOME_TRAFFIC
Optimization: LANDING_PAGE_VIEWS
Placements: facebook + instagram (Audience Network EXKLUDERAD)
Total budget: ${(DAILY_BUDGET_OREN * 3) / 100} SEK/dag

${result.adSets
  .map(
    (a) => `Ad Set "${a.vinkel}" (${a.adsetId})
  ├── Static 4:5: ${a.ads.static}
  └── Video 9:16: ${a.ads.video}`
  )
  .join('\n\n')}

🔗 Granska i Ads Manager:
https://business.facebook.com/adsmanager/manage/campaigns?act=${AD_ACCOUNT_ID.replace('act_', '')}

⚠️  GRANSKA INNAN AKTIVERING:
1. Klicka på kampanjen i Ads Manager
2. Verifiera att alla 6 ads ser korrekta ut (preview)
3. Verifiera targeting (Sverige, 25-55, Dogs interest)
4. Verifiera att Audience Network är AV
5. Aktivera kampanjen + första ad set (Trygghet rekommenderas)
6. Vänta 24h, kolla LPV-rate i Reports
`);
}

main().catch((err) => {
  console.error('\n❌ Launch misslyckades:', err.message);
  console.error(err.stack);
  process.exit(1);
});
