import { ArrowRight } from 'lucide-react';
import type { Candidate, Company, RejectionEvent } from '../types';

interface BumpCascadeProps {
  candidates: Candidate[];
  companies: Company[];
  rejectionLog: RejectionEvent[];
  matchesByCompany: Record<string, string[]>;
}

export function BumpCascade({
  candidates,
  companies,
  rejectionLog,
  matchesByCompany,
}: BumpCascadeProps) {
  const candidateMap = new Map(candidates.map(c => [c.id, c]));

  const bumpsByCompany = new Map<string, RejectionEvent[]>();
  for (const event of rejectionLog) {
    if (event.reason !== 'bumped_by_stronger_candidate') continue;
    const list = bumpsByCompany.get(event.companyId) ?? [];
    list.push(event);
    bumpsByCompany.set(event.companyId, list);
  }

  const companiesWithBumps = companies.filter(co => bumpsByCompany.has(co.id));

  return (
    <div className="bg-white rounded-card shadow-card p-6">
      <div className="mb-5">
        <p className="text-sm font-display font-semibold">Displacement Chains</p>
        <p className="text-xs text-ink-muted">Who got bumped from an oversubscribed seat, and by whom</p>
      </div>

      {companiesWithBumps.length === 0 ? (
        <p className="text-sm text-ink-muted py-6 text-center">
          No displacements this round — every company's first offers held.
        </p>
      ) : (
        <div className="space-y-4">
          {companiesWithBumps.map(co => {
            const events = (bumpsByCompany.get(co.id) ?? []).sort((a, b) => a.round - b.round);
            const finalHolders = matchesByCompany[co.id] ?? [];

            return (
              <div key={co.id} className="p-4 rounded-xl bg-canvas-from/30">
                <p className="text-xs font-medium text-ink-muted mb-2.5">
                  {co.name} · {events.length} displacement{events.length > 1 ? 's' : ''}
                </p>
                <div className="space-y-1.5">
                  {events.map((e, i) => {
                    const bumper = e.bumpedByCandidateId
                      ? candidateMap.get(e.bumpedByCandidateId)?.name
                      : 'Unknown';
                    const bumped = candidateMap.get(e.candidateId)?.name;
                    return (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <span className="font-medium">{bumper}</span>
                        <ArrowRight size={12} className="text-ink-muted" />
                        <span className="text-ink-muted">bumped</span>
                        <ArrowRight size={12} className="text-ink-muted" />
                        <span className="font-medium">{bumped}</span>
                        <span className="text-xs text-ink-muted ml-1">round {e.round}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-3 pt-3 border-t border-line/60 flex gap-1.5 flex-wrap">
                  <span className="text-xs text-ink-muted">Currently held by:</span>
                  {finalHolders.map(id => (
                    <span
                      key={id}
                      className="text-xs px-2 py-0.5 rounded-full bg-accent-soft text-accent-dark font-medium"
                    >
                      {candidateMap.get(id)?.name}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}