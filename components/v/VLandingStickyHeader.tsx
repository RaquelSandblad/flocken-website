'use client';

/**
 * VLandingStickyHeader — Sticky header för /v/[hook]-sidor.
 *
 * Transparent default → vit med skugga vid scroll.
 * Detekterar scroll via IntersectionObserver mot en sentinel-div
 * direkt under hero-sektionen.
 *
 * Kräver att en <div id="hero-sentinel"> placeras under hero i servern.
 */

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { VLandingCTA } from './VLandingCTA';

interface VLandingStickyHeaderProps {
  experimentId: string;
  variant: string;
  ctaLabel?: string;
}

export function VLandingStickyHeader({
  experimentId,
  variant,
  ctaLabel = 'Hitta hundvakt',
}: VLandingStickyHeaderProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const sentinel = document.getElementById('hero-sentinel');
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Når sentinel lämnar viewporten (scroll förbi hero) → scrolled = true
        setScrolled(!entry.isIntersecting);
      },
      { threshold: 0 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-white shadow-sm border-b border-flocken-sand/40'
          : 'bg-transparent',
      )}
    >
      <div className="max-w-[1120px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          aria-label="Flocken — tillbaka till startsidan"
        >
          <Image
            src="/assets/flocken/logo/logo_icon_flocken_large_1x1.png"
            alt=""
            width={28}
            height={28}
            className="rounded-lg"
            priority
          />
          <span
            className={cn(
              'text-base font-bold transition-colors duration-300',
              scrolled ? 'text-flocken-brown' : 'text-white',
            )}
          >
            Flocken
          </span>
        </Link>

        <VLandingCTA
          label={ctaLabel}
          experimentId={experimentId}
          variant={variant}
          position="header"
        />
      </div>
    </header>
  );
}
