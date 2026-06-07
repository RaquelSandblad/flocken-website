/**
 * HeaderV2 — Delad V2-header (samma design som startsidans).
 *
 * Statisk (ej fixed), papper-bakgrund, sajt-breda nav-länkar. Används av
 * (marketing)-layouten + direkt i HomepageV2/FunktionerV2 där det behövs.
 * Server component (bara länkar, ingen klient-JS).
 */

import Link from 'next/link';
import Image from 'next/image';

export function HeaderV2() {
  return (
    <header
      className="w-full"
      style={{
        background: 'rgba(250, 246, 236, 0.92)',
        borderBottom: '1px solid rgba(42, 40, 32, 0.06)',
      }}
    >
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8 flex items-center justify-between py-4">
        <Link href="/" aria-label="Flocken hem" className="flex items-center gap-2.5">
          <Image
            src="/assets/flocken/logo/logo_icon_flocken_large_1x1.png"
            alt="Flocken"
            width={36}
            height={36}
            style={{ height: 36, width: 'auto', display: 'block' }}
          />
          <span style={{ fontWeight: 700, fontSize: '1.125rem', color: '#2A2820' }}>Flocken</span>
        </Link>
        <nav className="hidden sm:flex gap-9 text-[0.9375rem] font-medium" style={{ color: '#5C5A50' }}>
          <Link href="/funktioner" className="hover:opacity-70 transition-opacity">Funktioner</Link>
          <Link href="/om-flocken" className="hover:opacity-70 transition-opacity">Om Flocken</Link>
        </nav>
        <Link
          href="/download"
          className="inline-flex items-center rounded-full font-semibold transition-opacity hover:opacity-90"
          style={{
            padding: '0.625rem 1.125rem',
            background: '#2A2820',
            color: '#FAF6EC',
            fontSize: '0.875rem',
          }}
        >
          Ladda ner
        </Link>
      </div>
    </header>
  );
}
