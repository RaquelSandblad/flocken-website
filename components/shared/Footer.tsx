'use client';

import Link from 'next/link';
import Image from 'next/image';

// Window interface extensions are defined in types/window.d.ts

interface FooterProps {
  variant?: 'marketing' | 'legal';
}

export function Footer({ variant = 'marketing' }: FooterProps) {
  return (
    <footer className={`${
      variant === 'marketing' ? 'bg-flocken-sand' : 'bg-white border-t border-flocken-sand'
    } py-12`}>
      <div className="container-custom">
        {variant === 'marketing' ? (
          // Full marketing footer
          <div className="grid md:grid-cols-4 gap-8">
            {/* Logo + Tagline */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <Image
                  src="/assets/flocken/logo/logo_icon_flocken_large_1x1.png"
                  alt="Flocken"
                  width={40}
                  height={40}
                  className="rounded-lg"
                />
                <span className="text-xl font-bold text-flocken-brown">Flocken</span>
              </div>
              <p className="text-flocken-gray text-sm mb-4">
                För ett bättre liv som hund
              </p>
              <div className="flex gap-4">
                {/* Social links - placeholder for now */}
                <a href="#" className="text-flocken-gray hover:text-flocken-olive transition-colors">Instagram</a>
                <a href="#" className="text-flocken-gray hover:text-flocken-olive transition-colors">Facebook</a>
              </div>
            </div>
            
            {/* Links */}
            <div>
              <h4 className="font-semibold text-flocken-brown mb-4">Appen</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/#para" className="text-flocken-gray hover:text-flocken-olive transition-colors">Para</Link></li>
                <li><Link href="/#passa" className="text-flocken-gray hover:text-flocken-olive transition-colors">Passa</Link></li>
                <li><Link href="/#rasta" className="text-flocken-gray hover:text-flocken-olive transition-colors">Rasta</Link></li>
                <li><Link href="/#besoka" className="text-flocken-gray hover:text-flocken-olive transition-colors">Besöka</Link></li>
              </ul>
            </div>
            
            {/* Legal */}
            <div>
              <h4 className="font-semibold text-flocken-brown mb-4">Juridiskt</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/integritetspolicy" className="text-flocken-gray hover:text-flocken-olive transition-colors">Integritetspolicy</Link></li>
                <li><Link href="/anvandarvillkor" className="text-flocken-gray hover:text-flocken-olive transition-colors">Användarvillkor</Link></li>
                <li><Link href="/support" className="text-flocken-gray hover:text-flocken-olive transition-colors">Kontakt</Link></li>
                <li>
                  <button 
                    onClick={() => {
                      if (typeof window !== 'undefined' && window.showCookieSettings) {
                        window.showCookieSettings();
                      }
                    }}
                    className="text-flocken-gray hover:text-flocken-olive transition-colors text-left"
                  >
                    Cookie-inställningar
                  </button>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          // Minimal legal footer
          <div className="text-center">
            <p className="text-sm text-flocken-gray">
              <Link href="/integritetspolicy" className="hover:text-flocken-olive transition-colors">Integritetspolicy</Link>
              {' · '}
              <Link href="/anvandarvillkor" className="hover:text-flocken-olive transition-colors">Användarvillkor</Link>
              {' · '}
              <button 
                onClick={() => {
                  if (typeof window !== 'undefined' && window.showCookieSettings) {
                    window.showCookieSettings();
                  }
                }}
                className="hover:text-flocken-olive transition-colors"
              >
                Cookie-inställningar
              </button>
            </p>
          </div>
        )}
        
        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-flocken-warm text-center text-sm text-flocken-gray">
          © {new Date().getFullYear()} Spitakolus AB. Alla rättigheter förbehållna.
        </div>
      </div>
    </footer>
  );
}

