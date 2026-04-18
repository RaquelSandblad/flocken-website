#!/usr/bin/env node
/**
 * Fix display_link (link_caption) på alla 6 CB003-ads.
 * Från: flocken.info/v/passa
 * Till: flocken.info
 *
 * Strategi: hämta varje ads creative, klona med ny link_caption,
 * uppdatera ad att peka på nya creative. Ad-ID behålls, status PAUSED oförändrad.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};
envContent.split('\n').forEach((line) => {
  const [key, ...rest] = line.split('=');
  if (key && rest.length) envVars[key.trim()] = rest.join('=').trim();
});

const ACCESS_TOKEN = envVars.META_ACCESS_TOKEN || envVars.META_ADS_API_TOKEN || envVars.META_MARKETING_API_TOKEN;
const AD_ACCOUNT_ID = envVars.META_AD_ACCOUNT_ID || 'act_1648246706340725';

if (!ACCESS_TOKEN) {
  console.error('❌ Saknar META_ACCESS_TOKEN i .env.local');
  process.exit(1);
}

const NEW_DISPLAY_LINK = 'flocken.info';

// 6 ads från v03-körningen (trygghet/skuld/natverk × static/video)
const AD_IDS = [
  '120243909666600455', // trygghet static
  '120243909669030455', // trygghet video
  '120243909671570455', // skuld static
  '120243909675630455', // skuld video
  '120243909678290455', // natverk static
  '120243909681210455', // natverk video
];

function makeRequest(endpoint, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(`https://graph.facebook.com/v24.0${endpoint}`);
    if (method === 'GET') {
      url.searchParams.set('access_token', ACCESS_TOKEN);
    }

    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method,
      headers: { 'Content-Type': 'application/json' },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.error) return reject(new Error(`${json.error.message} (code: ${json.error.code})`));
          resolve(json);
        } catch (e) {
          reject(new Error(`Parse error: ${data}`));
        }
      });
    });

    req.on('error', reject);
    if (body) {
      const bodyWithToken = { ...body, access_token: ACCESS_TOKEN };
      req.write(JSON.stringify(bodyWithToken));
    }
    req.end();
  });
}

async function fixOneAd(adId) {
  console.log(`\n🔧 Ad ${adId}`);

  // 1. Hämta ad → creative_id
  const ad = await makeRequest(`/${adId}?fields=name,creative{id,object_story_spec,name}`);
  const oldCreativeId = ad.creative.id;
  const adName = ad.name;
  const spec = ad.creative.object_story_spec;
  console.log(`   ↳ ${adName}`);
  console.log(`   ↳ old creative ${oldCreativeId}`);

  // 2. Bygg ny creative-payload med uppdaterad link_caption
  let newSpec;
  if (spec.link_data) {
    const ld = spec.link_data;
    newSpec = {
      page_id: spec.page_id,
      instagram_user_id: spec.instagram_user_id,
      link_data: {
        image_hash: ld.image_hash,
        link: ld.link,
        message: ld.message,
        name: ld.name,
        description: ld.description,
        call_to_action: {
          type: ld.call_to_action.type,
          value: { link: ld.link, link_caption: NEW_DISPLAY_LINK },
        },
      },
    };
  } else if (spec.video_data) {
    const vd = spec.video_data;
    newSpec = {
      page_id: spec.page_id,
      instagram_user_id: spec.instagram_user_id,
      video_data: {
        video_id: vd.video_id,
        image_url: vd.image_url,
        title: vd.title,
        message: vd.message,
        link_description: vd.link_description,
        call_to_action: {
          type: vd.call_to_action.type,
          value: { link: vd.call_to_action.value.link, link_caption: NEW_DISPLAY_LINK },
        },
      },
    };
  } else {
    throw new Error(`Creative ${oldCreativeId} saknar link_data och video_data`);
  }

  // 3. Skapa ny creative
  const newCreative = await makeRequest(`/${AD_ACCOUNT_ID}/adcreatives`, 'POST', {
    name: `${ad.creative.name || adName + ' Creative'} (display-fix)`,
    object_story_spec: newSpec,
  });
  console.log(`   ↳ new creative ${newCreative.id}`);

  // 4. PATCH ad att peka på nya creative
  await makeRequest(`/${adId}`, 'POST', {
    creative: { creative_id: newCreative.id },
  });
  console.log(`   ✅ ad uppdaterad`);

  return { adId, adName, oldCreativeId, newCreativeId: newCreative.id };
}

async function main() {
  console.log('🔧 CB003 display_link-fix: flocken.info/v/passa → flocken.info');
  console.log(`   ${AD_IDS.length} ads\n`);

  const results = [];
  for (const adId of AD_IDS) {
    try {
      const r = await fixOneAd(adId);
      results.push(r);
    } catch (err) {
      console.error(`   ❌ ${adId}: ${err.message}`);
      results.push({ adId, error: err.message });
    }
  }

  console.log('\n📊 Sammanfattning:');
  results.forEach((r) => {
    if (r.error) console.log(`   ❌ ${r.adId}: ${r.error}`);
    else console.log(`   ✅ ${r.adName} (${r.adId})`);
  });

  const successCount = results.filter((r) => !r.error).length;
  console.log(`\n${successCount}/${AD_IDS.length} ads uppdaterade.`);
  console.log(`\n🔗 Granska: https://business.facebook.com/adsmanager/manage/campaigns?act=${AD_ACCOUNT_ID.replace('act_', '')}`);
}

main().catch((err) => {
  console.error('💥', err);
  process.exit(1);
});
