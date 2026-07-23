import { Candidate, Company } from './types';

const STACKS = ['TypeScript', 'Python', 'Go', 'Rust', 'Java'] as const;
const STAGES = ['Pre-Seed', 'Seed', 'Series A', 'Series B', 'Series C'] as const;

const STAGE_COMP_INDEX: Record<(typeof STAGES)[number], number> = {
  'Pre-Seed': 1,
  Seed: 2,
  'Series A': 3,
  'Series B': 4,
  'Series C': 5,
};

interface CandidateProfile {
  id: string;
  name: string;
  yearsExperience: number;
  primaryStack: (typeof STACKS)[number];
  desiredStageMin: number; // won't rank companies earlier than this stage
  compPriority: number; // 0-1, how much comp matters vs stage/stack fit
}

interface CompanyProfile {
  id: string;
  name: string;
  stage: (typeof STAGES)[number];
  stack: (typeof STACKS)[number];
  capacity: number;
  compBand: number; // 1-5 relative comp competitiveness
  seniorityBar: number; // minimum years experience company wants
}

const FIRST_NAMES = ['Amara', 'Diego', 'Priya', 'Tomas', 'Wei', 'Fatima', 'Leo', 'Nina', 'Kwame', 'Elif', 'Sana', 'Marcus'];
const COMPANY_NAMES = ['Northstar', 'Vector', 'Fernway', 'Alloy', 'Basecamp Labs', 'Ridgeline', 'Kestrel', 'Anchorpoint'];

function randomFrom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function seededCandidateProfiles(count: number): CandidateProfile[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `cand_${i + 1}`,
    name: `${randomFrom(FIRST_NAMES)} #${i + 1}`,
    yearsExperience: Math.floor(Math.random() * 10) + 1,
    primaryStack: randomFrom(STACKS),
    desiredStageMin: Math.floor(Math.random() * 3) + 1, // 1-3
    compPriority: Math.random(),
  }));
}

function seededCompanyProfiles(count: number): CompanyProfile[] {
  return Array.from({ length: count }, (_, i) => {
    const stage = randomFrom(STAGES);
    return {
      id: `co_${i + 1}`,
      name: `${randomFrom(COMPANY_NAMES)} ${['AI', 'Health', 'Fintech', 'Data', 'Infra'][i % 5]}`,
      stage,
      stack: randomFrom(STACKS),
      capacity: Math.random() < 0.3 ? 2 : 1,
      compBand: STAGE_COMP_INDEX[stage] + Math.floor(Math.random() * 2 - 1),
      seniorityBar: Math.floor(Math.random() * 4),
    };
  });
}

/** Candidate's affinity score for a company: higher = more preferred */
function candidateScoreForCompany(cand: CandidateProfile, co: CompanyProfile): number {
  let score = 0;
  if (co.stack === cand.primaryStack) score += 3;
  if (STAGE_COMP_INDEX[co.stage] >= cand.desiredStageMin) score += 2;
  score += co.compBand * cand.compPriority * 2;
  score += Math.random() * 0.5; // small tiebreak noise
  return score;
}

/** Company's affinity score for a candidate: higher = more preferred */
function companyScoreForCandidate(co: CompanyProfile, cand: CandidateProfile): number {
  let score = 0;
  if (cand.primaryStack === co.stack) score += 3;
  if (cand.yearsExperience >= co.seniorityBar) score += 2;
  score += Math.min(cand.yearsExperience, 8) * 0.4;
  score += Math.random() * 0.5;
  return score;
}

export interface GeneratedDataset {
  candidates: Candidate[];
  companies: Company[];
  candidateProfiles: CandidateProfile[];
  companyProfiles: CompanyProfile[];
}

export function generateDataset(
  candidateCount = 12,
  companyCount = 6
): GeneratedDataset {
  const candidateProfiles = seededCandidateProfiles(candidateCount);
  const companyProfiles = seededCompanyProfiles(companyCount);

  const candidates: Candidate[] = candidateProfiles.map(cand => {
    const ranked = [...companyProfiles]
      .filter(co => co.seniorityBar <= cand.yearsExperience + 2) // won't even apply if wildly underqualified
      .sort((a, b) => candidateScoreForCompany(cand, b) - candidateScoreForCompany(cand, a))
      .map(co => co.id);
    return { id: cand.id, name: cand.name, preferences: ranked };
  });

  const companies: Company[] = companyProfiles.map(co => {
    const ranked = [...candidateProfiles]
      .sort((a, b) => companyScoreForCandidate(co, b) - companyScoreForCandidate(co, a))
      .map(cand => cand.id);
    return { id: co.id, name: co.name, capacity: co.capacity, preferences: ranked };
  });

  return { candidates, companies, candidateProfiles, companyProfiles };
}