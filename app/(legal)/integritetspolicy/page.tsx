'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { LanguageSwitcher, type Language } from '@/components/legal/LanguageSwitcher';
import { PrivacySV } from '@/components/legal/privacy-content/PrivacySV';
import { PrivacyDA } from '@/components/legal/privacy-content/PrivacyDA';
import { PrivacyNO } from '@/components/legal/privacy-content/PrivacyNO';
import { PrivacyPT } from '@/components/legal/privacy-content/PrivacyPT';

const titles: Record<Language, string> = {
  sv: 'Integritetspolicy för Flocken',
  da: 'Privatlivspolitik for Flocken',
  no: 'Personvernerklæring for Flocken',
  pt: 'Política de Privacidade da Flocken',
};

function PrivacyPageContent() {
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
      {lang === 'sv' && <PrivacySV />}
      {lang === 'da' && <PrivacyDA />}
      {lang === 'no' && <PrivacyNO />}
      {lang === 'pt' && <PrivacyPT />}
    </>
  );
}

export default function IntegritetspolicyPage() {
  return (
    <Suspense fallback={<div className="animate-pulse h-96" />}>
      <PrivacyPageContent />
    </Suspense>
  );
}
