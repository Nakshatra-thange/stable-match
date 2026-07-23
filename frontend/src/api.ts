import type { Candidate, Company, DatasetResponse, MatchResponse } from './types';

const BASE_URL = 'http://localhost:4000';

export async function fetchDataset(
  candidateCount = 12,
  companyCount = 6
): Promise<DatasetResponse> {
  const res = await fetch(
    `${BASE_URL}/api/dataset?candidates=${candidateCount}&companies=${companyCount}`
  );
  if (!res.ok) throw new Error('Failed to fetch dataset');
  return res.json();
}

export async function runMatch(
  candidates: Candidate[],
  companies: Company[]
): Promise<MatchResponse> {
  const res = await fetch(`${BASE_URL}/api/match`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ candidates, companies }),
  });
  if (!res.ok) throw new Error('Failed to run match');
  return res.json();
}