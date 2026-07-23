import type { Candidate, Company, CandidateProfile } from '../types';

interface MatchListProps {
  candidates: Candidate[];
  companies: Company[];
  candidateProfiles: CandidateProfile[];
  matchByCandidate: Record<string, string | null>;
  filter: string;
}

export function MatchList({
  candidates,
  companies,
  candidateProfiles,
  matchByCandidate,
  filter,
}: MatchListProps) {
  const companyMap = new Map(companies.map(c => [c.id, c]));
  const profileMap = new Map(candidateProfiles.map(p => [p.id, p]));

  const rows = candidates.filter(c =>
    c.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="bg-white rounded-card shadow-card p-6">
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm font-display font-semibold">Candidate Matches</p>
        <span className="text-xs text-ink-muted">{rows.length} shown</span>
      </div>
      <div className="space-y-1 max-h-96 overflow-y-auto pr-1">
        {rows.map(cand => {
          const companyId = matchByCandidate[cand.id];
          const company = companyId ? companyMap.get(companyId) : null;
          const profile = profileMap.get(cand.id);
          return (
            <div
              key={cand.id}
              className="flex items-center justify-between py-2.5 px-2 rounded-xl hover:bg-canvas-from/40 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-accent-soft flex items-center justify-center text-xs font-semibold text-accent-dark">
                  {cand.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium">{cand.name}</p>
                  <p className="text-xs text-ink-muted">
                    {profile?.primaryStack} · {profile?.yearsExperience}y
                  </p>
                </div>
              </div>
              <span
                className={`text-xs px-3 py-1 rounded-full font-medium ${
                  company
                    ? 'bg-accent-soft text-accent-dark'
                    : 'bg-line text-ink-muted'
                }`}
              >
                {company ? company.name : 'Unmatched'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}