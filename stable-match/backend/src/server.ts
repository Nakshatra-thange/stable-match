import express, { Request, Response } from 'express';
import cors from 'cors';
import { z } from 'zod';
import { stableMatch, findBlockingPairs } from './matcher';
import { generateDataset } from './generator';
import { Candidate, Company } from './types';

const app = express();
app.use(cors());
app.use(express.json());

const candidateSchema = z.object({
  id: z.string(),
  name: z.string(),
  preferences: z.array(z.string()),
});

const companySchema = z.object({
  id: z.string(),
  name: z.string(),
  capacity: z.number().int().positive(),
  preferences: z.array(z.string()),
});

const matchRequestSchema = z.object({
  candidates: z.array(candidateSchema),
  companies: z.array(companySchema),
});

// In-memory store so the frontend can fetch generated data
// then submit it back for matching without regenerating it.
let lastGenerated: { candidates: Candidate[]; companies: Company[] } | null = null;

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

app.get('/api/dataset', (req: Request, res: Response) => {
  const candidateCount = Number(req.query.candidates) || 12;
  const companyCount = Number(req.query.companies) || 6;

  const dataset = generateDataset(candidateCount, companyCount);
  lastGenerated = { candidates: dataset.candidates, companies: dataset.companies };

  res.json({
    candidates: dataset.candidates,
    companies: dataset.companies,
    // extra profile metadata purely for frontend display (comp band, stack, etc.)
    candidateProfiles: dataset.candidateProfiles,
    companyProfiles: dataset.companyProfiles,
  });
});

app.post('/api/match', (req: Request, res: Response) => {
  const parsed = matchRequestSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid payload', details: parsed.error.flatten() });
  }

  const { candidates, companies } = parsed.data;

  const result = stableMatch(candidates, companies);
  const blockingPairs = findBlockingPairs(candidates, companies, result);

  res.json({
    result,
    stabilityCheck: {
      isStable: blockingPairs.length === 0,
      blockingPairs,
    },
  });
});

// convenience endpoint: generate + match in one call for quick demos
app.get('/api/demo-match', (req: Request, res: Response) => {
  const candidateCount = Number(req.query.candidates) || 12;
  const companyCount = Number(req.query.companies) || 6;

  const dataset = generateDataset(candidateCount, companyCount);
  const result = stableMatch(dataset.candidates, dataset.companies);
  const blockingPairs = findBlockingPairs(dataset.candidates, dataset.companies, result);

  res.json({
    candidates: dataset.candidates,
    companies: dataset.companies,
    candidateProfiles: dataset.candidateProfiles,
    companyProfiles: dataset.companyProfiles,
    result,
    stabilityCheck: {
      isStable: blockingPairs.length === 0,
      blockingPairs,
    },
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Stable match engine API running on http://localhost:${PORT}`);
});