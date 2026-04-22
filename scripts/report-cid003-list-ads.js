/**
 * Hämtar aktiva ads per ad set för CID003.
 * READ-ONLY.
 */

const https = require('https');
const path = require('path');
const fs = require('fs');

let envVars = {};
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const match = trimmed.match(/^([^#=]+)=(.*)$/);
      if (match) envVars[match[1].trim()] = match[2].trim().replace(/^["']|["']$/g, '');
    }
  });
}

const ACCESS_TOKEN = envVars.META_ACCESS_TOKEN;

function apiGet(urlPath) {
  return new Promise((resolve, reject) => {
    const url = new URL(`https://graph.facebook.com/v22.0${urlPath}`);
    url.searchParams.set('access_token', ACCESS_TOKEN);
    const req = https.get(url, (res) => {
      let body = '';
      res.on('data', (c) => (body += c));
      res.on('end', () => {
        try {
          const p = JSON.parse(body);
          if (p.error) return reject(new Error(`${p.error.code}: ${p.error.message}`));
          resolve(p);
        } catch (e) { reject(e); }
      });
    });
    req.on('error', reject);
  });
}

const AD_SETS = {
  trygghet: '120243902362250455',
  skuld:    '120243902368990455',
  natverk:  '120243902373180455',
};

async function main() {
  console.log('\n=== Aktiva ads per ad set (alla statusar) ===\n');

  for (const [name, id] of Object.entries(AD_SETS)) {
    console.log(`\n[${name.toUpperCase()}] adset ${id}`);
    try {
      // Hämta alla ads oavsett status (inkl. deleted) med effective_status filter
      const r = await apiGet(`/${id}/ads?fields=id,name,status,effective_status,created_time,updated_time&limit=50`);
      if (!r.data || r.data.length === 0) {
        console.log('  Inga ads hittade.');
        continue;
      }
      for (const ad of r.data) {
        console.log(`  ID: ${ad.id}`);
        console.log(`  Namn: ${ad.name}`);
        console.log(`  Status: ${ad.status} / effective: ${ad.effective_status}`);
        console.log(`  Skapad: ${ad.created_time}`);
        console.log(`  Uppdaterad: ${ad.updated_time}`);
        console.log('');
      }
    } catch (e) {
      console.log(`  FEL: ${e.message}`);
    }
  }

  // Hämta också kampanjens budget-historik via insights per dag för att identifiera budget-höjningsdatum
  console.log('\n=== Kampanj-dagdata för spend-mönster (inkl. 17/4) ===');
  try {
    const r = await apiGet(`/120243902361470455/insights?fields=spend,impressions,inline_link_clicks,actions&time_range={"since":"2026-04-17","until":"2026-04-21"}&time_increment=1&limit=100`);
    console.log('\nDatum       Spend     Impr');
    for (const d of (r.data || [])) {
      console.log(`${d.date_start}  ${String(d.spend).padEnd(9)} ${d.impressions}`);
    }
  } catch(e) {
    console.log(`FEL dagdata: ${e.message}`);
  }
}

main().catch((e) => { console.error('FEL:', e.message); process.exit(1); });
