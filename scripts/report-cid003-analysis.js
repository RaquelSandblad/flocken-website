/**
 * CID003 PASSA — Analysrapport 2026-04-21
 *
 * READ-ONLY. Inga mutationer mot Meta.
 * Hämtar data från Meta Marketing API v22.0 för:
 * - Kampanj-totalt (CID003)
 * - Per ad set (trygghet/skuld/natverk)
 * - Per ad (6 st)
 * - Daglig breakdown (17/4 → 21/4)
 * - Video-metrics för 9:16-ads
 */

const https = require('https');
const path = require('path');
const fs = require('fs');

// ── Credentials ──────────────────────────────────────────────────────────────

let envVars = {};
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
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
}

const ACCESS_TOKEN = envVars.META_ACCESS_TOKEN;
const AD_ACCOUNT_ID = envVars.META_AD_ACCOUNT_ID || 'act_1648246706340725';

if (!ACCESS_TOKEN) {
  console.error('META_ACCESS_TOKEN saknas i .env.local');
  process.exit(1);
}

// ── Kända ID:n (från launch_result.md) ───────────────────────────────────────

const CAMPAIGN_ID = '120243902361470455';

const AD_SETS = {
  trygghet: '120243902362250455',
  skuld:    '120243902368990455',
  natverk:  '120243902373180455',
};

const ADS = {
  trygghet_static:  '120243902366250455',
  trygghet_video:   '120243902367790455',
  skuld_static:     '120243902370680455',
  skuld_video:      '120243902372190455',
  natverk_static:   '120243902374590455',
  natverk_video:    '120243902376470455',
};

// Video-ads för extra video-metrics
const VIDEO_ADS = ['120243902367790455', '120243902372190455', '120243902376470455'];

// ── API-helper ────────────────────────────────────────────────────────────────

function apiGet(urlPath) {
  return new Promise((resolve, reject) => {
    const url = new URL(`https://graph.facebook.com/v22.0${urlPath}`);
    url.searchParams.set('access_token', ACCESS_TOKEN);

    const req = https.get(url, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (parsed.error) {
            return reject(new Error(`API-fel ${parsed.error.code}: ${parsed.error.message}`));
          }
          resolve(parsed);
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on('error', reject);
  });
}

// ── Metrics-definitioner ──────────────────────────────────────────────────────

const BASE_FIELDS = [
  'spend',
  'impressions',
  'reach',
  'frequency',
  'cpm',
  'ctr',
  'unique_link_clicks_ctr',
  'clicks',
  'unique_clicks',
  'actions',
  'cost_per_action_type',
  'inline_link_clicks',
  'inline_link_click_ctr',
  'cost_per_inline_link_click',
  'outbound_clicks',
  'cost_per_outbound_click',
].join(',');

const VIDEO_FIELDS = [
  'spend',
  'impressions',
  'inline_link_clicks',
  'actions',
  'video_p25_watched_actions',
  'video_p50_watched_actions',
  'video_p75_watched_actions',
  'video_p100_watched_actions',
  'video_avg_time_watched_actions',
  'video_thruplay_watched_actions',
].join(',');

const DATE_START = '2026-04-17';
const DATE_END   = '2026-04-21';

// ── Fetch-funktioner ──────────────────────────────────────────────────────────

async function fetchInsights(objectId, level, fields, extraParams = '') {
  const path = `/${objectId}/insights?fields=${fields}&time_range={"since":"${DATE_START}","until":"${DATE_END}"}${extraParams}&limit=100`;
  return apiGet(path);
}

async function fetchDailyInsights(objectId, fields) {
  const path = `/${objectId}/insights?fields=${fields}&time_range={"since":"${DATE_START}","until":"${DATE_END}"}&time_increment=1&limit=100`;
  return apiGet(path);
}

async function fetchAdInfo(adId) {
  return apiGet(`/${adId}?fields=name,status,effective_status`);
}

async function fetchAdSetInfo(adSetId) {
  return apiGet(`/${adSetId}?fields=name,status,effective_status,daily_budget`);
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function getAction(actions, actionType) {
  if (!actions) return 0;
  const a = actions.find((x) => x.action_type === actionType);
  return a ? parseFloat(a.value) : 0;
}

function fmt(n, decimals = 2) {
  if (n === null || n === undefined || isNaN(n)) return 'N/A';
  return parseFloat(n).toFixed(decimals);
}

function pct(n) {
  return fmt(parseFloat(n) * 100) + '%';
}

function sep() {
  console.log('─'.repeat(70));
}

// ── Huvud-kör ─────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n======================================================================');
  console.log('  CID003 PASSA — Analysrapport 2026-04-21');
  console.log('  Period: 2026-04-17 → 2026-04-21');
  console.log('  Källa: Meta Marketing API v22.0 (live hämtning)');
  console.log('======================================================================\n');

  // ── 0. Ad/AdSet-info (namn, status, budget) ──────────────────────────────
  console.log('## 0. STRUKTUR-VERIFIERING (namn, status, budget)');
  sep();

  for (const [name, id] of Object.entries(AD_SETS)) {
    try {
      const info = await fetchAdSetInfo(id);
      console.log(`AdSet "${name}" (${id})`);
      console.log(`  Namn:    ${info.name}`);
      console.log(`  Status:  ${info.status} / effective: ${info.effective_status}`);
      console.log(`  Budget:  ${info.daily_budget ? parseInt(info.daily_budget) / 100 + ' SEK/dag' : 'N/A (CBO?)'}`);
    } catch (e) {
      console.log(`AdSet "${name}" (${id}): FEL — ${e.message}`);
    }
  }

  console.log('');
  for (const [name, id] of Object.entries(ADS)) {
    try {
      const info = await fetchAdInfo(id);
      console.log(`Ad "${name}" (${id}): ${info.status} / effective: ${info.effective_status}`);
    } catch (e) {
      console.log(`Ad "${name}" (${id}): FEL — ${e.message}`);
    }
  }

  // ── 1. KAMPANJ-TOTALT ────────────────────────────────────────────────────
  console.log('\n## 1. KAMPANJ-TOTALT');
  sep();
  try {
    const r = await fetchInsights(CAMPAIGN_ID, 'campaign', BASE_FIELDS);
    const d = r.data && r.data[0];
    if (!d) { console.log('Inga data för kampanjen.'); }
    else {
      const lpv = getAction(d.actions, 'landing_page_view');
      const lc  = parseFloat(d.inline_link_clicks || 0);
      const lpvRate = lc > 0 ? (lpv / lc * 100) : 0;
      const cplpv = lpv > 0 ? parseFloat(d.spend) / lpv : null;

      console.log(`Spend:          ${d.spend} SEK`);
      console.log(`Impressions:    ${d.impressions}`);
      console.log(`Reach:          ${d.reach}`);
      console.log(`Frequency:      ${fmt(d.frequency)}`);
      console.log(`CPM:            ${fmt(d.cpm)} SEK`);
      console.log(`CTR (all):      ${fmt(d.ctr)}%`);
      console.log(`CTR (link):     ${fmt(d.inline_link_click_ctr)}%`);
      console.log(`Link Clicks:    ${lc}`);
      console.log(`LPV:            ${lpv}`);
      console.log(`LPV-rate:       ${fmt(lpvRate)}%`);
      console.log(`CPC (link):     ${fmt(d.cost_per_inline_link_click)} SEK`);
      console.log(`CPLPV:          ${cplpv ? fmt(cplpv) + ' SEK' : 'N/A'}`);
    }
  } catch (e) {
    console.log(`FEL: ${e.message}`);
  }

  // ── 2. PER AD SET ────────────────────────────────────────────────────────
  console.log('\n## 2. PER AD SET');
  sep();

  const adsetResults = {};
  for (const [name, id] of Object.entries(AD_SETS)) {
    try {
      const r = await fetchInsights(id, 'adset', BASE_FIELDS);
      const d = r.data && r.data[0];
      if (!d) {
        console.log(`\n[${name.toUpperCase()}] — inga data`);
        continue;
      }
      const lpv = getAction(d.actions, 'landing_page_view');
      const lc  = parseFloat(d.inline_link_clicks || 0);
      const lpvRate = lc > 0 ? (lpv / lc * 100) : 0;
      const cplpv = lpv > 0 ? parseFloat(d.spend) / lpv : null;

      adsetResults[name] = { spend: parseFloat(d.spend), cpm: parseFloat(d.cpm), ctr_link: parseFloat(d.inline_link_click_ctr), lc, lpv, lpvRate, cplpv, freq: parseFloat(d.frequency) };

      console.log(`\n[${name.toUpperCase()}] (adset ${id})`);
      console.log(`  Spend:         ${d.spend} SEK`);
      console.log(`  Impressions:   ${d.impressions}`);
      console.log(`  Reach:         ${d.reach}`);
      console.log(`  Frequency:     ${fmt(d.frequency)}`);
      console.log(`  CPM:           ${fmt(d.cpm)} SEK`);
      console.log(`  CTR (all):     ${fmt(d.ctr)}%`);
      console.log(`  CTR (link):    ${fmt(d.inline_link_click_ctr)}%`);
      console.log(`  Link Clicks:   ${lc}`);
      console.log(`  LPV:           ${lpv}`);
      console.log(`  LPV-rate:      ${fmt(lpvRate)}%`);
      console.log(`  CPC (link):    ${fmt(d.cost_per_inline_link_click)} SEK`);
      console.log(`  CPLPV:         ${cplpv ? fmt(cplpv) + ' SEK' : 'N/A'}`);
    } catch (e) {
      console.log(`\n[${name.toUpperCase()}] FEL: ${e.message}`);
    }
  }

  // ── 3. PER AD ────────────────────────────────────────────────────────────
  console.log('\n## 3. PER AD');
  sep();

  const adResults = {};
  for (const [name, id] of Object.entries(ADS)) {
    try {
      const r = await fetchInsights(id, 'ad', BASE_FIELDS);
      const d = r.data && r.data[0];
      if (!d) {
        console.log(`\n[${name}] — inga data`);
        continue;
      }
      const lpv = getAction(d.actions, 'landing_page_view');
      const lc  = parseFloat(d.inline_link_clicks || 0);
      const lpvRate = lc > 0 ? (lpv / lc * 100) : 0;
      const cplpv = lpv > 0 ? parseFloat(d.spend) / lpv : null;

      adResults[name] = { spend: parseFloat(d.spend), cpm: parseFloat(d.cpm), ctr_link: parseFloat(d.inline_link_click_ctr), lc, lpv, lpvRate, cplpv, freq: parseFloat(d.frequency) };

      console.log(`\n[${name}] (${id})`);
      console.log(`  Spend:         ${d.spend} SEK`);
      console.log(`  Impressions:   ${d.impressions}`);
      console.log(`  Reach:         ${d.reach}`);
      console.log(`  Frequency:     ${fmt(d.frequency)}`);
      console.log(`  CPM:           ${fmt(d.cpm)} SEK`);
      console.log(`  CTR (all):     ${fmt(d.ctr)}%`);
      console.log(`  CTR (link):    ${fmt(d.inline_link_click_ctr)}%`);
      console.log(`  Link Clicks:   ${lc}`);
      console.log(`  LPV:           ${lpv}`);
      console.log(`  LPV-rate:      ${fmt(lpvRate)}%`);
      console.log(`  CPC (link):    ${fmt(d.cost_per_inline_link_click)} SEK`);
      console.log(`  CPLPV:         ${cplpv ? fmt(cplpv) + ' SEK' : 'N/A'}`);
    } catch (e) {
      console.log(`\n[${name}] FEL: ${e.message}`);
    }
  }

  // ── 4. VIDEO-METRICS FÖR 9:16-ADS ───────────────────────────────────────
  console.log('\n## 4. VIDEO-METRICS (9:16-ads)');
  sep();

  const videoAdNames = { '120243902367790455': 'trygghet_video', '120243902372190455': 'skuld_video', '120243902376470455': 'natverk_video' };
  for (const id of VIDEO_ADS) {
    const name = videoAdNames[id];
    try {
      const r = await fetchInsights(id, 'ad', VIDEO_FIELDS);
      const d = r.data && r.data[0];
      if (!d) {
        console.log(`\n[${name}] — inga video-data`);
        continue;
      }
      const p25 = getAction(d.video_p25_watched_actions, 'video_view');
      const p50 = getAction(d.video_p50_watched_actions, 'video_view');
      const p75 = getAction(d.video_p75_watched_actions, 'video_view');
      const p100 = getAction(d.video_p100_watched_actions, 'video_view');
      const thruplay = getAction(d.video_thruplay_watched_actions, 'video_view');
      const avgTime = getAction(d.video_avg_time_watched_actions, 'video_view');
      const impr = parseFloat(d.impressions || 1);

      console.log(`\n[${name}] (${id})`);
      console.log(`  Impressions:   ${d.impressions}`);
      console.log(`  Link Clicks:   ${d.inline_link_clicks || 0}`);
      console.log(`  P25:           ${p25} (${fmt(p25/impr*100)}% av impressions)`);
      console.log(`  P50:           ${p50} (${fmt(p50/impr*100)}%)`);
      console.log(`  P75:           ${p75} (${fmt(p75/impr*100)}%)`);
      console.log(`  P100:          ${p100} (${fmt(p100/impr*100)}%)`);
      console.log(`  Thruplay:      ${thruplay}`);
      console.log(`  Avg watch:     ${fmt(avgTime)} sek`);
    } catch (e) {
      console.log(`\n[${name}] FEL: ${e.message}`);
    }
  }

  // ── 5. DAGLIG BREAKDOWN ──────────────────────────────────────────────────
  console.log('\n## 5. DAGLIG BREAKDOWN (kampanj-totalt)');
  sep();

  try {
    const r = await fetchDailyInsights(CAMPAIGN_ID, BASE_FIELDS);
    if (!r.data || r.data.length === 0) {
      console.log('Inga dagliga data.');
    } else {
      console.log('Datum       Spend   Impr   Freq   CPM    CTR(lnk)  LPV  LPV-rate');
      for (const d of r.data) {
        const lpv = getAction(d.actions, 'landing_page_view');
        const lc  = parseFloat(d.inline_link_clicks || 0);
        const lpvRate = lc > 0 ? (lpv / lc * 100) : 0;
        console.log(
          `${d.date_start}  ${String(d.spend).padEnd(7)} ${String(d.impressions).padEnd(6)} ` +
          `${fmt(d.frequency).padEnd(6)} ${fmt(d.cpm).padEnd(6)} ` +
          `${fmt(d.inline_link_click_ctr).padEnd(9)} ${String(lpv).padEnd(4)} ${fmt(lpvRate)}%`
        );
      }
    }
  } catch (e) {
    console.log(`FEL: ${e.message}`);
  }

  // ── 6. DAGLIG BREAKDOWN PER AD SET ──────────────────────────────────────
  console.log('\n## 6. DAGLIG BREAKDOWN PER AD SET');
  sep();

  for (const [name, id] of Object.entries(AD_SETS)) {
    console.log(`\n[${name.toUpperCase()}]`);
    try {
      const r = await fetchDailyInsights(id, BASE_FIELDS);
      if (!r.data || r.data.length === 0) {
        console.log('  Inga dagliga data.');
        continue;
      }
      console.log('  Datum       Spend  Impr   Freq   CPM    CTR(lnk)  LPV  LPV-rate');
      for (const d of r.data) {
        const lpv = getAction(d.actions, 'landing_page_view');
        const lc  = parseFloat(d.inline_link_clicks || 0);
        const lpvRate = lc > 0 ? (lpv / lc * 100) : 0;
        console.log(
          `  ${d.date_start}  ${String(d.spend).padEnd(6)} ${String(d.impressions).padEnd(6)} ` +
          `${fmt(d.frequency).padEnd(6)} ${fmt(d.cpm).padEnd(6)} ` +
          `${fmt(d.inline_link_click_ctr).padEnd(9)} ${String(lpv).padEnd(4)} ${fmt(lpvRate)}%`
        );
      }
    } catch (e) {
      console.log(`  FEL: ${e.message}`);
    }
  }

  // ── 7. DAGLIG BREAKDOWN PER AD ──────────────────────────────────────────
  console.log('\n## 7. DAGLIG BREAKDOWN PER AD');
  sep();

  for (const [name, id] of Object.entries(ADS)) {
    console.log(`\n[${name}]`);
    try {
      const r = await fetchDailyInsights(id, BASE_FIELDS);
      if (!r.data || r.data.length === 0) {
        console.log('  Inga dagliga data.');
        continue;
      }
      console.log('  Datum       Spend  Impr  Freq  CPM    CTR(lnk) LPV LPV-rate');
      for (const d of r.data) {
        const lpv = getAction(d.actions, 'landing_page_view');
        const lc  = parseFloat(d.inline_link_clicks || 0);
        const lpvRate = lc > 0 ? (lpv / lc * 100) : 0;
        console.log(
          `  ${d.date_start}  ${String(d.spend).padEnd(6)} ${String(d.impressions).padEnd(5)} ` +
          `${fmt(d.frequency).padEnd(5)} ${fmt(d.cpm).padEnd(6)} ` +
          `${fmt(d.inline_link_click_ctr).padEnd(8)} ${String(lpv).padEnd(3)} ${fmt(lpvRate)}%`
        );
      }
    } catch (e) {
      console.log(`  FEL: ${e.message}`);
    }
  }

  console.log('\n======================================================================');
  console.log('  Rapport klar. Genererad: ' + new Date().toISOString());
  console.log('======================================================================\n');
}

main().catch((e) => {
  console.error('KRITISKT FEL:', e.message);
  process.exit(1);
});
