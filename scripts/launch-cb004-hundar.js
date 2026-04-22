/**
 * CB004 HUNDAR — Launch-script för Meta Ads
 *
 * Struktur enligt Torbjörns spec 2026-04-22 (samma mönster som CB003):
 * - 1 kampanj: c_flo_swe_init_dogowner_lpv_h01_cid004
 * - Ad sets (50 kr/dag var, ABO, LPV, SE, FB+IG):
 *     A (Lekkompisen)       — 2 ads (4:5 + 9:16), identisk copy inom set
 *     B (Uttråkad hund)     — 2 ads (4:5 + 9:16), identisk copy inom set
 *     C (Grupp-alternativet) — 2 ads (4:5 + 9:16), identisk copy inom set
 * - Allt PAUSED — Torbjörn granskar och aktiverar manuellt
 *
 * Princip: stor variation MELLAN ad sets (vinkel), liten INOM (bara format).
 * Rena ad set-jämförelser med ABO. Inom set: algoritmen väljer vilket format
 * som presterar. Text-overlay på bilder utelämnas i v1 — blir test i v2.
 *
 * Använd:
 *   node scripts/launch-cb004-hundar.js
 *
 * Kräver 6 creative-filer (rena bilder, ingen text-overlay):
 *   flocken_ads/creative_bases/cb004/assets/final/
 *     ad_cid004_a_4x5.jpg   (Lekkompis-bild 1080×1350)
 *     ad_cid004_a_9x16.jpg  (Lekkompis-bild 1080×1920)
 *     ad_cid004_b_4x5.jpg   (Uttråkad-hund-bild 1080×1350)
 *     ad_cid004_b_9x16.jpg  (Uttråkad-hund-bild 1080×1920)
 *     ad_cid004_c_4x5.jpg   (FB-kaos-bild 1080×1350)
 *     ad_cid004_c_9x16.jpg  (FB-kaos-bild 1080×1920)
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// ────────────────────────────────────────────────────────────────────────────
// Konfiguration
// ────────────────────────────────────────────────────────────────────────────

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
const INSTAGRAM_ID = envVars.META_INSTAGRAM_ID || '17841479914513348';
const PIXEL_ID = '854587690618895';

const CID = 'cid004';
const LANDING_PAGE = 'https://flocken.info/v/hundar';
const DISPLAY_LINK = 'flocken.info';
const ASSETS_DIR = path.join(__dirname, '..', 'flocken_ads', 'creative_bases', 'cb004', 'assets', 'final');

if (!ACCESS_TOKEN) {
  console.error('❌ META_ACCESS_TOKEN saknas i .env.local');
  process.exit(1);
}

// ────────────────────────────────────────────────────────────────────────────
// Vinkel-definitioner (matchar cb004/copy.md v2 — identisk copy inom ad set)
// ────────────────────────────────────────────────────────────────────────────

const VINKLAR = [
  {
    code: 'a',
    name: 'lekkompis',
    adsetName: `as_a_lekkompis_swe_opt_lpv_${CID}`,
    // Identisk copy på båda format inom ad set
    primary: `Hundar blir inte vänner bara för att ägarna vill det.

I Flocken-appen filtrerar du på storlek, ras och lekstil innan ni ses. Din hund får en lekkompis som faktiskt passar.`,
    headline: 'En lekkompis som matchar',
    description: 'Gratis i App Store och Play',
    image4x5: 'ad_cid004_a_4x5.jpg',
    image9x16: 'ad_cid004_a_9x16.jpg',
    utmCampaign: 'cb004_lekkompis',
  },
  {
    code: 'b',
    name: 'uttrakad-hund',
    adsetName: `as_b_uttrakad_swe_opt_lpv_${CID}`,
    primary: `Din hund behöver mer än bara dig. Hitta passande lekkompisar i närheten i Flocken-appen. Sök på hundar som matchar i storlek och temperament.`,
    headline: 'Ge din hund en kompis',
    description: 'Ladda ner Flocken-appen gratis',
    image4x5: 'ad_cid004_b_4x5.jpg',
    image9x16: 'ad_cid004_b_9x16.jpg',
    utmCampaign: 'cb004_uttrakad',
  },
  {
    code: 'c',
    name: 'grupp',
    adsetName: `as_c_grupp_swe_opt_lpv_${CID}`,
    primary: `Att hitta en lekkompis ska inte kräva 27 kommentarer i en tråd.

I Flocken-appen ser du hundar nära dig direkt. Storlek, ras, profil. Sen bestämmer ni träff.`,
    headline: 'Sluta söka i grupptrådar',
    description: 'Gratis i App Store och Play',
    image4x5: 'ad_cid004_c_4x5.jpg',
    image9x16: 'ad_cid004_c_9x16.jpg',
    utmCampaign: 'cb004_grupp',
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

function uploadFile(endpoint, filePath, additionalFields = {}) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(filePath)) {
      return reject(new Error(`Filen finns inte: ${filePath}`));
    }
    const fileBuffer = fs.readFileSync(filePath);
    const fileName = path.basename(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const mimeType = ext === '.png' ? 'image/png' : 'image/jpeg';

    const boundary = `----nodejs${Date.now()}`;
    const parts = [];

    for (const [key, value] of Object.entries(additionalFields)) {
      parts.push(`--${boundary}\r\n`);
      parts.push(`Content-Disposition: form-data; name="${key}"\r\n\r\n`);
      parts.push(`${value}\r\n`);
    }

    parts.push(`--${boundary}\r\n`);
    parts.push(`Content-Disposition: form-data; name="filename"; filename="${fileName}"\r\n`);
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
  if (result.images) {
    const firstKey = Object.keys(result.images)[0];
    return result.images[firstKey].hash;
  }
  throw new Error('Ingen image hash returnerad');
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
    age_max: 65,
    genders: [1, 2],
    publisher_platforms: ['facebook', 'instagram'],
    facebook_positions: ['feed', 'story', 'facebook_reels'],
    instagram_positions: ['stream', 'story', 'reels', 'explore'],
    device_platforms: ['mobile'],
    flexible_spec: [
      {
        interests: [{ id: '6003107902433', name: 'Dogs' }],
      },
    ],
    targeting_automation: {
      advantage_audience: 1,
    },
  };

  const adsetData = {
    name: vinkel.adsetName,
    campaign_id: campaignId,
    optimization_goal: 'LANDING_PAGE_VIEWS',
    billing_event: 'IMPRESSIONS',
    bid_strategy: 'LOWEST_COST_WITHOUT_CAP',
    daily_budget: DAILY_BUDGET_OREN,
    targeting: targeting,
    status: 'PAUSED',
  };

  const result = await makeRequest(`/${AD_ACCOUNT_ID}/adsets`, 'POST', adsetData);
  console.log(`   ✅ Ad Set ID: ${result.id}`);
  return result.id;
}

async function createStaticAd(adsetId, vinkel, format, imageHash) {
  const adName = `ad_${CID}_${vinkel.code}_${format}_static`;
  console.log(`\n📢 Skapar ad: ${adName}`);

  const utmParams = new URLSearchParams({
    utm_source: 'meta',
    utm_medium: 'paid_social',
    utm_campaign: vinkel.utmCampaign,
    utm_content: `${vinkel.code}_${format}`,
  });
  const finalUrl = `${LANDING_PAGE}?${utmParams.toString()}`;

  const linkData = {
    image_hash: imageHash,
    link: finalUrl,
    message: vinkel.primary,
    name: vinkel.headline,
    description: vinkel.description,
    call_to_action: {
      type: 'LEARN_MORE',
      value: { link: finalUrl, link_caption: DISPLAY_LINK },
    },
  };

  const objectStorySpec = {
    page_id: PAGE_ID,
    instagram_user_id: INSTAGRAM_ID, // v24: instagram_actor_id deprecated
    link_data: linkData,
  };

  const creativeResult = await makeRequest(`/${AD_ACCOUNT_ID}/adcreatives`, 'POST', {
    name: `${adName} Creative`,
    object_story_spec: objectStorySpec,
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
  console.log(`🚀 CB004 HUNDAR — Launch Meta Ads (${VINKLAR.length} vinklar, ${VINKLAR.length * 2} ads)`);
  console.log('═'.repeat(72));

  // Steg 1: Verifiera creative-filer
  console.log('\n🔍 Verifierar creative-filer...');
  for (const vinkel of VINKLAR) {
    for (const file of [vinkel.image4x5, vinkel.image9x16]) {
      const filePath = path.join(ASSETS_DIR, file);
      if (!fs.existsSync(filePath)) {
        console.error(`   ❌ SAKNAS: ${filePath}`);
        process.exit(1);
      }
      console.log(`   ✅ ${vinkel.name}: ${file}`);
    }
  }

  // Steg 2: Upload bilder
  console.log('\n📤 Laddar upp bilder...');
  for (const vinkel of VINKLAR) {
    vinkel.hash4x5 = await uploadImage(path.join(ASSETS_DIR, vinkel.image4x5));
    console.log(`   ✅ ${vinkel.name} 4:5 hash: ${vinkel.hash4x5}`);
    vinkel.hash9x16 = await uploadImage(path.join(ASSETS_DIR, vinkel.image9x16));
    console.log(`   ✅ ${vinkel.name} 9:16 hash: ${vinkel.hash9x16}`);
  }

  // Steg 3: Skapa kampanj
  const campaignId = await createCampaign();

  // Steg 4: Per vinkel — skapa ad set + 2 ads
  const result = { campaign: campaignId, adSets: [] };
  for (const vinkel of VINKLAR) {
    console.log(`\n${'─'.repeat(60)}`);
    console.log(`Vinkel: ${vinkel.name.toUpperCase()}`);
    console.log('─'.repeat(60));

    const adsetId = await createAdSet(campaignId, vinkel);
    const ad4x5 = await createStaticAd(adsetId, vinkel, '4x5', vinkel.hash4x5);
    const ad9x16 = await createStaticAd(adsetId, vinkel, '9x16', vinkel.hash9x16);

    result.adSets.push({
      vinkel: vinkel.name,
      adsetId,
      ads: { '4x5': ad4x5, '9x16': ad9x16 },
    });
  }

  // Steg 5: Sammanfattning
  console.log('\n' + '═'.repeat(72));
  console.log('✅ KLART! CB004 Hundar skapat som PAUSED');
  console.log('═'.repeat(72));
  console.log(`
📋 STRUKTUR:

Campaign: ${CAMPAIGN_NAME}
ID: ${result.campaign}
Status: PAUSED
Objective: OUTCOME_TRAFFIC
Optimization: LANDING_PAGE_VIEWS
Placements: facebook + instagram (Audience Network EXKLUDERAD)
Total budget: ${(DAILY_BUDGET_OREN * VINKLAR.length) / 100} SEK/dag

${result.adSets
  .map(
    (a) => `Ad Set "${a.vinkel}" (${a.adsetId}) — 50 SEK/dag
  ├── 4:5 static: ${a.ads['4x5']}
  └── 9:16 static: ${a.ads['9x16']}`
  )
  .join('\n\n')}

🔗 Granska i Ads Manager:
https://business.facebook.com/adsmanager/manage/campaigns?act=${AD_ACCOUNT_ID.replace('act_', '')}

⚠️  INNAN AKTIVERING:
1. Klicka på kampanjen i Ads Manager
2. Verifiera att alla ads ser korrekta ut (preview — mobil + desktop)
3. Verifiera targeting (Sverige, 25-65, Dogs interest)
4. Verifiera att Audience Network är AV
5. Verifiera display link = flocken.info (inte path)
6. Aktivera kampanj + ad sets + alla ads
7. Vänta 48-72h, kolla LPV-rate i Reports

`);
}

main().catch((err) => {
  console.error('\n❌ Launch misslyckades:', err.message);
  console.error(err.stack);
  process.exit(1);
});
