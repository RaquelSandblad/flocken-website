// A/B Test Experiments Configuration
// Add your experiments here

import { Experiment } from './types';

export const experiments: Record<string, Experiment> = {
  // Example experiment for /valkommen page
  'valkommen_hero_v1': {
    id: 'valkommen_hero_v1',
    name: 'Välkommen Hero Test - Problem/Solution Focus',
    description: 'Testar problem-focused headline med tydligare värdeproposition',
    status: 'running',
    startDate: '2025-02-13',
    targetPages: ['/valkommen'],
    variants: [
      {
        id: 'control',
        weight: 50,
        content: {
          // Text content
          heroTitle: 'Ett enklare liv som hundägare',
          heroTagline: '– ladda ner Flocken',
          heroSubtitle: 'Underlätta vardagen som hundägare med funktionerna Para, Passa, Rasta och Besöka.',
          ctaPrimaryText: 'Ladda ner på Google Play',
          ctaSecondaryText: 'Ladda ner på AppStore',

          // Visual content
          heroImage: '/assets/flocken/generated/flocken_image_malua-arlo-coco-jumping-dog-park_1x1.jpeg',

          // Layout options
          layout: 'standard',
          alignLeft: true,
          backgroundColor: 'gradient-cream',

          // Additional content
          launchInfo: 'Nu samlar vi Sveriges alla hundägare i Flocken. Skapa ett konto och lägg upp din hund.',
          launchOffer: 'Appen är alltid gratis.\nTesta premiumfunktioner gratis i 6 månader, gäller till den 31 mars.',

          heroStructure: 'default',
        },
      },
      {
        id: 'variant_c',
        weight: 50,
        content: {
          // NEW VARIANT C: Problem/Solution Split Screen
          heroStructure: 'variant_c',

          // Headline (problem-focused, specific, relatable)
          heroTitle: 'Slipp röriga Facebook-grupper för hundägare',
          heroSubtitle: 'Hitta hundvakt, lekkompisar och hundvänliga ställen – allt i Flocken-appen',

          // CTA (tydligt vilken butik)
          ctaPrimaryText: 'Ladda ner på Google Play',
          ctaSecondaryText: 'Ladda ner på AppStore',

          // Social proof (offer hard-coded as "📦 Appen är gratis" in component)
          socialProof: '286 hundägare har redan gått med',

          // Visual
          heroImage: '/assets/flocken/generated/flocken_image_malua-arlo-coco-jumping-dog-park_1x1.jpeg',
        },
      },
    ],
  },

  // Quiz App CTA A/B test – 4 varianter på quiz-resultatsidan
  //
  // OBS: Det här experimentet använder INTE middleware/cookie-assignment.
  // Variant-tilldelning sker client-side via localStorage i AppCtaModule.tsx
  // (quiz.flocken.info rewrites kringgår AB-middleware).
  //
  // Tracking skickas till GTM dataLayer via quiz track():
  //   quiz_app_cta_view  { experiment_id, variant, quiz_slug }
  //   quiz_app_cta_click { experiment_id, variant, quiz_slug }
  //
  // Definitionen finns här för dokumentation och ev. framtida MCP-analys.
  'quiz_app_cta_v1': {
    id: 'quiz_app_cta_v1',
    name: 'Quiz App CTA – Karta/Match/Hundvakt',
    description: 'Testar tre app-CTA-varianter med hand-mockup-bilder. Variant D (Platser) borttagen 2026-04-14. Client-side assignment via localStorage.',
    status: 'running',
    startDate: '2026-03-18',
    targetPages: [],
    variants: [
      {
        id: 'A',
        weight: 33,
        content: {
          headline: 'Se hundar på kartan i din stad',
          body: 'Scrolla bland hundar – lägg upp din egen på några minuter',
          imageSrc: '/assets/flocken/quiz-cta/hand-final-karta.png',
          imageAlt: 'Hand som håller telefon med Flockens karta',
        },
      },
      {
        id: 'B',
        weight: 34,
        content: {
          headline: 'Hitta hundar som matchar din',
          body: 'Se personlighet och bilder – hitta rätt match direkt',
          imageSrc: '/assets/flocken/quiz-cta/hand-final-match.png',
          imageAlt: 'Hand som håller telefon med hundprofiler i Flocken',
        },
      },
      {
        id: 'C',
        weight: 33,
        content: {
          headline: 'Hitta hundvakt som passar dig',
          body: 'Se hundvakter nära dig – nya varje dag',
          imageSrc: '/assets/flocken/quiz-cta/hand-final-hundvakt.png',
          imageAlt: 'Hand som håller telefon med hundvaktsprofil i Flocken',
        },
      },
    ],
  },

  // Add more experiments here as needed
  // 'experiment_id': { ... }
};

// Get experiment by ID
export function getExperiment(experimentId: string): Experiment | undefined {
  return experiments[experimentId];
}

// Get active experiments for a specific page
export function getActiveExperimentsForPage(pathname: string): Experiment[] {
  return Object.values(experiments).filter(
    (exp) => exp.status === 'running' && exp.targetPages.includes(pathname)
  );
}

// Get all running experiments
export function getRunningExperiments(): Experiment[] {
  return Object.values(experiments).filter((exp) => exp.status === 'running');
}
