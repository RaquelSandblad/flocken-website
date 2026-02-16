interface BadgeProps {
  label: string;
}

export function Badge({ label }: BadgeProps) {
  return (
    <div className="inline-flex rounded-full bg-[var(--quiz-color-primary)] px-4 py-2 text-sm font-semibold text-white">
      {label}
    </div>
  );
}
