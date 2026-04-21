/**
 * /v/hundar — Hookspecifik landningssida för Hundar-funktionen.
 *
 * CB004: Tre vinklar (Lekkompis, Karta/Närheten, Försvunnen hund).
 * Trafik: Meta Ads med utm_campaign=cb004_<vinkel>
 *
 * För att lägga till fler hooks:
 *   1. Skapa en ny config i /components/v/VLandingConfig.ts
 *   2. Skapa /app/v/[hook]/page.tsx som importerar den config:en
 *   Det är allt.
 */

import type { Metadata } from 'next';
import { VLandingPage } from '@/components/v/VLandingPage';
import { HUNDAR_CONFIG } from '@/components/v/VLandingConfig';

export const metadata: Metadata = {
  title: HUNDAR_CONFIG.pageTitle,
  description: HUNDAR_CONFIG.pageDescription,
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: HUNDAR_CONFIG.pageTitle,
    description: HUNDAR_CONFIG.pageDescription,
    images: [HUNDAR_CONFIG.heroImageSrc],
  },
};

export default function HundarLandingPage() {
  return <VLandingPage config={HUNDAR_CONFIG} />;
}
