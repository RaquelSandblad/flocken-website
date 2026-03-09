import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Script from 'next/script';
import { QuizPageTracker } from '@/components/quiz/QuizPageTracker';

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
  return (
    <>
      {/* Ensure GTM is initialized for quiz subdomain */}
      <Script id="quiz-gtm-init" strategy="beforeInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          if (!window.__GTM_INITIALIZED__) {
            window.dataLayer.push({'gtm.start': new Date().getTime(), event:'gtm.js'});
            window.__GTM_INITIALIZED__ = true;
          }
        `}
      </Script>
      <Script
        id="quiz-gtm"
        src="https://www.googletagmanager.com/gtm.js?id=GTM-PD5N4GT3&l=dataLayer"
        strategy="afterInteractive"
      />
      <QuizPageTracker />
      {children}
    </>
  );
}
