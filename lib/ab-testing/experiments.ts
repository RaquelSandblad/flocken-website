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
          // Text content
          heroTitle: 'Ett enklare liv som hundägare',
          heroTagline: '– ladda ner Flocken',
          heroSubtitle: 'Underlätta vardagen som hundägare med funktionerna Para, Passa, Rasta och Besöka.',
          ctaPrimaryText: 'Ladda ner på Google Play',
          ctaSecondaryText: 'Ladda ner på AppStore',
          
          // Visual content
          heroImage: '/assets/flocken/generated/flocken_image_malua-arlo-coco-jumping-dog-park_1x1.jpeg',
          
          // Layout options
          layout: 'standard', // 'standard' | 'centered' | 'image-left' | 'image-right'
          alignLeft: true,
          backgroundColor: 'gradient-cream', // 'gradient-cream' | 'white' | 'sand' | 'olive'
          
          // Additional content
          launchInfo: 'Nu samlar vi Sveriges alla hundägare i Flocken. Skapa ett konto och lägg upp din hund.',
          launchOffer: 'Appen är alltid gratis.\nTesta premiumfunktioner gratis i 6 månader, gäller till den 28 februari.',
          
          // Component structure (optional - för att testa helt olika layouts)
          heroStructure: 'default', // 'default' | 'minimal' | 'feature-focused'
        },
      },
      {
        id: 'variant_b',
        weight: 50,
        content: {
          // Variant B uses different component structure
          heroStructure: 'variant_b', // Special structure for variant B
          
          // Hero images
          heroImage: '/assets/flocken/generated/flocken_screen_varb_hero.jpeg',
          
          // How it works images
          howItWorksImage1: '/assets/flocken/generated/flocken_screen_varb_1.jpeg',
          howItWorksImage2: '/assets/flocken/generated/flocken_screen_varb_2.jpeg',
          howItWorksImage3: '/assets/flocken/generated/flocken_screen_varb_3.jpeg',
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
