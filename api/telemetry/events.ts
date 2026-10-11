import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    return res.status(500).json({ error: 'DATABASE_URL configuration missing' });
  }

  try {
    const sql = neon(databaseUrl);
    const siteId = (req.query.site_id as string) || 'sendput.com';
    const limit = Math.min(100, parseInt((req.query.limit as string) || '50', 10));

    const events = await sql`
      SELECT id, site_id, event_type, url, payload, user_agent, ip, created_at
      FROM telemetry_events
      WHERE site_id = ${siteId}
      ORDER BY id DESC
      LIMIT ${limit};
    `;

    return res.status(200).json({
      site_id: siteId,
      count: events.length,
      events
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return res.status(500).json({ error: message });
  }
}
