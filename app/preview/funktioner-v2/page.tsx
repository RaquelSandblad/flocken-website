/**
 * /preview/funktioner-v2 — Preview-route för ny funktionssida (V2-design).
 *
 * Detta är en preview, INTE en ersättning. Nuvarande sida
 * (app/(marketing)/funktioner/page.tsx) är orörd.
 *
 * Trafik: bara dev/intern. Noindex via layout.
 */

import type { Metadata } from 'next';
import { FunktionerV2 } from '@/components/marketing/FunktionerV2';
import { FUNKTIONER_V2_CONFIG } from '@/components/marketing/FunktionerConfigV2';

export const metadata: Metadata = {
  title: FUNKTIONER_V2_CONFIG.pageTitle,
  description: FUNKTIONER_V2_CONFIG.pageDescription,
  robots: {
    index: false,
    follow: false,
  },
};

export default function PreviewFunktionerV2Page() {
  return <FunktionerV2 config={FUNKTIONER_V2_CONFIG} />;
}
