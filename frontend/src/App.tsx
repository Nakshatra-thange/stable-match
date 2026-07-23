import { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { MatchTrail } from './components/MatchTrail';
import { BumpCascade } from './components/BumpCascade';
import { StatCard } from './components/StatCard';
import { CompletionRing } from './components/CompletionRing';
import { CompanyCapacityCard } from './components/CompanyCapacityCard';
import { MatchList } from './components/MatchList';
import { fetchDataset, runMatch } from './api';
import type {
  Candidate,
  Company,
  CandidateProfile,
  CompanyProfile,
  MatchResult,
  StabilityCheck,
} from './types';

export default function App() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [candidateProfiles, setCandidateProfiles] = useState<CandidateProfile[]>([]);
  const [companyProfiles, setCompanyProfiles] = useState<CompanyProfile[]>([]);
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
  const [stability, setStability] = useState<StabilityCheck | null>(null);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<'dashboard' | 'trail'>('dashboard');
  const loadDataset = useCallback(async () => {
    setLoading(true);
    setMatchResult(null);
    setStability(null);
    try {
      const data = await fetchDataset(12, 6);
      setCandidates(data.candidates);
      setCompanies(data.companies);
      setCandidateProfiles(data.candidateProfiles);
      setCompanyProfiles(data.companyProfiles);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDataset();
  }, [loadDataset]);

  const handleRunMatch = async () => {
    setLoading(true);
    try {
      const { result, stabilityCheck } = await runMatch(candidates, companies);
      setMatchResult(result);
      setStability(stabilityCheck);
    } finally {
      setLoading(false);
    }
  };

  const matchedCount = matchResult
    ? Object.values(matchResult.matchByCandidate).filter(Boolean).length
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 flex gap-6">
     <Sidebar view={view} onNavigate={setView} />

      <div className="flex-1">
        <TopBar filter={filter} onFilterChange={setFilter} />

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-xl font-semibold">Stable Match Engine</h1>
            <p className="text-sm text-ink-muted">
              {candidates.length} candidates · {companies.length} companies
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={loadDataset}
              disabled={loading}
              className="px-4 py-2.5 rounded-xl bg-white shadow-card text-sm font-medium text-ink hover:bg-line/40 transition-colors disabled:opacity-50"
            >
              New Dataset
            </button>
            <button
              onClick={handleRunMatch}
              disabled={loading || candidates.length === 0}
              className="px-4 py-2.5 rounded-xl bg-accent text-white shadow-card text-sm font-medium hover:bg-accent-dark transition-colors disabled:opacity-50"
            >
              Run Match Day
            </button>
          </div>
        </div>

        {view === 'dashboard' ? (
          <>
            <div className="grid grid-cols-4 gap-5 mb-5">
              <StatCard label="Candidates" value={candidates.length} />
              <StatCard label="Companies" value={companies.length} />
              <StatCard
                label="Stability Check"
                value={stability ? (stability.isStable ? 'Stable' : 'Unstable') : '—'}
                accent
              />
              <div className="col-span-1">
                <CompletionRing matched={matchedCount} total={candidates.length} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <CompanyCapacityCard
                companies={companies}
                companyProfiles={companyProfiles}
                matchesByCompany={matchResult?.matchesByCompany ?? {}}
              />
              <MatchList
                candidates={candidates}
                companies={companies}
                candidateProfiles={candidateProfiles}
                matchByCandidate={matchResult?.matchByCandidate ?? {}}
                filter={filter}
              />
            </div>
          </>
        ) : matchResult ? (
          <div className="grid grid-cols-2 gap-5">
            <MatchTrail
              candidates={candidates}
              companies={companies}
              rejectionLog={matchResult.rejectionLog}
              matchByCandidate={matchResult.matchByCandidate}
              filter={filter}
            />
            <BumpCascade
              candidates={candidates}
              companies={companies}
              rejectionLog={matchResult.rejectionLog}
              matchesByCompany={matchResult.matchesByCompany}
            />
          </div>
        ) : (
          <div className="bg-white rounded-card shadow-card p-10 text-center">
            <p className="text-sm font-medium mb-1">No match run yet</p>
            <p className="text-xs text-ink-muted">
              Go to Dashboard and click "Run Match Day" to generate a trail.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}