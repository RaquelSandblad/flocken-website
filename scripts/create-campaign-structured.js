// Script för att skapa kampanjer enligt Flocken Meta Ads struktur
// Följer: meta_ads_structure_flocken.md
const https = require('https');
const fs = require('fs');
const path = require('path');

// Läs .env.local direkt
let envVars = {};
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const match = trimmed.match(/^([^#=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim().replace(/^["']|["']$/g, '');
        envVars[key] = value;
      }
    }
  });
}

const ACCESS_TOKEN = 
  process.env.META_ACCESS_TOKEN || 
  process.env.META_ADS_API_TOKEN ||
  process.env.META_MARKETING_API_TOKEN ||
  envVars.META_ACCESS_TOKEN || 
  envVars.META_ADS_API_TOKEN ||
  envVars.META_MARKETING_API_TOKEN;

const AD_ACCOUNT_ID = 
  process.env.META_AD_ACCOUNT_ID ||
  envVars.META_AD_ACCOUNT_ID ||
  'act_1648246706340725';

if (!ACCESS_TOKEN) {
  console.error('❌ Ingen access token hittad!');
  process.exit(1);
}

// Funktion för att göra API-anrop
function makeRequest(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(`https://graph.facebook.com/v21.0${path}`);
    url.searchParams.set('access_token', ACCESS_TOKEN);
    
    const postData = data ? JSON.stringify(data) : null;
    
    const options = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = https.request(url, options, (res) => {
      let responseData = '';
      res.on('data', chunk => responseData += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          if (parsed.error) {
            reject(new Error(`Meta API Error: ${parsed.error.message} (Code: ${parsed.error.code})`));
          } else {
            resolve(parsed);
          }
        } catch (e) {
          reject(new Error(`Parse error: ${e.message}\nResponse: ${responseData.substring(0, 500)}`));
        }
      });
    });

    req.on('error', reject);
    
    if (postData) {
      req.write(postData);
    }
    
    req.end();
  });
}

// Generera campaign-namn enligt spec
// Format: c_<app><geo><stage><aud><obj>_h<nn>_cid<nnn>
function generateCampaignName(config) {
  const { app = 'flo', geo = 'swe', stage, aud, obj, hypotes, cid } = config;
  
  if (!stage || !aud || !obj || !hypotes || !cid) {
    throw new Error('Saknar obligatoriska fält: stage, aud, obj, hypotes, cid');
  }

  return `c_${app}_${geo}_${stage}_${aud}_${obj}_h${hypotes}_cid${cid}`;
}

// Generera ad set-namn enligt spec
// Format: as_<cell>_<geo>opt<obj>_cid<nnn>
function generateAdSetName(config) {
  const { cell, geo = 'swe', obj, cid } = config;
  
  if (!cell || !obj || !cid) {
    throw new Error('Saknar obligatoriska fält: cell, obj, cid');
  }

  return `as_${cell}_${geo}_opt_${obj}_cid${cid}`;
}

// Generera ad-namn enligt spec
// Format: ad_h<nn><g>_cb<nnn>_v<nn>hk<token>src<token>_cid<nnn>
function generateAdName(config) {
  const { hypotes, gren = 'a', cb, variant, hook, source = 'ai', cid } = config;
  
  if (!hypotes || !cb || !variant || !hook || !cid) {
    throw new Error('Saknar obligatoriska fält: hypotes, cb, variant, hook, cid');
  }

  return `ad_h${hypotes}${gren}_cb${cb}_v${variant}_hk_${hook}_src_${source}_cid${cid}`;
}

// Skapa campaign
async function createCampaign(config) {
  try {
    const campaignName = generateCampaignName(config);
    
    console.log('🚀 Skapar kampanj enligt ny struktur...\n');
    console.log(`   Namn: ${campaignName}`);
    console.log(`   CID: ${config.cid}`);
    console.log(`   Objective: ${config.objective || 'OUTCOME_TRAFFIC'}`);
    console.log(`   Status: ${config.status || 'PAUSED'}`);
    console.log(`   Budget: Ad Set-nivå (${config.daily_budget ? (config.daily_budget / 100).toFixed(2) + ' SEK/dag' : 'ej angiven'})\n`);

    const campaignData = {
      name: campaignName,
      objective: config.objective || 'OUTCOME_TRAFFIC',
      status: config.status || 'PAUSED',
      special_ad_categories: config.special_ad_categories || [],
      is_adset_budget_sharing_enabled: false, // Budget sätts på ad set-nivå
    };

    const result = await makeRequest(
      `/${AD_ACCOUNT_ID}/campaigns`,
      'POST',
      campaignData
    );

    console.log('✅ Kampanj skapad!');
    console.log(`   ID: ${result.id}`);
    console.log(`   CID: ${config.cid}`);
    console.log(`\n🔗 Meta Ads Manager:`);
    console.log(`   https://business.facebook.com/adsmanager/manage/campaigns?act=${AD_ACCOUNT_ID.replace('act_', '')}\n`);

    return { ...result, cid: config.cid };

  } catch (error) {
    console.error('\n❌ FEL vid skapande av kampanj:');
    console.error(`   ${error.message}\n`);
    throw error;
  }
}

// Skapa ad set
async function createAdSet(config) {
  try {
    const adSetName = generateAdSetName(config);
    
    console.log(`   📦 Skapar ad set: ${adSetName}...`);

    const adSetData = {
      name: adSetName,
      campaign_id: config.campaign_id,
      status: config.status || 'PAUSED',
      optimization_goal: config.optimization_goal || 'LINK_CLICKS',
      billing_event: config.billing_event || 'IMPRESSIONS',
      bid_strategy: 'LOWEST_COST_WITHOUT_CAP', // Låter Meta optimera utan bidcap
    };

    // Targeting
    if (config.targeting) {
      adSetData.targeting = config.targeting;
    } else {
      // Default targeting för Sverige
      adSetData.targeting = {
        geo_locations: { countries: ['SE'] },
        age_min: 18,
        age_max: 65,
      };
    }

    // Budget
    if (config.daily_budget) {
      adSetData.daily_budget = config.daily_budget;
    } else if (config.lifetime_budget) {
      adSetData.lifetime_budget = config.lifetime_budget;
    }

    const result = await makeRequest(
      `/${AD_ACCOUNT_ID}/adsets`,
      'POST',
      adSetData
    );

    console.log(`      ✅ Ad set skapad: ${result.id}\n`);

    return { ...result, cid: config.cid };

  } catch (error) {
    console.error(`   ❌ FEL vid skapande av ad set: ${error.message}\n`);
    throw error;
  }
}

// Hämta nästa tillgängliga CID
async function getNextCID() {
  try {
    // Hämta alla kampanjer
    const campaigns = await makeRequest(
      `/${AD_ACCOUNT_ID}/campaigns?fields=name&limit=200`
    );

    // Extrahera alla CID från kampanjnamn
    const cids = [];
    campaigns.data.forEach(campaign => {
      const match = campaign.name.match(/cid(\d{3})/);
      if (match) {
        cids.push(parseInt(match[1]));
      }
    });

    // Hitta nästa tillgängliga CID
    if (cids.length === 0) {
      return '001';
    }

    const maxCid = Math.max(...cids);
    const nextCid = maxCid + 1;
    
    return String(nextCid).padStart(3, '0');

  } catch (error) {
    console.warn('⚠️  Kunde inte hämta befintliga CID, använder 001');
    return '001';
  }
}

// Skapa komplett kampanjstruktur (campaign + ad sets)
async function createCompleteCampaign(config) {
  try {
    // Hämta eller använd angiven CID
    const cid = config.cid || await getNextCID();
    config.cid = cid;

    console.log('='.repeat(80));
    console.log('📋 Skapar komplett kampanjstruktur\n');
    console.log(`   CID: ${cid}`);
    console.log(`   Hypotes: ${config.hypotes}`);
    console.log(`   Audience: ${config.aud}`);
    console.log(`   Stage: ${config.stage}`);
    console.log('='.repeat(80));
    console.log('');

    // 1. Skapa campaign
    const campaign = await createCampaign({ ...config, cid });

    // 2. Skapa ad sets
    const adSets = [];
    const cells = config.cells || ['broad']; // Default: bara broad

    for (const cell of cells) {
      try {
        const adSet = await createAdSet({
          campaign_id: campaign.id,
          cell,
          geo: config.geo || 'swe',
          obj: config.obj,
          cid,
          daily_budget: config.adset_daily_budget || config.daily_budget,
          targeting: config.targeting,
          app_id: config.app_id,
          object_store_url: config.object_store_url,
        });
        adSets.push(adSet);
      } catch (error) {
        console.error(`   ⚠️  Kunde inte skapa ad set ${cell}: ${error.message}`);
      }
    }

    console.log('='.repeat(80));
    console.log('✅ Kampanjstruktur skapad!\n');
    console.log(`   Campaign ID: ${campaign.id}`);
    console.log(`   CID: ${cid}`);
    console.log(`   Ad Sets: ${adSets.length}`);
    console.log('='.repeat(80));
    console.log('');

    return {
      campaign,
      adSets,
      cid,
    };

  } catch (error) {
    console.error('\n❌ FEL vid skapande av komplett kampanj:');
    console.error(`   ${error.message}\n`);
    throw error;
  }
}

// Exempel: Skapa startpaket för h01
async function createStartPackage() {
  console.log('🎯 Skapar startpaket enligt creative_structure_flocken.md\n');
  console.log('   CB001 – Allmänt värde (hk_all)');
  console.log('   CB002 – Passa (hk_passa)');
  console.log('   CB003 – Besöka (hk_besoka)');
  console.log('');

  // Skapa en kampanj för h01 med dogowner audience
  const campaign = await createCompleteCampaign({
    app: 'flo',
    geo: 'swe',
    stage: 'init',
    aud: 'dogowner',
    obj: 'inst',
    hypotes: '01',
    objective: 'OUTCOME_TRAFFIC',
    status: 'PAUSED',
    daily_budget: 50000, // 500 SEK i öre
    cells: ['broad'], // Börja med broad targeting
  });

  console.log('📝 Nästa steg:');
  console.log('   1. Skapa Creative Bases (CB001, CB002, CB003)');
  console.log('   2. Skapa ads med korrekt naming');
  console.log('   3. Ladda upp assets');
  console.log('');

  return campaign;
}

// Main
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];

  if (command === 'start-package') {
    createStartPackage().catch(err => {
      console.error('❌ Oväntat fel:', err);
      process.exit(1);
    });
  } else if (command === 'campaign') {
    // Exempel: node create-campaign-structured.js campaign flo swe init dogowner inst 01 500
    const [app, geo, stage, aud, obj, hypotes, budget] = args.slice(1);
    
    if (!stage || !aud || !obj || !hypotes) {
      console.log('📝 Användning:');
      console.log('   node create-campaign-structured.js campaign <app> <geo> <stage> <aud> <obj> <hypotes> [budget_sek]');
      console.log('');
      console.log('Exempel:');
      console.log('   node create-campaign-structured.js campaign flo swe init dogowner inst 01 500');
      console.log('');
      console.log('Vokabulär:');
      console.log('   app: flo');
      console.log('   geo: swe');
      console.log('   stage: init, rmk');
      console.log('   aud: dogowner, sitter, biz, all');
      console.log('   obj: inst, eng');
      console.log('   hypotes: 01, 02, 03...');
      process.exit(0);
    }

    createCompleteCampaign({
      app: app || 'flo',
      geo: geo || 'swe',
      stage,
      aud,
      obj,
      hypotes,
      daily_budget: budget ? Math.round(parseFloat(budget) * 100) : undefined,
      objective: 'OUTCOME_TRAFFIC',
      status: 'PAUSED',
      cells: ['broad'],
    }).catch(err => {
      console.error('❌ Oväntat fel:', err);
      process.exit(1);
    });
  } else {
    console.log('📝 Användning:');
    console.log('   node create-campaign-structured.js start-package                    # Skapa startpaket (h01, dogowner)');
    console.log('   node create-campaign-structured.js campaign <args...>              # Skapa anpassad kampanj');
    console.log('');
    console.log('Exempel:');
    console.log('   node create-campaign-structured.js start-package');
    console.log('   node create-campaign-structured.js campaign flo swe init dogowner inst 01 500');
    console.log('');
    process.exit(0);
  }
}

module.exports = {
  createCampaign,
  createAdSet,
  createCompleteCampaign,
  createStartPackage,
  generateCampaignName,
  generateAdSetName,
  generateAdName,
  getNextCID,
  makeRequest,
  AD_ACCOUNT_ID,
};
