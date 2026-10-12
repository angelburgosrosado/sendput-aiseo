// ==============================================================================
// SignalForge - Provider Adapter Interfaces & Contracts
// Compliance: Licensed APIs, customer-authorized streams, strict robots.txt adherence
// ==============================================================================

export type ProviderId =
  | "GOOGLE_SEARCH_CONSOLE"
  | "GOOGLE_ANALYTICS_4"
  | "GOOGLE_BUSINESS_PROFILE"
  | "BING_WEBMASTER"
  | "DATAFORSEO"
  | "SERPAPI"
  | "LICENSED_CRAWLER"
  | "SYNTHETIC_MODELED";

export interface ProviderCredentials {
  apiKey?: string;
  clientId?: string;
  clientSecret?: string;
  refreshToken?: string;
  accessToken?: string;
  endpoint?: string;
}

export interface ConnectionStatusResult {
  connected: boolean;
  provider: ProviderId;
  latencyMs: number;
  rateLimitRemaining?: number;
  rateLimitResetSec?: number;
  lastSync?: string;
  error?: string;
  isSimulated?: boolean;
}

export interface RobotsTxtCheckResult {
  allowed: boolean;
  userAgent: string;
  matchingRule?: string;
  crawlDelaySec?: number;
  sitemapUrls: string[];
  reason: string;
}

export interface KeywordMetricResult {
  term: string;
  searchVolume: number;
  difficultyScore: number; // 0-100
  cpc: number;
  intent: "INFORMATIONAL" | "COMMERCIAL" | "TRANSACTIONAL" | "NAVIGATIONAL";
  sfaiImpactEstimate: number;
  confidenceScore: number;
  isModeled: boolean;
  provider: ProviderId;
}

export interface SerpObservationResult {
  term: string;
  date: string;
  position: number;
  previousPosition?: number;
  url: string;
  features: string[]; // e.g. ["ai_overview", "featured_snippet", "people_also_ask"]
  topCompetitors: Array<{
    position: number;
    domain: string;
    title: string;
  }>;
  isModeled: boolean;
}

export interface AIQueryVisibilityResult {
  prompt: string;
  engine: "CHATGPT" | "PERPLEXITY" | "CLAUDE" | "GEMINI" | "COPILOT";
  date: string;
  isCited: boolean;
  citationRank?: number;
  citedUrl?: string;
  sentimentScore: number; // -1.0 to 1.0
  contextSnippet: string;
  shareOfVoicePercent: number;
  isModeled: boolean;
}

export interface CrawlPageResult {
  url: string;
  statusCode: number;
  title?: string;
  h1?: string;
  wordCount: number;
  loadTimeMs: number;
  metaRobots: string;
  canonicalUrl?: string;
  hasSsl: boolean;
  robotsTxtCompliant: boolean;
}
