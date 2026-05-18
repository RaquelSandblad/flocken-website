'use client';

/**
 * VLandingCTAV2 — CTA-knapp för V2-landningssidor.
 *
 * Samma tracking-logik som VLandingCTA (platform-detektion, GA4, Meta Pixel)
 * men med V2-stilar: rundade pill-knappar, download-ikon, papper-bakgrund.
 *
 * Positioner:
 * - 'hero'    → vit/paper bakgrund (#FAF6EC), ink-text (#2A2820), stor knapp
 * - 'closing' → vit/paper bakgrund (#FAF6EC), ink-text (#2A2820), stor knapp
 * - 'recruit' → ink bakgrund (#2A2820), paper-text (#FAF6EC), medium knapp
 */

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { trackAppInstall } from '@/lib/tracking';

const APPSTORE_URL = 'https://apps.apple.com/app/flocken/id6755424578';
const PLAYSTORE_URL = 'https://play.google.com/store/apps/details?id=com.bastavan.app';
const DOWNLOAD_URL = '/download';

type Platform = 'ios' | 'android' | 'desktop';
type PositionV2 = 'hero' | 'closing' | 'recruit';

function detectPlatform(): Platform {
  if (typeof navigator === 'undefined') return 'desktop';
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('ipod')) return 'ios';
  if (ua.includes('macintosh') && 'ontouchend' in document) return 'ios';
  if (ua.includes('android')) return 'android';
  return 'desktop';
}

function getCtaUrl(platform: Platform): string {
  if (platform === 'ios') return APPSTORE_URL;
  if (platform === 'android') return PLAYSTORE_URL;
  return DOWNLOAD_URL;
}

interface VLandingCTAV2Props {
  label: string;
  experimentId: string;
  variant: string;
  position: PositionV2;
  className?: string;
}

export function VLandingCTAV2({
  label,
  experimentId,
  variant,
  position,
  className = '',
}: VLandingCTAV2Props) {
  const [platform, setPlatform] = useState<Platform>('desktop');
  const [ctaUrl, setCtaUrl] = useState<string>(DOWNLOAD_URL);

  useEffect(() => {
    const p = detectPlatform();
    setPlatform(p);
    setCtaUrl(getCtaUrl(p));
  }, []);

  function handleClick() {
    if (platform === 'ios' || platform === 'android') {
      trackAppInstall(platform, `v_landing_${variant}`);
    }
    if (typeof window !== 'undefined') {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'cta_click',
        experiment_id: experimentId,
        variant: variant,
        cta_destination: ctaUrl,
        cta_platform: platform,
        source: 'hookspecifik_landing_v2',
        cta_position: position,
        click_location: position === 'hero' ? 'landing_hero' : position,
      });
    }
  }

  // Pill-knapp: hero/closing = paper bg + ink text; recruit = ink bg + paper text
  const isLight = position === 'hero' || position === 'closing';

  return (
    <a
      href={ctaUrl}
      onClick={handleClick}
      className={cn(
        'inline-flex items-center gap-2.5 rounded-full font-bold transition-all duration-200',
        isLight
          ? 'px-7 py-4 text-base hover:-translate-y-0.5'
          : 'px-6 py-4 text-base',
        className,
      )}
      style={
        isLight
          ? {
              background: '#FAF6EC',
              color: '#2A2820',
              boxShadow: position === 'hero'
                ? '0 10px 30px -10px rgba(0,0,0,0.4)'
                : '0 10px 25px -8px rgba(0,0,0,0.3)',
            }
          : {
              background: '#2A2820',
              color: '#FAF6EC',
            }
      }
    >
      {/* Download-ikon */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        width={20}
        height={20}
        aria-hidden="true"
        className="shrink-0"
      >
        <path d="M12 3v13" />
        <path d="M7 11l5 5 5-5" />
        <path d="M5 20h14" />
      </svg>
      {label}
    </a>
  );
}
