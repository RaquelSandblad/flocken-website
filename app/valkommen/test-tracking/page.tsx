'use client';

/**
 * Test page for A/B tracking verification
 * 
 * Öppna: http://localhost:3000/valkommen/test-tracking
 * Scriptet körs automatiskt när sidan laddas
 */

import { useEffect } from 'react';
import Script from 'next/script';
import { ExperimentTracker } from '@/components/ab-testing';
import { HeroBlockVariantB } from '@/components/marketing/HeroBlockVariantB';
import { useABContent } from '@/lib/ab-testing';

export default function TestTrackingPage() {
  const experimentId = 'valkommen_hero_v1';
  const heroStructure = useABContent<string>(experimentId, 'heroStructure', 'default');
  const isVariantB = String(heroStructure) === 'variant_b';

  useEffect(() => {
    console.log('🧪 A/B Test Tracking Test Page loaded');
  }, []);

  return (
    <>
      {/* Track experiment - same as main page */}
      <ExperimentTracker experimentId={experimentId} />
      
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-4">A/B Test Tracking Verification</h1>
        
        <div className="mb-4 p-4 bg-blue-50 rounded">
          <p className="font-semibold">Variant: {isVariantB ? 'variant_b' : 'control'}</p>
          <p>Experiment ID: {experimentId}</p>
        </div>
      
      <div className="bg-gray-100 p-4 rounded mb-4">
        <p className="mb-2">Detta är en test-sida för att verifiera A/B-test tracking.</p>
        <p className="mb-2">Öppna DevTools → Console för att se resultat.</p>
        <p>Scriptet körs automatiskt när sidan laddas.</p>
      </div>

      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Test Checklist:</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>✅ Cookie consent (analytics)</li>
            <li>✅ Experiment assignment</li>
            <li>✅ experiment_impression event</li>
            <li>✅ CTA click event</li>
            <li>✅ Network requests to GA4</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Manual Test:</h2>
          <p className="mb-2">Klicka på knappen nedan för att testa CTA click tracking:</p>
          <p className="mb-2 text-sm text-gray-600">Eller gå till huvud-sidan: <a href="/valkommen" className="text-blue-600 underline">/valkommen</a></p>
          
          {/* Show actual HeroBlock component for testing */}
          <div className="my-4 p-4 border rounded">
            <h3 className="font-semibold mb-2">Test med riktig HeroBlock-komponent:</h3>
            {isVariantB ? (
              <HeroBlockVariantB 
                heroImage={useABContent(experimentId, 'heroImage', '/assets/flocken/generated/flocken_screen_varb_hero_trbg.png')}
              />
            ) : (
              <p>Control variant - HeroBlock skulle visas här</p>
            )}
          </div>
          
          <a
            href="/download"
            className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={(e) => {
              e.preventDefault();
              console.log('🖱️ Manual CTA click test');
            }}
          >
            Test CTA Click (simple link)
          </a>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Results:</h2>
          <p>Kolla Console för detaljerade resultat.</p>
          <p>Results sparas också i <code>window.abTestResults</code></p>
        </div>
      </div>

      {/* Load test script */}
      <Script src="/scripts/test-ab-tracking.js" strategy="afterInteractive" />
      </div>
    </>
  );
}
