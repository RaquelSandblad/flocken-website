import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Huvudfärger
        'flocken-olive': '#6B7A3A',      // Primary CTA, aktiva element
        'flocken-accent': '#8BA45D',     // Hover states
        'flocken-sand': '#E8DCC0',       // Kort, sektioner
        'flocken-cream': '#F5F1E8',      // Alt bakgrund
        'flocken-brown': '#3E3B32',      // Text, rubriker
        'flocken-gray': '#A29D89',       // Sekundär text
        'flocken-warm': '#D4C4A8',       // Dividers
        
        // Status färger
        'flocken-error': '#C44536',
        'flocken-success': '#6B7A3A',
        'flocken-warning': '#D4A574',
        
        // Specialfärger (app-specifika)
        'flocken-male': '#5A6631',       // Hanar (Para)
        'flocken-female': '#8BA45D',     // Tikar (Para)
        'flocken-favorite': '#C44536',   // Favorit-hjärta
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Typografi-skala
        'display': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'h1': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'h2': ['2.25rem', { lineHeight: '1.3' }],
        'h3': ['1.875rem', { lineHeight: '1.4' }],
        'h4': ['1.5rem', { lineHeight: '1.4' }],
        'h5': ['1.25rem', { lineHeight: '1.5' }],
        'h6': ['1.125rem', { lineHeight: '1.5' }],
        'body': ['1rem', { lineHeight: '1.6' }],
        'small': ['0.875rem', { lineHeight: '1.5' }],
        'tiny': ['0.75rem', { lineHeight: '1.4' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(62, 59, 50, 0.08)',
        'card': '0 4px 12px rgba(62, 59, 50, 0.12)',
        'elevated': '0 8px 24px rgba(62, 59, 50, 0.16)',
      },
    },
  },
  plugins: [],
};

export default config;

