/**
 * CB003 REPLACE ADS — ersätt de 6 ursprungliga ads med v2-versioner.
 *
 * Bakgrund: v1-ads fick kritik (copy generisk, ingen Instagram-profil,
 * LEARN_MORE-CTA dödar action). Detta script:
 *   1. Raderar de 6 befintliga ads
 *   2. Återanvänder redan-uppladdade image_hashes + video_id
 *   3. Skapar 6 nya ads med:
 *      - Ny copy från @growth-manager (v2)
 *      - Instagram-profil flocken_app (ID 25334522412916958)
 *      - CTA DOWNLOAD (inte LEARN_MORE)
 *      - Annons-anpassade descriptions som står för sig själva
 *   4. Kopplar till samma 3 ad sets (campaign + ad sets behålls intakta)
 *
 * Kör: node scripts/replace-cb003-ads.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Env
let envVars = {};
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split('\n').forEach((line) => {
    const m = line.trim().match(/^([^#=]+)=(.*)$/);
    if (m) envVars[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '');
  });
}
const ACCESS_TOKEN = envVars.META_ACCESS_TOKEN || envVars.META_ADS_API_TOKEN || envVars.META_MARKETING_API_TOKEN;
const AD_ACCOUNT_ID = envVars.META_AD_ACCOUNT_ID || 'act_1648246706340725';
const PAGE_ID = '936579286197312';
const INSTAGRAM_ID = '25334522412916958'; // flocken_app — verifierat via screenshot från Ads Manager
const LANDING_PAGE = 'https://flocken.info/v/passa';
const DISPLAY_LINK = 'flocken.info/v/passa';

// ID:n från tidigare körning (launch_result.md)
const OLD_AD_IDS = [
  '120243902366250455', // trygghet static
  '120243902367790455', // trygghet video
  '120243902370680455', // skuld static
  '120243902372190455', // skuld video
  '120243902374590455', // natverk static
  '120243902376470455', // natverk video
];

const AD_SETS = {
  trygghet: '120243902362250455',
  skuld: '120243902368990455',
  natverk: '120243902373180455',
};

// Redan-uppladdade assets (från första launch)
const IMAGE_HASHES = {
  trygghet: 'b14461165efaaa37427755b24518e9ea',
  skuld: '8ecefbf932518509237ab4637bfab772',
  natverk: 'dc465a3ac460565c59db24ff9ff1bdce',
};
const SHARED_VIDEO_ID = '2018081445409922'; // delad funktionsdemo

// Vinklar v2 — copy från @growth-manager 2026-04-17
const VINKLAR = [
  {
    code: 'a',
    name: 'trygghet',
    adsetId: AD_SETS.trygghet,
    utmCampaign: 'cb003_trygghet',
    static: {
      primaryText: 'Hitta en hundvakt i närheten som du litar på. Se profiler, bilder och recensioner i Flocken-appen — innan du bokar.',
      headline: 'Se hundvakter nära dig',
      description: 'Hundvakt-app. Gratis.',
    },
    video: {
      primaryText: 'Du lämnar inte hunden hos vem som helst. I Flocken ser du hundvakter nära dig med profil och bild. Ladda ner gratis.',
      headline: 'Ladda ner Flocken gratis',
      description: 'Profiler, bild, närhet.',
    },
  },
  {
    code: 'b',
    name: 'skuld',
    adsetId: AD_SETS.skuld,
    utmCampaign: 'cb003_skuld',
    static: {
      primaryText: 'Hon tittar på dig när du packar väskan. Öppna Flocken — hitta en hundvakt i närheten som hon får träffa först.',
      headline: 'Hitta hundvakt hon gillar',
      description: 'Gratis i App Store.',
    },
    video: {
      primaryText: 'Du ska kunna resa utan att oroa dig för hunden. I Flocken-appen ser du hundvakter nära dig med profil och bild.',
      headline: 'Ladda ner hundvakt-appen',
      description: 'Träffas först, boka sen.',
    },
  },
  {
    code: 'c',
    name: 'natverk',
    adsetId: AD_SETS.natverk,
    utmCampaign: 'cb003_natverk',
    static: {
      // Kortad version (96 tecken) eftersom originalet var 126 tecken — Meta primary-gräns 125
      primaryText: 'Mamma orkar inte längre. Grannen har flyttat. I Flocken hittar du hundvakter i ditt grannskap.',
      headline: 'Hundvakt nära dig',
      description: 'Profiler nära dig. Gratis.',
    },
    video: {
      primaryText: 'Slipp fråga i Facebook-grupper. I Flocken ser du hundvakter nära dig, med profil, bild och recensioner. Gratis.',
      headline: 'Se hundvakter i appen',
      description: 'Bättre än Facebook-grupper.',
    },
  },
];

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
            console.error(`   ❌ API-fel: ${parsed.error.message}`);
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

async function getVideoThumbnail(videoId) {
  const result = await makeRequest(`/${videoId}/thumbnails?fields=uri,is_preferred`);
  if (result.data && result.data.length > 0) {
    const preferred = result.data.find((t) => t.is_preferred) || result.data[0];
    return preferred.uri;
  }
  return null;
}

async function createStaticAd(vinkel, videoThumbnail) {
  const adName = `ad_cid003_${vinkel.code}_v02_4x5_static`;
  console.log(`\n📢 Skapar ${adName}`);
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
      instagram_actor_id: INSTAGRAM_ID,
      link_data: {
        image_hash: IMAGE_HASHES[vinkel.name],
        link: finalUrl,
        message: vinkel.static.primaryText,
        name: vinkel.static.headline,
        description: vinkel.static.description,
        call_to_action: {
          type: 'DOWNLOAD', // BYT från LEARN_MORE — matchar "ladda ner"-språket
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
  console.log(`   ✅ Ad ID: ${ad.id}`);
  return ad.id;
}

async function createVideoAd(vinkel, videoThumbnail) {
  const adName = `ad_cid003_${vinkel.code}_v02_9x16_video`;
  console.log(`\n🎬 Skapar ${adName}`);
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
      instagram_actor_id: INSTAGRAM_ID,
      video_data: {
        video_id: SHARED_VIDEO_ID,
        image_url: videoThumbnail,
        title: vinkel.video.headline,
        message: vinkel.video.primaryText,
        link_description: vinkel.video.description,
        call_to_action: {
          type: 'DOWNLOAD',
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
  console.log(`   ✅ Ad ID: ${ad.id}`);
  return ad.id;
}

async function main() {
  console.log('═'.repeat(72));
  console.log('🔄 CB003 REPLACE ADS — v1 → v2 (copy + Instagram + CTA)');
  console.log('═'.repeat(72));

  // Steg 1: Radera befintliga ads
  console.log('\n🗑️  Raderar 6 v1-ads...');
  for (const id of OLD_AD_IDS) {
    try {
      const r = await makeRequest(`/${id}`, 'DELETE');
      console.log(`   ${r.success ? '✅' : '⚠️'} ${id}`);
    } catch (e) {
      console.log(`   ⚠️ ${id}: ${e.message}`);
    }
  }

  // Steg 2: Hämta thumbnail för delad video
  console.log('\n⏳ Hämtar video-thumbnail...');
  const thumbnail = await getVideoThumbnail(SHARED_VIDEO_ID);
  if (!thumbnail) {
    console.error('❌ Kunde inte hämta thumbnail. Avbryter.');
    process.exit(1);
  }
  console.log('   ✅ Klart');

  // Steg 3: Skapa nya ads
  const newAdIds = [];
  for (const vinkel of VINKLAR) {
    console.log(`\n${'─'.repeat(60)}`);
    console.log(`Vinkel: ${vinkel.name.toUpperCase()} (v2)`);
    console.log('─'.repeat(60));
    newAdIds.push({
      vinkel: vinkel.name,
      static: await createStaticAd(vinkel, thumbnail),
      video: await createVideoAd(vinkel, thumbnail),
    });
  }

  console.log('\n' + '═'.repeat(72));
  console.log('✅ KLART! 6 nya v2-ads skapade som PAUSED');
  console.log('═'.repeat(72));
  for (const a of newAdIds) {
    console.log(`\n${a.vinkel}:`);
    console.log(`  Static: ${a.static}`);
    console.log(`  Video:  ${a.video}`);
  }
  console.log(`\n🔗 Ads Manager:\nhttps://business.facebook.com/adsmanager/manage/campaigns?act=${AD_ACCOUNT_ID.replace('act_', '')}`);
  console.log('\nÄndringar v1 → v2:');
  console.log('  • Copy omskriven för annons-kontext (nämner hund/app, action-drivet)');
  console.log('  • Instagram-profil flocken_app aktiverad');
  console.log('  • CTA: LEARN_MORE → DOWNLOAD');
  console.log('  • Headline skiljer sig från bildens text-overlay');
  console.log('  • Description står för sig själv');
}

main().catch((err) => {
  console.error('\n❌ Fel:', err.message);
  process.exit(1);
});
