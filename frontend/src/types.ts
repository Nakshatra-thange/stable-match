export interface Candidate {
    id: string;
    name: string;
    preferences: string[];
  }
  
  export interface Company {
    id: string;
    name: string;
    capacity: number;
    preferences: string[];
  }
  
  export interface CandidateProfile {
    id: string;
    name: string;
    yearsExperience: number;
    primaryStack: string;
    desiredStageMin: number;
    compPriority: number;
  }
  export interface RejectionEvent {
    round: number;
    candidateId: string;
    companyId: string;
    reason: 'rejected_worse_than_current_cohort' | 'bumped_by_stronger_candidate';
    bumpedByCandidateId?: string;
  }
  
  export interface CompanyProfile {
    id: string;
    name: string;
    stage: string;
    stack: string;
    capacity: number;
    compBand: number;
    seniorityBar: number;
  }
  
  export interface RejectionEvent {
    round: number;
    candidateId: string;
    companyId: string;
    reason: 'rejected_worse_than_current_cohort' | 'bumped_by_stronger_candidate';
  }
  
  export interface MatchResult {
    matchesByCompany: Record<string, string[]>;
    matchByCandidate: Record<string, string | null>;
    rejectionLog: RejectionEvent[];
    roundsRun: number;
  }
  
  export interface StabilityCheck {
    isStable: boolean;
    blockingPairs: Array<{ candidateId: string; companyId: string }>;
  }
  
  export interface DatasetResponse {
    candidates: Candidate[];
    companies: Company[];
    candidateProfiles: CandidateProfile[];
    companyProfiles: CompanyProfile[];
  }
  
  export interface MatchResponse {
    result: MatchResult;
    stabilityCheck: StabilityCheck;
  }