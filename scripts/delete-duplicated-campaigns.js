// Ta bort de duplicerade kampanjerna som skapades av misstag
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

// Kampanjer att ta bort (de som skapades av misstag)
const CAMPAIGNS_TO_DELETE = [
  '120240080995520455', // c_flo_swe_init_dogowner_inst_h01_cid002 (tom kampanj)
];

if (!ACCESS_TOKEN) {
  console.error('❌ Ingen access token hittad!');
  process.exit(1);
}

function makeRequest(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(`https://graph.facebook.com/v24.0${path}`);
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
          reject(new Error(`Parse error: ${e.message}`));
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

async function main() {
  try {
    console.log('='.repeat(80));
    console.log('🗑️  Tar bort duplicerade kampanjer');
    console.log('='.repeat(80));
    console.log(`\n📋 Tar bort ${CAMPAIGNS_TO_DELETE.length} kampanjer...\n`);

    let deletedCount = 0;
    let errorCount = 0;

    for (const campaignId of CAMPAIGNS_TO_DELETE) {
      try {
        // Hämta kampanjnamn först
        const campaign = await makeRequest(`/${campaignId}?fields=name,status`);
        console.log(`🗑️  ${campaign.name} (${campaignId})`);
        
        // Ta bort kampanjen (tar automatiskt bort ad sets och ads)
        const result = await makeRequest(`/${campaignId}`, 'DELETE');
        
        if (result.success) {
          console.log(`   ✅ Borttagen\n`);
          deletedCount++;
        } else {
          console.log(`   ❌ Kunde inte ta bort: ${result.error?.message || 'Okänt fel'}\n`);
          errorCount++;
        }
      } catch (error) {
        console.log(`   ❌ Fel: ${error.message}\n`);
        errorCount++;
      }
    }

    console.log('='.repeat(80));
    console.log('📊 Sammanfattning:');
    console.log(`   ✅ Borttagna: ${deletedCount}`);
    console.log(`   ❌ Fel: ${errorCount}`);
    console.log('='.repeat(80));

  } catch (error) {
    console.error('\n❌ FEL:');
    console.error(`   ${error.message}\n`);
    process.exit(1);
  }
}

main().catch(err => {
  console.error('❌ Oväntat fel:', err);
  process.exit(1);
});
