import type { VercelRequest, VercelResponse } from '@vercel/node';
import { exploreKeyword } from '../src/core/keywords-explorer.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();

  const keyword = (req.query.keyword as string) || 'information routing';

  try {
    const data = exploreKeyword(keyword);
    return res.status(200).json(data);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return res.status(500).json({ error: msg });
  }
}
