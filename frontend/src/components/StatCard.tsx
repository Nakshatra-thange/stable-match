interface StatCardProps {
    label: string;
    value: string | number;
    accent?: boolean;
  }
  
  export function StatCard({ label, value, accent = false }: StatCardProps) {
    return (
      <div
        className={`rounded-card p-5 shadow-card ${
          accent ? 'bg-accent text-white' : 'bg-white text-ink'
        }`}
      >
        <p className={`text-xs mb-2 ${accent ? 'text-white/70' : 'text-ink-muted'}`}>{label}</p>
        <p className="font-display text-2xl font-semibold">{value}</p>
      </div>
    );
  }