/**
 * Aktivera CB004 — kampanj + 3 ad sets + 6 ads i ett svep.
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const CAMPAIGN = '120244209727640455';
const ADSETS = ['120244209728540455', '120244209741980455', '120244209752550455'];
const ADS = [
  '120244209736240455', '120244209740930455', // A
  '120244209746390455', '120244209750640455', // B
  '120244209756160455', '120244209760100455', // C
];

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

async function activate(id, type) {
  const res = await req(`/${id}`, 'POST', { status: 'ACTIVE' });
  console.log(`   ✅ ${type} ${id}: ${JSON.stringify(res)}`);
}

async function main() {
  console.log('🚀 Aktiverar CB004...\n');

  console.log('Kampanj:');
  await activate(CAMPAIGN, 'Campaign');

  console.log('\nAd sets:');
  for (const id of ADSETS) await activate(id, 'AdSet');

  console.log('\nAds:');
  for (const id of ADS) await activate(id, 'Ad');

  console.log('\n✅ Allt aktivt.');
  console.log(`\n🔗 https://business.facebook.com/adsmanager/manage/campaigns?act=1648246706340725`);
}

main().catch((e) => { console.error('❌', e.message); process.exit(1); });
