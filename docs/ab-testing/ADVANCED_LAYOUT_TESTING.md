# Avancerad Layout-testning med A/B-verktyget

Detta dokument visar hur du kan testa mer än bara text - du kan testa olika layouts, bilder, komponenter och struktur.

## Vad kan testas?

- ✅ **Text** (rubriker, underrubriker, CTA-text)
- ✅ **Bilder** (olika hero-bilder)
- ✅ **Layout** (bild vänster/höger, centrerad vs vänsterjusterad)
- ✅ **Bakgrundsfärger** (gradient, vit, sand, oliv)
- ✅ **Komponent-struktur** (helt olika hero-komponenter)
- ✅ **Ordning på element** (bild först, text först)

## Exempel: Utökad experiment-struktur

I `lib/ab-testing/experiments.ts` kan du lägga till följande fält:

```typescript
variants: [
  {
    id: 'control',
    weight: 50,
    content: {
      // Text content
      heroTitle: 'Ett enklare liv som hundägare',
      heroTagline: '– ladda ner Flocken',
      heroSubtitle: 'Underlätta vardagen...',
      ctaPrimaryText: 'Ladda ner på Google Play',
      ctaSecondaryText: 'Ladda ner på AppStore',
      
      // Visual content
      heroImage: '/assets/flocken/generated/flocken_image_xxx.jpeg',
      
      // Layout options
      layout: 'standard', // 'standard' | 'centered' | 'image-left' | 'image-right'
      alignLeft: true,
      backgroundColor: 'gradient-cream', // 'gradient-cream' | 'white' | 'sand' | 'olive'
      
      // Additional content
      launchInfo: 'Nu samlar vi Sveriges alla hundägare...',
      launchOffer: 'Appen är alltid gratis...',
      
      // Component structure (för att testa helt olika layouts)
      heroStructure: 'default', // 'default' | 'minimal' | 'feature-focused'
    },
  },
  {
    id: 'variant_b',
    weight: 50,
    content: {
      // Testa annan layout
      layout: 'centered',
      alignLeft: false,
      backgroundColor: 'white',
      heroStructure: 'minimal',
      // ... resten av innehållet
    },
  },
]
```

## Så här använder du det i komponenten

### Metod 1: Använd `useABContent` för varje fält

```tsx
'use client';

import { useABContent, ExperimentTracker } from '@/lib/ab-testing';
import { HeroBlock } from '@/components/marketing/HeroBlock';

export default function ValkommenPage() {
  const experimentId = 'valkommen_hero_v1';
  
  // Hämta alla fält från experimentet
  const heroTitle = useABContent(experimentId, 'heroTitle', 'Ett enklare liv som hundägare');
  const heroTagline = useABContent(experimentId, 'heroTagline', '– ladda ner Flocken');
  const heroSubtitle = useABContent(experimentId, 'heroSubtitle', 'Underlätta vardagen...');
  const heroImage = useABContent(experimentId, 'heroImage', '/assets/flocken/generated/default.jpeg');
  const layout = useABContent(experimentId, 'layout', 'standard');
  const alignLeft = useABContent(experimentId, 'alignLeft', true);
  const backgroundColor = useABContent(experimentId, 'backgroundColor', 'gradient-cream');
  const launchInfo = useABContent(experimentId, 'launchInfo', '');
  const launchOffer = useABContent(experimentId, 'launchOffer', '');
  
  // Bestäm bakgrundsfärg baserat på variant
  const bgClass = {
    'gradient-cream': 'bg-gradient-to-br from-white to-flocken-cream',
    'white': 'bg-white',
    'sand': 'bg-flocken-sand',
    'olive': 'bg-flocken-olive',
  }[backgroundColor] || 'bg-gradient-to-br from-white to-flocken-cream';

  return (
    <>
      {/* Spåra experiment-visning */}
      <ExperimentTracker experimentId={experimentId} />
      
      {/* Hero med dynamisk layout */}
      <HeroBlock
        title={heroTitle}
        tagline={heroTagline}
        subtitle={heroSubtitle}
        image={heroImage}
        alignLeft={alignLeft}
        launchInfo={launchInfo}
        launchOffer={launchOffer}
        ctaPrimary={{ 
          text: useABContent(experimentId, 'ctaPrimaryText', 'Ladda ner på Google Play'),
          href: "https://play.google.com/store/apps/details?id=com.bastavan.app"
        }}
        ctaSecondary={{ 
          text: useABContent(experimentId, 'ctaSecondaryText', 'Ladda ner på AppStore'),
          href: "https://apps.apple.com/app/flocken/id6755424578"
        }}
      />
      
      {/* Resten av sidan */}
    </>
  );
}
```

### Metod 2: Conditional rendering för helt olika komponenter

Om du vill testa **helt olika hero-komponenter** (t.ex. minimal vs feature-focused):

```tsx
'use client';

import { useABContent, useABTest, ExperimentTracker } from '@/lib/ab-testing';
import { HeroBlock } from '@/components/marketing/HeroBlock';
import { MinimalHero } from '@/components/marketing/MinimalHero'; // Hypotetisk komponent
import { FeatureFocusedHero } from '@/components/marketing/FeatureFocusedHero'; // Hypotetisk komponent

export default function ValkommenPage() {
  const experimentId = 'valkommen_hero_v1';
  const abTest = useABTest(experimentId);
  const heroStructure = useABContent(experimentId, 'heroStructure', 'default');

  return (
    <>
      <ExperimentTracker experimentId={experimentId} />
      
      {/* Välj komponent baserat på variant */}
      {heroStructure === 'minimal' && (
        <MinimalHero
          title={useABContent(experimentId, 'heroTitle', 'Default')}
          // ... andra props
        />
      )}
      
      {heroStructure === 'feature-focused' && (
        <FeatureFocusedHero
          title={useABContent(experimentId, 'heroTitle', 'Default')}
          // ... andra props
        />
      )}
      
      {heroStructure === 'default' && (
        <HeroBlock
          title={useABContent(experimentId, 'heroTitle', 'Default')}
          // ... andra props
        />
      )}
      
      {/* Resten av sidan */}
    </>
  );
}
```

### Metod 3: Modifiera HeroBlock för att stödja layout-variabler

Du kan också modifiera `HeroBlock` direkt för att stödja layout-variabler:

```tsx
// components/marketing/HeroBlock.tsx
'use client';

interface HeroBlockProps {
  title: string;
  tagline: string;
  subtitle: string;
  image: string;
  layout?: 'standard' | 'centered' | 'image-left' | 'image-right';
  backgroundColor?: 'gradient-cream' | 'white' | 'sand' | 'olive';
  // ... andra props
}

export function HeroBlock({ 
  title, 
  tagline, 
  subtitle, 
  image,
  layout = 'standard',
  backgroundColor = 'gradient-cream',
  // ... andra props
}: HeroBlockProps) {
  const bgClass = {
    'gradient-cream': 'bg-gradient-to-br from-white to-flocken-cream',
    'white': 'bg-white',
    'sand': 'bg-flocken-sand',
    'olive': 'bg-flocken-olive',
  }[backgroundColor];

  const imageOrder = layout === 'image-left' ? 'order-1' : 'order-2';
  const textOrder = layout === 'image-left' ? 'order-2' : 'order-1';
  const isCentered = layout === 'centered';

  return (
    <section className={`relative min-h-screen flex items-center ${bgClass} pt-20 lg:pt-8`}>
      <div className="container-custom py-10 lg:py-6">
        <div className={`grid lg:grid-cols-2 gap-12 items-center ${isCentered ? 'text-center' : ''}`}>
          {/* Text - dynamisk ordning */}
          <div className={`space-y-8 ${textOrder} ${isCentered ? 'col-span-2' : ''}`}>
            {/* ... text-innehåll ... */}
          </div>

          {/* Bild - dynamisk ordning */}
          {!isCentered && (
            <div className={`relative h-[400px] lg:h-[600px] rounded-3xl overflow-hidden shadow-elevated ${imageOrder}`}>
              <Image src={image} alt="Flocken app hero" fill className="object-cover" priority />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
```

## Exempel: Testa olika bilder

```typescript
variants: [
  {
    id: 'control',
    content: {
      heroImage: '/assets/flocken/generated/flocken_image_dogs_playing_1x1.jpeg',
      // ...
    },
  },
  {
    id: 'variant_b',
    content: {
      heroImage: '/assets/flocken/generated/flocken_image_dog_walk_1x1.jpeg', // Annan bild
      // ...
    },
  },
]
```

## Exempel: Testa olika bakgrundsfärger

```typescript
variants: [
  {
    id: 'control',
    content: {
      backgroundColor: 'gradient-cream', // Nuvarande
      // ...
    },
  },
  {
    id: 'variant_b',
    content: {
      backgroundColor: 'white', // Testa vit bakgrund
      // ...
    },
  },
]
```

## Exempel: Testa olika layouts

```typescript
variants: [
  {
    id: 'control',
    content: {
      layout: 'standard', // Bild höger, text vänster
      alignLeft: true,
      // ...
    },
  },
  {
    id: 'variant_b',
    content: {
      layout: 'centered', // Centrerad layout, ingen bild
      alignLeft: false,
      // ...
    },
  },
  {
    id: 'variant_c',
    content: {
      layout: 'image-left', // Bild vänster, text höger
      alignLeft: false,
      // ...
    },
  },
]
```

## Tips

1. **Testa en sak i taget**: Ändra bara en variabel per experiment för att veta vad som gör skillnad.
2. **Dokumentera hypotesen**: Skriv ner vad du förväntar dig innan du startar testet.
3. **Använd fallback-värden**: Alltid ha fallback-värden i `useABContent()` för säkerhet.
4. **Testa lokalt först**: Verifiera att layout-variablerna fungerar på `/valkommen/ab-demo` innan du deployar.

## Nästa steg

När du är redo att koppla in på riktiga `/valkommen`-sidan, se:
- [`README.md`](./README.md) - Grundläggande guide
- [`../development/`](../development/) - Utvecklingsdokumentation
