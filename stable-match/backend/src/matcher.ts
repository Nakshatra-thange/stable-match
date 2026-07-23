import { Candidate, Company, MatchResult, RejectionEvent } from './types';
export function stableMatch(
  candidates: Candidate[],
  companies: Company[]
): MatchResult {
  const candidateMap = new Map(candidates.map(c => [c.id, c]));
  const companyMap = new Map(companies.map(c => [c.id, c]));


  const companyRank = new Map<string, Map<string, number>>();
  for (const co of companies) {
    const rankMap = new Map<string, number>();
    co.preferences.forEach((cid, idx) => rankMap.set(cid, idx));
    companyRank.set(co.id, rankMap);
  }

  const nextProposal = new Map<string, number>(candidates.map(c => [c.id, 0]));
  const tentative = new Map<string, string[]>(companies.map(c => [c.id, []]));
  const candidateMatch = new Map<string, string | null>(
    candidates.map(c => [c.id, null])
  );

  const rejectionLog: RejectionEvent[] = [];
  let round = 0;

  let freeCandidates = candidates
    .filter(c => c.preferences.length > 0)
    .map(c => c.id);

  while (freeCandidates.length > 0) {
    round++;
    const stillFree: string[] = [];

    for (const candidateId of freeCandidates) {
      const candidate = candidateMap.get(candidateId)!;
      const proposalIdx = nextProposal.get(candidateId)!;

      if (proposalIdx >= candidate.preferences.length) {
        continue; 
      }

      const companyId = candidate.preferences[proposalIdx];
      nextProposal.set(candidateId, proposalIdx + 1);

      const company = companyMap.get(companyId);
      const rankMap = companyRank.get(companyId);

   
      if (!company || !rankMap || !rankMap.has(candidateId)) {
        stillFree.push(candidateId);
        continue;
      }

      const currentCohort = tentative.get(companyId)!;

      if (currentCohort.length < company.capacity) {
        currentCohort.push(candidateId);
        currentCohort.sort((a, b) => rankMap.get(a)! - rankMap.get(b)!);
        candidateMatch.set(candidateId, companyId);
        continue;
      }


      const weakestId = currentCohort[currentCohort.length - 1];
      const weakestRank = rankMap.get(weakestId)!;
      const candidateRank = rankMap.get(candidateId)!;

      if (candidateRank < weakestRank) {
       
        currentCohort.pop();
        candidateMatch.set(weakestId, null);
        rejectionLog.push({
          round,
          candidateId: weakestId,
          companyId,
          reason: 'bumped_by_stronger_candidate',
        });
        stillFree.push(weakestId);

        currentCohort.push(candidateId);
        currentCohort.sort((a, b) => rankMap.get(a)! - rankMap.get(b)!);
        candidateMatch.set(candidateId, companyId);
      } else {
        rejectionLog.push({
          round,
          candidateId,
          companyId,
          reason: 'rejected_worse_than_current_cohort',
        });
        stillFree.push(candidateId);
      }
    }

    freeCandidates = stillFree.filter(
      id => nextProposal.get(id)! < candidateMap.get(id)!.preferences.length
    );
  }

  const matchesByCompany: Record<string, string[]> = {};
  for (const [companyId, list] of tentative) matchesByCompany[companyId] = [...list];

  const matchByCandidate: Record<string, string | null> = {};
  for (const [cid, companyId] of candidateMatch) matchByCandidate[cid] = companyId;

  return { matchesByCompany, matchByCandidate, rejectionLog, roundsRun: round };
}


export function findBlockingPairs(
  candidates: Candidate[],
  companies: Company[],
  result: MatchResult
): Array<{ candidateId: string; companyId: string }> {
  const companyRank = new Map<string, Map<string, number>>();
  for (const co of companies) {
    const rankMap = new Map<string, number>();
    co.preferences.forEach((cid, idx) => rankMap.set(cid, idx));
    companyRank.set(co.id, rankMap);
  }
  const candidateRank = new Map<string, Map<string, number>>();
  for (const c of candidates) {
    const rankMap = new Map<string, number>();
    c.preferences.forEach((coId, idx) => rankMap.set(coId, idx));
    candidateRank.set(c.id, rankMap);
  }

  const blocking: Array<{ candidateId: string; companyId: string }> = [];

  for (const candidate of candidates) {
    const cRank = candidateRank.get(candidate.id)!;
    const currentCompanyId = result.matchByCandidate[candidate.id];
    const currentCandRankAtCurrent = currentCompanyId
      ? cRank.get(currentCompanyId)
      : undefined;

    for (const company of companies) {
      if (!cRank.has(company.id)) continue;
      const wouldPreferCompany =
        currentCandRankAtCurrent === undefined ||
        cRank.get(company.id)! < currentCandRankAtCurrent;
      if (!wouldPreferCompany) continue;

      const rankMap = companyRank.get(company.id)!;
      if (!rankMap.has(candidate.id)) continue;

      const cohort = result.matchesByCompany[company.id] || [];
      const companyWouldPrefer =
        cohort.length < company.capacity ||
        rankMap.get(candidate.id)! < rankMap.get(cohort[cohort.length - 1])!;

      if (companyWouldPrefer) {
        blocking.push({ candidateId: candidate.id, companyId: company.id });
      }
    }
  }

  return blocking;
}