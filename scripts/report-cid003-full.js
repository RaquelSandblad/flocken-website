/**
 * CID003 PASSA — Fullständig analysrapport 2026-04-21
 * READ-ONLY. Inga mutationer.
 *
 * Korrekta ad-ID:n (v03, aktiva):
 *   trygghet_static:  120243909666600455
 *   trygghet_video:   120243909669030455
 *   skuld_static:     120243909671570455
 *   skuld_video:      120243909675630455
 *   natverk_static:   120243909678290455
 *   natverk_video:    120243909681210455
 *
 * Creative-bytet skedde 2026-04-20 kl 14:13 (video-ads updated_time).
 * Budget-höjning: identifieras via daglig spend per adset.
 * Kampanj aktiverades 2026-04-18 (17/4 = PAUSED, 0 spend).
 */

const https = require('https');
const path = require('path');
const fs = require('fs');

let envVars = {};
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split('\n').forEach((line) => {
    const t = line.trim();
    if (t && !t.startsWith('#')) {
      const m = t.match(/^([^#=]+)=(.*)$/);
      if (m) envVars[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '');
    }
  });
}

const ACCESS_TOKEN = envVars.META_ACCESS_TOKEN;
const CAMPAIGN_ID = '120243902361470455';

const AD_SETS = {
  trygghet: '120243902362250455',
  skuld:    '120243902368990455',
  natverk:  '120243902373180455',
};

const ADS = {
  trygghet_static: '120243909666600455',
  trygghet_video:  '120243909669030455',
  skuld_static:    '120243909671570455',
  skuld_video:     '120243909675630455',
  natverk_static:  '120243909678290455',
  natverk_video:   '120243909681210455',
};

const VIDEO_ADS = {
  trygghet_video: '120243909669030455',
  skuld_video:    '120243909675630455',
  natverk_video:  '120243909681210455',
};

// Creative-byte timestamp: 2026-04-20 14:13 lokal tid
// Pre-creative: 2026-04-18 + 2026-04-19 + 2026-04-20 (del)
// Post-creative: 2026-04-20 (del) + 2026-04-21
// Vi segmenterar med API: pre = 18-19 april, post = 20-21 april (närmaste hel-dag)

const DATE_START = '2026-04-18'; // Kampanjen aktiverades 18/4 (17/4 = 0 spend)
const DATE_END   = '2026-04-21';
const PRE_CREATIVE_END   = '2026-04-19'; // 18-19 april = pre creative-byte
const POST_CREATIVE_START = '2026-04-20'; // 20-21 april = post creative-byte

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
          if (p.error) return reject(new Error(`API ${p.error.code}: ${p.error.message}`));
          resolve(p);
        } catch (e) { reject(e); }
      });
    });
    req.on('error', reject);
  });
}

function fetchInsights(id, fields, since, until) {
  return apiGet(`/${id}/insights?fields=${fields}&time_range={"since":"${since}","until":"${until}"}&limit=100`);
}

function fetchDailyInsights(id, fields, since, until) {
  return apiGet(`/${id}/insights?fields=${fields}&time_range={"since":"${since}","until":"${until}"}&time_increment=1&limit=100`);
}

const BASE = [
  'spend','impressions','reach','frequency','cpm','ctr',
  'inline_link_clicks','inline_link_click_ctr','cost_per_inline_link_click',
  'actions','cost_per_action_type',
].join(',');

const VIDEO_FIELDS = [
  'spend','impressions','inline_link_clicks','actions',
  'video_p25_watched_actions','video_p50_watched_actions',
  'video_p75_watched_actions','video_p100_watched_actions',
  'video_avg_time_watched_actions','video_thruplay_watched_actions',
].join(',');

function getAction(actions, type) {
  if (!actions) return 0;
  const a = Array.isArray(actions) ? actions.find(x => x.action_type === type) : null;
  return a ? parseFloat(a.value) : 0;
}

function fmt(n, d = 2) {
  if (n === null || n === undefined || isNaN(n)) return 'N/A';
  return parseFloat(n).toFixed(d);
}

function sep() { console.log('─'.repeat(72)); }

function printMetrics(label, d, indent = '') {
  if (!d) { console.log(`${indent}[${label}] — inga data`); return null; }
  const lpv = getAction(d.actions, 'landing_page_view');
  const lc  = parseFloat(d.inline_link_clicks || 0);
  const lpvRate = lc > 0 ? (lpv / lc * 100) : 0;
  const cplpv = lpv > 0 ? parseFloat(d.spend) / lpv : null;
  console.log(`${indent}[${label}]`);
  console.log(`${indent}  Spend:       ${d.spend} SEK`);
  console.log(`${indent}  Impressions: ${d.impressions}`);
  console.log(`${indent}  Reach:       ${d.reach}`);
  console.log(`${indent}  Frequency:   ${fmt(d.frequency)}`);
  console.log(`${indent}  CPM:         ${fmt(d.cpm)} SEK`);
  console.log(`${indent}  CTR (all):   ${fmt(d.ctr)}%`);
  console.log(`${indent}  CTR (link):  ${fmt(d.inline_link_click_ctr)}%`);
  console.log(`${indent}  LinkClicks:  ${lc}`);
  console.log(`${indent}  LPV:         ${lpv}`);
  console.log(`${indent}  LPV-rate:    ${fmt(lpvRate)}%`);
  console.log(`${indent}  CPC (link):  ${fmt(d.cost_per_inline_link_click)} SEK`);
  console.log(`${indent}  CPLPV:       ${cplpv ? fmt(cplpv) + ' SEK' : 'N/A (0 LPV)'}`);
  return { spend: parseFloat(d.spend), cpm: parseFloat(d.cpm), ctr_link: parseFloat(d.inline_link_click_ctr), lc, lpv, lpvRate, cplpv, freq: parseFloat(d.frequency), impressions: parseFloat(d.impressions) };
}

async function main() {
  console.log('\n' + '='.repeat(72));
  console.log('  CID003 PASSA — Fullständig analysrapport');
  console.log('  Genererad: ' + new Date().toISOString());
  console.log('  Period: 2026-04-18 → 2026-04-21 (17/4 = 0 spend, PAUSED)');
  console.log('  Creative-byte: 2026-04-20 kl 14:13 (video) / 18/4 kl 21:42 (static)');
  console.log('='.repeat(72) + '\n');

  // ── 1. KAMPANJ-TOTALT ─────────────────────────────────────────────────
  console.log('## 1. KAMPANJ-TOTALT (hela perioden 18–21 april)');
  sep();
  try {
    const r = await fetchInsights(CAMPAIGN_ID, BASE, DATE_START, DATE_END);
    printMetrics('CID003 totalt', r.data && r.data[0]);
  } catch(e) { console.log('FEL: ' + e.message); }

  // ── 2. PER AD SET ─────────────────────────────────────────────────────
  console.log('\n## 2. PER AD SET (hela perioden)');
  sep();
  const adsetData = {};
  for (const [name, id] of Object.entries(AD_SETS)) {
    try {
      const r = await fetchInsights(id, BASE, DATE_START, DATE_END);
      adsetData[name] = printMetrics(name.toUpperCase(), r.data && r.data[0]);
    } catch(e) { console.log(`[${name}] FEL: ${e.message}`); }
  }

  // ── 3. PER AD (hela perioden) ─────────────────────────────────────────
  console.log('\n## 3. PER AD (hela perioden)');
  sep();
  const adData = {};
  for (const [name, id] of Object.entries(ADS)) {
    try {
      const r = await fetchInsights(id, BASE, DATE_START, DATE_END);
      adData[name] = printMetrics(name, r.data && r.data[0]);
    } catch(e) { console.log(`[${name}] FEL: ${e.message}`); }
  }

  // ── 4. STATIC vs VIDEO PER VINKEL ────────────────────────────────────
  console.log('\n## 4. STATIC 4:5 vs VIDEO 9:16 — jämförelse per vinkel');
  sep();
  const vinklar = ['trygghet', 'skuld', 'natverk'];
  for (const v of vinklar) {
    const s = adData[`${v}_static`];
    const vid = adData[`${v}_video`];
    console.log(`\n[${v.toUpperCase()}]`);
    if (s && vid) {
      console.log(`  Format        CTR(link)%  CPC(SEK)  LPV   LPV-rate%  CPLPV(SEK)  Spend(SEK)`);
      console.log(`  Static 4:5    ${fmt(s.ctr_link).padEnd(11)} ${fmt(s.cplpv ? parseFloat(adData[`${v}_static`]) : null) === 'N/A' ? (s.spend / s.lc).toFixed(2).padEnd(9) : (s.spend / (s.lc || 1)).toFixed(2).padEnd(9)} ${String(s.lpv).padEnd(5)} ${fmt(s.lpvRate).padEnd(10)} ${s.cplpv ? fmt(s.cplpv).padEnd(11) : 'N/A'.padEnd(11)} ${s.spend}`);
      console.log(`  Video 9:16    ${fmt(vid.ctr_link).padEnd(11)} ${(vid.spend / (vid.lc || 1)).toFixed(2).padEnd(9)} ${String(vid.lpv).padEnd(5)} ${fmt(vid.lpvRate).padEnd(10)} ${vid.cplpv ? fmt(vid.cplpv).padEnd(11) : 'N/A'.padEnd(11)} ${vid.spend}`);
    } else {
      console.log('  Data saknas för en eller båda formaten.');
    }
  }

  // ── 5. VIDEO-METRICS (9:16) ───────────────────────────────────────────
  console.log('\n## 5. VIDEO-METRICS (9:16-ads, hela perioden)');
  sep();
  for (const [name, id] of Object.entries(VIDEO_ADS)) {
    try {
      const r = await fetchInsights(id, VIDEO_FIELDS, DATE_START, DATE_END);
      const d = r.data && r.data[0];
      if (!d) { console.log(`[${name}] — inga data`); continue; }
      const impr = parseFloat(d.impressions || 1);
      const p25  = getAction(d.video_p25_watched_actions, 'video_view');
      const p50  = getAction(d.video_p50_watched_actions, 'video_view');
      const p75  = getAction(d.video_p75_watched_actions, 'video_view');
      const p100 = getAction(d.video_p100_watched_actions, 'video_view');
      const tp   = getAction(d.video_thruplay_watched_actions, 'video_view');
      const avg  = getAction(d.video_avg_time_watched_actions, 'video_view');
      console.log(`\n[${name}] (${id})`);
      console.log(`  Impressions:  ${d.impressions}`);
      console.log(`  Link Clicks:  ${d.inline_link_clicks || 0}`);
      console.log(`  P25:          ${p25} (${fmt(p25/impr*100)}% av impr)`);
      console.log(`  P50:          ${p50} (${fmt(p50/impr*100)}%)`);
      console.log(`  P75:          ${p75} (${fmt(p75/impr*100)}%)`);
      console.log(`  P100:         ${p100} (${fmt(p100/impr*100)}%)`);
      console.log(`  Thruplay:     ${tp}`);
      console.log(`  Avg watch:    ${fmt(avg)} sek`);
    } catch(e) { console.log(`[${name}] FEL: ${e.message}`); }
  }

  // ── 6. PRE vs POST CREATIVE-BYTE ──────────────────────────────────────
  // Creative-byte: video updated 2026-04-20 14:13, static updated 2026-04-18 21:42
  // Static byttes redan dag 1 (18/4 kl 21:42) — praktiskt sett nästan hela perioden är "post"
  // Video byttes 2026-04-20 14:13 — pre = 18-19 april, post = 20-21 april
  console.log('\n## 6. PRE vs POST CREATIVE-BYTE (video-byte 2026-04-20)');
  sep();
  console.log('OBS: Static-ads updated 2026-04-18 21:42 — troligen byte inom launch-dag.');
  console.log('     Video-ads updated 2026-04-20 14:13 — tydlig pre/post-gräns.');
  console.log('     Pre = 18-19 april | Post = 20-21 april\n');

  console.log('--- PRE (18-19 april) ---');
  try {
    const r = await fetchInsights(CAMPAIGN_ID, BASE, '2026-04-18', '2026-04-19');
    printMetrics('CID003 PRE creative', r.data && r.data[0]);
  } catch(e) { console.log('FEL: ' + e.message); }

  console.log('\n--- POST (20-21 april) ---');
  try {
    const r = await fetchInsights(CAMPAIGN_ID, BASE, '2026-04-20', '2026-04-21');
    printMetrics('CID003 POST creative', r.data && r.data[0]);
  } catch(e) { console.log('FEL: ' + e.message); }

  // Per ad set pre/post
  console.log('\n--- PRE per ad set ---');
  const preAdset = {};
  for (const [name, id] of Object.entries(AD_SETS)) {
    try {
      const r = await fetchInsights(id, BASE, '2026-04-18', '2026-04-19');
      preAdset[name] = printMetrics(name.toUpperCase() + ' PRE', r.data && r.data[0]);
    } catch(e) { console.log(`[${name} PRE] FEL: ${e.message}`); }
  }

  console.log('\n--- POST per ad set ---');
  const postAdset = {};
  for (const [name, id] of Object.entries(AD_SETS)) {
    try {
      const r = await fetchInsights(id, BASE, '2026-04-20', '2026-04-21');
      postAdset[name] = printMetrics(name.toUpperCase() + ' POST', r.data && r.data[0]);
    } catch(e) { console.log(`[${name} POST] FEL: ${e.message}`); }
  }

  // ── 7. BUDGET-HÖJNING — IDENTIFIERING ────────────────────────────────
  // Budget är nu 80 SEK/dag. Launch-skript satte 50 SEK/dag.
  // Vi kan inte direkt se när budget ändrades via insights, men vi kan se
  // om spend/dag överstiger 50 SEK per ad set som indikation.
  console.log('\n## 7. BUDGET-HÖJNING — ANALYS');
  sep();
  console.log('Launch-skript: 50 SEK/dag per adset. Aktuell budget: 80 SEK/dag per adset.');
  console.log('Total budget: 50→80 SEK × 3 = 150→240 SEK/dag.\n');
  console.log('Spend per dag per ad set (för att identifiera höjningsdatum):');

  for (const [name, id] of Object.entries(AD_SETS)) {
    try {
      const r = await fetchDailyInsights(id, 'spend,impressions', DATE_START, DATE_END);
      console.log(`\n[${name.toUpperCase()}]`);
      console.log('  Datum       Spend    50-SEK-tak  80-SEK-tak  Indikation');
      for (const d of (r.data || [])) {
        const spend = parseFloat(d.spend);
        const vs50 = spend > 50 ? '> 50 SEK (>50 kr-tak)' : '<= 50 SEK';
        const vs80 = spend > 80 ? '> 80 SEK (>80 kr-tak)' : '<= 80 SEK';
        console.log(`  ${d.date_start}  ${String(d.spend).padEnd(8)} ${vs50}`);
      }
    } catch(e) { console.log(`[${name}] FEL: ${e.message}`); }
  }

  // ── 8. DAGLIG BREAKDOWN (komplett) ───────────────────────────────────
  console.log('\n## 8. DAGLIG BREAKDOWN (kampanj + per ad set)');
  sep();

  console.log('\n[KAMPANJ-TOTALT daglig]');
  console.log('Datum       Spend    Impr   Freq   CPM      CTR(lnk)  LPV   LPV-rate');
  try {
    const r = await fetchDailyInsights(CAMPAIGN_ID, BASE, DATE_START, DATE_END);
    for (const d of (r.data || [])) {
      const lpv = getAction(d.actions, 'landing_page_view');
      const lc  = parseFloat(d.inline_link_clicks || 0);
      const lpvRate = lc > 0 ? (lpv / lc * 100) : 0;
      console.log(
        `${d.date_start}  ${String(d.spend).padEnd(8)} ${String(d.impressions).padEnd(6)} ` +
        `${fmt(d.frequency).padEnd(6)} ${fmt(d.cpm).padEnd(8)} ` +
        `${fmt(d.inline_link_click_ctr).padEnd(9)} ${String(lpv).padEnd(5)} ${fmt(lpvRate)}%`
      );
    }
  } catch(e) { console.log('FEL: ' + e.message); }

  for (const [name, id] of Object.entries(AD_SETS)) {
    console.log(`\n[${name.toUpperCase()} daglig]`);
    console.log('Datum       Spend    Impr   Freq   CPM      CTR(lnk)  LPV   LPV-rate');
    try {
      const r = await fetchDailyInsights(id, BASE, DATE_START, DATE_END);
      for (const d of (r.data || [])) {
        const lpv = getAction(d.actions, 'landing_page_view');
        const lc  = parseFloat(d.inline_link_clicks || 0);
        const lpvRate = lc > 0 ? (lpv / lc * 100) : 0;
        console.log(
          `${d.date_start}  ${String(d.spend).padEnd(8)} ${String(d.impressions).padEnd(6)} ` +
          `${fmt(d.frequency).padEnd(6)} ${fmt(d.cpm).padEnd(8)} ` +
          `${fmt(d.inline_link_click_ctr).padEnd(9)} ${String(lpv).padEnd(5)} ${fmt(lpvRate)}%`
        );
      }
    } catch(e) { console.log('FEL: ' + e.message); }
  }

  // ── 9. RAW ACTIONS (för debug) ────────────────────────────────────────
  console.log('\n## 9. RAW ACTIONS (kampanj-totalt, för att verifiera LPV-mapping)');
  sep();
  try {
    const r = await fetchInsights(CAMPAIGN_ID, 'actions,cost_per_action_type', DATE_START, DATE_END);
    const d = r.data && r.data[0];
    if (d && d.actions) {
      console.log('Actions:');
      for (const a of d.actions) {
        console.log(`  ${a.action_type}: ${a.value}`);
      }
      if (d.cost_per_action_type) {
        console.log('\nCost per action type:');
        for (const a of d.cost_per_action_type) {
          console.log(`  ${a.action_type}: ${a.value} SEK`);
        }
      }
    }
  } catch(e) { console.log('FEL: ' + e.message); }

  console.log('\n' + '='.repeat(72));
  console.log('  Rapport klar. ' + new Date().toISOString());
  console.log('='.repeat(72) + '\n');
}

main().catch((e) => { console.error('KRITISKT FEL:', e.message); process.exit(1); });
