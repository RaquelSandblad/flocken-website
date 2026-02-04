'use client';

// ExperimentTracker Component
// Automatically tracks experiment impressions when mounted

import { useEffect, useRef } from 'react';
import { useABTest } from '@/lib/ab-testing';
import { getExperiment, trackExperimentView } from '@/lib/ab-testing';

interface ExperimentTrackerProps {
  experimentId: string;
}

export function ExperimentTracker({ experimentId }: ExperimentTrackerProps) {
  const abTest = useABTest(experimentId);
  const hasTracked = useRef(false);

  useEffect(() => {
    // Only track once per mount
    if (hasTracked.current || !abTest) {
      return;
    }

    const experiment = getExperiment(experimentId);
    if (!experiment) {
      return;
    }

    // Track experiment impression
    trackExperimentView(experiment, abTest.variant);
    hasTracked.current = true;
  }, [abTest, experimentId]);

  // This component doesn't render anything
  return null;
}
