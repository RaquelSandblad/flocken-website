/**
 * VLandingConfigV2 — Typer och configs för V2-design landningssidor.
 *
 * V2-designen har:
 * - Instrument Serif italic för rubriks-accenter
 * - Eyebrow-mönster: 24px linje + uppercase etikett
 * - Hero fullbredd med content längst ner, dog-avatar-dots
 * - Trust strip på mörk bakgrund (#2A2820)
 * - Argument-rader med alternering och flip-stöd
 * - Voices-sektion: mörk bakgrund, serif blockquotes med vänster-border
 * - Closing-card: olive-deep (#4D5A28) kort inuti paper-sektion
 * - Valfri Recruit-sektion längst ner
 */

export interface HeadlineV2 {
  /** Den normala delen av rubriken (Inter, ej kursiv) */
  prefix: string;
  /** Serif-accentdelen — renderas i Instrument Serif italic */
  accent: string;
}

export type TrustIconType = 'person' | 'bag' | 'chat' | 'map-pin' | 'filter';

export interface TrustItemV2 {
  icon: TrustIconType;
  /** Fetstilad del */
  label: string;
  /** Normalstilad fortsättning */
  description: string;
}

export type ArgBg = 'paper' | 'cream' | 'sand';

export interface ArgumentV2 {
  /** Serif-stilt etikett ovanför rubriken, t.ex. "i. — Matchning" */
  num: string;
  title: HeadlineV2;
  body: string;
  imageSrc: string;
  imageAlt: string;
  /** true = bilden till höger (text vänster) */
  flip?: boolean;
  bg?: ArgBg;
}

export interface VoiceV2 {
  quote: string;
  source: string;
}

export interface RecruitV2 {
  title: HeadlineV2;
  body: string;
  ctaLabel: string;
}

export interface VLandingConfigV2 {
  // Tracking
  experimentId: string;
  hook: string;

  // SEO
  pageTitle: string;
  pageDescription: string;

  // Header
  headerCtaLabel: string;

  // Hero
  heroEyebrow?: string;
  heroTitle: HeadlineV2;
  heroLead: string;
  heroCtaLabel: string;
  heroMetaText: string;
  heroDogAvatars: Array<{ src: string; objectPosition?: string }>;
  heroImageSrc: string;
  heroImageSrcMobile?: string;
  heroImageAlt: string;

  // Trust
  trustItems: TrustItemV2[];

  // Arguments
  arguments: ArgumentV2[];

  // Voices
  voicesEyebrow: string;
  voicesTitle: HeadlineV2;
  voices: VoiceV2[];

  // Closing
  closingEyebrow: string;
  closingTitle: HeadlineV2;
  closingLead: string;
  closingCtaLabel: string;
  closingSubtext: string;
  closingImageSrc: string;
  closingImageAlt: string;

  // Recruit (valfri)
  recruit?: RecruitV2;
}

// ─────────────────────────────────────────────────────────────────────────────
// PASSA V2 CONFIG
// ─────────────────────────────────────────────────────────────────────────────

export const PASSA_V2_CONFIG: VLandingConfigV2 = {
  experimentId: 'EXP001',
  hook: 'passa',
  pageTitle: 'Hitta hundvakt du litar på | Flocken',
  pageDescription:
    'Se vem som ska ta hand om din hund. Personliga profiler, kartan i centrum, direktkontakt. Ladda ner Flocken gratis.',

  headerCtaLabel: 'Hitta hundvakt',

  heroTitle: { prefix: 'Lämna din hund hos någon du ', accent: 'litar på.' },
  heroLead:
    'Du ska inte behöva fråga i en Facebook-grupp och hoppas på det bästa. I Flocken ser du vem som finns nära dig, innan du bestämmer dig.',
  heroCtaLabel: 'Hitta hundvakt nära dig',
  heroMetaText: '2 000+ hundägare i Sverige använder Flocken-appen.',
  heroDogAvatars: [
    { src: '/assets/flocken/v2/dog-malua.jpg', objectPosition: '50% 0%' },
    { src: '/assets/flocken/v2/dog-coco.jpg', objectPosition: '0% 60%' },
    { src: '/assets/flocken/v2/dog-ozzy.jpg' },
    { src: '/assets/flocken/v2/dog-arlo.jpg' },
  ],
  heroImageSrc: '/assets/flocken/v2/v-passa-hero.jpg',
  heroImageAlt: '',

  trustItems: [
    { icon: 'person', label: 'Personliga profiler', description: ' med bild och beskrivning' },
    { icon: 'bag',    label: 'Dela rutiner',         description: ', foder och promenadtider' },
    { icon: 'chat',   label: 'Direktkontakt',        description: ' med hundvakten i appen' },
  ],

  arguments: [
    {
      num: 'För dig som behöver veta vem',
      title: { prefix: 'Se vem som ska ha din ', accent: 'hund.' },
      body: 'Varje hundvakt har en profil med bild, beskrivning och vad de erbjuder. Du läser, jämför och väljer själv. Boka först när du känner dig trygg.',
      imageSrc: '/assets/flocken/v2/v-passa-arg1.jpg',
      imageAlt: 'Hand som håller en telefon med Yasmins hundvaktsprofil — profilbild, beskrivning och bokningsknapp',
      bg: 'paper',
    },
    {
      num: 'Närheten gör skillnad',
      title: { prefix: 'Hundvakter i ditt ', accent: 'grannskap.' },
      body: 'Sök på kartan och se vem som finns nära dig. Nära betyder att ni kan träffas innan passningen — för att skapa trygghet, både för dig och hunden.',
      imageSrc: '/assets/flocken/v2/v-passa-arg2.jpg',
      imageAlt:
        'Hand som håller en telefon med Flockens kartvy — hundvakter visas som markörer över hela Sverige',
      flip: true,
      bg: 'cream',
    },
    {
      num: 'Hjälp varandra',
      title: { prefix: 'Byt passning med en annan ', accent: 'hundägare.' },
      body: 'Hitta någon nära dig som vill byta passning. Du passar deras hund, de passar din. Helt kostnadsfritt — och oftast en bra start på en granne-vänskap.',
      imageSrc: '/assets/flocken/v2/v-passa-arg3.jpg',
      imageAlt: 'Clay-illustration av tre hundar som leker tillsammans i en hundrastgård',
      bg: 'sand',
    },
  ],

  voicesEyebrow: 'Hundägare om hundpassning',
  voicesTitle: { prefix: 'Det är så det ', accent: 'låter idag.' },
  voices: [
    {
      quote:
        'Det känns som om jag sviker henne. Hon tittar på mig med de där ögonen när jag packar väskan.',
      source: 'Hundägare · Familjeliv',
    },
    {
      quote: 'Har någon tips på en pålitlig hundvakt? Mamma har passat förut men orkar inte längre.',
      source: 'Hundägare · Facebook-grupp',
    },
    {
      quote:
        'Hundvakten skickade bilder varje dag, ibland video. Första gången jag faktiskt kunde njuta av semestern.',
      source: 'Hundägare · Hundforum',
    },
  ],

  closingEyebrow: 'När du är redo',
  closingTitle: { prefix: 'Du ska kunna resa utan ', accent: 'dåligt samvete.' },
  closingLead: 'Kolla vilka hundvakter som finns nära dig. Det kostar ingenting att kika runt.',
  closingCtaLabel: 'Hitta hundvakt nära dig',
  closingSubtext: 'Gratis att ladda ner. Skapa en hundprofil på två minuter.',
  closingImageSrc: '/assets/flocken/v2/v-passa-closing.jpg',
  closingImageAlt: 'Clay-illustration av en hund som sover tryggt i en soffa',

  recruit: {
    title: { prefix: 'Vill du erbjuda ', accent: 'hundpassning?' },
    body: 'Skapa din profil i Flocken — testa en vecka gratis.',
    ctaLabel: 'Skapa profil som hundvakt',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// HUNDAR V2 CONFIG
// ─────────────────────────────────────────────────────────────────────────────

export const HUNDAR_V2_CONFIG: VLandingConfigV2 = {
  experimentId: 'EXP002',
  hook: 'hundar',
  pageTitle: 'Lekkompisar och hundar nära dig | Flocken',
  pageDescription:
    'Hitta lekkompisar, grannar och hundvakter i närheten. Flocken-appen öppnar hundvärlden för din hund. Ladda ner gratis.',

  headerCtaLabel: 'Ladda ner Flocken',

  heroEyebrow: 'Hundar · För dig och din hund',
  heroTitle: { prefix: 'Öppna världen för din ', accent: 'hund.' },
  heroLead:
    'Du är störst i hundens värld. Med Flocken-appen blir den ännu lite större — lekkamrater, grannar och hundar i närheten.',
  heroCtaLabel: 'Ladda ner Flocken',
  heroMetaText: '2 000+ hundägare i Sverige använder Flocken-appen.',
  heroDogAvatars: [
    { src: '/assets/flocken/v2/dog-malua.jpg', objectPosition: '50% 0%' },
    { src: '/assets/flocken/v2/dog-coco.jpg', objectPosition: '0% 60%' },
    { src: '/assets/flocken/v2/dog-arlo.jpg' },
    { src: '/assets/flocken/v2/dog-hasse.jpg' },
  ],
  heroImageSrc: '/assets/flocken/v2/v-hundar-hero.jpg',
  heroImageSrcMobile: '/assets/flocken/v2/v-hundar-hero-mobile.jpg',
  heroImageAlt: '',

  trustItems: [
    { icon: 'filter',  label: 'Filtrera',          description: ' på storlek, ras och temperament' },
    { icon: 'map-pin', label: 'Hundar nära dig',    description: ', visas på kartan' },
    { icon: 'chat',    label: 'Chatta',             description: ' med hundägare i appen' },
  ],

  arguments: [
    {
      num: 'i. — Matchning',
      title: { prefix: 'En kompis som ', accent: 'matchar.' },
      body: 'Hundar leker bäst när de hittar någon som matchar. I Flocken-appen letar du i lugn och ro bland hundar som passar din — innan du tar kontakt.',
      imageSrc: '/assets/flocken/v2/v-hundar-arg2.jpg',
      imageAlt: 'Hand som håller en telefon med Flockens karta — hundar i närheten visas som markörer',
      bg: 'paper',
    },
    {
      num: 'ii. — Slut på rörigt',
      title: { prefix: 'Slut på röriga ', accent: 'grupper.' },
      body: 'Facebook-grupper är bra till mycket. Men vissa saker är de inte anpassade för — som att söka en lekkompis till hunden.',
      imageSrc: '/assets/flocken/v2/v-hundar-arg5.jpg',
      imageAlt:
        'Hand som håller en telefon med Facebook-gruppskaos överstruket med rött kryss',
      flip: true,
      bg: 'cream',
    },
    {
      num: 'iii. — Hundvakt',
      title: { prefix: 'Hundvakter i ditt ', accent: 'grannskap.' },
      body: 'Sök på kartan och se vem som finns nära dig. Läs profilen och träffas innan passningen — för att skapa trygghet.',
      imageSrc: '/assets/flocken/v2/v-hundar-arg3.jpg',
      imageAlt: 'Clay-illustration av kvinna som promenerar med sin hund på en skogsstig',
      bg: 'sand',
    },
    {
      num: 'iv. — Närheten',
      title: { prefix: 'Hundar som bor i ', accent: 'närheten.' },
      body: 'I Flocken-appen ser du vilka hundar som finns nära dig — bild, storlek, ras och en beskrivning. Vem har valpar och vem vill byta hundpassning? Kontakta ägaren via chatten — eller bara scrolla bland fina hundar.',
      imageSrc: '/assets/flocken/v2/v-hundar-arg1.jpg',
      imageAlt:
        'Hand som håller en telefon med Flockens hundlista — profiler med namn, ras och ort nära dig',
      flip: true,
      bg: 'paper',
    },
    {
      num: 'v. — Larm',
      title: { prefix: 'Om hunden springer ', accent: 'bort.' },
      body: 'Om din hund försvinner kan du snabbt markera det med en varning på kartan. Då ser andra användare av Flocken det direkt.',
      imageSrc: '/assets/flocken/v2/v-hundar-arg4.jpg',
      imageAlt:
        'Hand som håller en telefon med Flockens karta — varningssymbol markerar en försvunnen hund i nattstämning',
      bg: 'cream',
    },
  ],

  voicesEyebrow: 'Så pratar hundägare om hundlivet',
  voicesTitle: { prefix: 'Hundlivet är ofta lite ', accent: 'ensamt.' },
  voices: [
    {
      quote:
        'Jag hoppas att jag kan hitta en lämplig lekkompis till min lilla kompis. Han älskar att leka också.',
      source: 'Hundägare · Hundforum',
    },
    {
      quote: "Det är tröttande att 'pitcha' sin hund om och om igen i varje grupp.",
      source: 'Hundägare · Facebook-grupp',
    },
    {
      quote:
        'Vi vill så gärna att hunden ska ha kompisar. Men hundar blir inte vänner bara för att vi ägare vill det.',
      source: 'Hundägare · Glanna.se',
    },
  ],

  closingEyebrow: 'När du är redo',
  closingTitle: { prefix: 'Flocken öppnar ', accent: 'hundvärlden.' },
  closingLead:
    'Ladda ner Flocken-appen. Hitta lekkompisar, hundar i närheten och passning när du behöver.',
  closingCtaLabel: 'Ladda ner Flocken',
  closingSubtext: 'Gratis att ladda ner. Finns på App Store och Google Play.',
  closingImageSrc: '/assets/flocken/v2/v-hundar-closing.jpg',
  closingImageAlt:
    'Clay-illustration av en man som visar en kart-app på sin mobil för sin uppmärksamma hund',
};
