/**
 * /preview/start-v2 — Preview-route för ny startsida (V2-design).
 *
 * Detta är en preview, INTE en ersättning. Nuvarande startsida (app/(marketing)/page.tsx)
 * är orörd. Torbjörn kan testa och iterera här innan beslut om go-live.
 *
 * Trafik: bara dev/intern. Noindex via layout.
 */

import type { Metadata } from 'next';
import { HomepageV2 } from '@/components/marketing/HomepageV2';
import { HOMEPAGE_V2_CONFIG } from '@/components/marketing/HomepageConfigV2';

export const metadata: Metadata = {
  title: HOMEPAGE_V2_CONFIG.pageTitle,
  description: HOMEPAGE_V2_CONFIG.pageDescription,
  robots: {
    index: false,
    follow: false,
  },
};

export default function PreviewStartV2Page() {
  return <HomepageV2 config={HOMEPAGE_V2_CONFIG} />;
}
