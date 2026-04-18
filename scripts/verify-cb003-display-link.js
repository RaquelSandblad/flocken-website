#!/usr/bin/env node
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

const AD_IDS = [
  '120243909666600455',
  '120243909669030455',
  '120243909671570455',
  '120243909675630455',
  '120243909678290455',
  '120243909681210455',
];

function get(endpoint) {
  return new Promise((resolve, reject) => {
    const url = new URL(`https://graph.facebook.com/v24.0${endpoint}`);
    url.searchParams.set('access_token', ACCESS_TOKEN);
    https.get({ hostname: url.hostname, path: url.pathname + url.search }, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => {
        try {
          const j = JSON.parse(data);
          if (j.error) return reject(new Error(j.error.message));
          resolve(j);
        } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

async function main() {
  console.log('🔍 Verifierar link_caption per ad\n');
  let allOk = true;
  for (const adId of AD_IDS) {
    const ad = await get(`/${adId}?fields=name,creative{object_story_spec}`);
    const spec = ad.creative.object_story_spec;
    const cta = spec.link_data?.call_to_action || spec.video_data?.call_to_action;
    const linkCaption = cta?.value?.link_caption || '(saknas)';
    const ok = linkCaption === 'flocken.info';
    if (!ok) allOk = false;
    console.log(`${ok ? '✅' : '❌'} ${ad.name}`);
    console.log(`   link_caption: ${linkCaption}`);
  }
  console.log(`\n${allOk ? '✅ Alla 6 har link_caption = flocken.info' : '❌ Någon har fortfarande fel'}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
