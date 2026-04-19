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
      {/* GTM + consent_default — måste sättas innan GTM-skriptet laddas */}
      <Script id="quiz-gtm-init" strategy="beforeInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          // Consent-default: blockera all tracking tills cookie-banner ger samtycke.
          // Speglar root-layouten på flocken.info.
          window.dataLayer.push({
            'event': 'consent_default',
            'analytics_storage': 'denied',
            'ad_storage': 'denied',
            'ad_user_data': 'denied',
            'ad_personalization': 'denied',
            'functionality_storage': 'granted',
            'security_storage': 'granted'
          });
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

      {/* Meta Pixel — init + consent revoke. PageView fyras av cookie-banner-custom.js
          efter samtycke (samma mönster som flocken.info root-layout). */}
      <Script id="quiz-meta-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${process.env.NEXT_PUBLIC_META_PIXEL_ID}');
          fbq('consent', 'revoke');
          // PageView hanteras av cookie-banner-custom.js efter samtycke
        `}
      </Script>

      {/* Cookie-banner — slim-bar visas automatiskt för quiz.flocken.info
          (hostname-check i cookie-banner-custom.js). Ladda efter pixel. */}
      <Script
        id="quiz-cookie-banner"
        src="/scripts/cookie-banner-custom.js"
        strategy="afterInteractive"
      />

      <QuizPageTracker />
      {children}
    </>
  );
}
