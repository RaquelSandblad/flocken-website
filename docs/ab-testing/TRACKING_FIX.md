# A/B Test Tracking Fix

**Datum:** 2026-02-09  
**Problem:** Inga `experiment_impression` eller `cta_click` events registreras i GA4

## Problem

CTA-knapparna i HeroBlock-komponenterna spårade endast `trackAppInstall` utan experiment-kontext, vilket betyder att:
- ❌ `experiment_impression` skickades (via ExperimentTracker)
- ❌ `cta_click` skickades INTE med experiment-kontext

## Lösning

Uppdaterade båda HeroBlock-komponenterna för att spåra CTA-klick med experiment-kontext:

### HeroBlock.tsx
- ✅ Importerar `useABTest`, `trackExperimentCTAClick`, `getExperiment`
- ✅ Skapar `handleCTAClick` som spårar både app install OCH experiment CTA click
- ✅ Uppdaterar både primary och secondary CTA onClick handlers

### HeroBlockVariantB.tsx
- ✅ Importerar `useABTest`, `trackExperimentCTAClick`, `getExperiment`
- ✅ Skapar `handleCTAClick` för att spåra experiment CTA clicks
- ✅ Uppdaterar både "Ladda ner appen" och "Så fungerar appen" länkar

## Events som nu skickas

### experiment_impression
Skickas när sidan laddas (via `ExperimentTracker`):
```javascript
{
  event: 'experiment_impression',
  experiment_id: 'valkommen_hero_v1',
  experiment_name: 'Välkommen Hero Test',
  variant_id: 'control' | 'variant_b'
}
```

### cta_click
Skickas när användare klickar på CTA-knappar:
```javascript
{
  event: 'cta_click',
  experiment_id: 'valkommen_hero_v1',
  experiment_name: 'Välkommen Hero Test',
  variant_id: 'control' | 'variant_b',
  cta_name: 'hero_primary' | 'hero_secondary',
  cta_destination: '/download' | '/funktioner' | 'https://...'
}
```

## Verifiering

### 1. Testa lokalt
```bash
npm run dev
# Öppna http://localhost:3000/valkommen
```

### 2. Kontrollera i Browser Console
Öppna DevTools → Console och leta efter:
- `[AB Test] Experiment impression tracked:`
- `[AB Test] CTA click tracked:`

### 3. Kontrollera Network Tab
- Leta efter GA4-anrop (`www.google-analytics.com/g/collect`)
- Leta efter Meta Pixel-anrop (`facebook.com/tr`)
- Verifiera att events skickas med korrekt data

### 4. Kontrollera GA4 (efter 24-48 timmar)
1. Gå till GA4 → Events
2. Sök efter `experiment_impression` och `cta_click`
3. Verifiera att events har `experiment_id` och `variant_id` parametrar

### 5. Kontrollera BigQuery (efter synkning)
```bash
node scripts/bq-ab-test-stats.js valkommen_hero_v1
```

## Nästa steg

1. ✅ Deploy ändringarna till produktion
2. ⏳ Vänta 24-48 timmar för data att synkas till BigQuery
3. ⏳ Kör statistik-scriptet igen för att se resultat
4. ⏳ Analysera vilken variant som presterar bäst

## Filer ändrade

- `components/marketing/HeroBlock.tsx`
- `components/marketing/HeroBlockVariantB.tsx`
- `components/ab-testing/ExperimentTracker.tsx` (import fix)
