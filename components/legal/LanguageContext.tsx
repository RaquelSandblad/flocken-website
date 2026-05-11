'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSearchParams } from 'next/navigation';

export type Language = 'sv' | 'da' | 'no' | 'pt';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  const langParam = searchParams.get('lang') as Language | null;
  const [language, setLanguage] = useState<Language>(
    langParam && ['sv', 'da', 'no', 'pt'].includes(langParam) ? langParam : 'sv'
  );

  // Update language if URL param changes
  useEffect(() => {
    if (langParam && ['sv', 'da', 'no', 'pt'].includes(langParam)) {
      setLanguage(langParam);
    }
  }, [langParam]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
