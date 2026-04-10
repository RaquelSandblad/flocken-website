/**
 * Run daily GA4->fact_kpi_daily load (D+1) with backfill support.
 *
 * Usage:
 *   node scripts/run-daily-kpi-load.js
 *   node scripts/run-daily-kpi-load.js --start=2026-02-01 --end=2026-02-03
 *   node scripts/run-daily-kpi-load.js --setup
 *
 * Env (optional):
 *   BQ_PROJECT_ID (default: nastahem-tracking)
 *   BQ_LOCATION (default: EU)
 *   GA4_DATASET_ID (default: analytics_518338757)
 *   APP_ID (default: flocken)
 *   SLACK_WEBHOOK_URL (optional; if set, alerts on failures)
 *   GOOGLE_APPLICATION_CREDENTIALS (optional)
 */

const { BigQuery } = require('@google-cloud/bigquery');
const fs = require('fs');
const path = require('path');

const PROJECT_ID = process.env.BQ_PROJECT_ID || 'nastahem-tracking';
const LOCATION = process.env.BQ_LOCATION || 'EU';
const GA4_DATASET_ID = process.env.GA4_DATASET_ID || 'analytics_518338757';
const APP_ID = process.env.APP_ID || 'flocken';
const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL || '';

function detectKeyFile() {
  const envKey = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (envKey && fs.existsSync(envKey)) return envKey;

  const scriptsDir = __dirname;
  const candidates = fs
    .readdirSync(scriptsDir)
    .filter(
      (file) =>
        file.endsWith('-key.json') ||
        file.endsWith('-credentials.json') ||
        file.includes('service-account')
    )
    .map((file) => path.join(scriptsDir, file))
    .filter((p) => fs.existsSync(p));

  return candidates[0] || null;
}

function parseArgs(argv) {
  const out = { setup: false, setupOps: false, start: null, end: null, noAlert: false };
  for (const a of argv.slice(2)) {
    if (a === '--setup') out.setup = true;
    else if (a === '--setup-ops') out.setupOps = true;
    else if (a.startsWith('--start=')) out.start = a.split('=')[1];
    else if (a.startsWith('--end=')) out.end = a.split('=')[1];
    else if (a === '--no-alert') out.noAlert = true;
  }
  return out;
}

function toISODate(d) {
  return d.toISOString().slice(0, 10);
}

function defaultDateRange(args) {
  if (args.start && args.end) return { start: args.start, end: args.end };
  if (args.start && !args.end) return { start: args.start, end: args.start };
  if (!args.start && args.end) return { start: args.end, end: args.end };

  // Placeholder. We'll compute "yesterday Europe/Stockholm" via BigQuery for accuracy.
  return { start: null, end: null };
}

function readSqlFile(relPath) {
  return fs.readFileSync(path.join(__dirname, relPath), 'utf8');
}

function substitute(sql) {
  return sql
    .replaceAll('{{PROJECT_ID}}', PROJECT_ID)
    .replaceAll('{{GA4_DATASET_ID}}', GA4_DATASET_ID);
}

function splitStatements(sql) {
  return sql
    .split(/;\s*\n/)
    .map((s) => s.trim())
    .filter((s) => s.replace(/--.*$/gm, '').trim().length > 10);
}

async function runStatements(bq, sqlText, label) {
  const statements = splitStatements(sqlText);
  console.log(`📄 ${label}: ${statements.length} statement(s)`);
  for (let i = 0; i < statements.length; i++) {
    const s = statements[i];
    const desc = (s.match(/--\s*(.+)/)?.[1] || `${label} statement ${i + 1}`).trim();
    console.log(`\n🔧 Running: ${desc}`);
    await bq.query({ query: s, location: LOCATION, useLegacySql: false });
    console.log('   ✅ OK');
  }
}

async function runQueryJob(bq, query, params) {
  const [job] = await bq.createQueryJob({
    query,
    location: LOCATION,
    useLegacySql: false,
    params,
  });
  const [rows] = await job.getQueryResults();
  return { job, rows };
}

function getDmlWrittenRows(job) {
  const dml = job?.metadata?.statistics?.dmlStats;
  const inserted = Number(dml?.insertedRowCount || 0);
  const updated = Number(dml?.updatedRowCount || 0);
  const deleted = Number(dml?.deletedRowCount || 0);
  return Math.max(0, inserted + updated + deleted);
}

async function writePipelineRun(bq, row) {
  const q = `
    INSERT INTO \`${PROJECT_ID}.analytics_ops.pipeline_runs\`
      (run_id, source_system, app_id, date_from, date_to, status, records_written, started_at, ended_at, error_message)
    VALUES
      (@run_id, @source_system, @app_id, @date_from, @date_to, @status, @records_written, @started_at, @ended_at, @error_message)
  `;
  // BigQuery requires explicit types when passing NULL params.
  await bq.query({
    query: q,
    location: LOCATION,
    useLegacySql: false,
    params: row,
    types: { error_message: 'STRING' },
  });
}

async function postSlack(text) {
  if (!SLACK_WEBHOOK_URL) return false;
  if (typeof fetch !== 'function') {
    throw new Error('Node runtime has no global fetch(); cannot post Slack webhook.');
  }
  const res = await fetch(SLACK_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Slack webhook failed: ${res.status} ${res.statusText} ${body}`);
  }
  return true;
}

function formatCheckFailures({ freshnessRow, volumeRows, qualityRow }) {
  const failures = [];

  if (freshnessRow && freshnessRow.status === 'failed') {
    failures.push(
      `freshness failed: missing_metrics=${(freshnessRow.missing_metrics || []).join(',') || '(unknown)'}`
    );
  }

  for (const r of volumeRows || []) {
    if (r.status === 'failed') {
      failures.push(
        `volume failed (${r.metric}): yesterday=${r.value_yesterday} median_prev7=${r.median_prev7} reason=${r.reason}`
      );
    }
  }

  if (qualityRow && qualityRow.status === 'failed') {
    failures.push(
      `value_quality failed: missing_ratio=${qualityRow.missing_ratio} missing_status=${qualityRow.missing_status_events} missing_listing_id=${qualityRow.missing_listing_id_events}`
    );
  }

  return failures;
}

async function main() {
  const args = parseArgs(process.argv);
  let range = defaultDateRange(args);

  const keyFile = detectKeyFile();
  const config = { projectId: PROJECT_ID };
  if (keyFile) config.keyFilename = keyFile;

  console.log(`📊 Project: ${PROJECT_ID}`);
  console.log(`📍 Location: ${LOCATION}`);
  console.log(`📦 GA4 dataset: ${GA4_DATASET_ID}`);
  console.log(`🧩 App: ${APP_ID}`);
  console.log(`🔑 Auth: ${keyFile ? path.basename(keyFile) : 'ADC'}\n`);

  const bq = new BigQuery(config);

  // Compute default date range as "yesterday Europe/Stockholm"
  if (!range.start || !range.end) {
    const [rows] = await bq.query({
      query:
        "SELECT FORMAT_DATE('%Y-%m-%d', DATE_SUB(CURRENT_DATE('Europe/Stockholm'), INTERVAL 1 DAY)) AS d",
      location: LOCATION,
      useLegacySql: false,
    });
    const d = rows?.[0]?.d;
    if (!d) throw new Error('Failed to compute yesterday Europe/Stockholm from BigQuery.');
    range = { start: d, end: d };
  }

  if (args.setup) {
    const setupSql = readSqlFile('setup-bigquery-core.sql');
    await runStatements(bq, setupSql, 'setup-bigquery-core.sql');
  }

  // Ensure ops dataset/tables exist (idempotent).
  const setupOpsSql = substitute(readSqlFile('setup-bigquery-ops.sql'));
  await runStatements(bq, setupOpsSql, 'setup-bigquery-ops.sql');

  const runId = `ga4_kpi_load_${APP_ID}_${range.start}_${range.end}_${Date.now()}`;
  const loadSqlRaw = readSqlFile('load-fact-kpi-daily-from-ga4.sql');
  const loadSql = substitute(loadSqlRaw);

  console.log(`\n🚀 Loading fact_kpi_daily for ${range.start} → ${range.end}`);
  console.log(`🏷️  run_id: ${runId}`);

  const startedAt = new Date();
  let endedAt = null;
  let recordsWritten = 0;
  let overallStatus = 'success';
  let errorMessage = null;

  let freshnessRow = null;
  let volumeRows = [];
  let qualityRow = null;

  try {
    const { job } = await runQueryJob(bq, loadSql, {
      start_date: range.start,
      end_date: range.end,
      app_id: APP_ID,
      run_id: runId,
    });
    recordsWritten = getDmlWrittenRows(job);
    console.log(`\n✅ Load complete (records_written=${recordsWritten})`);

    // Run checks for expected_date = end_date (daily D+1 uses one day)
    const expectedDate = range.end;

    const freshnessSql = substitute(readSqlFile('check-freshness-daily.sql'));
    const volumeSql = substitute(readSqlFile('check-volume-daily.sql'));
    const qualitySql = substitute(readSqlFile('check-value-quality-daily.sql'));

    const { rows: fr } = await runQueryJob(bq, freshnessSql, {
      expected_date: expectedDate,
      app_id: APP_ID,
    });
    freshnessRow = fr?.[0] || null;

    const { rows: vr } = await runQueryJob(bq, volumeSql, {
      expected_date: expectedDate,
      app_id: APP_ID,
    });
    volumeRows = vr || [];

    const { rows: qr } = await runQueryJob(bq, qualitySql, {
      expected_date: expectedDate,
      app_id: APP_ID,
    });
    qualityRow = qr?.[0] || null;

    const failures = formatCheckFailures({ freshnessRow, volumeRows, qualityRow });
    if (failures.length > 0) {
      overallStatus = 'partial';
      errorMessage = failures.join(' | ');
      console.log(`\n⚠️  Checks failed: ${errorMessage}`);
    } else {
      console.log('\n✅ Checks OK');
    }
  } catch (err) {
    overallStatus = 'failed';
    errorMessage = err?.message || String(err);
    console.error('\n❌ Load/check error:', errorMessage);
  } finally {
    endedAt = new Date();

    // Write pipeline_runs row (one row per app/source per run_id)
    try {
      await writePipelineRun(bq, {
        run_id: runId,
        source_system: 'ga4',
        app_id: APP_ID,
        date_from: range.start,
        date_to: range.end,
        status: overallStatus,
        records_written: recordsWritten,
        started_at: startedAt.toISOString(),
        ended_at: endedAt.toISOString(),
        error_message: errorMessage,
      });
    } catch (e) {
      console.error('\n❌ Failed to write analytics_ops.pipeline_runs:', e?.message || e);
    }

    // Alerting (Slack webhook)
    if (!args.noAlert && SLACK_WEBHOOK_URL && overallStatus !== 'success') {
      const expectedDate = range.end;
      const extraHint =
        qualityRow && qualityRow.status === 'failed'
          ? '\nInstrumentation TODO: ensure Firebase/GA4 event `listing_created` logs event_params `status` (e.g. "published") and `listing_id`.'
          : '';

      const msg =
        `[analytics] ${overallStatus.toUpperCase()} ga4_kpi_load\n` +
        `app_id=${APP_ID} expected_date=${expectedDate} range=${range.start}..${range.end}\n` +
        `run_id=${runId} records_written=${recordsWritten}\n` +
        `reason=${errorMessage || '(none)'}${extraHint}`;

      try {
        await postSlack(msg);
      } catch (e) {
        console.error('\n❌ Slack alert failed:', e?.message || e);
      }
    }
  }

  if (overallStatus === 'failed') process.exit(1);
}

main().catch((err) => {
  console.error('\n❌ Error:', err?.message || err);
  process.exit(1);
});

