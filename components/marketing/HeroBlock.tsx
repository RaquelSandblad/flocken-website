'use client';

import Image from 'next/image';
import { trackAppInstall } from '@/lib/tracking';

interface HeroBlockProps {
  title: string;
  tagline: string;
  subtitle: string;
  ctaPrimary: { text: string; href: string };
  ctaSecondary?: { text: string; href: string };
  image: string;
  launchOffer?: string;
  appStoreComingSoon?: string;
  launchInfo?: string;
  alignLeft?: boolean;
}

export function HeroBlock({ 
  title, 
  tagline, 
  subtitle, 
  ctaPrimary, 
  ctaSecondary, 
  image, 
  launchOffer,
  appStoreComingSoon,
  launchInfo,
  alignLeft = false
}: HeroBlockProps) {
  return (
    <section className="relative min-h-screen flex items-center bg-gradient-to-br from-white to-flocken-cream pt-20 lg:pt-8">
      <div className="container-custom py-10 lg:py-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Copy + CTA */}
          <div className={`space-y-8 ${alignLeft ? 'text-left' : ''}`}>
            <div className="space-y-4">
              <h1 className={`text-5xl lg:text-7xl font-bold text-flocken-brown leading-tight ${alignLeft ? 'text-left' : ''}`}>
                {title}
                <span className="block text-4xl lg:text-5xl text-flocken-olive mt-2">
                  {tagline}
                </span>
              </h1>
              
              <p className={`text-xl lg:text-2xl text-flocken-brown opacity-90 leading-relaxed ${alignLeft ? 'text-left' : ''}`}>
                {subtitle}
              </p>
            </div>

            {/* Launch Info */}
            {launchInfo && (
              <p className={`text-lg text-flocken-brown opacity-80 ${alignLeft ? 'text-left' : ''}`}>
                {launchInfo}
              </p>
            )}

            {/* CTAs */}
            <div className="space-y-4">
              <div className={`flex flex-col gap-4 ${alignLeft ? 'items-start' : 'items-center'}`}>
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  <a 
                    href={ctaPrimary.href} 
                    className="btn-primary inline-flex items-center justify-center"
                    onClick={() => {
                      // Track app install click
                      const isAndroid = ctaPrimary.href.includes('play.google.com');
                      const isIOS = ctaPrimary.href.includes('apps.apple.com');
                      if (isAndroid) {
                        trackAppInstall('android', 'hero_cta');
                      } else if (isIOS) {
                        trackAppInstall('ios', 'hero_cta');
                      }
                    }}
                  >
                    {/* Google Play icon */}
                    <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                    </svg>
                    {ctaPrimary.text}
                  </a>
                  
                  {ctaSecondary && (
                    <a 
                      href={ctaSecondary.href} 
                      className="btn-primary inline-flex items-center justify-center"
                      onClick={() => {
                        // Track app install click
                        const isAndroid = ctaSecondary.href.includes('play.google.com');
                        const isIOS = ctaSecondary.href.includes('apps.apple.com');
                        if (isAndroid) {
                          trackAppInstall('android', 'hero_cta');
                        } else if (isIOS) {
                          trackAppInstall('ios', 'hero_cta');
                        }
                      }}
                    >
                      {/* App Store icon */}
                      <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C1.79 15.25 2.1 7.59 9.5 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                      </svg>
                      {ctaSecondary.text}
                    </a>
                  )}
                </div>
                
                {appStoreComingSoon && !ctaSecondary && (
                  <p className={`text-sm text-flocken-olive font-medium ${alignLeft ? 'text-left' : ''}`}>
                    {appStoreComingSoon}
                  </p>
                )}
              </div>
              
              {launchOffer && (
                <p className={`text-base text-flocken-brown opacity-75 whitespace-pre-line ${alignLeft ? 'text-left' : 'text-center'}`}>
                  {launchOffer}
                </p>
              )}
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative h-[400px] lg:h-[600px] rounded-3xl overflow-hidden shadow-elevated">
            <Image
              src={image}
              alt="Flocken app hero"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

