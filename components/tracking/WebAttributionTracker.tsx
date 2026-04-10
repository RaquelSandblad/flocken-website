'use client';

import { useEffect } from 'react';
import { getAttributionEventParams, upsertFromCurrentUrl } from '@/lib/web-attribution';

function hasAnalyticsConsent(): boolean {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return false;
  try {
    const consent = JSON.parse(localStorage.getItem('cookie-consent') || '{}');
    return consent.analytics === true;
  } catch {
    return false;
  }
}

function pushAttributionToDataLayer() {
  if (typeof window === 'undefined' || !window.dataLayer) return;
  const params = getAttributionEventParams();
  // Avoid pushing noisy empty payloads
  if (Object.keys(params).length === 0) return;

  window.dataLayer.push({
    event: 'attribution_update',
    ...params,
  });
}

/**
 * Initializes web attribution (first-touch + last-touch) AFTER analytics consent.
 * - Stores FT/LT in localStorage
 * - Pushes `attribution_update` to dataLayer for GTM preview/debug
 */
export function WebAttributionTracker() {
  useEffect(() => {
    const applyIfConsented = () => {
      if (!hasAnalyticsConsent()) return;
      upsertFromCurrentUrl();
      pushAttributionToDataLayer();
    };

    // Run once on mount (covers returning visitors with existing consent)
    applyIfConsented();

    // Also run when cookie banner updates consent
    const onConsentChange = () => applyIfConsented();
    window.addEventListener('consentchange', onConsentChange as EventListener);

    return () => {
      window.removeEventListener('consentchange', onConsentChange as EventListener);
    };
  }, []);

  return null;
}

