// Script för att skapa Meta Ads från Creative Bases (CB)
// Följer: meta_ads_structure_flocken.md och creative_structure_flocken.md
// Baserat på NastaHem's beprövade workflow

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

// Flocken Facebook Page ID
const PAGE_ID = process.env.FLOCKEN_PAGE_ID || envVars.FLOCKEN_PAGE_ID || '936579286197312';
const INSTAGRAM_ACTOR_ID = process.env.FLOCKEN_INSTAGRAM_ID || envVars.FLOCKEN_INSTAGRAM_ID || '936579286197312';

// Default landing page
const DEFAULT_LANDING_PAGE = 'https://flocken.info/valkommen';
const GOOGLE_PLAY_URL = 'https://play.google.com/store/apps/details?id=com.bastavan.app';

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

// Läs brief.md och extrahera info
function parseBrief(briefPath) {
  if (!fs.existsSync(briefPath)) {
    throw new Error(`Brief not found: ${briefPath}`);
  }
  
  const content = fs.readFileSync(briefPath, 'utf8');
  const brief = {};
  
  // Extrahera fält
  const landingMatch = content.match(/Landningssida:\s*\n(https?:\/\/[^\s\n]+)/);
  if (landingMatch) brief.landing_page = landingMatch[1].trim();
  
  const ctaMatch = content.match(/CTA:\s*\n([^\n]+)/);
  if (ctaMatch) brief.cta = ctaMatch[1].trim();
  
  const hookMatch = content.match(/Hook \(hk\):\s*\n([^\n]+)/);
  if (hookMatch) brief.hook = hookMatch[1].trim();
  
  return brief;
}

// Läs copy.md och extrahera varianter
function parseCopy(copyPath) {
  if (!fs.existsSync(copyPath)) {
    throw new Error(`Copy not found: ${copyPath}`);
  }
  
  const content = fs.readFileSync(copyPath, 'utf8');
  const copy = {
    primary_texts: [],
    headlines: [],
    descriptions: []
  };
  
  // Extrahera Primary text
  const primaryMatch = content.match(/## Primary text[^\n]*\n([\s\S]*?)(?=##|$)/);
  if (primaryMatch) {
    const lines = primaryMatch[1].split('\n').filter(l => l.trim() && !l.startsWith('*') && !l.startsWith('-'));
    copy.primary_texts = lines.map(l => l.trim()).filter(l => l.length > 0);
  }
  
  // Extrahera Headlines
  const headlineMatch = content.match(/## Headline[^\n]*\n([\s\S]*?)(?=##|$)/);
  if (headlineMatch) {
    const lines = headlineMatch[1].split('\n').filter(l => l.trim() && !l.startsWith('*') && !l.startsWith('-'));
    copy.headlines = lines.map(l => l.trim()).filter(l => l.length > 0);
  }
  
  // Extrahera Description
  const descMatch = content.match(/## Description[^\n]*\n([\s\S]*?)(?=##|$)/);
  if (descMatch) {
    const lines = descMatch[1].split('\n').filter(l => l.trim() && !l.startsWith('*') && !l.startsWith('-'));
    copy.descriptions = lines.map(l => l.trim()).filter(l => l.length > 0);
  }
  
  return copy;
}

// Ladda upp bild till Meta
async function uploadImage(imagePath, label) {
  console.log(`\n📷 Laddar upp ${label}...`);
  
  if (!fs.existsSync(imagePath)) {
    console.error(`❌ Bild ej funnen: ${imagePath}`);
    return null;
  }
  
  const imageBuffer = fs.readFileSync(imagePath);
  const imageBase64 = imageBuffer.toString('base64');
  
  const result = await makeRequest(
    `/${AD_ACCOUNT_ID}/adimages`,
    'POST',
    { bytes: imageBase64 }
  );
  
  const imageHash = result.images?.bytes?.hash;
  if (imageHash) {
    console.log(`   ✅ Uppladdad! Hash: ${imageHash}`);
  }
  
  return imageHash;
}

// Ladda upp video till Meta
async function uploadVideo(videoPath, label) {
  console.log(`\n🎬 Laddar upp video ${label}...`);
  
  if (!fs.existsSync(videoPath)) {
    console.error(`❌ Video ej funnen: ${videoPath}`);
    return null;
  }
  
  const videoBuffer = fs.readFileSync(videoPath);
  const videoBase64 = videoBuffer.toString('base64');
  const fileSize = videoBuffer.length;
  
  // Video upload är mer komplex - behöver multipart
  // För enkelhet, använd advideos endpoint
  const result = await makeRequest(
    `/${AD_ACCOUNT_ID}/advideos`,
    'POST',
    { 
      source: videoBase64,
      file_size: fileSize,
      title: label
    }
  );
  
  if (result.id) {
    console.log(`   ✅ Video uppladdad! ID: ${result.id}`);
    return result.id;
  }
  
  return null;
}

// Skapa ad creative
async function createAdCreative(config) {
  console.log(`\n🎨 Skapar ad creative: ${config.name}...`);
  
  if (!PAGE_ID) {
    throw new Error('FLOCKEN_PAGE_ID saknas i .env.local! Lägg till din Facebook Page ID.');
  }
  
  // Bygg landing page URL med UTM
  let finalUrl = config.landing_page || DEFAULT_LANDING_PAGE;
  if (config.utm_params) {
    const params = new URLSearchParams(config.utm_params);
    finalUrl = `${finalUrl}?${params.toString()}`;
  }
  
  const linkData = {
    link: finalUrl,
    call_to_action: {
      type: config.cta_type || 'LEARN_MORE',
      value: { link: finalUrl }
    },
    name: config.headline,
    message: config.primary_text
  };
  
  if (config.description) {
    linkData.description = config.description;
  }
  
  // Lägg till bild eller video
  if (config.image_hash) {
    linkData.image_hash = config.image_hash;
  } else if (config.video_id) {
    linkData.video_id = config.video_id;
  }
  
  const objectStorySpec = {
    page_id: PAGE_ID,
    link_data: linkData
  };
  
  if (INSTAGRAM_ACTOR_ID) {
    objectStorySpec.instagram_actor_id = INSTAGRAM_ACTOR_ID;
  }
  
  const creativeData = {
    name: config.name,
    object_story_spec: objectStorySpec,
  };
  
  const result = await makeRequest(
    `/${AD_ACCOUNT_ID}/adcreatives`,
    'POST',
    creativeData
  );
  
  console.log(`   ✅ Creative skapad! ID: ${result.id}`);
  return result.id;
}

// Skapa ad
async function createAd(config) {
  console.log(`\n🚀 Skapar ad: ${config.name}...`);
  
  const adData = {
    name: config.name,
    adset_id: config.adset_id,
    creative: { creative_id: config.creative_id },
    status: config.status || 'PAUSED',
  };
  
  const result = await makeRequest(
    `/${AD_ACCOUNT_ID}/ads`,
    'POST',
    adData
  );
  
  console.log(`   ✅ Ad skapad! ID: ${result.id}`);
  return result.id;
}

// Generera ad-namn enligt spec
function generateAdName(config) {
  const { hypotes, gren = 'a', cb, variant, hook, source = 'ai', cid } = config;
  return `ad_h${hypotes}${gren}_cb${cb}_v${variant}_hk_${hook}_src_${source}_cid${cid}`;
}

// Huvudfunktion: Skapa ads från en Creative Base
async function createAdsFromCB(cbNumber, adSetId, cid, hypotes = '01') {
  console.log('='.repeat(80));
  console.log(`📦 Skapar ads från CB${cbNumber.toString().padStart(3, '0')}`);
  console.log('='.repeat(80));
  
  const cbPath = path.join(__dirname, '..', 'flocken_ads', 'creative_bases', `cb${cbNumber.toString().padStart(3, '0')}`);
  
  if (!fs.existsSync(cbPath)) {
    throw new Error(`CB path not found: ${cbPath}`);
  }
  
  // Läs brief och copy
  const brief = parseBrief(path.join(cbPath, 'brief.md'));
  const copy = parseCopy(path.join(cbPath, 'copy.md'));
  
  console.log(`\n📋 CB${cbNumber.toString().padStart(3, '0')} Info:`);
  console.log(`   Hook: ${brief.hook || 'N/A'}`);
  console.log(`   Landing page: ${brief.landing_page || DEFAULT_LANDING_PAGE}`);
  console.log(`   Headlines: ${copy.headlines.length}`);
  console.log(`   Primary texts: ${copy.primary_texts.length}`);
  
  // Hitta assets
  const assetsPath = path.join(cbPath, 'assets');
  const imgPath = path.join(assetsPath, 'img');
  const vidPath = path.join(assetsPath, 'vid');
  
  let mediaFiles = [];
  
  // Kolla efter videos
  if (fs.existsSync(vidPath)) {
    const videos = fs.readdirSync(vidPath).filter(f => f.match(/\.(mp4|mov)$/i));
    mediaFiles = videos.map(v => ({ type: 'video', path: path.join(vidPath, v), name: v }));
  }
  
  // Kolla efter bilder
  if (fs.existsSync(imgPath)) {
    const images = fs.readdirSync(imgPath).filter(f => f.match(/\.(png|jpg|jpeg)$/i));
    mediaFiles = mediaFiles.concat(images.map(i => ({ type: 'image', path: path.join(imgPath, i), name: i })));
  }
  
  if (mediaFiles.length === 0) {
    console.log(`\n⚠️  Inga assets hittade i ${assetsPath}`);
    console.log('   Skapar ads utan media (placeholder)...');
  } else {
    console.log(`\n📁 Assets: ${mediaFiles.length} filer`);
    mediaFiles.forEach(m => console.log(`   - ${m.name} (${m.type})`));
  }
  
  // Extrahera hook token från brief
  const hookMatch = brief.hook?.match(/hk_(\w+)/);
  const hookToken = hookMatch ? hookMatch[1] : 'all';
  
  const ads = [];
  let variantNum = 1;
  
  // Skapa ads - en per media + copy-kombination
  // Begränsa till 3 varianter per CB för att inte överväldiga
  const maxVariants = 3;
  const headlines = copy.headlines.slice(0, maxVariants);
  const primaryTexts = copy.primary_texts.slice(0, maxVariants);
  
  for (let i = 0; i < Math.max(headlines.length, 1); i++) {
    const headline = headlines[i] || headlines[0] || 'Ladda ner Flocken';
    const primaryText = primaryTexts[i] || primaryTexts[0] || 'Hitta hundvänner nära dig';
    const description = copy.descriptions[i] || copy.descriptions[0] || '';
    
    // Om vi har media, skapa en ad per media
    const mediasToUse = mediaFiles.length > 0 ? [mediaFiles[0]] : [null];
    
    for (const media of mediasToUse) {
      const adName = generateAdName({
        hypotes,
        gren: 'a',
        cb: cbNumber.toString().padStart(3, '0'),
        variant: variantNum.toString().padStart(2, '0'),
        hook: hookToken,
        source: 'ai',
        cid,
      });
      
      let mediaId = null;
      
      if (media) {
        if (media.type === 'video') {
          mediaId = await uploadVideo(media.path, media.name);
        } else {
          mediaId = await uploadImage(media.path, media.name);
        }
      }
      
      // Skapa creative
      const creativeId = await createAdCreative({
        name: `${adName} Creative`,
        headline,
        primary_text: primaryText,
        description,
        landing_page: brief.landing_page || DEFAULT_LANDING_PAGE,
        cta_type: 'DOWNLOAD', // For app
        image_hash: media?.type === 'image' ? mediaId : undefined,
        video_id: media?.type === 'video' ? mediaId : undefined,
        utm_params: {
          utm_source: 'meta',
          utm_medium: 'paid_social',
          utm_campaign: `h${hypotes}_cid${cid}`,
          utm_content: adName,
        },
      });
      
      // Skapa ad
      const adId = await createAd({
        name: adName,
        adset_id: adSetId,
        creative_id: creativeId,
        status: 'PAUSED',
      });
      
      ads.push({
        name: adName,
        id: adId,
        creative_id: creativeId,
        media: media?.name || 'none',
      });
      
      variantNum++;
    }
  }
  
  console.log('\n' + '='.repeat(80));
  console.log(`✅ Skapade ${ads.length} ads från CB${cbNumber.toString().padStart(3, '0')}`);
  ads.forEach(ad => console.log(`   - ${ad.name} (ID: ${ad.id})`));
  console.log('='.repeat(80));
  
  return ads;
}

// Main
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];
  
  if (command === 'create') {
    // Exempel: node create-ad-from-cb.js create 2 123456789 001 01
    const [cbNum, adSetId, cid, hypotes] = args.slice(1);
    
    if (!cbNum || !adSetId || !cid) {
      console.log('📝 Användning:');
      console.log('   node create-ad-from-cb.js create <cb_number> <adset_id> <cid> [hypotes]');
      console.log('');
      console.log('Exempel:');
      console.log('   node create-ad-from-cb.js create 2 123456789 001 01');
      console.log('');
      console.log('Parametrar:');
      console.log('   cb_number: CB-nummer (2 för CB002)');
      console.log('   adset_id: Meta Ad Set ID');
      console.log('   cid: Campaign ID (001, 002, etc)');
      console.log('   hypotes: Hypotes nummer (default: 01)');
      process.exit(0);
    }
    
    createAdsFromCB(parseInt(cbNum), adSetId, cid, hypotes || '01').catch(err => {
      console.error('❌ Fel:', err.message);
      process.exit(1);
    });
  } else if (command === 'check-page') {
    // Hjälpkommando för att hitta Page ID
    console.log('🔍 Söker efter Facebook Pages kopplade till kontot...\n');
    
    makeRequest('/me/accounts?fields=id,name,access_token')
      .then(result => {
        if (result.data && result.data.length > 0) {
          console.log('📋 Hittade Pages:\n');
          result.data.forEach(page => {
            console.log(`   ${page.name}`);
            console.log(`   ID: ${page.id}`);
            console.log('');
          });
          console.log('💡 Lägg till FLOCKEN_PAGE_ID=<id> i .env.local');
        } else {
          console.log('⚠️  Inga pages hittade. Kontrollera att du har tillgång till en Facebook Page.');
        }
      })
      .catch(err => {
        console.error('❌ Fel:', err.message);
      });
  } else {
    console.log('📝 Flocken Meta Ads - Skapa ads från Creative Bases');
    console.log('');
    console.log('Kommandon:');
    console.log('   create <cb> <adset_id> <cid> [hypotes]  Skapa ads från en CB');
    console.log('   check-page                              Lista tillgängliga Facebook Pages');
    console.log('');
    console.log('Exempel:');
    console.log('   node create-ad-from-cb.js create 2 123456789 001');
    console.log('');
    process.exit(0);
  }
}

module.exports = {
  createAdsFromCB,
  createAdCreative,
  createAd,
  uploadImage,
  uploadVideo,
  generateAdName,
  parseBrief,
  parseCopy,
  makeRequest,
};
