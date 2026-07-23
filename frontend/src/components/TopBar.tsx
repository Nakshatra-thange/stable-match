import { Search, Bell, Mail } from 'lucide-react';

interface TopBarProps {
  filter: string;
  onFilterChange: (value: string) => void;
}

export function TopBar({ filter, onFilterChange }: TopBarProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2.5 shadow-card w-80">
        <Search size={16} className="text-ink-muted" />
        <input
          value={filter}
          onChange={e => onFilterChange(e.target.value)}
          placeholder="Search candidates or companies"
          className="bg-transparent outline-none text-sm w-full placeholder:text-ink-muted"
        />
      </div>
      <div className="flex items-center gap-3">
        <button className="w-10 h-10 rounded-full bg-white shadow-card flex items-center justify-center text-ink-muted">
          <Mail size={16} />
        </button>
        <button className="w-10 h-10 rounded-full bg-white shadow-card flex items-center justify-center text-ink-muted">
          <Bell size={16} />
        </button>
        <div className="w-10 h-10 rounded-full bg-accent-soft flex items-center justify-center font-display font-semibold text-accent-dark text-sm">
          SM
        </div>
      </div>
    </div>
  );
}