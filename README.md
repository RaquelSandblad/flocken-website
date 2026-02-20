# Flocken Website

**⚠️ VIKTIGT:** Detta är **FLOCKEN-WEBSITE** repo.  
För Nästa Hem-projektet, se [nastahem](https://github.com/tbinho/nastahem).

Modern webbplats för Flocken-appen byggd med Next.js 15, TypeScript och Tailwind CSS.

---

## 📍 Dokumentationsstruktur

**Projekt-specifik dokumentation finns här i detta repo.**  
**Delad dokumentation finns i [spitakolus](https://github.com/tbinho/spitakolus) repo.**

- 📋 **[DOCUMENTATION_MAP.md](./DOCUMENTATION_MAP.md)** - Komplett översikt över ALL dokumentation
- 📖 **[docs/README.md](./docs/README.md)** - Projekt-specifik dokumentation (tracking, meta, bigquery)
- 🏢 **[spitakolus](https://github.com/tbinho/spitakolus)** - Företagsgemensam dokumentation (delade verktyg, processer)

---

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
Om port 3000 är upptagen använder Next automatiskt t.ex. `http://localhost:3001`.

### 2b. A/B-test (snabbtest lokalt)

Flocken har ett inbyggt A/B-testverktyg för content-varianter på sidor (t.ex. `/valkommen`).

- **Guide**: [`docs/ab-testing/README.md`](./docs/ab-testing/README.md)
- **Demo/debug-sida**: `http://localhost:3000/valkommen/ab-demo` (eller samma port som dev-servern kör på)
- **Experiment-konfig**: `lib/ab-testing/experiments.ts` (ändra `status: 'running'` för att aktivera)

### 3. Kör tester

```bash
npm run test           # Kör alla tester
npm run test:watch     # Watch-läge för utveckling
npm run test:coverage  # Med coverage-rapport
```

### 4. Lint kod

```bash
npm run lint           # Kör ESLint
```

### 5. Bygg för production

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
│   │   ├── cookiepolicy/     # Cookie policy för flocken.info
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
├── lib/ab-testing/          # A/B-testverktyg (experiments, hooks, middleware, tracking)
├── components/ab-testing/   # ExperimentTracker mm.
├── middleware.ts            # Next.js middleware (variant-tilldelning via cookie)
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
- Se [Git Workflow Guide](./docs/development/GIT_WORKFLOW.md) för fullständig guide.
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
- [Komplett Tracking Setup](./docs/tracking/TRACKING_SETUP_COMPLETE.md) ⭐ Start här
- [GA4 Setup Status](./docs/tracking/GA4_SETUP_STATUS.md)
- [GTM Setup Instructions](./docs/tracking/GTM_SETUP_INSTRUCTIONS.md)
- [Tracking Documentation Index](./docs/README.md)

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

## 📚 Dokumentation

### 🎯 Start Här
- **[DOCUMENTATION_MAP.md](./DOCUMENTATION_MAP.md)** ⭐ - Komplett översikt över ALL dokumentation
- [README.md](./README.md) - Denna fil (projektöversikt)
- [INSTALLATION.md](./INSTALLATION.md) - Deployment och setup-guide
- [Tracking Setup Complete](./docs/tracking/TRACKING_SETUP_COMPLETE.md) - Tracking-infrastruktur

### 🏢 Delad dokumentation
- **[spitakolus](https://github.com/tbinho/spitakolus)** - Företagsgemensam dokumentation (delade verktyg, processer, standarder)

### 📁 Dokumentationsstruktur

**Utveckling:**
- [Git Workflow](./docs/development/GIT_WORKFLOW.md) - Git-kommandon och deployment

**Tracking & Analytics:**
- [Tracking Documentation Index](./docs/README.md) - Översikt över all tracking-dokumentation
- [GA4 Setup Status](./docs/tracking/GA4_SETUP_STATUS.md)
- [GTM Setup Instructions](./docs/tracking/GTM_SETUP_INSTRUCTIONS.md)

**Meta (Ads & Pixel):**
- [Meta Pixel Setup](./docs/meta/META_PIXEL_SETUP.md) - Meta Pixel konfiguration
- [Meta Ads Complete Guide](./docs/meta/META_ADS_COMPLETE_GUIDE.md)
- [Meta Ads Structure](./meta_ads_structure_flocken.md) - Naming conventions och struktur

**Bildhantering:**
- [IMAGE_MANAGEMENT.md](./IMAGE_MANAGEMENT.md) - Bildhanteringssystem

**BigQuery:**
- [BigQuery Setup Instructions](./docs/bigquery/BIGQUERY_SETUP_INSTRUCTIONS.md)

### 📋 Changelog

Se detaljerade ändringar i:
- [CHANGELOG_20260219.md](./CHANGELOG_20260219.md) - Quiz-epostlista, MailerSend, Supabase, GDPR (19 feb 2026)
- [CHANGELOG_20260212.md](./CHANGELOG_20260212.md) - Cookie banner mobil + cookie policy (12 feb 2026)
- [CHANGELOG_20251216.md](./CHANGELOG_20251216.md) - Integritetspolicy uppdateringar (16 dec 2025)
- [CHANGELOG_20241204.md](./CHANGELOG_20241204.md) - Designförbättringar och bildhantering (4 dec 2024)

