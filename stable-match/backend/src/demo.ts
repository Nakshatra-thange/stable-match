import { stableMatch, findBlockingPairs } from './matcher';
import { Candidate, Company } from './types';

const candidates: Candidate[] = [
  { id: 'c1', name: 'Amara', preferences: ['co1', 'co2', 'co3'] },
  { id: 'c2', name: 'Diego', preferences: ['co2', 'co1', 'co3'] },
  { id: 'c3', name: 'Priya', preferences: ['co1', 'co3', 'co2'] },
  { id: 'c4', name: 'Tomas', preferences: ['co3', 'co2', 'co1'] },
];

const companies: Company[] = [
  { id: 'co1', name: 'Fintech Startup A', capacity: 1, preferences: ['c3', 'c1', 'c2', 'c4'] },
  { id: 'co2', name: 'AI Startup B', capacity: 2, preferences: ['c2', 'c4', 'c1', 'c3'] },
  { id: 'co3', name: 'Healthtech Startup C', capacity: 1, preferences: ['c4', 'c3', 'c1', 'c2'] },
];

const result = stableMatch(candidates, companies);

console.log('--- Matches by company ---');
console.log(result.matchesByCompany);

console.log('\n--- Matches by candidate ---');
console.log(result.matchByCandidate);

console.log('\n--- Rejection log (the "why" trail) ---');
console.log(result.rejectionLog);

const blocking = findBlockingPairs(candidates, companies, result);
console.log('\n--- Blocking pairs (should be empty if stable) ---');
console.log(blocking);