/**
 * /om-flocken — Flocken V2-design.
 *
 * Berättelsen bakom appen, i samma V2-designspråk som start- och funktionssidan
 * (Instrument Serif-accenter, eyebrow-mönster, paper/cream/ink/olive-rytm).
 * Header + footer kommer från (marketing)-layouten (global V2-chrome).
 *
 * Story-linjen är synkad med startsidans grundarhistoria: Raquel letade efter
 * en VÄN till sin toypudel Malua (inte parning). Parning nämns bara som ett av
 * flera behov andra hundägare hade. Rubriken "Det började med en pudel i
 * Göteborg" är behållen på begäran.
 *
 * Skrivregel: inga em-streck (—), inga förbjudna ord (plattform, community,
 * sömlös, utforska, underlättar).
 */

import { Instrument_Serif } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { VLandingCTAV2 } from '@/components/v/VLandingCTAV2';

export const metadata: Metadata = {
  title: 'Om Flocken – berättelsen bakom appen',
  description:
    'Flocken byggdes av hundmänniskor som levde med problemet appen löser. Det började med en pudel i Göteborg som behövde en vän. Läs historien bakom.',
  alternates: { canonical: '/om-flocken' },
};

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  style: ['italic'],
  weight: '400',
  variable: '--font-instrument-serif',
  display: 'swap',
});

// ─── Hjälpkomponenter (samma DNA som HomepageV2) ───────────────────────────────

/** Rubrik-accent: Instrument Serif italic */
function SA({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        fontFamily: 'var(--font-instrument-serif)',
        fontStyle: 'italic',
        fontWeight: 400,
        letterSpacing: '-0.01em',
      }}
    >
      {children}
    </span>
  );
}

/** Eyebrow: 24px linje + uppercase etikett */
function Eyebrow({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className="flex items-center gap-2.5 mb-5 text-[0.75rem] font-semibold tracking-[0.14em] uppercase"
      style={style}
    >
      <span className="inline-block w-6 h-px bg-current shrink-0" aria-hidden="true" />
      {children}
    </div>
  );
}

export default function OmFlockenPage() {
  return (
    <div className={instrumentSerif.variable} style={{ background: '#FAF6EC', color: '#2A2820' }}>
      {/* ── HERO ── papper, intro ── */}
      <section className="relative overflow-hidden" style={{ background: '#FAF6EC' }}>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 700px 500px at 80% 25%, rgba(232, 220, 192, 0.5) 0%, transparent 60%), radial-gradient(ellipse 500px 400px at 12% 90%, rgba(139, 164, 93, 0.12) 0%, transparent 60%)',
          }}
          aria-hidden="true"
        />
        <div className="relative max-w-[1200px] mx-auto px-5 sm:px-8 py-16 sm:py-24">
          <div className="max-w-[42rem]">
            <Eyebrow style={{ color: '#6B7A3A' }}>Om Flocken</Eyebrow>
            <h1
              className="font-extrabold leading-[1.05] mb-6"
              style={{
                fontSize: 'clamp(2.25rem, 6vw, 4rem)',
                letterSpacing: '-0.025em',
                color: '#2A2820',
                maxWidth: '16ch',
              }}
            >
              Vi byggde appen vi själva{' '}
              <span style={{ color: '#6B7A3A' }}>
                <SA>saknade.</SA>
              </span>
            </h1>
            <p
              style={{
                fontSize: 'clamp(1.0625rem, 2vw, 1.25rem)',
                lineHeight: 1.6,
                color: '#5C5A50',
                maxWidth: '34rem',
              }}
            >
              Flocken kom till för att vi inte hittade den själva. En plats där hundar och deras
              människor kan hitta varandra på riktigt, nära där man bor.
            </p>
          </div>
        </div>
      </section>

      {/* ── STORY ── mörk, bild + text + pullquote (rubriken behållen) ── */}
      <section
        className="relative overflow-hidden py-20 sm:py-24"
        style={{ background: '#2A2820', color: '#FAF6EC' }}
        aria-label="Berättelsen"
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 600px 400px at 80% 20%, rgba(139, 164, 93, 0.08) 0%, transparent 60%)',
          }}
          aria-hidden="true"
        />
        <div className="relative max-w-[1200px] mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 min-[880px]:grid-cols-2 gap-12 min-[880px]:gap-20 items-center">
            {/* Bild: Malua som valp */}
            <div
              className="relative w-full aspect-square overflow-hidden"
              style={{
                borderRadius: '1.5rem',
                boxShadow: '0 30px 60px -20px rgba(0, 0, 0, 0.5)',
              }}
            >
              <Image
                src="/assets/flocken/v2/home/real-malua-valp-1x1.jpg"
                alt="Malua som valp, en apricotfärgad toypudel med rosa sele på en sten i skogen"
                fill
                className="object-cover"
                sizes="(max-width: 880px) 100vw, 50vw"
              />
            </div>
            {/* Text */}
            <div>
              <Eyebrow style={{ color: '#8BA45D' }}>Så här började det</Eyebrow>
              <h2
                className="font-bold leading-[1.05] mb-6"
                style={{
                  fontSize: 'clamp(1.875rem, 4.5vw, 3rem)',
                  letterSpacing: '-0.03em',
                  color: '#FAF6EC',
                  maxWidth: '20ch',
                }}
              >
                Det började med en pudel{' '}
                <span style={{ color: '#D4A574' }}>
                  <SA>i Göteborg.</SA>
                </span>
              </h2>
              <p
                className="mb-4"
                style={{
                  color: 'rgba(245, 239, 226, 0.82)',
                  fontSize: '1.0625rem',
                  lineHeight: 1.7,
                  maxWidth: '32rem',
                }}
              >
                Idén till Flocken kom när Raquel letade efter en vän till sin toypudel Malua. Någon
                att leka och umgås med, gärna i närheten. Det var svårare än hon trott. Det fanns
                ingen bra plats att leta på.
              </p>
              <blockquote
                className="my-6"
                style={{
                  paddingLeft: '1.5rem',
                  borderLeft: '3px solid #D4A574',
                  fontFamily: 'var(--font-instrument-serif)',
                  fontStyle: 'italic',
                  fontSize: '1.5rem',
                  lineHeight: 1.35,
                  color: '#FAF6EC',
                  maxWidth: '28rem',
                }}
              >
                Facebook-grupperna var röriga, och när vi äntligen fick svar bodde personen på
                andra sidan Sverige.
              </blockquote>
              <div
                className="mb-6"
                style={{
                  paddingLeft: '1.5rem',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#8BA45D',
                }}
              >
                Raquel, grundare
              </div>
              <p
                className="mb-4"
                style={{
                  color: 'rgba(245, 239, 226, 0.82)',
                  fontSize: '1.0625rem',
                  lineHeight: 1.7,
                  maxWidth: '32rem',
                }}
              >
                När hon frågade runt visade det sig att andra satt med samma sak. En del sökte
                lekkamrater, andra en hundvakt eller någon att para hunden med. Alla letade, ingen
                hittade.
              </p>
              <p
                style={{
                  color: '#FAF6EC',
                  fontSize: '1.0625rem',
                  lineHeight: 1.7,
                  maxWidth: '32rem',
                  fontWeight: 500,
                }}
              >
                Så hon bestämde sig för att göra något åt det. Att samla alla hundar på ett ställe,
                så att man kan söka istället för att hoppas på rätt inlägg vid rätt tillfälle.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── INSIKTEN ── cream, centrerad pullquote ── */}
      <section className="py-20 sm:py-24" style={{ background: '#F5EFE2' }} aria-label="Insikten">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-8">
          <div className="max-w-[44rem] mx-auto text-center">
            <Eyebrow style={{ color: '#6B7A3A', justifyContent: 'center' }}>Insikten</Eyebrow>
            <h2
              className="font-bold leading-[1.05] mb-8"
              style={{
                fontSize: 'clamp(1.875rem, 4.5vw, 3rem)',
                letterSpacing: '-0.03em',
                color: '#2A2820',
              }}
            >
              Det saknades något{' '}
              <span style={{ color: '#6B7A3A' }}>
                <SA>helt annat.</SA>
              </span>
            </h2>
            <p
              className="mb-8"
              style={{
                fontFamily: 'var(--font-instrument-serif)',
                fontStyle: 'italic',
                fontSize: 'clamp(1.5rem, 3.5vw, 2.125rem)',
                lineHeight: 1.3,
                color: '#2A2820',
              }}
            >
              Varför finns det ingen app där man faktiskt kan se hundarna omkring sig?
            </p>
            <div
              className="space-y-4 text-left mx-auto"
              style={{ maxWidth: '38rem', fontSize: '1.0625rem', lineHeight: 1.7, color: '#5C5A50' }}
            >
              <p>
                En plats där varje hund har en egen profil. Där kartan är navet, för möten mellan
                hundar sker alltid i verkligheten. Där du kan filtrera på ras, stad och vad ni
                söker.
              </p>
              <p>
                Inte ett socialt flöde till. Inte en Facebook-grupp. Ett verktyg byggt för riktiga
                hundägare och vardagliga behov.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── VAD VI BYGGDE ── papper, tre värdekort ── */}
      <section className="py-20 sm:py-24" style={{ background: '#FAF6EC' }} aria-label="Det vi byggde">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-8">
          <div className="text-center max-w-[40rem] mx-auto mb-14">
            <Eyebrow style={{ color: '#6B7A3A', justifyContent: 'center' }}>Det vi byggde</Eyebrow>
            <h2
              className="font-bold leading-[1.05]"
              style={{
                fontSize: 'clamp(1.875rem, 4.5vw, 3rem)',
                letterSpacing: '-0.03em',
                color: '#2A2820',
              }}
            >
              En app med{' '}
              <span style={{ color: '#6B7A3A' }}>
                <SA>kartan i centrum.</SA>
              </span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-[960px] mx-auto">
            {[
              {
                title: 'Kartan i centrum',
                body: 'Se hundar, hundvakter och ställen i närheten. Möten sker i verkligheten, inte i ett flöde.',
                tone: 'paper' as const,
              },
              {
                title: 'Riktiga profiler',
                body: 'Varje hund har en egen profil med ras, ålder och vad ni söker. Inte ett inlägg som försvinner.',
                tone: 'ink' as const,
              },
              {
                title: 'Sökning som fungerar',
                body: 'Filtrera fram precis det ni behöver. Slipp fel svar från fel stad om fel ras.',
                tone: 'sand' as const,
              },
            ].map((card, i) => {
              const tones = {
                paper: { bg: '#F5EFE2', title: '#2A2820', body: '#5C5A50', accent: '#6B7A3A' },
                ink: { bg: '#2A2820', title: '#FAF6EC', body: 'rgba(245, 239, 226, 0.8)', accent: '#8BA45D' },
                sand: { bg: '#E8DCC0', title: '#2A2820', body: '#5C5A50', accent: '#4D5A28' },
              };
              const s = tones[card.tone];
              return (
                <div
                  key={i}
                  className="rounded-3xl p-8"
                  style={{ background: s.bg, transform: card.tone === 'ink' ? 'translateY(-12px)' : undefined }}
                >
                  <div
                    className="mb-3"
                    style={{
                      fontFamily: 'var(--font-instrument-serif)',
                      fontStyle: 'italic',
                      fontSize: '1.125rem',
                      color: s.accent,
                      fontWeight: 500,
                    }}
                  >
                    0{i + 1}
                  </div>
                  <h3 className="font-bold mb-2.5" style={{ fontSize: '1.3125rem', lineHeight: 1.2, color: s.title }}>
                    {card.title}
                  </h3>
                  <p style={{ fontSize: '0.9375rem', lineHeight: 1.6, color: s.body }}>{card.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── VILKA VI ÄR ── olive-deep, bild + text ── */}
      <section
        className="relative overflow-hidden py-20 sm:py-24"
        style={{ background: '#4D5A28', color: '#FAF6EC' }}
        aria-label="Vilka vi är"
      >
        <div
          className="absolute pointer-events-none"
          style={{
            top: '-30%',
            left: '-10%',
            width: '60%',
            height: '130%',
            background: 'radial-gradient(circle, rgba(245, 239, 226, 0.05) 0%, transparent 60%)',
          }}
          aria-hidden="true"
        />
        <div className="relative max-w-[1200px] mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 min-[900px]:grid-cols-[1.05fr_1fr] gap-12 min-[900px]:gap-20 items-center">
            <div>
              <Eyebrow style={{ color: '#E8DCC0' }}>Vilka vi är</Eyebrow>
              <h2
                className="font-bold leading-[1.05] mb-6"
                style={{
                  fontSize: 'clamp(1.875rem, 4.5vw, 3rem)',
                  letterSpacing: '-0.03em',
                  color: '#FAF6EC',
                  maxWidth: '18ch',
                }}
              >
                Ett litet bolag med{' '}
                <span style={{ color: '#D4A574' }}>
                  <SA>hundhjärta.</SA>
                </span>
              </h2>
              <div
                className="space-y-4"
                style={{ color: 'rgba(245, 239, 226, 0.85)', fontSize: '1.0625rem', lineHeight: 1.7, maxWidth: '32rem' }}
              >
                <p>
                  Flocken är inte byggt av ett stort techbolag. Det är byggt av hundmänniskor som
                  levde med problemet appen löser.
                </p>
                <p>
                  Vi är ett litet svenskt bolag och drivkraften är personlig. Visionen är att samla
                  Skandinaviens hundägare på samma ställe och göra det enklare att hitta varandra,
                  oavsett om det gäller lekkamrater, hundvakt, promenader eller någon att para
                  hunden med.
                </p>
                <p style={{ color: '#FAF6EC' }}>
                  Hundar skapar relationer mellan människor som annars aldrig hade mötts. Det är den
                  känslan hela appen vilar på.
                </p>
              </div>
            </div>
            <div
              className="relative w-full aspect-square overflow-hidden"
              style={{ borderRadius: '1.75rem', boxShadow: '0 40px 80px -30px rgba(0, 0, 0, 0.5)' }}
            >
              <Image
                src="/assets/flocken/generated/flocken_image_malua-arlo-coco-jumping-dog-park_1x1.jpeg"
                alt="Tre hundar som leker tillsammans i en hundrastgård"
                fill
                className="object-cover"
                sizes="(max-width: 900px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── olive-deep kort i papper ── */}
      <section className="py-12 sm:py-20" style={{ background: '#FAF6EC' }} aria-label="Ladda ner">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-8">
          <div
            className="relative overflow-hidden rounded-3xl sm:rounded-[2rem] p-8 sm:p-16 grid grid-cols-1 sm:grid-cols-[1.1fr_0.9fr] gap-8 sm:gap-12 items-center"
            style={{ background: '#4D5A28', color: '#FAF6EC' }}
          >
            <div
              className="absolute pointer-events-none"
              style={{
                top: '-20%',
                right: '-10%',
                width: '60%',
                height: '140%',
                background: 'radial-gradient(circle, rgba(232, 220, 192, 0.16) 0%, transparent 60%)',
              }}
              aria-hidden="true"
            />
            <div className="relative">
              <Eyebrow style={{ color: '#E8DCC0' }}>Välkommen in i Flocken</Eyebrow>
              <h2
                className="font-bold leading-[1.05] mb-5"
                style={{
                  fontSize: 'clamp(1.875rem, 4.5vw, 3rem)',
                  letterSpacing: '-0.03em',
                  color: '#FAF6EC',
                  maxWidth: '14ch',
                }}
              >
                Gå med i{' '}
                <span style={{ color: '#D4A574' }}>
                  <SA>flocken.</SA>
                </span>
              </h2>
              <p
                className="mb-7"
                style={{
                  fontSize: 'clamp(1.0625rem, 2vw, 1.1875rem)',
                  lineHeight: 1.55,
                  color: 'rgba(245, 239, 226, 0.92)',
                  maxWidth: '30rem',
                }}
              >
                Gratis att ladda ner. Se vilka hundar som redan finns nära dig.
              </p>
              <VLandingCTAV2
                label="Ladda ner Flocken"
                experimentId="OMFLOCKEN"
                variant="om-flocken"
                position="closing"
              />
              <p className="mt-4" style={{ fontSize: '0.875rem', color: 'rgba(245, 239, 226, 0.7)' }}>
                Har du frågor?{' '}
                <Link href="/support" className="underline hover:opacity-80 transition-opacity">
                  Kontakta oss
                </Link>
              </p>
            </div>
            <div
              className="hidden sm:block relative aspect-square overflow-hidden"
              style={{
                borderRadius: '1.5rem',
                boxShadow: '0 30px 60px -20px rgba(0, 0, 0, 0.3)',
                transform: 'rotate(2deg)',
              }}
            >
              <Image
                src="/assets/flocken/v2/home/real-chico-coco-park.jpg"
                alt="Två hundar som springer tillsammans i en park"
                fill
                className="object-cover"
                sizes="(max-width: 1100px) 45vw, 460px"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
