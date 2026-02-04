// A/B Testing Tracking Integration
// Sends experiment events to GA4 and Meta Pixel

import { Experiment, Variant } from './types';

// Track when a user is assigned to a variant (experiment impression)
export function trackExperimentView(experiment: Experiment, variant: Variant): void {
  // GA4 via gtag
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'experiment_impression', {
      experiment_id: experiment.id,
      experiment_name: experiment.name,
      variant_id: variant.id,
      variant_name: variant.id,
    });

    // Also set user property for segmentation
    window.gtag('set', 'user_properties', {
      [`exp_${experiment.id}`]: variant.id,
    });
  }

  // Meta Pixel
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('trackCustom', 'ExperimentImpression', {
      experiment_id: experiment.id,
      experiment_name: experiment.name,
      variant_id: variant.id,
    });
  }

  // GTM dataLayer
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: 'experiment_impression',
      experiment_id: experiment.id,
      experiment_name: experiment.name,
      variant_id: variant.id,
    });
  }

  // Development logging
  if (process.env.NODE_ENV === 'development') {
    console.log('[AB Test] Experiment impression tracked:', {
      experimentId: experiment.id,
      variantId: variant.id,
    });
  }
}

// Track conversion events with experiment context
export function trackExperimentConversion(
  experiment: Experiment,
  variant: Variant,
  conversionType: string,
  value?: number,
  additionalData?: Record<string, unknown>
): void {
  const eventData = {
    experiment_id: experiment.id,
    experiment_name: experiment.name,
    variant_id: variant.id,
    conversion_type: conversionType,
    ...(value !== undefined && { value }),
    ...additionalData,
  };

  // GA4 via gtag
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'experiment_conversion', eventData);
  }

  // Meta Pixel
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('trackCustom', 'ExperimentConversion', eventData);
  }

  // GTM dataLayer
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: 'experiment_conversion',
      ...eventData,
    });
  }

  // Development logging
  if (process.env.NODE_ENV === 'development') {
    console.log('[AB Test] Conversion tracked:', eventData);
  }
}

// Track CTA clicks with experiment context
export function trackExperimentCTAClick(
  experiment: Experiment,
  variant: Variant,
  ctaName: string,
  ctaDestination?: string
): void {
  const eventData = {
    experiment_id: experiment.id,
    experiment_name: experiment.name,
    variant_id: variant.id,
    cta_name: ctaName,
    cta_destination: ctaDestination,
  };

  // GA4
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'cta_click', eventData);
  }

  // Meta Pixel
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('trackCustom', 'CTAClick', eventData);
  }

  // GTM dataLayer
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: 'cta_click',
      ...eventData,
    });
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('[AB Test] CTA click tracked:', eventData);
  }
}
