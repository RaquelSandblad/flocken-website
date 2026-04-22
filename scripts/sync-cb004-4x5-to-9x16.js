/**
 * CB004 copy-sync: 4:5 → 9:16 per ad set
 *
 * Användning: Torbjörn uppdaterar copy/headline/description manuellt på 4:5-ads
 * i Ads Manager. Detta script läser 4:5-adens creative, kopierar text-fälten
 * till en ny creative för 9:16 (behåller 9:16s bild + utm_content), och
 * pekar 9:16-aden på den nya creativen.
 *
 * Loggar en diff mellan gammalt och nytt 9:16-creative så vi vet vad som
 * ändrades — sparas i flocken_ads/creative_bases/cb004/copy_sync_log.md.
 *
 * Kör:
 *   node scripts/sync-cb004-4x5-to-9x16.js              # dry-run, visar diffar
 *   node scripts/sync-cb004-4x5-to-9x16.js --confirm    # genomför sync
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// ────────────────────────────────────────────────────────────────────────────
// Konfiguration — ad-par per vinkel (från launch 2026-04-22)
// ────────────────────────────────────────────────────────────────────────────

const AD_PAIRS = [
  { vinkel: 'a_lekkompis',     ad4x5: '120244209736240455', ad9x16: '120244209740930455' },
  { vinkel: 'b_uttrakad',      ad4x5: '120244209746390455', ad9x16: '120244209750640455' },
  { vinkel: 'c_grupp',         ad4x5: '120244209756160455', ad9x16: '120244209760100455' },
];

const PAGE_ID = '936579286197312';

// ────────────────────────────────────────────────────────────────────────────
// Env + helpers
// ────────────────────────────────────────────────────────────────────────────

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

async function getAdCreative(adId) {
  const ad = await req(
    `/${adId}?fields=id,name,adset_id,creative{id,object_story_spec,image_hash,url_tags}`
  );
  return ad;
}

function extractCopy(ad) {
  const oss = ad.creative?.object_story_spec || {};
  const linkData = oss.link_data || {};
  return {
    message: linkData.message || null,
    name: linkData.name || null,
    description: linkData.description || null,
    link: linkData.link || null,
    image_hash: linkData.image_hash || null,
    call_to_action: linkData.call_to_action || null,
  };
}

function diff(before, after) {
  const rows = [];
  for (const key of ['message', 'name', 'description', 'link']) {
    if (before[key] !== after[key]) {
      rows.push({ key, before: before[key], after: after[key] });
    }
  }
  return rows;
}

// ────────────────────────────────────────────────────────────────────────────
// Main
// ────────────────────────────────────────────────────────────────────────────

async function main() {
  const confirm = process.argv.includes('--confirm');
  console.log('═'.repeat(72));
  console.log(`CB004 COPY SYNC 4:5 → 9:16 ${confirm ? '(CONFIRM MODE)' : '(DRY-RUN)'}`);
  console.log('═'.repeat(72));

  const diffReport = [];

  for (const pair of AD_PAIRS) {
    console.log(`\n${'─'.repeat(60)}`);
    console.log(`Vinkel: ${pair.vinkel}`);
    console.log('─'.repeat(60));

    const ad4x5 = await getAdCreative(pair.ad4x5);
    const ad9x16 = await getAdCreative(pair.ad9x16);

    const copy4x5 = extractCopy(ad4x5);
    const copy9x16 = extractCopy(ad9x16);

    // Bygg ny 9:16-copy = 4:5-text + 9:16s bild + 9:16s URL (för utm_content-attribution)
    const newCopy = {
      message: copy4x5.message,
      name: copy4x5.name,
      description: copy4x5.description,
      link: copy9x16.link, // behåll 9:16 URL (utm_content=a_9x16)
      image_hash: copy9x16.image_hash, // behåll 9:16-bild
      call_to_action: copy4x5.call_to_action || copy9x16.call_to_action,
    };

    const diffs = diff(copy9x16, newCopy);
    if (diffs.length === 0) {
      console.log(`   ℹ️  Ingen skillnad mellan 4:5 och 9:16 — hoppar över`);
      continue;
    }

    console.log(`   Förändringar (${diffs.length} fält):`);
    for (const d of diffs) {
      const beforeStr = (d.before || '').toString().replace(/\n/g, ' ');
      const afterStr = (d.after || '').toString().replace(/\n/g, ' ');
      console.log(`\n   [${d.key}]`);
      console.log(`     FÖRE (9:16):  ${beforeStr.substring(0, 120)}${beforeStr.length > 120 ? '...' : ''}`);
      console.log(`     EFTER (4:5):  ${afterStr.substring(0, 120)}${afterStr.length > 120 ? '...' : ''}`);
    }

    diffReport.push({
      vinkel: pair.vinkel,
      ad4x5: pair.ad4x5,
      ad9x16: pair.ad9x16,
      changes: diffs,
    });

    if (!confirm) continue;

    // Skapa ny creative baserat på newCopy
    console.log(`\n   🔄 Skapar ny creative för 9:16-ad ${pair.ad9x16}...`);
    const linkData = {
      image_hash: newCopy.image_hash,
      link: newCopy.link,
      message: newCopy.message,
      name: newCopy.name,
      description: newCopy.description,
      call_to_action: newCopy.call_to_action,
    };
    const objectStorySpec = {
      page_id: PAGE_ID,
      instagram_user_id: IG_ID,
      link_data: linkData,
    };
    const newCreative = await req(`/${AD_ACCOUNT}/adcreatives`, 'POST', {
      name: `ad_cid004_${pair.vinkel.split('_')[0]}_9x16_static_sync_${new Date().toISOString().split('T')[0]}`,
      object_story_spec: objectStorySpec,
    });
    console.log(`       ✅ Ny creative ID: ${newCreative.id}`);

    // Uppdatera 9:16-aden att peka på nya creative
    console.log(`   🔗 Kopplar 9:16-ad till ny creative...`);
    const updateResult = await req(`/${pair.ad9x16}`, 'POST', {
      creative: { creative_id: newCreative.id },
    });
    console.log(`       ✅ ${JSON.stringify(updateResult)}`);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Skriv diff-rapport
  // ──────────────────────────────────────────────────────────────────────────
  const timestamp = new Date().toISOString();
  const logPath = path.join(
    __dirname,
    '..',
    'flocken_ads',
    'creative_bases',
    'cb004',
    'copy_sync_log.md'
  );

  let md = '';
  if (fs.existsSync(logPath)) md = fs.readFileSync(logPath, 'utf8');
  else {
    md = `# CB004 — Copy-sync-logg (4:5 → 9:16)\n\n`;
    md += `Loggar vilka copy-ändringar Torbjörn gjort på 4:5-ads som sedan synkats till 9:16.\n`;
    md += `Används för att lära sig vilka copy-justeringar som landar bättre inför framtida vinklar.\n\n`;
    md += `---\n\n`;
  }

  md += `## ${timestamp} ${confirm ? '(applied)' : '(dry-run)'}\n\n`;
  for (const r of diffReport) {
    md += `### ${r.vinkel}\n\n`;
    md += `- 4:5-ad (källa): \`${r.ad4x5}\`\n`;
    md += `- 9:16-ad (uppdaterad): \`${r.ad9x16}\`\n\n`;
    for (const d of r.changes) {
      md += `**${d.key}**\n\n`;
      md += `- FÖRE (9:16):\n\n  > ${(d.before || '').toString().split('\n').join('\n  > ')}\n\n`;
      md += `- EFTER (4:5):\n\n  > ${(d.after || '').toString().split('\n').join('\n  > ')}\n\n`;
    }
    md += `---\n\n`;
  }

  if (diffReport.length === 0) {
    md += `_Inga skillnader att synka._\n\n---\n\n`;
  }

  fs.writeFileSync(logPath, md);
  console.log(`\n${'═'.repeat(72)}`);
  console.log(`📝 Logg skriven: ${logPath}`);
  console.log('═'.repeat(72));

  if (!confirm && diffReport.length > 0) {
    console.log(`\n⚠️  Detta var en dry-run. Kör igen med --confirm för att faktiskt synka:`);
    console.log(`   node scripts/sync-cb004-4x5-to-9x16.js --confirm`);
  }
}

main().catch((e) => {
  console.error('❌', e.message);
  process.exit(1);
});
