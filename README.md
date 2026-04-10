---
title: "Flocken Website - README"
version: "3.0"
last_updated: "2026-04-10"
---

# 🐕 Flocken Website

> ## 🤖 AI-assistenter — börja med [`CLAUDE.md`](./CLAUDE.md)
> README.md är för människor. CLAUDE.md innehåller regler, deployment och navigation för AI.

**⚠️ VIKTIGT:** Detta är **FLOCKEN-WEBSITE** repo (flocken.info).
- Nästa Hem-projektet → [nastahem](https://github.com/RaquelSandblad/nastahem)
- Delad företagsdokumentation → [spitakolus](https://github.com/tbinho/spitakolus)

---

## Vad är Flocken?

Community-app för hundägare — hitta hundsitters, hundvänner och aktiviteter nära dig.

**Tech stack:** Next.js 15 · TypeScript · Tailwind CSS  
**Production:** https://flocken.info  
**Vercel:** RaquelSandblad/flocken-website

---

## Kom igång

```bash
npm install
npm run dev           # localhost:3000
npm run build         # Produktionsbygge
npm run lint          # ESLint
npm run test          # Alla tester
npm run test:watch    # Watch-läge
npm run test:coverage # Med coverage
```

---

## Projektstruktur

```
app/
├── (marketing)/     # Publika marketing-sidor
├── (legal)/         # Legal-sidor (integritetspolicy, villkor, support)
├── download/        # App-nedladdningssida (UA-baserad redirect)
├── quiz/            # Interaktiva quiz
└── api/             # API-routes
components/
├── shared/          # Header, Footer
├── marketing/       # HeroBlock, FeatureBlock, CTA
├── legal/           # Legal-komponenter
└── quiz/            # Quiz-komponenter
lib/ab-testing/      # A/B-testverktyg
public/assets/flocken/
├── _originals/      # Originalbilder (lägg nya här)
└── generated/       # Auto-optimerade versioner
```

---

## Dokumentation

| Vad | Fil |
|-----|-----|
| Komplett doc-index | [DOCUMENTATION_MAP.md](./DOCUMENTATION_MAP.md) |
| A/B-testning | [docs/ab-testing/README.md](./docs/ab-testing/README.md) |
| Tracking & analytics | [docs/tracking/](./docs/tracking/) |
| Meta Ads struktur | [meta_ads_structure_flocken.md](./meta_ads_structure_flocken.md) |
| Creative Bases | [creative_structure_flocken.md](./creative_structure_flocken.md) |
| Bildhantering | [IMAGE_MANAGEMENT.md](./IMAGE_MANAGEMENT.md) |
| Delad infrastruktur | [spitakolus](https://github.com/tbinho/spitakolus) |

---

## Designsystem

```
flocken-olive  #6B7A3A  Primär CTA, rubriker
flocken-sand   #E8DCC0  Kortbakgrunder
flocken-brown  #3E3B32  Primärtext
flocken-cream  #F5F1E8  Alternativa bakgrunder
```

---

Spitakolus AB · Org.nr: 559554-6101 · support@spitakolus.com
