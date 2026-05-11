'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

type Language = 'sv' | 'da' | 'no' | 'pt';

const tocTitles: Record<Language, string> = {
  sv: 'På denna sida',
  da: 'På denne side',
  no: 'På denne siden',
  pt: 'Nesta página',
};

export function TableOfContents() {
  const searchParams = useSearchParams();
  const [items, setItems] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const lang = (searchParams.get('lang') as Language) || 'sv';
  
  useEffect(() => {
    // Find all h2 and h3 headings with IDs
    const headings = Array.from(
      document.querySelectorAll('h2[id], h3[id]')
    );
    
    const tocItems: TOCItem[] = headings.map((heading) => ({
      id: heading.id,
      text: heading.textContent || '',
      level: heading.tagName === 'H2' ? 2 : 3,
    }));
    
    setItems(tocItems);
    
    // Intersection observer for active section
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-80px 0px -80% 0px' }
    );
    
    headings.forEach((heading) => observer.observe(heading));
    
    return () => observer.disconnect();
  }, []);
  
  if (items.length === 0) return null;
  
  return (
    <nav className="space-y-2">
      <p className="text-sm font-semibold text-flocken-brown mb-4">
        {tocTitles[lang]}
      </p>
      {items.map((item) => (
        <Link
          key={item.id}
          href={`#${item.id}`}
          className={`block text-sm py-1.5 border-l-2 transition-colors ${
            item.level === 3 ? 'pl-6' : 'pl-4'
          } ${
            activeId === item.id
              ? 'border-flocken-olive text-flocken-olive font-medium'
              : 'border-flocken-sand text-flocken-gray hover:text-flocken-brown hover:border-flocken-warm'
          }`}
        >
          {item.text}
        </Link>
      ))}
    </nav>
  );
}

