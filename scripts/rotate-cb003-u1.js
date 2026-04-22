/**
 * CB003 PASSA — U1 Rotation (2026-04-21)
 *
 * Atomisk rotation av CB003-kampanjen:
 *   1. Pausar Natverk ad set (underpresterar, CTR-link 5.99%)
 *   2. Pausar Trygghet-video ad (fungerar inte)
 *   3. Pausar Skuld-video ad (fungerar inte)
 *   4. Skapar Natverk-v2 ad set (U1-vinkel: Facebook-grupp-frustration, 50 kr/dag)
 *   5. Skapar 2 statiska ads i Natverk-v2 (4:5 + 9:16, copy p16/h11/d08)
 *   6. Ersätter Trygghet-video med static 9:16 (lady-dog-walk, p01+h01+d01)
 *   7. Ersätter Skuld-video med static 9:16 (samma bild — alt C)
 *
 * Allt skapas som PAUSED — Torbjörn aktiverar manuellt.
 *
 * Använd:
 *   node scripts/rotate-cb003-u1.js
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
// IG Business Account — Flocken (flocken_app). Får ALDRIG vara null — Torbjörns feedback 2026-04-21.
const INSTAGRAM_ID = envVars.META_INSTAGRAM_ID || '17841479914513348';

const CID = 'cid003';
const CAMPAIGN_ID = '120243902361470455';
const LANDING_PAGE = 'https://flocken.info/v/passa';
// Display link = rotdomän i feed. Torbjörns feedback 2026-04-21: aldrig path.
const DISPLAY_LINK = 'flocken.info';
const ASSETS_DIR = path.join(__dirname, '..', 'flocken_ads', 'creative_bases', 'cb003', 'assets', 'final');
const DAILY_BUDGET_OREN = 5000;

// Befintliga objekt som ska pausas
const PAUSE_TARGETS = {
  natverkAdSet: '120243902373180455',
  trygghetVideoAd: '120243902367790455',
  skuldVideoAd: '120243902372190455',
};

// Befintliga ad sets där nya 9:16 statics läggs till
const EXISTING_AD_SETS = {
  trygghet: '120243902362250455',
  skuld: '120243902368990455',
};

// Creative-filer
const CREATIVES = {
  u1_4x5: 'flocken_ad_cb003_u1_v01_4x5.jpg',
  u1_9x16: 'flocken_ad_cb003_u1_v01_9x16.jpg',
  lady_9x16: 'flocken_ad_cb003_a_v03_9x16.jpg', // delas Trygghet + Skuld (alt C)
};

// Copy per branch
const COPY_U1 = {
  primary: 'Facebook-grupper är bra för mycket. Att hitta hundvakt är inte ett av dem. I Flocken-appen har varje hundvakt en profil med bild. Du ser vem som finns nära dig innan du frågar.',
  headline: 'Se vilka hundvakter som finns nära dig',
  description: 'Ladda ner Flocken gratis',
  utmCampaign: 'cb003_natverk_v2',
};

const COPY_TRYGGHET = {
  primary: 'Lämna din hund hos någon du litar på. Se hundvakter nära dig med profil och bild.',
  headline: 'Hitta hundvakt nära dig',
  description: 'Gratis att ladda ner',
  utmCampaign: 'cb003_trygghet',
};

const COPY_SKULD = {
  primary: 'Hon tittar på dig med de där ögonen när du packar väskan. Hitta någon hon redan träffat.',
  headline: 'Res utan dåligt samvete',
  description: 'Gratis. Välj själv.',
  utmCampaign: 'cb003_skuld',
};

if (!ACCESS_TOKEN) {
  console.error('❌ META_ACCESS_TOKEN saknas i .env.local');
  process.exit(1);
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
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (parsed.error) {
            console.error(`   ❌ API-fel: ${parsed.error.message}`);
            if (parsed.error.error_user_msg) console.error(`      ${parsed.error.error_user_msg}`);
            const e = new Error(parsed.error.message);
            e.userMsg = parsed.error.error_user_msg || '';
            e.code = parsed.error.code;
            e.subcode = parsed.error.error_subcode;
            return reject(e);
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
    if (!fs.existsSync(filePath)) return reject(new Error(`Filen finns inte: ${filePath}`));
    const fileBuffer = fs.readFileSync(filePath);
    const fileName = path.basename(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const mimeType = ext === '.png' ? 'image/png' : 'image/jpeg';

    const boundary = `----nodejs${Date.now()}`;
    const parts = [];
    parts.push(`--${boundary}\r\n`);
    parts.push(`Content-Disposition: form-data; name="filename"; filename="${fileName}"\r\n`);
    parts.push(`Content-Type: ${mimeType}\r\n\r\n`);

    const header = Buffer.from(parts.join(''));
    const footer = Buffer.from(`\r\n--${boundary}--\r\n`);
    const body = Buffer.concat([header, fileBuffer, footer]);

    const url = new URL(`https://graph.facebook.com/v24.0/${AD_ACCOUNT_ID}/adimages`);
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
          if (parsed.images) {
            const firstKey = Object.keys(parsed.images)[0];
            return resolve(parsed.images[firstKey].hash);
          }
          reject(new Error('Ingen image hash returnerad'));
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

// ────────────────────────────────────────────────────────────────────────────
// Action-funktioner
// ────────────────────────────────────────────────────────────────────────────

async function pauseObject(id, label) {
  console.log(`\n⏸️  Pausar ${label} (${id})`);
  try {
    await makeRequest(`/${id}`, 'POST', { status: 'PAUSED' });
    console.log(`   ✅ Pausad`);
  } catch (err) {
    const combined = `${err.message || ''} ${err.userMsg || ''}`;
    if (/arkiverats|archived|already|PostProcessingVersion/i.test(combined)) {
      console.log(`   ⚠️  Redan arkiverad/pausad — hoppar över`);
      return;
    }
    throw err;
  }
}

async function getAdSetTargeting(adSetId) {
  console.log(`\n📥 Hämtar targeting från befintligt Natverk ad set (${adSetId})`);
  const result = await makeRequest(`/${adSetId}?fields=targeting,optimization_goal,billing_event,bid_strategy,daily_budget`);
  console.log(`   ✅ Targeting hämtad`);
  return result;
}

async function createNatverkV2AdSet(templateAdSet) {
  const adsetName = `as_u1_natverk-v2_swe_opt_lpv_${CID}`;
  console.log(`\n📋 Skapar Natverk-v2 ad set: ${adsetName}`);
  const adsetData = {
    name: adsetName,
    campaign_id: CAMPAIGN_ID,
    optimization_goal: templateAdSet.optimization_goal || 'LANDING_PAGE_VIEWS',
    billing_event: templateAdSet.billing_event || 'IMPRESSIONS',
    bid_strategy: templateAdSet.bid_strategy || 'LOWEST_COST_WITHOUT_CAP',
    daily_budget: DAILY_BUDGET_OREN,
    targeting: templateAdSet.targeting,
    status: 'PAUSED',
  };
  const result = await makeRequest(`/${AD_ACCOUNT_ID}/adsets`, 'POST', adsetData);
  console.log(`   ✅ Ad Set ID: ${result.id}`);
  return result.id;
}

async function createStaticAd(adsetId, imageHash, copy, format, label) {
  const adName = `ad_${CID}_${label}_v01_${format}_static`;
  console.log(`\n📢 Skapar static ad: ${adName}`);

  const utmParams = new URLSearchParams({
    utm_source: 'meta',
    utm_medium: 'paid_social',
    utm_campaign: copy.utmCampaign,
    utm_content: `${label}_v01_${format}`,
  });
  const finalUrl = `${LANDING_PAGE}?${utmParams.toString()}`;

  const linkData = {
    image_hash: imageHash,
    link: finalUrl,
    message: copy.primary,
    name: copy.headline,
    description: copy.description,
    call_to_action: {
      type: 'LEARN_MORE',
      value: { link: finalUrl, link_caption: DISPLAY_LINK },
    },
  };

  const objectStorySpec = {
    page_id: PAGE_ID,
    instagram_actor_id: INSTAGRAM_ID,
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
  console.log('🔄 CB003 PASSA — U1 Rotation (2026-04-21)');
  console.log('═'.repeat(72));

  // Verifiera filer
  console.log('\n🔍 Verifierar creative-filer...');
  for (const [key, name] of Object.entries(CREATIVES)) {
    const full = path.join(ASSETS_DIR, name);
    if (!fs.existsSync(full)) {
      console.error(`   ❌ SAKNAS: ${full}`);
      process.exit(1);
    }
    console.log(`   ✅ ${key}: ${name}`);
  }

  const report = { paused: [], newAdSets: [], newAds: [] };

  // STEG 1: Hämta targeting från befintligt Natverk-ad set (INNAN vi pausar)
  const natverkTemplate = await getAdSetTargeting(PAUSE_TARGETS.natverkAdSet);

  // STEG 2: Pausa befintliga objekt
  await pauseObject(PAUSE_TARGETS.natverkAdSet, 'Natverk ad set');
  report.paused.push({ type: 'adset', name: 'Natverk', id: PAUSE_TARGETS.natverkAdSet });

  await pauseObject(PAUSE_TARGETS.trygghetVideoAd, 'Trygghet video-ad');
  report.paused.push({ type: 'ad', name: 'Trygghet video', id: PAUSE_TARGETS.trygghetVideoAd });

  await pauseObject(PAUSE_TARGETS.skuldVideoAd, 'Skuld video-ad');
  report.paused.push({ type: 'ad', name: 'Skuld video', id: PAUSE_TARGETS.skuldVideoAd });

  // STEG 3: Ladda upp bilder (en gång per unik fil)
  console.log('\n📤 Laddar upp nya creative-bilder...');
  const u1_4x5_hash = await uploadImage(path.join(ASSETS_DIR, CREATIVES.u1_4x5));
  console.log(`   ✅ u1_4x5 hash: ${u1_4x5_hash}`);
  const u1_9x16_hash = await uploadImage(path.join(ASSETS_DIR, CREATIVES.u1_9x16));
  console.log(`   ✅ u1_9x16 hash: ${u1_9x16_hash}`);
  const lady_9x16_hash = await uploadImage(path.join(ASSETS_DIR, CREATIVES.lady_9x16));
  console.log(`   ✅ lady_9x16 hash: ${lady_9x16_hash} (delas Trygghet+Skuld)`);

  // STEG 4: Skapa Natverk-v2 ad set med samma targeting
  const natverkV2Id = await createNatverkV2AdSet(natverkTemplate);
  report.newAdSets.push({ name: 'Natverk-v2 (U1)', id: natverkV2Id });

  // STEG 5: Skapa 2 statiska ads i Natverk-v2
  const u1_4x5_adId = await createStaticAd(natverkV2Id, u1_4x5_hash, COPY_U1, '4x5', 'u1');
  report.newAds.push({ adset: 'Natverk-v2', format: '4:5', id: u1_4x5_adId });

  const u1_9x16_adId = await createStaticAd(natverkV2Id, u1_9x16_hash, COPY_U1, '9x16', 'u1');
  report.newAds.push({ adset: 'Natverk-v2', format: '9:16', id: u1_9x16_adId });

  // STEG 6: Lägg till 9:16 static i Trygghet (ersätter video)
  const trygghet_9x16_adId = await createStaticAd(EXISTING_AD_SETS.trygghet, lady_9x16_hash, COPY_TRYGGHET, '9x16', 'a_v03');
  report.newAds.push({ adset: 'Trygghet', format: '9:16 static', id: trygghet_9x16_adId });

  // STEG 7: Lägg till 9:16 static i Skuld (samma bild — alt C)
  const skuld_9x16_adId = await createStaticAd(EXISTING_AD_SETS.skuld, lady_9x16_hash, COPY_SKULD, '9x16', 'b_v03');
  report.newAds.push({ adset: 'Skuld', format: '9:16 static', id: skuld_9x16_adId });

  // Rapport
  console.log('\n' + '═'.repeat(72));
  console.log('✅ KLART — CB003 U1 Rotation genomförd');
  console.log('═'.repeat(72));
  console.log('\n⏸️  PAUSADE:');
  report.paused.forEach((p) => console.log(`   ${p.type.toUpperCase()} "${p.name}": ${p.id}`));
  console.log('\n🆕 NYA AD SETS:');
  report.newAdSets.forEach((s) => console.log(`   "${s.name}": ${s.id}`));
  console.log('\n🆕 NYA ADS (alla PAUSED):');
  report.newAds.forEach((a) => console.log(`   ${a.adset} ${a.format}: ${a.id}`));
  console.log(`\n🔗 Ads Manager: https://business.facebook.com/adsmanager/manage/campaigns?act=${AD_ACCOUNT_ID.replace('act_', '')}`);
  console.log('\n⚠️  GRANSKA + AKTIVERA MANUELLT i Ads Manager');

  // Spara rapport till fil
  const reportPath = path.join(__dirname, '..', 'flocken_ads', 'creative_bases', 'cb003', 'rotation_20260421_result.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\n📄 Full rapport: ${reportPath}`);
}

main().catch((err) => {
  console.error('\n❌ Rotation misslyckades:', err.message);
  console.error(err.stack);
  process.exit(1);
});
