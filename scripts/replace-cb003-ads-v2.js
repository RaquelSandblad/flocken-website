/**
 * CB003 REPLACE ADS v2 — efter kreativ-producent v02-leverans
 *
 * Körs när kreativ-producent levererat:
 *   - flocken_ads/creative_bases/cb003/assets/final/flocken_ad_cb003_a_v02_4x5.jpg
 *   - flocken_ads/creative_bases/cb003/assets/final/flocken_ad_cb003_b_v02_4x5.jpg
 *   - flocken_ads/creative_bases/cb003/assets/final/flocken_ad_cb003_c_v02_4x5.jpg
 *   - Copy per vinkel (primary/headline/description för static + video)
 *
 * PL fyller i VINKLAR-objektet nedan med slutgiltig v02-copy innan körning.
 *
 * Skillnader vs replace-cb003-ads.js (v1):
 *   - instagram_user_id (INTE instagram_actor_id — Meta v24.0 deprecated)
 *   - CTA: LEARN_MORE (inte DOWNLOAD — Traffic-objective → LP)
 *   - Nya 4:5-bilder (v02) laddas upp; video-ID återanvänds från tidigare upload
 *   - Ads skapas med ad-namn v02 för spårbarhet
 *
 * Antaganden (verifierade 2026-04-17):
 *   - Kampanj 120243902361470455 finns, PAUSED
 *   - 3 ad sets finns, PAUSED, LPV-optimering, korrekt placements
 *   - Alla 6 v1-ads redan raderade av replace-cb003-ads.js
 *
 * Kör: node scripts/replace-cb003-ads-v2.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// ────────────────────────────────────────────────────────────────────────────
// Konfiguration
// ────────────────────────────────────────────────────────────────────────────

let envVars = {};
const envPath = path.join(__dirname, '..', '.env.local');
fs.readFileSync(envPath, 'utf8').split('\n').forEach((line) => {
  const m = line.trim().match(/^([^#=]+)=(.*)$/);
  if (m) envVars[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '');
});

const ACCESS_TOKEN = envVars.META_ACCESS_TOKEN || envVars.META_ADS_API_TOKEN || envVars.META_MARKETING_API_TOKEN;
const AD_ACCOUNT_ID = envVars.META_AD_ACCOUNT_ID || 'act_1648246706340725';
const PAGE_ID = '936579286197312';
const INSTAGRAM_USER_ID = '17841479914513348'; // flocken_app Business Account — verifierat via find-instagram-id.js (Ads Manager screenshot visade annat ID som visade sig vara fel)
const LANDING_PAGE = 'https://flocken.info/v/passa';
const DISPLAY_LINK = 'flocken.info/v/passa';

const AD_SETS = {
  trygghet: '120243902362250455',
  skuld:    '120243902368990455',
  natverk:  '120243902373180455',
};

// Videon från tidigare upload (delad mellan alla 3 vinklars 9:16 — Alt D godkänt av Torbjörn)
const SHARED_VIDEO_ID = '2018081445409922';

const ASSETS_DIR = path.join(__dirname, '..', 'flocken_ads', 'creative_bases', 'cb003', 'assets', 'final');

// ────────────────────────────────────────────────────────────────────────────
// COPY — FYLLS I AV PL EFTER KREATIV-PRODUCENT V02-LEVERANS
// Varje vinkel har static (4:5) + video (9:16). Ad-namn följer v02-konvention.
// ────────────────────────────────────────────────────────────────────────────

// Väg D: alla 3 vinklar delar samma bild (flocken_ad_cb003_shared_v02_4x5.jpg
// — återställd från git commit 3385025). Vinklar skiljs åt via copy, inte via
// bild. Copy skriven av PL 2026-04-17 baserat på VoC + meta_ads_copy_layer +
// principles_and_triggers (inte AI-chansad, alla QA hard gates kontrollerade
// manuellt innan kod-commit).
const SHARED_IMAGE_FILE = 'flocken_ad_cb003_shared_v02_4x5.jpg';

const VINKLAR = [
  {
    code: 'a',
    name: 'trygghet',
    adsetId: AD_SETS.trygghet,
    utmCampaign: 'cb003_trygghet',
    imageFile: SHARED_IMAGE_FILE,
    static: {
      primaryText: 'Lämna din hund hos någon du litar på. Se hundvakter nära dig i Flocken — profiler, bilder, recensioner innan du bokar.',
      headline:    'Hundvakt du kan lita på',
      description: 'Välj själv, träffas först',
    },
    video: {
      primaryText: 'Lita på den som passar din hund. I Flocken ser du hundvakter nära dig — profil, bild och recensioner.',
      headline:    'Se vem som passar hunden',
      description: 'Gratis. Profiler nära dig.',
    },
  },
  {
    code: 'b',
    name: 'skuld',
    adsetId: AD_SETS.skuld,
    utmCampaign: 'cb003_skuld',
    imageFile: SHARED_IMAGE_FILE,
    static: {
      primaryText: 'Hon tittar på dig när du packar väskan. I Flocken ser du hundvakter i närheten — profil, bild innan du bokar.',
      headline:    'Res utan dåligt samvete',
      description: 'Träffas först, bestäm sen',
    },
    video: {
      primaryText: 'Klockan är halv sju. Du packar väskan, hunden ligger i hallen. I Flocken hittar du någon hon får träffa först.',
      headline:    'Hundvakt hon får gilla',
      description: '2 000+ hundägare i appen',
    },
  },
  {
    code: 'c',
    name: 'natverk',
    adsetId: AD_SETS.natverk,
    utmCampaign: 'cb003_natverk',
    imageFile: SHARED_IMAGE_FILE,
    static: {
      primaryText: 'Facebook-grupper är inte byggda för hundpassning. Flocken är. Se hundvakter nära dig innan du bokar.',
      headline:    'Sluta fråga i FB-grupper',
      description: 'Profiler nära dig. Gratis.',
    },
    video: {
      primaryText: 'Mamma orkar inte passa hunden längre. Grannen har flyttat. I Flocken hittar du hundvakter nära dig.',
      headline:    'Bättre än FB-grupper',
      description: 'Profiler nära dig, gratis.',
    },
  },
];

// ────────────────────────────────────────────────────────────────────────────
// Preflight — upptäck TBD-placeholders och stoppa innan API-anrop
// ────────────────────────────────────────────────────────────────────────────

function preflight() {
  const issues = [];

  for (const v of VINKLAR) {
    // Copy-placeholders
    const fields = [
      ['static.primaryText', v.static.primaryText],
      ['static.headline',    v.static.headline],
      ['static.description', v.static.description],
      ['video.primaryText',  v.video.primaryText],
      ['video.headline',     v.video.headline],
      ['video.description',  v.video.description],
    ];
    for (const [field, value] of fields) {
      if (!value || value.startsWith('TBD_')) {
        issues.push(`${v.name}: ${field} är TBD-placeholder`);
      }
    }

    // Teckengränser (Meta hard gates)
    if (v.static.primaryText.length > 125) issues.push(`${v.name} static.primaryText > 125 tecken (${v.static.primaryText.length})`);
    if (v.video.primaryText.length > 125)  issues.push(`${v.name} video.primaryText > 125 tecken (${v.video.primaryText.length})`);
    if (v.static.headline.length > 27)     issues.push(`${v.name} static.headline > 27 tecken (${v.static.headline.length})`);
    if (v.video.headline.length > 27)      issues.push(`${v.name} video.headline > 27 tecken (${v.video.headline.length})`);
    if (v.static.description.length > 27)  issues.push(`${v.name} static.description > 27 tecken (${v.static.description.length})`);
    if (v.video.description.length > 27)   issues.push(`${v.name} video.description > 27 tecken (${v.video.description.length})`);

    // Headline skiljer sig från bildens text-overlay (best-effort — PL måste verifiera visuellt också)
    // Kan inte kontrolleras programmatiskt utan OCR, men PL granskar

    // Filen finns
    const imgPath = path.join(ASSETS_DIR, v.imageFile);
    if (!fs.existsSync(imgPath)) issues.push(`${v.name}: ${v.imageFile} saknas på disk`);
  }

  if (issues.length) {
    console.error('\n❌ PREFLIGHT MISSLYCKADES — scriptet stoppar innan API-anrop:\n');
    issues.forEach((i) => console.error('   •', i));
    console.error('\nFyll i copy-fälten i VINKLAR-objektet och kör igen.\n');
    process.exit(1);
  }
  console.log('✅ Preflight OK — alla fält ifyllda, inom teckengränser, bilder på plats');
}

// ────────────────────────────────────────────────────────────────────────────
// API-helpers
// ────────────────────────────────────────────────────────────────────────────

function makeRequest(urlPath, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(`https://graph.facebook.com/v24.0${urlPath}`);
    url.searchParams.set('access_token', ACCESS_TOKEN);
    const postData = data ? JSON.stringify(data) : null;
    const options = { method, headers: { 'Content-Type': 'application/json' } };
    const req = https.request(url, options, (res) => {
      let body = '';
      res.on('data', (c) => (body += c));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (parsed.error) {
            console.error(`   ❌ API: ${parsed.error.message}`);
            if (parsed.error.error_user_msg) console.error(`      ${parsed.error.error_user_msg}`);
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

function uploadImage(filePath) {
  return new Promise((resolve, reject) => {
    const fileBuffer = fs.readFileSync(filePath);
    const fileName = path.basename(filePath);
    const boundary = `----nodejs${Date.now()}`;
    const header = Buffer.from(
      `--${boundary}\r\n` +
      `Content-Disposition: form-data; name="filename"; filename="${fileName}"\r\n` +
      `Content-Type: image/jpeg\r\n\r\n`
    );
    const footer = Buffer.from(`\r\n--${boundary}--\r\n`);
    const body = Buffer.concat([header, fileBuffer, footer]);

    const url = new URL(`https://graph.facebook.com/v24.0/${AD_ACCOUNT_ID}/adimages`);
    url.searchParams.set('access_token', ACCESS_TOKEN);
    const req = https.request(url, {
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': body.length,
      },
    }, (res) => {
      let b = '';
      res.on('data', (c) => (b += c));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(b);
          if (parsed.error) return reject(new Error(parsed.error.message));
          const hash = Object.values(parsed.images)[0].hash;
          resolve(hash);
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

async function getVideoThumbnail(videoId) {
  const result = await makeRequest(`/${videoId}/thumbnails?fields=uri,is_preferred`);
  if (result.data && result.data.length > 0) {
    const preferred = result.data.find((t) => t.is_preferred) || result.data[0];
    return preferred.uri;
  }
  return null;
}

// ────────────────────────────────────────────────────────────────────────────
// Skapa ads
// ────────────────────────────────────────────────────────────────────────────

async function createStaticAd(vinkel, imageHash) {
  const adName = `ad_cid003_${vinkel.code}_v02_4x5_static`;
  console.log(`\n📢 ${adName}`);
  const utm = new URLSearchParams({
    utm_source: 'meta',
    utm_medium: 'paid_social',
    utm_campaign: vinkel.utmCampaign,
    utm_content: `${vinkel.code}_v02_4x5`,
  });
  const finalUrl = `${LANDING_PAGE}?${utm.toString()}`;

  const creative = await makeRequest(`/${AD_ACCOUNT_ID}/adcreatives`, 'POST', {
    name: `${adName} Creative`,
    object_story_spec: {
      page_id: PAGE_ID,
      instagram_user_id: INSTAGRAM_USER_ID, // FIX: v1 använde deprecated instagram_actor_id
      link_data: {
        image_hash: imageHash,
        link: finalUrl,
        message: vinkel.static.primaryText,
        name: vinkel.static.headline,
        description: vinkel.static.description,
        call_to_action: {
          type: 'LEARN_MORE', // FIX: v1 använde DOWNLOAD — fel för Traffic-objective
          value: { link: finalUrl, link_caption: DISPLAY_LINK },
        },
      },
    },
  });

  const ad = await makeRequest(`/${AD_ACCOUNT_ID}/ads`, 'POST', {
    name: adName,
    adset_id: vinkel.adsetId,
    creative: { creative_id: creative.id },
    status: 'PAUSED',
  });
  console.log(`   ✅ ${ad.id}`);
  return ad.id;
}

async function createVideoAd(vinkel, thumbnailUrl) {
  const adName = `ad_cid003_${vinkel.code}_v02_9x16_video`;
  console.log(`\n🎬 ${adName}`);
  const utm = new URLSearchParams({
    utm_source: 'meta',
    utm_medium: 'paid_social',
    utm_campaign: vinkel.utmCampaign,
    utm_content: `${vinkel.code}_v02_9x16`,
  });
  const finalUrl = `${LANDING_PAGE}?${utm.toString()}`;

  const creative = await makeRequest(`/${AD_ACCOUNT_ID}/adcreatives`, 'POST', {
    name: `${adName} Creative`,
    object_story_spec: {
      page_id: PAGE_ID,
      instagram_user_id: INSTAGRAM_USER_ID,
      video_data: {
        video_id: SHARED_VIDEO_ID,
        image_url: thumbnailUrl,
        title: vinkel.video.headline,
        message: vinkel.video.primaryText,
        link_description: vinkel.video.description,
        call_to_action: {
          type: 'LEARN_MORE',
          value: { link: finalUrl, link_caption: DISPLAY_LINK },
        },
      },
    },
  });

  const ad = await makeRequest(`/${AD_ACCOUNT_ID}/ads`, 'POST', {
    name: adName,
    adset_id: vinkel.adsetId,
    creative: { creative_id: creative.id },
    status: 'PAUSED',
  });
  console.log(`   ✅ ${ad.id}`);
  return ad.id;
}

// ────────────────────────────────────────────────────────────────────────────
// Main
// ────────────────────────────────────────────────────────────────────────────

async function main() {
  console.log('═'.repeat(72));
  console.log('🔄 CB003 REPLACE ADS v2 (efter kreativ-producent v02-leverans)');
  console.log('═'.repeat(72));

  preflight();

  // Upload shared bild EN gång, återanvänd hash för alla vinklar (Väg D)
  console.log(`\n📤 Laddar upp shared v02-bild (${SHARED_IMAGE_FILE})...`);
  const sharedImageHash = await uploadImage(path.join(ASSETS_DIR, SHARED_IMAGE_FILE));
  console.log(`   ✅ Hash: ${sharedImageHash} (delas mellan alla 3 vinklar)`);
  for (const v of VINKLAR) {
    v.imageHash = sharedImageHash;
  }

  // Hämta thumbnail för delade videon (återanvänd från tidigare upload)
  console.log('\n⏳ Hämtar thumbnail för delad video...');
  const thumbnail = await getVideoThumbnail(SHARED_VIDEO_ID);
  if (!thumbnail) {
    console.error('❌ Kunde inte hämta thumbnail — videon kanske är raderad. Verifiera i Ads Manager.');
    process.exit(1);
  }
  console.log('   ✅ Klart');

  // Skapa 6 nya ads
  const result = [];
  for (const v of VINKLAR) {
    console.log(`\n${'─'.repeat(60)}`);
    console.log(`Vinkel: ${v.name.toUpperCase()} (v02)`);
    console.log('─'.repeat(60));
    result.push({
      vinkel: v.name,
      static: await createStaticAd(v, v.imageHash),
      video:  await createVideoAd(v, thumbnail),
    });
  }

  // Sammanfattning
  console.log('\n' + '═'.repeat(72));
  console.log('✅ KLART — 6 nya v02-ads skapade som PAUSED');
  console.log('═'.repeat(72));
  for (const r of result) {
    console.log(`\n${r.vinkel}:`);
    console.log(`  Static: ${r.static}`);
    console.log(`  Video:  ${r.video}`);
  }
  console.log(`\n🔗 Granska: https://business.facebook.com/adsmanager/manage/campaigns?act=${AD_ACCOUNT_ID.replace('act_', '')}`);
  console.log('\nFixes v1 → v2:');
  console.log('  • Instagram: instagram_user_id (tidigare deprecated instagram_actor_id)');
  console.log('  • CTA: LEARN_MORE (Traffic-objective — tidigare fel DOWNLOAD)');
  console.log('  • Bilder: v02 fyller canvas, inget avskuret motiv (tidigare staplad layout)');
  console.log('  • Copy: utnyttjar 125-tecken-utrymme, etablerar produkt i första 7 orden');
  console.log('  • Headline ≠ bildens text-overlay');
  console.log('  • Description står för sig själv');
}

main().catch((err) => {
  console.error('\n❌ Fel:', err.message);
  process.exit(1);
});
