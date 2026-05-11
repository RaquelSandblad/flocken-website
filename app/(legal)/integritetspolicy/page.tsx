'use client';

import { useEffect } from 'react';
import { LanguageSwitcher } from '@/components/legal/LanguageSwitcher';
import { useLanguage } from '@/components/legal/LanguageContext';
import { PrivacySV } from '@/components/legal/privacy-content/PrivacySV';
import { PrivacyDA } from '@/components/legal/privacy-content/PrivacyDA';
import { PrivacyNO } from '@/components/legal/privacy-content/PrivacyNO';
import { PrivacyPT } from '@/components/legal/privacy-content/PrivacyPT';

const titles = {
  sv: 'Integritetspolicy för Flocken',
  da: 'Privatlivspolitik for Flocken',
  no: 'Personvernerklæring for Flocken',
  pt: 'Política de Privacidade da Flocken',
} as const;

export default function IntegritetspolicyPage() {
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
      {language === 'sv' && <PrivacySV />}
      {language === 'da' && <PrivacyDA />}
      {language === 'no' && <PrivacyNO />}
      {language === 'pt' && <PrivacyPT />}
    </>
  );
}
