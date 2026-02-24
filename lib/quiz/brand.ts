export const brand = {
  primary: '#6B7A3A',
  accent: '#8BA45D',
  background: '#F5F1E8',
  radius: '1rem',
  font: 'Inter, system-ui, sans-serif',
} as const;

export function getQuizBrandStyle(): Record<string, string> {
  return {
    '--quiz-color-primary': brand.primary,
    '--quiz-color-accent': brand.accent,
    '--quiz-color-background': brand.background,
    '--quiz-radius-card': brand.radius,
    '--quiz-font': brand.font,
  };
}
