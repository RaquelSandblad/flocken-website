'use client';

import { ChevronDown } from 'lucide-react';
import { FAQ_TOPICS } from './faqContent';

export function FaqSection() {
  return (
    <div className="mt-10 space-y-8">
      <h2 className="text-2xl font-bold text-flocken-brown">Vanliga frågor</h2>
      <div className="space-y-6">
        {FAQ_TOPICS.map((topic) => {
          const Icon = topic.icon;
          return (
            <div key={topic.title}>
              <h3 className="mb-3 flex items-center gap-2 text-base font-semibold text-flocken-brown">
                <Icon className="h-5 w-5 text-flocken-olive" aria-hidden />
                {topic.title}
              </h3>
              <div className="rounded-xl border border-flocken-sand overflow-hidden">
                {topic.items.map((item, i) => (
                  <details
                    key={item.q}
                    className={`group bg-white ${i < topic.items.length - 1 ? 'border-b border-flocken-sand' : ''}`}
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left font-medium text-flocken-brown hover:bg-flocken-cream transition-colors [&::-webkit-details-marker]:hidden">
                      <span>{item.q}</span>
                      <ChevronDown
                        className="h-5 w-5 shrink-0 text-flocken-olive transition-transform group-open:rotate-180"
                        aria-hidden
                      />
                    </summary>
                    <p className="px-5 pb-4 pt-1 text-flocken-brown/80 leading-relaxed text-sm">
                      {item.a}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
