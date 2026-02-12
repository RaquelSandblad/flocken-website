// Hitta intresse-ID för hundar/dogs
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

if (!ACCESS_TOKEN) {
  console.error('❌ Ingen access token hittad!');
  process.exit(1);
}

function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const url = new URL(`https://graph.facebook.com/v21.0${path}`);
    url.searchParams.set('access_token', ACCESS_TOKEN);
    
    const req = https.request(url, (res) => {
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
          reject(new Error(`Parse error: ${e.message}`));
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

async function findInterests() {
  try {
    console.log('🔍 Söker efter intressen relaterade till hundar...\n');

    const searchTerms = ['dog', 'dogs', 'hund', 'hundar', 'pet', 'pets', 'djur', 'dog owner'];
    
    for (const term of searchTerms) {
      console.log(`Söker efter "${term}"...`);
      try {
        const search = await makeRequest(
          `/search?type=adinterest&q=${encodeURIComponent(term)}&limit=20`
        );
        
        if (search.data && search.data.length > 0) {
          console.log(`\n📋 Hittade ${search.data.length} intressen för "${term}":`);
          search.data.forEach((interest, i) => {
            console.log(`\n${i + 1}. ${interest.name}`);
            console.log(`   ID: ${interest.id}`);
            console.log(`   Audience Size: ${interest.audience_size?.toLocaleString('sv-SE') || 'N/A'}`);
            if (interest.topic) {
              console.log(`   Topic: ${interest.topic}`);
            }
          });
          console.log('');
        }
      } catch (error) {
        console.log(`   ⚠️  Fel: ${error.message}\n`);
      }
    }

  } catch (error) {
    console.error('\n❌ FEL:');
    console.error(`   ${error.message}\n`);
  }
}

findInterests();
