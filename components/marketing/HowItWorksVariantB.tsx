'use client';

import Image from 'next/image';
import Link from 'next/link';

interface HowItWorksVariantBProps {
  image1: string;
  image2: string;
  image3: string;
}

const LABELS = [
  'Se hundar på karta',
  'Chatta direkt i appen',
  'Hjälp när vardagen inte går ihop',
] as const;

export function HowItWorksVariantB({ image1, image2, image3 }: HowItWorksVariantBProps) {
  // Ordning: 1=karta, 2=chatt, 3=passning. image2 är profil, image3 är chatt – byt så copy matchar.
  const blocks = [
    { src: image1, label: LABELS[0], alt: 'Flocken app - karta med hundar' },
    { src: image3, label: LABELS[1], alt: 'Flocken app - chatt' },
    { src: image2, label: LABELS[2], alt: 'Flocken app - hundvakt profil' },
  ];

  return (
    <section className="section-padding bg-flocken-cream">
      <div className="container-custom">
        <h2 className="text-3xl lg:text-4xl font-bold text-flocken-brown text-center mb-12 lg:mb-16">
          Så fungerar Flocken
        </h2>

        {/* Desktop: 3 kolumner i rad. Mobil: samma tre block staplade vertikalt, ingen carousel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-8">
          {blocks.map(({ src, label, alt }) => (
            <div key={label} className="flex flex-col items-center text-center">
              <div className="relative w-full max-w-[260px] mx-auto aspect-[9/19]">
                <Image
                  src={src}
                  alt={alt}
                  fill
                  className="object-contain"
                  sizes="(max-width: 1024px) 260px, 33vw"
                />
              </div>
              <p className="mt-4 text-lg lg:text-xl font-semibold text-flocken-brown">
                {label}
              </p>
            </div>
          ))}
        </div>

        {/* CTA upprepning – neutral primär knapp, ingen store-ikon */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12 lg:mt-16">
          <Link
            href="/download"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold bg-flocken-olive text-white hover:bg-flocken-accent transition-colors"
          >
            Ladda ner appen
          </Link>
          <Link
            href="/funktioner"
            className="inline-flex items-center justify-center border-2 border-flocken-olive text-flocken-olive hover:bg-flocken-sand transition-colors px-6 py-3 rounded-xl font-semibold"
          >
            Så fungerar appen
          </Link>
        </div>
      </div>
    </section>
  );
}
