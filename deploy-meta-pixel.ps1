# Deploy Meta Pixel to production
# Uses $PSScriptRoot to automatically find the repository root (handles special characters in path)
$ErrorActionPreference = "Stop"

# Navigate to the repository (script should be in repo root)
cd $PSScriptRoot

Write-Host "🚀 Deploying Meta Pixel..." -ForegroundColor Cyan

# Add the changed files
git add app/layout.tsx
git add docs/meta/META_PIXEL_SETUP.md
git add deploy-meta-pixel.ps1

# Check status
Write-Host "Files staged:" -ForegroundColor Green
git status --short

# Commit
$commitMessage = "feat: Add Meta Pixel for tracking PageView events

- Implement Meta Pixel in app/layout.tsx
- Track PageView events automatically
- Use NEXT_PUBLIC_META_PIXEL_ID environment variable
- Add noscript fallback for users without JavaScript
- Pixel ID: 854587690618895"

git commit -m $commitMessage

# Push to raquel remote (triggers Vercel deployment)
Write-Host "Pushing to raquel main..." -ForegroundColor Green
git push raquel main

Write-Host "Done!" -ForegroundColor Green
