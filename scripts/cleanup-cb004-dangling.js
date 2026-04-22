/**
 * CB004 cleanup — radera dangling kampanj + ad set från failed launch-försök
 *
 * Kontext: launch-cb004-hundar.js failade på instagram_actor_id efter att
 * ha skapat kampanj 120244205424080455 + ad set 120244205427130455.
 * Dessa ligger kvar i Ads Manager som PAUSED men tomma/ofullständiga.
 *
 * Detta script:
 *  1. Listar vad som finns kvar (så vi ser innan vi raderar)
 *  2. Verifierar IG-koppling på Page (felsökning för varför det failade)
 *  3. Raderar dangling kampanj (raderar ad sets + ads rekursivt)
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const DANGLING_CAMPAIGN = '120244205424080455';
const DANGLING_ADSET = '120244205427130455';
const PAGE_ID = '936579286197312';
const EXPECTED_IG = '17841479914513348';

let envVars = {};
const envPath = path.join(__dirname, '..', '.env.local');
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

const ACCESS_TOKEN = envVars.META_ACCESS_TOKEN || envVars.META_ADS_API_TOKEN || envVars.META_MARKETING_API_TOKEN;
const AD_ACCOUNT_ID = envVars.META_AD_ACCOUNT_ID || 'act_1648246706340725';

function request(urlPath, method = 'GET', data = null) {
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
      res.on('data', (c) => (body += c));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
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

async function main() {
  console.log('═'.repeat(72));
  console.log('CB004 CLEANUP + IG-DIAGNOSTICS');
  console.log('═'.repeat(72));

  // 1. Check dangling campaign
  console.log(`\n🔍 Kollar dangling kampanj ${DANGLING_CAMPAIGN}...`);
  const camp = await request(`/${DANGLING_CAMPAIGN}?fields=id,name,status,effective_status`);
  if (camp.error) {
    console.log(`   ℹ️  Kampanj finns inte längre (${camp.error.message})`);
  } else {
    console.log(`   Hittad: ${camp.name} — ${camp.effective_status}`);

    // List adsets under it
    const adsets = await request(`/${DANGLING_CAMPAIGN}/adsets?fields=id,name,effective_status`);
    console.log(`   Ad sets under: ${adsets.data?.length || 0}`);
    if (adsets.data) {
      for (const a of adsets.data) {
        console.log(`     - ${a.id} ${a.name} (${a.effective_status})`);
        const ads = await request(`/${a.id}/ads?fields=id,name,effective_status`);
        console.log(`       Ads: ${ads.data?.length || 0}`);
      }
    }
  }

  // 2. Check IG-connection on Page
  console.log(`\n🔍 Verifierar IG-koppling på Page ${PAGE_ID}...`);
  const pageInfo = await request(`/${PAGE_ID}?fields=id,name,instagram_business_account,connected_instagram_account`);
  if (pageInfo.error) {
    console.log(`   ❌ Kan inte läsa Page: ${pageInfo.error.message}`);
  } else {
    console.log(`   Page: ${pageInfo.name}`);
    console.log(`   instagram_business_account: ${JSON.stringify(pageInfo.instagram_business_account)}`);
    console.log(`   connected_instagram_account:  ${JSON.stringify(pageInfo.connected_instagram_account)}`);
    const actual = pageInfo.instagram_business_account?.id || pageInfo.connected_instagram_account?.id;
    if (actual === EXPECTED_IG) {
      console.log(`   ✅ Matchar förväntad IG-id (${EXPECTED_IG})`);
    } else {
      console.log(`   ⚠️  Skiljer sig från förväntad (${EXPECTED_IG}). Actual: ${actual}`);
    }
  }

  // 3. Verify IG-id is accessible via ad account
  console.log(`\n🔍 Kollar om IG ${EXPECTED_IG} är valid som ad account asset...`);
  const igCheck = await request(`/${EXPECTED_IG}?fields=id,username`);
  if (igCheck.error) {
    console.log(`   ❌ IG-id ogiltig via token: ${igCheck.error.message}`);
  } else {
    console.log(`   ✅ IG: @${igCheck.username} (${igCheck.id})`);
  }

  // 4. Prompt before deletion
  console.log(`\n${'═'.repeat(72)}`);
  console.log('Redo att radera dangling kampanj. Kör med --confirm för att genomföra.');
  console.log('═'.repeat(72));

  if (process.argv.includes('--confirm')) {
    console.log(`\n🗑️  Raderar kampanj ${DANGLING_CAMPAIGN}...`);
    const del = await request(`/${DANGLING_CAMPAIGN}`, 'DELETE');
    console.log(`   Resultat: ${JSON.stringify(del)}`);
  } else {
    console.log(`\nℹ️  Kör: node scripts/cleanup-cb004-dangling.js --confirm`);
  }
}

main().catch((err) => {
  console.error('❌', err.message);
  process.exit(1);
});
