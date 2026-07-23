import type{ Candidate, RejectionEvent } from '../types';

export type TrailStatus = 'matched' | 'rejected' | 'bumped';

export interface TrailStep {
  companyId: string;
  status: TrailStatus;
  round?: number;
}

export function buildCandidateTrail(
  candidate: Candidate,
  rejectionLog: RejectionEvent[],
  matchByCandidate: Record<string, string | null>
): TrailStep[] {
  const finalMatch = matchByCandidate[candidate.id];
  const rejectionByCompany = new Map(
    rejectionLog
      .filter(r => r.candidateId === candidate.id)
      .map(r => [r.companyId, r])
  );

  const trail: TrailStep[] = [];

  for (const companyId of candidate.preferences) {
    if (companyId === finalMatch) {
      trail.push({ companyId, status: 'matched' });
      break;
    }
    const rejection = rejectionByCompany.get(companyId);
    if (rejection) {
      trail.push({
        companyId,
        status: rejection.reason === 'bumped_by_stronger_candidate' ? 'bumped' : 'rejected',
        round: rejection.round,
      });
    }
  }

  return trail;
}