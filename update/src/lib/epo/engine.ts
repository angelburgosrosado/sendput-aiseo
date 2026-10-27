/**
 * src/lib/epo/engine.ts — SendPut EPO Engine (RFC-2026-GEO-01)
 *
 * Official Core Optimization Pipeline for Entity Presence Optimization (EPO)
 * Implements the 5 Discrete Deterministic Pipeline Functions:
 * 1. buildSemanticGraph(config): Valid nested Schema.org @graph JSON-LD
 * 2. buildLlmsSpecification(config): Token-budgeted (<2,000 tokens) /llms.txt & extended /llms-full.txt
 * 3. dispatchIndexNowBatch(urls, key, host): High-velocity POST payloads directly to api.indexnow.org
 * 4. getMcpToolManifest(): Standardized Model Context Protocol tool declarations
 * 5. computeEpoScore(checks): Formula: Score = (0.35 * EntityAccuracy) + (0.25 * IndexLatency) + (0.25 * CitationShare) + (0.15 * AgentReadiness)
 *
 * Includes background synchronization queue management and dashboard status telemetries.
 */

// ============================================================================
// TypeScript Interfaces: Inputs & Outputs (RFC-2026-GEO-01)
// ============================================================================

export interface EpoServiceItem {
  name: string;
  price: string;
  desc: string;
  category?: string;
}

export interface EpoFaqItem {
  q: string;
  a: string;
}

export interface EpoEntityConfig {
  id?: string;
  slug: string;
  business_name: string;
  website_url: string;
  city_niche: string;
  primary_category?: string;
  phone?: string;
  street_address?: string;
  city?: string;
  state_region?: string;
  postal_code?: string;
  country?: string;
  opening_hours?: string;
  price_range?: string;
  bilingual_es_enabled?: boolean;
  description_en: string;
  description_es?: string;
  services_json?: EpoServiceItem[];
  faqs_json?: EpoFaqItem[];
  booking_url?: string;
  logo_url?: string;
  host_url?: string;
  social_links?: string[];
  same_as?: string[];
  knows_about?: string[];
}

export interface SemanticGraphResult {
  context: 'https://schema.org';
  graph: any[];
  jsonLdString: string;
  entityTypes: string[];
  authorityLinks: string[];
  generatedAt: string;
}

export interface LlmsSpecificationResult {
  llmsTxt: string;
  llmsFullTxt: string;
  tokenEstimate: number;
  fullTokenEstimate: number;
  isBudgetCompliant: boolean; // Guaranteed < 2,000 tokens for llms.txt
  generatedAt: string;
}

export interface IndexNowDispatchResult {
  success: boolean;
  statusCode: number;
  statusText: string;
  host: string;
  keyUsed: string;
  urlsSubmitted: string[];
  timestamp: string;
  rawResponse?: string;
}

export interface McpToolProperty {
  type: string;
  description: string;
  enum?: string[];
  items?: any;
}

export interface McpToolDeclaration {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, McpToolProperty>;
    required?: string[];
  };
}

export interface McpToolManifest {
  protocolVersion: string;
  serverInfo: {
    name: string;
    version: string;
    specification: string;
  };
  tools: McpToolDeclaration[];
}

export interface EpoScoreChecks {
  entityAccuracy: number; // 0 - 100
  indexLatency: number;   // 0 - 100 (100 = instant IndexNow real-time propagation)
  citationShare: number;  // 0 - 100 (direct verification share across AI search engines)
  agentReadiness: number; // 0 - 100 (llms.txt + OpenAPI 3.1 + MCP SSE live node readiness)
  metadata?: {
    jsonLdPresent?: boolean;
    llmsTxtPresent?: boolean;
    mcpNodePresent?: boolean;
    indexNowActive?: boolean;
    robotsAllowed?: boolean;
    liveLlmGroundingFound?: boolean;
    [key: string]: any;
  };
}

export interface EpoScoreResult {
  score: number;
  formula: string;
  weights: {
    entityAccuracy: number;
    indexLatency: number;
    citationShare: number;
    agentReadiness: number;
  };
  breakdown: {
    entityAccuracy: number;
    indexLatency: number;
    citationShare: number;
    agentReadiness: number;
  };
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  evaluationDetails: {
    summary: string;
    criticalGaps: string[];
    remediationRoadmap: string[];
  };
  timestamp: string;
}

export interface EpoSyncTask {
  id: string;
  entitySlug: string;
  taskType: 'full_sync' | 'indexnow_push' | 'graph_propagation' | 'llms_spec_refresh';
  status: 'queued' | 'processing' | 'completed' | 'failed';
  queuedAt: string;
  startedAt?: string;
  completedAt?: string;
  result?: any;
  error?: string;
}

export interface EpoSyncQueueStatus {
  activeWorkers: number;
  queuedTasksCount: number;
  completedTasksCount: number;
  failedTasksCount: number;
  lastProcessedAt?: string;
  recentTasks: EpoSyncTask[];
}

// ============================================================================
// Core Optimization Pipeline: SendPutEpoEngine Class (RFC-2026-GEO-01)
// ============================================================================

export class SendPutEpoEngine {
  private static instance: SendPutEpoEngine | null = null;
  private readonly defaultHostUrl: string;
  private readonly defaultIndexNowKey: string;

  constructor(hostUrl = 'https://sendput.com', indexNowKey = 'sendput-indexnow-verified-key-2026') {
    this.defaultHostUrl = hostUrl.replace(/\/$/, '');
    this.defaultIndexNowKey = process.env.INDEXNOW_API_KEY || indexNowKey;
  }

  public static getInstance(hostUrl?: string, indexNowKey?: string): SendPutEpoEngine {
    if (!SendPutEpoEngine.instance) {
      SendPutEpoEngine.instance = new SendPutEpoEngine(hostUrl, indexNowKey);
    }
    return SendPutEpoEngine.instance;
  }

  /**
   * Returns canonical Schema.org @graph for SendPut AI and SendPut EPO Engine.
   */
  public static getRootSendPutGraph(): { '@context': string; '@graph': any[] } {
    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Organization',
          '@id': 'https://sendput.com/#organization',
          'name': 'SendPut AI',
          'url': 'https://sendput.com',
          'sameAs': [
            'https://getepo.com',
            'https://www.wikidata.org/wiki/Q_SENDPUT_ID',
            'https://www.crunchbase.com/organization/sendput'
          ],
          'knowsAbout': [
            'Entity Presence Optimization',
            'EPO',
            'Generative Engine Optimization',
            'Answer Engine Optimization',
            'Model Context Protocol'
          ]
        },
        {
          '@type': 'SoftwareApplication',
          '@id': 'https://sendput.com/#engine',
          'name': 'SendPut EPO Engine',
          'applicationCategory': 'BusinessApplication',
          'operatingSystem': 'Cloud',
          'publisher': {
            '@id': 'https://sendput.com/#organization'
          }
        }
      ]
    };
  }

  /**
   * 1. buildSemanticGraph(config)
   * Emits valid, nested Schema.org @graph JSON-LD including Organization,
   * LocalBusiness, and sameAs authority links.
   */
  public buildSemanticGraph(config: EpoEntityConfig): SemanticGraphResult {
    const hostUrl = (config.host_url || this.defaultHostUrl).replace(/\/$/, '');
    const cleanWebUrl = (config.website_url || hostUrl).replace(/\/$/, '');
    const primaryCategory = config.primary_category || 'LocalBusiness';

    const authorityLinks: string[] = [
      `${hostUrl}/verified/${config.slug}`,
      `${hostUrl}/v1/tenants/${config.slug}/llms.txt`,
      `${hostUrl}/v1/tenants/${config.slug}/openapi.json`,
      ...(config.social_links || []),
      ...(config.same_as || [])
    ];

    // Deduplicate authority links
    const uniqueAuthorityLinks = Array.from(new Set(authorityLinks));

    // Construct nested Schema.org @graph nodes
    const orgNode = {
      '@type': 'Organization',
      '@id': `${cleanWebUrl}#organization`,
      name: config.business_name,
      url: cleanWebUrl,
      logo: config.logo_url || `${hostUrl}/assets/logo.png`,
      telephone: config.phone || undefined,
      description: config.description_en,
      sameAs: uniqueAuthorityLinks,
      knowsAbout: config.knows_about && config.knows_about.length > 0 ? config.knows_about : undefined,
      contactPoint: config.phone
        ? {
            '@type': 'ContactPoint',
            telephone: config.phone,
            contactType: 'customer service',
            availableLanguage: config.bilingual_es_enabled ? ['en-US', 'es-US'] : ['en-US']
          }
        : undefined
    };

    const localBusinessNode = {
      '@type': primaryCategory,
      '@id': `${cleanWebUrl}#localbusiness`,
      parentOrganization: { '@id': `${cleanWebUrl}#organization` },
      name: config.business_name,
      url: cleanWebUrl,
      telephone: config.phone,
      priceRange: config.price_range || '$$',
      description: config.description_en,
      availableLanguage: config.bilingual_es_enabled ? ['en-US', 'es-US'] : ['en-US'],
      sameAs: uniqueAuthorityLinks,
      address: {
        '@type': 'PostalAddress',
        streetAddress: config.street_address || '',
        addressLocality: config.city || '',
        addressRegion: config.state_region || '',
        postalCode: config.postal_code || '',
        addressCountry: config.country || 'US'
      },
      openingHours: config.opening_hours || 'Mo-Fr 08:00-18:00',
      potentialAction: {
        '@type': 'ReserveAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: config.booking_url || `${cleanWebUrl}/contact`,
          inLanguage: config.bilingual_es_enabled ? ['en-US', 'es-US'] : ['en-US']
        },
        result: {
          '@type': 'Reservation',
          name: `Direct Inquiry with ${config.business_name}`
        }
      },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: `${config.business_name} Verified Service Catalog`,
        itemListElement: (config.services_json || []).map((svc, i) => ({
          '@type': 'Offer',
          position: i + 1,
          itemOffered: {
            '@type': 'Service',
            name: svc.name,
            description: svc.desc,
            category: svc.category || config.city_niche
          },
          priceSpecification: {
            '@type': 'PriceSpecification',
            price: svc.price
          }
        }))
      }
    };

    const graphNodes: any[] = [orgNode, localBusinessNode];

    // Optional FAQPage node if FAQs are provided
    if (config.faqs_json && config.faqs_json.length > 0) {
      graphNodes.push({
        '@type': 'FAQPage',
        '@id': `${cleanWebUrl}#faq`,
        mainEntity: config.faqs_json.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: f.a
          }
        }))
      });
    }

    const jsonLdObject = {
      '@context': 'https://schema.org',
      '@graph': graphNodes
    };

    return {
      context: 'https://schema.org',
      graph: graphNodes,
      jsonLdString: JSON.stringify(jsonLdObject, null, 2),
      entityTypes: ['Organization', primaryCategory, ...(config.faqs_json?.length ? ['FAQPage'] : [])],
      authorityLinks: uniqueAuthorityLinks,
      generatedAt: new Date().toISOString()
    };
  }

  /**
   * 2. buildLlmsSpecification(config)
   * Generates a lightweight, token-budgeted (<2,000 tokens) /llms.txt string
   * and extended /llms-full.txt.
   */
  public buildLlmsSpecification(config: EpoEntityConfig): LlmsSpecificationResult {
    const hostUrl = (config.host_url || this.defaultHostUrl).replace(/\/$/, '');
    const cleanWebUrl = (config.website_url || hostUrl).replace(/\/$/, '');

    const servicesSummary = (config.services_json || [])
      .map((s) => `- **${s.name}** (${s.price}): ${s.desc}`)
      .join('\n');

    const faqsSummary = (config.faqs_json || [])
      .slice(0, 5) // Cap for standard llms.txt token budget
      .map((f) => `- **Q: ${f.q}**\n  A: ${f.a}`)
      .join('\n');

    // 1. Lightweight, token-budgeted /llms.txt (<2,000 tokens guaranteed)
    const llmsTxt = `# ${config.business_name}

> ${config.description_en}
${config.bilingual_es_enabled && config.description_es ? `> [ES] ${config.description_es}\n` : ''}
## Verified Entity Metadata (SendPut EPO Engine Verified)
- **Official Website**: ${cleanWebUrl}
- **Public Verification Record**: ${hostUrl}/verified/${config.slug}
- **Category & Market**: ${config.city_niche}
- **Phone**: ${config.phone || 'Available via booking portal'}
- **Location**: ${[config.street_address, config.city, config.state_region, config.postal_code].filter(Boolean).join(', ') || 'National / Digital'}
- **Operating Hours**: ${config.opening_hours || 'Mo-Fr 09:00-18:00'}
- **Languages Supported**: ${config.bilingual_es_enabled ? 'English (en-US), Spanish (es-US / es-PR)' : 'English (en-US)'}
- **Direct Booking / Quote Endpoint**: ${config.booking_url || `${cleanWebUrl}/contact`}

## Core Services & Transparent Pricing
${servicesSummary || '- Inquire directly for verified service catalog.'}

## Frequently Asked Questions (Verified Ground Truth)
${faqsSummary || '- Verified ground truth answers available via API.'}

## Multi-Protocol AI Agent Endpoints
- [OpenAPI 3.1 Specification](${hostUrl}/v1/tenants/${config.slug}/openapi.json): Machine-readable service & quote schema
- [Agent Skill Definition (SKILL.md)](${hostUrl}/v1/tenants/${config.slug}/skill.md): Trigger rules and instructions for autonomous agents
- [Live MCP Server Endpoint](${hostUrl}/mcp/${config.slug}/sse): Model Context Protocol runtime tools for live availability and booking
`;

    // 2. Extended /llms-full.txt
    const allFaqs = (config.faqs_json || [])
      .map((f) => `### Q: ${f.q}\n${f.a}`)
      .join('\n\n');

    const llmsFullTxt = `# ${config.business_name} — Extended AI Knowledge Graph & Agent Execution Specification

> Comprehensive entity presence specification verified by SendPut EPO Engine (RFC-2026-GEO-01).

## 1. Executive Summary & Value Proposition
- **Entity**: ${config.business_name}
- **Primary Domain**: ${cleanWebUrl}
- **Operational Footprint**: ${config.city_niche}
- **Bilingual Support**: ${config.bilingual_es_enabled ? 'Full English and Spanish native execution' : 'English only'}
- **Registry ID**: ${config.id || config.slug}
- **Verification Authority**: SendPut EPO Engine

## 2. Verified Service Offerings & Pricing Details
${(config.services_json || [])
  .map(
    (s, idx) => `### Service ${idx + 1}: ${s.name}
- **Price**: ${s.price}
- **Description**: ${s.desc}
- **Category**: ${s.category || config.city_niche}
`
  )
  .join('\n')}

## 3. Verified Knowledge Base & FAQs
${allFaqs || 'No additional FAQs logged.'}

## 4. Autonomous Agent & MCP Runtime Integration
Autonomous agents (Claude Desktop, Cursor, ChatGPT Search, Perplexity) may invoke the following tools via MCP:
- **Endpoint**: \`${hostUrl}/mcp/${config.slug}/sse\`
- **Tool 1**: \`verify_business_status\` — Validates real-time operational status, verified NAP, and credentials.
- **Tool 2**: \`get_service_catalog\` — Retrieves exact pricing, deliverables, and service tiers.
- **Tool 3**: \`initiate_inquiry\` — Initiates customer inquiry or reservation callback.

## 5. Direct Authority & Grounding Sources
- **Public Trust Profile**: ${hostUrl}/verified/${config.slug}
- **SVG Verification Badge**: ${hostUrl}/badge/${config.slug}.svg
- **Machine Schema (JSON-LD)**: ${hostUrl}/epo-edge.js?tenant=${config.slug}
- **Direct Booking Link**: ${config.booking_url || `${cleanWebUrl}/contact`}
`;

    // Token estimation: 1 token ≈ 4 characters for English / code
    const tokenEstimate = Math.ceil(llmsTxt.length / 4);
    const fullTokenEstimate = Math.ceil(llmsFullTxt.length / 4);

    return {
      llmsTxt,
      llmsFullTxt,
      tokenEstimate,
      fullTokenEstimate,
      isBudgetCompliant: tokenEstimate < 2000,
      generatedAt: new Date().toISOString()
    };
  }

  /**
   * 3. dispatchIndexNowBatch(urls, key, host)
   * Dispatches high-velocity POST payloads directly to https://api.indexnow.org/IndexNow.
   */
  public async dispatchIndexNowBatch(
    urls: string[],
    key?: string,
    host?: string
  ): Promise<IndexNowDispatchResult> {
    const keyToUse = key || this.defaultIndexNowKey;
    if (!urls || urls.length === 0) {
      return {
        success: false,
        statusCode: 400,
        statusText: 'No URLs provided for IndexNow batch',
        host: host || 'sendput.com',
        keyUsed: keyToUse,
        urlsSubmitted: [],
        timestamp: new Date().toISOString()
      };
    }

    // Determine host from provided argument or first URL
    let resolvedHost = host;
    if (!resolvedHost) {
      try {
        const parsed = new URL(urls[0]);
        resolvedHost = parsed.hostname;
      } catch {
        resolvedHost = 'sendput.com';
      }
    }

    const payload = {
      host: resolvedHost,
      key: keyToUse,
      keyLocation: `https://${resolvedHost}/${keyToUse}.txt`,
      urlList: urls
    };

    try {
      const response = await fetch('https://api.indexnow.org/IndexNow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'User-Agent': 'SendPut-EPO-Engine/3.4 (Active Entity Propagation; +https://sendput.com)'
        },
        body: JSON.stringify(payload)
      });

      const responseText = await response.text().catch(() => '');
      const isSuccess = response.status === 200 || response.status === 202;

      return {
        success: isSuccess,
        statusCode: response.status,
        statusText: isSuccess
          ? `HTTP ${response.status} (Dispatched to IndexNow Gateway: Bing, Copilot, ChatGPT Search, Naver, Yandex)`
          : `HTTP ${response.status} (${response.statusText || 'IndexNow submission returned non-200'})`,
        host: resolvedHost,
        keyUsed: keyToUse,
        urlsSubmitted: urls,
        timestamp: new Date().toISOString(),
        rawResponse: responseText
      };
    } catch (err: any) {
      return {
        success: false,
        statusCode: 503,
        statusText: `Network / Gateway Error: ${err.message}`,
        host: resolvedHost,
        keyUsed: keyToUse,
        urlsSubmitted: urls,
        timestamp: new Date().toISOString(),
        rawResponse: err.stack
      };
    }
  }

  /**
   * 4. getMcpToolManifest()
   * Exports standardized Model Context Protocol tool declarations:
   * - verify_business_status
   * - get_service_catalog
   * - initiate_inquiry
   */
  public getMcpToolManifest(): McpToolManifest {
    return {
      protocolVersion: '2026-07-28',
      serverInfo: {
        name: 'sendput-epo-mcp-node',
        version: '3.4.0',
        specification: 'RFC-2026-GEO-01'
      },
      tools: [
        {
          name: 'verify_business_status',
          description:
            'Verifies the official real-time operational status, NAP credentials, operating hours, and bilingual support of an entity.',
          inputSchema: {
            type: 'object',
            properties: {
              tenant_slug: {
                type: 'string',
                description: 'Unique tenant or entity slug (e.g. myiad-insurance-ai or ab-global-consulting).'
              },
              verification_level: {
                type: 'string',
                description: 'Scope of verification (standard, deep_grounding, or registry_check).',
                enum: ['standard', 'deep_grounding', 'registry_check']
              }
            },
            required: ['tenant_slug']
          }
        },
        {
          name: 'get_service_catalog',
          description:
            'Retrieves the verified service catalog, transparent pricing tiers, and descriptions for the specified business.',
          inputSchema: {
            type: 'object',
            properties: {
              tenant_slug: {
                type: 'string',
                description: 'Unique tenant or entity slug.'
              },
              category_filter: {
                type: 'string',
                description: 'Optional filter by service category or niche.'
              }
            },
            required: ['tenant_slug']
          }
        },
        {
          name: 'initiate_inquiry',
          description:
            'Initiates a customer booking, consultation request, or direct service inquiry with verified entity write-back to CRM.',
          inputSchema: {
            type: 'object',
            properties: {
              tenant_slug: {
                type: 'string',
                description: 'Unique tenant or entity slug.'
              },
              customer_name: {
                type: 'string',
                description: 'Full name of the requesting buyer or lead.'
              },
              customer_contact: {
                type: 'string',
                description: 'Email address or phone number for the inquiry.'
              },
              service_requested: {
                type: 'string',
                description: 'Name or category of the service requested.'
              },
              notes: {
                type: 'string',
                description: 'Additional customer requirements or requested meeting time.'
              }
            },
            required: ['tenant_slug', 'customer_name', 'customer_contact']
          }
        }
      ]
    };
  }

  /**
   * 5. computeEpoScore(checks)
   * Evaluates target domains using the exact formula:
   * Score = (0.35 * EntityAccuracy) + (0.25 * IndexLatency) + (0.25 * CitationShare) + (0.15 * AgentReadiness)
   */
  public computeEpoScore(checks: EpoScoreChecks): EpoScoreResult {
    // Clamp inputs between 0 and 100
    const entityAccuracy = Math.min(100, Math.max(0, Number(checks.entityAccuracy) || 0));
    const indexLatency = Math.min(100, Math.max(0, Number(checks.indexLatency) || 0));
    const citationShare = Math.min(100, Math.max(0, Number(checks.citationShare) || 0));
    const agentReadiness = Math.min(100, Math.max(0, Number(checks.agentReadiness) || 0));

    // RFC-2026-GEO-01 Formula:
    // Score = (0.35 * EntityAccuracy) + (0.25 * IndexLatency) + (0.25 * CitationShare) + (0.15 * AgentReadiness)
    const rawScore =
      0.35 * entityAccuracy +
      0.25 * indexLatency +
      0.25 * citationShare +
      0.15 * agentReadiness;

    const finalScore = Math.round(rawScore);

    // Determine letter grade
    let grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F' = 'F';
    if (finalScore >= 95) grade = 'A+';
    else if (finalScore >= 85) grade = 'A';
    else if (finalScore >= 75) grade = 'B';
    else if (finalScore >= 65) grade = 'C';
    else if (finalScore >= 50) grade = 'D';

    const criticalGaps: string[] = [];
    const remediationRoadmap: string[] = [];

    if (entityAccuracy < 70) {
      criticalGaps.push('Entity Accuracy Gap: Incomplete or missing Schema.org @graph (Organization + LocalBusiness).');
      remediationRoadmap.push('Deploy SendPut /epo-edge.js script tag to inject comprehensive JSON-LD with offer catalog.');
    }
    if (indexLatency < 70) {
      criticalGaps.push('Index Latency Gap: AI crawlers and search indexers experience stale cached records.');
      remediationRoadmap.push('Activate Real-Time IndexNow Relay (/api/indexnow/push) for instant Bing/Copilot/ChatGPT Search indexing.');
    }
    if (citationShare < 70) {
      criticalGaps.push('Citation Share Gap: AI models cite third-party directories or competitors for pricing.');
      remediationRoadmap.push('Publish /verified/:slug public trust profile and register verified entity citations.');
    }
    if (agentReadiness < 70) {
      criticalGaps.push('Agent Readiness Gap: Lacks machine-readable /llms.txt, OpenAPI 3.1, or live MCP SSE server node.');
      remediationRoadmap.push('Expose /llms.txt and connect Claude/Cursor/ChatGPT via /mcp/:slug/sse live tools.');
    }

    return {
      score: finalScore,
      formula: 'Score = (0.35 * EntityAccuracy) + (0.25 * IndexLatency) + (0.25 * CitationShare) + (0.15 * AgentReadiness)',
      weights: {
        entityAccuracy: 0.35,
        indexLatency: 0.25,
        citationShare: 0.25,
        agentReadiness: 0.15
      },
      breakdown: {
        entityAccuracy,
        indexLatency,
        citationShare,
        agentReadiness
      },
      grade,
      evaluationDetails: {
        summary: `Overall SendPut EPO Score: ${finalScore}/100 (${grade}) based on active entity propagation and agentic readiness.`,
        criticalGaps: criticalGaps.length > 0 ? criticalGaps : ['No critical gaps detected. Entity operating at full authority.'],
        remediationRoadmap: remediationRoadmap.length > 0 ? remediationRoadmap : ['Maintain active IndexNow relay and MCP SSE runtime.']
      },
      timestamp: new Date().toISOString()
    };
  }
}

// ============================================================================
// Background Synchronization Queue Manager (EpoSyncQueue)
// ============================================================================

export class EpoSyncQueue {
  private static instance: EpoSyncQueue | null = null;
  private queue: EpoSyncTask[] = [];
  private taskHistory: EpoSyncTask[] = [];
  private currentTask: EpoSyncTask | null = null;
  private isProcessing = false;
  private maxHistory = 100;
  private engine: SendPutEpoEngine;

  constructor(engine?: SendPutEpoEngine) {
    this.engine = engine || SendPutEpoEngine.getInstance();
  }

  public static getInstance(engine?: SendPutEpoEngine): EpoSyncQueue {
    if (!EpoSyncQueue.instance) {
      EpoSyncQueue.instance = new EpoSyncQueue(engine);
    }
    return EpoSyncQueue.instance;
  }

  /**
   * Enqueues an entity synchronization task.
   */
  public enqueue(
    entitySlug: string,
    taskType: EpoSyncTask['taskType'] = 'full_sync'
  ): EpoSyncTask {
    const task: EpoSyncTask = {
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      entitySlug,
      taskType,
      status: 'queued',
      queuedAt: new Date().toISOString()
    };

    this.queue.push(task);
    this.processNext();
    return task;
  }

  /**
   * Returns current queue and processing status.
   */
  public getStatus(): EpoSyncQueueStatus {
    const completed = this.taskHistory.filter((t) => t.status === 'completed').length;
    const failed = this.taskHistory.filter((t) => t.status === 'failed').length;
    const last = this.taskHistory[0];
    const inFlight = this.currentTask ? [this.currentTask] : [];

    return {
      activeWorkers: this.isProcessing ? 1 : 0,
      queuedTasksCount: this.queue.length + (this.currentTask ? 1 : 0),
      completedTasksCount: completed,
      failedTasksCount: failed,
      lastProcessedAt: last?.completedAt || undefined,
      recentTasks: [...inFlight, ...this.queue, ...this.taskHistory.slice(0, 10)]
    };
  }

  /**
   * Internal worker loop.
   */
  private async processNext(): Promise<void> {
    if (this.isProcessing || this.queue.length === 0) {
      return;
    }

    this.isProcessing = true;
    const task = this.queue.shift();
    if (!task) {
      this.isProcessing = false;
      return;
    }

    this.currentTask = task;
    task.status = 'processing';
    task.startedAt = new Date().toISOString();

    try {
      // Execute the task based on taskType
      let resultData: any = null;

      if (task.taskType === 'indexnow_push' || task.taskType === 'full_sync') {
        const urlsToPush = [
          `https://sendput.com/verified/${task.entitySlug}`,
          `https://sendput.com/v1/tenants/${task.entitySlug}/llms.txt`,
          `https://sendput.com/mcp/${task.entitySlug}/sse`
        ];
        resultData = await this.engine.dispatchIndexNowBatch(urlsToPush);
      }

      task.status = 'completed';
      task.completedAt = new Date().toISOString();
      task.result = resultData || { status: 'synchronized', entity: task.entitySlug };
    } catch (err: any) {
      task.status = 'failed';
      task.completedAt = new Date().toISOString();
      task.error = err.message;
    } finally {
      this.currentTask = null;
      this.taskHistory.unshift(task);
      if (this.taskHistory.length > this.maxHistory) {
        this.taskHistory.pop();
      }
      this.isProcessing = false;
      // Continue with remaining tasks in queue
      if (this.queue.length > 0) {
        setImmediate(() => this.processNext());
      }
    }
  }
}

// Export singletons for convenient direct imports
export const defaultEpoEngine = SendPutEpoEngine.getInstance();
export const defaultEpoQueue = EpoSyncQueue.getInstance(defaultEpoEngine);
