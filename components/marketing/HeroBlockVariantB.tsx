'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useABTest } from '@/lib/ab-testing';
import { trackExperimentCTAClick } from '@/lib/ab-testing/tracking';
import { getExperiment } from '@/lib/ab-testing';

interface HeroBlockVariantBProps {
  heroImage: string;
}

export function HeroBlockVariantB({ heroImage }: HeroBlockVariantBProps) {
  // Get A/B test context for valkommen_hero_v1
  const abTest = useABTest('valkommen_hero_v1');
  const experiment = abTest ? getExperiment('valkommen_hero_v1') : null;

  const handleCTAClick = (ctaName: string, href: string) => {
    // Track CTA click with experiment context if experiment is active
    if (abTest && experiment && abTest.variant) {
      trackExperimentCTAClick(experiment, abTest.variant, ctaName, href);
    }
  };

  return (
    <section className="relative bg-white pt-12 lg:pt-6">
      <div className="container-custom py-6 lg:py-10">
        {/* Desktop: max-width + mindre gap så text och bild sitter närmare mitten. Mobil: oförändrat */}
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-8 lg:max-w-5xl lg:mx-auto items-start lg:items-center">
          {/* Text + CTA – endast rubrik, processrad, CTA, microcopy */}
          <div className="w-full space-y-6 lg:space-y-8 order-1">
            <h1 className="text-4xl lg:text-6xl font-bold text-flocken-brown leading-tight text-left">
              Få ordning på hundlivet
            </h1>

            <p className="text-lg lg:text-xl text-flocken-gray leading-relaxed text-left">
              Skapa konto · Lägg upp din hund · Se andra nära dig
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              {/* Primär CTA – neutral, ingen store-ikon, länk /download */}
              <Link
                href="/download"
                className="btn-primary inline-flex items-center justify-center text-center px-6 py-3 rounded-xl font-semibold bg-flocken-olive text-white hover:bg-flocken-accent transition-colors"
                onClick={() => handleCTAClick('hero_primary', '/download')}
              >
                Ladda ner appen
              </Link>

              <Link
                href="/funktioner"
                className="inline-flex items-center justify-center text-center border-2 border-flocken-olive text-flocken-olive hover:bg-flocken-sand transition-colors px-6 py-3 rounded-xl font-semibold"
                onClick={() => handleCTAClick('hero_secondary', '/funktioner')}
              >
                Så fungerar appen
              </Link>
            </div>

            <p className="text-sm lg:text-base text-flocken-gray text-left pt-2">
              Gratis att börja. Du väljer själv vad du delar.
            </p>
          </div>

          {/* Hero-bild – ocroppad, hela mobilmockupen, samma bild desktop + mobil (endast skala) */}
          <div className="relative w-full flex justify-center lg:justify-end order-2">
            <div className="relative w-full max-w-[280px] sm:max-w-[320px] lg:max-w-[360px] aspect-[9/19]">
              <Image
                src={heroImage}
                alt="Flocken app - karta med hundar"
                fill
                className="object-contain"
                priority
                sizes="(max-width: 768px) 280px, 360px"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
