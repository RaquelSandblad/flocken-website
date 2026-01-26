'use client';

import { HeroBlock } from '@/components/marketing/HeroBlock';
import { FeatureBlock } from '@/components/marketing/FeatureBlock';
import { TestimonialBlock } from '@/components/marketing/TestimonialBlock';
import { trackAppInstall } from '@/lib/tracking';
import Image from 'next/image';

export default function ValkommenPage() {
  return (
    <>
      {/* Hero */}
      <HeroBlock
        title="Ett enklare liv som hundägare"
        tagline="– ladda ner Flocken"
        subtitle="Underlätta vardagen som hundägare med funktionerna Para, Passa, Rasta och Besöka."
        ctaPrimary={{ text: "Ladda ner på Google Play", href: "https://play.google.com/store/apps/details?id=com.bastavan.app" }}
        ctaSecondary={{ text: "Ladda ner på AppStore", href: "https://apps.apple.com/app/flocken/id6755424578" }}
        image="/assets/flocken/generated/flocken_image_malua-arlo-coco-jumping-dog-park_1x1.jpeg"
        launchInfo="Nu samlar vi Sveriges alla hundägare i Flocken. Skapa ett konto och lägg upp din hund."
        launchOffer="Få gratis premiumfunktioner i 6 månader, gäller till den 28 februari."
        alignLeft={true}
      />
      
      {/* Community Section */}
      <section className="section-padding bg-flocken-sand" id="om-appen">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold text-flocken-brown mb-6">
                Allt för hundägare på ett ställe
              </h2>
              <p className="text-xl lg:text-2xl text-flocken-brown leading-relaxed mb-6">
                Fyra funktioner så att du slipper röriga grupper i sociala medier.
              </p>
              <ul className="space-y-3 text-lg text-flocken-brown mb-6">
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-flocken-olive flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span><span className="font-semibold">Para</span> – Hitta en lekkamrat eller parningspartner till din hund</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-flocken-olive flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span><span className="font-semibold">Passa</span> – Hitta en hundvakt du är trygg med</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-flocken-olive flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span><span className="font-semibold">Rasta</span> – Registrera dina promenader och dela med andra</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-flocken-olive flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span><span className="font-semibold">Besöka</span> – Karta med hundvänliga caféer och restauranger</span>
                </li>
              </ul>
              <a 
                href="/funktioner" 
                className="inline-block text-flocken-olive hover:text-flocken-brown font-semibold text-lg transition-colors"
              >
                Läs mer om funktionerna i Flocken →
              </a>
            </div>
            <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-card">
              <Image
                src="/assets/flocken/generated/flocken_image_malua-arlo-coco-chasing-ball_16x9.jpeg"
                alt="Hundägare med sina hundar i hundparken"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>
      
      <div id="funktioner">
        {/* Feature: Para - För Marco */}
        <FeatureBlock
          title="Hitta en lekkamrat eller parningspartner till din hund"
          subtitle="Enkel filtrering efter dina kriterier - slipp röriga grupper i sociala medier. Chatta direkt med hundägare i appen."
          bullets={[
            "Se alla hundar på en karta",
            "Filtrera på ras, kön, stad och mycket mer",
            "Se om hunden är öppen för parning",
            "Mycket enklare än sociala medie-grupper"
          ]}
          screenshot="/assets/flocken/screenshots/flocken_para_karta-alla-hundar.png"
          reverse={false}
        />
        
        {/* Feature: Passa - För Anna */}
        <FeatureBlock
          title="Hitta en hundvakt du och din hund är trygga med"
          subtitle="Välj rätt hundvakt eller passa varandras hundar."
          bullets={[
            "Välj mellan hundvakter med tydliga profiler",
            "Ta kontakt direkt i appen",
            "Byt passning kostnadsfritt med andra",
            "Annonsera dina egna passningstjänster"
          ]}
          screenshot="/assets/flocken/screenshots/flocken_passa_yasmin.png"
          reverse={true}
        />
        
        {/* Feature: Rasta - För Anders */}
        <FeatureBlock
          title="Registrera dina rundor och hur långt du går"
          subtitle="Logga dina promenader, hitta nya rundor och se hur mycket din hund rör sig."
          bullets={[
            "GPS-tracking för att spara dina rundor",
            "Dela med andra och gå andras rundor",
            "Markera dina favoriter",
            "Samla kilometer och få belöningar"
          ]}
          screenshot="/assets/flocken/screenshots/flocken_rasta_starta-promenad.png"
          reverse={false}
        />
        
        {/* Feature: Besöka - För Alla */}
        <FeatureBlock
          title="Var är du välkommen att ta med hunden?"
          subtitle="Karta med caféer, restauranger och barer som välkomnar hundar"
          bullets={[
            "Alla hundvänliga verksamheter från Google Maps",
            "Lägg till egna ställen för att tipsa andra",
            "Perfekt när du är ute och reser",
            "Skapa din lista med favoriter"
          ]}
          screenshot="/assets/flocken/screenshots/flocken_besoka_karta-alla.png"
          reverse={true}
        />
      </div>
      
      {/* USPs */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-flocken-brown mb-4">
              Varför Flocken?
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-flocken-sand rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-flocken-olive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-flocken-brown mb-2">Helhetsplattform</h3>
              <p className="text-flocken-brown">Slipp en massa olika appar och att leta i facebook-grupper.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-flocken-sand rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-flocken-olive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-flocken-brown mb-2">Lugn och vuxen</h3>
              <p className="text-flocken-brown">Ingen social press, utan praktiska funktioner på dina villkor.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-flocken-sand rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-flocken-olive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-flocken-brown mb-2">Svensk vardag</h3>
              <p className="text-flocken-brown">Appen är framtagen av svenska hundägare för svenska hundägare</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials - Anders och Jonas */}
      <TestimonialBlock
        testimonials={[
          {
            quote: "Fantastiskt att hitta nya favoritställen genom appen, så att hunden kan följa med på stan.",
            author: "Anders",
            role: "Australian Shepherd-ägare"
          },
          {
            quote: "Flocken är navet i mitt hundliv numera. Otroligt mycket smidigare än grupper i sociala medier.",
            author: "Jonas",
            role: "Blandras-ägare"
          }
        ]}
      />
      
      {/* Retention Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-4xl lg:text-5xl font-bold text-flocken-brown">
              För daglig användning och specifika tillfällen
            </h2>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
              <div className="space-y-2">
                <div className="w-12 h-12 mx-auto bg-flocken-sand rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-flocken-olive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <p className="font-semibold text-flocken-brown">Promenader och rastrundor</p>
              </div>
              
              <div className="space-y-2">
                <div className="w-12 h-12 mx-auto bg-flocken-sand rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-flocken-olive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <p className="font-semibold text-flocken-brown">Kontakta hundägare</p>
              </div>
              
              <div className="space-y-2">
                <div className="w-12 h-12 mx-auto bg-flocken-sand rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-flocken-olive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <p className="font-semibold text-flocken-brown">Verksamheter som tar emot hundar</p>
              </div>
              
              <div className="space-y-2">
                <div className="w-12 h-12 mx-auto bg-flocken-sand rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-flocken-olive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <p className="font-semibold text-flocken-brown">Passning, parning och lek</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Final CTA */}
      <section className="section-padding bg-gradient-to-br from-flocken-olive to-flocken-accent">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl lg:text-6xl font-bold text-white">
                Gå med i flocken idag
              </h2>
              <p className="text-xl text-white/90">
                Ladda ner appen, skapa ditt konto och lägg upp din hund
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="https://play.google.com/store/apps/details?id=com.bastavan.app" 
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-flocken-olive rounded-xl font-semibold text-lg hover:bg-flocken-cream transition-all hover:scale-105 shadow-soft"
                  onClick={() => trackAppInstall('android', 'final_cta')}
                >
                  {/* Google Play icon */}
                  <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                  </svg>
                  Ladda ner på Google Play
                </a>
                
                <a 
                  href="https://apps.apple.com/app/flocken/id6755424578" 
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-flocken-olive rounded-xl font-semibold text-lg hover:bg-flocken-cream transition-all hover:scale-105 shadow-soft"
                  onClick={() => trackAppInstall('ios', 'final_cta')}
                >
                  {/* App Store icon */}
                  <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C1.79 15.25 2.1 7.59 9.5 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                  </svg>
                  Ladda ner på AppStore
                </a>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-2xl mx-auto mb-8">
                <p className="text-lg text-white font-semibold">
                  Just nu: Gratis premiumfunktioner i 6 månader (gäller till den 28 februari)
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}


