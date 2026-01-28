# Git Workflow Guide - Flocken Website

**Senast uppdaterad:** 2026-01-28

---

## 🎯 Översikt

Denna guide beskriver hur man arbetar med Git i flocken-website-projektet, inklusive lösningar för problem med specialtecken i sökvägar.

---

## ⚠️ Problem med Specialtecken i Sökvägar

PowerShell har problem med specialtecken (t.ex. "ö" i "Torbjörn") när man försöker köra git-kommandon med absoluta sökvägar.

### Lösning: Använd `$PSScriptRoot`

**Alla PowerShell-scripts i detta projekt använder `$PSScriptRoot` istället för hårdkodade sökvägar.**

### Varför fungerar det?

- `$PSScriptRoot` är en automatisk PowerShell-variabel som innehåller katalogen där scriptet ligger
- Den hanterar automatiskt specialtecken korrekt
- Scriptet fungerar oavsett var användaren kör det från
- Fungerar även om användarnamnet ändras

---

## 📋 Standard Git Workflow

### Metod 1: Kör scriptet direkt (Rekommenderat)

```powershell
# Öppna PowerShell i flocken-website mappen
# Högerklicka i mappen → "Open in Terminal" eller "Open PowerShell window here"
.\commit-changes.ps1
```

### Metod 2: Använd git -C med $PSScriptRoot

```powershell
# Om du är i scriptets katalog
$repoPath = $PSScriptRoot
git -C $repoPath add "app/file.tsx"
git -C $repoPath commit -m "Message"
git -C $repoPath push raquel main
```

### Metod 3: Navigera först, sedan kör git

```powershell
# Navigera till repo
cd "C:\Dev\flocken-website"

# Git-kommandon
git add "app/file.tsx"
git commit -m "Message"
git push raquel main
```

---

## 🚀 Deployment Workflow

### Viktigt: Använd `raquel` remote för deployment

**⚠️ VIKTIGT:** Vercel är kopplad till **RaquelSandblad/flocken-website**, inte tbinho/flocken-website.

För att trigga automatisk deployment måste du pusha till **`raquel` remote**:

```powershell
# Navigera till repo
cd "C:\Dev\flocken-website"

# Lägg till ändringar
git add .

# Commit
git commit -m "Beskrivning av ändringar"

# ⚠️ VIKTIGT: Pusha till 'raquel' remote (inte 'origin' eller 'flocken')
git push raquel main
```

### Git Remotes

Detta repo har flera remotes konfigurerade:
- `raquel` → `https://github.com/RaquelSandblad/flocken-website.git` ⭐ **Använd denna för deployment**
- `flocken` → `https://github.com/tbinho/flocken-website.git`
- `origin` → `https://github.com/tbinho/flocken-website.git`

**Kontrollera remotes:**
```powershell
git remote -v
```

---

## 📝 Standard Git Commands

### Lägga till filer

```powershell
# En fil
git add "app/(legal)/anvandarvillkor/page.tsx"

# Flera filer
git add "app/file1.tsx" "components/file2.tsx"

# Alla ändringar
git add .
```

### Committa

```powershell
git commit -m "Beskrivande commit-meddelande"
```

### Pusha

```powershell
# Till raquel remote (deployment)
git push raquel main

# Till origin remote (backup)
git push origin main
```

---

## 🔧 Skapa Nya Git Scripts

När du skapar nya PowerShell-scripts för git-operationer:

1. Placera scriptet i repo-roten (`flocken-website/`)
2. Använd alltid `cd $PSScriptRoot` istället för hårdkodade sökvägar
3. Följ mönstret i `commit-changes.ps1` eller `deploy-meta-pixel.ps1`

### Template:

```powershell
# Script description
$ErrorActionPreference = "Stop"

# Navigate to repo root
cd $PSScriptRoot

# Git commands here
git add "path/to/file"
git commit -m "Commit message"
git push raquel main
```

---

## 📚 Exempel från Projektet

### Befintliga Scripts

- `commit-changes.ps1` - Standard commit workflow
- `deploy-meta-pixel.ps1` - Meta Pixel deployment
- `commit-valkommen.ps1` - Specifik deployment

Alla dessa använder `$PSScriptRoot` för att hantera sökvägar korrekt.

---

## 🔍 Troubleshooting

### Problem: Git-kommandon fungerar inte med specialtecken

**Lösning:** Använd `$PSScriptRoot` i scripts eller navigera till repo först.

### Problem: Deployment triggas inte

**Lösning:** Kontrollera att du pushar till `raquel` remote, inte `origin`:
```powershell
git push raquel main
```

### Problem: Användarnamnet ändras

Om Windows-användarnamnet ändras från "Torbjörn" till "torbjorn" (eller annat):
- Scripts med `$PSScriptRoot` fungerar fortfarande
- Inga ändringar behövs i scripts
- Endast sökvägen till projektet ändras, men scripts hittar rätt katalog automatiskt

---

## 📖 Relaterad Dokumentation

- [README.md](../README.md) - Projektöversikt och deployment-instruktioner
- [INSTALLATION.md](../INSTALLATION.md) - Komplett setup-guide

---

**Senast uppdaterad:** 2026-01-28
