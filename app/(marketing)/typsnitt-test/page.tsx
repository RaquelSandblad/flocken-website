import { Inter, DM_Sans, Plus_Jakarta_Sans, Outfit, Sora, Space_Grotesk, Manrope, Nunito, Quicksand, Poppins, Comfortaa } from 'next/font/google';

// Ladda alla typsnitt
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans' });
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-jakarta' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });
const sora = Sora({ subsets: ['latin'], variable: '--font-sora' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space' });
const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope' });
const nunito = Nunito({ subsets: ['latin'], variable: '--font-nunito' });
const quicksand = Quicksand({ subsets: ['latin'], variable: '--font-quicksand' });
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '600', '700'], variable: '--font-poppins' });
const comfortaa = Comfortaa({ subsets: ['latin'], variable: '--font-comfortaa' });

export const metadata = {
  title: "Typsnitt Test - Flocken",
  robots: "noindex, nofollow",
};

const fonts = [
  { name: 'Inter (Nuvarande)', class: inter.className, desc: 'Neutral, modern, mycket läsbar' },
  { name: 'Sora ⭐', class: sora.className, desc: 'Mjuk, humanistisk, organisk känsla' },
  { name: 'Manrope ⭐', class: manrope.className, desc: 'Modernt humanistiskt, behaglig läsning' },
  { name: 'Nunito 🔥', class: nunito.className, desc: 'MYCKET runda hörn (F, T, E) - väldigt vänlig!' },
  { name: 'Quicksand', class: quicksand.className, desc: 'Geometrisk + rund, jämna kurvor' },
  { name: 'Poppins', class: poppins.className, desc: 'Rundare terminaler än Manrope, perfekt balans' },
  { name: 'Comfortaa', class: comfortaa.className, desc: 'SUPER rund - max organisk känsla' },
  { name: 'DM Sans', class: dmSans.className, desc: 'Varm, modern, läsbar - perfekt för hundappar!' },
  { name: 'Plus Jakarta Sans', class: jakarta.className, desc: 'Rundare hörn, mer lekfull och vänlig' },
  { name: 'Outfit', class: outfit.className, desc: 'Geometrisk men varm, unik personlighet' },
  { name: 'Space Grotesk', class: spaceGrotesk.className, desc: 'Tech-känsla men varm och modern' },
];

const loremShort = "Flocken är appen där hundar och deras människor hittar varandra. Hundar, passa, rasta och besöka – allt samlas här.";

const loremMedium = "Flocken är appen där hundar och deras människor hittar varandra. Hitta lekkamrater och parningspartners till din hund, pålitliga hundvakter när livet krånglar, upptäck nya promenadrunor och hundvänliga caféer. Allt samlas på ett ställe – för ett bättre liv som hund.";

const loremLong = "Flocken är appen där hundar och deras människor hittar varandra. Hitta lekkamrater och parningspartners till din hund, pålitliga hundvakter när livet krånglar, upptäck nya promenadrunor och hundvänliga caféer. Allt samlas på ett ställe – för ett bättre liv som hund. Vi vet att hundar är familjemedlemmar som förtjänar det bästa. Därför har vi skapat Flocken – en app byggd för hundars behov och ägares trygghet.";

export default function TypsnittTestPage() {
  return (
    <div className="bg-flocken-cream py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-card p-8 mb-8">
          <h1 className="text-4xl font-bold text-flocken-brown mb-4">Typsnitt-test för Flocken</h1>
          <p className="text-flocken-gray mb-6">
            Scrolla igenom alla typsnitt och se vilket som känns bäst för Flockens personlighet. 
            Jämför läsbarhet, känsla och hur varje typsnitt kommunicerar värme och trygghet.
          </p>
          <div className="flex gap-4 text-sm text-flocken-gray">
            <div className="flex items-center gap-2">
              <span>🔥</span>
              <span>= Rekommenderat</span>
            </div>
            <div className="flex items-center gap-2">
              <span>✅</span>
              <span>= Nuvarande (Inter)</span>
            </div>
          </div>
        </div>

        {fonts.map((font, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-card p-8 mb-8">
            <div className="border-b border-flocken-sand pb-4 mb-6">
              <h2 className={`text-3xl font-bold text-flocken-brown mb-2 ${font.class}`}>
                {font.name}
              </h2>
              <p className="text-sm text-flocken-gray italic">{font.desc}</p>
            </div>

            {/* Display/Hero size */}
            <div className="mb-8">
              <p className="text-xs text-flocken-gray uppercase tracking-wide mb-2">Display (Hero)</p>
              <h3 className={`text-5xl font-bold text-flocken-brown leading-tight ${font.class}`}>
                För ett bättre liv som hund
              </h3>
            </div>

            {/* H1 size */}
            <div className="mb-8">
              <p className="text-xs text-flocken-gray uppercase tracking-wide mb-2">H1 (Rubriker)</p>
              <h4 className={`text-4xl font-bold text-flocken-brown ${font.class}`}>
                Hitta hundar i din närhet
              </h4>
            </div>

            {/* H2 size */}
            <div className="mb-8">
              <p className="text-xs text-flocken-gray uppercase tracking-wide mb-2">H2 (Underrubriker)</p>
              <h5 className={`text-2xl font-semibold text-flocken-brown ${font.class}`}>
                Hundar, passa, rasta och besöka
              </h5>
            </div>

            {/* Body - Short */}
            <div className="mb-6">
              <p className="text-xs text-flocken-gray uppercase tracking-wide mb-2">Body Text - Kort stycke</p>
              <p className={`text-lg text-flocken-brown leading-relaxed ${font.class}`}>
                {loremShort}
              </p>
            </div>

            {/* Body - Medium */}
            <div className="mb-6">
              <p className="text-xs text-flocken-gray uppercase tracking-wide mb-2">Body Text - Medium stycke</p>
              <p className={`text-base text-flocken-brown leading-relaxed ${font.class}`}>
                {loremMedium}
              </p>
            </div>

            {/* Body - Long (Legal style) */}
            <div className="mb-6">
              <p className="text-xs text-flocken-gray uppercase tracking-wide mb-2">Body Text - Långt stycke (Legal)</p>
              <p className={`text-base text-flocken-brown leading-relaxed ${font.class}`}>
                {loremLong}
              </p>
            </div>

            {/* Small text */}
            <div className="mb-6">
              <p className="text-xs text-flocken-gray uppercase tracking-wide mb-2">Small Text (Footer, finteprint)</p>
              <p className={`text-sm text-flocken-gray ${font.class}`}>
                © 2025 Spitakolus AB. Alla rättigheter förbehållna.
              </p>
            </div>

            {/* Button preview */}
            <div className="flex gap-4 flex-wrap">
              <button className={`bg-flocken-olive text-white px-6 py-3 rounded-full font-semibold hover:bg-flocken-accent transition ${font.class}`}>
                Ladda ner Flocken
              </button>
              <button className={`border-2 border-flocken-olive text-flocken-olive px-6 py-3 rounded-full font-semibold hover:bg-flocken-olive hover:text-white transition ${font.class}`}>
                Läs mer
              </button>
            </div>
          </div>
        ))}

        {/* Decision helper */}
        <div className="bg-flocken-olive text-white rounded-2xl p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Vilket typsnitt känns rätt?</h2>
          <p className="text-lg opacity-90 mb-6">
            Tänk på: Vilket kommunicerar bäst Flockens värderingar? Vilken är behagligast att läsa? 
            Vilket ger rätt känsla av värme, trygghet och hundglädje?
          </p>
          <p className="text-sm opacity-75">
            Tipsa mig i chatten vilket du gillar så byter vi på 2 minuter! 🚀
          </p>
        </div>
      </div>
    </div>
  );
}

