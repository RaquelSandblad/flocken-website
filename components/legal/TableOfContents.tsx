'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from './LanguageContext';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

const tocTitles = {
  sv: 'På denna sida',
  da: 'På denne side',
  no: 'På denne siden',
  pt: 'Nesta página',
} as const;

export function TableOfContents() {
  const { language } = useLanguage();
  const [items, setItems] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  
  useEffect(() => {
    let observer: IntersectionObserver | null = null;
    let retryTimeout: NodeJS.Timeout | null = null;
    
    // Wait for content to render, then find headings
    const findHeadings = () => {
      const headings = Array.from(
        document.querySelectorAll('h2[id], h3[id]')
      );
      
      if (headings.length === 0) {
        // Retry after a short delay if no headings found yet
        retryTimeout = setTimeout(findHeadings, 100);
        return;
      }
      
      const tocItems: TOCItem[] = headings.map((heading) => ({
        id: heading.id,
        text: heading.textContent || '',
        level: heading.tagName === 'H2' ? 2 : 3,
      }));
      
      setItems(tocItems);
      
      // Intersection observer for active section
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveId(entry.target.id);
            }
          });
        },
        { rootMargin: '-80px 0px -80% 0px' }
      );
      
      headings.forEach((heading) => observer?.observe(heading));
    };
    
    // Start looking for headings
    findHeadings();
    
    // Cleanup function
    return () => {
      if (retryTimeout) clearTimeout(retryTimeout);
      if (observer) observer.disconnect();
    };
  }, [language]);
  
  if (items.length === 0) return null;
  
  return (
    <nav className="space-y-2">
      <p className="text-sm font-semibold text-flocken-brown mb-4">
        {tocTitles[language]}
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

