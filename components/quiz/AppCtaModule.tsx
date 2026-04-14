'use client';

import { useEffect, useRef, useState } from 'react';

const EXPERIMENT_ID = 'quiz_app_cta_v1';
const STORAGE_KEY = 'flocken_ab_quiz_app_cta_v1';
const APPSTORE_URL = 'https://apps.apple.com/app/flocken/id6755424578';
const PLAYSTORE_URL = 'https://play.google.com/store/apps/details?id=com.bastavan.app';
const DOWNLOAD_URL = 'https://flocken.info/download'; // fallback for desktop/unknown

type VariantId = 'A' | 'B' | 'C';
type Platform = 'ios' | 'android' | 'desktop';

interface VariantContent {
  headline: string;
  body: string;
  imageSrc: string;
  imageAlt: string;
}

const VARIANTS: Record<VariantId, VariantContent> = {
  A: {
    headline: 'Se hundar på kartan i din stad',
    body: 'Scrolla bland hundar – lägg upp din egen på några minuter',
    imageSrc: '/assets/flocken/quiz-cta/variant-a-karta.png',
    imageAlt: 'Karta med hundar i Flocken-appen',
  },
  B: {
    headline: 'Hitta hundar som matchar din',
    body: 'Se personlighet och bilder – hitta rätt match direkt',
    imageSrc: '/assets/flocken/quiz-cta/variant-b-match.png',
    imageAlt: 'Hundprofiler i Flocken-appen',
  },
  C: {
    headline: 'Hitta hundvakt som passar dig',
    body: 'Se hundvakter nära dig – nya varje dag',
    imageSrc: '/assets/flocken/quiz-cta/variant-c-hundvakt.png',
    imageAlt: 'Hundvakt i Flocken-appen',
  },
};

const ALL_VARIANTS: VariantId[] = ['A', 'B', 'C'];

function isValidVariant(v: string | null): v is VariantId {
  return v !== null && (ALL_VARIANTS as string[]).includes(v);
}

function pickVariant(): VariantId {
  return ALL_VARIANTS[Math.floor(Math.random() * ALL_VARIANTS.length)];
}

interface AppCtaModuleProps {
  quizSlug: string;
}

function detectPlatform(): Platform {
  if (typeof navigator === 'undefined') return 'desktop';
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('ipod')) return 'ios';
  // iPadOS 13+ reports as Macintosh
  if (ua.includes('macintosh') && 'ontouchend' in document) return 'ios';
  if (ua.includes('android')) return 'android';
  return 'desktop';
}

function getCtaUrl(platform: Platform): string {
  if (platform === 'ios') return APPSTORE_URL;
  if (platform === 'android') return PLAYSTORE_URL;
  return DOWNLOAD_URL;
}

function getCtaLabel(platform: Platform): string {
  if (platform === 'ios') return 'Ladda ner på App Store';
  if (platform === 'android') return 'Ladda ner på Google Play';
  return 'Ladda ner Flocken-appen';
}

export function AppCtaModule({ quizSlug }: AppCtaModuleProps) {
  const [variant, setVariant] = useState<VariantId | null>(null);
  const [imgError, setImgError] = useState(false);
  const [platform, setPlatform] = useState<Platform>('desktop');
  const hasTrackedView = useRef(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const resolved = isValidVariant(stored) ? stored : pickVariant();

    if (!isValidVariant(stored)) {
      localStorage.setItem(STORAGE_KEY, resolved);
    }

    setVariant(resolved);
    setPlatform(detectPlatform());
  }, []);

  useEffect(() => {
    if (!variant || hasTrackedView.current) return;
    hasTrackedView.current = true;

    const eventData = {
      experiment_id: EXPERIMENT_ID,
      variant_id: variant,
      quiz_slug: quizSlug,
    };

    // GA4 via gtag (direct - same as click tracking)
    if (window.gtag) {
      window.gtag('event', 'quiz_app_cta_view', eventData);
    }

    // GTM dataLayer (backup)
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'quiz_app_cta_view',
      ...eventData,
    });

    if (process.env.NODE_ENV === 'development') {
      console.log('[Quiz CTA] View tracked:', eventData);
    }
  }, [variant, quizSlug]);

  if (!variant) {
    return (
      <div
        className="animate-pulse overflow-hidden rounded-[var(--quiz-radius-card)] border border-flocken-olive/25 bg-gradient-to-br from-flocken-cream to-flocken-sand shadow-card"
        aria-hidden="true"
      >
        <div className="grid md:grid-cols-[1fr_220px]">
          <div className="space-y-3 p-6 md:p-8">
            <div className="h-3 w-32 rounded bg-flocken-olive/10" />
            <div className="h-6 w-3/4 rounded bg-flocken-olive/10" />
            <div className="h-4 w-2/3 rounded bg-flocken-olive/10" />
            <div className="h-10 w-48 rounded-xl bg-flocken-olive/10" />
          </div>
          <div className="min-h-[180px] bg-flocken-sand/50 md:min-h-0" />
        </div>
      </div>
    );
  }

  const content = VARIANTS[variant];
  const ctaUrl = getCtaUrl(platform);
  const ctaLabel = getCtaLabel(platform);

  function handleClick() {
    const eventData = {
      experiment_id: EXPERIMENT_ID,
      variant_id: variant,
      cta_name: 'quiz_result_download',
      cta_destination: ctaUrl,
      cta_platform: platform,
      quiz_slug: quizSlug,
      source: 'quiz_result',
    };

    // GA4 via gtag (direct - doesn't need GTM tag)
    if (window.gtag) {
      window.gtag('event', 'cta_click', eventData);
    }

    // Meta Pixel
    if (window.fbq) {
      window.fbq('trackCustom', 'CTAClick', eventData);
    }

    // GTM dataLayer (backup - uses existing cta_click tag)
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'cta_click',
      ...eventData,
    });

    // Debug logging
    if (process.env.NODE_ENV === 'development') {
      console.log('[Quiz CTA] Click tracked:', eventData);
    }
  }

  return (
    <a
      href={ctaUrl}
      onClick={handleClick}
      className="group block overflow-hidden rounded-[var(--quiz-radius-card)] border border-flocken-olive/25 bg-gradient-to-br from-flocken-cream to-flocken-sand no-underline shadow-card transition-shadow hover:shadow-lg"
      aria-label={`${content.headline} – Ladda ner Flocken-appen`}
    >
      <div className="grid items-center md:grid-cols-[3fr_2fr]">

        {/* Text + CTA */}
        <div className="flex flex-col justify-center p-6 md:py-8 md:pl-8 md:pr-2">
          {/* Label */}
          <span className="text-[11px] font-semibold uppercase tracking-widest text-flocken-olive/60">
            Upptäck Flocken-appen
          </span>

          {/* Headline */}
          <h2 className="mt-2 text-xl font-bold leading-snug text-flocken-brown sm:text-2xl">
            {content.headline}
          </h2>

          {/* Body */}
          <p className="mt-2 text-sm leading-relaxed text-flocken-brown/70">
            {content.body}
          </p>

          {/* CTA button */}
          <div className="mt-5">
            <span className="inline-flex items-center gap-2 rounded-xl bg-flocken-olive px-5 py-3 text-sm font-semibold text-white transition-colors group-hover:bg-flocken-accent">
              {ctaLabel}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="size-3.5"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M6.22 4.22a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.75.75 0 0 1-1.06-1.06L8.94 8 6.22 5.28a.75.75 0 0 1 0-1.06Z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          </div>

          {/* Subtext */}
          <p className="mt-2 text-xs text-flocken-gray">
            Gratis i App Store &amp; Google Play
          </p>
        </div>

        {/* Image – 1:1 screenshots, padding keeps them off the edge */}
        <div className="flex items-center justify-center p-4 md:py-5 md:pl-2 md:pr-5">
          {!imgError ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={content.imageSrc}
              alt={content.imageAlt}
              onError={() => setImgError(true)}
              className="h-auto w-full rounded-lg object-contain"
            />
          ) : (
            <Placeholder variant={variant} />
          )}
        </div>

      </div>
    </a>
  );
}

function Placeholder({ variant }: { variant: VariantId }) {
  const gradients: Record<VariantId, string> = {
    A: 'from-flocken-olive/20 to-flocken-male/30',
    B: 'from-flocken-female/20 to-flocken-sand',
    C: 'from-flocken-brown/10 to-flocken-olive/20',
  };

  return (
    <div
      className={`flex h-full min-h-[180px] flex-col items-center justify-center gap-2 bg-gradient-to-br ${gradients[variant]} p-4`}
    >
      <span className="text-3xl">🐾</span>
      <span className="text-center text-xs font-medium text-flocken-brown/50">
        App-skärmbild variant {variant}
        <br />
        (placeholder)
      </span>
    </div>
  );
}
