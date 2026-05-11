'use client';

import { useEffect } from 'react';
import { LanguageSwitcher } from '@/components/legal/LanguageSwitcher';
import { useLanguage } from '@/components/legal/LanguageContext';
import { TermsSV } from '@/components/legal/terms-content/TermsSV';
import { TermsDA } from '@/components/legal/terms-content/TermsDA';
import { TermsNO } from '@/components/legal/terms-content/TermsNO';
import { TermsPT } from '@/components/legal/terms-content/TermsPT';

const titles = {
  sv: 'Användarvillkor | Flocken',
  da: 'Brugervilkår | Flocken',
  no: 'Brukervilkår | Flocken',
  pt: 'Termos de Uso | Flocken',
} as const;

export default function AnvandarvillkorPage() {
  const { language, setLanguage } = useLanguage();

  useEffect(() => {
    document.title = titles[language];
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', titles[language]);
    }
  }, [language]);

  return (
    <>
      <LanguageSwitcher current={language} onChange={setLanguage} />
      {language === 'sv' && <TermsSV />}
      {language === 'da' && <TermsDA />}
      {language === 'no' && <TermsNO />}
      {language === 'pt' && <TermsPT />}
    </>
  );
}
