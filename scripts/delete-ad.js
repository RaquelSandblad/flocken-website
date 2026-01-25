// Script för att ta bort en ad
const https = require('https');
const fs = require('fs');
const path = require('path');

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

const token = envVars.META_ACCESS_TOKEN || envVars.META_ADS_API_TOKEN || envVars.META_MARKETING_API_TOKEN;

if (!token) {
  console.error('❌ Ingen token hittad i .env.local');
  process.exit(1);
}
const adId = process.argv[2];

if (!adId) {
  console.log('Användning: node delete-ad.js <ad_id>');
  process.exit(0);
}

console.log(`🗑️  Tar bort ad ${adId}...`);

const url = new URL(`https://graph.facebook.com/v21.0/${adId}`);
url.searchParams.set('access_token', token);

const req = https.request(url, { method: 'DELETE' }, res => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    const result = JSON.parse(data);
    if (result.success) {
      console.log('✅ Ad borttagen!');
    } else {
      console.log('❌ Fel:', result.error?.message || data);
    }
  });
});
req.end();
