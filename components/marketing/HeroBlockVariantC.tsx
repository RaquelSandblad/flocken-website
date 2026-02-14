'use client';

import Image from 'next/image';
import { trackAppInstall } from '@/lib/tracking';
import { useABTest } from '@/lib/ab-testing';
import { trackExperimentCTAClick } from '@/lib/ab-testing/tracking';
import { getExperiment } from '@/lib/ab-testing';

interface HeroBlockVariantCProps {
  heroTitle: string;
  heroSubtitle: string;
  ctaPrimaryText: string;
  ctaSecondaryText?: string;
  socialProof?: string;
  offer?: string;
  heroImage: string;
  problemImage?: string;
}

export function HeroBlockVariantC({
  heroTitle,
  heroSubtitle,
  ctaPrimaryText,
  ctaSecondaryText,
  socialProof,
  offer,
  heroImage,
  problemImage = '/assets/flocken/fb-group-problem.jpg', // Placeholder - replace with actual screenshot
}: HeroBlockVariantCProps) {
  const abTest = useABTest('valkommen_hero_v1');
  const experiment = abTest ? getExperiment('valkommen_hero_v1') : null;

  const handleCTAClick = (platform: 'android' | 'ios', ctaName: string, href: string) => {
    trackAppInstall(platform, 'hero_cta');
    if (abTest && experiment && abTest.variant) {
      trackExperimentCTAClick(experiment, abTest.variant, ctaName, href);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center bg-white pt-6 lg:pt-2">
      <div className="container-custom py-4 lg:py-3">
        {/* Split Screen Grid */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">

          {/* LEFT: Problem (Facebook Groups) */}
          <div className="relative order-2 lg:order-1">
            <div className="relative h-[400px] lg:h-[600px] rounded-3xl overflow-hidden shadow-elevated bg-white">
              {/* Problem image - FB group chaos (clean, no overlay) */}
              <div className="absolute inset-0 flex items-center justify-center p-8">
                <Image
                  src="/assets/flocken/generated/flocken_image_some-mess_v1_wbg_1x1_large.jpg"
                  alt="Röriga Facebook-grupper för hundägare"
                  width={1024}
                  height={1024}
                  className="object-contain w-full h-full"
                  priority
                />
              </div>
            </div>
          </div>

          {/* RIGHT: Solution (Flocken) */}
          <div className="space-y-8 order-1 lg:order-2">
            {/* Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold text-flocken-brown leading-[1.2]">
                {heroTitle}
              </h1>

              <p className="text-xl lg:text-2xl text-flocken-brown leading-relaxed">
                {heroSubtitle}
              </p>
            </div>

            {/* CTA - Single button */}
            <div className="space-y-5">
              <a
                href="https://flocken.info/download"
                className="btn-primary inline-flex items-center justify-center text-lg px-8 py-4 w-full sm:w-auto"
                onClick={() => handleCTAClick('android', 'hero_cta', 'https://flocken.info/download')}
              >
                Ladda ner appen
              </a>

              {/* Social proof + Free app */}
              <div className="space-y-3">
                {socialProof && (
                  <p className="text-base text-flocken-brown opacity-75 flex items-center gap-2">
                    <svg className="w-5 h-5 text-flocken-olive" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
                    </svg>
                    {socialProof}
                  </p>
                )}
                <p className="text-base font-semibold text-flocken-olive">
                  📦 Appen är gratis
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
