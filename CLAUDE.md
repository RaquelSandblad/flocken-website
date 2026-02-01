# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **General rules:** See `C:\Dev\spitakolus\CLAUDE.md` for shared standards (documentation, assets, Meta Ads, infrastructure).

## Repository Identity

**This is flocken-website** - the Flocken product repository.
- **Production:** https://flocken.info
- **Tech stack:** Next.js 15, TypeScript, Tailwind CSS

**Other repos:**
- `spitakolus` → shared documentation (general rules)
- `nastahem` → nastahem.com product

---

## Critical Rules

### 1. Always git pull first
```bash
git pull origin main
```
Torbjörn switches between VS Code and Cursor.

### 2. Dev verification before deploy
```bash
npm run dev
# Verify at http://localhost:3000 before committing
```
Exception: User can request direct commit if they feel it's safe.

### 3. Deployment uses raquel remote (NOT origin)
```bash
git add .
git commit -m "Description"
git push raquel main
```
**Why:** Vercel is connected to RaquelSandblad/flocken-website, not tbinho/flocken-website.

**Git remotes:**
- `raquel` → RaquelSandblad/flocken-website (USE THIS for deploy)
- `origin` → tbinho/flocken-website (backup)
- `flocken` → tbinho/flocken-website (backup)

---

## Commands

```bash
npm install          # Install dependencies
npm run dev          # Dev server (localhost:3000)
npm run build        # Production build
npm run lint         # ESLint
npm run test         # Run all tests
npm run test:watch   # Tests in watch mode
npm run test:coverage # Tests with coverage
```

---

## Project Structure

```
app/
├── (marketing)/            # Public marketing pages
├── (legal)/                # Legal pages (privacy, terms, support)
├── auth/                   # Authentication
├── download/               # App download page
└── api/                    # API routes
components/
├── shared/                 # Header, Footer, Button, Card
├── marketing/              # HeroBlock, FeatureBlock, CTA
└── legal/                  # TableOfContents
public/assets/flocken/
├── _originals/             # Place original images here
├── generated/              # Auto-optimized versions
├── screenshots/            # App screenshots
└── logo/                   # Logos
docs/                       # Documentation
flocken_ads/                # Meta Ads creative bases
```

---

## Brand Colors (Tailwind)

```css
flocken-olive: #6B7A3A;   /* Primary CTA, headers */
flocken-accent: #8BA45D;  /* Hover states */
flocken-sand: #E8DCC0;    /* Card backgrounds */
flocken-cream: #F5F1E8;   /* Alternative backgrounds */
flocken-brown: #3E3B32;   /* Primary text */
flocken-gray: #A29D89;    /* Secondary text */
flocken-error: #C44536;   /* Error, favorite heart */
flocken-male: #5A6631;    /* Male dogs (Para) */
flocken-female: #8BA45D;  /* Female dogs (Para) */
```

**Tonality:** Natural, warm, grounded (organic/earthy feel)

---

## Image Processing

```bash
# Check status
node scripts/image-processor-flocken.js status

# Process all images
node scripts/image-processor-flocken.js process-all

# Clean generated (keeps originals)
node scripts/image-processor-flocken.js clean
```

**Workflow:**
1. Name: `flocken_[type]_[description].jpg` (lowercase, no spaces, no åäö)
2. Place in `public/assets/flocken/_originals/`
3. Run `process-all`
4. Use from `generated/` folder

---

## Meta Ads Structure (LOCKED)

See `flocken_ads/` for creative bases.

**Hook tokens for Flocken:**
- `hk_all` - General value
- `hk_passa` - Passa function
- `hk_besoka` - Besöka function
- `hk_para` - Para function
- `hk_rasta` - Rasta function

**Creative Base structure:**
```
flocken_ads/creative_bases/
├── cb001/
│   ├── brief.md      # Idea core (required)
│   ├── copy.md       # Text variations
│   └── assets/       # Visual content
```

---

## Key Integrations

| System | Status | Details |
|--------|--------|---------|
| GA4 | Live | G-7B1SVKL89Q |
| GTM | Live | GTM-PD5N4GT3 (hostname: flocken.info) |
| Meta Pixel | Live | 1140501127797453 |
| BigQuery | Planned | flocken_raw, flocken_curated, flocken_marts |

---

## Documentation

- `README.md` - Project overview
- `DOCUMENTATION_MAP.md` - Complete doc index
- `docs/development/INFRASTRUCTURE.md` - Testing, Validation, Security
- `docs/tracking/` - GA4, GTM, event naming
- `docs/meta/` - Meta Pixel, Meta Ads
- `docs/brand/` - Color system, personas

---

## PowerShell Note

Scripts must use `$PSScriptRoot` (not hardcoded paths) to handle special characters (ö) correctly.

---

## Company Info

- **Company:** Spitakolus AB (Org.nr: 559554-6101)
- **Email:** support@spitakolus.com
- **Address:** Svängrumsgatan 46, 421 71 Västra Frölunda
