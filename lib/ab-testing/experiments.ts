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
          launchOffer: 'Appen är alltid gratis.\nTesta premiumfunktioner gratis i 6 månader, gäller till den 28 februari.',

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
          heroSubtitle: 'Hitta hundvakt, lekkompisar och hundvänliga ställen – allt i en app',

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
