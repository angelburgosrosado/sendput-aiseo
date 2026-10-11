import type { VercelRequest, VercelResponse } from '@vercel/node';
import { executeSiteAudit } from '../src/core/site-audit.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();

  const url = (req.query.url as string) || (req.body?.url as string) || 'https://sendput.com';

  try {
    const report = await executeSiteAudit(url);
    return res.status(200).json(report);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return res.status(500).json({ error: msg });
  }
}
