// A/B Test Experiments Configuration
// Add your experiments here

import { Experiment } from './types';

export const experiments: Record<string, Experiment> = {
  // Example experiment for /valkommen page
  'valkommen_hero_v1': {
    id: 'valkommen_hero_v1',
    name: 'Välkommen Hero Test',
    description: 'Testar olika budskap i hero-sektionen på landningssidan',
    status: 'running', // Change to 'running' to activate
    startDate: '2025-02-03',
    targetPages: ['/valkommen'],
    variants: [
      {
        id: 'control',
        weight: 50,
        content: {
          heroTitle: 'Ett enklare liv som hundägare',
          heroTagline: '– ladda ner Flocken',
          heroSubtitle: 'Underlätta vardagen som hundägare med funktionerna Para, Passa, Rasta och Besöka.',
          heroImage: '/assets/flocken/generated/flocken_image_malua-arlo-coco-jumping-dog-park_1x1.jpeg',
          ctaPrimaryText: 'Ladda ner på Google Play',
          ctaSecondaryText: 'Ladda ner på AppStore',
        },
      },
      {
        id: 'variant_b',
        weight: 50,
        content: {
          heroTitle: 'Hitta lekkamrater till din hund',
          heroTagline: '– på några sekunder',
          heroSubtitle: 'Flocken samlar Sveriges hundägare. Para, Passa, Rasta och Besöka – allt på ett ställe.',
          heroImage: '/assets/flocken/generated/flocken_image_malua-arlo-coco-jumping-dog-park_1x1.jpeg',
          ctaPrimaryText: 'Ladda ner gratis',
          ctaSecondaryText: 'Finns på AppStore',
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
