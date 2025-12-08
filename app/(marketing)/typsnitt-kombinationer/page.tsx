import { Source_Serif_4, Public_Sans, Epilogue, Sora, Manrope, DM_Sans, Inter, Nunito, Bricolage_Grotesque, Spectral } from 'next/font/google';

// Ladda typsnitt
const sourceSerif = Source_Serif_4({ subsets: ['latin'], variable: '--font-source-serif' });
const publicSans = Public_Sans({ subsets: ['latin'], variable: '--font-public-sans' });
const epilogue = Epilogue({ subsets: ['latin'], variable: '--font-epilogue' });
const sora = Sora({ subsets: ['latin'], variable: '--font-sora' });
const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope' });
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const nunito = Nunito({ subsets: ['latin'], variable: '--font-nunito' });
const bricolage = Bricolage_Grotesque({ subsets: ['latin'], variable: '--font-bricolage' });
const spectral = Spectral({ subsets: ['latin'], weight: ['400', '600', '700'], variable: '--font-spectral' });

export const metadata = {
  title: "Typsnitt-kombinationer Test - Flocken",
  robots: "noindex, nofollow",
};

const packages = [
  {
    name: 'Paket A 🔥',
    heading: 'Source Serif 4',
    body: 'Public Sans',
    headingClass: sourceSerif.className,
    bodyClass: publicSans.className,
    desc: 'Varmt, vuxet, lätt att lita på. Serif ger förtroende, sans-serif ger modernitet.',
    vibe: '💝 Trygghet + 🌿 Organisk + 👔 Vuxen',
    bestFor: 'Perfekt för parning och hundvakt - bygger förtroende',
  },
  {
    name: 'Paket B',
    heading: 'Epilogue',
    body: 'Public Sans',
    headingClass: epilogue.className,
    bodyClass: publicSans.className,
    desc: 'Rent, modernt, vänligt. App-känsla 2025 utan att bli överdesignad.',
    vibe: '🚀 Modern + ✨ Clean + 🎯 Fokuserad',
    bestFor: 'Om du vill kännas som en premium app',
  },
  {
    name: 'Paket C ⭐',
    heading: 'Sora',
    body: 'Manrope',
    headingClass: sora.className,
    bodyClass: manrope.className,
    desc: 'Båda mjuka och humanistiska. Organisk värme genom hela sajten.',
    vibe: '🌸 Mjuk + 🤗 Varm + 🌾 Naturlig',
    bestFor: 'Dina två favoriter! Väldigt harmonisk och vänlig.',
  },
  {
    name: 'Paket D',
    heading: 'DM Sans',
    body: 'Inter',
    headingClass: dmSans.className,
    bodyClass: inter.className,
    desc: 'DM Sans ger personlighet på rubriker, Inter är superläsbar i text.',
    vibe: '💼 Professionell + 📖 Läsbar + 🎨 Balanserad',
    bestFor: 'Bra för mycket text (legal pages) men ändå personlighet',
  },
  {
    name: 'Paket E',
    heading: 'Nunito',
    body: 'Public Sans',
    headingClass: nunito.className,
    bodyClass: publicSans.className,
    desc: 'Runda rubriker (väldigt vänliga!) med clean bodytext.',
    vibe: '😊 Vänlig + 🎈 Lekfull + ☀️ Glad',
    bestFor: 'Om du vill ha max rundhet utan att bli för cute',
  },
  {
    name: 'Paket F',
    heading: 'Bricolage Grotesque',
    body: 'Manrope',
    headingClass: bricolage.className,
    bodyClass: manrope.className,
    desc: 'Unik personlighet på rubriker, varm och läsbar body.',
    vibe: '🎭 Unik + 🌟 Karaktär + 🎪 Speciell',
    bestFor: 'Om Flocken ska sticka ut från andra djurappar',
  },
  {
    name: 'Paket G (Alt Serif)',
    heading: 'Spectral',
    body: 'Public Sans',
    headingClass: spectral.className,
    bodyClass: publicSans.className,
    desc: 'Mjukare serif än Source Serif. Mer "storytelling", mindre formell.',
    vibe: '📚 Berättande + 💫 Elegant + 🕊️ Mjuk',
    bestFor: 'Om Source Serif känns för "stram"',
  },
];

const heroText = "För ett bättre liv som hund";
const tagline = "Flocken – där hundar och människor hittar varandra";
const bodyShort = "Flocken är appen där hundar och deras människor hittar varandra. Para, passa, rasta och besöka – allt samlas här.";
const bodyMedium = "Flocken är appen där hundar och deras människor hittar varandra. Para din hund med andra hundar i närheten, hitta pålitliga hundvakter när livet krånglar, upptäck nya promenadrunor och hitta hundvänliga caféer. Allt samlas på ett ställe – för ett bättre liv som hund.";
const bodyLegal = "Du har rätt att få bekräftelse på om vi behandlar dina personuppgifter och få en kopia av dem. I appen under Inställningar kan du exportera din data i JSON-format. Du kan när som helst begära tillgång till dina uppgifter genom att kontakta oss på support@spitakolus.com.";

export default function KombinationerTestPage() {
  return (
    <div className="bg-flocken-cream py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-card p-8 mb-8">
          <h1 className="text-4xl font-bold text-flocken-brown mb-4">Typsnitt-kombinationer för Flocken</h1>
          <p className="text-flocken-gray mb-6">
            Här testas <strong>kombinationer</strong> av typsnitt: ett för rubriker/hero och ett för brödtext/UI. 
            Detta ger mer dynamik och personlighet än att bara använda ett typsnitt överallt.
          </p>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="bg-flocken-sand p-4 rounded-lg">
              <h3 className="font-semibold mb-2">🎯 Vad du ska kolla:</h3>
              <ul className="space-y-1 text-flocken-gray">
                <li>• Fungerar hero/rubriker tillsammans med brödtext?</li>
                <li>• Känns det sammanhängande eller för olika?</li>
                <li>• Vilken vibe får du av kombinationen?</li>
                <li>• Läsbarhet i både kort och lång text?</li>
              </ul>
            </div>
            <div className="bg-flocken-sand p-4 rounded-lg">
              <h3 className="font-semibold mb-2">💡 Tips:</h3>
              <ul className="space-y-1 text-flocken-gray">
                <li>• Serif på rubriker = mer förtroende/värme</li>
                <li>• Sans-serif på body = modernitet/läsbarhet</li>
                <li>• Två sans-serif = clean, konsekvent app-känsla</li>
                <li>• Tänk: Vad kommunicerar detta till hundägare?</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Packages */}
        {packages.map((pkg, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-card p-8 mb-8">
            {/* Header */}
            <div className="border-b border-flocken-sand pb-6 mb-6">
              <h2 className="text-3xl font-bold text-flocken-brown mb-3">
                {pkg.name}
              </h2>
              <div className="flex flex-wrap gap-4 mb-3">
                <div className="bg-flocken-sand px-4 py-2 rounded-full">
                  <span className="text-sm text-flocken-gray">Rubriker: </span>
                  <span className="font-semibold text-flocken-brown">{pkg.heading}</span>
                </div>
                <div className="bg-flocken-sand px-4 py-2 rounded-full">
                  <span className="text-sm text-flocken-gray">Brödtext: </span>
                  <span className="font-semibold text-flocken-brown">{pkg.body}</span>
                </div>
              </div>
              <p className="text-flocken-gray mb-2">{pkg.desc}</p>
              <p className="text-sm text-flocken-brown font-medium">{pkg.vibe}</p>
              <p className="text-xs text-flocken-gray italic mt-2">✨ {pkg.bestFor}</p>
            </div>

            {/* Hero */}
            <div className="mb-8 bg-flocken-sand p-8 rounded-xl">
              <p className="text-xs text-flocken-gray uppercase tracking-wide mb-3">Hero Section</p>
              <h3 className={`text-5xl md:text-6xl font-bold text-flocken-brown leading-tight mb-4 ${pkg.headingClass}`}>
                {heroText}
              </h3>
              <p className={`text-xl text-flocken-brown opacity-90 ${pkg.bodyClass}`}>
                {tagline}
              </p>
            </div>

            {/* H1 + Body combo */}
            <div className="mb-8">
              <h4 className={`text-4xl font-bold text-flocken-brown mb-4 ${pkg.headingClass}`}>
                Hitta hundar i din närhet
              </h4>
              <p className={`text-lg text-flocken-brown leading-relaxed ${pkg.bodyClass}`}>
                {bodyShort}
              </p>
            </div>

            {/* H2 + Medium text */}
            <div className="mb-8">
              <h5 className={`text-2xl font-semibold text-flocken-brown mb-3 ${pkg.headingClass}`}>
                Para, passa, rasta och besöka
              </h5>
              <p className={`text-base text-flocken-brown leading-relaxed ${pkg.bodyClass}`}>
                {bodyMedium}
              </p>
            </div>

            {/* Legal text example */}
            <div className="mb-6 bg-flocken-cream p-6 rounded-lg">
              <h6 className={`text-lg font-semibold text-flocken-brown mb-3 ${pkg.headingClass}`}>
                7.1 Rätt till tillgång (Art. 15 GDPR)
              </h6>
              <p className={`text-sm text-flocken-brown leading-relaxed ${pkg.bodyClass}`}>
                {bodyLegal}
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 flex-wrap">
              <button className={`bg-flocken-olive text-white px-6 py-3 rounded-full font-semibold hover:bg-flocken-accent transition ${pkg.bodyClass}`}>
                Ladda ner Flocken
              </button>
              <button className={`border-2 border-flocken-olive text-flocken-olive px-6 py-3 rounded-full font-semibold hover:bg-flocken-olive hover:text-white transition ${pkg.bodyClass}`}>
                Läs mer
              </button>
            </div>
          </div>
        ))}

        {/* Decision section */}
        <div className="bg-flocken-olive text-white rounded-2xl p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Vilket paket känns rätt för Flocken?</h2>
          <p className="text-lg opacity-90 mb-6">
            Tänk på vilket som bäst kommunicerar trygghet, värme och hundglädje. 
            Vilket paket skulle DU lita på när du söker hundvakt eller parningsmatch?
          </p>
          <div className="grid md:grid-cols-3 gap-4 mt-8 text-left">
            <div className="bg-white/10 p-4 rounded-lg">
              <p className="font-semibold mb-2">💝 Förtroende?</p>
              <p className="text-sm opacity-90">Paket A, G (serif ger trovärdighet)</p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg">
              <p className="font-semibold mb-2">🌸 Värme?</p>
              <p className="text-sm opacity-90">Paket C, E, G (mjuka former)</p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg">
              <p className="font-semibold mb-2">🚀 Modern?</p>
              <p className="text-sm opacity-90">Paket B, D (clean sans-serif)</p>
            </div>
          </div>
          <p className="text-sm opacity-75 mt-6">
            Säg till vilket paket du gillar så implementerar jag på 2 minuter! 🎨
          </p>
        </div>
      </div>
    </div>
  );
}

