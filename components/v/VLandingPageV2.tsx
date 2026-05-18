/**
 * VLandingPageV2 — V2-design för hookspecifika landningssidor.
 *
 * Design från Flocken Design System (2026-05).
 * Nytt mot V1:
 *  - Instrument Serif italic för rubriks-accenter
 *  - Eyebrow-mönster: 24px horisontell linje + uppercase etikett
 *  - Hero fullbredd, content längst ner, dog-avatar-dots
 *  - Trust strip: mörk bakgrund (#2A2820)
 *  - Argument-rader: alternerande layout med flip-stöd, tre bakgrundsvarianter
 *  - Voices: mörk bakgrund, Instrument Serif blockquotes, border-left
 *  - Closing-card: olive-deep (#4D5A28) inuti paper-sektion, roterad bild
 *  - Valfri Recruit-sektion
 *
 * Server Component. Delegerar interaktiva delar till VLandingCTAV2
 * (tracking, platform-detektion) och VLandingStickyHeader (scroll-state).
 */

import { Instrument_Serif } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import { VLandingStickyHeader } from './VLandingStickyHeader';
import { VLandingCTAV2 } from './VLandingCTAV2';
import type { VLandingConfigV2, ArgumentV2, TrustIconType } from './VLandingConfigV2';

// ─── Font ────────────────────────────────────────────────────────────────────

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  style: ['italic'],
  weight: '400',
  variable: '--font-instrument-serif',
  display: 'swap',
});

// ─── Hjälpkomponenter ─────────────────────────────────────────────────────────

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
  className = '',
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`flex items-center gap-2.5 mb-5 text-[0.75rem] font-semibold tracking-[0.14em] uppercase ${className}`}
      style={style}
    >
      <span className="inline-block w-6 h-px bg-current shrink-0" aria-hidden="true" />
      {children}
    </div>
  );
}

/** Trust-ikoner — inline SVG per typ */
function TrustIcon({ type }: { type: TrustIconType }) {
  const cls = 'shrink-0';
  const size = { width: 18, height: 18 };

  if (type === 'person' || type === 'filter') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...size} className={cls} aria-hidden="true">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21v-2a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2" />
      </svg>
    );
  }
  if (type === 'bag') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...size} className={cls} aria-hidden="true">
        <rect x="3" y="8" width="18" height="13" rx="2" />
        <path d="M8 8V4h8v4" />
        <line x1="12" y1="12" x2="12" y2="17" />
      </svg>
    );
  }
  if (type === 'chat') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...size} className={cls} aria-hidden="true">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      </svg>
    );
  }
  if (type === 'map-pin') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...size} className={cls} aria-hidden="true">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    );
  }
  return null;
}

/** Argument-rad med bild + text */
function ArgRow({ arg, index }: { arg: ArgumentV2; index: number }) {
  const isFlipped = arg.flip ?? false;

  const bgStyle: React.CSSProperties =
    arg.bg === 'cream'
      ? { background: '#F5EFE2' }
      : arg.bg === 'sand'
        ? { background: '#E8DCC0' }
        : { background: '#FAF6EC' };

  const borderStyle: React.CSSProperties =
    arg.bg === 'cream' || arg.bg === 'sand'
      ? {}
      : { borderBottom: '1px solid rgba(42, 40, 32, 0.08)' };

  return (
    <section
      key={arg.imageSrc}
      style={{ ...bgStyle, ...borderStyle }}
      className="py-16 sm:py-24"
      aria-label={`Argument ${index + 1}`}
    >
      <div className="max-w-[1100px] mx-auto px-5 sm:px-8">
        <div
          className={`flex flex-col gap-10 items-center sm:grid sm:grid-cols-2 sm:gap-16 sm:items-center`}
        >
          {/* Bild */}
          <div
            className={`w-full max-w-[360px] mx-auto sm:max-w-none ${isFlipped ? 'sm:order-2' : 'sm:order-1'}`}
          >
            <Image
              src={arg.imageSrc}
              alt={arg.imageAlt}
              width={720}
              height={720}
              className="w-full h-auto block rounded-3xl"
              style={{ boxShadow: '0 20px 50px -20px rgba(42, 40, 32, 0.3)' }}
              sizes="(max-width: 640px) 360px, (max-width: 1100px) 50vw, 500px"
            />
          </div>

          {/* Text */}
          <div className={isFlipped ? 'sm:order-1' : 'sm:order-2'}>
            <div
              className="mb-2.5 text-[1.125rem]"
              style={{
                fontFamily: 'var(--font-instrument-serif)',
                fontStyle: 'italic',
                color: '#6B7A3A',
              }}
            >
              {arg.num}
            </div>
            <h2
              className="font-bold leading-[1.05] mb-4 max-w-[18ch]"
              style={{ fontSize: 'clamp(1.75rem, 4.5vw, 2.75rem)', letterSpacing: '-0.03em', color: '#2A2820' }}
            >
              {arg.title.prefix}
              <span style={{ color: '#6B7A3A' }}>
                <SA>{arg.title.accent}</SA>
              </span>
            </h2>
            <p
              className="leading-[1.65] max-w-[32rem]"
              style={{ fontSize: '1.0625rem', color: '#5C5A50' }}
            >
              {arg.body}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Huvudkomponent ───────────────────────────────────────────────────────────

interface VLandingPageV2Props {
  config: VLandingConfigV2;
}

export function VLandingPageV2({ config }: VLandingPageV2Props) {
  return (
    <div
      className={`min-h-screen flex flex-col ${instrumentSerif.variable}`}
      style={{ background: '#FAF6EC', color: '#2A2820' }}
    >

      {/* ── HEADER ── sticky, transparent → paper vid scroll ── */}
      <VLandingStickyHeader
        experimentId={config.experimentId}
        variant={config.hook}
        ctaLabel={config.headerCtaLabel}
      />

      {/* ── HERO ── fullbredd, content i botten på mobile/laptop, centrerat på storskärm ── */}
      <section
        className="relative overflow-hidden -mt-14 flex flex-col justify-end min-[1400px]:justify-center"
        style={{ minHeight: '78vh', maxHeight: '820px', color: '#FAF6EC' }}
        aria-label="Hero"
      >
        {/* Bakgrundsbild — absolut, under overlay och content */}
        <div className="absolute inset-0">
          {/* Mobilbild (om definierad) */}
          {config.heroImageSrcMobile && (
            <Image
              src={config.heroImageSrcMobile}
              alt=""
              fill
              className="object-cover sm:hidden"
              style={{ objectPosition: 'center 35%' }}
              sizes="100vw"
              priority
            />
          )}
          {/* Desktop-bild */}
          <Image
            src={config.heroImageSrc}
            alt={config.heroImageAlt}
            fill
            className={`object-cover ${config.heroImageSrcMobile ? 'hidden sm:block' : ''}`}
            style={{ objectPosition: 'center 30%' }}
            sizes="100vw"
            priority
          />
        </div>

        {/* Gradient-overlay — DOM-ordning gör den synlig ovanpå bilden */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(42,40,32,0.55) 0%, rgba(42,40,32,0.2) 35%, rgba(42,40,32,0.85) 100%)',
          }}
          aria-hidden="true"
        />

        {/* Innehåll — i flow, sitter där sektionens justify-content placerar det */}
        <div className="relative pb-12 pt-20 min-[1400px]:py-16 w-full">
        <div className="max-w-[1100px] mx-auto px-5 sm:px-8">
          <div className="max-w-[640px]">

            {/* Eyebrow (valfri) */}
            {config.heroEyebrow && (
              <Eyebrow style={{ color: '#D4A574' } as React.CSSProperties}>
                {config.heroEyebrow}
              </Eyebrow>
            )}

            {/* H1 */}
            <h1
              className="font-extrabold leading-[1.05] mb-5 max-w-[14ch]"
              style={{
                fontSize: 'clamp(2.25rem, 6.5vw, 4rem)',
                letterSpacing: '-0.025em',
                color: '#FAF6EC',
              }}
            >
              {config.heroTitle.prefix}
              <span style={{ color: '#E8DCC0' }}>
                <SA>{config.heroTitle.accent}</SA>
              </span>
            </h1>

            {/* Lead */}
            <p
              className="mb-8 max-w-[34rem]"
              style={{
                fontSize: 'clamp(1.0625rem, 2vw, 1.1875rem)',
                lineHeight: 1.55,
                color: 'rgba(245,239,226,0.9)',
              }}
            >
              {config.heroLead}
            </p>

            {/* CTA */}
            <div className="mb-7">
              <VLandingCTAV2
                label={config.heroCtaLabel}
                experimentId={config.experimentId}
                variant={config.hook}
                position="hero"
              />
            </div>

            {/* Meta: dog avatars + text */}
            <div className="flex items-center gap-3.5" style={{ color: 'rgba(245,239,226,0.85)', fontSize: '0.875rem' }}>
              {/* Dog avatar dots */}
              <div className="flex">
                {config.heroDogAvatars.map((dog, i) => (
                  <div
                    key={i}
                    className="w-7 h-7 rounded-full border-2 bg-cover bg-center"
                    style={{
                      backgroundImage: `url('${dog.src}')`,
                      backgroundPosition: dog.objectPosition ?? 'center',
                      borderColor: '#FAF6EC',
                      marginLeft: i === 0 ? 0 : '-8px',
                    }}
                    aria-hidden="true"
                  />
                ))}
              </div>
              <span>{config.heroMetaText}</span>
            </div>

          </div>
        </div>
        </div>
      </section>

      {/* Sentinel för VLandingStickyHeader scroll-detektion */}
      <div id="hero-sentinel" aria-hidden="true" />

      {/* ── TRUST STRIP ── mörk bakgrund, tre signaler ── */}
      <section
        className="py-10 sm:py-12"
        style={{ background: '#2A2820', color: '#FAF6EC' }}
        aria-label="Trust signals"
      >
        <div className="max-w-[1100px] mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-8">
            {config.trustItems.map((item) => (
              <div key={item.label} className="flex items-start gap-3.5">
                {/* Ikon-container */}
                <div
                  className="flex items-center justify-center shrink-0 rounded-[0.625rem]"
                  style={{
                    width: '2.25rem',
                    height: '2.25rem',
                    background: 'rgba(139,164,93,0.15)',
                    color: '#8BA45D',
                  }}
                >
                  <TrustIcon type={item.icon} />
                </div>
                {/* Text */}
                <p
                  className="pt-1.5"
                  style={{
                    fontSize: '0.9375rem',
                    lineHeight: 1.5,
                    color: 'rgba(245,239,226,0.92)',
                  }}
                >
                  <strong style={{ color: '#FAF6EC', fontWeight: 600 }}>{item.label}</strong>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ARGUMENT-RADER ── */}
      {config.arguments.map((arg, i) => (
        <ArgRow key={arg.imageSrc} arg={arg} index={i} />
      ))}

      {/* ── VOICES ── mörk bakgrund, serif blockquotes ── */}
      <section
        className="py-16 sm:py-24"
        style={{ background: '#2A2820', color: '#FAF6EC' }}
        aria-label="Hundägare berättar"
      >
        <div className="max-w-[1100px] mx-auto px-5 sm:px-8">
          <Eyebrow style={{ color: '#8BA45D' } as React.CSSProperties}>
            {config.voicesEyebrow}
          </Eyebrow>
          <h2
            className="font-bold leading-[1.05] mb-12 max-w-[22ch]"
            style={{ fontSize: 'clamp(1.75rem, 4.5vw, 2.75rem)', letterSpacing: '-0.03em', color: '#FAF6EC' }}
          >
            {config.voicesTitle.prefix}
            <span style={{ color: '#D4A574' }}>
              <SA>{config.voicesTitle.accent}</SA>
            </span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
            {config.voices.map((voice, i) => (
              <div
                key={i}
                className="rounded-2xl p-7"
                style={{
                  background: 'rgba(245,239,226,0.05)',
                  border: '1px solid rgba(245,239,226,0.12)',
                  borderLeft: '3px solid #8BA45D',
                }}
              >
                <blockquote
                  className="mb-4"
                  style={{
                    fontFamily: 'var(--font-instrument-serif)',
                    fontStyle: 'italic',
                    fontSize: '1.1875rem',
                    lineHeight: 1.45,
                    color: '#FAF6EC',
                  }}
                >
                  {voice.quote}
                </blockquote>
                <p
                  style={{
                    fontSize: '0.8125rem',
                    color: 'rgba(245,239,226,0.6)',
                    fontWeight: 500,
                  }}
                >
                  {voice.source}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CLOSING CTA ── paper-sektion med olive-deep kort ── */}
      <section
        className="py-16 sm:py-20"
        style={{ background: '#FAF6EC' }}
        id="ladda-ner"
        aria-label="Ladda ner"
      >
        <div className="max-w-[1100px] mx-auto px-5 sm:px-8">
          {/* Closing-card */}
          <div
            className="relative overflow-hidden rounded-3xl sm:rounded-[2rem] p-8 sm:p-16 grid grid-cols-1 sm:grid-cols-[1.1fr_0.9fr] gap-8 sm:gap-12 items-center"
            style={{ background: '#4D5A28', color: '#FAF6EC' }}
          >
            {/* Dekorativ glow-effekt */}
            <div
              className="absolute pointer-events-none"
              style={{
                top: '-20%',
                right: '-10%',
                width: '60%',
                height: '140%',
                background: 'radial-gradient(circle, rgba(232,220,192,0.16) 0%, transparent 60%)',
              }}
              aria-hidden="true"
            />

            {/* Text + CTA */}
            <div className="relative">
              <Eyebrow style={{ color: '#E8DCC0' } as React.CSSProperties}>
                {config.closingEyebrow}
              </Eyebrow>
              <h2
                className="font-bold leading-[1.05] mb-5 max-w-[18ch]"
                style={{ fontSize: 'clamp(1.75rem, 4.5vw, 2.75rem)', letterSpacing: '-0.03em', color: '#FAF6EC' }}
              >
                {config.closingTitle.prefix}
                <span style={{ color: '#D4A574' }}>
                  <SA>{config.closingTitle.accent}</SA>
                </span>
              </h2>
              <p
                className="mb-7 max-w-[28rem]"
                style={{
                  fontSize: 'clamp(1.0625rem, 2vw, 1.1875rem)',
                  lineHeight: 1.55,
                  color: 'rgba(245,239,226,0.92)',
                }}
              >
                {config.closingLead}
              </p>
              <VLandingCTAV2
                label={config.closingCtaLabel}
                experimentId={config.experimentId}
                variant={config.hook}
                position="closing"
              />
              <p
                className="mt-4"
                style={{ fontSize: '0.875rem', color: 'rgba(245,239,226,0.7)' }}
              >
                {config.closingSubtext}
              </p>
            </div>

            {/* Bild — visas bara på sm+ */}
            <div
              className="hidden sm:block relative rounded-[1.25rem] overflow-hidden rotate-2"
              style={{
                aspectRatio: '1/1',
                boxShadow: '0 20px 50px -10px rgba(0,0,0,0.4)',
              }}
            >
              <Image
                src={config.closingImageSrc}
                alt={config.closingImageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 1100px) 45vw, 460px"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── RECRUIT (valfri) ── */}
      {config.recruit && (
        <section
          className="py-12 sm:py-16"
          style={{
            background: '#F5EFE2',
            borderTop: '1px solid rgba(42,40,32,0.08)',
          }}
          aria-label="Bli hundvakt"
        >
          <div className="max-w-[1100px] mx-auto px-5 sm:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 sm:gap-10">
              <div>
                <h2
                  className="font-bold leading-[1.05] mb-3"
                  style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', letterSpacing: '-0.025em', color: '#2A2820' }}
                >
                  {config.recruit.title.prefix}
                  <span style={{ color: '#6B7A3A' }}>
                    <SA>{config.recruit.title.accent}</SA>
                  </span>
                </h2>
                <p style={{ fontSize: '1.0625rem', color: '#5C5A50', maxWidth: '36rem' }}>
                  {config.recruit.body}
                </p>
              </div>
              <div className="shrink-0">
                <VLandingCTAV2
                  label={config.recruit.ctaLabel}
                  experimentId={config.experimentId}
                  variant={config.hook}
                  position="recruit"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── FOOTER ── minimal, mörk bakgrund ── */}
      <footer
        className="py-8"
        style={{
          background: '#2A2820',
          borderTop: '1px solid rgba(245,239,226,0.1)',
        }}
      >
        <div className="max-w-[1100px] mx-auto px-5 sm:px-8 flex flex-wrap justify-between items-center gap-4">
          <span style={{ fontSize: '0.8125rem', color: 'rgba(245,239,226,0.6)' }}>
            © {new Date().getFullYear()} Flocken — en tjänst från Spitakolus AB
          </span>
          <nav className="flex gap-5">
            {[
              { href: '/integritetspolicy', label: 'Integritet' },
              { href: '/anvandarvillkor', label: 'Villkor' },
              { href: '/support', label: 'Kontakt' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                style={{ fontSize: '0.8125rem', color: 'rgba(245,239,226,0.6)', textDecoration: 'none' }}
                className="hover:text-[#E8DCC0] transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </footer>

    </div>
  );
}
