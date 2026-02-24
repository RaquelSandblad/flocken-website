interface ProgressIndicatorProps {
  current: number;
  total: number;
}

export function ProgressIndicator({ current, total }: ProgressIndicatorProps) {
  const width = `${Math.max((current / total) * 100, 6)}%`;

  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-flocken-brown">Fråga {current}/{total}</p>
      <div className="h-2 w-full overflow-hidden rounded-full bg-flocken-sand">
        <div
          className="h-full rounded-full bg-[var(--quiz-color-primary)] transition-all duration-300 ease-out"
          style={{ width }}
        />
      </div>
    </div>
  );
}
