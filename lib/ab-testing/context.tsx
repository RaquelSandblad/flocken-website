'use client';

// A/B Testing React Context and Hook
// Provides experiment data to components

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { Experiment, Variant, ABTestContext } from './types';
import { getExperiment } from './experiments';
import { AB_COOKIE_NAME, parseAssignments, getVariantContent } from './utils';

interface ABTestProviderProps {
  children: ReactNode;
}

interface ABTestContextValue {
  getVariant: (experimentId: string) => Variant | null;
  getContent: <T>(experimentId: string, key: string, defaultValue: T) => T;
  trackExperimentEvent: (experimentId: string, eventName: string, eventData?: Record<string, unknown>) => void;
  isLoaded: boolean;
}

const ABTestReactContext = createContext<ABTestContextValue | null>(null);

export function ABTestProvider({ children }: ABTestProviderProps) {
  const [assignments, setAssignments] = useState<Record<string, string>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Load assignments from cookie on mount
  useEffect(() => {
    const cookieValue = document.cookie
      .split('; ')
      .find((row) => row.startsWith(`${AB_COOKIE_NAME}=`))
      ?.split('=')[1];

    if (cookieValue) {
      try {
        const decoded = decodeURIComponent(cookieValue);
        setAssignments(parseAssignments(decoded));
      } catch {
        setAssignments({});
      }
    }
    setIsLoaded(true);
  }, []);

  // Get variant for an experiment
  const getVariant = useCallback(
    (experimentId: string): Variant | null => {
      const variantId = assignments[experimentId];
      if (!variantId) return null;

      const experiment = getExperiment(experimentId);
      if (!experiment) return null;

      return experiment.variants.find((v) => v.id === variantId) || null;
    },
    [assignments]
  );

  // Get content from variant with fallback
  const getContent = useCallback(
    <T,>(experimentId: string, key: string, defaultValue: T): T => {
      const variant = getVariant(experimentId);
      if (!variant) return defaultValue;
      return getVariantContent(variant, key, defaultValue);
    },
    [getVariant]
  );

  // Track experiment-related events
  const trackExperimentEvent = useCallback(
    (experimentId: string, eventName: string, eventData: Record<string, unknown> = {}) => {
      const variant = getVariant(experimentId);
      if (!variant) return;

      const experiment = getExperiment(experimentId);
      if (!experiment) return;

      // Send to GA4 via gtag
      if (typeof window !== 'undefined' && 'gtag' in window) {
        const gtag = window.gtag as (...args: unknown[]) => void;
        gtag('event', eventName, {
          experiment_id: experimentId,
          experiment_name: experiment.name,
          variant_id: variant.id,
          ...eventData,
        });
      }

      // Send to Meta Pixel via fbq
      if (typeof window !== 'undefined' && 'fbq' in window) {
        const fbq = window.fbq as (...args: unknown[]) => void;
        fbq('trackCustom', eventName, {
          experiment_id: experimentId,
          experiment_name: experiment.name,
          variant_id: variant.id,
          ...eventData,
        });
      }

      // Console log in development
      if (process.env.NODE_ENV === 'development') {
        console.log('[AB Test Event]', {
          event: eventName,
          experimentId,
          variantId: variant.id,
          data: eventData,
        });
      }
    },
    [getVariant]
  );

  const value: ABTestContextValue = {
    getVariant,
    getContent,
    trackExperimentEvent,
    isLoaded,
  };

  return <ABTestReactContext.Provider value={value}>{children}</ABTestReactContext.Provider>;
}

// Hook to use A/B testing in components
export function useABTest(experimentId: string): ABTestContext | null {
  const context = useContext(ABTestReactContext);

  if (!context) {
    throw new Error('useABTest must be used within an ABTestProvider');
  }

  const variant = context.getVariant(experimentId);

  if (!variant) {
    return null;
  }

  return {
    experimentId,
    variantId: variant.id,
    variant,
    trackEvent: (eventName: string, eventData?: Record<string, unknown>) => {
      context.trackExperimentEvent(experimentId, eventName, eventData);
    },
  };
}

// Hook for getting content with fallback (simpler API)
export function useABContent<T>(experimentId: string, key: string, defaultValue: T): T {
  const context = useContext(ABTestReactContext);

  if (!context) {
    throw new Error('useABContent must be used within an ABTestProvider');
  }

  return context.getContent(experimentId, key, defaultValue);
}

// Hook to check if experiments are loaded
export function useABTestLoaded(): boolean {
  const context = useContext(ABTestReactContext);

  if (!context) {
    throw new Error('useABTestLoaded must be used within an ABTestProvider');
  }

  return context.isLoaded;
}
