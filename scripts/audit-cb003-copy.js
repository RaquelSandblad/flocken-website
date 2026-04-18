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
  { id: '120243909666600455', label: 'A trygghet static' },
  { id: '120243909669030455', label: 'A trygghet video' },
  { id: '120243909671570455', label: 'B skuld static' },
  { id: '120243909675630455', label: 'B skuld video' },
  { id: '120243909678290455', label: 'C natverk static' },
  { id: '120243909681210455', label: 'C natverk video' },
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
  for (const a of AD_IDS) {
    const ad = await get(`/${a.id}?fields=name,creative{object_story_spec}`);
    const spec = ad.creative.object_story_spec;
    const d = spec.link_data || spec.video_data;
    const cta = d.call_to_action;

    console.log(`\n═══ ${a.label} — ${ad.name}`);
    if (spec.link_data) {
      console.log(`MESSAGE (primary):\n${d.message}`);
      console.log(`HEADLINE (name): ${d.name}`);
      console.log(`DESCRIPTION: ${d.description}`);
    } else {
      console.log(`MESSAGE (primary):\n${d.message}`);
      console.log(`HEADLINE (title): ${d.title}`);
      console.log(`DESCRIPTION (link_description): ${d.link_description}`);
    }
    console.log(`CTA: ${cta.type} | display: ${cta.value.link_caption}`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
