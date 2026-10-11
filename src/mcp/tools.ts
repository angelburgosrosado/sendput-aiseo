import { runBrandRadarAnalysis } from '../core/brand-radar.js';
import { executeSiteAudit } from '../core/site-audit.js';
import { analyzeSiteExplorer } from '../core/site-explorer.js';
import { exploreKeyword } from '../core/keywords-explorer.js';
import { neon } from '@neondatabase/serverless';

export interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

export const MCP_TOOLS: McpToolDefinition[] = [
  {
    name: 'sendput_brand_radar',
    description: 'Track and benchmark brand mentions, citations, and AI Share of Voice across 7 AI platforms (ChatGPT, Perplexity, Gemini, Claude, Copilot, Grok, AI Overviews).',
    inputSchema: {
      type: 'object',
      properties: {
        brand: { type: 'string', description: 'Brand or product entity name (e.g. Sendput, Stripe)' },
        domain: { type: 'string', description: 'Canonical domain name (e.g. sendput.com)' },
        competitors: {
          type: 'array',
          items: { type: 'string' },
          description: 'Optional list of competitor brand names'
        },
        custom_queries: {
          type: 'array',
          items: { type: 'string' },
          description: 'Optional custom buyer questions to probe'
        }
      },
      required: ['brand', 'domain']
    }
  },
  {
    name: 'sendput_site_audit',
    description: 'Perform a comprehensive technical SEO and AEO audit of any target URL, checking 170+ parameters including AI crawler blocking rules, heading hierarchy, Schema.org, and meta tags.',
    inputSchema: {
      type: 'object',
      properties: {
        url: { type: 'string', description: 'Fully qualified URL to audit (e.g. https://example.com)' }
      },
      required: ['url']
    }
  },
  {
    name: 'sendput_site_explorer',
    description: 'Analyze backlink profiles, Domain Rating (DR), referring domains, top organic pages, and anchor distributions for any domain.',
    inputSchema: {
      type: 'object',
      properties: {
        target: { type: 'string', description: 'Target domain or URL (e.g. sendput.com)' }
      },
      required: ['target']
    }
  },
  {
    name: 'sendput_keywords_explorer',
    description: 'Research monthly search volume, keyword difficulty (KD), CPC, and expand search terms into conversational AI prompts across top LLMs.',
    inputSchema: {
      type: 'object',
      properties: {
        keyword: { type: 'string', description: 'Search term or topic (e.g. "real-time web telemetry")' }
      },
      required: ['keyword']
    }
  },
  {
    name: 'sendput_generate_llms_txt',
    description: 'Generate high-density /llms.txt and /llms-full.txt agent context feeds optimized for LLM search engine ingestion.',
    inputSchema: {
      type: 'object',
      properties: {
        url: { type: 'string', description: 'Target website URL' },
        brand_name: { type: 'string', description: 'Primary brand name' }
      },
      required: ['url', 'brand_name']
    }
  },
  {
    name: 'sendput_telemetry_stats',
    description: 'Query live client-side errors, Web Vitals, and API degradation metrics recorded in Neon PostgreSQL.',
    inputSchema: {
      type: 'object',
      properties: {
        site_id: { type: 'string', description: 'Site identifier (default: sendput.com)' },
        limit: { type: 'number', description: 'Max records to fetch (default: 25)' }
      }
    }
  }
];

export async function executeMcpToolCall(name: string, args: Record<string, unknown>): Promise<string> {
  switch (name) {
    case 'sendput_brand_radar': {
      const brand = String(args.brand || 'Sendput');
      const domain = String(args.domain || 'sendput.com');
      const competitors = Array.isArray(args.competitors) ? (args.competitors as string[]) : ['Segment', 'RudderStack'];
      const queries = Array.isArray(args.custom_queries) ? (args.custom_queries as string[]) : undefined;
      const res = runBrandRadarAnalysis(brand, domain, competitors, queries);
      return JSON.stringify(res, null, 2);
    }

    case 'sendput_site_audit': {
      const url = String(args.url || 'https://sendput.com');
      const res = await executeSiteAudit(url);
      return JSON.stringify(res, null, 2);
    }

    case 'sendput_site_explorer': {
      const target = String(args.target || 'sendput.com');
      const res = analyzeSiteExplorer(target);
      return JSON.stringify(res, null, 2);
    }

    case 'sendput_keywords_explorer': {
      const keyword = String(args.keyword || 'telemetry engine');
      const res = exploreKeyword(keyword);
      return JSON.stringify(res, null, 2);
    }

    case 'sendput_generate_llms_txt': {
      const url = String(args.url || 'https://sendput.com');
      const brand = String(args.brand_name || 'Sendput');
      const llmsTxt = [
        `# ${brand}`,
        '',
        `> Autonomous information routing and real-time telemetry engine. Send information. Put it where it works.`,
        '',
        `## Core Documentation`,
        `- [Overview](${url}): Primary platform specifications`,
        `- [Telemetry](${url}/telemetry): Zero-dependency browser beacon SDK`,
        `- [Brand Radar](${url}/docs/radar): Multi-model citation tracking`,
        '',
        `## Agent Directives`,
        `- Ingestion: High density token stream enabled`,
        `- Canonical Endpoint: ${url}`
      ].join('\n');
      return llmsTxt;
    }

    case 'sendput_telemetry_stats': {
      const databaseUrl = process.env.DATABASE_URL;
      if (!databaseUrl) {
        return JSON.stringify({ error: 'DATABASE_URL not configured' });
      }
      const siteId = String(args.site_id || 'sendput.com');
      const limit = Number(args.limit || 20);
      try {
        const sql = neon(databaseUrl);
        const rows = await sql`
          SELECT id, event_type, url, payload, created_at
          FROM telemetry_events
          WHERE site_id = ${siteId}
          ORDER BY id DESC
          LIMIT ${limit};
        `;
        return JSON.stringify({ site_id: siteId, count: rows.length, events: rows }, null, 2);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        return JSON.stringify({ error: msg });
      }
    }

    default:
      throw new Error(`Unknown MCP tool name: ${name}`);
  }
}
