import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  metadataBase: new URL('https://quiz.flocken.info'),
  title: {
    default: 'Flocken Quiz – Testa din hundkunskap',
    template: '%s | Flocken Quiz',
  },
  description: 'Hundquiz på 2–3 minuter. Testa vad du kan om hundsport, raser, historia och kroppsspråk.',
  openGraph: {
    siteName: 'Flocken Quiz',
    locale: 'sv_SE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function QuizRootLayout({ children }: { children: ReactNode }) {
  return children;
}
