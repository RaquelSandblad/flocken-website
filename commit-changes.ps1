# Script to commit and push changes
# Uses $PSScriptRoot to automatically find the repository root (handles special characters in path)
$ErrorActionPreference = "Stop"

# Navigate to the repository (script should be in repo root)
cd $PSScriptRoot

# Add the changed files
git add "app/(legal)/anvandarvillkor/page.tsx"
git add "app/(legal)/anvendarvillkor/page.tsx"
git add "components/shared/Footer.tsx"
git add "app/sitemap.ts"

# Check status
Write-Host "Files staged:" -ForegroundColor Green
git status --short

# Commit
$commitMessage = @"
Uppdatera användarvillkor enligt Apple/Google krav och best practices

- Korrigerat slug: /anvendarvillkor → /anvandarvillkor (med redirect)
- Borttagen åldersgräns
- Förtydligat automatisk förnyelse och uppsägning
- Lagt till provperioder (trial)
- Lagt till föräldraansvar
- Lagt till Force Majeure-klausul
- Lagt till Community Guidelines med modereringsrättigheter
- Förtydligat dataskydd med länk till privacy-choices
- Generaliserat tredjepartstjänster av säkerhetsskäl
- Uppdaterat 4 kontotyper (dog_owner, dog_sitter, kennel, dog_daycare)
- Borttaget alla referenser till BankID och Stripe
- Uppdaterat betalning via App Store/Google Play
"@

git commit -m $commitMessage

# Push
Write-Host "Pushing to origin main..." -ForegroundColor Green
git push origin main

Write-Host "Done!" -ForegroundColor Green

