/**
 * /v/hundar — Hookspecifik landningssida för Hundar-funktionen. V2-design.
 *
 * Trafik: Meta Ads med utm_campaign=cb004_<vinkel>
 */

import type { Metadata } from 'next';
import { VLandingPageV2 } from '@/components/v/VLandingPageV2';
import { HUNDAR_V2_CONFIG } from '@/components/v/VLandingConfigV2';

export const metadata: Metadata = {
  title: HUNDAR_V2_CONFIG.pageTitle,
  description: HUNDAR_V2_CONFIG.pageDescription,
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: HUNDAR_V2_CONFIG.pageTitle,
    description: HUNDAR_V2_CONFIG.pageDescription,
    images: [HUNDAR_V2_CONFIG.heroImageSrc],
  },
};

export default function HundarLandingPage() {
  return <VLandingPageV2 config={HUNDAR_V2_CONFIG} />;
}
