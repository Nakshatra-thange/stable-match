import type { Company, CompanyProfile } from '../types';

interface CompanyCapacityCardProps {
  companies: Company[];
  companyProfiles: CompanyProfile[];
  matchesByCompany: Record<string, string[]>;
}

export function CompanyCapacityCard({
  companies,
  companyProfiles,
  matchesByCompany,
}: CompanyCapacityCardProps) {
  const profileMap = new Map(companyProfiles.map(p => [p.id, p]));

  return (
    <div className="bg-white rounded-card shadow-card p-6">
      <div className="flex justify-between items-center mb-5">
        <p className="text-sm font-display font-semibold">Company Capacity Fill</p>
        <span className="text-xs text-ink-muted">Weekly</span>
      </div>
      <div className="space-y-4">
        {companies.map(co => {
          const filled = matchesByCompany[co.id]?.length ?? 0;
          const pct = Math.round((filled / co.capacity) * 100);
          const profile = profileMap.get(co.id);
          return (
            <div key={co.id}>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-medium">{co.name}</span>
                <span className="text-ink-muted">
                  {filled}/{co.capacity} · {profile?.stage}
                </span>
              </div>
              <div className="h-2 bg-accent-soft rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent rounded-full transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}