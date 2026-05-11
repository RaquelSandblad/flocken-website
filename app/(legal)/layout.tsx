'use client';

import { Suspense } from 'react';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { TableOfContents } from '@/components/legal/TableOfContents';
import { LanguageProvider } from '@/components/legal/LanguageContext';

function LegalLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header variant="legal" />
      <div className="pt-20 min-h-screen">
        <div className="container-custom py-12">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar - Desktop only */}
            <aside className="hidden lg:block lg:col-span-1">
              <div className="sticky top-24">
                <TableOfContents />
              </div>
            </aside>
            
            {/* Main content */}
            <main className="lg:col-span-3">
              <article className="prose">
                {children}
              </article>
            </main>
          </div>
        </div>
      </div>
      <Footer variant="legal" />
    </>
  );
}

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div className="animate-pulse h-96" />}>
      <LanguageProvider>
        <LegalLayoutContent>{children}</LegalLayoutContent>
      </LanguageProvider>
    </Suspense>
  );
}

