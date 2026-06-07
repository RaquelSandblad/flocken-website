/**
 * /funktioner — Flocken V2-design.
 *
 * Renderar FunktionerV2 (innehåll). Header + footer kommer från
 * (marketing)-layouten (HeaderV2 + HomepageFooterV2).
 * Tidigare funktionssida (VideoPlayer/FeatureBlock) finns i git-historiken.
 */

import type { Metadata } from 'next';
import { FunktionerV2 } from '@/components/marketing/FunktionerV2';
import { FUNKTIONER_V2_CONFIG } from '@/components/marketing/FunktionerConfigV2';

export const metadata: Metadata = {
  title: FUNKTIONER_V2_CONFIG.pageTitle,
  description: FUNKTIONER_V2_CONFIG.pageDescription,
  alternates: { canonical: '/funktioner' },
};

export default function FunktionerPage() {
  return <FunktionerV2 config={FUNKTIONER_V2_CONFIG} />;
}
