'use client';

/**
 * HomepageFooterV2 — Full footer i V2-stil (ink) för startsidan.
 *
 * Ersätter den minimala 3-länks-footern. Samma länkar som globala
 * shared/Footer (variant=marketing): Appen + Juridiskt + social +
 * Cookie-inställningar. Client component pga cookie-knappens onClick.
 */

import Link from 'next/link';
import Image from 'next/image';

const INK = '#2A2820';
const PAPER_DIM = 'rgba(245, 239, 226, 0.62)';
const PAPER = '#FAF6EC';

function linkStyle(): React.CSSProperties {
  return { color: PAPER_DIM, textDecoration: 'none', fontSize: '0.9375rem' };
}

export function HomepageFooterV2() {
  const year = new Date().getFullYear();
  return (
    <footer style={{ background: INK }}>
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 min-[900px]:grid-cols-4 gap-10">
          {/* Varumärke + social */}
          <div className="min-[900px]:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/assets/flocken/logo/logo_icon_flocken_large_1x1.png"
                alt="Flocken"
                width={36}
                height={36}
                style={{ height: 36, width: 'auto', display: 'block' }}
              />
              <span style={{ fontSize: '1.25rem', fontWeight: 700, color: PAPER }}>Flocken</span>
            </div>
            <p style={{ color: PAPER_DIM, fontSize: '0.9375rem', maxWidth: '22rem', marginBottom: '1.25rem' }}>
              Ett enklare liv som hundägare. Allt för hundlivet, samlat i en app.
            </p>
            <div className="flex gap-5">
              <a
                href="https://www.instagram.com/flocken_app/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#E8DCC0] transition-colors"
                style={linkStyle()}
              >
                Instagram
              </a>
              <a
                href="https://www.facebook.com/flocken.info"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#E8DCC0] transition-colors"
                style={linkStyle()}
              >
                Facebook
              </a>
            </div>
          </div>

          {/* Appen */}
          <div>
            <h4 style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8BA45D', marginBottom: '1.125rem' }}>
              Appen
            </h4>
            <ul className="flex flex-col gap-3">
              <li><Link href="/funktioner#hundar" className="hover:text-[#E8DCC0] transition-colors" style={linkStyle()}>Hundar</Link></li>
              <li><Link href="/funktioner#passa" className="hover:text-[#E8DCC0] transition-colors" style={linkStyle()}>Passa</Link></li>
              <li><Link href="/funktioner#rasta" className="hover:text-[#E8DCC0] transition-colors" style={linkStyle()}>Rasta</Link></li>
              <li><Link href="/funktioner#besoka" className="hover:text-[#E8DCC0] transition-colors" style={linkStyle()}>Besöka</Link></li>
              <li><Link href="/om-flocken" className="hover:text-[#E8DCC0] transition-colors" style={linkStyle()}>Om Flocken</Link></li>
            </ul>
          </div>

          {/* Juridiskt */}
          <div>
            <h4 style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8BA45D', marginBottom: '1.125rem' }}>
              Juridiskt
            </h4>
            <ul className="flex flex-col gap-3">
              <li><Link href="/integritetspolicy" className="hover:text-[#E8DCC0] transition-colors" style={linkStyle()}>Integritetspolicy</Link></li>
              <li><Link href="/cookiepolicy" className="hover:text-[#E8DCC0] transition-colors" style={linkStyle()}>Cookiepolicy</Link></li>
              <li><Link href="/anvandarvillkor" className="hover:text-[#E8DCC0] transition-colors" style={linkStyle()}>Användarvillkor</Link></li>
              <li><Link href="/support" className="hover:text-[#E8DCC0] transition-colors" style={linkStyle()}>Kontakt</Link></li>
              <li>
                <button
                  onClick={() => {
                    if (typeof window !== 'undefined' && window.showCookieSettings) {
                      window.showCookieSettings();
                    }
                  }}
                  className="hover:text-[#E8DCC0] transition-colors text-left"
                  style={{ ...linkStyle(), background: 'transparent', border: 'none', padding: 0, cursor: 'pointer' }}
                >
                  Cookie-inställningar
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div
          className="mt-12 pt-8 text-center"
          style={{ borderTop: '1px solid rgba(245, 239, 226, 0.1)', fontSize: '0.8125rem', color: 'rgba(245, 239, 226, 0.5)' }}
        >
          © {year} Flocken, en tjänst från Spitakolus AB. Alla rättigheter förbehållna.
        </div>
      </div>
    </footer>
  );
}
