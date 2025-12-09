import { HeroBlock } from '@/components/marketing/HeroBlock';
import { FeatureBlock } from '@/components/marketing/FeatureBlock';
import { TestimonialBlock } from '@/components/marketing/TestimonialBlock';
import { CTABlock } from '@/components/marketing/CTABlock';
import Image from 'next/image';

export const metadata = {
  title: "Flocken - För ett bättre liv som hund",
  description: "Allt du behöver som hundägare på ett ställe. Para, Passa, Rasta, Besöka.",
  openGraph: {
    title: "Flocken - För ett bättre liv som hund",
    description: "Allt du behöver som hundägare på ett ställe",
    images: ['/assets/flocken/generated/hero.png'],
  },
};

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <HeroBlock
        title="Allt du behöver som hundägare"
        tagline="– på ett ställe"
        subtitle="Para, Passa, Rasta, Besöka. Fyra funktioner. En app. Tusentals svenska hundägare."
        ctaPrimary={{ text: "App Store", href: "#" }}
        ctaSecondary={{ text: "Google Play", href: "#" }}
        image="/assets/flocken/generated/flocken_image_malua-arlo-coco-jumping-dog-park_1x1.jpeg"
        launchOffer="Gratis i 6 månader för alla som skapar konto innan nyår"
      />
      
      {/* Community Section */}
      <section className="section-padding bg-flocken-sand" id="om-appen">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold text-flocken-brown mb-6">
                Allt du behöver på ett ställe
              </h2>
              <p className="text-lg text-flocken-brown leading-relaxed">
                Flocken samlar det du som hundägare behöver i vardagen. 
                Allt i en och samma app – enkelt, tryggt och gjort för svenska hundägare.
              </p>
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
          title="Hitta en partner som lever upp till dina standarder"
          subtitle="Inga gissningar. Bara verifierade profiler med hälsodata och tydliga avsikter."
          bullets={[
            "Filtrera på ras, storlek och hälsotester",
            "Se tik/hanhund tydligt på kartan",
            "Alla profiler BankID-verifierade",
            "Tryggare än Facebook-grupper"
          ]}
          screenshot="/assets/flocken/screenshots/flocken_para_karta-alla-hundar.png"
          badge="Hälsotester synliga direkt"
          microCta="Se hur Para fungerar"
          reverse={false}
        />
        
        {/* Feature: Passa - För Anna */}
        <FeatureBlock
          title="Som att lämna hos en vän"
          subtitle="Hitta trygga hundvakter i ditt närområde. Alla med recensioner från andra hundägare."
          bullets={[
            "Verifierade hundvakter med recensioner",
            "Träffas först innan bokning",
            "Byt passning kostnadsfritt med andra",
            "Tydligt försäkringsskydd"
          ]}
          screenshot="/assets/flocken/screenshots/flocken_passa_lista-personer-som-kan-passa.png"
          badge="Alla hundvakter recenserade"
          microCta="Hitta hundvakter"
          reverse={true}
        />
        
        {/* Quote Break - Jonas */}
        <section className="py-16 bg-flocken-cream">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto">
              <blockquote className="text-center">
                <p className="text-2xl lg:text-3xl font-semibold text-flocken-brown italic mb-4">
                  "Flocken är navet i mitt hundliv numera."
                </p>
                <footer className="text-flocken-gray">
                  — Jonas, erfaren hundägare med 2 hundar
                </footer>
              </blockquote>
            </div>
          </div>
        </section>
        
        {/* Feature: Rasta - För Anders */}
        <FeatureBlock
          title="Upptäck nya rastplatser varje dag"
          subtitle="Logga dina promenader, hitta nya rundor och se hur mycket din hund faktiskt rör sig."
          bullets={[
            "GPS-tracking med tydliga siffror (km, tid)",
            "Se färdiga rundor nära dig",
            "Samla poäng baserat på sträcka",
            "Dela dina favoriter med andra"
          ]}
          screenshot="/assets/flocken/screenshots/flocken_rasta_starta-promenad.png"
          microCta="Upptäck rastplatser"
          reverse={false}
        />
        
        {/* Feature: Besöka - För Alla */}
        <FeatureBlock
          title="Var är du välkommen med hunden?"
          subtitle="Den första kompletta kartan över hundvänliga ställen, byggd av svenska hundägare."
          bullets={[
            "Hundvänliga caféer, restauranger och barer",
            "Användare lägger till saknade platser",
            "Filtrera på kategori",
            "Byggs av hundägare för hundägare"
          ]}
          screenshot="/assets/flocken/screenshots/flocken_besoka_karta-alla.png"
          microCta="Hitta hundcaféer"
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
              <p className="text-flocken-brown">Allt på ett ställe istället för flera appar</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-flocken-sand rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-flocken-olive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-flocken-brown mb-2">Lugn och vuxen</h3>
              <p className="text-flocken-brown">Ingen social press, bara funktioner som fungerar</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-flocken-sand rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-flocken-olive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-flocken-brown mb-2">Svensk vardag</h3>
              <p className="text-flocken-brown">Gjord för hur vi lever här, med svenska hundägare i fokus</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials - Alla 4 personas */}
      <TestimonialBlock
        testimonials={[
          {
            quote: "Jag tänker inte para min hund med vem som helst. Med Flocken ser jag hälsotester direkt och vet att alla är verifierade.",
            author: "Marco",
            role: "Golden Retriever-ägare"
          },
          {
            quote: "När jag får en bild där hon sover gott hos hundvakten känns allt bra. Trygghet är allt för mig.",
            author: "Anna",
            role: "Bichon Havanais-ägare"
          },
          {
            quote: "Det bästa är när vi hittar nya favoritställen genom appen. Varje promenad blir ett litet äventyr.",
            author: "Anders",
            role: "Australian Shepherd-ägare"
          },
          {
            quote: "Flocken är navet i mitt hundliv numera. Allt jag behöver på ett ställe istället för att hoppa mellan olika appar.",
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
              Inte bara för ibland – för varje dag
            </h2>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
              <div className="space-y-2">
                <div className="w-12 h-12 mx-auto bg-flocken-sand rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-flocken-olive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <p className="font-semibold text-flocken-brown">Dagliga promenader</p>
              </div>
              
              <div className="space-y-2">
                <div className="w-12 h-12 mx-auto bg-flocken-sand rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-flocken-olive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <p className="font-semibold text-flocken-brown">Aktivt community</p>
              </div>
              
              <div className="space-y-2">
                <div className="w-12 h-12 mx-auto bg-flocken-sand rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-flocken-olive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <p className="font-semibold text-flocken-brown">Nya platser</p>
              </div>
              
              <div className="space-y-2">
                <div className="w-12 h-12 mx-auto bg-flocken-sand rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-flocken-olive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <p className="font-semibold text-flocken-brown">Passning & parning</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Final CTA */}
      <CTABlock
        title="Gå med i flocken idag"
        subtitle="En helt ny app som precis lanseras"
        ctaPrimary={{ text: "App Store", href: "#" }}
        ctaSecondary={{ text: "Google Play", href: "#" }}
        launchOffer="Gratis i 6 månader för alla som skapar konto innan nyår"
      />
    </>
  );
}

