/**
 * /v/passa — Hookspecifik landningssida för Passa-funktionen. V2-design.
 *
 * EXP001: Variant mot /valkommen (control).
 * Trafik: Meta Ads med utm_content=variant_passa
 */

import type { Metadata } from 'next';
import { VLandingPageV2 } from '@/components/v/VLandingPageV2';
import { PASSA_V2_CONFIG } from '@/components/v/VLandingConfigV2';

export const metadata: Metadata = {
  title: PASSA_V2_CONFIG.pageTitle,
  description: PASSA_V2_CONFIG.pageDescription,
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: PASSA_V2_CONFIG.pageTitle,
    description: PASSA_V2_CONFIG.pageDescription,
    images: [PASSA_V2_CONFIG.heroImageSrc],
  },
};

export default function PassaLandingPage() {
  return <VLandingPageV2 config={PASSA_V2_CONFIG} />;
}
