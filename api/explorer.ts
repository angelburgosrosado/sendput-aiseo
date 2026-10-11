import type { VercelRequest, VercelResponse } from '@vercel/node';
import { analyzeSiteExplorer } from '../src/core/site-explorer.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();

  const target = (req.query.target as string) || 'sendput.com';

  try {
    const explorerData = analyzeSiteExplorer(target);
    return res.status(200).json(explorerData);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return res.status(500).json({ error: msg });
  }
}
