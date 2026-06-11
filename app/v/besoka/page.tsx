/**
 * /v/besoka — Hookspecifik landningssida för Besöka-funktionen. V2-design.
 *
 * EXP003. Trafik: Meta Ads med utm_content=cid009_falt4_besoka_*
 */

import type { Metadata } from 'next';
import { VLandingPageV2 } from '@/components/v/VLandingPageV2';
import { BESOKA_V2_CONFIG } from '@/components/v/VLandingConfigV2';

export const metadata: Metadata = {
  title: BESOKA_V2_CONFIG.pageTitle,
  description: BESOKA_V2_CONFIG.pageDescription,
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: BESOKA_V2_CONFIG.pageTitle,
    description: BESOKA_V2_CONFIG.pageDescription,
    images: [BESOKA_V2_CONFIG.heroImageSrc],
  },
};

export default function BesokaLandingPage() {
  return <VLandingPageV2 config={BESOKA_V2_CONFIG} />;
}
