// A/B Testing Utility Functions

import { Experiment, Variant } from './types';

// Cookie name for storing experiment assignments
export const AB_COOKIE_NAME = 'flocken_ab_assignments';

// Generate a unique visitor ID
export function generateVisitorId(): string {
  return `v_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

// Select a variant based on weights (weighted random selection)
export function selectVariant(variants: Variant[]): Variant {
  const totalWeight = variants.reduce((sum, v) => sum + v.weight, 0);
  let random = Math.random() * totalWeight;

  for (const variant of variants) {
    random -= variant.weight;
    if (random <= 0) {
      return variant;
    }
  }

  // Fallback to first variant
  return variants[0];
}

// Parse assignments from cookie string
export function parseAssignments(cookieValue: string): Record<string, string> {
  try {
    return JSON.parse(cookieValue);
  } catch {
    return {};
  }
}

// Serialize assignments to cookie string
export function serializeAssignments(assignments: Record<string, string>): string {
  return JSON.stringify(assignments);
}

// Get variant for an experiment (from existing assignment or select new)
export function getOrAssignVariant(
  experiment: Experiment,
  existingAssignments: Record<string, string>
): { variant: Variant; isNew: boolean } {
  const existingVariantId = existingAssignments[experiment.id];

  if (existingVariantId) {
    const existingVariant = experiment.variants.find((v) => v.id === existingVariantId);
    if (existingVariant) {
      return { variant: existingVariant, isNew: false };
    }
  }

  // Select new variant
  const variant = selectVariant(experiment.variants);
  return { variant, isNew: true };
}

// Get content value from variant with type safety
export function getVariantContent<T>(variant: Variant, key: string, defaultValue: T): T {
  const value = variant.content[key];
  return value !== undefined ? (value as T) : defaultValue;
}

// Check if experiment is currently active
export function isExperimentActive(experiment: Experiment): boolean {
  if (experiment.status !== 'running') {
    return false;
  }

  const now = new Date();

  if (experiment.startDate && new Date(experiment.startDate) > now) {
    return false;
  }

  if (experiment.endDate && new Date(experiment.endDate) < now) {
    return false;
  }

  return true;
}
