# Dokumentationsorganisation - Flocken Website

**Senast uppdaterad:** 2026-01-28  
**Status:** ✅ Städning genomförd

---

## 📊 Genomförd Städning

### ❌ Borttagna Filer (Utdaterade/Temporära)

**Root-nivå:**
- `START_HÄR.txt` - Utfasad startguide, ersatt av README.md
- `DEPLOY_KLART.md` - Temporär deployment-status
- `IMORGON_TODO.md` - Gammal todo-lista, utförd
- `NÄSTA_STEG.md` - Duplicerad med INSTALLATION.md
- `PROJEKTÖVERSIKT.md` - Information finns i README.md
- `GIT_COMMANDS.md` - Konsoliderad till `docs/development/GIT_WORKFLOW.md`
- `README_GIT.md` - Konsoliderad till `docs/development/GIT_WORKFLOW.md`
- `PIXEL_STATUS.md` - Konsoliderad till `docs/meta/META_PIXEL_SETUP.md`
- `META_SETUP_INSTRUCTIONS.md` - Konsoliderad till `docs/meta/META_PIXEL_SETUP.md`
- `DEPLOY_INSTRUCTIONS.md` - Flyttad till `docs/meta/META_PIXEL_SETUP.md`
- `BILDBYTEN_INSTRUKTION.md` - Information finns i `IMAGE_MANAGEMENT.md`

**docs/:**
- `docs/NEXT_STEPS.md` - Generisk, information finns i andra planer

---

## 🗂️ Ny Dokumentationsstruktur

### Root-nivå

```
flocken-website/
├── README.md                          # ⭐ START HÄR - Översikt och navigation
├── INSTALLATION.md                    # Deployment och setup
├── IMAGE_MANAGEMENT.md                # Bildhantering
├── meta_ads_structure_flocken.md       # Meta Ads standard
├── creative_structure_flocken.md      # Creative Bases standard
├── CHANGELOG_*.md                     # Historik
│
└── docs/
    ├── README.md                      # Tracking-dokumentation index
    │
    ├── tracking/                      # Tracking & Analytics
    │   ├── TRACKING_SETUP_COMPLETE.md
    │   ├── GA4_SETUP_STATUS.md
    │   ├── GTM_SETUP_INSTRUCTIONS.md
    │   └── ...
    │
    ├── meta/                          # Meta (Ads & Pixel)
    │   ├── META_PIXEL_SETUP.md
    │   ├── META_ADS_COMPLETE_GUIDE.md
    │   └── ...
    │
    ├── bigquery/                      # BigQuery
    │   ├── BIGQUERY_SETUP_INSTRUCTIONS.md
    │   └── ...
    │
    └── development/                   # Utveckling
        ├── GIT_WORKFLOW.md
        └── ...
```

---

## 🎯 Principer för Framtida Dokumentation

### Repo-specifik dokumentation (flocken-website)

**Placera här:**
- Projekt-specifik setup och konfiguration
- Deployment-instruktioner för detta repo
- Projekt-specifika workflows
- Changelog och release notes
- Projekt-specifika Meta Ads campaigns och creative bases

**Exempel:**
- `INSTALLATION.md` - Deployment för flocken-website
- `IMAGE_MANAGEMENT.md` - Bildhantering för flocken.info
- `meta_ads_structure_flocken.md` - Flocken-specifik Meta Ads struktur

### Delad dokumentation (Framtida: Spitakolus repo)

**Förslag:** Skapa `spitakolus-docs` repo för:
- Företagsövergripande standarder
- Delade verktyg och processer
- Cross-project best practices
- Tracking-arkitektur som delas mellan projekt

**Exempel på vad som skulle vara delat:**
- GTM Shared Container setup (används av både Flocken och Nästa Hem)
- BigQuery projekt-struktur (`nastahem-tracking` används av båda)
- Företagsövergripande Git workflows
- Meta Ads naming conventions (om de delas mellan projekt)

---

## 📋 När Dokumentation Ska Vara Delad

### ✅ Delad dokumentation när:
- Det gäller flera projekt (t.ex. GTM shared container)
- Det är företagsövergripande standarder
- Det är processer som används i flera projekt
- Det är infrastruktur som delas (t.ex. BigQuery projekt)

### 📁 Repo-specifik dokumentation när:
- Det är specifikt för detta projekt
- Det är deployment-instruktioner för detta repo
- Det är projekt-specifika workflows
- Det är projekt-specifika kampanjer eller kreativt arbete

---

## 🔄 Cross-Repo Referenser

### Nuvarande Situation

Många dokument refererar till `nastahem-tracking` BigQuery-projekt och `gtm.nastahem.com` GTM Server Container. Detta är korrekt eftersom dessa är delade resurser.

**Åtgärd:** Dokumentationen är nu tydligare organiserad, men referenser till delade resurser behålls eftersom de är korrekta.

### Framtida Förbättring

När `spitakolus-docs` repo skapas:
1. Flytta dokumentation om delade resurser dit
2. Uppdatera referenser i projekt-specifik dokumentation
3. Skapa tydliga länkar mellan repo-specifik och delad dokumentation

---

## 📚 Navigationsstruktur

### Start-punkter:

1. **README.md** (root) - Projektöversikt och huvudnavigation
2. **docs/README.md** - Tracking-dokumentation index
3. **INSTALLATION.md** - Deployment-guide

### Kategorier:

- **tracking/** - Allt relaterat till tracking och analytics
- **meta/** - Meta Ads och Meta Pixel
- **bigquery/** - BigQuery setup och queries
- **development/** - Utvecklingsverktyg och workflows

---

## ✅ Resultat

Efter städning:
- ✅ Tydlig navigationsstruktur från README.md
- ✅ Inga duplicerade filer
- ✅ Inga utdaterade temporära filer
- ✅ Organiserad dokumentationsstruktur med kategorier
- ✅ Plan för framtida dokumentationsorganisation

---

## 🚀 Nästa Steg

### Kortsiktigt (Redan gjort):
- ✅ Städat bort utdaterade filer
- ✅ Konsoliderat duplicerade filer
- ✅ Organiserat dokumentation i kategorier
- ✅ Uppdaterat navigationsstruktur

### Långsiktigt (Framtida):
- [ ] Skapa `spitakolus-docs` repo för delad dokumentation
- [ ] Flytta dokumentation om delade resurser dit
- [ ] Uppdatera referenser i projekt-specifik dokumentation
- [ ] Etablera rutiner för när ny dokumentation ska läggas var

---

**Senast uppdaterad:** 2026-01-28
