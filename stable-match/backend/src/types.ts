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