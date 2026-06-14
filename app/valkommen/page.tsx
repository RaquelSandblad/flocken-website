/**
 * /valkommen — landningssida (kopia av startsidan, V2).
 *
 * Renderar HomepageV2 med samma config som startsidan (/). Tanken är att
 * /valkommen är en annons-landningssida som kan anpassas separat senare. Just
 * nu är den medvetet identisk med start.
 *
 * Två skillnader mot /:
 *  1. Egen tracking-variant (experimentId VALKOMMEN / variant 'valkommen') så
 *     att cta_click-events från annonstrafik hit kan särskiljas från / i GA4.
 *  2. robots: noindex,follow — en exakt kopia av startsidan ska inte indexeras
 *     separat (undviker duplicate content mot /). Fungerar fullt för annonser.
 *
 * Innehållet refererar samma HOMEPAGE_V2_CONFIG (DRY) — ändras start, ändras
 * /valkommen med, tills vi medvetet skiljer dem åt.
 *
 * Tidigare /valkommen (HeroBlock/FeatureBlock) finns i git-historiken.
 */

import type { Metadata } from 'next';
import { HomepageV2 } from '@/components/marketing/HomepageV2';
import { HOMEPAGE_V2_CONFIG } from '@/components/marketing/HomepageConfigV2';

const OG_IMAGE = '/assets/flocken/generated/flocken_image_malua-arlo-coco-jumping-dog-park_1x1.jpeg';

const VALKOMMEN_CONFIG = {
  ...HOMEPAGE_V2_CONFIG,
  experimentId: 'VALKOMMEN',
  variant: 'valkommen',
};

export const metadata: Metadata = {
  title: HOMEPAGE_V2_CONFIG.pageTitle,
  description: HOMEPAGE_V2_CONFIG.pageDescription,
  alternates: { canonical: '/valkommen' },
  robots: { index: false, follow: true },
  openGraph: {
    title: HOMEPAGE_V2_CONFIG.pageTitle,
    description: HOMEPAGE_V2_CONFIG.pageDescription,
    url: '/valkommen',
    type: 'website',
    images: [OG_IMAGE],
  },
};

export default function ValkommenPage() {
  return <HomepageV2 config={VALKOMMEN_CONFIG} />;
}
