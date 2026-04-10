'use client';

// ExperimentTracker Component
// Automatically tracks experiment impressions when mounted

import { useEffect, useRef } from 'react';
import { useABTest, getExperiment, trackExperimentView } from '@/lib/ab-testing';

interface ExperimentTrackerProps {
  experimentId: string;
}

export function ExperimentTracker({ experimentId }: ExperimentTrackerProps) {
  const abTest = useABTest(experimentId);
  const hasTracked = useRef(false);

  useEffect(() => {
    // Only track once per mount
    if (hasTracked.current) {
      return;
    }

    if (!abTest) {
      console.log('[AB Test] ExperimentTracker: abTest not ready yet', { experimentId });
      return;
    }

    const experiment = getExperiment(experimentId);
    if (!experiment) {
      console.warn('[AB Test] ExperimentTracker: Experiment not found', { experimentId });
      return;
    }

    // Track experiment impression
    console.log('[AB Test] ExperimentTracker: Tracking impression', {
      experimentId,
      variantId: abTest.variant.id,
    });
    trackExperimentView(experiment, abTest.variant);
    hasTracked.current = true;
  }, [abTest, experimentId]);

  // This component doesn't render anything
  return null;
}
