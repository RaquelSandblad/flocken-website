'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { LanguageSwitcher, type Language } from '@/components/legal/LanguageSwitcher';
import { TermsSV } from '@/components/legal/terms-content/TermsSV';
import { TermsDA } from '@/components/legal/terms-content/TermsDA';
import { TermsNO } from '@/components/legal/terms-content/TermsNO';
import { TermsPT } from '@/components/legal/terms-content/TermsPT';

const titles: Record<Language, string> = {
  sv: 'Användarvillkor | Flocken',
  da: 'Brugervilkår | Flocken',
  no: 'Brukervilkår | Flocken',
  pt: 'Termos de Uso | Flocken',
};

function TermsPageContent() {
  const searchParams = useSearchParams();
  const langParam = searchParams.get('lang') as Language | null;
  const [lang, setLang] = useState<Language>(
    langParam && ['sv', 'da', 'no', 'pt'].includes(langParam) ? langParam : 'sv'
  );

  useEffect(() => {
    document.title = titles[lang];
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', titles[lang]);
    }
  }, [lang]);

  return (
    <>
      <LanguageSwitcher current={lang} onChange={setLang} />
      {lang === 'sv' && <TermsSV />}
      {lang === 'da' && <TermsDA />}
      {lang === 'no' && <TermsNO />}
      {lang === 'pt' && <TermsPT />}
    </>
  );
}

export default function AnvandarvillkorPage() {
  return (
    <Suspense fallback={<div className="animate-pulse h-96" />}>
      <TermsPageContent />
    </Suspense>
  );
}
