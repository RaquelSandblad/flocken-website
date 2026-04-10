# Fix: CTA-klick och experiment-events registreras inte i GA4

**Problem:** Sidvisningar (`page_view`) syns i GA4 Realtime, men `cta_click`, `experiment_impression` och `click` syns inte.

**Status:** ✅ LÖST 2026-02-04

---

## Rotorsak

Problemet var i **två lager**:

### 1. Webb-GTM (GTM-PD5N4GT3) saknade event-taggar
Koden pushade `cta_click` och `experiment_impression` till `dataLayer`, men det fanns inga GTM-taggar som lyssnade på dessa events och skickade dem vidare.

### 2. Server-GTM (GTM-THB49L3K) vidarebefordrade bara page_view
Taggen **"GA4 - Forward All"** hade triggern **"All Pages"** som bara matchade `page_view`-events. Custom events som `experiment_impression` och `cta_click` ignorerades av server-containern trots att de nådde dit.

---

## Dataflöde (efter fix)

```
Frontend (flocken.info)
│
├─ ExperimentTracker → dataLayer.push({event: 'experiment_impression', ...})
├─ CTA-klick → dataLayer.push({event: 'cta_click', ...})
│
└─► Webb-GTM (GTM-PD5N4GT3)
    │
    ├─ "Google Tag - Flocken" (page_view)
    │   → Trigger: Page View - Flocken (hostname = flocken.info)
    │
    ├─ "GA4 Event - Flocken Custom" (experiment_impression, cta_click)
    │   → Trigger 1: Custom Event - cta_click (Flocken)
    │   → Trigger 2: Custom Event - experiment_impression (Flocken)
    │   → Mätnings-id: GA4 Configuration - Flocken
    │   → Event Name: {{Event}} (dynamiskt)
    │   → Parametrar: experiment_id, variant_id, cta_name, cta_destination
    │
    ├─ "GA4 - Click Tracking - Flocken" (länkklick)
    │   → Trigger: Click - Flocken (länkar)
    │   → Event Name: click
    │   → Parametrar: click_text, link_url, page_url
    │
    └─► Server-GTM (GTM-THB49L3K @ gtm.nastahem.com)
        │
        └─ "GA4 - Forward All" (AKTIV)
           → Trigger: All Events (INTE "All Pages"!)
           → Mätnings-id: {{GA Measurement ID (tid)}}
           → Standardparametrar: Alla
           → Användarattribut: Alla
           │
           └─► GA4 Property (G-7B1SVKL89Q)
               → page_view ✅
               → experiment_impression ✅
               → cta_click ✅
               → click ✅
```

---

## Vad som gjordes

### Steg 1: Webb-GTM (GTM-PD5N4GT3)

**Taggar skapade:**

| Tag | Typ | Trigger | Mätnings-id |
|-----|-----|---------|-------------|
| GA4 Event - Flocken Custom | GA4-händelse | cta_click + experiment_impression | GA4 Configuration - Flocken |
| GA4 - Click Tracking - Flocken | GA4-händelse | Click - Flocken (länkar) | GA4 Configuration - Flocken |

**Triggers skapade:**

| Trigger | Typ | Event name | Villkor |
|---------|-----|------------|---------|
| Custom Event - cta_click (Flocken) | Custom Event | cta_click | Page Hostname contains flocken.info |
| Custom Event - experiment_impression (Flocken) | Custom Event | experiment_impression | Page Hostname contains flocken.info |
| Click - Flocken (länkar) | Click - All Elements | (alla klick) | CSS selector = a, Page Hostname contains flocken.info |

**Data Layer Variables skapade:**

| GTM Variable Name | Data Layer Variable Name |
|-------------------|--------------------------|
| DLV - experiment_id | experiment_id |
| DLV - variant_id | variant_id |
| DLV - cta_name | cta_name |
| DLV - cta_destination | cta_destination |

**Se även:** `GTM_FLOCKEN_TAGS_STEGFORSTEG.md` för steg-för-steg-guide.

### Steg 2: Server-GTM (GTM-THB49L3K)

**Fix:** Bytte triggern på "GA4 - Forward All" från **"All Pages"** till **"All Events"**.

**Tagg-status i server-containern:**

| Tag | Status | Trigger |
|-----|--------|---------|
| **GA4 - Forward All** | ✅ Aktiv | All Events |
| GA4 - Flocken | ⏸️ Pausad | Flocken - GA4 Events |
| GA4 Configuration | ⏸️ Pausad | All Pages |
| GA4 Event Tag - Nästa Hem | ⏸️ Pausad | Nästa Hem - GA4 Events |

**Varför bara "GA4 - Forward All" är aktiv:**
- Den använder `{{GA Measurement ID (tid)}}` dynamiskt → routar automatiskt till rätt GA4-property
- En tag hanterar båda brands (Flocken + Nästa Hem)
- De tre pausade taggarna hade AND-villkor i sina triggers som inte matchade alla event-typer

### Steg 3: Kodändringar (redan deployade)

**Filer ändrade:**
- `components/marketing/HeroBlock.tsx` – Lade till `trackExperimentCTAClick` i onClick-handlers
- `components/marketing/HeroBlockVariantB.tsx` – Samma
- `components/ab-testing/ExperimentTracker.tsx` – Förbättrad logging
- `lib/ab-testing/tracking.ts` – Pushar events till dataLayer + gtag + Meta Pixel

---

## Verifiering

### Från webbläsarens nätverkspanel:
```
performance.getEntriesByType('resource')
  .filter(r => r.name.includes('collect'))
  .map(r => r.name.match(/en=([^&]*)/)?.[1])
// Resultat: ["page_view", "experiment_impression"]
```

Båda events skickas till `gtm.nastahem.com/g/collect` med `tid=G-7B1SVKL89Q`.

### Från GA4 Realtime:
- ✅ page_view
- ✅ experiment_impression (syns som event i realtid)
- ✅ cta_click (syns efter klick på CTA)
- ✅ click (syns efter klick på länk)

---

## Felsökning

### "Events skickas men syns inte i GA4"
1. Kolla server-containern (GTM-THB49L3K) → är "GA4 - Forward All" aktiv?
2. Har "GA4 - Forward All" triggern "All Events" (inte "All Pages")?
3. GA4 Realtime kan ha 30–60 sek fördröjning

### "Events pushas inte till dataLayer"
1. Console → `window.dataLayer.filter(e => e.event === 'experiment_impression')`
2. Kontrollera att `ExperimentTracker` renderas (loggar i console)
3. Kontrollera cookie-consent: `localStorage.getItem('cookie-consent')`

### "Requests skickas inte till gtm.nastahem.com"
1. Network tab → filtrera "collect"
2. Eller: `performance.getEntriesByType('resource').filter(r => r.name.includes('collect'))`
3. Kontrollera att webb-GTM-taggarna är publicerade

### Viktigt: window.gtag finns INTE
`window.gtag` är `undefined` på flocken.info. All tracking går via `dataLayer.push()` → GTM.
Koden i `tracking.ts` har `window.gtag`-anrop som fallback, men de exekveras aldrig.
Tracking fungerar ändå via dataLayer-vägen.

---

## Event-format från koden

```javascript
// experiment_impression (automatiskt vid sidladdning via ExperimentTracker)
window.dataLayer.push({
  event: 'experiment_impression',
  experiment_id: 'valkommen_hero_v1',
  experiment_name: 'Välkommen Hero Test',
  variant_id: 'control' | 'variant_b'
});

// cta_click (vid klick på CTA-knapp)
window.dataLayer.push({
  event: 'cta_click',
  experiment_id: 'valkommen_hero_v1',
  experiment_name: 'Välkommen Hero Test',
  variant_id: 'control' | 'variant_b',
  cta_name: 'hero_primary' | 'hero_secondary',
  cta_destination: '/download'
});
```

---

**Senast uppdaterad:** 2026-02-04
**Status:** ✅ LÖST – Events registreras i GA4 Realtime
