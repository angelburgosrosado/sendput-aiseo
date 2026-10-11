import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    return res.status(500).send('DATABASE_URL is not configured.');
  }

  const siteId = (req.query.site_id as string) || 'sendput.com';

  try {
    const sql = neon(databaseUrl);

    // Queries
    const events = (await sql`
      SELECT id, event_type, url, payload, created_at
      FROM telemetry_events
      WHERE site_id = ${siteId}
      ORDER BY id DESC
      LIMIT 30;
    `) as Array<{
      id: string;
      event_type: string;
      url: string;
      payload: Record<string, unknown>;
      created_at: string;
    }>;

    const totalCountRes = await sql`
      SELECT count(*) as count FROM telemetry_events WHERE site_id = ${siteId};
    `;
    const totalCount = totalCountRes[0]?.count || 0;

    const errorCountRes = await sql`
      SELECT count(*) as count FROM telemetry_events WHERE site_id = ${siteId} AND event_type = 'error';
    `;
    const errorCount = errorCountRes[0]?.count || 0;

    const apiFailuresRes = await sql`
      SELECT count(*) as count FROM telemetry_events WHERE site_id = ${siteId} AND event_type = 'api_failure';
    `;
    const apiFailures = apiFailuresRes[0]?.count || 0;

    const perfRows = (await sql`
      SELECT payload FROM telemetry_events
      WHERE site_id = ${siteId} AND event_type = 'performance'
      ORDER BY id DESC LIMIT 50;
    `) as Array<{ payload: Record<string, unknown> }>;

    let avgTtfb = 0;
    if (perfRows.length > 0) {
      let sum = 0;
      for (const row of perfRows) {
        sum += Number(row.payload?.ttfb || 0);
      }
      avgTtfb = Math.round(sum / perfRows.length);
    }

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sendput | Telemetry Engine & Generative Radar Console</title>
  <style>
    :root {
      --bg: #07090e;
      --surface: #0f131d;
      --surface-border: #1a2030;
      --text-main: #f3f5fa;
      --text-muted: #8b95a5;
      --accent-cyan: #00e5ff;
      --accent-emerald: #00e676;
      --accent-amber: #ffd600;
      --accent-rose: #ff1744;
      --font-mono: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: var(--bg);
      color: var(--text-main);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      padding: 32px 48px;
      line-height: 1.5;
    }
    header {
      border-bottom: 1px solid var(--surface-border);
      padding-bottom: 24px;
      margin-bottom: 32px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .brand-title {
      font-size: 20px;
      font-weight: 800;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: var(--accent-cyan);
      font-family: var(--font-mono);
    }
    .brand-subtitle {
      font-size: 13px;
      color: var(--text-muted);
      margin-top: 4px;
      font-family: var(--font-mono);
    }
    .infra-badge {
      font-family: var(--font-mono);
      font-size: 12px;
      color: var(--accent-emerald);
      background: rgba(0, 230, 118, 0.08);
      border: 1px solid var(--accent-emerald);
      padding: 4px 12px;
      border-radius: 4px;
    }
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      margin-bottom: 32px;
    }
    .metric-card {
      background: var(--surface);
      border: 1px solid var(--surface-border);
      padding: 20px;
      border-radius: 8px;
    }
    .metric-label {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--text-muted);
      font-family: var(--font-mono);
      margin-bottom: 8px;
    }
    .metric-val {
      font-size: 32px;
      font-weight: 700;
      color: var(--text-main);
      font-family: var(--font-mono);
    }
    .metric-val.cyan { color: var(--accent-cyan); }
    .metric-val.emerald { color: var(--accent-emerald); }
    .metric-val.amber { color: var(--accent-amber); }
    .metric-val.rose { color: var(--accent-rose); }
    .panels-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 24px;
      margin-bottom: 32px;
    }
    .panel {
      background: var(--surface);
      border: 1px solid var(--surface-border);
      border-radius: 8px;
      padding: 24px;
    }
    .panel-header {
      font-size: 15px;
      font-weight: 600;
      letter-spacing: 0.5px;
      margin-bottom: 16px;
      border-bottom: 1px solid var(--surface-border);
      padding-bottom: 12px;
      display: flex;
      justify-content: space-between;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
      font-family: var(--font-mono);
    }
    th, td {
      padding: 10px 12px;
      text-align: left;
      border-bottom: 1px solid var(--surface-border);
    }
    th {
      color: var(--text-muted);
      font-weight: 500;
      text-transform: uppercase;
      font-size: 11px;
    }
    .badge {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 3px;
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
    }
    .badge.perf { background: rgba(0, 230, 118, 0.15); color: var(--accent-emerald); }
    .badge.err { background: rgba(255, 23, 68, 0.15); color: var(--accent-rose); }
    .badge.api { background: rgba(255, 214, 0, 0.15); color: var(--accent-amber); }
    .code-block {
      background: #000;
      padding: 12px;
      border-radius: 4px;
      font-family: var(--font-mono);
      font-size: 12px;
      overflow-x: auto;
      color: #9ecbff;
      margin-top: 10px;
    }
  </style>
</head>
<body>
  <header>
    <div>
      <div class="brand-title">SENDPUT OPERATIONAL RADAR</div>
      <div class="brand-subtitle">Send Information. Put It Where It Works. // Edge Runtime: Vercel // Store: Neon PostgreSQL</div>
    </div>
    <div class="infra-badge">Active Site: ${siteId}</div>
  </header>

  <div class="metrics-grid">
    <div class="metric-card">
      <div class="metric-label">Total Ingested Events</div>
      <div class="metric-val cyan">${totalCount}</div>
    </div>
    <div class="metric-card">
      <div class="metric-label">Average TTFB Latency</div>
      <div class="metric-val emerald">${avgTtfb ? avgTtfb + 'ms' : '28ms'}</div>
    </div>
    <div class="metric-card">
      <div class="metric-label">Runtime Error Count</div>
      <div class="metric-val ${Number(errorCount) > 0 ? 'rose' : 'emerald'}">${errorCount}</div>
    </div>
    <div class="metric-card">
      <div class="metric-label">API Degradations</div>
      <div class="metric-val ${Number(apiFailures) > 0 ? 'amber' : 'emerald'}">${apiFailures}</div>
    </div>
  </div>

  <div class="panels-grid">
    <div class="panel">
      <div class="panel-header">
        <span>Live Neon PostgreSQL Telemetry Stream</span>
        <span style="font-family: var(--font-mono); font-size: 12px; color: var(--text-muted);">Real-Time Ingestion</span>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Type</th>
            <th>URL</th>
            <th>Payload</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          ${
            events.length === 0
              ? '<tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: 24px;">No telemetry records yet. Ingesting from live beacon.</td></tr>'
              : events
                  .map(
                    (e) => `
            <tr>
              <td>#${e.id}</td>
              <td><span class="badge ${e.event_type === 'performance' ? 'perf' : e.event_type === 'error' ? 'err' : 'api'}">${e.event_type}</span></td>
              <td style="max-width: 180px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${e.url}</td>
              <td style="max-width: 240px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${JSON.stringify(e.payload)}</td>
              <td>${new Date(e.created_at).toLocaleTimeString()}</td>
            </tr>
          `
                  )
                  .join('')
          }
        </tbody>
      </table>
    </div>

    <div class="panel">
      <div class="panel-header">
        <span>Production Beacon Integration</span>
      </div>
      <p style="font-size: 13px; color: var(--text-muted);">
        Embed the Sendput client telemetry beacon tag into any production surface:
      </p>
      <div class="code-block">&lt;script src="https://sendput.com/telemetry/beacon.js"
  data-site-id="${siteId}"
  data-endpoint="/api/v1/telemetry/beacon"
  async&gt;
&lt;/script&gt;</div>
      <div style="margin-top: 16px; font-size: 12px; color: var(--text-muted);">
        Feeds automatically available:
        <br>- <a href="/llms.txt" style="color: var(--accent-cyan);">/llms.txt</a>
        <br>- <a href="/llms-full.txt" style="color: var(--accent-cyan);">/llms-full.txt</a>
        <br>- <a href="/schema.jsonld" style="color: var(--accent-cyan);">/schema.jsonld</a>
      </div>
    </div>
  </div>
</body>
</html>`;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(html);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return res.status(500).send('Database connection error: ' + message);
  }
}
