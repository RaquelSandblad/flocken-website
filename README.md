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

### GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/tbinho/flocken-website.git
git branch -M main
git push -u origin main
```

### Vercel

1. Logga in på https://vercel.com med GitHub
2. Importera `tbinho/flocken-website`
3. Deploy automatiskt
4. Konfigurera domän: flocken.info

## 📝 Företagsinformation

- Företag: Spitakolus AB
- Org.nr: 559554-6101
- E-post: support@spitakolus.com
- Adress: Svängrumsgatan 46, 421 71 Västra Frölunda

## 🔗 Länkar

- Production: https://flocken.info
- GitHub: https://github.com/tbinho/flocken-website

## 📋 Changelog

Se detaljerade ändringar i:
- [CHANGELOG_20251216.md](./CHANGELOG_20251216.md) - Integritetspolicy uppdateringar (16 dec 2025)
- [CHANGELOG_20241204.md](./CHANGELOG_20241204.md) - Designförbättringar och bildhantering (4 dec 2024)

