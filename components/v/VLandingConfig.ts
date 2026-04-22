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
  icon: 'user-circle' | 'message-circle' | 'gift' | 'map-pin';
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
  /**
   * Valfri object-position för hero-bilden.
   * Default: 'center 30%' (passar bilder där huvudmotivet är i övre tredjedelen, t.ex. /v/passa).
   * För bilder med motiv i nedre halvan (t.ex. /v/hundar trehundar-bilden): 'center 65%'.
   */
  heroObjectPosition?: string;
  /**
   * Valfri mobil-specifik hero-bild (< 640px viewport). Används när 16:9-bilden
   * kropar för hårt på mobil och en mer kvadratisk/portrait version ger bättre komposition.
   * Faller tillbaka till heroImageSrc om inte angiven.
   */
  heroImageSrcMobile?: string;
  /** Valfri pill-text ovanför hero-rubriken */
  heroPillText?: string;
  /** Social proof-citat direkt under hero-CTA */
  heroSocialProof: string;

  // Trust strip (sektion 2, flocken-brown bakgrund)
  trustSignals: [VLandingTrustSignal, VLandingTrustSignal, VLandingTrustSignal];

  /** Argument-sektioner — minst 3, kan vara fler. Index mappas till argumentBackgrounds. */
  arguments: VLandingArgument[];
  /** Bakgrundsfärger per argument — måste ha samma längd som arguments. */
  argumentBackgrounds: string[];

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
  /** Text på sticky-header-CTA. Default "Hitta hundvakt" (legacy /v/passa). */
  headerCtaLabel?: string;
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
// Hundar — CB004 v3 (2026-04-22)
// Bilder valda ur v-hundar-mockup-selection/ tillsammans med Torbjörn, alla LEVERERADE:
//   hero    — hero-clay-trehundar-16x9.jpg (tre lekande hundar)
//   arg1    — arg1-hand-hundlista-1x1.jpg (mobil med hundprofiler)
//   arg2    — arg2-hand-karta-1x1.jpg (mobil med karta över hundar)
//   arg3    — arg3-clay-kvinna-hund-promenad-1x1.jpg (kvinna + hund på skogsstig)
//   arg4    — arg4-hand-varning-natt-1x1.jpg (mobil med karta + varning, nattstämning)
//   arg5    — arg5-hand-fb-kryss-1x1.jpg (FB-kaos överstruket med rött kryss)
//   closing — closing-clay-man-soker-hund-1x1.jpg (man visar karta på mobil för hund)
// ---------------------------------------------------------------------------

export const HUNDAR_CONFIG: VLandingConfig = {
  hook: 'hundar',
  experimentId: 'CB004',

  // Hero
  heroTitle: 'Öppna världen för din hund',
  heroSubtitle:
    'Du är störst i hundens värld. Med Flocken-appen blir den ännu lite större.',
  heroImageSrc: '/assets/flocken/v-hundar/hero-clay-trehundar-16x9.jpg',
  heroImageSrcMobile: '/assets/flocken/v-hundar/hero-clay-trehundar-v2-4x5.jpg',
  heroImageAlt:
    'Clay-illustration av tre hundar (pudel, cocker spaniel och maltese) som springer tillsammans på en gräsmatta med staket och förortshus i bakgrunden',
  // Ingen heroObjectPosition-override — ärver default 'center 30%'.
  // Mobil (< 640px) använder 4:5-version för att visa alla tre hundar utan att kropas.
  heroPillText: undefined,
  heroSocialProof:
    '2 000+ hundägare i Sverige använder Flocken-appen. Finns på App Store och Google Play.',

  // Trust strip
  trustSignals: [
    {
      icon: 'user-circle',
      text: 'Filtrera på storlek, ras och temperament',
    },
    {
      icon: 'map-pin',
      text: 'Hundar nära dig, visas på kartan',
    },
    {
      icon: 'message-circle',
      text: 'Chatta med hundägare i appen',
    },
  ],

  // Fem argument — ordning enligt Torbjörns spec 2026-04-22:
  //   1 matchning → 2 problem (FB-grupper) → 3 hundvakt → 4 karta närhet → 5 larm
  arguments: [
    {
      title: 'En kompis som matchar',
      body: 'Hundar leker bäst när de hittar någon som matchar. I Flocken-appen letar du i lugn och ro bland hundar som passar din innan du tar kontakt.',
      imageStyle: 'photo',
      imageSrc: '/assets/flocken/v-hundar/arg2-hand-karta-1x1.jpg',
      imageAlt:
        'Hand som håller en telefon med Flockens karta — hundar i närheten visas som markörer',
    },
    {
      title: 'Slut på röriga grupper',
      body: 'Facebook-grupper är bra till mycket. Men vissa saker är de inte anpassade för, som att söka en lekkompis till hunden.',
      imageStyle: 'photo',
      imageSrc: '/assets/flocken/v-hundar/arg5-hand-fb-kryss-v3-1x1.jpg',
      imageAlt:
        'Hand som håller en telefon med Facebook-gruppskaos överstruket med rött kryss',
    },
    {
      title: 'Hundvakter i ditt grannskap',
      body: 'Sök på kartan och se vem som finns nära dig. Läs profilen och träffas innan passningen för att skapa trygghet.',
      imageStyle: 'illustration',
      imageSrc: '/assets/flocken/v-hundar/arg3-clay-kvinna-hund-promenad-1x1.jpg',
      imageAlt:
        'Clay-illustration av kvinna som promenerar med sin hund på en skogsstig — lummigt, lugnt, vardag',
    },
    {
      title: 'Hundar som bor i närheten',
      body: 'I Flocken-appen ser du vilka hundar som finns nära dig. Du kan se bild, storlek, ras och en beskrivning. Vem har valpar och vem vill byta hundpassning? Kontakta ägaren via chatten eller bara scrolla bland fina hundar.',
      imageStyle: 'photo',
      imageSrc: '/assets/flocken/v-hundar/arg1-hand-hundlista-1x1.jpg',
      imageAlt:
        'Hand som håller en telefon med Flockens hundlista — profiler med namn, ras och ort nära dig',
    },
    {
      title: 'Om hunden springer bort',
      body: 'Om din hund försvinner kan du snabbt markera det med en varning på kartan. Då ser andra användare av Flocken det direkt.',
      imageStyle: 'photo',
      imageSrc: '/assets/flocken/v-hundar/arg4-hand-varning-natt-1x1.jpg',
      imageAlt:
        'Hand som håller en telefon med Flockens karta — varningssymbol markerar en försvunnen hund, nattstämning',
    },
  ],

  argumentBackgrounds: ['bg-flocken-cream', 'bg-white', 'bg-flocken-sand', 'bg-flocken-cream', 'bg-white'],

  // Social proof
  socialProofLabel: 'Så pratar hundägare om hundlivet',
  socialProofQuotes: [
    {
      // VoC #4 (Hundägare i forum/annons, GPT v2 §1) — lekkompis-längtan
      quote:
        'Jag hoppas att jag kan hitta en lämplig lekkompis till min lilla kompis. Han älskar att leka också.',
      name: 'Hundägare',
      city: 'Hundforum',
    },
    {
      // HUNDAR_RESEARCH_SYNTHESIS.md — FB-grupp-friktion, syntes från VoC
      quote:
        "Det är tröttande att 'pitcha' sin hund om och om igen i varje grupp.",
      name: 'Hundägare',
      city: 'Facebook-grupp',
    },
    {
      // VoC #6 (Glanna.se blogg 2025, Gemini §2) — realism om hundvänskap
      quote:
        'Vi vill så gärna att hunden ska ha kompisar. Men hundar blir inte vänner bara för att vi ägare vill det.',
      name: 'Hundägare',
      city: 'Glanna.se',
    },
  ],

  // Recruit-sektion BORTTAGEN i v2 (Torbjörns beslut — kennlar mejlas direkt)

  // Closing CTA
  closingHeadline: 'Flocken öppnar hundvärlden',
  closingBody:
    'Ladda ner Flocken-appen. Hitta lekkompisar, hundar i närheten och passning när du behöver.',
  closingImageSrc: '/assets/flocken/v-hundar/closing-clay-man-soker-hund-1x1.jpg',
  closingImageAlt:
    'Clay-illustration av en man som visar en kart-app på sin mobil för sin uppmärksamma hund',

  ctaLabel: 'Ladda ner Flocken',
  headerCtaLabel: 'Ladda ner Flocken',
  closingSubtext: 'Gratis att ladda ner. Finns på App Store och Google Play.',

  // Metadata
  pageTitle: 'Lekkompisar och hundar nära dig | Flocken',
  pageDescription:
    'Hitta lekkompisar till hunden, hundar i närheten och grannar som finns där om något händer. Ladda ner Flocken-appen gratis — App Store och Google Play.',
};
