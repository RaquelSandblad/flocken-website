# Så här sätter vi upp den nya dokumentationsstrukturen

**Datum:** 2026-01-28  
**Status:** ✅ Flocken-website är städat och organiserat

---

## ✅ Beslut fattade

- ✅ **GitHub-konto:** `tbinho`
- ✅ **Repo-namn:** `spitakolus` (inte `spitakolus-docs`)
- ✅ **Visibility:** **Private** (företagsintern dokumentation)
- ✅ **Meta Ads naming:** Delat (skulle vara delat för att fungera över flera konton)
- ✅ **Alla repos måste ha:** Tydlig varning i README.md + DOCUMENTATION_MAP.md

---

## 🎯 Problem vi löser

### AI-förvirring (VIKTIGT!)

**Problem:**
- AI läser fel repo (nastahem när man jobbar på flocken-website)
- AI deployar på fel repo
- AI missar att information finns
- AI förstår inte vad som finns var

**Lösning:**
- ✅ Tydlig README.md i varje repo-root som förklarar vad som finns var
- ✅ Dokumentationskarta (`DOCUMENTATION_MAP.md`) i varje repo
- ✅ Tydliga länkar mellan repos
- ✅ Tydlig separation: Projekt-specifik vs Delad dokumentation
- ✅ "Start här"-sektioner som förklarar strukturen

---

## 🗂️ Struktur

### Företagsgemensamt (`spitakolus`)

```
spitakolus/
├── README.md                          # ⭐ START HÄR - Företagsgemensam dokumentation
│                                       # Förklarar vad som finns här och varför
│
├── DOCUMENTATION_RULES.md             # Regler för dokumentation, uppdatering, indexering
│                                       # Hur man dokumenterar, när, var
│
├── tracking/                           # Delad tracking-infrastruktur
│   ├── README.md                      # Index för tracking-dokumentation
│   ├── GTM_SHARED_CONTAINER.md        # GTM container som delas (gtm.nastahem.com)
│   ├── BIGQUERY_SHARED_PROJECT.md     # nastahem-tracking projekt
│   └── SHARED_EVENTS_CONVENTIONS.md   # Event naming som delas
│
├── meta-ads/                          # Delade Meta Ads standarder
│   ├── README.md                      # Index för Meta Ads-dokumentation
│   ├── NAMING_CONVENTIONS.md          # Naming conventions (fungerar över flera konton)
│   ├── CREATIVE_WORKFLOW.md           # Creative workflow (delas mellan projekt)
│   └── ACCOUNT_STRUCTURE.md           # Hur konton ska struktureras
│
├── development/                       # Företagsövergripande utveckling
│   ├── README.md                      # Index för development-dokumentation
│   ├── GIT_WORKFLOW.md                # Företagsövergripande Git-standarder
│   └── DEPLOYMENT_STANDARDS.md        # Deployment-standarder
│
└── company/                           # Företagsinformation
    ├── README.md
    ├── COMPANY_INFO.md                # Spitakolus AB info
    └── CONTACT.md                     # Kontaktinformation
```

### Projekt-specifik (`flocken-website`)

```
flocken-website/
├── README.md                          # ⭐ START HÄR - Projektöversikt
│                                       # Förklarar:
│                                       # - Vad detta repo är
│                                       # - Vad som finns här (projekt-specifik)
│                                       # - Vad som finns i spitakolus (delad)
│                                       # - Var man börjar
│
├── DOCUMENTATION_MAP.md               # 📍 Dokumentationskarta
│                                       # Komplett översikt över ALL dokumentation:
│                                       # - Vad finns i detta repo
│                                       # - Vad finns i spitakolus
│                                       # - Länkar till allt
│                                       # - Var man hittar vad
│
├── INSTALLATION.md                    # Deployment för detta repo
├── IMAGE_MANAGEMENT.md                # Projekt-specifik bildhantering
│
└── docs/
    ├── README.md                      # Index för projekt-specifik dokumentation
    │                                   # Förklarar vad som finns här
    │                                   # Länkar till spitakolus för delad info
    │
    ├── tracking/                       # Flocken-specifik tracking
    │   └── ... (länkar till spitakolus/tracking för delad info)
    │
    ├── meta/                          # Flocken-specifik Meta Ads
    │   └── ... (länkar till spitakolus/meta-ads för naming conventions)
    │
    └── ...
```

---

## 📋 Vad ska vart?

### Företagsgemensamt (`spitakolus`)

**Placera här:**
- ✅ GTM Shared Container setup (används av både Flocken och Nästa Hem)
- ✅ BigQuery projekt-struktur (`nastahem-tracking` används av båda)
- ✅ Meta Ads naming conventions (fungerar över flera konton)
- ✅ Företagsövergripande Git workflows
- ✅ Deployment-standarder som delas
- ✅ Regler för dokumentation (`DOCUMENTATION_RULES.md`)

### Projekt-specifik (`flocken-website/docs/`)

**Placera här:**
- ✅ Flocken-specifik tracking setup
- ✅ Flocken-specifika Meta Ads campaigns
- ✅ Flocken-specifik deployment
- ✅ Projekt-specifika workflows
- ✅ Flocken-specifika creative bases

---

## 🎯 Lösning på AI-förvirring

### Problem 1: AI läser fel repo

**Lösning:**
- ✅ Tydlig README.md i root som förklarar vad repo är
- ✅ Tydlig varning om att detta är flocken-website, inte nastahem
- ✅ Länkar till andra repos för jämförelse

### Problem 2: AI deployar på fel repo

**Lösning:**
- ✅ Tydlig deployment-sektion i README.md
- ✅ Tydliggör vilket repo som deployar var
- ✅ Tydliggör vilken remote som ska användas

### Problem 3: AI missar att information finns

**Lösning:**
- ✅ `DOCUMENTATION_MAP.md` i varje repo med komplett översikt
- ✅ Tydliga länkar till all dokumentation
- ✅ "Start här"-sektioner som guidar

### Problem 4: AI förstår inte strukturen

**Lösning:**
- ✅ README.md i varje repo-root förklarar strukturen
- ✅ Tydlig separation: Projekt-specifik vs Delad
- ✅ Länkar mellan repos
- ✅ Konsistent struktur över alla repos

---

## 📝 README.md struktur för varje repo

### `spitakolus/README.md`

```markdown
# Spitakolus - Företagsgemensam Dokumentation

**⚠️ VIKTIGT:** Detta är FÖRETAGSGEMENSAM dokumentation för Spitakolus AB.
Detta repo innehåller delad dokumentation som används av flera projekt.

## 🎯 Vad finns här?

- **Delad tracking-infrastruktur** (GTM, BigQuery)
- **Delade Meta Ads standarder** (naming conventions, workflows)
- **Företagsövergripande processer** (Git, deployment)
- **Regler för dokumentation** (hur man dokumenterar, uppdaterar, indexerar)

## 📁 Struktur

- `tracking/` - Delad tracking-infrastruktur
- `meta-ads/` - Delade Meta Ads standarder
- `development/` - Företagsövergripande utveckling
- `company/` - Företagsinformation

## 🔗 Projekt-specifik dokumentation

- [flocken-website](https://github.com/tbinho/flocken-website) - Flocken projekt
- [nastahem](https://github.com/tbinho/nastahem) - Nästa Hem projekt

## 📖 Regler för dokumentation

Se [DOCUMENTATION_RULES.md](./DOCUMENTATION_RULES.md) för:
- Hur man dokumenterar
- När man uppdaterar
- Hur man indexerar
- Var man lägger ny dokumentation
```

### `flocken-website/README.md` (REDAN UPPDATERAT ✅)

Se `flocken-website/README.md` för komplett exempel.

### `nastahem/README.md` (Ska uppdateras)

```markdown
# Nästa Hem

**⚠️ VIKTIGT:** Detta är **NASTAHEM** repo.  
För Flocken-projektet, se [flocken-website](https://github.com/tbinho/flocken-website).

## 🎯 Vad finns här?

**Projekt-specifik dokumentation:**
- Nästa Hem-specifik tracking setup
- Nästa Hem-specifika Meta Ads campaigns
- Nästa Hem-specifik deployment
- Projekt-specifika workflows

**Delad dokumentation:**
- Se [spitakolus](https://github.com/tbinho/spitakolus) för:
  - GTM Shared Container setup
  - BigQuery projekt-struktur
  - Meta Ads naming conventions
  - Företagsövergripande processer

## 📍 Dokumentationskarta

Se [DOCUMENTATION_MAP.md](./DOCUMENTATION_MAP.md) för komplett översikt över ALL dokumentation.

## 🚀 Start här

1. [README.md](./README.md) - Denna fil (projektöversikt)
2. [DOCUMENTATION_MAP.md](./DOCUMENTATION_MAP.md) - Komplett dokumentationskarta
3. [INSTALLATION.md](./INSTALLATION.md) - Deployment-guide
4. [docs/README.md](./docs/README.md) - Projekt-specifik dokumentation
```

### Mallar för framtida repos

Se [DOCUMENTATION_TEMPLATES.md](./DOCUMENTATION_TEMPLATES.md) för kompletta mallar som ska användas när nya repos skapas.

---

## 🚀 Steg-för-steg: Skapa `spitakolus` repo

### Steg 1: Skapa repo på GitHub (Du)

1. Gå till: https://github.com/tbinho
2. Klicka "New repository"
3. **Repository name:** `spitakolus`
4. **Description:** "Företagsgemensam dokumentation för Spitakolus AB - Delade verktyg, processer och standarder"
5. **Visibility:** **Private** ✅
6. **VIKTIGT:** Kryssa INTE i några rutor
7. Klicka "Create repository"

### Steg 2: Klona repo lokalt (Jag gör detta)

När du har skapat repo på GitHub, säg till så klonar jag det automatiskt:

```powershell
# Jag kör detta när repot är skapat:
cd C:\Dev
git clone https://github.com/tbinho/spitakolus.git
cd spitakolus
```

**Plats:** `C:\Dev\spitakolus` (samma nivå som `flocken-website` och `nastahem`)

### Steg 3: Skapa struktur (Jag gör detta)

När du har klonat repo, säg till så skapar jag:

1. ✅ Mappstruktur (`tracking/`, `meta-ads/`, `development/`, `company/`)
2. ✅ README.md i root med tydlig förklaring
3. ✅ DOCUMENTATION_RULES.md med regler för dokumentation
4. ✅ README.md i varje kategori-mapp
5. ✅ Första dokumentation om delade resurser

### Steg 4: Uppdatera flocken-website (Jag gör detta)

1. ✅ Skapa `DOCUMENTATION_MAP.md` i flocken-website root (REDAN GJORT ✅)
2. ✅ Uppdatera `README.md` med tydlig struktur-förklaring (REDAN GJORT ✅)
3. ✅ Lägg till länkar till `spitakolus` repo (REDAN GJORT ✅)
4. ✅ Uppdatera `docs/README.md` med länkar till delad dokumentation
5. ✅ Se till att tydlig varning finns: "Detta är FLOCKEN-WEBSITE repo" (REDAN GJORT ✅)

### Steg 5: Uppdatera nastahem (Jag gör detta)

1. ✅ Skapa `DOCUMENTATION_MAP.md` i nastahem root (med tydlig varning: "Detta är NASTAHEM repo")
2. ✅ Uppdatera `README.md` med tydlig struktur-förklaring och varning
3. ✅ Lägg till länkar till `spitakolus` repo
4. ✅ Se till att tydlig varning finns: "Detta är NASTAHEM repo, inte flocken-website"

### Steg 6: Mall för framtida repos

1. ✅ Skapa mall/template för DOCUMENTATION_MAP.md i `spitakolus` repo
2. ✅ Skapa mall/template för README.md struktur i `spitakolus` repo
3. ✅ Dokumentera i `DOCUMENTATION_RULES.md` att alla nya repos måste ha:
   - Tydlig varning i README.md om vilket repo det är
   - DOCUMENTATION_MAP.md med komplett översikt
   - Länkar till spitakolus för delad dokumentation

---

## 📋 Checklista

### Du gör:
- [ ] Skapa `spitakolus` repo på GitHub (tbinho, Private)
- [ ] Säga till när repot är skapat på GitHub

### Jag gör:
- [ ] Klona repo lokalt till `C:\Dev\spitakolus`
- [ ] Skapa mappstruktur lokalt
- [ ] Skapa alla filer och dokumentation

### Jag gör:
- [ ] Skapa mappstruktur lokalt i `spitakolus`
- [ ] Skapa README.md med tydlig förklaring
- [ ] Skapa DOCUMENTATION_RULES.md (inkluderar mallar för nya repos)
- [ ] Skapa README.md i varje kategori-mapp
- [ ] Identifiera delad dokumentation
- [ ] Skapa dokumentation om delade resurser
- [ ] Skapa mallar/templates för nya repos i `spitakolus`
- [x] Skapa DOCUMENTATION_MAP.md i flocken-website ✅ (REDAN GJORT)
- [x] Uppdatera README.md i flocken-website ✅ (REDAN GJORT)
- [ ] Uppdatera docs/README.md i flocken-website
- [ ] Uppdatera nastahem med samma struktur (DOCUMENTATION_MAP.md + varningar)

---

## ✅ Resultat

Efter setup kommer:
- ✅ Tydlig separation: Projekt-specifik vs Delad dokumentation
- ✅ Tydliga ingångar i varje repo (README.md, DOCUMENTATION_MAP.md)
- ✅ Tydliga varningar i alla repos: "Detta är [PROJEKTNAMN] repo"
- ✅ AI förstår vad som finns var
- ✅ AI läser rätt repo
- ✅ AI deployar på rätt repo
- ✅ AI hittar all dokumentation
- ✅ Konsistent struktur över alla repos
- ✅ Mallar för framtida repos i `spitakolus` repo

---

**När du är redo:** Skapa repo på GitHub och klona det, säg till så börjar jag skapa strukturen! 🚀
