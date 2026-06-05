/**
 * Layout för /preview/start-v2.
 *
 * Minimal: ingen marketing-header/-footer trycks på från (marketing)-gruppen.
 * Sidan HomepageV2 renderar egen header och footer.
 *
 * Indexeras INTE — det här är en preview-version av startsidan som ska kunna
 * itereras i dev/preview innan vi tar ställning till om den ska ersätta /.
 */

import type { Metadata } from 'next';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function PreviewStartV2Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
