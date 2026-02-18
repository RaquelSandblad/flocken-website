import type { CSSProperties, ReactNode } from 'react';

interface QuizLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  style?: CSSProperties;
}

export function QuizLayout({ children, title, subtitle, style }: QuizLayoutProps) {
  return (
    <main
      style={style}
      className="min-h-screen bg-[var(--quiz-color-background)] px-4 py-8 text-flocken-brown sm:px-6 lg:px-8"
    >
      <div className="mx-auto w-full max-w-3xl">
        {(title || subtitle) && (
          <section className="mb-6 text-center">
            {title && <h1 className="text-3xl font-bold sm:text-4xl">{title}</h1>}
            {subtitle && (
              <p className="mx-auto mt-3 max-w-2xl text-base text-flocken-brown/60 sm:text-lg">{subtitle}</p>
            )}
          </section>
        )}
        {children}
      </div>
    </main>
  );
}
