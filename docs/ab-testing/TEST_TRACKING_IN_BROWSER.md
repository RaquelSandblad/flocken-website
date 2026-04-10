# Testa A/B Test Tracking i Webbläsare

**Datum:** 2026-02-09  
**Syfte:** Verifiera att `experiment_impression` och `cta_click` events skickas korrekt

## Steg-för-steg Guide

### 1. Öppna sidan

**Lokalt (dev-server):**
```bash
npm run dev
# Öppna http://localhost:3000/valkommen
```

**Produktion:**
```
https://flocken.info/valkommen
```

### 2. Öppna DevTools

- **Chrome/Edge:** `F12` eller `Ctrl+Shift+I`
- **Firefox:** `F12` eller `Ctrl+Shift+I`
- **Safari:** `Cmd+Option+I` (måste aktivera Developer Menu först)

### 3. Acceptera Cookies

**Viktigt:** Events skickas endast om användare accepterar analytics cookies!

1. Klicka på cookie-bannern
2. Acceptera **Analytics cookies** (minst)
3. Klicka "Spara"

### 4. Kontrollera Console

I **Console**-fliken, leta efter:

```
[AB Test] Experiment impression tracked: {experimentId: "valkommen_hero_v1", variantId: "control"}
```

Eller:

```
[AB Test] Experiment impression tracked: {experimentId: "valkommen_hero_v1", variantId: "variant_b"}
```

### 5. Klicka på CTA-knappar

Klicka på någon av CTA-knapparna:
- "Ladda ner appen" (variant B)
- "Ladda ner på Google Play" (variant A)
- "Ladda ner på AppStore" (variant A)

### 6. Kontrollera Console igen

Du bör se:

```
[AB Test] CTA click tracked: {
  experiment_id: "valkommen_hero_v1",
  variant_id: "control" | "variant_b",
  cta_name: "hero_primary" | "hero_secondary",
  cta_destination: "/download" | "https://..."
}
```

### 7. Kontrollera Network Tab

I **Network**-fliken:

1. Filtrera på: `google-analytics` eller `collect`
2. Leta efter requests till: `www.google-analytics.com/g/collect`
3. Klicka på en request
4. Gå till **Payload** eller **Request**-fliken
5. Leta efter:
   - `en=experiment_impression` eller `en=cta_click`
   - `ep.experiment_id=valkommen_hero_v1`
   - `ep.variant_id=control` eller `ep.variant_id=variant_b`

### 8. Kontrollera dataLayer

I **Console**, kör:

```javascript
// Se alla events i dataLayer
console.log(window.dataLayer);

// Filtrera på experiment events
window.dataLayer.filter(e => e.event === 'experiment_impression' || e.event === 'cta_click')
```

### 9. Kontrollera localStorage

```javascript
// Se cookie consent
JSON.parse(localStorage.getItem('cookie-consent'))

// Kontrollera att analytics är true
// Om false, kommer inga events skickas!
```

## Vanliga Problem

### ❌ Inga events i Console

**Möjliga orsaker:**
1. **Ingen analytics consent** - Kolla `localStorage.getItem('cookie-consent')`
2. **Experimentet är inte aktivt** - Kolla `lib/ab-testing/experiments.ts` (`status: 'running'`)
3. **JavaScript-fel** - Kolla Console för errors

### ❌ Events i Console men inte i Network

**Möjliga orsaker:**
1. **GTM blockerar events** - Kolla GTM Preview mode
2. **Ad blocker** - Inaktivera ad blocker temporärt
3. **GA4 inte konfigurerat** - Kolla att GTM har GA4-tag

### ❌ experiment_impression men inte cta_click

**Möjliga orsaker:**
1. **Klickade inte på knappen** - Testa igen
2. **JavaScript-fel i onClick** - Kolla Console för errors
3. **Experiment-kontext saknas** - Kolla att `useABTest` returnerar korrekt data

## Debug-kommandon

### Se vilken variant du har

```javascript
// I Console
document.cookie.split(';').find(c => c.includes('flocken_ab_assignments'))
```

### Tvinga en variant (för test)

```javascript
// Sätt variant manuellt
document.cookie = "flocken_ab_assignments={\"valkommen_hero_v1\":\"variant_b\"}; path=/; max-age=7776000";
location.reload();
```

### Se alla tracking events

```javascript
// Övervaka dataLayer
window.dataLayer = window.dataLayer || [];
const originalPush = window.dataLayer.push;
window.dataLayer.push = function(...args) {
  console.log('[dataLayer]', ...args);
  return originalPush.apply(this, args);
};
```

## Verifiering i GA4

Efter att ha testat i webbläsaren:

1. Vänta 24-48 timmar (för BigQuery export)
2. Gå till GA4 → Events
3. Sök efter `experiment_impression` och `cta_click`
4. Verifiera att events har `experiment_id` och `variant_id` parametrar

## Nästa steg

Om events skickas korrekt i webbläsaren men inte syns i GA4:
- Kolla GTM-konfiguration
- Verifiera att GA4-tag är aktiverad
- Kontrollera att custom events är konfigurerade i GA4
