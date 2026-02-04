# A/B Testing Guide

Flocken har ett inbyggt A/B-testverktyg för att testa olika varianter av innehåll på landningssidor.

## Snabbstart

### 1. Aktivera ett experiment

Öppna `lib/ab-testing/experiments.ts` och ändra `status` till `'running'`:

```typescript
'valkommen_hero_v1': {
  id: 'valkommen_hero_v1',
  name: 'Välkommen Hero Test',
  status: 'running', // ← Ändra från 'draft' till 'running'
  // ...
}
```

### 2. Testa lokalt

```bash
npm run dev
# Öppna http://localhost:3000/valkommen/ab-demo
```

Demo-sidan visar:
- Vilken variant du fått
- Alla varianter i experimentet
- Debug-info för tracking

### 3. Se statistik i GA4

1. Gå till GA4 → **Utforska** → **Skapa ny**
2. Lägg till dimension: `experiment_id`, `variant_id`
3. Lägg till mått: `Sessioner`, `Händelser`
4. Filtrera på `event_name = experiment_impression`

---

## Så fungerar det

### Teknisk arkitektur

```
┌─────────────────────────────────────────────────────────────┐
│  1. Middleware (server-side)                                │
│     - Kollar om användaren har en variant (cookie)          │
│     - Om nej: slumpar variant baserat på viktning           │
│     - Sparar i cookie (90 dagar)                            │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  2. ABTestProvider (client-side)                            │
│     - Läser cookie                                          │
│     - Gör variant tillgänglig via React hooks               │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  3. Komponenter                                             │
│     - useABContent() för att hämta innehåll                 │
│     - trackEvent() för att spåra klick                      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  4. Tracking                                                │
│     - Skickas till GA4 via gtag                             │
│     - Skickas till Meta Pixel via fbq                       │
│     - Skickas till GTM via dataLayer                        │
└─────────────────────────────────────────────────────────────┘
```

### Cookie-struktur

```json
{
  "valkommen_hero_v1": "variant_b",
  "another_experiment": "control"
}
```

Cookie-namn: `flocken_ab_assignments`
Livslängd: 90 dagar

---

## Skapa ett nytt experiment

### 1. Definiera experimentet

Lägg till i `lib/ab-testing/experiments.ts`:

```typescript
export const experiments: Record<string, Experiment> = {
  'mitt_experiment': {
    id: 'mitt_experiment',
    name: 'Beskrivande namn för GA4',
    description: 'Vad testar vi?',
    status: 'draft', // Starta med draft
    startDate: '2025-02-03',
    targetPages: ['/valkommen'], // Vilka sidor
    variants: [
      {
        id: 'control',
        weight: 50, // 50% av trafiken
        content: {
          rubrik: 'Kontrollvariant',
          bild: '/assets/bild-a.jpg',
        },
      },
      {
        id: 'variant_b',
        weight: 50, // 50% av trafiken
        content: {
          rubrik: 'Ny rubrik vi testar',
          bild: '/assets/bild-b.jpg',
        },
      },
    ],
  },
};
```

### 2. Använd i komponenten

```tsx
'use client';

import { useABContent } from '@/lib/ab-testing';
import { ExperimentTracker } from '@/components/ab-testing';

export default function MinSida() {
  // Hämta innehåll med fallback
  const rubrik = useABContent('mitt_experiment', 'rubrik', 'Default rubrik');
  const bild = useABContent('mitt_experiment', 'bild', '/default.jpg');

  return (
    <div>
      {/* Spåra att experimentet visades */}
      <ExperimentTracker experimentId="mitt_experiment" />

      <h1>{rubrik}</h1>
      <img src={bild} alt="" />
    </div>
  );
}
```

### 3. Spåra händelser

```tsx
import { useABTest } from '@/lib/ab-testing';

function CTAButton() {
  const abTest = useABTest('mitt_experiment');

  const handleClick = () => {
    // Spåra klick med experiment-kontext
    abTest?.trackEvent('cta_click', {
      button: 'hero_primary',
      destination: 'google_play',
    });
  };

  return <button onClick={handleClick}>Ladda ner</button>;
}
```

---

## Vad kan testas?

| Typ | Exempel |
|-----|---------|
| **Text** | Rubriker, underrubriker, CTA-text |
| **Bilder** | Hero-bild, screenshots, ikoner |
| **Layout** | Ordning på sektioner, antal kolumner |
| **Färger** | Knappfärger, bakgrunder |
| **Hela block** | Visa/dölja sektioner |

---

## Events som skickas

### experiment_impression
Skickas när en användare ser en variant.

```javascript
{
  event: 'experiment_impression',
  experiment_id: 'valkommen_hero_v1',
  experiment_name: 'Välkommen Hero Test',
  variant_id: 'variant_b'
}
```

### cta_click
Skickas när användaren klickar på en CTA.

```javascript
{
  event: 'cta_click',
  experiment_id: 'valkommen_hero_v1',
  variant_id: 'variant_b',
  cta_name: 'google_play',
  cta_destination: 'https://play.google.com/...'
}
```

---

## Bästa praxis

### 1. Testa en sak i taget
Ändra bara en variabel per experiment för att veta vad som gör skillnad.

### 2. Låt testet köra tillräckligt länge
Minst 1-2 veckor eller tills du har statistisk signifikans (>95% konfidensgrad).

### 3. Dokumentera hypotesen
Skriv ner vad du förväntar dig innan du startar testet.

### 4. Avsluta och implementera
När du har en vinnare, ändra `status` till `'completed'` och implementera den vinnande varianten permanent.

---

## Felsökning

### "Jag ser alltid samma variant"
- Det är korrekt! Cookien sparar din variant i 90 dagar.
- Rensa cookies för att få en ny variant.
- Eller öppna i inkognito-läge.

### "Experimentet visas inte"
1. Kontrollera att `status: 'running'`
2. Kontrollera att sidan finns i `targetPages`
3. Kolla browser console för fel

### "Tracking fungerar inte"
1. Öppna DevTools → Console
2. Leta efter `[AB Test]` loggar
3. Kontrollera att GA4/Meta Pixel är korrekt konfigurerade

---

## Filstruktur

```
lib/ab-testing/
├── index.ts          # Public API exports
├── types.ts          # TypeScript types
├── experiments.ts    # Experiment definitions ← EDIT THIS
├── utils.ts          # Helper functions
├── middleware.ts     # Server-side assignment
├── context.tsx       # React Provider & hooks
└── tracking.ts       # GA4/Meta integration

components/ab-testing/
├── index.ts
└── ExperimentTracker.tsx  # Auto-tracking component

middleware.ts         # Next.js middleware (root)

app/valkommen/ab-demo/
└── page.tsx          # Demo/test page
```

---

## MCP Server för statistik (Fas 2)

En MCP-server finns i `mcp-servers/ab-testing-stats/` som ger dig:

- Statistisk signifikansberäkning (z-test)
- Bayesian sannolikhetsanalys
- Hämta data direkt från BigQuery
- Fråga Claude: "Hur går experimentet?"

### Aktivera MCP-servern

1. **Bygg servern:**
   ```bash
   cd mcp-servers/ab-testing-stats
   npm install
   npm run build
   ```

2. **Lägg till i Claude Code-inställningar:**

   Kopiera innehållet från `mcp-servers/ab-testing-stats/claude-config-example.json`
   till din Claude Code MCP-konfiguration.

3. **Starta om Claude Code**

### Användning

När MCP:n är aktiverad kan du fråga:

```
Hur går A/B-testet valkommen_hero_v1?
```

```
Vilka experiment körs just nu?
```

```
Hur många besökare behövs för att testa 20% förbättring på 5% konvertering?
```

### Tillgängliga verktyg

| Verktyg | Beskrivning |
|---------|-------------|
| `get_experiment_stats` | Fullständig statistik med rekommendation |
| `list_experiments` | Lista alla aktiva experiment |
| `get_daily_breakdown` | Daglig data för trender |
| `calculate_sample_size` | Beräkna hur länge testet behöver köras |
| `compare_variants` | Manuell jämförelse utan BigQuery |
