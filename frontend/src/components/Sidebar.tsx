import { Grid, Users, Handshake, GitBranch, Settings } from 'lucide-react';

interface SidebarProps {
  view: 'dashboard' | 'trail';
  onNavigate: (view: 'dashboard' | 'trail') => void;
}

const NAV_ITEMS = [
  { icon: Grid, label: 'Dashboard', view: 'dashboard' as const },
  { icon: Users, label: 'Candidates', view: null },
  { icon: Handshake, label: 'Companies', view: null },
  { icon: GitBranch, label: 'Match Trail', view: 'trail' as const },
  { icon: Settings, label: 'Settings', view: null },
];

export function Sidebar({ view, onNavigate }: SidebarProps) {
  return (
    <aside className="w-20 bg-sidebar rounded-card flex flex-col items-center py-6 gap-3 h-[calc(100vh-3rem)] sticky top-6">
      <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center mb-6 text-white font-display font-bold">
        SM
      </div>
      {NAV_ITEMS.map(({ icon: Icon, label, view: itemView }) => {
        const active = itemView === view;
        return (
          <button
            key={label}
            title={label}
            disabled={itemView === null}
            onClick={() => itemView && onNavigate(itemView)}
            className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${
              active
                ? 'bg-accent text-white'
                : itemView === null
                ? 'text-white/20 cursor-default'
                : 'text-white/40 hover:text-white/80 hover:bg-white/5'
            }`}
          >
            <Icon size={19} strokeWidth={1.75} />
          </button>
        );
      })}
    </aside>
  );
}