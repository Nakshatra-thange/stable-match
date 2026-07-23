interface CompletionRingProps {
    matched: number;
    total: number;
  }
  
  export function CompletionRing({ matched, total }: CompletionRingProps) {
    const pct = total === 0 ? 0 : matched / total;
    const radius = 46;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference * (1 - pct);
  
    return (
      <div className="bg-white rounded-card shadow-card p-6 flex flex-col items-center justify-center">
        <p className="text-xs text-ink-muted self-start mb-4">Match Completion</p>
        <div className="relative w-32 h-32">
          <svg width="128" height="128" className="-rotate-90">
            <circle cx="64" cy="64" r={radius} stroke="#D9ECE8" strokeWidth="10" fill="none" />
            <circle
              cx="64"
              cy="64"
              r={radius}
              stroke="#3F9C90"
              strokeWidth="10"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.6s ease' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display text-2xl font-bold">{matched}</span>
            <span className="text-xs text-ink-muted">of {total}</span>
          </div>
        </div>
      </div>
    );
  }