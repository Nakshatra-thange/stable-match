import { Check, X, ArrowRight, ArrowDownUp } from 'lucide-react';
import type { Candidate, Company, RejectionEvent } from '../types';
import { buildCandidateTrail } from '../lib/trail';

interface MatchTrailProps {
  candidates: Candidate[];
  companies: Company[];
  rejectionLog: RejectionEvent[];
  matchByCandidate: Record<string, string | null>;
  filter: string;
}

export function MatchTrail({
  candidates,
  companies,
  rejectionLog,
  matchByCandidate,
  filter,
}: MatchTrailProps) {
  const companyMap = new Map(companies.map(c => [c.id, c]));
  const rows = candidates.filter(c => c.name.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="bg-white rounded-card shadow-card p-6">
      <div className="flex justify-between items-center mb-5">
        <div>
          <p className="text-sm font-display font-semibold">Proposal Trail</p>
          <p className="text-xs text-ink-muted">Every offer a candidate made, in order, before landing</p>
        </div>
      </div>

      <div className="space-y-5 max-h-[32rem] overflow-y-auto pr-1">
        {rows.map(cand => {
          const trail = buildCandidateTrail(cand, rejectionLog, matchByCandidate);
          if (trail.length === 0) return null;

          return (
            <div key={cand.id} className="pb-4 border-b border-line last:border-0">
              <p className="text-sm font-medium mb-2.5">{cand.name}</p>
              <div className="flex flex-wrap items-center gap-1.5">
                {trail.map((step, idx) => {
                  const company = companyMap.get(step.companyId);
                  const isLast = idx === trail.length - 1;

                  const chipStyles =
                    step.status === 'matched'
                      ? 'bg-accent text-white'
                      : step.status === 'bumped'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-line/60 text-ink-muted';

                  return (
                    <span key={idx} className="flex items-center gap-1.5">
                      <span
                        className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium ${chipStyles}`}
                      >
                        {step.status === 'matched' && <Check size={12} />}
                        {step.status === 'rejected' && <X size={12} />}
                        {step.status === 'bumped' && <ArrowDownUp size={12} />}
                        {company?.name ?? step.companyId}
                      </span>
                      {!isLast && <ArrowRight size={12} className="text-ink-muted/50" />}
                    </span>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}