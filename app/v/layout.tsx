/**
 * Layout för /v/[hook]-landningssidor.
 *
 * Minimal: ingen standard Header, ingen standard Footer, inga navigations-
 * länkar. Sidan renderar sin egen inbyggda header/footer via VLandingPage.
 *
 * Indexeras INTE av sökmotorer (noindex) — landningssidorna är för betald
 * trafik och ska inte dra organisk trafik bort från /.
 */

import type { Metadata } from 'next';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function VLayout({ children }: { children: React.ReactNode }) {
  // Ingen header/footer härifrån — VLandingPage hanterar sin egen.
  return <>{children}</>;
}
