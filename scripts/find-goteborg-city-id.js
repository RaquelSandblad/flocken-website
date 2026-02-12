// Hitta Göteborgs city ID för targeting
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

async function findGoteborg() {
  try {
    console.log('🔍 Söker efter Göteborg i Meta Targeting Search...\n');

    // Sök efter Göteborg/Gothenburg
    console.log('Söker efter "Gothenburg"...');
    const search1 = await makeRequest(
      `/search?type=adgeolocation&q=Gothenburg&location_types=['city']&limit=10`
    );
    
    console.log('\nSöker efter "Göteborg"...');
    const search2 = await makeRequest(
      `/search?type=adgeolocation&q=Göteborg&location_types=['city']&limit=10`
    );
    
    console.log('\nSöker efter Västra Götaland (region)...');
    const search3 = await makeRequest(
      `/search?type=adgeolocation&q=Västra Götaland&location_types=['region']&limit=10`
    );
    
    const search = { data: [...(search1.data || []), ...(search2.data || []), ...(search3.data || [])] };

    console.log('Resultat:');
    console.log(JSON.stringify(search, null, 2));

    if (search.data && search.data.length > 0) {
      console.log('\n📋 Hittade städer:');
      search.data.forEach((city, i) => {
        console.log(`\n${i + 1}. ${city.name}`);
        console.log(`   Key: ${city.key}`);
        console.log(`   Type: ${city.type}`);
        console.log(`   Country: ${city.country_name}`);
        if (city.region) {
          console.log(`   Region: ${city.region}`);
        }
      });
    }

  } catch (error) {
    console.error('\n❌ FEL:');
    console.error(`   ${error.message}\n`);
  }
}

findGoteborg();
