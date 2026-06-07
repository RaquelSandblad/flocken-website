/**
 * Layout för /preview/funktioner-v2.
 *
 * Minimal: ingen marketing-header/-footer trycks på från (marketing)-gruppen.
 * Sidan FunktionerV2 renderar egen header och footer.
 *
 * Indexeras INTE — detta är en preview-version av funktionssidan som ska kunna
 * itereras i dev/preview innan beslut om go-live.
 */

import type { Metadata } from 'next';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function PreviewFunktionerV2Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
