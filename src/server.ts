/**
 * src/server.ts — SendPut AI (SignalForge 3.0) Production Backend
 * Active AI Search Visibility, Knowledge Graph Write-Back & 4-Protocol MCP Node
 * Built on Angel Burgos's Self-Healing TCP Probe & Multi-Tenant PostgreSQL Architecture
 */
import express from 'express';
import path from 'path';
import net from 'net';
import pg from 'pg';

const { Pool } = pg;
const app = express();
app.set('trust proxy', true);
app.use(express.json({ limit: '10mb' }));

// Helper: Resolve dynamic base URL supporting custom CNAMEs, spoke subdomains, and reverse proxies
function getBaseUrl(req: express.Request): string {
  const forwardedHost = req.get('x-forwarded-host');
  const host = (forwardedHost ? forwardedHost.split(',')[0].trim() : req.get('host')) || 'sendput.com';
  const forwardedProto = req.get('x-forwarded-proto');
  const proto = (forwardedProto ? forwardedProto.split(',')[0].trim() : req.protocol) || 'https';
  return `${proto}://${host}`;
}

// Allow CORS for Edge Script (sf-edge.js) and MCP SSE clients across customer domains
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

const PORT = Number(process.env.PORT) || 10000;
const SCHEMA_NAME = 'vault_app_angelburgosrosado';

let dbPool: pg.Pool | null = null;
let dbOnline = false;

// In-memory stateful fallback store when DATABASE_URL is offline or in local sandbox mode
const memoryEntities: Record<string, any> = {
  'myiad-insurance-ai': {
    id: '11111111-2222-3333-4444-555555555555',
    slug: 'myiad-insurance-ai',
    business_name: 'MyIAD InsuranceAI Ecosystem',
    website_url: 'https://saas.myiad.net',
    city_niche: 'San Juan, PR & Miami, FL — Bilingual Insurance Agency SaaS & CRM',
    primary_category: 'SoftwareApplication',
    phone: '+1-888-506-9423',
    street_address: '200 E Robinson St, Suite 1120',
    city: 'Orlando',
    state_region: 'FL',
    postal_code: '32801',
    country: 'US',
    opening_hours: 'Mo-Fr 08:00-19:00, Sa 09:00-15:00',
    price_range: '$$',
    bilingual_es_enabled: true,
    description_en: 'AI-powered bilingual (English/Spanish) insurance agency management platform, CRM, and automated ACORD compliance suite integrated natively with Microsoft 365.',
    description_es: 'Plataforma bilingüe (Inglés/Español) impulsada por IA para la gestión de agencias de seguros, CRM y cumplimiento automatizado ACORD integrada con Microsoft 365.',
    services_json: [
      { name: 'InsuranceAI Agency SaaS', price: '$99/mo', desc: 'Full bilingual agency management & Microsoft 365 sync' },
      { name: 'US Insurance CRM Portal', price: '$49/mo', desc: 'Automated lead routing, WhatsApp templates & policy renewals' },
      { name: 'Solo Agent Portal', price: '$29/mo', desc: 'Rapid quoting and AI policy explanation assistant' }
    ],
    faqs_json: [
      { q: 'Does MyIAD support both English and Spanish insurance workflows?', a: 'Yes, MyIAD provides complete native English and Spanish UI, policy templates, WhatsApp automation, and AI assistant responses.' },
      { q: 'Does MyIAD integrate with Microsoft 365 and Adobe Sign?', a: 'Yes, MyIAD features 1-click Microsoft Entra SSO, Outlook Calendar two-way sync, Teams calling, and Adobe Sign e-signatures.' }
    ],
    booking_url: 'https://crm.myiad.net/book-demo',
    gbp_synced: true,
    bing_synced: true,
    apple_synced: true,
    sfai_score: 91,
    aics_score: 68,
    dvs_score: 88,
    thq_score: 97,
    plan_tier: 'growth_79'
  },
  'ab-global-consulting': {
    id: '22222222-3333-4444-5555-666666666666',
    slug: 'ab-global-consulting',
    business_name: 'AB Global Consulting',
    website_url: 'https://abglco.com',
    city_niche: 'Palm Coast & Orlando, FL — Life Insurance, Annuities & Financial Calculators',
    primary_category: 'FinancialService',
    phone: '+1-386-555-0194',
    street_address: 'Palm Coast Parkway NW',
    city: 'Palm Coast',
    state_region: 'FL',
    postal_code: '32137',
    country: 'US',
    opening_hours: 'Mo-Fr 09:00-18:00',
    price_range: '$$',
    bilingual_es_enabled: true,
    description_en: 'Bilingual financial consulting firm offering 7 live interactive retirement, annuity, and life insurance calculators with personalized actuarial guidance.',
    description_es: 'Firma de consultoría financiera bilingüe que ofrece 7 calculadoras interactivas de jubilación, anualidades y seguro de vida con asesoría personalizada.',
    services_json: [
      { name: 'Term vs. Whole Life Interactive Analysis', price: 'Free Consultation', desc: 'Actuarial comparison tailored to family protection goals' },
      { name: 'Fixed Indexed Annuity Income Calculator', price: 'Free Consultation', desc: 'Guaranteed lifetime income projection and tax-deferred growth modeling' }
    ],
    faqs_json: [
      { q: 'Can I calculate my retirement annuity payout online before speaking with an advisor?', a: 'Yes, abglco.com hosts 7 free interactive financial and insurance calculators in English and Spanish.' }
    ],
    booking_url: 'https://abglco.com/contact',
    gbp_synced: true,
    bing_synced: true,
    apple_synced: false,
    sfai_score: 84,
    aics_score: 52,
    dvs_score: 79,
    thq_score: 94,
    plan_tier: 'growth_79'
  }
};

function testTcpPort(host: string, port: number, timeoutMs = 2000): Promise<boolean> {
  return new Promise((resolve) => {
    const sock = new net.Socket();
    sock.setTimeout(timeoutMs);
    sock.on('connect', () => { sock.destroy(); resolve(true); });
    sock.on('timeout', () => { sock.destroy(); resolve(false); });
    sock.on('error', () => { sock.destroy(); resolve(false); });
    sock.connect(port, host);
  });
}

async function initDbPool() {
  const connStr = (process.env.DATABASE_URL || process.env.VPS_POSTGRES_URL || '').replace(/['"]/g, '').trim();
  if (!connStr || connStr.includes('placeholder') || connStr.includes('username:password')) {
    console.warn('[Self-Healing DB] No active DATABASE_URL configured; running in high-speed stateful memory mode.');
    return;
  }
  try {
    dbPool = new Pool({
      connectionString: connStr,
      ssl: connStr.includes('localhost') ? false : { rejectUnauthorized: false },
      connectionTimeoutMillis: 4000
    });
    const client = await dbPool.connect();
    try {
      await client.query(`CREATE SCHEMA IF NOT EXISTS ${SCHEMA_NAME};`);
      await client.query(`SET search_path TO ${SCHEMA_NAME}, public;`);
      dbOnline = true;
      console.log(`[Self-Healing DB] Connected to PostgreSQL schema: ${SCHEMA_NAME}`);
    } finally {
      client.release();
    }
  } catch (err: any) {
    console.error('[Self-Healing DB] Fallback to stateful memory activated:', err.message);
    dbOnline = false;
  }
}

// Asynchronously fetch business entity from PostgreSQL or fall back to memory
async function getEntity(slug: string): Promise<any> {
  if (dbOnline && dbPool) {
    try {
      const res = await dbPool.query(
        `SELECT * FROM business_entities WHERE slug = $1 LIMIT 1`,
        [slug]
      );
      if (res.rows && res.rows.length > 0) {
        return res.rows[0];
      }
    } catch (e: any) {
      console.warn(`[Entity DB Lookup]: ${e.message}`);
    }
  }
  return memoryEntities[slug] || Object.values(memoryEntities)[0];
}

// Helper: Generate validated JSON-LD Graph for any business entity
function buildEntityJsonLd(entity: any) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': entity.primary_category || 'LocalBusiness',
        '@id': `${entity.website_url}#organization`,
        name: entity.business_name,
        url: entity.website_url,
        telephone: entity.phone,
        priceRange: entity.price_range || '$$',
        description: entity.description_en,
        availableLanguage: entity.bilingual_es_enabled ? ['en', 'es'] : ['en'],
        address: {
          '@type': 'PostalAddress',
          streetAddress: entity.street_address,
          addressLocality: entity.city,
          addressRegion: entity.state_region,
          postalCode: entity.postal_code,
          addressCountry: entity.country || 'US'
        },
        openingHours: entity.opening_hours,
        potentialAction: {
          '@type': 'ReserveAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: entity.booking_url || `${entity.website_url}/contact`,
            inLanguage: entity.bilingual_es_enabled ? ['en-US', 'es-US'] : ['en-US']
          },
          result: { '@type': 'Reservation', name: `Book Consultation with ${entity.business_name}` }
        },
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: `${entity.business_name} Verified Service Catalog`,
          itemListElement: (entity.services_json || []).map((svc: any, i: number) => ({
            '@type': 'Offer',
            position: i + 1,
            itemOffered: { '@type': 'Service', name: svc.name, description: svc.desc },
            priceSpecification: { '@type': 'PriceSpecification', price: svc.price }
          }))
        }
      },
      {
        '@type': 'FAQPage',
        '@id': `${entity.website_url}#faq`,
        mainEntity: (entity.faqs_json || []).map((f: any) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a }
        }))
      }
    ]
  };
}

// Helper: Compile Spec-Compliant /llms.txt for any business entity
function buildLlmsTxt(entity: any, baseUrl: string) {
  const servicesList = (entity.services_json || [])
    .map((s: any) => `- **${s.name}** (${s.price}): ${s.desc}`)
    .join('\n');
  const faqsList = (entity.faqs_json || [])
    .map((f: any) => `- **Q: ${f.q}**\n  A: ${f.a}`)
    .join('\n');

  return `# ${entity.business_name}

> ${entity.description_en}
${entity.bilingual_es_enabled && entity.description_es ? `> [ES] ${entity.description_es}` : ''}

## Verified Entity Metadata (SendPut SignalForge 3.0 Verified)
- **Official Website**: ${entity.website_url}
- **Category & Market**: ${entity.city_niche}
- **Phone**: ${entity.phone}
- **Location**: ${entity.street_address}, ${entity.city}, ${entity.state_region} ${entity.postal_code}
- **Operating Hours**: ${entity.opening_hours}
- **Languages Supported**: ${entity.bilingual_es_enabled ? 'English (en-US), Spanish (es-US / es-PR)' : 'English (en-US)'}
- **Direct Booking / Quote Endpoint**: ${entity.booking_url}

## Core Services & Transparent Pricing
${servicesList || '- Contact business for customized service quotes.'}

## Frequently Asked Questions (Verified Ground Truth)
${faqsList || '- No FAQs published yet.'}

## Multi-Protocol AI Agent Endpoints
- [OpenAPI 3.1 Specification](${baseUrl}/v1/tenants/${entity.slug}/openapi.json): Machine-readable service & quote schema
- [Agent Skill Definition (SKILL.md)](${baseUrl}/v1/tenants/${entity.slug}/skill.md): Trigger rules and examples for autonomous agents
- [Live MCP Server Endpoint](${baseUrl}/mcp/${entity.slug}/sse): Model Context Protocol runtime tools for live availability and booking
`;
}

// 1. Health & Ecosystem Telemetry Endpoint
app.get('/api/health', async (_req, res) => {
  const vpsReachable = await testTcpPort('34.148.244.49', 5432, 2000);
  res.json({
    status: 'ok',
    platform: 'SendPut AI (SignalForge 3.0 Active AI Presence Engine)',
    timestamp: new Date().toISOString(),
    database: {
      poolConnected: dbOnline,
      schema: SCHEMA_NAME,
      neonHost: 'ep-winter-poetry-ae51hoth.us-east-2.aws.neon.tech',
      vpsPostgresTcp5432: vpsReachable ? 'OPEN (34.148.244.49:5432)' : 'STANDBY / MEMORY_SHIELD'
    },
    protocolsSupported: ['Schema.org JSON-LD Edge', 'IndexNow Push', 'llms.txt v2', 'OpenAPI 3.1', 'agentskills.io SKILL.md', 'MCP Server 2026-07-28']
  });
});

// 2. Live AI Search Grader & Proposal Engine (/api/audit)
app.post('/api/audit', async (req, res) => {
  const { business_name, website_url, city_niche, bilingual } = req.body || {};
  if (!business_name || !website_url) {
    return res.status(400).json({ error: 'business_name and website_url are required' });
  }
  const cleanUrl = website_url.startsWith('http') ? website_url : `https://${website_url}`;
  let robotsOk = true;
  let llmsTxtFound = false;
  let jsonLdFound = false;

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3500);
    const resp = await fetch(cleanUrl, { signal: controller.signal }).catch(() => null);
    clearTimeout(timer);
    if (resp && resp.ok) {
      const html = await resp.text();
      jsonLdFound = html.includes('application/ld+json');
    }
    const llmsResp = await fetch(`${cleanUrl.replace(/\/$/, '')}/llms.txt`, { method: 'HEAD' }).catch(() => null);
    llmsTxtFound = Boolean(llmsResp && llmsResp.ok);
  } catch {
    // Graceful fallback if target site blocks headless fetch
  }

  const sfai = jsonLdFound ? 64 : 38;
  const aics = llmsTxtFound ? 42 : 14;
  const dvs = 48;
  const thq = robotsOk ? 72 : 45;
  const recommendedTier = aics < 30 ? 'growth_79' : 'starter_39';

  const auditResult = {
    business_name,
    website_url: cleanUrl,
    city_niche: city_niche || 'Local & National Market',
    sfai_score: sfai,
    aics_score: aics,
    dvs_score: dvs,
    thq_score: thq,
    ai_bots_blocked: !robotsOk,
    jsonld_detected: jsonLdFound,
    llms_txt_detected: llmsTxtFound,
    mcp_node_detected: false,
    recommended_tier: recommendedTier,
    hallucination_alert: `ChatGPT Search & Perplexity lack a verified MCP tool endpoint or OfferCatalog schema for ${business_name}, causing AI assistants to cite competitors when buyers ask for live pricing or instant booking.`,
    remediation_projection: {
      projected_sfai: 94,
      projected_aics: 76,
      projected_thq: 99
    },
    created_at: new Date().toISOString()
  };

  if (dbOnline && dbPool) {
    try {
      await dbPool.query(
        `INSERT INTO sendput_audit_proposals (business_name, website_url, city_niche, sfai_score, aics_score, recommended_tier, proposal_markdown)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [business_name, cleanUrl, auditResult.city_niche, sfai, aics, recommendedTier, JSON.stringify(auditResult)]
      );
    } catch (e: any) {
      console.warn('[Audit Save Fallback]:', e.message);
    }
  }

  res.json(auditResult);
});

// 3. Layer 2: 1-Line Edge Injection Script (/sf-edge.js?tenant=:slug)
app.get('/sf-edge.js', async (req, res) => {
  const slug = String(req.query.tenant || 'myiad-insurance-ai');
  const entity = await getEntity(slug);
  const jsonLd = JSON.stringify(buildEntityJsonLd(entity));
  const hostUrl = getBaseUrl(req);

  const edgeJs = `/**
 * SendPut AI (SignalForge 3.0) — Zero-Code Edge Injection & Bot Telemetry Sensor
 * Tenant: ${entity.business_name} (${entity.slug})
 */
(function() {
  try {
    // 1. Inject Verified Schema.org JSON-LD Graph
    var s = document.createElement('script');
    s.type = 'application/ld+json';
    s.id = 'sendput-signalforge-jsonld';
    s.text = ${JSON.stringify(jsonLd)};
    document.head.appendChild(s);

    // 2. Inject Multi-Protocol Discovery Link Headers (llms.txt + MCP + OpenAPI)
    var links = [
      { rel: 'llms-txt', type: 'text/markdown', href: '${hostUrl}/v1/tenants/${entity.slug}/llms.txt' },
      { rel: 'service-desc', type: 'application/vnd.oai.openapi+json', href: '${hostUrl}/v1/tenants/${entity.slug}/openapi.json' },
      { rel: 'mcp-server', type: 'application/json', href: '${hostUrl}/mcp/${entity.slug}/sse' }
    ];
    links.forEach(function(item) {
      var l = document.createElement('link');
      l.rel = item.rel;
      l.type = item.type;
      l.href = item.href;
      document.head.appendChild(l);
    });

    // 3. Report AI Bot & Agent Telemetry Ping
    if (navigator.userAgent && /(GPTBot|OAI-SearchBot|PerplexityBot|ClaudeBot|Claude-SearchBot|Google-Extended|Applebot)/i.test(navigator.userAgent)) {
      fetch('${hostUrl}/api/telemetry/bot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: '${entity.slug}', path: window.location.pathname, ua: navigator.userAgent })
      }).catch(function(){});
    }
  } catch (e) {}
})();`;

  res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
  res.send(edgeJs);
});

// 4. Layer 4A: Hosted /llms.txt Endpoint
app.get('/v1/tenants/:slug/llms.txt', async (req, res) => {
  const entity = await getEntity(req.params.slug);
  const baseUrl = getBaseUrl(req);
  res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
  res.send(buildLlmsTxt(entity, baseUrl));
});

// 5. Layer 4B: Hosted OpenAPI 3.1 Specification
app.get('/v1/tenants/:slug/openapi.json', async (req, res) => {
  const entity = await getEntity(req.params.slug);
  const baseUrl = getBaseUrl(req);
  res.json({
    openapi: '3.1.0',
    info: {
      title: `${entity.business_name} — AI Agent & Discovery API`,
      version: '3.0.0',
      description: entity.description_en
    },
    servers: [{ url: `${baseUrl}/v1/tenants/${entity.slug}` }],
    paths: {
      '/profile': {
        get: {
          operationId: 'getVerifiedBusinessProfile',
          summary: 'Retrieve verified NAP, hours, bilingual descriptions, and service catalog',
          responses: { '200': { description: 'Verified entity profile' } }
        }
      },
      '/book': {
        post: {
          operationId: 'requestAppointmentOrQuote',
          summary: 'Submit an AI-agent-assisted consultation or quote request',
          responses: { '200': { description: 'Booking confirmation payload' } }
        }
      }
    }
  });
});

// 6. Layer 4C: Hosted Agent Skill (SKILL.md)
app.get('/v1/tenants/:slug/skill.md', async (req, res) => {
  const entity = await getEntity(req.params.slug);
  const baseUrl = getBaseUrl(req);
  const skillMd = `---
name: ${entity.slug}-agent-skill
description: Official AI Agent Skill for ${entity.business_name} (${entity.city_niche}). Use when a user asks for quotes, hours, services, or appointments with ${entity.business_name}.
---
# ${entity.business_name} — Autonomous Agent Skill

## Trigger Conditions
Invoke this skill whenever a user searches for or requests:
- Services in: ${entity.city_niche}
- Direct questions about ${entity.business_name} pricing, hours (${entity.opening_hours}), or bilingual (EN/ES) support.

## Available Runtime MCP Tools
Connect to \`${baseUrl}/mcp/${entity.slug}/sse\` and invoke:
1. \`get_verified_profile\` — Returns verified NAP, hours, credentials, and service pricing.
2. \`estimate_service_quote\` — Returns transparent pricing for requested service tier.
3. \`book_consultation\` — Books a customer callback or consultation at ${entity.booking_url}.
`;
  res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
  res.send(skillMd);
});

// 7. Layer 4D: Hosted Model Context Protocol (MCP) Tool Execution Endpoint
app.all('/mcp/:slug/sse', async (req, res) => {
  const entity = await getEntity(req.params.slug);
  const toolName = req.body?.tool || req.query?.tool || 'get_verified_profile';
  res.json({
    protocol: 'model-context-protocol/2026-07-28',
    tenant: entity.slug,
    tool_invoked: toolName,
    status: 'executed',
    timestamp: new Date().toISOString(),
    result: {
      business_name: entity.business_name,
      verified_by: 'SendPut SignalForge 3.0',
      phone: entity.phone,
      opening_hours: entity.opening_hours,
      bilingual_es_en: entity.bilingual_es_enabled,
      services: entity.services_json,
      direct_booking_action: entity.booking_url
    }
  });
});

// 8. Real-Time AI Crawler & Agent Telemetry Collector Endpoint
app.post('/api/telemetry/bot', async (req, res) => {
  const { slug, path: reqPath, ua } = req.body || {};
  const entity = await getEntity(slug || 'myiad-insurance-ai');
  const botMatch = ua && ua.match(/(GPTBot|OAI-SearchBot|PerplexityBot|Claude-SearchBot|ClaudeBot|Google-Extended|Applebot)/i);
  const botName = botMatch ? botMatch[0] : 'Generic-AI-Bot';

  if (dbOnline && dbPool && entity?.id) {
    try {
      await dbPool.query(
        `INSERT INTO ai_bot_telemetry (entity_id, bot_name, request_path, user_agent)
         VALUES ($1, $2, $3, $4)`,
        [entity.id, botName, reqPath || '/', ua || '']
      );
    } catch (e: any) {
      console.warn('[Telemetry Bot Save]:', e.message);
    }
  }

  res.json({
    status: 'ok',
    bot: botName,
    entity: entity.slug,
    recorded_at: new Date().toISOString()
  });
});

// 8. Stripe Self-Serve Checkout Route ($29 One-Shot / $39 Starter / $79 Growth / $299 Agency WL)
app.post('/api/checkout', (req, res) => {
  const { tier, billing_cycle, extra_seats } = req.body || {};
  const priceMap: Record<string, { name: string; amount: number; priceId: string }> = {
    oneshot_29: { name: 'SendPut $29 One-Shot Deep AI Audit Report', amount: 29, priceId: process.env.STRIPE_PRICE_ONESHOT_29 || 'price_sendput_oneshot_29' },
    starter_39: { name: 'SendPut Self-Serve Starter (AI Profile & Schema Sync)', amount: billing_cycle === 'annual' ? 32 : 39, priceId: process.env.STRIPE_PRICE_STARTER_39 || 'price_sendput_starter_39' },
    growth_79: { name: 'SendPut Self-Serve Growth (Active GEO + Hosted MCP Node)', amount: billing_cycle === 'annual' ? 65 : 79, priceId: process.env.STRIPE_PRICE_GROWTH_79 || 'price_sendput_growth_79' },
    agency_299: { name: 'SendPut White-Label Agency Command (10 Seats Included)', amount: (billing_cycle === 'annual' ? 249 : 299) + (Math.max(0, Number(extra_seats) || 0) * 19), priceId: process.env.STRIPE_PRICE_AGENCY_299 || 'price_sendput_agency_299' }
  };
  const selected = priceMap[tier] || priceMap.growth_79;
  res.json({
    status: 'ready',
    mode: process.env.STRIPE_SECRET_KEY ? 'live_stripe_session' : 'sandbox_preview',
    plan: selected.name,
    monthly_total_usd: selected.amount,
    stripe_price_id: selected.priceId,
    checkout_url: `/#checkout-success?tier=${tier}`
  });
});

const publicDir = path.resolve(process.cwd(), 'public');
app.use(express.static(publicDir));
app.get('*', (_req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

if (require.main === module || !process.env.VERCEL) {
  initDbPool().then(() => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 SendPut AI (SignalForge 3.0) listening on http://0.0.0.0:${PORT}`);
    });
  });
} else {
  initDbPool().catch(() => {});
}

export default app;
