$ErrorActionPreference = 'Stop'

function New-Timestamp {
  return (Get-Date).ToString('yyyyMMdd-HHmmss')
}

$repoRoot = Split-Path -Parent $PSScriptRoot
$destRootBase = 'C:\Dev\flocken-analytics-bundle'
$destRoot = "${destRootBase}\bundle-$(New-Timestamp)"

Write-Host "Repo root: $repoRoot"
Write-Host "Destination: $destRoot"

New-Item -ItemType Directory -Path $destRoot -Force | Out-Null

# Files referenced in analytics/tracking/BQ/API discussions
$relativePaths = @(
  'DOCUMENTATION_MAP.md',
  'docs/README.md',

  # Tracking docs
  'docs/tracking/TRACKING_SETUP_COMPLETE.md',
  'docs/tracking/SHARED_INFRASTRUCTURE.md',
  'docs/tracking/GA4_PROPERTY_STRUCTURE.md',
  'docs/tracking/ANALYTICS_EVENT_SPEC_CROSS_APP.md',
  'docs/tracking/GTM_EVENT_TAGS_SETUP.md',

  # BigQuery docs
  'docs/bigquery/BIGQUERY_SETUP_INSTRUCTIONS.md',
  'docs/bigquery/WHERE_IS_SERVICE_ACCOUNT_KEY.md',
  'docs/bigquery/USE_EXISTING_SERVICE_ACCOUNT.md',
  'docs/bigquery/BIGQUERY_TEST_QUERIES.md',

  # Meta docs
  'docs/meta/META_PIXEL_SETUP.md',
  'docs/meta/META_MARKETING_API_TOKEN_GUIDE.md',

  # Web implementation (GTM + consent + tracking helpers)
  'app/layout.tsx',
  'lib/tracking.ts',
  'public/scripts/cookie-banner-custom.js',
  'lib/web-attribution.ts',
  'components/tracking/WebAttributionTracker.tsx',

  # BigQuery scripts
  'scripts/setup-bigquery-views-flocken.sql',
  'scripts/setup-bigquery-views-automated.js',
  'scripts/bq-what-came-in-yesterday-today.js',
  'scripts/bq-check-attribution-columns.js',
  'scripts/bq-test-events-attribution-view.js',

  # Meta scripts (API access + UTM maintenance)
  'scripts/get-meta-token-instructions.md',
  'scripts/test-flocken-meta-access.js',
  'scripts/update-adsets-v2.js',
  'scripts/fix-utm-tags-cid002.js',

  # Meta CAPI route (server) + test
  'app/api/meta/capi/route.ts',
  'app/api/meta/capi/__tests__/route.test.ts'
)

$copied = @()
$missing = @()

foreach ($rel in $relativePaths) {
  $src = Join-Path $repoRoot $rel
  if (-not (Test-Path $src)) {
    $missing += $rel
    continue
  }

  $dst = Join-Path $destRoot $rel
  $dstDir = Split-Path -Parent $dst
  New-Item -ItemType Directory -Path $dstDir -Force | Out-Null

  Copy-Item -Path $src -Destination $dst -Force
  $copied += $rel
}

$readmePath = Join-Path $destRoot 'README.txt'
$readme = @()
$readme += "Flocken analytics bundle"
$readme += "Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
$readme += ""
$readme += "Copied files:"
$readme += ($copied | ForEach-Object { " - $_" })

if ($missing.Count -gt 0) {
  $readme += ""
  $readme += "Missing (not found in repo at export time):"
  $readme += ($missing | ForEach-Object { " - $_" })
}

$readme | Out-File -FilePath $readmePath -Encoding UTF8

Write-Host ""
Write-Host "✅ Done."
Write-Host "Copied: $($copied.Count)"
if ($missing.Count -gt 0) { Write-Host "Missing: $($missing.Count)" }
Write-Host "Output folder: $destRoot"

