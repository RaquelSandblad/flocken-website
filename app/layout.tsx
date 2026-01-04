import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://flocken.info'),
  title: {
    default: 'Flocken - För ett bättre liv som hund',
    template: '%s | Flocken'
  },
  description: 'Allt du behöver som hundägare på ett ställe. Para, Passa, Rasta, Besöka. Fyra funktioner. En app.',
  keywords: ['hundapp', 'hundparning', 'hundvakt', 'hundpromenader', 'hundvänliga platser', 'hund', 'Sverige'],
  authors: [{ name: 'Spitakolus AB' }],
  openGraph: {
    type: 'website',
    locale: 'sv_SE',
    url: 'https://flocken.info',
    siteName: 'Flocken',
    title: 'Flocken - För ett bättre liv som hund',
    description: 'Allt du behöver som hundägare på ett ställe',
    images: [
      {
        url: '/assets/flocken/generated/hero.png',
        width: 1920,
        height: 1080,
        alt: 'Flocken - Hundapp för svenska hundägare'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Flocken - För ett bättre liv som hund',
    description: 'Para, Passa, Rasta, Besöka. Allt på ett ställe.',
    images: ['/assets/flocken/generated/hero.png']
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sv" suppressHydrationWarning>
      <head>
        {/* Facebook Domain Verification */}
        <meta name="facebook-domain-verification" content="jt1vlxalalidu3tkkaoufy8kv91tta" />
        
        {/* Initialize dataLayer for GTM-only setup */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              window.dataLayer.push({'gtm.start': new Date().getTime(), event:'gtm.js'});
              
              // GTM-only consent management (no direct gtag)
              window.dataLayer.push({
                'event': 'consent_default',
                'analytics_storage': 'denied',
                'ad_storage': 'denied',
                'ad_user_data': 'denied',
                'ad_personalization': 'denied',
                'functionality_storage': 'granted',
                'security_storage': 'granted'
              });
            `,
          }}
        />
        
        {/* Cookie Banner - Modal design */}
        <script defer src="/scripts/cookie-banner-custom.js"></script>
        
        {/* Google Tag Manager - GTM-only implementation */}
        <script async src="https://www.googletagmanager.com/gtm.js?id=GTM-PD5N4GT3&l=dataLayer"></script>
        
        {/* Meta Pixel - Facebook Pixel */}
        {process.env.NEXT_PUBLIC_META_PIXEL_ID && (
          <>
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  !function(f,b,e,v,n,t,s)
                  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                  n.queue=[];t=b.createElement(e);t.async=!0;
                  t.src=v;s=b.getElementsByTagName(e)[0];
                  s.parentNode.insertBefore(t,s)}(window, document,'script',
                  'https://connect.facebook.net/en_US/fbevents.js');
                  fbq('init', '${process.env.NEXT_PUBLIC_META_PIXEL_ID}');
                  
                  // Wait for cookie consent before tracking PageView
                  // Cookie banner will call fbq('consent', 'grant') and fbq('track', 'PageView') when marketing cookies are accepted
                  // If consent already exists, cookie banner will handle it
                  function checkConsentAndTrack() {
                    try {
                      const consent = JSON.parse(localStorage.getItem('cookie_consent') || '{}');
                      if (consent.marketing) {
                        fbq('consent', 'grant');
                        fbq('track', 'PageView');
                      } else {
                        // Wait for consentchange event from cookie banner
                        window.addEventListener('consentchange', function(e) {
                          if (e.detail && e.detail.marketing) {
                            fbq('consent', 'grant');
                            fbq('track', 'PageView');
                          }
                        });
                      }
                    } catch (e) {
                      // If no consent found, wait for consentchange event
                      window.addEventListener('consentchange', function(e) {
                        if (e.detail && e.detail.marketing) {
                          fbq('consent', 'grant');
                          fbq('track', 'PageView');
                        }
                      });
                    }
                  }
                  
                  // Check consent after a short delay to ensure cookie banner has loaded
                  setTimeout(checkConsentAndTrack, 100);
                `,
              }}
            />
            <noscript>
              <img
                height="1"
                width="1"
                style={{ display: 'none' }}
                src={`https://www.facebook.com/tr?id=${process.env.NEXT_PUBLIC_META_PIXEL_ID}&ev=PageView&noscript=1`}
                alt=""
              />
            </noscript>
          </>
        )}
      </head>
      <body className={inter.className} suppressHydrationWarning={true}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            title="Google Tag Manager"
            src="https://www.googletagmanager.com/ns.html?id=GTM-PD5N4GT3"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        
        {children}
      </body>
    </html>
  );
}

