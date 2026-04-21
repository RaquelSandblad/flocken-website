/**
 * Konfiguration för hookspecifika landningssidor (/v/[hook])
 *
 * Separerar data (copy, bilder) från layout så att /v/besoka, /v/hundar, /v/rasta
 * kan byggas med exakt samma mall — bara ett nytt config-objekt behövs.
 *
 * EXP001: Passa är första testet. Version 2 (2026-04-14).
 */

export interface VLandingTrustSignal {
  /** Lucide-icon-name eller liknande identifier — används av layout för ikonval */
  icon: 'user-circle' | 'message-circle' | 'gift';
  text: string;
}

export interface VLandingArgument {
  title: string;
  body: string;
  /** Sökväg till primär screenshot */
  imageSrc: string;
  /** Alt-text för tillgänglighet */
  imageAlt: string;
  /**
   * imageStyle: hur bilden presenteras
   *   - 'tilted-right'    = tilt 3 grader medurs, elevated shadow (arg 1)
   *   - 'hand'            = hand-mockup bild med transparent bakgrund (arg 2)
   *   - 'overlapping'     = överlappande mockups, kräver secondaryImageSrc (arg 3)
   *   - 'tilted-left'     = tilt -3 grader, fallback om hand-bild saknas
   *   - 'photo'           = foto/hand-mockup komposition 1:1, rounded-2xl, shadow-card
   *   - 'illustration'    = clay-illustration 1:1, rounded-2xl, shadow-soft, lite bredare
   */
  imageStyle: 'tilted-right' | 'hand' | 'overlapping' | 'tilted-left' | 'photo' | 'illustration';
  secondaryImageSrc?: string;
  secondaryImageAlt?: string;
}

export interface VLandingSocialProof {
  quote: string;
  name: string;
  city: string;
}

export interface VLandingConfig {
  /** Hook-namn, används i tracking */
  hook: string;
  /** Experiment-ID, används i tracking */
  experimentId: string;

  // Hero
  heroTitle: string;
  heroSubtitle: string;
  /** Bakgrundsbild till hero — fullbredd med gradient-overlay */
  heroImageSrc: string;
  heroImageAlt: string;
  /** Valfri pill-text ovanför hero-rubriken */
  heroPillText?: string;
  /** Social proof-citat direkt under hero-CTA */
  heroSocialProof: string;

  // Trust strip (sektion 2, flocken-brown bakgrund)
  trustSignals: [VLandingTrustSignal, VLandingTrustSignal, VLandingTrustSignal];

  // Tre argument — var och en med sin screenshot-stil
  arguments: [VLandingArgument, VLandingArgument, VLandingArgument];
  /** Bakgrundsfärger per argument: index 0=arg1, 1=arg2, 2=arg3 */
  argumentBackgrounds: [string, string, string];

  // Social proof-sektion (sektion 6, flocken-brown bakgrund)
  /** Rubrik ovanför citatkorten */
  socialProofLabel: string;
  socialProofQuotes: [VLandingSocialProof, VLandingSocialProof, VLandingSocialProof];

  // Closing CTA-sektion (sektion 7, flocken-olive bakgrund)
  closingHeadline: string;
  closingBody: string;
  /** Hand-bild mot olive bakgrund */
  closingImageSrc: string;
  closingImageAlt: string;

  // Valfri rekryteringssektion (visas mellan social proof och closing CTA)
  /** Rubrik för rekryteringssektion, t.ex. "Vill du erbjuda hundpassning?" */
  recruitHeadline?: string;
  /** Body-text, max 1-2 meningar */
  recruitBody?: string;
  /** CTA-text för rekrytering, t.ex. "Skapa profil som hundvakt" */
  recruitCtaLabel?: string;

  // CTA-texter
  ctaLabel: string;
  /** Text under closing CTA-knapp */
  closingSubtext: string;

  // Metadata
  pageTitle: string;
  pageDescription: string;
}

// ---------------------------------------------------------------------------
// Passa — EXP001, version 2
// ---------------------------------------------------------------------------

export const PASSA_CONFIG: VLandingConfig = {
  hook: 'passa',
  experimentId: 'EXP001',

  // Hero — copy v3 (copywriting-process test 1, 2026-04-15)
  heroTitle: 'Lämna din hund hos någon du litar på',
  heroSubtitle:
    'Du ska inte behöva fråga i en Facebook-grupp och hoppas på det bästa. I Flocken ser du vem som finns nära dig, innan du bestämmer dig.',
  heroImageSrc: '/assets/flocken/v-passa/hero-clay-promenad-16x9.jpg',
  heroImageAlt:
    'Clay-illustration av kvinna som promenerar med sin cocker spaniel på en solig skogsväg',
  heroPillText: undefined,
  heroSocialProof: '2 000+ hundägare i Sverige använder Flocken-appen. Finns på App Store och Google Play.',

  // Trust strip — mappar 1:1 till Annas tre invändningar
  trustSignals: [
    {
      icon: 'user-circle',
      text: 'Personliga profiler med bild och beskrivning',
    },
    {
      icon: 'gift',
      text: 'Dela rutiner, foder och promenadtider',
    },
    {
      icon: 'message-circle',
      text: 'Direktkontakt med hundvakten i appen',
    },
  ],

  // Tre argument — VoC-driven copy
  arguments: [
    {
      title: 'Se vem som ska ha din hund',
      body: 'Varje hundvakt har en profil med bild, beskrivning och vad de erbjuder. Du läser, jämför och väljer själv. Boka först när du känner dig trygg.',
      imageStyle: 'photo',
      imageSrc: '/assets/flocken/v-passa/arg1-hand-yasmin-profil.jpg',
      imageAlt:
        'Hand som håller en telefon med Yasmins hundvaktsprofil i Flocken — profilbild, beskrivning och bokningsknapp',
    },
    {
      title: 'Hundvakter i ditt grannskap, inte tvärs över stan',
      body: 'Sök på kartan och se vem som finns nära dig. Nära betyder att ni kan träffas innan passningen för att skapa trygghet.',
      imageStyle: 'photo',
      imageSrc: '/assets/flocken/v-passa/arg2-hand-karta-hundvakter.jpg',
      imageAlt:
        'Hand som håller en telefon med Flockens kartvy — hundvakter visas som markörer över hela Sverige',
    },
    {
      title: 'Byt passning med en annan hundägare',
      body: 'Hitta någon nära dig som vill byta passning. Du passar deras hund, de passar din.',
      imageStyle: 'illustration',
      imageSrc: '/assets/flocken/v-passa/arg3-clay-hundrastgard.jpg',
      imageAlt:
        'Clay-illustration av tre hundar som leker tillsammans i en hundrastgård — golden retriever, pudel och maltese',
    },
  ],

  argumentBackgrounds: ['bg-flocken-cream', 'bg-white', 'bg-flocken-sand'],

  // Social proof
  socialProofLabel: 'Hundägare om hundpassning',
  socialProofQuotes: [
    {
      // VoC-citat: skuld/oro — LT-artikel, vanligaste känslan
      quote:
        'Det känns som om jag sviker henne. Hon tittar på mig med de där ögonen när jag packar väskan.',
      name: 'Hundägare',
      city: 'Familjeliv',
    },
    {
      // VoC-citat: behov — informella nätverket försvinner
      quote:
        'Har någon tips på en pålitlig hundvakt? Mamma har passat förut men orkar inte längre.',
      name: 'Hundägare',
      city: 'Facebook-grupp',
    },
    {
      // VoC-citat: lättnad — vad en bra lösning känns som
      quote:
        'Hundvakten skickade bilder varje dag, ibland video. Första gången jag faktiskt kunde njuta av semestern.',
      name: 'Hundägare',
      city: 'Hundägare-forum',
    },
  ],

  // Rekrytering — kort sektion för hundvakter
  recruitHeadline: 'Vill du erbjuda hundpassning?',
  recruitBody: 'Skapa din profil i Flocken, testa 1 vecka gratis.',
  recruitCtaLabel: 'Skapa profil som hundvakt',

  // Closing CTA — skuld-narrativ från VoC
  closingHeadline: 'Du ska kunna resa utan dåligt samvete',
  closingBody:
    'Kolla vilka hundvakter som finns nära dig. Det kostar ingenting att kika runt.',
  closingImageSrc: '/assets/flocken/v-passa/closing-clay-trygg-soffa.jpg',
  closingImageAlt:
    'Clay-illustration av en hund som sover tryggt i en soffa med en filt — vattenskål på golvet, gröna växter i bakgrunden',

  ctaLabel: 'Hitta hundvakt nära dig',
  closingSubtext: 'Gratis att ladda ner. Skapa en hundprofil på två minuter.',

  pageTitle: 'Hitta hundvakt du litar på | Flocken',
  pageDescription:
    'Lämna din hund hos någon du litar på. Se hundvakter nära dig med profiler och beskrivningar. Gratis att ladda ner.',
};

// ---------------------------------------------------------------------------
// Hundar — CB004 v2 (2026-04-22)
// Bildstatus:
//   hero   — LEVERERAD: hero-clay-trehundar-21x9.jpg (2400×1029, 21:9)
//   arg1   — SAKNAS: arg1-hand-lekkompis-filter.jpg — väntar Torbjörns produktion
//   arg2   — LEVERERAD: arg2-clay-fb-kaos-1x1.jpg (1:1, clay-stil hand+mobil+FB-kaos)
//   arg3   — LEVERERAD: arg3-clay-forsvunnen-1x1.jpg (1024×1024, clay-stil hand+mobil+karta+varningstriangel)
//   closing — SAKNAS: closing-clay-hund-nara.jpg — väntar Torbjörns produktion
// ---------------------------------------------------------------------------

export const HUNDAR_CONFIG: VLandingConfig = {
  hook: 'hundar',
  experimentId: 'CB004',

  // Hero
  heroTitle: 'Hunden behöver mer än dig',
  heroSubtitle:
    'Du är hundens värld. Men den mår bättre med fler i den.',
  heroImageSrc: '/assets/flocken/v-hundar/hero-clay-trehundar-21x9.jpg',
  heroImageAlt:
    'Clay-illustration av tre hundar (pudel, cocker spaniel och maltese) som står tillsammans på en gräsplätt med staket och förortshus i bakgrunden',
  heroPillText: undefined,
  heroSocialProof:
    '2 000+ hundägare i Sverige använder Flocken-appen. Finns på App Store och Google Play.',

  // Trust strip
  trustSignals: [
    {
      icon: 'user-circle',
      text: 'Filter på storlek, ras och temperament',
    },
    {
      icon: 'gift',
      text: 'Hundar nära dig, visas på kartan',
    },
    {
      icon: 'message-circle',
      text: 'Realtidslarm om hunden springer bort',
    },
  ],

  // Tre argument
  arguments: [
    {
      title: 'En kompis som matchar',
      body: 'Små hundar leker hårt när de är rätt matchade. Stora blir försiktiga när de är det. I Flocken-appen väljer du bort felmatchningarna innan ni träffas, så slipper leken bli för intensiv.',
      imageStyle: 'photo',
      imageSrc: '/assets/flocken/v-hundar/arg1-hand-lekkompis-filter.jpg', // SAKNAS — väntar Torbjörns produktion
      imageAlt:
        'Hand som håller en telefon med Flockens filter-vy för lekkompisar — storlek, ras och temperament',
    },
    {
      title: 'Hundar som bor i närheten',
      body: 'I Flocken-appen ser du vilka hundar som finns nära dig, på kartan. Profil, bild, storlek, ras. Du väljer själv vem du vill ses med. Ingen grupptråd, ingen tagg, ingen algoritm som bestämmer åt dig.',
      imageStyle: 'photo',
      imageSrc: '/assets/flocken/v-hundar/arg2-clay-fb-kaos-1x1.jpg',
      imageAlt:
        'Clay-illustration av hand som håller mobil med Facebook-gruppskaos — kontrast mot Flockens enkla vy',
    },
    {
      title: 'Om något händer finns grannarna där',
      body: 'Om hunden springer iväg får hundägare i närheten en push-notis direkt. Inte ett inlägg som kanske dyker upp i flödet några timmar senare. Gemenskapen du bygger i vardagen är den du behöver när det gäller.',
      imageStyle: 'photo',
      imageSrc: '/assets/flocken/v-hundar/arg3-clay-forsvunnen-1x1.jpg',
      imageAlt:
        'Clay-illustration av hand som håller mobil med Flockens larmvy — karta, varningstriangel, nattstämning',
    },
  ],

  argumentBackgrounds: ['bg-flocken-cream', 'bg-white', 'bg-flocken-sand'],

  // Social proof
  socialProofLabel: 'Så pratar hundägare om hundlivet',
  socialProofQuotes: [
    {
      quote:
        'Flocken är navet i mitt hundliv numera. Mycket smidigare än grupper i sociala medier.',
      name: 'Hundägare',
      city: 'Sverige',
    },
    {
      quote:
        'Vi vill så gärna att hunden ska ha kompisar, men hundar blir inte vänner bara för att vi ägare vill det.',
      name: 'Hundägare',
      city: 'Sverige',
    },
    {
      quote:
        'En stor och en liten hund som leker tillsammans — den stora kan råka göra illa den lilla bara på grund av ren klantighet och fler kilon.',
      name: 'Hundägare',
      city: 'Sverige',
    },
  ],

  // Recruit-sektion BORTTAGEN i v2 (Torbjörns beslut — kennlar mejlas direkt)

  // Closing CTA
  closingHeadline: 'Ett ställe för allt som rör hunden',
  closingBody:
    'Ladda ner Flocken-appen. Hitta lekkompisar, hundar i närheten och grannar som finns där när det gäller.',
  closingImageSrc: '/assets/flocken/v-hundar/closing-clay-hund-nara.jpg', // SAKNAS — väntar Torbjörns produktion
  closingImageAlt:
    'Clay-illustration av en hund som ligger tryggt bredvid ägarens fötter — hemmiljö, gröna växter',

  ctaLabel: 'Ladda ner Flocken',
  closingSubtext: 'Gratis att ladda ner. Finns på App Store och Google Play.',

  // Metadata
  pageTitle: 'Lekkompisar och hundar nära dig | Flocken',
  pageDescription:
    'Hitta lekkompisar till hunden, hundar i närheten och grannar som finns där om något händer. Ladda ner Flocken-appen gratis — App Store och Google Play.',
};
