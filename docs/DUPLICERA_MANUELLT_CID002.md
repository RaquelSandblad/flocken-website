# Duplicera Manuellt - CID002
**Datum:** 2026-01-25  
**Status:** 📋 Guide för manuell duplicering

---

## 🎯 Mål

Skapa en ny kampanj (cid002) med:
- **1 kampanj**
- **2 ad sets** (bästa performers)
- **2 ads från varje ad set** (bästa performers)
- **Ny targeting:** Göteborg + 80 km, Smartphones (iOS + Android), Hundintressen

---

## 📋 Tabell: Vad Ska Dupliceras

### Campaign

| Nuvarande Namn | Nuvarande ID | Nytt Namn | Kommentar |
|----------------|--------------|-----------|-----------|
| `c_flo_swe_init_dogowner_inst_h01_cid001` | 120239834352180455 | `c_flo_swe_init_dogowner_inst_h01_cid002` | Samma struktur, nytt CID |

**Inställningar att kopiera:**
- Objective: `OUTCOME_TRAFFIC`
- Status: `PAUSED` (aktivera efter targeting är klar)
- Budget: Ingen på campaign-nivå (sätts på ad set)

---

### Ad Sets (2 st)

| Nuvarande Namn | Nuvarande ID | Nytt Namn | Budget | Kommentar |
|----------------|--------------|-----------|--------|-----------|
| `as_para_puppies_swe_opt_lpv_cid001` | 120239866430560455 | `as_para_puppies_swe_opt_lpv_cid002` | 50 SEK/dag | Bästa CTR (4.82%) |
| `as_besoka_swe_opt_lpv_cid001` | 120239835158880455 | `as_besoka_swe_opt_lpv_cid002` | 50 SEK/dag | Högsta volym (4.21% CTR) |

**Inställningar att kopiera:**
- Optimization Goal: `LANDING_PAGE_VIEWS`
- Billing Event: `IMPRESSIONS`
- Bid Strategy: `LOWEST_COST_WITHOUT_CAP`
- Daily Budget: `5000` (50 SEK)

**Ny Targeting:**
- Geo: Göteborg + 80 km radius
- Age: 18-65
- Devices: Mobile (Smartphones)
- OS: Ingen begränsning (både iOS och Android)
- Interests: Hundar, Husdjur, Hundträning, Hundras
- Platforms: Facebook + Instagram

---

### Ads (4 st)

#### Från `as_para_puppies_swe_opt_lpv_cid001`:

| Nuvarande Namn | Nuvarande ID | Nytt Namn | CTR | Clicks | CPC | Kommentar |
|----------------|--------------|-----------|-----|--------|-----|-----------|
| `ad_h01a_cb002_v06_9x16_hk_para_puppies_cid001` | 120239866455310455 | `ad_h01a_cb002_v06_hk_para_puppies_src_ai_cid002` | 4.41% | 43 | 2.40 SEK | 9x16 format |
| `ad_h01a_cb002_v06_1x1_hk_para_puppies_cid001` | 120239866476520455 | `ad_h01a_cb002_v06_hk_para_puppies_src_ai_cid002` | 5.43% | 36 | 1.82 SEK | 1x1 format ⭐ |

**⚠️ OBS:** Ad-namnen behöver korrigeras enligt naming convention:
- Format (9x16, 1x1) ska INTE finnas i namnet
- `src_ai` ska läggas till
- `v06` behålls (micro-variant)

**Korrigerade namn:**
- `ad_h01a_cb002_v06_hk_para_puppies_src_ai_cid002` (för 9x16)
- `ad_h01a_cb002_v06_hk_para_puppies_src_ai_cid002` (för 1x1)

**Problem:** Båda ads får samma namn om format tas bort!

**Lösning:** Använd `v06` och `v07` för att skilja dem:
- `ad_h01a_cb002_v06_hk_para_puppies_src_ai_cid002` (9x16)
- `ad_h01a_cb002_v07_hk_para_puppies_src_ai_cid002` (1x1)

#### Från `as_besoka_swe_opt_lpv_cid001`:

| Nuvarande Namn | Nuvarande ID | Nytt Namn | CTR | Clicks | CPC | Kommentar |
|----------------|--------------|-----------|-----|--------|-----|-----------|
| `ad_h01a_cb005_v01_9x16_hk_besoka_cid001` | 120239855456700455 | `ad_h01a_cb005_v01_hk_besoka_src_ai_cid002` | 4.40% | 66 | 2.82 SEK | Bästa ad ⭐ |
| `ad_h01a_cb005_v02_9x16_hk_besoka_cid001` | 120239855474260455 | `ad_h01a_cb005_v02_hk_besoka_src_ai_cid002` | 3.95% | 21 | 2.93 SEK | v02 variant |

**Korrigerade namn:**
- `ad_h01a_cb005_v01_hk_besoka_src_ai_cid002` (9x16)
- `ad_h01a_cb005_v02_hk_besoka_src_ai_cid002` (9x16)

---

## 📝 Exakta Namn enligt Struktur

### Campaign
```
c_flo_swe_init_dogowner_inst_h01_cid002
```

**Format:** `c_<app><geo><stage><aud><obj>_h<nn>_cid<nnn>`
- app: `flo`
- geo: `swe`
- stage: `init`
- aud: `dogowner`
- obj: `inst`
- hypotes: `h01`
- cid: `cid002`

---

### Ad Sets

#### 1. Puppies Ad Set
```
as_para_puppies_swe_opt_lpv_cid002
```

**Format:** `as_<cell>_<geo>opt<obj>_cid<nnn>`
- cell: `para_puppies` (⚠️ OBS: Detta avviker från spec som säger att ad set INTE ska innehålla kreativ info)
- geo: `swe`
- obj: `lpv` (Landing Page Views)
- cid: `cid002`

**⚠️ PROBLEM:** Enligt naming spec ska ad set INTE innehålla kreativ info (puppies).  
**FÖRSLAG:** Använd `as_broad_swe_opt_lpv_cid002` eller `as_stack_swe_opt_lpv_cid002` istället.

#### 2. Besöka Ad Set
```
as_besoka_swe_opt_lpv_cid002
```

**Format:** `as_<cell>_<geo>opt<obj>_cid<nnn>`
- cell: `besoka` (⚠️ OBS: Detta avviker från spec)
- geo: `swe`
- obj: `lpv`
- cid: `cid002`

**⚠️ PROBLEM:** Enligt naming spec ska ad set INTE innehålla hook (`besoka`).  
**FÖRSLAG:** Använd `as_broad_swe_opt_lpv_cid002` eller skapa ny cell-typ.

---

### Ads

#### Format: `ad_h<nn><g>_cb<nnn>_v<nn>hk<token>src<token>_cid<nnn>`

#### Från Puppies Ad Set:

1. **9x16 variant:**
   ```
   ad_h01a_cb002_v06_hk_para_puppies_src_ai_cid002
   ```
   - h01a: hypotes 01, gren a
   - cb002: creative base 002
   - v06: variant 06
   - hk_para_puppies: hook para_puppies
   - src_ai: skapad av AI
   - cid002: campaign ID 002

2. **1x1 variant:**
   ```
   ad_h01a_cb002_v07_hk_para_puppies_src_ai_cid002
   ```
   - v07: ny variant för att skilja från 9x16

#### Från Besöka Ad Set:

1. **v01 variant:**
   ```
   ad_h01a_cb005_v01_hk_besoka_src_ai_cid002
   ```
   - cb005: creative base 005
   - v01: variant 01
   - hk_besoka: hook besöka

2. **v02 variant:**
   ```
   ad_h01a_cb005_v02_hk_besoka_src_ai_cid002
   ```
   - v02: variant 02

---

## ⚠️ Viktiga Noteringar

### Problem med Nuvarande Namnstruktur

1. **Ad Sets innehåller kreativ info:**
   - `as_para_puppies_...` innehåller "puppies" (kreativ info)
   - `as_besoka_...` innehåller "besoka" (hook)
   - Enligt spec ska ad set INTE innehålla detta

2. **Ad-namn innehåller format:**
   - `ad_..._9x16_...` innehåller format (9x16)
   - `ad_..._1x1_...` innehåller format (1x1)
   - Enligt spec ska format ALDRIG finnas i ad-namn

### Rekommendationer

**Alternativ 1: Behåll nuvarande struktur (för enkelhet)**
- Behåll `as_para_puppies_...` och `as_besoka_...`
- Ta bort format från ad-namn
- Lägg till `src_ai`

**Alternativ 2: Följ spec strikt (för framtiden)**
- Ändra ad set-namn till `as_broad_...` eller `as_stack_...`
- Skapa separata ad sets baserat på targeting, inte kreativ

---

## 📋 Checklista för Manuell Duplicering

### Steg 1: Duplicera Campaign
- [ ] Öppna Meta Ads Manager
- [ ] Gå till `c_flo_swe_init_dogowner_inst_h01_cid001`
- [ ] Klicka "Duplicate"
- [ ] Ändra namn till: `c_flo_swe_init_dogowner_inst_h01_cid002`
- [ ] Spara som PAUSED

### Steg 2: Ta bort onödiga Ad Sets
- [ ] Ta bort alla ad sets utom de två bästa:
  - [ ] Behåll: `as_para_puppies_swe_opt_lpv_cid002`
  - [ ] Behåll: `as_besoka_swe_opt_lpv_cid002`
  - [ ] Ta bort: `as_para_swe_opt_lpv_cid002`

### Steg 3: Uppdatera Ad Set Namn
- [ ] `as_para_puppies_swe_opt_lpv_cid002` → behåll eller ändra till `as_broad_swe_opt_lpv_cid002`
- [ ] `as_besoka_swe_opt_lpv_cid002` → behåll eller ändra till `as_broad_swe_opt_lpv_cid002`

### Steg 4: Ta bort onödiga Ads
För varje ad set:
- [ ] Behåll de 2 bästa ads
- [ ] Ta bort resten

**Puppies Ad Set:**
- [ ] Behåll: `ad_h01a_cb002_v06_9x16_hk_para_puppies_cid001` → `ad_h01a_cb002_v06_hk_para_puppies_src_ai_cid002`
- [ ] Behåll: `ad_h01a_cb002_v06_1x1_hk_para_puppies_cid001` → `ad_h01a_cb002_v07_hk_para_puppies_src_ai_cid002`
- [ ] Ta bort: Resten

**Besöka Ad Set:**
- [ ] Behåll: `ad_h01a_cb005_v01_9x16_hk_besoka_cid001` → `ad_h01a_cb005_v01_hk_besoka_src_ai_cid002`
- [ ] Behåll: `ad_h01a_cb005_v02_9x16_hk_besoka_cid001` → `ad_h01a_cb005_v02_hk_besoka_src_ai_cid002`
- [ ] Ta bort: Resten

### Steg 5: Uppdatera Ad Namn
- [ ] Ta bort format (9x16, 1x1) från alla ad-namn
- [ ] Lägg till `src_ai` i alla ad-namn
- [ ] Ändra `cid001` → `cid002`

### Steg 6: Uppdatera Targeting

För varje ad set:

**Geo:**
- [ ] Ta bort "Sweden"
- [ ] Lägg till "Göteborg, Sweden"
- [ ] Välj radius: 80 km
- [ ] Välj "People living in or recently in this location"

**Devices:**
- [ ] Välj "Mobile"
- [ ] Ta bort OS-begränsning (så både iOS och Android ingår)

**Interests:**
- [ ] Lägg till: Hundar (djur) - ID: 6003332344237
- [ ] Lägg till: Husdjur (djur) - ID: 6004037726009
- [ ] Lägg till: Hundträning (husdjur) - ID: 6003545396227
- [ ] Lägg till: Hundras (hundar) - ID: 6002934241659

**Age:**
- [ ] Behåll: 18-65

**Platforms:**
- [ ] Facebook + Instagram

### Steg 7: Verifiera
- [ ] Kontrollera att alla namn är korrekta
- [ ] Kontrollera att targeting är korrekt
- [ ] Kontrollera att budget är 50 SEK/dag per ad set

### Steg 8: Aktivera
- [ ] Aktivera kampanj
- [ ] Aktivera båda ad sets
- [ ] Aktivera alla 4 ads

---

## 📊 Slutlig Struktur

### Campaign
```
c_flo_swe_init_dogowner_inst_h01_cid002
```

### Ad Sets (2 st)
```
as_para_puppies_swe_opt_lpv_cid002
as_besoka_swe_opt_lpv_cid002
```

### Ads (4 st)

**Puppies Ad Set:**
```
ad_h01a_cb002_v06_hk_para_puppies_src_ai_cid002
ad_h01a_cb002_v07_hk_para_puppies_src_ai_cid002
```

**Besöka Ad Set:**
```
ad_h01a_cb005_v01_hk_besoka_src_ai_cid002
ad_h01a_cb005_v02_hk_besoka_src_ai_cid002
```

---

**Skapad:** 2026-01-25
