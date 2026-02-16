import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Flocken Quiz',
  description: 'Snabba hundquiz på 2–3 minuter. Fixa badge, lär dig mer och kom närmare hundcommunityt.',
};

export default function QuizRootLayout({ children }: { children: ReactNode }) {
  return children;
}
