# Dokumentationsstädning och Organisering - Plan

**Datum:** 2026-01-28  
**Syfte:** Städa och organisera dokumentationen för bättre navigering och underhåll

---

## 📊 Nuvarande Situation

### Problem identifierade:
1. **Utdaterade temporära filer** - Filer som var relevanta vid projektstart men inte längre
2. **Duplicerad dokumentation** - Samma information på flera ställen
3. **Cross-repo referenser** - Dokumentation som refererar till nastahem-repo
4. **Bristande navigationsstruktur** - Svårt att hitta rätt dokumentation

---

## 🗂️ Kategorisering av Filer

### ❌ Ta Bort (Utdaterade/Temporära)

**Root-nivå:**
- `START_HÄR.txt` - Utfasad startguide, ersatt av README.md
- `DEPLOY_KLART.md` - Temporär deployment-status, inte längre relevant
- `IMORGON_TODO.md` - Gammal todo-lista, utförd
- `NÄSTA_STEG.md` - Duplicerad med INSTALLATION.md
- `PROJEKTÖVERSIKT.md` - Information finns i README.md

**Dokumentation:**
- `docs/NEXT_STEPS.md` - Generisk, bör konsolideras med andra planer

### 🔄 Konsolidera (Duplicerade)

**Git-dokumentation:**
- `GIT_COMMANDS.md` + `README_GIT.md` → Konsolidera till `docs/GIT_WORKFLOW.md`

**Installation/Deployment:**
- `INSTALLATION.md` + `NÄSTA_STEG.md` → Behåll `INSTALLATION.md` (mer komplett)
- `DEPLOY_INSTRUCTIONS.md` - Specifik för Meta Pixel, flytta till `docs/META_PIXEL_DEPLOYMENT.md`

**Bildhantering:**
- `BILDBYTEN_INSTRUKTION.md` + `IMAGE_MANAGEMENT.md` → Behåll `IMAGE_MANAGEMENT.md` (mer komplett)

**Meta Pixel:**
- `PIXEL_STATUS.md` + `META_SETUP_INSTRUCTIONS.md` → Konsolidera till `docs/META_PIXEL_SETUP.md`

### 📝 Uppdatera (Cross-repo referenser)

**Filer som refererar till nastahem:**
- `docs/GOOGLE_ANALYTICS_EVALUATION.md` - Refererar till nastahem-struktur
- `docs/GTM_SETUP_INSTRUCTIONS.md` - Nämner nastahem GTM container
- `docs/TRACKING_SETUP_COMPLETE.md` - Refererar till nastahem
- `docs/BIGQUERY_*` - Många refererar till `nastahem-tracking` projekt

**Åtgärd:** Uppdatera referenser för att vara tydliga om att de gäller Flocken, eller flytta till delad dokumentation.

### ✅ Behåll (Viktiga Dokument)

**Root-nivå:**
- `README.md` - Huvudnavigationspunkt ⭐
- `INSTALLATION.md` - Deployment-guide
- `IMAGE_MANAGEMENT.md` - Bildhantering
- `meta_ads_structure_flocken.md` - Meta Ads standard
- `creative_structure_flocken.md` - Creative Bases standard
- `CHANGELOG_*.md` - Historik
- `META_ADS_MIGRATION_GUIDE.md` - Migration guide
- `META_ADS_SETUP_CHECKLIST.md` - Checklista

**docs/:**
- Alla tracking-dokument (GA4, GTM, BigQuery)
- Alla Meta Ads-dokument
- Alla Meta Pixel-dokument
- `docs/README.md` - Tracking-dokumentation index

---

## 🎯 Förslag på Ny Struktur

### Repo-specifik dokumentation (flocken-website)

```
flocken-website/
├── README.md                          # ⭐ START HÄR - Översikt och navigation
├── INSTALLATION.md                    # Deployment och setup
├── IMAGE_MANAGEMENT.md                # Bildhantering
├── meta_ads_structure_flocken.md       # Meta Ads standard
├── creative_structure_flocken.md      # Creative Bases standard
├── CHANGELOG_*.md                     # Historik
│
├── docs/
│   ├── README.md                      # Tracking-dokumentation index
│   │
│   ├── tracking/                      # Tracking & Analytics
│   │   ├── TRACKING_SETUP_COMPLETE.md
│   │   ├── GA4_SETUP_STATUS.md
│   │   ├── GTM_SETUP_INSTRUCTIONS.md
│   │   ├── VERIFY_DATA_FLOW.md
│   │   └── ...
│   │
│   ├── meta/                          # Meta (Ads & Pixel)
│   │   ├── META_PIXEL_SETUP.md        # Konsoliderad Pixel-dokumentation
│   │   ├── META_ADS_COMPLETE_GUIDE.md
│   │   ├── META_ADS_TROUBLESHOOTING.md
│   │   └── ...
│   │
│   ├── bigquery/                      # BigQuery
│   │   ├── BIGQUERY_SETUP_INSTRUCTIONS.md
│   │   ├── BIGQUERY_CLEAN_SETUP_EU.md
│   │   └── ...
│   │
│   └── development/                  # Utveckling
│       ├── GIT_WORKFLOW.md           # Konsoliderad Git-dokumentation
│       └── ...
```

### Delad dokumentation (Framtida: Spitakolus repo)

**Förslag:** Skapa `spitakolus-docs` repo för:
- Företagsövergripande standarder
- Delade verktyg och processer
- Cross-project best practices
- Tracking-arkitektur som delas mellan projekt

**Struktur:**
```
spitakolus-docs/
├── README.md
├── tracking/
│   ├── GTM_SHARED_CONTAINER.md
│   ├── BIGQUERY_SHARED_PROJECT.md
│   └── ...
├── meta-ads/
│   ├── NAMING_CONVENTIONS.md
│   ├── CREATIVE_WORKFLOW.md
│   └── ...
└── development/
    ├── GIT_WORKFLOW.md
    └── ...
```

---

## 📋 Åtgärdsplan

### Fas 1: Städa bort utdaterade filer
- [ ] Ta bort `START_HÄR.txt`
- [ ] Ta bort `DEPLOY_KLART.md`
- [ ] Ta bort `IMORGON_TODO.md`
- [ ] Ta bort `NÄSTA_STEG.md`
- [ ] Ta bort `PROJEKTÖVERSIKT.md`
- [ ] Ta bort `docs/NEXT_STEPS.md`

### Fas 2: Konsolidera duplicerade filer
- [ ] Konsolidera `GIT_COMMANDS.md` + `README_GIT.md` → `docs/development/GIT_WORKFLOW.md`
- [ ] Konsolidera `PIXEL_STATUS.md` + `META_SETUP_INSTRUCTIONS.md` → `docs/meta/META_PIXEL_SETUP.md`
- [ ] Konsolidera `BILDBYTEN_INSTRUKTION.md` → Innehåll flyttas till `IMAGE_MANAGEMENT.md`
- [ ] Flytta `DEPLOY_INSTRUCTIONS.md` → `docs/meta/META_PIXEL_DEPLOYMENT.md`

### Fas 3: Uppdatera README.md
- [ ] Uppdatera navigationsstruktur
- [ ] Ta bort referenser till borttagna filer
- [ ] Lägg till tydlig "Start här"-sektion
- [ ] Organisera länkar efter kategori

### Fas 4: Uppdatera cross-repo referenser
- [ ] Uppdatera `docs/GOOGLE_ANALYTICS_EVALUATION.md` - Tydliggör att det gäller Flocken
- [ ] Uppdatera `docs/GTM_SETUP_INSTRUCTIONS.md` - Tydliggör Flocken-specifik setup
- [ ] Uppdatera BigQuery-dokumentation - Tydliggör `nastahem-tracking` projekt som delat

### Fas 5: Skapa dokumentationsplan för framtiden
- [ ] Dokumentera beslutet om repo-specifik vs delad dokumentation
- [ ] Skapa guide för när ny dokumentation ska läggas var

---

## 🎯 Principer för Framtida Dokumentation

### Repo-specifik dokumentation (flocken-website)
- Projekt-specifik setup och konfiguration
- Deployment-instruktioner för detta repo
- Projekt-specifika workflows
- Changelog och release notes

### Delad dokumentation (Framtida: spitakolus-docs)
- Företagsövergripande standarder
- Delade verktyg och processer
- Cross-project best practices
- Tracking-arkitektur som delas mellan projekt

### När dokumentation ska vara delad:
- Om det gäller flera projekt (t.ex. GTM shared container)
- Om det är företagsövergripande standarder
- Om det är processer som används i flera projekt

### När dokumentation ska vara repo-specifik:
- Om det är specifikt för detta projekt
- Om det är deployment-instruktioner för detta repo
- Om det är projekt-specifika workflows

---

## ✅ Resultat

Efter städning kommer:
- ✅ Tydlig navigationsstruktur från README.md
- ✅ Inga duplicerade filer
- ✅ Inga utdaterade temporära filer
- ✅ Tydlig separation mellan repo-specifik och delad dokumentation
- ✅ Plan för framtida dokumentationsorganisation
