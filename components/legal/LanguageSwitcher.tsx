'use client';

export type Language = 'sv' | 'da' | 'no';

interface LanguageSwitcherProps {
  current: Language;
  onChange: (lang: Language) => void;
}

const labels: Record<Language, string> = {
  sv: 'Svenska',
  da: 'Dansk',
  no: 'Norsk',
};

export function LanguageSwitcher({ current, onChange }: LanguageSwitcherProps) {
  return (
    <div className="flex items-center gap-2 mb-8 pb-4 border-b border-flocken-sand">
      <span className="text-sm text-flocken-gray mr-1">Språk:</span>
      {(Object.keys(labels) as Language[]).map((lang) => (
        <button
          key={lang}
          onClick={() => onChange(lang)}
          className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
            current === lang
              ? 'bg-flocken-olive text-white font-medium'
              : 'bg-flocken-sand/50 text-flocken-brown hover:bg-flocken-sand'
          }`}
        >
          {labels[lang]}
        </button>
      ))}
    </div>
  );
}
