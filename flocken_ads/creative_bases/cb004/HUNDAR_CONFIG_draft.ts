/**
 * HUNDAR_CONFIG — draft till components/v/VLandingConfig.ts
 *
 * Skapad: 2026-04-21 av kreativ-producent (CB004)
 * Uppdaterad: 2026-04-22 (v2) — se copy.md "Ändringar v2"
 * Status v2:
 *   - Hero-bild levererad: /assets/flocken/v-hundar/hero-clay-trehundar-21x9.jpg (2400×1029, 21:9)
 *   - Försvunnen-arg bild levererad: ska flyttas till /assets/flocken/v-hundar/flocken_arg3_forsvunnen_hand_4x5.jpg
 *     (original i /public/assets/flocken/v-hundar-mockup-selection/Generated Image April 21, 2026 - 11_36PM.jpg)
 *   - Arg1 + arg2 + closing = placeholder, väntar produktion
 *   - Recruit-sektion (kennel) BORTTAGEN enligt Torbjörns beslut 2026-04-22
 *
 * Till utvecklingsrådgivare:
 *   1. Kopiera hela konstanten nedan in i components/v/VLandingConfig.ts efter PASSA_CONFIG.
 *   2. Hero-bildvägen är redan riktig. Övriga imageSrc är TODO tills bilder produceras.
 *   3. Försvunnen-bildvägen antar att filen flyttas/döps om. Koordinera med PL innan implementation.
 *   4. Skapa route app/v/hundar/page.tsx som renderar <VLandingPage config={HUNDAR_CONFIG} />.
 *
 * Bildspec: se IMAGE_SPEC.md v2 i samma mapp.
 */

import type { VLandingConfig } from '@/components/v/VLandingConfig';

// ---------------------------------------------------------------------------
// Hundar — CB004 v2 (draft)
// ---------------------------------------------------------------------------

export const HUNDAR_CONFIG: VLandingConfig = {
  hook: 'hundar',
  experimentId: 'CB004',

  // Hero
  heroTitle: 'Hunden behöver mer än dig',
  heroSubtitle:
    'Du är hundens värld. Men den mår bättre med fler i den.',
  heroImageSrc: '/assets/flocken/v-hundar/hero-clay-trehundar-21x9.jpg',
  heroImageAlt:
    'Clay-illustration av tre hundar (pudel, cocker spaniel och maltese) som står tillsammans på en gräsplätt med staket och förortshus i bakgrunden',
  heroPillText: undefined,
  heroSocialProof:
    '2 000+ hundägare i Sverige använder Flocken-appen. Finns på App Store och Google Play.',

  // Trust strip (uppdaterad v2 — kennel-trust utbytt mot närhet/karta)
  trustSignals: [
    {
      icon: 'user-circle',
      text: 'Filter på storlek, ras och temperament',
    },
    {
      icon: 'gift',
      text: 'Hundar nära dig, visas på kartan',
    },
    {
      icon: 'message-circle',
      text: 'Realtidslarm om hunden springer bort',
    },
  ],

  // Tre argument (arg 2 bytt från kennel till närhet, arg 3 omskriven)
  arguments: [
    {
      title: 'En kompis som matchar',
      body: 'Små hundar leker hårt när de är rätt matchade. Stora blir försiktiga när de är det. I Flocken-appen väljer du bort felmatchningarna innan ni träffas, så slipper leken bli för intensiv.',
      imageStyle: 'photo',
      imageSrc: '/assets/flocken/v-hundar/arg1-hand-lekkompis-filter.jpg', // TODO: bild från Torbjörn — hand som håller telefon med Flocken filter-vy (storlek/ras)
      imageAlt:
        'Hand som håller en telefon med Flockens filter-vy för lekkompisar — storlek, ras och temperament',
    },
    {
      title: 'Hundar som bor i närheten',
      body: 'I Flocken-appen ser du vilka hundar som finns nära dig, på kartan. Profil, bild, storlek, ras. Du väljer själv vem du vill ses med. Ingen grupptråd, ingen tagg, ingen algoritm som bestämmer åt dig.',
      imageStyle: 'photo',
      imageSrc: '/assets/flocken/v-hundar/arg2-hand-karta-hundar.jpg', // TODO: bild från Torbjörn — hand som håller telefon med kartvy över hundar nära
      imageAlt:
        'Hand som håller en telefon med Flockens kartvy — hundar i närheten visas som markörer',
    },
    {
      title: 'Om något händer finns grannarna där',
      body: 'Om hunden springer iväg får hundägare i närheten en push-notis direkt. Inte ett inlägg som kanske dyker upp i flödet några timmar senare. Gemenskapen du bygger i vardagen är den du behöver när det gäller.',
      imageStyle: 'photo',
      imageSrc: '/assets/flocken/v-hundar/flocken_arg3_forsvunnen_hand_4x5.jpg', // LEVERERAD (v2): flytta från /v-hundar-mockup-selection/Generated Image April 21, 2026 - 11_36PM.jpg
      imageAlt:
        'Clay-illustration av hand som håller mobil med Flockens larmvy — karta, varningstriangel, nattstämning',
    },
  ],

  argumentBackgrounds: ['bg-flocken-cream', 'bg-white', 'bg-flocken-sand'],

  // Social proof
  socialProofLabel: 'Så pratar hundägare om hundlivet',
  socialProofQuotes: [
    {
      // VoC: Flocken-användare, research-syntes §3 citat #1
      quote:
        'Flocken är navet i mitt hundliv numera. Mycket smidigare än grupper i sociala medier.',
      name: 'Hundägare',
      city: 'Sverige',
    },
    {
      // VoC: Glanna.se blogg 2025, research-syntes §3 citat #6 — omformulerad lätt
      quote:
        'Vi vill så gärna att hunden ska ha kompisar, men hundar blir inte vänner bara för att vi ägare vill det.',
      name: 'Hundägare',
      city: 'Sverige',
    },
    {
      // VoC: Rackarungarnas hundskola dec 2014, research-syntes §3 citat #5
      quote:
        'En stor och en liten hund som leker tillsammans — den stora kan råka göra illa den lilla bara på grund av ren klantighet och fler kilon.',
      name: 'Hundägare',
      city: 'Sverige',
    },
  ],

  // Recruit-sektion BORTTAGEN i v2 (Torbjörns beslut — kennlar mejlas direkt)
  // recruitHeadline, recruitBody, recruitCtaLabel lämnas odefinierade (optional i interface)

  // Closing CTA
  closingHeadline: 'Ett ställe för allt som rör hunden',
  closingBody:
    'Ladda ner Flocken-appen. Hitta lekkompisar, hundar i närheten och grannar som finns där när det gäller.',
  closingImageSrc: '/assets/flocken/v-hundar/closing-clay-hund-nara.jpg', // TODO: bild från Torbjörn — clay-illustration hund + ägare nära-stämning
  closingImageAlt:
    'Clay-illustration av en hund som ligger tryggt bredvid ägarens fötter — hemmiljö, gröna växter',

  ctaLabel: 'Ladda ner Flocken',
  closingSubtext: 'Gratis att ladda ner. Finns på App Store och Google Play.',

  // Metadata
  pageTitle: 'Lekkompisar och hundar nära dig | Flocken',
  pageDescription:
    'Hitta lekkompisar till hunden, hundar i närheten och grannar som finns där om något händer. Ladda ner Flocken-appen gratis — App Store och Google Play.',
};
