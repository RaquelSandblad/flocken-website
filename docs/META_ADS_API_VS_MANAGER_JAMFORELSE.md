# Meta Ads API vs Ads Manager - Jämförelse och Förklaring

**Datum:** 2026-01-25  
**Period:** Senaste 30 dagarna

---

## 📊 API-data (Korrekt)

### Account-level (30 dagar)

| Metric | API-värde | Kommentar |
|--------|-----------|-----------|
| **Impressions** | 10,844 | Totalt antal visningar |
| **Reach** | 7,367 | Unika användare |
| **Clicks** | 516 | Totalt antal klick |
| **CTR** | 4.76% | Click-through rate |
| **Spend** | 1,074.52 SEK | Total kostnad |
| **CPC** | 2.08 SEK | Cost per click |
| **CPM** | 99.09 SEK | Cost per 1000 impressions |

### Kampanjprestanda

**`c_flo_swe_init_dogowner_inst_h01_cid001`**

| Metric | Värde |
|--------|-------|
| Impressions | 5,731 |
| Clicks | 248 |
| CTR | 4.33% |
| Spend | 699.80 SEK |
| CPC | 2.82 SEK |

### Ad Set-prestanda

| Ad Set | Impressions | Clicks | CTR | Spend | CPC |
|--------|-------------|--------|-----|-------|-----|
| `as_para_puppies` | 1,639 | 79 | 4.82% | 168.52 SEK | 2.13 SEK |
| `as_besoka` | 2,089 | 88 | 4.21% | 256.36 SEK | 2.91 SEK |
| `as_para` | 2,004 | 81 | 4.04% | 275.16 SEK | 3.40 SEK |

---

## 🔍 Varför Skillnader Mellan API och Ads Manager?

### 1. **Tidszoner och Datum**

**Problem:** API och Ads Manager kan visa olika datumintervall beroende på tidszon.

**Förklaring:**
- API använder UTC (Coordinated Universal Time)
- Ads Manager kan visa data i din lokala tidszon (CET/CEST)
- En dag i Sverige kan vara två olika dagar i UTC

**Exempel:**
- API: 2025-12-26 00:00 UTC till 2026-01-25 23:59 UTC
- Ads Manager (CET): Kan visa 2025-12-26 01:00 till 2026-01-26 00:59

**Lösning:** Kontrollera vilken tidszon Ads Manager använder och justera API-anropet därefter.

---

### 2. **Attribution Windows**

**Problem:** Olika attribution windows ger olika siffror.

**Förklaring:**
- **API default:** 7-dagars click, 1-dagars view attribution
- **Ads Manager default:** Kan vara 1-dagars click, 1-dagars view
- **Custom conversions:** Kan ha olika attribution windows

**Vad påverkar:**
- Conversions (landing page views, purchases, etc.)
- Action values
- ROAS-beräkningar

**Lösning:** Specificera samma attribution window i API-anropet:
```
&attribution_window=7d_click,1d_view
```

---

### 3. **Data Processing Delay**

**Problem:** API kan visa data som ännu inte är tillgängligt i Ads Manager (eller tvärtom).

**Förklaring:**
- Meta bearbetar data kontinuerligt
- API kan ha 15-30 minuters delay
- Ads Manager kan ha 1-2 timmars delay för vissa metrics
- Historisk data kan uppdateras retroaktivt

**Vad påverkar:**
- Senaste timmen/dagen kan variera
- Äldre data är mer stabil

**Lösning:** Jämför data från samma tidpunkt, eller vänta några timmar efter periodens slut.

---

### 4. **Breakdowns och Aggregation**

**Problem:** API och Ads Manager kan aggregera data olika.

**Förklaring:**
- **API:** Kan visa data per dag, per ad set, per ad, etc.
- **Ads Manager:** Kan visa aggregerad data eller breakdowns
- Olika breakdowns ger olika totalsummor

**Exempel:**
- API visar totalt för alla ad sets: 5,731 impressions
- Ads Manager kan visa breakdown per dag: Summan kan skilja sig om några dagar saknas

**Lösning:** Kontrollera att du jämför samma aggregation level.

---

### 5. **Filter och Exkluderingar**

**Problem:** Ads Manager kan ha filter aktiverade som API inte har.

**Förklaring:**
- **Ads Manager:** Kan filtrera på status, kampanjtyp, etc.
- **API:** Visar all data som matchar queryn
- Pausade kampanjer kan inkluderas/exkluderas olika

**Vad påverkar:**
- Totalt antal kampanjer/ad sets/ads
- Aggregerade siffror

**Lösning:** Kontrollera filter i Ads Manager och applicera samma filter i API-anropet.

---

### 6. **Rounding och Precision**

**Problem:** Olika avrundning kan ge små skillnader.

**Förklaring:**
- **API:** Visar exakta värden (t.ex. 4.753098%)
- **Ads Manager:** Avrundar till 2 decimaler (t.ex. 4.75%)
- Vid aggregering kan små skillnader bli större

**Exempel:**
- API CTR: 4.753098%
- Ads Manager CTR: 4.75%
- Skillnad: 0.003098% (försumbar)

**Lösning:** Förvänta dig små skillnader (< 0.1%) på grund av avrundning.

---

### 7. **API Version och Fields**

**Problem:** Olika API-versioner kan returnera olika data.

**Förklaring:**
- **API v21.0:** Används i scripten
- **Ads Manager:** Kan använda nyare API-versioner internt
- Vissa fields kan vara deprecated eller ändras

**Vad påverkar:**
- Nya metrics kan saknas i äldre API-versioner
- Deprecated fields kan ge felaktiga värden

**Lösning:** Använd senaste stabila API-versionen och kontrollera field-dokumentation.

---

## 📋 Checklista för Jämförelse

När du jämför API-data med Ads Manager, kontrollera:

- [ ] **Samma datumintervall**
  - API: 2025-12-26 till 2026-01-25 (UTC)
  - Ads Manager: Samma datum i din tidszon

- [ ] **Samma attribution window**
  - API: Default eller specificerat
  - Ads Manager: Kontrollera i kolumn-inställningar

- [ ] **Samma filter**
  - Status (ACTIVE, PAUSED, etc.)
  - Kampanjtyp
  - Ad set-typ

- [ ] **Samma aggregation level**
  - Account-level
  - Campaign-level
  - Ad Set-level
  - Ad-level

- [ ] **Samma metrics**
  - Impressions, Clicks, CTR
  - Spend, CPC, CPM
  - Conversions (samma definition)

- [ ] **Samma tidszon**
  - API använder UTC
  - Ads Manager kan använda lokal tidszon

---

## 🎯 Förväntade Skillnader

### Små Skillnader (< 1%) - Normal

- **CTR:** ±0.1% på grund av avrundning
- **CPC:** ±0.01 SEK på grund av avrundning
- **Impressions:** ±10-50 på grund av data processing delay

### Medel Skillnader (1-5%) - Kontrollera

- **Spend:** Kan variera om attribution windows är olika
- **Conversions:** Kan variera beroende på attribution
- **Clicks:** Kan variera om filter är olika

### Stora Skillnader (> 5%) - Problem

- **Totalt spend:** Kontrollera datumintervall och filter
- **Impressions:** Kontrollera att samma kampanjer/ad sets ingår
- **Conversions:** Kontrollera attribution windows

---

## 💡 Praktiska Tips

### 1. Använd API för Automatisering

**Fördelar:**
- Konsistent dataformat
- Automatiserad analys
- Historisk data enkelt tillgänglig

**När att använda:**
- Veckovis/månadsvis rapportering
- Automatiserad optimering
- Dashboard-uppdateringar

### 2. Använd Ads Manager för Manuell Analys

**Fördelar:**
- Visuell representation
- Enkel filtrering och sortering
- Interaktiv analys

**När att använda:**
- Snabb översikt
- Ad-hoc analys
- Visuell granskning av kreativ

### 3. Validera API-data Mot Ads Manager

**Rekommendation:**
- Kör API-analys veckovis
- Jämför med Ads Manager för samma period
- Dokumentera eventuella skillnader
- Uppdatera script om skillnader är stora

---

## 📊 Nuvarande API-data (Korrekt)

Baserat på senaste körningen:

### Account Summary
- **Total Spend:** 1,074.52 SEK (30 dagar)
- **Genomsnitt/dag:** ~35.82 SEK/dag
- **Total Clicks:** 516
- **CTR:** 4.76% ✅ Utmärkt!

### Top Performers
1. **`as_para_puppies`** - 4.82% CTR, 2.13 SEK CPC ⭐
2. **`as_besoka`** - 4.21% CTR, 2.91 SEK CPC
3. **`as_para`** - 4.04% CTR, 3.40 SEK CPC

### Bästa Ad
- **`ad_h01a_cb002_v01_4x5_hk_para_cid001`** - 5.69% CTR
- **`ad_h01a_cb002_v06_1x1_hk_para_puppies_cid001`** - 5.43% CTR, 1.82 SEK CPC (lägsta!)

---

## 🔧 Om Siffrorna Skiljer Sig

Om du ser skillnader mellan API och Ads Manager:

1. **Kontrollera datumintervall** - Är det exakt samma period?
2. **Kontrollera filter** - Är samma kampanjer/ad sets inkluderade?
3. **Kontrollera tidszon** - UTC vs lokal tidszon?
4. **Kontrollera attribution** - Samma attribution window?
5. **Kontrollera data processing** - Vänta några timmar efter periodens slut

**Om skillnaden är > 5%:** Kontakta Meta support eller granska API-anropet noggrant.

---

**Senast uppdaterad:** 2026-01-25  
**API Version:** v21.0  
**Data Period:** 2025-12-26 till 2026-01-25 (UTC)
