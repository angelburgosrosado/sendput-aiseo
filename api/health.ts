import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    return res.status(500).json({ status: 'ERROR', error: 'DATABASE_URL not set' });
  }

  try {
    const sql = neon(databaseUrl);
    const dbTest = await sql`SELECT NOW() as current_time, current_database() as db;`;
    return res.status(200).json({
      status: 'HEALTHY',
      platform: 'Vercel Serverless',
      storage: 'Neon Serverless PostgreSQL',
      database: dbTest[0]?.db,
      timestamp: dbTest[0]?.current_time
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return res.status(500).json({ status: 'UNHEALTHY', error: message });
  }
}
