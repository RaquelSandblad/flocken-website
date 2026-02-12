# Script to commit and push valkommen page updates
# Uses $PSScriptRoot to automatically find the repository root (handles special characters in path)
$ErrorActionPreference = "Stop"

# Navigate to the repository (script should be in repo root)
cd $PSScriptRoot

# Add the changed files
git add "app/valkommen/page.tsx"
git add "components/marketing/HeroBlock.tsx"

# Check status
Write-Host "Files staged:" -ForegroundColor Green
git status --short

# Commit
$commitMessage = @"
Uppdatera /valkommen-sidan enligt PDF-instruktioner

- Uppdaterat Hero-sektion med ny copy (Block 1)
- Uppdaterat Block 2: Allt för hundägare på ett ställe
- Uppdaterat Feature-sektioner (Para, Passa, Rasta, Besöka) enligt PDF
- Tagit bort Jonas-citat enligt instruktioner
- Uppdaterat Varför Flocken-sektion (Block 7)
- Uppdaterat Block 8: För daglig användning och specifika tillfällen
- Uppdaterat Final CTA (Block 9) med ny copy
- Lagt till MyDOG-lansering info och AppStore-kommer-snart text
- Uppdaterat HeroBlock-komponent för att stödja nya props
"@

git commit -m $commitMessage

# Push
Write-Host "Pushing to origin main..." -ForegroundColor Green
git push origin main

Write-Host "Done! Changes deployed to Vercel." -ForegroundColor Green











