'use client';

// A/B Test Demo Page
// This page demonstrates how A/B testing works
// URL: /valkommen/ab-demo

import { useABTest, useABContent, getExperiment } from '@/lib/ab-testing';
import { ExperimentTracker } from '@/components/ab-testing';

export default function ABDemoPage() {
  const experimentId = 'valkommen_hero_v1';
  const abTest = useABTest(experimentId);
  const experiment = getExperiment(experimentId);

  // Get content with fallbacks
  const heroTitle = useABContent(experimentId, 'heroTitle', 'Default Title');
  const heroTagline = useABContent(experimentId, 'heroTagline', 'Default Tagline');
  const heroSubtitle = useABContent(experimentId, 'heroSubtitle', 'Default Subtitle');
  const ctaPrimaryText = useABContent(experimentId, 'ctaPrimaryText', 'Primary CTA');
  const ctaSecondaryText = useABContent(experimentId, 'ctaSecondaryText', 'Secondary CTA');

  return (
    <div className="min-h-screen bg-flocken-cream p-8">
      {/* Track experiment impression */}
      <ExperimentTracker experimentId={experimentId} />

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-flocken-brown mb-8">A/B Test Demo</h1>

        {/* Debug Info */}
        <div className="bg-white rounded-xl p-6 shadow-soft mb-8">
          <h2 className="text-xl font-semibold text-flocken-brown mb-4">Debug Info</h2>
          <div className="space-y-2 text-sm font-mono">
            <p>
              <span className="text-flocken-gray">Experiment ID:</span>{' '}
              <span className="text-flocken-olive">{experimentId}</span>
            </p>
            <p>
              <span className="text-flocken-gray">Experiment Status:</span>{' '}
              <span className={experiment?.status === 'running' ? 'text-green-600' : 'text-amber-600'}>
                {experiment?.status || 'not found'}
              </span>
            </p>
            <p>
              <span className="text-flocken-gray">Assigned Variant:</span>{' '}
              <span className="text-flocken-olive">{abTest?.variantId || 'none (experiment not running)'}</span>
            </p>
          </div>

          {experiment?.status !== 'running' && (
            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-amber-800 text-sm">
                ⚠️ Experimentet är inte aktivt. Ändra <code>status</code> till <code>&quot;running&quot;</code> i{' '}
                <code>lib/ab-testing/experiments.ts</code> för att aktivera.
              </p>
            </div>
          )}
        </div>

        {/* Preview of variant content */}
        <div className="bg-white rounded-xl p-6 shadow-soft mb-8">
          <h2 className="text-xl font-semibold text-flocken-brown mb-4">Variant Preview</h2>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-flocken-gray">heroTitle:</label>
              <p className="text-2xl font-bold text-flocken-brown">{heroTitle}</p>
            </div>

            <div>
              <label className="text-sm text-flocken-gray">heroTagline:</label>
              <p className="text-xl text-flocken-olive">{heroTagline}</p>
            </div>

            <div>
              <label className="text-sm text-flocken-gray">heroSubtitle:</label>
              <p className="text-flocken-brown">{heroSubtitle}</p>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                onClick={() => abTest?.trackEvent('cta_click', { cta: 'primary' })}
                className="px-6 py-3 bg-flocken-olive text-white rounded-xl font-semibold hover:bg-flocken-accent transition-colors"
              >
                {ctaPrimaryText}
              </button>
              <button
                onClick={() => abTest?.trackEvent('cta_click', { cta: 'secondary' })}
                className="px-6 py-3 bg-white border-2 border-flocken-olive text-flocken-olive rounded-xl font-semibold hover:bg-flocken-sand transition-colors"
              >
                {ctaSecondaryText}
              </button>
            </div>
          </div>
        </div>

        {/* All variants comparison */}
        <div className="bg-white rounded-xl p-6 shadow-soft">
          <h2 className="text-xl font-semibold text-flocken-brown mb-4">Alla varianter i experimentet</h2>

          {experiment ? (
            <div className="grid md:grid-cols-2 gap-6">
              {experiment.variants.map((variant) => (
                <div
                  key={variant.id}
                  className={`p-4 rounded-lg border-2 ${
                    variant.id === abTest?.variantId
                      ? 'border-flocken-olive bg-flocken-sand/50'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-flocken-brown">{variant.id}</h3>
                    <span className="text-sm text-flocken-gray">{variant.weight}%</span>
                  </div>
                  {variant.id === abTest?.variantId && (
                    <span className="inline-block px-2 py-1 text-xs bg-flocken-olive text-white rounded mb-2">
                      Din variant
                    </span>
                  )}
                  <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-40">
                    {JSON.stringify(variant.content, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-flocken-gray">Experiment not found</p>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-8 text-sm text-flocken-gray">
          <p>
            <strong>Tips:</strong> Öppna DevTools Console för att se tracking events. Rensa cookies för att få en ny variant.
          </p>
        </div>
      </div>
    </div>
  );
}
