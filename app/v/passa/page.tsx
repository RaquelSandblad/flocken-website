/**
 * /v/passa — Hookspecifik landningssida för Passa-funktionen.
 *
 * EXP001: Variant mot /valkommen (control).
 * Trafik: Meta Ads med utm_content=variant_passa
 *
 * För att lägga till fler hooks:
 *   1. Skapa en ny config i /components/v/VLandingConfig.ts
 *   2. Skapa /app/v/[hook]/page.tsx som importerar den config:en
 *   Det är allt.
 */

import type { Metadata } from 'next';
import { VLandingPage } from '@/components/v/VLandingPage';
import { PASSA_CONFIG } from '@/components/v/VLandingConfig';

export const metadata: Metadata = {
  title: PASSA_CONFIG.pageTitle,
  description: PASSA_CONFIG.pageDescription,
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: PASSA_CONFIG.pageTitle,
    description: PASSA_CONFIG.pageDescription,
    images: [PASSA_CONFIG.heroImageSrc],
  },
};

export default function PassaLandingPage() {
  return <VLandingPage config={PASSA_CONFIG} />;
}
