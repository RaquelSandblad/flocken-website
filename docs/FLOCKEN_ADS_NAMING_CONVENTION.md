# Flocken Ads - Namnkonvention

## Översikt

Alla namn följer ett strukturerat format för enkel filtrering och analys.

---

## Campaign-nivå

**Format:** `c_[brand]_[country]_[phase]_[audience]_[objective]_[hook]_[cid]`

**Exempel:** `c_flo_swe_init_dogowner_inst_h01_cid001`

| Segment | Värde | Betydelse |
|---------|-------|-----------|
| `c` | c | Campaign (fast prefix) |
| `brand` | flo | Flocken (förkortat) |
| `country` | swe | Sverige |
| `phase` | init | Initial/test-fas |
| `audience` | dogowner | Målgrupp: hundägare |
| `objective` | inst | Install (app-installation) |
| `hook` | h01 | Hook-tema 01 |
| `cid` | cid001 | Campaign ID 001 |

---

## Ad Set-nivå

**Format:** `as_[concept]_[country]_[opt]_[goal]_[cid]`

**Exempel:** `as_para_swe_opt_lpv_cid001`

| Segment | Värde | Betydelse |
|---------|-------|-----------|
| `as` | as | Ad Set (fast prefix) |
| `concept` | para / besoka | Creative Base-koncept (Para/Besöka) |
| `country` | swe | Sverige |
| `opt` | opt | Optimering |
| `goal` | lpv | Landing Page Views |
| `cid` | cid001 | Campaign ID (koppling till kampanj) |

**Möjliga värden för `goal`:**
- `lpv` = Landing Page Views
- `lc` = Link Clicks
- `inst` = App Installs

---

## Ad-nivå

**Format:** `ad_[hook]_[cb]_[variant]_[format]_[hk]_[concept]_[cid]`

**Exempel:** `ad_h01a_cb002_v01_9x16_hk_para_cid001`

| Segment | Värde | Betydelse |
|---------|-------|-----------|
| `ad` | ad | Ad (fast prefix) |
| `hook` | h01a | Hook 01, variant a |
| `cb` | cb002 / cb005 | Creative Base nummer |
| `variant` | v01 / v02 | Copy-variant (1 eller 2) |
| `format` | 9x16 / 4x5 | Videoformat (Stories / Feed) |
| `hk` | hk | Hook (fast segment) |
| `concept` | para / besoka | Koncept-namn |
| `cid` | cid001 | Campaign ID |

---

## Creative Bases

| CB-nummer | Koncept | Beskrivning |
|-----------|---------|-------------|
| cb001 | Rasta | Hundpromenader |
| cb002 | Para | Parning/matchning |
| cb003 | Passa | Hundpassning |
| cb004 | Rasta+ | Promenader utökad |
| cb005 | Besöka | Hundvänliga platser |

---

## Copy-varianter

| Variant | Headline | Primärtext-stil |
|---------|----------|-----------------|
| v01 | "Hela hundlivet i en app" | Emotionell, lista med features |
| v02 | "🐾 Flocken - appen för svenska hundägare" | Kort, checkmarks, direkt CTA |

---

## Videoformat

| Format | Användning | Placering |
|--------|------------|-----------|
| 9x16 | Vertikal | Stories, Reels |
| 4x5 | Nästan kvadrat | Feed |
| 1x1 | Kvadrat | Feed (backup) |

---

## UTM-parametrar

Alla annonser har UTM-taggar för spårning:

```
utm_source=meta
utm_medium=paid_social
utm_campaign=[kampanjnamn]
utm_content=[annonsnamn]
```

---

## Exempel på fullständig struktur

```
Campaign: c_flo_swe_init_dogowner_inst_h01_cid001
│
├── Ad Set: as_para_swe_opt_lpv_cid001
│   ├── ad_h01a_cb002_v01_9x16_hk_para_cid001
│   ├── ad_h01a_cb002_v02_9x16_hk_para_cid001
│   ├── ad_h01a_cb002_v01_4x5_hk_para_cid001
│   └── ad_h01a_cb002_v02_4x5_hk_para_cid001
│
└── Ad Set: as_besoka_swe_opt_lpv_cid001
    ├── ad_h01a_cb005_v01_9x16_hk_besoka_cid001
    ├── ad_h01a_cb005_v02_9x16_hk_besoka_cid001
    ├── ad_h01a_cb005_v01_4x5_hk_besoka_cid001
    └── ad_h01a_cb005_v02_4x5_hk_besoka_cid001
```
