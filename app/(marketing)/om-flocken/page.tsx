import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Om Flocken – berättelsen bakom appen",
  description: "Flocken byggdes av hundmänniskor som levde med problemet appen löser. Läs historien bakom.",
};

export default function OmFlockenPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-20 bg-flocken-brown">
        <div className="container-custom">
          <div className="max-w-3xl">
            <p className="text-flocken-sand/70 text-sm font-semibold uppercase tracking-widest mb-6">
              Om Flocken
            </p>
            <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight mb-8">
              Varför finns det ingen app där man kan se vilka hundar som finns i närheten?
            </h1>
            <p className="text-xl text-flocken-sand/80 leading-relaxed">
              Den frågan ställde vi en dag. Sedan byggde vi Flocken.
            </p>
          </div>
        </div>
      </section>

      {/* Problemet */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-flocken-brown mb-6">
                Det började med en pudel i Göteborg
              </h2>
              <div className="space-y-5 text-lg text-flocken-brown leading-relaxed">
                <p>
                  Vi skapade Flocken för att vi själva hade behövt appen. När vi ville para vår lilla Tik visade det sig vara svårare än vi tänkt.
                </p>
                <p>
                  Vi missade flera löpperioder. Det fanns helt enkelt ingen bra plats att leta på.
                </p>
                <p>
                  Traditionella avelsorganisationer var stela. Grupperna i sociala medier var röriga. Inlägg försvann och när vi äntligen verkade hitta rätt visade det sig att hanen bodde på andra sidan Sverige. Det hade vi gärna vetat från början.
                </p>
              </div>
            </div>
            <div className="relative h-[420px] rounded-2xl overflow-hidden shadow-card">
              <Image
                src="/assets/flocken/generated/flocken_image_malua-arlo-coco-jumping-dog-park_1x1.jpeg"
                alt="Hundar leker i hundparken"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Insikten */}
      <section className="section-padding bg-flocken-sand">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-flocken-brown mb-10">
              Det saknades något helt annat
            </h2>
            <blockquote className="relative">
              <div className="text-flocken-olive/30 text-8xl font-serif leading-none select-none mb-2">&ldquo;</div>
              <p className="text-2xl lg:text-3xl font-semibold text-flocken-brown leading-snug -mt-6">
                Varför finns det ingen app där man faktiskt kan upptäcka hundar omkring sig?
              </p>
            </blockquote>
            <div className="mt-10 space-y-4 text-lg text-flocken-brown leading-relaxed">
              <p>
                En plats där hundar har egna profiler. Där kartan är i centrum, för möten mellan hundar och människor sker alltid i verkligheten. Där man kan filtrera efter ras, stad och vad man söker.
              </p>
              <p>
                Inte ett till socialt nätverk. Inte en Facebook-grupp. Ett praktiskt verktyg byggt för riktiga hundägare och verkliga behov.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vad Flocken är */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <h2 className="text-3xl lg:text-4xl font-bold text-flocken-brown">
              Det vi byggde
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-flocken-cream rounded-2xl p-8 text-center">
              <div className="w-14 h-14 mx-auto mb-5 bg-flocken-sand rounded-2xl flex items-center justify-center">
                <svg className="w-7 h-7 text-flocken-olive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-flocken-brown mb-2">Kartan i centrum</h3>
              <p className="text-flocken-gray text-sm leading-relaxed">
                Se hundar och hundägare i närheten. Möten sker i verkligheten, inte bara digitalt.
              </p>
            </div>
            <div className="bg-flocken-cream rounded-2xl p-8 text-center">
              <div className="w-14 h-14 mx-auto mb-5 bg-flocken-sand rounded-2xl flex items-center justify-center">
                <svg className="w-7 h-7 text-flocken-olive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-flocken-brown mb-2">Riktiga profiler</h3>
              <p className="text-flocken-gray text-sm leading-relaxed">
                Varje hund har en egen profil. Ras, ålder, kön, vad de söker. Inte ett inlägg som försvinner.
              </p>
            </div>
            <div className="bg-flocken-cream rounded-2xl p-8 text-center">
              <div className="w-14 h-14 mx-auto mb-5 bg-flocken-sand rounded-2xl flex items-center justify-center">
                <svg className="w-7 h-7 text-flocken-olive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-flocken-brown mb-2">Filtrering som fungerar</h3>
              <p className="text-flocken-gray text-sm leading-relaxed">
                Sök efter precis det du behöver. Slipp fel svar från fel stad om fel ras.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vilka vi är */}
      <section className="section-padding bg-flocken-brown">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative h-[380px] rounded-2xl overflow-hidden shadow-card">
              <Image
                src="/assets/flocken/generated/flocken_image_malua-arlo-coco-chasing-ball_16x9.jpeg"
                alt="Hundar springer och leker"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                Ett litet bolag med hundhjärta
              </h2>
              <div className="space-y-5 text-lg text-flocken-sand/80 leading-relaxed">
                <p>
                  Flocken är inte byggt av ett internationellt techbolag. Det är byggt av hundmänniskor som levde med de problem appen löser.
                </p>
                <p>
                  Vi är ett litet svenskt bolag. Drivkraften är personlig. Visionen är att samla Skandinaviens hundägare på ett ställe och göra det enklare att hitta varandra, oavsett om det handlar om hundvakt, lekkamrater, promenader eller parning.
                </p>
                <p>
                  Hundar skapar relationer mellan människor som annars aldrig hade mötts. Det är inte teknik för teknikens skull. Det är den känslan hela appen vilar på.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Kärnan */}
      <section className="section-padding bg-flocken-cream">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-flocken-brown mb-6">
              Hundar skapar relationer mellan människor
            </h2>
            <p className="text-lg text-flocken-brown leading-relaxed mb-4">
              Det är kärnan i det vi gör. Inte teknik för teknikens skull, inte en app för att appen ska existera.
            </p>
            <p className="text-lg text-flocken-brown leading-relaxed">
              Flocken byggdes för att lösa ett problem vi själva levde med. Kanske är det just därför det känns mänskligt.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-gradient-to-br from-flocken-olive to-flocken-accent">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <h2 className="text-3xl lg:text-5xl font-bold text-white">
              Gå med i flocken
            </h2>
            <p className="text-xl text-white/90">
              Gratis att ladda ner. Prova och se vilka hundar som finns i närheten.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://play.google.com/store/apps/details?id=com.bastavan.app"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-flocken-olive rounded-xl font-semibold text-lg hover:bg-flocken-cream transition-all hover:scale-105 shadow-soft"
              >
                <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                </svg>
                Google Play
              </a>
              <a
                href="https://apps.apple.com/app/flocken/id6755424578"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-flocken-olive rounded-xl font-semibold text-lg hover:bg-flocken-cream transition-all hover:scale-105 shadow-soft"
              >
                <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C1.79 15.25 2.1 7.59 9.5 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                App Store
              </a>
            </div>
            <p className="text-white/70 text-sm">
              Har du frågor?{' '}
              <Link href="/support" className="underline hover:text-white transition-colors">
                Kontakta oss
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
