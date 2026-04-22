/**
 * VLandingPage — Återanvändbar layout för hookspecifika landningssidor (/v/[hook]).
 * Version 2 — 2026-04-14
 *
 * Server Component. Tar emot en VLandingConfig och renderar nio sektioner:
 *   [0] Header (sticky)    — transparent → vit vid scroll, client component
 *   [1] Hero               — clay-illustration fullbredd, gradient-overlay, vit text
 *   [2] Trust strip        — flocken-brown, tre trust signals med ikoner
 *   [3] Argument 1         — flocken-cream, tilted phone mockup höger
 *   [4] Argument 2         — vit, hand-bild vänster (karta)
 *   [5] Argument 3         — flocken-sand, overlapping mockups höger
 *   [6] Social proof       — flocken-brown, bento-grid med glassmorphism-citat
 *   [7] Closing CTA        — flocken-olive, hand-bild + CTA
 *   [8] Footer             — flocken-brown, minimal
 *
 * Interaktiva delar (tracking, plattformsdetektering, scroll-header) är
 * delegerade till client components.
 *
 * Ny hook = ny config-fil + ny route /app/v/[hook]/page.tsx.
 */

import Image from 'next/image';
import Link from 'next/link';
import { UserCircle, MessageCircle, Gift, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { VLandingCTA } from './VLandingCTA';
import { VLandingStickyHeader } from './VLandingStickyHeader';
import type { VLandingConfig, VLandingArgument, VLandingTrustSignal } from './VLandingConfig';

// ---------------------------------------------------------------------------
// Hjälpkomponent: Telefonmockup med tilt och skugga
// ---------------------------------------------------------------------------

interface PhoneMockupProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  sizes: string;
  tilt?: 'right' | 'left' | 'none';
  shadow?: 'elevated' | 'card';
  priority?: boolean;
  className?: string;
}

function PhoneMockup({
  src,
  alt,
  width,
  height,
  sizes,
  tilt = 'none',
  shadow = 'card',
  priority,
  className = '',
}: PhoneMockupProps) {
  const shadowStyle =
    shadow === 'elevated'
      ? '0 8px 24px rgba(62, 59, 50, 0.16)'
      : '0 4px 12px rgba(62, 59, 50, 0.12)';

  const tiltClass =
    tilt === 'right' ? 'rotate-3' : tilt === 'left' ? '-rotate-3' : '';

  return (
    <div
      className={cn('relative overflow-hidden', tiltClass, className)}
      style={{
        borderRadius: '20px',
        boxShadow: shadowStyle,
      }}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="w-full h-auto block"
        sizes={sizes}
        priority={priority}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Hjälpkomponent: Trust-ikon
// ---------------------------------------------------------------------------

function TrustIcon({ icon }: { icon: VLandingTrustSignal['icon'] }) {
  const cls = 'w-6 h-6 shrink-0 text-flocken-accent';
  if (icon === 'user-circle') return <UserCircle className={cls} aria-hidden="true" />;
  if (icon === 'message-circle') return <MessageCircle className={cls} aria-hidden="true" />;
  if (icon === 'map-pin') return <MapPin className={cls} aria-hidden="true" />;
  return <Gift className={cls} aria-hidden="true" />;
}

// ---------------------------------------------------------------------------
// Hjälpkomponent: Argument-bild — hanterar tre presentationsstilar
// ---------------------------------------------------------------------------

interface ArgumentImageProps {
  arg: VLandingArgument;
  isTextLeft: boolean;
}

function ArgumentImage({ arg, isTextLeft }: ArgumentImageProps) {
  // Argument 1: tilted-right — tilt 3 grader, mindre mockup för att inte spränga sektionen
  if (arg.imageStyle === 'tilted-right') {
    return (
      <div
        className={cn(
          'flex justify-center',
          isTextLeft ? 'lg:justify-end' : 'lg:justify-start',
        )}
      >
        <PhoneMockup
          src={arg.imageSrc}
          alt={arg.imageAlt}
          width={240}
          height={520}
          sizes="(max-width: 1024px) 200px, 240px"
          tilt="right"
          shadow="elevated"
          className="w-[200px] lg:w-[240px]"
          priority={false}
        />
      </div>
    );
  }

  // Argument 2: hand — transparent hand-bild, fyller kolumnen bättre
  if (arg.imageStyle === 'hand' || arg.imageStyle === 'tilted-left') {
    const isHand = arg.imageStyle === 'hand';
    return (
      <div
        className={cn(
          'flex justify-center',
          isTextLeft ? 'lg:justify-end' : 'lg:justify-start',
        )}
      >
        {isHand ? (
          <div className="w-[260px] lg:w-[320px]">
            <Image
              src={arg.imageSrc}
              alt={arg.imageAlt}
              width={320}
              height={566}
              className="w-full h-auto block"
              sizes="(max-width: 1024px) 260px, 320px"
            />
          </div>
        ) : (
          <PhoneMockup
            src={arg.imageSrc}
            alt={arg.imageAlt}
            width={220}
            height={476}
            sizes="(max-width: 1024px) 200px, 220px"
            tilt="left"
            shadow="card"
            className="w-[200px] sm:w-[220px]"
          />
        )}
      </div>
    );
  }

  // photo — foto/hand-mockup komposition 1:1, rounded-2xl, shadow-card
  if (arg.imageStyle === 'photo') {
    return (
      <div className={cn('flex justify-center', isTextLeft ? 'lg:justify-end' : 'lg:justify-start')}>
        <div className="w-[280px] lg:w-[360px]">
          <Image
            src={arg.imageSrc}
            alt={arg.imageAlt}
            width={720}
            height={720}
            className="w-full h-auto rounded-2xl shadow-[0_4px_12px_rgba(62,59,50,0.12)]"
            sizes="(max-width: 1024px) 280px, 360px"
          />
        </div>
      </div>
    );
  }

  // illustration — clay-illustration 1:1, rounded-2xl, shadow-soft, lite bredare
  if (arg.imageStyle === 'illustration') {
    return (
      <div className={cn('flex justify-center', isTextLeft ? 'lg:justify-end' : 'lg:justify-start')}>
        <div className="w-[300px] lg:w-[400px]">
          <Image
            src={arg.imageSrc}
            alt={arg.imageAlt}
            width={800}
            height={800}
            className="w-full h-auto rounded-2xl shadow-[0_2px_8px_rgba(62,59,50,0.08)]"
            sizes="(max-width: 1024px) 300px, 400px"
          />
        </div>
      </div>
    );
  }

  // Argument 3: overlapping — med tillräcklig bredd för att inte klippa bakgrundsmobil
  if (arg.imageStyle === 'overlapping') {
    return (
      <div
        className={cn(
          'flex justify-center',
          isTextLeft ? 'lg:justify-end' : 'lg:justify-start',
        )}
      >
        {/* Container bred nog för overlap — desktop: 320px + 80px offset = 400px */}
        <div className="relative w-[220px] lg:w-[320px] flex-shrink-0">
          {/* Bakgrundsmobil — visas bara på desktop */}
          {arg.secondaryImageSrc && (
            <div
              className="hidden lg:block absolute -left-12 top-4 z-0"
              style={{ width: '240px' }}
            >
              <div
                className="relative overflow-hidden opacity-50"
                style={{
                  borderRadius: '20px',
                  boxShadow: '0 4px 12px rgba(62, 59, 50, 0.12)',
                  filter: 'blur(1.5px)',
                }}
              >
                <Image
                  src={arg.secondaryImageSrc}
                  alt={arg.secondaryImageAlt ?? ''}
                  width={240}
                  height={520}
                  className="w-full h-auto block -rotate-3"
                  sizes="240px"
                />
              </div>
            </div>
          )}
          {/* Förgrundsmobil */}
          <div className="relative z-10">
            <PhoneMockup
              src={arg.imageSrc}
              alt={arg.imageAlt}
              width={280}
              height={605}
              sizes="(max-width: 1024px) 220px, 280px"
              tilt="right"
              shadow="elevated"
              className="w-[220px] lg:w-[280px]"
            />
          </div>
        </div>
      </div>
    );
  }

  return null;
}

// ---------------------------------------------------------------------------
// Huvudkomponent
// ---------------------------------------------------------------------------

interface VLandingPageProps {
  config: VLandingConfig;
}

export function VLandingPage({ config }: VLandingPageProps) {
  return (
    <div className="min-h-screen flex flex-col">

      {/* ------------------------------------------------------------------ */}
      {/* [0] HEADER — sticky, transparent → vit vid scroll (client component) */}
      {/* ------------------------------------------------------------------ */}
      <VLandingStickyHeader
        experimentId={config.experimentId}
        variant={config.hook}
        ctaLabel={config.headerCtaLabel}
      />

      {/* ------------------------------------------------------------------ */}
      {/* [1] HERO — clay-illustration fullbredd, gradient-overlay, vit text  */}
      {/* ------------------------------------------------------------------ */}
      <section className="relative overflow-hidden" aria-label="Hero">
        {/* Bakgrundsbild */}
        <div className="relative w-full h-[55vh] sm:h-[60vh] lg:h-[65vh] min-h-[400px]">
          {/* Mobil-version (< 640px): visas bara om heroImageSrcMobile är satt */}
          {config.heroImageSrcMobile && (
            <Image
              src={config.heroImageSrcMobile}
              alt={config.heroImageAlt}
              fill
              className="object-cover sm:hidden"
              style={{ objectPosition: config.heroObjectPosition ?? 'center 30%' }}
              sizes="100vw"
              priority
            />
          )}
          {/* Desktop/fallback-version: gömd på mobil om mobilbild finns, annars alltid synlig */}
          <Image
            src={config.heroImageSrc}
            alt={config.heroImageAlt}
            fill
            className={cn(
              'object-cover',
              config.heroImageSrcMobile && 'hidden sm:block'
            )}
            style={{ objectPosition: config.heroObjectPosition ?? 'center 30%' }}
            sizes="100vw"
            priority
          />
          {/* Gradient-overlay: mörkt nertill för läsbar text */}
          <div className="absolute inset-0 bg-gradient-to-t from-flocken-brown/80 via-flocken-brown/40 to-transparent" />

          {/* Text-innehåll — positionerat i nedre vänstra delen */}
          <div className="absolute inset-0 flex items-end">
            <div className="w-full max-w-[1120px] mx-auto px-4 sm:px-6 pb-8 sm:pb-10 lg:pb-12">

              {/* Mobil: centrerat, Desktop: vänsterställt */}
              <div className="flex flex-col items-center text-center lg:items-start lg:text-left lg:max-w-[560px]">

                {/* Announcement pill */}
                {config.heroPillText && (
                  <div className="mb-4 rounded-full border border-white/30 bg-white/20 backdrop-blur-sm px-4 py-1 text-sm text-white">
                    {config.heroPillText}
                  </div>
                )}

                <h1 className="text-[1.75rem] sm:text-4xl lg:text-[3rem] font-bold text-white lg:leading-[3.6rem] leading-snug mb-3 sm:mb-4">
                  {config.heroTitle}
                </h1>

                <p className="text-base sm:text-lg text-white/90 leading-relaxed mb-6 max-w-[480px]">
                  {config.heroSubtitle}
                </p>

                {/* CTA + social proof — desktop: rad, mobil: kolumn */}
                <div className="w-full lg:w-auto flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-5">
                  <VLandingCTA
                    label={config.ctaLabel}
                    experimentId={config.experimentId}
                    variant={config.hook}
                    position="hero-inverse"
                    className="w-full sm:w-auto lg:w-auto lg:min-w-[260px]"
                  />
                  <p className="text-[13px] text-white/80">
                    {config.heroSocialProof}
                  </p>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Sentinel för IntersectionObserver i StickyHeader */}
        <div id="hero-sentinel" aria-hidden="true" />
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* [2] TRUST STRIP — flocken-brown, tre trust signals                  */}
      {/* ------------------------------------------------------------------ */}
      <section className="bg-flocken-brown px-4 sm:px-6 py-6" aria-label="Trust signals">
        <div className="max-w-[1120px] mx-auto">

          {/* Mobil: vertikal stack */}
          <ul className="flex flex-col gap-3 lg:hidden" role="list">
            {config.trustSignals.map((signal) => (
              <li key={signal.text} className="flex items-center gap-3">
                <TrustIcon icon={signal.icon} />
                <span className="text-[14px] text-white/90">{signal.text}</span>
              </li>
            ))}
          </ul>

          {/* Desktop: horisontell rad med dividers */}
          <ul className="hidden lg:flex lg:items-center lg:justify-center lg:gap-0" role="list">
            {config.trustSignals.map((signal, i) => (
              <li
                key={signal.text}
                className={cn(
                  'flex items-center gap-3 px-8',
                  i > 0 && 'border-l border-flocken-gray/30',
                )}
              >
                <TrustIcon icon={signal.icon} />
                <span className="text-[14px] text-white/90">{signal.text}</span>
              </li>
            ))}
          </ul>

        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* [3] ARGUMENT 1 — flocken-cream, tilted phone mockup höger           */}
      {/* [4] ARGUMENT 2 — vit, hand-bild vänster                             */}
      {/* [5] ARGUMENT 3 — flocken-sand, overlapping mockups höger            */}
      {/* ------------------------------------------------------------------ */}
      {config.arguments.map((arg, i) => {
          // Alternerande layout: jämnt index = text vänster, udda = bild vänster.
          // Ger naturlig "zig-zag" oavsett antal block (3, 5, eller fler).
          const isTextLeft = i % 2 === 0;
          const bgClass = config.argumentBackgrounds[i];

          return (
            <section
              key={arg.title}
              className={cn(bgClass, 'px-4 sm:px-6 py-10 sm:py-12')}
              aria-label={`Argument ${i + 1}`}
            >
              <div className="max-w-[1120px] mx-auto">
                <div className="flex flex-col lg:flex-row lg:items-start lg:gap-16">

                  {/* Text */}
                  <div
                    className={cn(
                      'mb-8 lg:mb-0 lg:pt-8',
                      isTextLeft
                        ? 'lg:w-[55%] lg:order-1'
                        : 'lg:w-[55%] lg:order-2',
                    )}
                  >
                    <h2 className="text-[1.375rem] sm:text-[1.75rem] lg:text-[2rem] font-bold text-flocken-brown leading-snug mb-4">
                      {arg.title}
                    </h2>
                    <p className="text-[15px] sm:text-base text-flocken-brown leading-relaxed max-w-[440px]">
                      {arg.body}
                    </p>
                  </div>

                  {/* Bild */}
                  <div
                    className={cn(
                      'lg:w-[45%]',
                      isTextLeft ? 'lg:order-2' : 'lg:order-1',
                    )}
                  >
                    <ArgumentImage arg={arg} isTextLeft={isTextLeft} />
                  </div>

                </div>
              </div>
            </section>
          );
        },
      )}

      {/* ------------------------------------------------------------------ */}
      {/* [6] SOCIAL PROOF — flocken-brown, bento-grid med glassmorphism-kort */}
      {/* ------------------------------------------------------------------ */}
      <section className="bg-flocken-brown px-4 sm:px-6 py-14 sm:py-16" aria-label="Omdömen">
        <div className="max-w-[1120px] mx-auto">

          {/* Rubrik */}
          <p className="text-center text-[13px] lg:text-[14px] text-flocken-accent uppercase tracking-[1px] mb-6 lg:mb-8 font-medium">
            {config.socialProofLabel}
          </p>

          {/* Citat-kort — mobil: stack, desktop: bento grid */}
          <ul
            className="flex flex-col gap-4 lg:grid lg:grid-cols-3 lg:gap-6"
            role="list"
          >
            {config.socialProofQuotes.map((item, i) => (
              <li
                key={i}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6"
              >
                <blockquote className="text-[15px] text-white italic leading-relaxed mb-4">
                  &ldquo;{item.quote}&rdquo;
                </blockquote>
                <cite className="not-italic text-[13px] text-white/80 font-medium">
                  — {item.name}, {item.city}
                </cite>
              </li>
            ))}
          </ul>

        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* [7] CLOSING CTA — flocken-olive, clay-bild + CTA                   */}
      {/* ------------------------------------------------------------------ */}
      <section
        className="bg-flocken-olive px-4 sm:px-6 py-12 sm:py-14 lg:py-16"
        aria-label="Ladda ner"
      >
        <div className="max-w-[1120px] mx-auto">

          {/* Mobil: centrerat, text + CTA, clay-bild under */}
          <div className="flex flex-col items-center text-center lg:hidden">
            <h2 className="text-[1.5rem] font-bold text-white leading-snug mb-3">
              {config.closingHeadline}
            </h2>
            <p className="text-[15px] text-white/90 leading-relaxed mb-6 max-w-xs">
              {config.closingBody}
            </p>
            <VLandingCTA
              label={config.ctaLabel}
              experimentId={config.experimentId}
              variant={config.hook}
              position="closing"
              className="w-full"
            />
            <p className="mt-3 text-[13px] text-white/90">
              {config.closingSubtext}
            </p>
            <div className="mt-8 w-[280px]">
              <Image
                src={config.closingImageSrc}
                alt={config.closingImageAlt}
                width={560}
                height={560}
                className="w-full h-auto rounded-2xl shadow-[0_4px_12px_rgba(62,59,50,0.12)]"
                sizes="280px"
              />
            </div>
          </div>

          {/* Desktop: text vänster, clay-bild höger centrerad vertikalt */}
          <div className="hidden lg:flex lg:items-center lg:gap-12">
            {/* Text + CTA vänster */}
            <div className="lg:w-[55%]">
              <h2 className="text-[2.25rem] font-bold text-white leading-snug mb-4 max-w-[480px]">
                {config.closingHeadline}
              </h2>
              <p className="text-base text-white/90 leading-relaxed mb-6 max-w-sm">
                {config.closingBody}
              </p>
              <VLandingCTA
                label={config.ctaLabel}
                experimentId={config.experimentId}
                variant={config.hook}
                position="closing"
                className="lg:min-w-[280px]"
              />
              <p className="mt-3 text-[13px] text-white/90">
                {config.closingSubtext}
              </p>
            </div>

            {/* Clay-bild höger — avrundad, centrerad vertikalt, max 360px */}
            <div className="lg:w-[45%] flex justify-end items-center">
              <div className="w-[360px]">
                <Image
                  src={config.closingImageSrc}
                  alt={config.closingImageAlt}
                  width={720}
                  height={720}
                  className="w-full h-auto rounded-2xl shadow-[0_8px_24px_rgba(62,59,50,0.16)]"
                  sizes="360px"
                />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* [8] REKRYTERING — valfri sektion, flocken-cream, kort CTA          */}
      {/* ------------------------------------------------------------------ */}
      {config.recruitHeadline && config.recruitBody && (
        <section className="bg-flocken-cream px-4 sm:px-6 py-10 sm:py-12" aria-label="Bli hundvakt">
          <div className="max-w-[640px] mx-auto text-center">
            <h2 className="text-[1.25rem] sm:text-[1.5rem] font-bold text-flocken-brown leading-snug mb-2">
              {config.recruitHeadline}
            </h2>
            <p className="text-[15px] text-flocken-brown/80 leading-relaxed mb-5">
              {config.recruitBody}
            </p>
            <VLandingCTA
              label={config.recruitCtaLabel || config.ctaLabel}
              experimentId={config.experimentId}
              variant={config.hook}
              position="recruit"
            />
          </div>
        </section>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* [9] FOOTER — flocken-brown, minimal                                 */}
      {/* ------------------------------------------------------------------ */}
      <footer className="bg-flocken-brown px-4 sm:px-6 py-6">
        <div className="max-w-[1120px] mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-[13px]">
          <span className="text-white">Spitakolus AB</span>
          <span className="hidden sm:inline text-flocken-gray">|</span>
          <div className="flex items-center gap-4">
            <Link
              href="/integritetspolicy"
              className="text-flocken-gray hover:text-white transition-colors"
            >
              Integritetspolicy
            </Link>
            <span className="text-flocken-gray">|</span>
            <Link
              href="/villkor"
              className="text-flocken-gray hover:text-white transition-colors"
            >
              Villkor
            </Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
