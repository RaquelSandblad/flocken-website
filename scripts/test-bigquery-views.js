/**
 * Test BigQuery Views - Verifiera att views och tables fungerar
 */

const { BigQuery } = require('@google-cloud/bigquery');
const fs = require('fs');
const path = require('path');

const PROJECT_ID = 'nastahem-tracking';

// Find service account key
const scriptsDir = __dirname;
const keyFiles = fs.readdirSync(scriptsDir)
  .filter(file => file.endsWith('-key.json'))
  .map(file => path.join(scriptsDir, file))
  .filter(file => fs.existsSync(file));

const bigqueryConfig = { projectId: PROJECT_ID };
if (keyFiles.length > 0) {
  bigqueryConfig.keyFilename = keyFiles[0];
  console.log(`🔑 Using: ${keyFiles[0]}\n`);
}

const bigquery = new BigQuery(bigqueryConfig);

async function testViews() {
  console.log('🧪 Testing BigQuery Views for Flocken...\n');

  // Test 1: flocken_curated.events
  console.log('1️⃣ Testing flocken_curated.events...');
  try {
    const [rows1] = await bigquery.query({
      query: `
        SELECT event_name, COUNT(*) as count
        FROM \`nastahem-tracking.flocken_curated.events\`
        GROUP BY event_name
        ORDER BY count DESC
        LIMIT 10
      `,
      location: 'EU'
    });
    console.log('   ✅ Events found:');
    rows1.forEach(row => console.log(`      - ${row.event_name}: ${row.count}`));
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }

  // Test 2: flocken_marts.daily_metrics
  console.log('\n2️⃣ Testing flocken_marts.daily_metrics...');
  try {
    const [rows2] = await bigquery.query({
      query: `
        SELECT FORMAT_DATE('%Y-%m-%d', date) as date_str, platform, active_users, page_views, sessions
        FROM \`nastahem-tracking.flocken_marts.daily_metrics\`
        ORDER BY date DESC
        LIMIT 5
      `,
      location: 'EU'
    });
    console.log('   ✅ Daily metrics:');
    rows2.forEach(row => {
      console.log(`      - ${row.date_str}: ${row.active_users} users, ${row.page_views} views, ${row.sessions} sessions (${row.platform})`);
    });
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }

  // Test 3: flocken_curated.conversion_funnel
  console.log('\n3️⃣ Testing flocken_curated.conversion_funnel...');
  try {
    const [rows3] = await bigquery.query({
      query: `
        SELECT FORMAT_DATE('%Y-%m-%d', event_date) as date_str, visitors, sign_ups, app_installs
        FROM \`nastahem-tracking.flocken_curated.conversion_funnel\`
        ORDER BY event_date DESC
        LIMIT 5
      `,
      location: 'EU'
    });
    console.log('   ✅ Conversion funnel:');
    rows3.forEach(row => {
      console.log(`      - ${row.date_str}: ${row.visitors} visitors → ${row.sign_ups} signups → ${row.app_installs} installs`);
    });
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }

  // Test 4: Summary
  console.log('\n📊 Summary Query - Last 7 days...');
  try {
    const [summary] = await bigquery.query({
      query: `
        SELECT 
          COUNT(DISTINCT user_pseudo_id) as total_users,
          COUNT(*) as total_events,
          COUNTIF(event_name = 'page_view') as page_views,
          COUNTIF(event_name = 'first_visit') as new_visitors
        FROM \`nastahem-tracking.flocken_curated.events\`
        WHERE PARSE_DATE('%Y%m%d', event_date) >= DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)
      `,
      location: 'EU'
    });
    console.log('   ✅ Last 7 days:');
    console.log(`      - Total users: ${summary[0].total_users}`);
    console.log(`      - Total events: ${summary[0].total_events}`);
    console.log(`      - Page views: ${summary[0].page_views}`);
    console.log(`      - New visitors: ${summary[0].new_visitors}`);
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }

  console.log('\n✅ BigQuery Views test completed!');
}

testViews().catch(console.error);
