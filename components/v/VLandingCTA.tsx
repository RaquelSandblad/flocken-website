'use client';

/**
 * VLandingCTA — Client-komponent för CTA-knappen på /v/[hook]-sidor.
 *
 * Ansvar:
 * 1. Detekterar plattform (iOS / Android / desktop) på klienten.
 * 2. Skickar cta_click-event till GTM dataLayer (GA4) och Meta Pixel.
 * 3. Navigerar till rätt destination (App Store / Google Play / /download).
 *
 * Position-varianter:
 * - header        → olive knapp med vit text (mot vit/transparent bakgrund)
 * - hero          → olive knapp med vit text (mot mörk bakgrund i v2)
 * - hero-inverse  → vit bakgrund med olive text (mot mörk hero-illustration)
 * - bottom        → vit bakgrund med olive text (mot olive bakgrund i closing CTA)
 * - closing       → vit bakgrund med olive text (mot flocken-olive)
 */

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

const APPSTORE_URL = 'https://apps.apple.com/app/flocken/id6755424578';
const PLAYSTORE_URL =
  'https://play.google.com/store/apps/details?id=com.bastavan.app';
const DOWNLOAD_URL = '/download';

type Platform = 'ios' | 'android' | 'desktop';
type Position = 'header' | 'hero' | 'hero-inverse' | 'bottom' | 'closing' | 'recruit';

function detectPlatform(): Platform {
  if (typeof navigator === 'undefined') return 'desktop';
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('ipod'))
    return 'ios';
  // iPadOS 13+ rapporterar sig som Macintosh
  if (ua.includes('macintosh') && 'ontouchend' in document) return 'ios';
  if (ua.includes('android')) return 'android';
  return 'desktop';
}

function getCtaUrl(platform: Platform): string {
  if (platform === 'ios') return APPSTORE_URL;
  if (platform === 'android') return PLAYSTORE_URL;
  return DOWNLOAD_URL;
}

// header:        olive bakgrund, vit text, kompakt (py-2 px-4, text-sm)
// hero:          olive bakgrund, vit text, full storlek
// hero-inverse:  vit bakgrund, olive text, full storlek (mot mörk hero-bakgrund)
// bottom:        olive bakgrund, vit text, full storlek
// closing:       vit bakgrund, olive text, full storlek (mot flocken-olive)
function getButtonClasses(position: Position): string {
  if (position === 'header') {
    return 'bg-flocken-olive text-white hover:text-white hover:bg-flocken-accent text-sm py-2 px-4';
  }
  if (position === 'hero-inverse' || position === 'closing') {
    return 'bg-white text-flocken-olive hover:text-flocken-olive hover:bg-flocken-cream text-base py-3.5 px-7';
  }
  return 'bg-flocken-olive text-white hover:text-white hover:bg-flocken-accent text-base py-3.5 px-7';
}

interface VLandingCTAProps {
  label: string;
  experimentId: string;
  variant: string;
  position: Position;
  className?: string;
}

export function VLandingCTA({
  label,
  experimentId,
  variant,
  position,
  className = '',
}: VLandingCTAProps) {
  const [platform, setPlatform] = useState<Platform>('desktop');
  const [ctaUrl, setCtaUrl] = useState<string>(DOWNLOAD_URL);

  useEffect(() => {
    const p = detectPlatform();
    setPlatform(p);
    setCtaUrl(getCtaUrl(p));
  }, []);

  function handleClick() {
    const eventData = {
      experiment_id: experimentId,
      variant: variant,
      cta_destination: ctaUrl,
      cta_platform: platform,
      source: 'hookspecifik_landing',
      cta_position: position,
    };

    if (typeof window !== 'undefined') {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'cta_click',
        ...eventData,
      });

      if (window.fbq) {
        window.fbq('trackCustom', 'CTAClick', eventData);
      }

      if (process.env.NODE_ENV === 'development') {
        console.log('[VLanding CTA] Click tracked:', eventData);
      }
    }
  }

  const buttonClasses = getButtonClasses(position);

  return (
    <a
      href={ctaUrl}
      onClick={handleClick}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl font-semibold shadow-soft transition-[background-color,transform,box-shadow] duration-150 hover:scale-[1.02] active:scale-[0.98]',
        buttonClasses,
        className,
      )}
    >
      {label}
      {position !== 'header' && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="size-4 shrink-0"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M6.22 4.22a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.75.75 0 0 1-1.06-1.06L8.94 8 6.22 5.28a.75.75 0 0 1 0-1.06Z"
            clipRule="evenodd"
          />
        </svg>
      )}
    </a>
  );
}
