/**
 * Debug: varför fungerar instagram_actor_id=17841479914513348 på CB003 men inte CB004?
 *
 * Strategi:
 *  1. Städa det nya dangling-läget (120244209664040455 + dess ad set)
 *  2. Hämta en befintlig CB003-ad-creative och läs vilka IG-fält som faktiskt är satta
 *  3. Kolla vilka IG-assets som är kopplade till ad account
 *  4. Testa skapa en ad creative med olika IG-field-alternativ för att hitta vad som funkar
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

let envVars = {};
const envContent = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8');
envContent.split('\n').forEach((line) => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const match = trimmed.match(/^([^#=]+)=(.*)$/);
    if (match) envVars[match[1].trim()] = match[2].trim().replace(/^["']|["']$/g, '');
  }
});

const TOKEN = envVars.META_ACCESS_TOKEN;
const AD_ACCOUNT = envVars.META_AD_ACCOUNT_ID || 'act_1648246706340725';
const PAGE_ID = '936579286197312';
const IG_ID = '17841479914513348';

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
          resolve(JSON.parse(body));
        } catch (e) {
          reject(e);
        }
      });
    });
    r.on('error', reject);
    if (postData) r.write(postData);
    r.end();
  });
}

async function main() {
  console.log('═'.repeat(72));
  console.log('CB004 IG-id debug');
  console.log('═'.repeat(72));

  // 1. Städa senaste dangling (från failed launch)
  console.log('\n🧹 Letar dangling CB004-kampanjer...');
  const camps = await req(`/${AD_ACCOUNT}/campaigns?fields=id,name,effective_status&limit=50`);
  const cb004 = (camps.data || []).filter((c) => c.name?.includes('cid004'));
  console.log(`   Hittade ${cb004.length} CB004-kampanjer:`);
  for (const c of cb004) {
    console.log(`     - ${c.id} ${c.name} ${c.effective_status}`);
  }
  // Delete all CB004 campaigns (start fresh)
  for (const c of cb004) {
    console.log(`   🗑️  Raderar ${c.id}...`);
    const del = await req(`/${c.id}`, 'DELETE');
    console.log(`       ${JSON.stringify(del)}`);
  }

  // 2. Hämta en CB003-ad-creative och se vilka IG-fält som är satta
  console.log('\n🔬 Letar CB003-ad-creative för jämförelse...');
  const cb003camps = (camps.data || []).filter((c) => c.name?.includes('cid003'));
  if (cb003camps.length === 0) {
    console.log('   ❌ Ingen CB003 hittad — kan inte jämföra');
  } else {
    const cb003 = cb003camps[0];
    console.log(`   CB003: ${cb003.id} ${cb003.name}`);
    const adsets = await req(`/${cb003.id}/adsets?fields=id,name&limit=3`);
    for (const as of (adsets.data || []).slice(0, 1)) {
      const ads = await req(`/${as.id}/ads?fields=id,name,creative{id,object_story_spec,effective_instagram_media_id,instagram_actor_id,instagram_permalink_url,instagram_user_id}&limit=2`);
      for (const ad of ads.data || []) {
        console.log(`\n   Ad: ${ad.name} (${ad.id})`);
        console.log(`   Creative keys:`);
        const cr = ad.creative || {};
        for (const [k, v] of Object.entries(cr)) {
          if (k === 'object_story_spec') {
            console.log(`     object_story_spec:`);
            for (const [kk, vv] of Object.entries(v)) {
              if (kk === 'link_data') continue; // skip bulk
              console.log(`       ${kk}: ${typeof vv === 'object' ? JSON.stringify(vv) : vv}`);
            }
          } else {
            console.log(`     ${k}: ${typeof v === 'object' ? JSON.stringify(v) : v}`);
          }
        }
      }
    }
  }

  // 3. Kolla instagram_accounts på ad account
  console.log('\n🔍 IG-konton kopplade till ad account:');
  const igAccounts = await req(`/${AD_ACCOUNT}/instagram_accounts?fields=id,username`);
  if (igAccounts.error) console.log(`   Error: ${igAccounts.error.message}`);
  else console.log(`   ${JSON.stringify(igAccounts.data, null, 2)}`);

  // 4. Kolla om IG-id finns i promotable_instagram_accounts
  console.log('\n🔍 Promotable IG på ad account:');
  const promot = await req(`/${AD_ACCOUNT}?fields=instagram_accounts{id,username}`);
  console.log(`   ${JSON.stringify(promot, null, 2)}`);

  // 5. Business Manager instagram accounts
  console.log('\n🔍 Ad account-level valid IG actors (via /${AD_ACCOUNT}/advertisable_applications eller via Business):');
  // En annan gate-check: me/businesses → business/owned_instagram_accounts
  const me = await req('/me?fields=id,name');
  console.log(`   Me: ${JSON.stringify(me)}`);

  console.log('\n═'.repeat(72));
  console.log('Klart. Läs output ovan för att hitta skillnad mellan CB003 och CB004.');
  console.log('═'.repeat(72));
}

main().catch((e) => {
  console.error('❌', e.message);
  process.exit(1);
});
