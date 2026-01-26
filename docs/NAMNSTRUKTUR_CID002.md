# Namnstruktur för CID002 - Manuell Duplicering
**Datum:** 2026-01-25  
**Status:** ✅ Klar för manuell duplicering

---

## 📋 Tabell: Exakta Namn enligt Struktur

### Campaign

| Typ | Namn | Kommentar |
|-----|------|-----------|
| Campaign | `c_flo_got_init_dogowner_inst_h01_cid002` | Nytt CID002 |

**Format:** `c_<app><geo><stage><aud><obj>_h<nn>_cid<nnn>`
- app: `flo`
- geo: `got` (Göteborg - geo-targetad till specifikt område)
- stage: `init`
- aud: `dogowner`
- obj: `inst`
- hypotes: `h01`
- cid: `cid002`

**✅ Uppdaterat:** Användaren har ändrat geo-taggen från `swe` till `got` för att reflektera geo-targeting till Göteborg + 80 km.

---

### Ad Sets (2 st)

| Nuvarande Namn (CID001) | Nytt Namn (CID002) | Kommentar |
|-------------------------|-------------------|-----------|
| `as_para_puppies_swe_opt_lpv_cid001` | `as_para_puppies_got_opt_lpv_cid002` | ✅ Uppdaterat med `got` |
| `as_besoka_swe_opt_lpv_cid001` | `as_besoka_got_opt_lpv_cid002` | ✅ Uppdaterat med `got` |

**✅ Uppdaterat:** Användaren har behållit nuvarande struktur och uppdaterat geo-taggen till `got`.

**REKOMMENDATION:** Behåll nuvarande namnstruktur för enkelhet, men ta bort format från ad-namn.

---

### Ads (4 st)

#### Från Puppies Ad Set

| Nuvarande Namn (CID001) | Nytt Namn (CID002) | Format | CTR | Clicks |
|-------------------------|-------------------|--------|-----|--------|
| `ad_h01a_cb002_v06_9x16_hk_para_puppies_cid001` | `ad_h01a_cb002_v06_hk_para_puppies_src_ai_cid002` | 9x16 | 4.41% | 43 |
| `ad_h01a_cb002_v06_1x1_hk_para_puppies_cid001` | `ad_h01a_cb002_v07_hk_para_puppies_src_ai_cid002` | 1x1 | 5.43% | 36 ⭐ |

**Ändringar:**
- ✅ Tog bort format (`9x16`, `1x1`)
- ✅ Ändrade `v06` → `v07` för 1x1-varianten (för att skilja dem)
- ✅ Lade till `src_ai`
- ✅ Ändrade `cid001` → `cid002`

#### Från Besöka Ad Set

| Nuvarande Namn (CID001) | Nytt Namn (CID002) | Format | CTR | Clicks |
|-------------------------|-------------------|--------|-----|--------|
| `ad_h01a_cb005_v01_9x16_hk_besoka_cid001` | `ad_h01a_cb005_v01_hk_besoka_src_ai_cid002` | 9x16 | 4.40% | 66 ⭐ |
| `ad_h01a_cb005_v02_9x16_hk_besoka_cid001` | `ad_h01a_cb005_v02_hk_besoka_src_ai_cid002` | 9x16 | 3.95% | 21 |

**Ändringar:**
- ✅ Tog bort format (`9x16`)
- ✅ Lade till `src_ai`
- ✅ Ändrade `cid001` → `cid002`

---

## ✅ Slutlig Namnstruktur

### Campaign
```
c_flo_swe_init_dogowner_inst_h01_cid002
```

### Ad Sets (2 st)
```
as_para_puppies_swe_opt_lpv_cid002
as_besoka_swe_opt_lpv_cid002
```

**ELLER** (om ni vill följa spec strikt):
```
as_broad_swe_opt_lpv_cid002
as_stack_swe_opt_lpv_cid002
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

## 📝 Targeting Inställningar

### Geo
- **Lägg till:** Göteborg, Sweden
- **Radius:** 80 km
- **Typ:** People living in or recently in this location

### Devices
- **Platform:** Mobile (Smartphones)
- **OS:** Ingen begränsning (både iOS och Android)

### Interests
- Hundar (djur) - ID: `6003332344237`
- Husdjur (djur) - ID: `6004037726009`
- Hundträning (husdjur) - ID: `6003545396227`
- Hundras (hundar) - ID: `6002934241659`

### Age
- 18-65

### Platforms
- Facebook
- Instagram

---

## 🎯 Sammanfattning

**Duplicera:**
1. Campaign: `c_flo_swe_init_dogowner_inst_h01_cid001` → `c_flo_swe_init_dogowner_inst_h01_cid002`
2. Ad Sets: 2 st (puppies och besöka)
3. Ads: 4 st (2 från varje ad set)

**Uppdaterat:**
- ✅ Campaign: `c_flo_got_init_dogowner_inst_h01_cid002` (geo: `got`)
- ✅ Ad Sets: `as_para_puppies_got_opt_lpv_cid002`, `as_besoka_got_opt_lpv_cid002`
- ⚠️ Ad-namn: Fortfarande behöver korrigeras (se nedan)
- ✅ Targeting: Göteborg + 80 km, Smartphones, Hundintressen

**Aktivera:**
- Efter att targeting är korrekt konfigurerad

---

---

## ⚠️ Ad-namn som behöver korrigeras

Baserat på bilderna ser jag att ad-namnen fortfarande innehåller format och saknar `src_ai`:

### Nuvarande Ad-namn (från bilder):
- `ad_h01a_cb005_v01_9x16_hk_besoka_cid002` ❌ (innehåller `9x16`)
- `ad_h01a_cb005_v02_9x16_hk_besoka_cid002` ❌ (innehåller `9x16`)
- `ad_h01a_cb002_v06_1x1_hk_para_puppies_cid002` ❌ (innehåller `1x1`, saknar `src_ai`)
- `ad_h01a_cb002_v06_9x16_hk_para_puppies_cid002` ❌ (innehåller `9x16`, saknar `src_ai`)

### Rekommenderade korrigerade namn:

**Besöka Ad Set:**
- `ad_h01a_cb005_v01_hk_besoka_src_ai_cid002` ✅
- `ad_h01a_cb005_v02_hk_besoka_src_ai_cid002` ✅

**Puppies Ad Set:**
- `ad_h01a_cb002_v06_hk_para_puppies_src_ai_cid002` ✅ (för 9x16)
- `ad_h01a_cb002_v07_hk_para_puppies_src_ai_cid002` ✅ (för 1x1, ändra v06 → v07 för att skilja dem)

**Ändringar som behövs:**
1. Ta bort format (`9x16`, `1x1`) från alla ad-namn
2. Lägg till `src_ai` i alla ad-namn
3. Ändra `v06` → `v07` för 1x1-varianten av puppies-ad

---

**Skapad:** 2026-01-25  
**Uppdaterad:** 2026-01-25 (geo-tagg ändrad till `got`)
