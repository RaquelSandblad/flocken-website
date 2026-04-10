// A/B Testing Types

export interface Variant {
  id: string;
  weight: number; // 0-100, total should equal 100
  content: Record<string, unknown>;
}

export interface Experiment {
  id: string;
  name: string;
  description?: string;
  status: 'draft' | 'running' | 'paused' | 'completed';
  startDate?: string;
  endDate?: string;
  variants: Variant[];
  targetPages: string[]; // URL paths where experiment runs
}

export interface ExperimentAssignment {
  visitorId: string;
  experimentId: string;
  variantId: string;
  assignedAt: string;
}

export interface ABTestContext {
  experimentId: string;
  variantId: string;
  variant: Variant;
  trackEvent: (eventName: string, eventData?: Record<string, unknown>) => void;
}
