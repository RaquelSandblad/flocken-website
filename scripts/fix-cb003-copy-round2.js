#!/usr/bin/env node
/**
 * Copy-round 2 fixes efter Torbjörns granskning 2026-04-18:
 * - C static: description "Profiler nära dig. Gratis." → "Hitta hundvakter nära dig. Ladda ner Flocken-appen gratis."
 * - B video: primary text nytt mellanled "av en hundvakt du hittar i Flocken-appen"
 * - C video: LÅT VARA (matchar videons existerande grafik "Ladda ner Flocken-appen")
 *
 * Strategi: klon creative + PATCH ad, ad-ID behålls.
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

const CHANGES = [
  {
    adId: '120243909678290455',
    label: 'C natverk static — description',
    patch: (ld) => ({ ...ld, description: 'Hitta hundvakter nära dig. Ladda ner Flocken-appen gratis.' }),
  },
  {
    adId: '120243909675630455',
    label: 'B skuld video — primary text',
    patch: (vd) => ({
      ...vd,
      message:
        'Klockan är halv sju, du packar väskan.\n\nHunden känner att något är på gång — men blir omhändertagen av en hundvakt du hittar i Flocken-appen.',
    }),
  },
];

function req(endpoint, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(`https://graph.facebook.com/v24.0${endpoint}`);
    if (method === 'GET') url.searchParams.set('access_token', ACCESS_TOKEN);
    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method,
      headers: { 'Content-Type': 'application/json' },
    };
    const r = https.request(options, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => {
        try {
          const j = JSON.parse(data);
          if (j.error) return reject(new Error(`${j.error.message} (code: ${j.error.code})`));
          resolve(j);
        } catch (e) { reject(new Error(`Parse error: ${data}`)); }
      });
    });
    r.on('error', reject);
    if (body) r.write(JSON.stringify({ ...body, access_token: ACCESS_TOKEN }));
    r.end();
  });
}

async function fixOne(change) {
  console.log(`\n🔧 ${change.label}  (ad ${change.adId})`);
  const ad = await req(`/${change.adId}?fields=name,creative{id,name,object_story_spec}`);
  const spec = ad.creative.object_story_spec;

  let newSpec;
  if (spec.link_data) {
    const ldNew = change.patch(spec.link_data);
    newSpec = {
      page_id: spec.page_id,
      instagram_user_id: spec.instagram_user_id,
      link_data: {
        image_hash: ldNew.image_hash,
        link: ldNew.link,
        message: ldNew.message,
        name: ldNew.name,
        description: ldNew.description,
        call_to_action: ldNew.call_to_action,
      },
    };
  } else {
    const vdNew = change.patch(spec.video_data);
    newSpec = {
      page_id: spec.page_id,
      instagram_user_id: spec.instagram_user_id,
      video_data: {
        video_id: vdNew.video_id,
        image_url: vdNew.image_url,
        title: vdNew.title,
        message: vdNew.message,
        link_description: vdNew.link_description,
        call_to_action: vdNew.call_to_action,
      },
    };
  }

  const newCreative = await req(`/${AD_ACCOUNT_ID}/adcreatives`, 'POST', {
    name: `${ad.creative.name} (copy-r2)`,
    object_story_spec: newSpec,
  });
  console.log(`   ↳ new creative ${newCreative.id}`);

  await req(`/${change.adId}`, 'POST', { creative: { creative_id: newCreative.id } });
  console.log(`   ✅ uppdaterad`);
}

async function main() {
  console.log('🔧 CB003 copy-round 2\n');
  for (const c of CHANGES) {
    try {
      await fixOne(c);
    } catch (err) {
      console.error(`   ❌ ${c.adId}: ${err.message}`);
    }
  }
  console.log('\n✅ Kör verify-cb003-copy.js för att granska resultat.');
}

main().catch((e) => { console.error('💥', e); process.exit(1); });
