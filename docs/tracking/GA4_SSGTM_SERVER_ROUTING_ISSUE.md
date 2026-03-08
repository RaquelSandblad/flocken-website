# GA4 server-side routing issue (Flocken vs N�sta Hem)

**Status:** ? L�ST 2026-02-04

---

## Kort sammanfattning

Webb-GTM (GTM-PD5N4GT3) skickar events med `tid=G-7B1SVKL89Q` (Flocken) till servern `https://gtm.nastahem.com`.

**Tidigare problem:** Custom events (experiment_impression, cta_click, click) n�dde server-containern men vidarebefordrades inte till GA4. Bara page_view kom igenom.

**Rotorsak:** Taggen "GA4 - Forward All" i server-containern hade triggern "All Pages" som bara matchade page_view-events.

**Fix:** Bytte triggern till "All Events".

---

## Nuvarande konfiguration (server, GTM-THB49L3K)

### Klient
- GA4 (webb), prioritet 0, standardv�gar, aktiv.

### Taggar

| Tag | Status | M�tnings-id | Trigger |
|-----|--------|-------------|---------|
| **GA4 - Forward All** | ? Aktiv | `{{GA Measurement ID (tid)}}` | **All Events** |
| GA4 - Flocken | ?? Pausad | G-7B1SVKL89Q | Flocken - GA4 Events |
| GA4 Configuration | ?? Pausad | (All Pages) | All Pages |
| GA4 Event Tag - N�sta Hem | ?? Pausad | G-7N67P0KT0B | N�sta Hem - GA4 Events |

**Varf�r "GA4 - Forward All" �r den enda aktiva taggen:**
- Anv�nder `{{GA Measurement ID (tid)}}` dynamiskt ? routar till r�tt GA4-property baserat p� `tid` i requesten
- Hanterar ALLA events f�r ALLA brands (Flocken + N�sta Hem)
- Standardparametrar: Alla (vidarebefordrar alla event-parametrar)
- Anv�ndarattribut: Alla

**Varf�r de andra �r pausade:**
- "GA4 - Flocken" och "GA4 Event Tag - N�sta Hem" hade triggers med AND-villkor som inte matchade alla event-typer (measurement_id, x-ga-measurement_id och tid kr�vdes alla tre)
- "GA4 Configuration" (All Pages, N�sta Hem-ID) tog �ver alla events till N�sta Hem n�r den var aktiv

### Variabler

| Variabel | Typ | Key path |
|----------|-----|----------|
| GA Measurement ID | H�ndelsedata | measurement_id |
| GA Measurement ID (x) | H�ndelsedata | x-ga-measurement_id |
| GA Measurement ID (tid) | H�ndelsedata | tid |

**Viktigt:** `tid` �r det enda f�ltet som alltid finns i ALLA GA4-requests (page_view, custom events, etc.). `measurement_id` och `x-ga-measurement_id` finns bara i vissa request-typer.

### Triggers

| Trigger | Status | Villkor |
|---------|--------|---------|
| **All Events** | ? Aktiv (p� GA4 - Forward All) | Inga villkor (f�ngar allt) |
| Flocken - GA4 Events | Kopplad till pausad tag | measurement_id AND x-ga-measurement_id AND tid = G-7B1SVKL89Q |
| N�sta Hem - GA4 Events | Kopplad till pausad tag | measurement_id AND x-ga-measurement_id AND tid = G-7N67P0KT0B |

---

## Historik

### Problem 1: Data hamnade i N�sta Hem (l�st jan 2025)
- "GA4 Configuration" (All Pages, N�sta Hem-ID) var aktiv i sGTM och tog alla events ? N�sta Hem fick Flocken-data
- Fix: Skapade brand-specifika triggers p� measurement_id/x-ga-measurement_id och pausade Configuration-taggen

### Problem 2: Flocken fick ingen data alls (l�st jan 2025)
- Brand-specifika triggers matchade inte events som hade measurement ID i `tid`-f�ltet ist�llet f�r `measurement_id`/`x-ga-measurement_id`
- Fix: Lade till `tid`-variabel och -villkor i triggers

### Problem 3: Custom events n�dde inte GA4 (l�st feb 2026)
- "GA4 - Forward All" hade "All Pages" trigger ? bara page_view vidarebefordrades
- Custom events (experiment_impression, cta_click, click) ignorerades
- Fix: Bytte trigger till "All Events"
- Se �ven: `FIX_CTA_CLICK_GTM.md` f�r fullst�ndig dokumentation

---

## Verifiering

### Fr�n webbl�sarens n�tverkspanel:
```javascript
performance.getEntriesByType('resource')
  .filter(r => r.name.includes('collect'))
  .map(r => ({
    event: r.name.match(/en=([^&]*)/)?.[1],
    tid: r.name.match(/tid=([^&]*)/)?.[1],
    dest: new URL(r.name).hostname
  }))
```

F�rv�ntat resultat:
```json
[
  {"event": "page_view", "tid": "G-7B1SVKL89Q", "dest": "gtm.nastahem.com"},
  {"event": "experiment_impression", "tid": "G-7B1SVKL89Q", "dest": "gtm.nastahem.com"}
]
```

### GA4 Realtime (Flocken):
- ? page_view
- ? experiment_impression
- ? cta_click (efter klick)
- ? click (efter klick)

### GA4 Realtime (N�sta Hem):
- Ska INTE visa flocken.info-trafik

---

## Om det slutar fungera igen

1. **Kolla server-containern (GTM-THB49L3K):**
   - �r "GA4 - Forward All" fortfarande aktiv?
   - Har den triggern "All Events"?
   - �r de tre andra taggarna pausade?

2. **Kolla webb-containern (GTM-PD5N4GT3):**
   - Finns "GA4 Event - Flocken Custom" med triggers f�r cta_click och experiment_impression?
   - Finns "GA4 - Click Tracking - Flocken" med trigger f�r l�nkklick?
   - Refererar de till "GA4 Configuration - Flocken" som m�tnings-id?

3. **Kolla n�tverket:**
   - Skickas requests till `gtm.nastahem.com/g/collect`?
   - Inneh�ller de `tid=G-7B1SVKL89Q`?

---

**Senast uppdaterad:** 2026-02-04
**Status:** ? L�ST ? Alla events n�r GA4 via "GA4 - Forward All" med "All Events" trigger
