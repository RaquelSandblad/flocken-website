/**
 * Fixar headline-typo på vinkel C (båda format):
 * "Sluta söka i hundar grupptrådar" → "Sluta söka hundar i grupptrådar"
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const ADS = ['120244209756160455', '120244209760100455']; // C 4:5 + 9:16
const NEW_HEADLINE = 'Sluta söka hundar i grupptrådar';
const PAGE_ID = '936579286197312';

let envVars = {};
const envContent = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8');
envContent.split('\n').forEach((line) => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const m = trimmed.match(/^([^#=]+)=(.*)$/);
    if (m) envVars[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '');
  }
});
const TOKEN = envVars.META_ACCESS_TOKEN;
const AD_ACCOUNT = envVars.META_AD_ACCOUNT_ID || 'act_1648246706340725';
const IG_ID = envVars.META_INSTAGRAM_ID || '17841479914513348';

function req(urlPath, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(`https://graph.facebook.com/v24.0${urlPath}`);
    url.searchParams.set('access_token', TOKEN);
    const postData = data ? JSON.stringify(data) : null;
    const options = { method, headers: { 'Content-Type': 'application/json' } };
    const r = https.request(url, options, (res) => {
      let body = '';
      res.on('data', (c) => (body += c));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (parsed.error) return reject(new Error(parsed.error.message));
          resolve(parsed);
        } catch (e) { reject(e); }
      });
    });
    r.on('error', reject);
    if (postData) r.write(postData);
    r.end();
  });
}

async function main() {
  console.log(`🔧 Fixar headline: "${NEW_HEADLINE}"\n`);

  for (const adId of ADS) {
    const ad = await req(`/${adId}?fields=id,name,creative{object_story_spec}`);
    const oss = ad.creative.object_story_spec;
    const linkData = { ...oss.link_data, name: NEW_HEADLINE };

    console.log(`Ad ${adId} (${ad.name}):`);
    console.log(`   Gammal: ${oss.link_data.name}`);
    console.log(`   Ny:     ${NEW_HEADLINE}`);

    const newCreative = await req(`/${AD_ACCOUNT}/adcreatives`, 'POST', {
      name: `${ad.name}_headline_fix_${new Date().toISOString().split('T')[0]}`,
      object_story_spec: {
        page_id: PAGE_ID,
        instagram_user_id: IG_ID,
        link_data: linkData,
      },
    });
    console.log(`   ✅ Ny creative: ${newCreative.id}`);

    const update = await req(`/${adId}`, 'POST', { creative: { creative_id: newCreative.id } });
    console.log(`   ✅ Kopplad: ${JSON.stringify(update)}\n`);
  }
}

main().catch((e) => { console.error('❌', e.message); process.exit(1); });
