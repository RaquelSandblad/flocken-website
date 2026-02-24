interface BadgeDisplayProps {
  label: string;
  tier: 'bronze' | 'silver' | 'gold';
  score: number;
}

const tierStyles = {
  bronze: {
    outer: 'from-amber-700/80 to-amber-600/80',
    inner: 'from-amber-100 to-amber-50',
    ring: 'ring-amber-300/60',
    text: 'text-amber-900',
    accent: 'text-amber-700',
    ribbon: 'bg-amber-600/80',
  },
  silver: {
    outer: 'from-slate-500 to-slate-400',
    inner: 'from-slate-100 to-white',
    ring: 'ring-slate-300/60',
    text: 'text-slate-800',
    accent: 'text-slate-600',
    ribbon: 'bg-slate-500',
  },
  gold: {
    outer: 'from-yellow-600 to-amber-500',
    inner: 'from-yellow-50 to-amber-50',
    ring: 'ring-yellow-400/60',
    text: 'text-yellow-900',
    accent: 'text-yellow-700',
    ribbon: 'bg-yellow-600',
  },
};

function PawIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 17.5c-1.5 1.7-4.2 2.8-5.3 1.5-1.2-1.3.2-3.7 2-5 .8-.6 1.7-1 2.3-1.2.4-.1.6-.1 1-.1s.6 0 1 .1c.6.2 1.5.6 2.3 1.2 1.8 1.3 3.2 3.7 2 5-1.1 1.3-3.8.2-5.3-1.5z" />
      <ellipse cx="7.5" cy="10" rx="2" ry="2.5" transform="rotate(-15 7.5 10)" />
      <ellipse cx="10.5" cy="7" rx="1.8" ry="2.5" transform="rotate(-5 10.5 7)" />
      <ellipse cx="13.5" cy="7" rx="1.8" ry="2.5" transform="rotate(5 13.5 7)" />
      <ellipse cx="16.5" cy="10" rx="2" ry="2.5" transform="rotate(15 16.5 10)" />
    </svg>
  );
}

export function BadgeDisplay({ label, tier, score }: BadgeDisplayProps) {
  const s = tierStyles[tier];

  return (
    <div className="flex flex-col items-center">
      {/* Rosette shape */}
      <div className={`relative flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br ${s.outer} p-1 ring-4 ${s.ring} shadow-lg`}>
        <div className={`flex h-full w-full flex-col items-center justify-center rounded-full bg-gradient-to-br ${s.inner}`}>
          <PawIcon className={`h-8 w-8 ${s.accent}`} />
          <span className={`mt-1 text-2xl font-black ${s.text}`}>{score}/10</span>
        </div>
      </div>

      {/* Ribbon label */}
      <div className={`-mt-3 rounded-full ${s.ribbon} px-5 py-1.5 shadow-md`}>
        <span className="text-sm font-bold tracking-wide text-white">{label}</span>
      </div>
    </div>
  );
}
