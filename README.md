# Flocken Website

Modern webbplats för Flocken-appen byggd med Next.js 15, TypeScript och Tailwind CSS.

## 🚀 Snabbstart

### 1. Installera dependencies

```bash
npm install
```

### 2. Starta utvecklingsserver

```bash
npm run dev
```

Öppna [http://localhost:3000](http://localhost:3000) i din browser.

### 3. Bygg för production

```bash
npm run build
npm start
```

## 📂 Projektstruktur

```
flocken-website/
├── app/
│   ├── (marketing)/        # Marketing pages layout
│   │   ├── layout.tsx      # Marketing header + footer
│   │   └── page.tsx        # Startsida
│   ├── (legal)/            # Legal pages layout
│   │   ├── layout.tsx      # Legal header + footer + sidebar
│   │   ├── integritetspolicy/
│   │   ├── anvendarvillkor/
│   │   ├── privacy-choices/  # Användarens integritetsval (App Store-krav)
│   │   └── support/
│   ├── layout.tsx          # Root layout (inkl. cookie banner)
│   └── globals.css         # Global styles
├── components/
│   ├── shared/             # Shared components (Header, Footer)
│   ├── marketing/          # Marketing blocks
│   └── legal/              # Legal components
├── public/
│   ├── assets/flocken/     # Assets (logos, screenshots, images)
│   └── scripts/
│       └── cookie-banner-custom.js  # GDPR cookie consent
└── tailwind.config.ts      # Designsystem
```

## 🎨 Designsystem

Flockens färgschema implementerat i Tailwind:
- `flocken-olive` - Primär färg
- `flocken-sand` - Bakgrunder
- `flocken-brown` - Text
- Med mera...

## 📦 Deployment

**⚠️ VIKTIGT: Dessa instruktioner gäller ENDAST för flocken-website. För nastahem, se nastahem/README.md**

### Vercel Deployment (flocken-website)

**KRITISKT:** Vercel är kopplad till **RaquelSandblad/flocken-website**, inte tbinho/flocken-website.

För att trigga automatisk deployment måste du pusha till **`raquel` remote**:

```powershell
# Navigera till flocken-website (använd $PSScriptRoot i scripts)
cd "C:\Users\Torbjörn\Desktop\flocken-website"

# Lägg till ändringar
git add .

# Commit
git commit -m "Beskrivning av ändringar"

# ⚠️ VIKTIGT: Pusha till 'raquel' remote (inte 'origin' eller 'flocken')
git push raquel main
```

**Varför `raquel` remote?**
- Vercel är kopplad till `https://github.com/RaquelSandblad/flocken-website.git`
- Push till `origin` eller `flocken` remote triggar INTE deployment
- Endast push till `raquel` remote triggar automatisk Vercel deployment

### Git Remotes (flocken-website)

Detta repo har flera remotes konfigurerade:
- `raquel` → `https://github.com/RaquelSandblad/flocken-website.git` ⭐ **Använd denna för deployment**
- `flocken` → `https://github.com/tbinho/flocken-website.git`
- `origin` → `https://github.com/tbinho/flocken-website.git`

**Kontrollera remotes:**
```powershell
git remote -v
```

### Git & specialtecken i sökvägar
- Använd alltid `$PSScriptRoot` i PowerShell-skript för att undvika problem med `ö` i sökvägar.
- Se `GIT_COMMANDS.md` och `README_GIT.md` för full guide.
- Exempel:
  - `cd $PSScriptRoot`
  - `git -C $PSScriptRoot status`
  - `.\commit-changes.ps1` (ligger i repo-roten och använder `$PSScriptRoot`)

### Vercel Setup

1. Logga in på https://vercel.com med GitHub
2. Importera `RaquelSandblad/flocken-website` (inte tbinho/flocken-website)
3. Deploy automatiskt vid push till `main` branch
4. Konfigurera domän: flocken.info

## 📝 Företagsinformation

- Företag: Spitakolus AB
- Org.nr: 559554-6101
- E-post: support@spitakolus.com
- Adress: Svängrumsgatan 46, 421 71 Västra Frölunda

## 🔗 Länkar

- Production: https://flocken.info
- GitHub (Vercel-kopplad): https://github.com/RaquelSandblad/flocken-website
- GitHub (backup): https://github.com/tbinho/flocken-website

## 📊 Tracking & Analytics

Flocken har komplett tracking-infrastruktur implementerad:

- ✅ **Google Analytics 4 (GA4)** - Live i produktion (G-7B1SVKL89Q)
- ✅ **Google Tag Manager (GTM)** - Shared container med hostname routing
- ✅ **Meta Pixel** - Implementerad med cookie consent
- ⏳ **Server-side tracking** - Planerad
- ⏳ **App tracking (iOS/Android)** - Planerad
- ⏳ **BigQuery export** - Planerad

**Dokumentation:**
- [Komplett Tracking Setup](./docs/TRACKING_SETUP_COMPLETE.md) ⭐ Start här
- [GA4 Setup Status](./docs/GA4_SETUP_STATUS.md)
- [GTM Setup Instructions](./docs/GTM_SETUP_INSTRUCTIONS.md)
- [Framtida Implementation Plans](./docs/README.md)

## 📢 Meta Ads

Projektet använder en fast, AI-first struktur för all annonsering i Meta Ads Manager.

**⚠️ OBLIGATORISK STANDARD:** Dessa dokument är källan till sanningen och MÅSTE följas vid all Meta-annonsering:

- [`meta_ads_structure_flocken.md`](./meta_ads_structure_flocken.md) - Definierar kontostruktur, naming convention, CID-logik och regler för campaign / ad set / ad
- [`creative_structure_flocken.md`](./creative_structure_flocken.md) - Definierar hur Creative Bases (CB), briefs, copy, varianter och assets skapas UTANFÖR Meta

**Viktiga principer:**
- Alla Meta-objekt (campaign, ad set, ad) MÅSTE följa naming-specen
- Alla objekt som hör ihop MÅSTE dela samma `cid`
- `cid` är en teknisk primärnyckel och får aldrig ändras
- Creative produktion sker via Creative Bases (CB), inte via enskilda annonser
- Format/dimensioner får ALDRIG ligga i annonsnamn
- Nya hypoteser (`h02`, `h03`, …) får inte skapas utan uttryckligt beslut

**Detta är ett LÅST SYSTEM** – avvikelser är inte tillåtna utan nytt beslut.

---

## 📋 Changelog

Se detaljerade ändringar i:
- [CHANGELOG_20251216.md](./CHANGELOG_20251216.md) - Integritetspolicy uppdateringar (16 dec 2025)
- [CHANGELOG_20241204.md](./CHANGELOG_20241204.md) - Designförbättringar och bildhantering (4 dec 2024)

