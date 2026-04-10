# A/B Test Tracking Issue Analysis

**Datum:** 2026-02-09  
**Problem:** Inga knappklick registreras i GA4 på landingssidan

## Problem

### 1. Consent-krav blockerar events
`trackAppInstall` kräver `hasAnalyticsConsent()` för att skicka events till GA4:
```typescript
if (window.dataLayer && hasAnalyticsConsent()) {
  window.dataLayer.push({
    event: 'app_install',
    // ...
  });
}
```

**Konsekvens:** Om användare inte accepterar analytics cookies skickas inga events.

### 2. Event-namn matchar inte A/B-test
- `trackAppInstall` skickar `app_install` event
- A/B-testet letar efter `cta_click` event
- Dessa är olika events och kan inte jämföras direkt

### 3. Ingen experiment-kontext
Tidigare spårades CTA-klick utan experiment-kontext (`experiment_id`, `variant_id`), vilket gör det omöjligt att jämföra varianter.

## Lösning implementerad

### ✅ Experiment-kontext tillagd
- `HeroBlock.tsx` och `HeroBlockVariantB.tsx` spårar nu `cta_click` med experiment-kontext
- Events inkluderar `experiment_id` och `variant_id`

### ⚠️ Consent-problem kvarstår
Events skickas fortfarande endast om användare accepterar analytics cookies.

## Rekommendationer

### 1. Verifiera consent-rate
Kontrollera hur många användare som accepterar analytics cookies:
```javascript
// I browser console
JSON.parse(localStorage.getItem('cookie-consent'))
```

### 2. Överväg server-side tracking
För A/B-test kan vi spåra clicks server-side (utan consent-krav):
- Skicka click events till `/api/track` endpoint
- Spara i databas eller skicka direkt till BigQuery
- Inkludera experiment-kontext

### 3. Debugging i produktion
Lägg till logging för att se om events faktiskt skickas:
```typescript
if (window.dataLayer && hasAnalyticsConsent()) {
  window.dataLayer.push({...});
  console.log('[Tracking] Event sent:', eventName);
} else {
  console.warn('[Tracking] Event blocked - no analytics consent');
}
```

### 4. Testa lokalt
1. Öppna `/valkommen` i inkognito-läge
2. Acceptera analytics cookies
3. Klicka på CTA-knappar
4. Kontrollera Network tab för GA4-anrop
5. Kontrollera Console för `[AB Test]` loggar

## Nästa steg

1. ✅ Deploy tracking-fix (experiment-kontext)
2. ⏳ Vänta 24-48 timmar för data
3. ⏳ Analysera consent-rate i GA4
4. ⏳ Överväg server-side tracking om consent-rate är låg
