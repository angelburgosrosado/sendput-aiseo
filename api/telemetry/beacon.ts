import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    return res.status(500).json({ error: 'DATABASE_URL configuration missing' });
  }

  try {
    const sql = neon(databaseUrl);
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {}
    }

    const {
      site_id = 'sendput.com',
      event_type = 'custom',
      url = 'unknown',
      payload = {},
      user_agent
    } = body || {};

    const rawIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
    const clientIp = rawIp.split(',')[0].trim();
    const ua = (user_agent as string) || (req.headers['user-agent'] as string) || 'unknown';

    const result = await sql`
      INSERT INTO telemetry_events (site_id, event_type, url, payload, user_agent, ip)
      VALUES (
        ${String(site_id)},
        ${String(event_type)},
        ${String(url)},
        ${JSON.stringify(payload)},
        ${String(ua)},
        ${String(clientIp)}
      )
      RETURNING id;
    `;

    return res.status(200).json({
      success: true,
      event_id: result[0]?.id
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return res.status(500).json({ success: false, error: message });
  }
}
