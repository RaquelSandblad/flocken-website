'use client';

import { useRef } from 'react';
import { VideoInPhone } from '@/components/marketing/VideoInPhone';

export default function FunktionerPage() {
  const paraRef = useRef<HTMLElement>(null);
  const passaRef = useRef<HTMLElement>(null);
  const rastaRef = useRef<HTMLElement>(null);
  const besokaRef = useRef<HTMLElement>(null);
  const minaSidorRef = useRef<HTMLElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLElement>) => {
    if (ref.current) {
      const headerOffset = 100;
      const elementPosition = ref.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      {/* Hero/Intro Section */}
      <section className="section-padding bg-gradient-to-br from-flocken-olive to-flocken-accent pt-32">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6">
              Flockens funktioner
            </h1>
            <p className="text-xl lg:text-2xl text-white/90 leading-relaxed">
              Flocken underlättar livet som hundägare med fyra funktioner. Här visar vi vad du kan göra i appen.
            </p>
            <p className="text-lg text-white/80">
              Alla funktioner är enkelt tillgängliga i samma app via flikar.
            </p>
          </div>
        </div>
      </section>

      {/* Navigation Menu */}
      <section className="sticky top-20 z-40 bg-white/95 backdrop-blur-sm border-b border-flocken-sand shadow-soft">
        <div className="container-custom">
          <nav className="flex flex-nowrap justify-center gap-2 sm:gap-4 py-4 overflow-x-auto">
            <button
              onClick={() => scrollToSection(paraRef)}
              className="px-3 sm:px-6 py-2 text-flocken-brown hover:text-flocken-olive bg-flocken-cream rounded-lg font-semibold transition-all whitespace-nowrap flex-shrink-0"
            >
              Para
            </button>
            <button
              onClick={() => scrollToSection(passaRef)}
              className="px-3 sm:px-6 py-2 text-flocken-brown hover:text-flocken-olive bg-flocken-cream rounded-lg font-semibold transition-all whitespace-nowrap flex-shrink-0"
            >
              Passa
            </button>
            <button
              onClick={() => scrollToSection(rastaRef)}
              className="px-3 sm:px-6 py-2 text-flocken-brown hover:text-flocken-olive bg-flocken-cream rounded-lg font-semibold transition-all whitespace-nowrap flex-shrink-0"
            >
              Rasta
            </button>
            <button
              onClick={() => scrollToSection(besokaRef)}
              className="px-3 sm:px-6 py-2 text-flocken-brown hover:text-flocken-olive bg-flocken-cream rounded-lg font-semibold transition-all whitespace-nowrap flex-shrink-0"
            >
              Besöka
            </button>
          </nav>
        </div>
      </section>

      {/* Para Section */}
      <section 
        ref={paraRef}
        id="para"
        className="section-padding bg-white scroll-mt-24"
      >
        <div className="container-custom">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl lg:text-5xl font-bold text-flocken-brown mb-4">
                Para
              </h2>
              <p className="text-xl text-flocken-brown max-w-3xl mx-auto mb-2">
                Hitta en lekkamrat eller parningspartner till din hund. Genom att filtrera på kön, storlek, ort och ras blir det enkelt att matcha rätt.
              </p>
              <p className="text-lg text-flocken-brown/80 max-w-3xl mx-auto">
                Det här är någonting annat än röriga grupper på sociala medier.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-start mb-12">
              {/* Video */}
              <div className="relative w-full max-w-sm mx-auto lg:sticky lg:top-32">
                <VideoInPhone
                  src="/assets/flocken/videos/para.mp4"
                  poster="/assets/flocken/screenshots/flocken_para_karta-alla-hundar.png"
                />
              </div>

              {/* Information */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold text-flocken-brown mb-6">
                    Så fungerar funktionen Para
                  </h3>
                  
                  <div className="space-y-4 text-flocken-brown">
                    <p>
                      Se alla hundar på kartan och klicka på den hund du är nyfiken på.
                    </p>
                    
                    <p>
                      Använd filtreringen via sökknappen för att rensa kartan och se de hundar som passar dig. I listvyn får du en mer strukturerad översyn.
                    </p>
                    
                    <p>
                      Förutom uppgifter om hunden går det att markera:
                    </p>
                    
                    <ul className="space-y-2 ml-4">
                      <li className="flex items-start gap-3">
                        <span className="text-flocken-olive mt-1">•</span>
                        <span>Intresse av parning</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-flocken-olive mt-1">•</span>
                        <span>Om man söker lekkamrat</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-flocken-olive mt-1">•</span>
                        <span>Utbyte av hundpassning</span>
                      </li>
                    </ul>
                    
                    <p>
                      Det finns även en beskrivning av hunden och ägaren kan berätta mer om hundens temperament.
                    </p>
                    
                    <p>
                      Längs ner på hundkortet finns möjlighet att ta direktkontakt med ägaren via en chatt.
                    </p>
                    
                    <p>
                      Du kan favoritmarkera hundar och se dina favoriter i en lista.
                    </p>
                    
                    <div className="bg-flocken-cream rounded-xl p-4 mt-6">
                      <p className="text-sm text-flocken-brown/90">
                        <strong className="text-flocken-brown">Viktigt:</strong> När du lägger upp en hund på kartan kommer inte din exakta adress att visas. Hunden placeras slumpmässigt inom ditt postnummer, så att du kan se vilka hundar som finns inom ett visst område.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Passa Section */}
      <section 
        ref={passaRef}
        id="passa"
        className="section-padding bg-flocken-cream scroll-mt-24"
      >
        <div className="container-custom">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl lg:text-5xl font-bold text-flocken-brown mb-4">
                Passa
              </h2>
              <p className="text-xl text-flocken-brown max-w-3xl mx-auto">
                Hitta en hundvakt du och din hund är trygga med.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-start mb-12">
              {/* Information */}
              <div className="space-y-8 lg:order-2">
                <div>
                  <h3 className="text-2xl font-bold text-flocken-brown mb-6">
                    Så fungerar funktionen Passa
                  </h3>
                  
                  <div className="space-y-4 text-flocken-brown">
                    <p>
                      Hunddagis och privatpersoner som annonserar sina tjänster för hundpassning visas på kartan eller som en lista.
                    </p>
                    
                    <p>
                      Via sökfunktionen kan du filtrera på hundvakter som matchar dina behov. Om du till exempel behöver hjälp med övernattning, en hundvakt som gör hembesök eller enskilda promenader.
                    </p>
                    
                    <p>
                      Du kan även få upp lista över hundvakter och hunddagis inom en viss radie från din bostad.
                    </p>
                    
                    <p>
                      På hundvaktens profil kan du se prisbild och tillgänglighet.
                    </p>
                    
                    <p>
                      Ta kontakt direkt via telefon eller appens chatt, eller skicka en bokningsförfrågan.
                    </p>
                    
                    <p>
                      I funktionen passa ser du inte andra hundägare som är intresserade av att byta hundvaktstjänster. Dessa hittar du i Para där du klickar i "intresserad av att dela hundpassning" i sökfunktionen.
                    </p>
                    
                    <div className="bg-white rounded-xl p-4 mt-6">
                      <p className="text-sm text-flocken-brown/90">
                        <strong className="text-flocken-brown">Viktigt:</strong> Appen hjälper hundägare och hundvakter eller hunddagis att hitta varandra och att boka en tid. Tänk på att Flocken aldrig reglerar någonting annat mellan er som avtal, försäkringar eller betalningar.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Video */}
              <div className="relative w-full max-w-sm mx-auto lg:order-1 lg:sticky lg:top-32">
                <VideoInPhone
                  src="/assets/flocken/videos/passa.mp4"
                  poster="/assets/flocken/screenshots/flocken_screens_passa_agneta-preview-b.png"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rasta Section */}
      <section 
        ref={rastaRef}
        id="rasta"
        className="section-padding bg-white scroll-mt-24"
      >
        <div className="container-custom">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl lg:text-5xl font-bold text-flocken-brown mb-4">
                Rasta
              </h2>
              <p className="text-xl text-flocken-brown max-w-3xl mx-auto">
                Registrera dina rastrundor och dela dem med andra.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-start mb-12">
              {/* Video */}
              <div className="relative w-full max-w-sm mx-auto lg:sticky lg:top-32">
                <VideoInPhone
                  src="/assets/flocken/videos/rasta.mp4"
                  poster="/assets/flocken/screenshots/flocken_rasta_starta-promenad.png"
                />
              </div>

              {/* Information */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold text-flocken-brown mb-6">
                    Så fungerar funktionen Rasta
                  </h3>
                  
                  <div className="space-y-4 text-flocken-brown">
                    <p>
                      I Rasta kan du registrera din rastrunda och gå dina sparade rundor. Du kan även välja att dela dem med andra hundägare. Du kan sedan se statistik över de rundor som du har gått.
                    </p>
                    
                    <p>
                      Rasta kan inspirera dig att ta nya vägar om du känner att promenaden du går med din hund har blivit lite för mycket rutin. Genom att spara flera rundor kan du välja i din lista för att få variation. Du kan även välja att följa andras rundor.
                    </p>
                    
                    <p>
                      Klicka på "skapa ny promenad" när du är i Rasta. Då målas promenaden upp som en linje på kartan. Avsluta när du är framme och spara. Promenaden läggs till i listan över dina promenader och du kan välja att följa samma promenad igen.
                    </p>
                    
                    <p>
                      Under <em>Mina sidor</em> &gt; <em>Promenadstatistik</em> kan du se hur många promenader du har gått och hur långt. Du kommer även att få poäng för genomförda promenader och nå nya nivåer.
                    </p>
                    
                    <div className="bg-flocken-cream rounded-xl p-4 mt-6">
                      <p className="text-sm text-flocken-brown/90">
                        <strong className="text-flocken-brown">Viktigt:</strong> Du behöver aktivera GPS:en på din mobil för att kunna registrera en promenad. Din platsdata delas aldrig med andra användare. Du kan enkelt välja om en promenad ska visas för andra eller vara privat för enbart dig.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Besöka Section */}
      <section 
        ref={besokaRef}
        id="besoka"
        className="section-padding bg-flocken-cream scroll-mt-24"
      >
        <div className="container-custom">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl lg:text-5xl font-bold text-flocken-brown mb-4">
                Besöka
              </h2>
              <p className="text-xl text-flocken-brown max-w-3xl mx-auto">
                Hitta verksamheter där hundar är välkomna. Sök på caféer, restauranger och barer som du och din hund kan besöka tillsammans.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-start mb-12">
              {/* Information */}
              <div className="space-y-8 lg:order-2">
                <div>
                  <h3 className="text-2xl font-bold text-flocken-brown mb-6">
                    Så fungerar funktionen Besöka
                  </h3>
                  
                  <div className="space-y-4 text-flocken-brown">
                    <p>
                      Alternativen som hundägare kan begränsas av att hundar inte alltid är välkomna. Med Besöka blir det enklare att ta med sig hunden.
                    </p>
                    
                    <p>
                      Via sökfunktionen kan du välja den verksamhet som du letar efter och se dem på kartan. Genom att filtrera på stad och sedan välja listvyn kan du se ditt urval i en stad som du kommer att besöka.
                    </p>
                    
                    <p>
                      Alla hundvänliga verksamheter från Google Maps visas i Besöka. Men för att göra kartan ännu mer komplett går det även för användare av Flocken att lägga till fler verksamheter via +-tecknet nere till höger.
                    </p>
                    
                    <p>
                      Det går även att lägga in sin egen kommentar under en verksamhet som du har besökt för att informera andra om hur bra eller hundvänligt stället är. Det gör att Flockens medlemmar kan hjälpa varandra att underlätta livet som hundägare.
                    </p>
                  </div>
                </div>
              </div>

              {/* Video */}
              <div className="relative w-full max-w-sm mx-auto lg:order-1 lg:sticky lg:top-32">
                <VideoInPhone
                  src="/assets/flocken/videos/besoka.mp4"
                  poster="/assets/flocken/screenshots/flocken_besoka_karta-alla.png"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mina sidor Section */}
      <section 
        ref={minaSidorRef}
        id="mina-sidor"
        className="section-padding bg-white scroll-mt-24"
      >
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl lg:text-5xl font-bold text-flocken-brown mb-4">
                Mina sidor
              </h2>
              <p className="text-lg text-flocken-brown/80 max-w-2xl mx-auto">
                Under Mina sidor hittar du inställningar och funktioner för att hantera ditt konto och dina hundar.
              </p>
            </div>

            <div className="space-y-12">
              {/* Lägga upp en hund */}
              <div className="bg-flocken-cream rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-flocken-brown mb-4">
                  Lägga upp en hund
                </h3>
                <div className="space-y-3 text-flocken-brown">
                  <p>
                    Under mina sidor kan du lägga upp en ny hund på ditt konto så att den syns på kartan och blir sökbar för andra.
                  </p>
                  <p>
                    Även om många fält inte är obligatoriska så försök att fylla i så mycket som möjligt. Det gör att din hund kommer att synas i fler sökningar och det blir lättare för andra hundägare att lära känna din hund.
                  </p>
                  <p>
                    Om din hund är tillgänglig för parning kommer du att få fylla i extra information som kan vara bra att känna till.
                  </p>
                  <p className="text-sm text-flocken-brown/80 mt-4">
                    Andra hundägare kommer inte att kunna se var du bor, hunden placeras slumpmässigt inom ditt postnummerområde.
                  </p>
                </div>
              </div>

              {/* Bokningar */}
              <div className="bg-white border-2 border-flocken-sand rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-flocken-brown mb-4">
                  Bokningar
                </h3>
                <p className="text-flocken-brown">
                  Om du har bokat hundpassning via Passa så hittar du kommande och tidigare bokningar här.
                </p>
              </div>

              {/* Promenadstatistik */}
              <div className="bg-white border-2 border-flocken-sand rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-flocken-brown mb-4">
                  Promenadstatistik
                </h3>
                <div className="space-y-3 text-flocken-brown">
                  <p>
                    Om du registrerar dina promenader i funktionen Rasta så kan du se din statistik här för hur många promenader du har gått, den totala distansen och hur mycket du går i genomsnitt.
                  </p>
                  <p>
                    Du ser även din promenadpoäng som baseras på antal rastrundor och distans.
                  </p>
                </div>
              </div>

              {/* Inställningar */}
              <div className="bg-flocken-cream rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-flocken-brown mb-4">
                  Inställningar
                </h3>
                <div className="space-y-4 text-flocken-brown">
                  <p>
                    Under inställningar kan du se vilken typ av konto och prenumeration du har, samt giltighetstiden.
                  </p>
                  <p>
                    Du kan ändra dina personuppgifter och ditt lösenord.
                  </p>
                  <p>
                    Det finns en delningsknapp för att du enkelt ska kunna bjuda in dina vänner och bekanta med hund till Flocken.
                  </p>
                  <p>
                    Se integritetspolicy och användarvillkor.
                  </p>
                  <p>
                    Du kan göra inställningar för notifieringar så att du enkelt ser om det kommit ett meddelande i chatten.
                  </p>
                  <div className="bg-white rounded-xl p-4 mt-4">
                    <p className="text-sm text-flocken-brown/90">
                      <strong className="text-flocken-brown">Viktigt:</strong> Du kan även radera ditt konto på Flocken. Tänk på att allt du sparat kommer att försvinna och din data kan inte återställas. Betalda prenumerationsavgifter kommer inte att betalas tillbaka om du väljer att radera ditt konto.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-br from-flocken-olive to-flocken-accent">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl lg:text-5xl font-bold text-white">
                Redo att komma igång?
              </h2>
              <p className="text-xl text-white/90">
                Ladda ner appen och skapa ditt konto för att börja använda alla funktioner
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="https://play.google.com/store/apps/details?id=com.bastavan.app" 
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-flocken-olive rounded-xl font-semibold text-lg hover:bg-flocken-cream transition-all hover:scale-105 shadow-soft"
              >
                <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                </svg>
                Ladda ner på Google Play
              </a>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-2xl mx-auto">
              <p className="text-lg text-white font-semibold">
                Just nu: Gratis premiumfunktioner i 6 månader (gäller till den 31 januari)
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
