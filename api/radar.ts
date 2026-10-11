import type { VercelRequest, VercelResponse } from '@vercel/node';
import { runBrandRadarAnalysis } from '../src/core/brand-radar.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();

  const brand = (req.query.brand as string) || (req.body?.brand as string) || 'Sendput';
  const domain = (req.query.domain as string) || (req.body?.domain as string) || 'sendput.com';
  const competitorsParam = (req.query.competitors as string) || (req.body?.competitors as string);
  const competitors = competitorsParam
    ? (Array.isArray(competitorsParam) ? competitorsParam : competitorsParam.split(',').map((c) => c.trim()))
    : ['Segment', 'RudderStack', 'Datadog'];

  try {
    const analysis = runBrandRadarAnalysis(brand, domain, competitors);
    return res.status(200).json(analysis);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return res.status(500).json({ error: msg });
  }
}
