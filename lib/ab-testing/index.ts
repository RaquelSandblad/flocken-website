// A/B Testing Module - Public API
// Export everything needed to use A/B testing in the app

// Types
export type { Experiment, Variant, ExperimentAssignment, ABTestContext } from './types';

// Configuration
export { experiments, getExperiment, getActiveExperimentsForPage, getRunningExperiments } from './experiments';

// Utilities
export {
  AB_COOKIE_NAME,
  generateVisitorId,
  selectVariant,
  parseAssignments,
  serializeAssignments,
  getOrAssignVariant,
  getVariantContent,
  isExperimentActive,
} from './utils';

// Middleware
export { handleABTestMiddleware } from './middleware';
export type { MiddlewareResult } from './middleware';

// React Context and Hooks
export { ABTestProvider, useABTest, useABContent, useABTestLoaded } from './context';

// Tracking
export { trackExperimentView, trackExperimentConversion, trackExperimentCTAClick } from './tracking';
