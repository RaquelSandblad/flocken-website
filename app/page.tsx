/**
 * Startsida (/) — Flocken V2-design.
 *
 * Renderar HomepageV2 (egen V2-header + footer). Ligger i rot-routen, INTE i
 * (marketing)-gruppen, för att slippa den gamla globala headern/footern.
 * Tracking, cookie-consent och GTM kommer från rot-layouten (app/layout.tsx).
 *
 * Tidigare startsida (HeroBlock/FeatureBlock) finns i git-historiken.
 */

import type { Metadata } from 'next';
import { HomepageV2 } from '@/components/marketing/HomepageV2';
import { HOMEPAGE_V2_CONFIG } from '@/components/marketing/HomepageConfigV2';

const OG_IMAGE = '/assets/flocken/generated/flocken_image_malua-arlo-coco-jumping-dog-park_1x1.jpeg';

export const metadata: Metadata = {
  title: HOMEPAGE_V2_CONFIG.pageTitle,
  description: HOMEPAGE_V2_CONFIG.pageDescription,
  alternates: { canonical: '/' },
  openGraph: {
    title: HOMEPAGE_V2_CONFIG.pageTitle,
    description: HOMEPAGE_V2_CONFIG.pageDescription,
    url: '/',
    type: 'website',
    images: [OG_IMAGE],
  },
};

export default function HomePage() {
  return <HomepageV2 config={HOMEPAGE_V2_CONFIG} />;
}
