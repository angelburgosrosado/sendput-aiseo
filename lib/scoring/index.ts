// ==============================================================================
// SignalForge - Proprietary Scoring Engines & Intelligence Algorithms
// Note: Entirely original algorithms based on statistical link graph theory,
// citation entropy, and technical health distributions. Non-proprietary to competitors.
// ==============================================================================

export interface SFAIInputs {
  uniqueReferringDomains: number;
  dofollowRatio: number; // 0.0 - 1.0
  averageDomainQuality: number; // 0 - 100
  organicKeywordBreadth: number; // count of ranking terms
  brandSearchEntropy?: number; // 0.0 - 1.0
}

/**
 * SignalForge Authority Index (SFAI)
 * A normalized 0-100 logarithmic composite score that balances domain link diversity,
 * follow equity, and organic index footprint.
 */
export function calculateSFAI(inputs: SFAIInputs): number {
  const {
    uniqueReferringDomains,
    dofollowRatio,
    averageDomainQuality,
    organicKeywordBreadth,
  } = inputs;

  if (uniqueReferringDomains <= 0) return 1.0;

  // Logarithmic scaling of referring domains (diminishing returns beyond 10,000 domains)
  const domainFactor = Math.min(1.0, Math.log10(uniqueReferringDomains + 1) / 4.5);

  // Quality multiplier based on referring domains' collective trust
  const qualityMultiplier = Math.max(0.1, averageDomainQuality / 100);

  // Dofollow equity weight
  const followWeight = 0.6 + dofollowRatio * 0.4;

  // Organic breadth boost (ranking keywords indicates real index recognition)
  const breadthFactor = Math.min(1.0, Math.log10(organicKeywordBreadth + 1) / 5.0);

  // Normalized composite raw score scaled to standard authority distributions
  const rawBase = (domainFactor * 0.6 + breadthFactor * 0.4);
  const composite = rawBase * (qualityMultiplier * 0.7 + 0.3) * followWeight * 115;

  // Bound to 1.0 - 99.8
  return Number(Math.min(99.8, Math.max(1.0, composite)).toFixed(1));
}

export interface DVSInputs {
  recentRankGains: number; // net positions gained
  newTop10Keywords: number;
  serpFeaturesWon: number; // e.g. featured snippets, AI overviews
  lostTop10Keywords: number;
}

/**
 * Discovery Velocity Score (DVS)
 * Tracks the momentum of organic discovery expansion over rolling periods (-100% to +100%).
 */
export function calculateDVS(inputs: DVSInputs): number {
  const { recentRankGains, newTop10Keywords, serpFeaturesWon, lostTop10Keywords } = inputs;

  const positiveMomentum = recentRankGains * 0.4 + newTop10Keywords * 2.5 + serpFeaturesWon * 3.0;
  const negativeFriction = lostTop10Keywords * 3.2;

  const rawDelta = positiveMomentum - negativeFriction;
  // Normalize to -50% to +100% range
  const clamped = Math.max(-50, Math.min(100, rawDelta));
  return Number(clamped.toFixed(1));
}

export interface AICSInputs {
  totalQueryPrompts: number;
  promptsWithCitation: number;
  promptsAsPrimarySource: number;
  enginesMonitoredCount: number;
}

/**
 * AI Citation Share (AICS)
 * Quantifies a brand's discovery share across generative engines (Perplexity, ChatGPT, Claude, etc.)
 */
export function calculateAICS(inputs: AICSInputs): number {
  const { totalQueryPrompts, promptsWithCitation, promptsAsPrimarySource, enginesMonitoredCount } = inputs;
  if (totalQueryPrompts <= 0 || enginesMonitoredCount <= 0) return 0;

  const citationRate = promptsWithCitation / totalQueryPrompts;
  const primaryBonus = (promptsAsPrimarySource / totalQueryPrompts) * 0.35;

  const score = (citationRate * 0.65 + primaryBonus) * 100;
  return Number(Math.min(100, Math.max(0, score)).toFixed(1));
}

export interface THQInputs {
  totalPagesCrawled: number;
  criticalIssues: number; // e.g. 5xx, noindex on canonicals, broken core flows
  highIssues: number;     // e.g. 404s, missing titles, redirect chains
  mediumIssues: number;   // e.g. missing meta, slow LCP
  lowIssues: number;      // e.g. missing alt text
}

/**
 * Technical Health Quotient (THQ)
 * 0-100 score reflecting crawl efficiency, technical hygiene, and indexability.
 */
export function calculateTHQ(inputs: THQInputs): number {
  const { totalPagesCrawled, criticalIssues, highIssues, mediumIssues, lowIssues } = inputs;
  if (totalPagesCrawled <= 0) return 100;

  // Penalties normalized per page ratio
  const criticalPenalty = (criticalIssues * 8.0) / Math.sqrt(totalPagesCrawled);
  const highPenalty = (highIssues * 3.0) / Math.sqrt(totalPagesCrawled);
  const mediumPenalty = (mediumIssues * 1.0) / Math.sqrt(totalPagesCrawled);
  const lowPenalty = (lowIssues * 0.2) / Math.sqrt(totalPagesCrawled);

  const totalDeductions = criticalPenalty + highPenalty + mediumPenalty + lowPenalty;
  const health = 100 - totalDeductions;

  return Number(Math.min(100, Math.max(10, health)).toFixed(1));
}

/**
 * Search Intent Affinity Model
 * Classifies search queries into standard search intents based on syntax cues.
 */
export function classifySearchIntent(term: string): "INFORMATIONAL" | "COMMERCIAL" | "TRANSACTIONAL" | "NAVIGATIONAL" {
  const lower = term.toLowerCase().trim();

  if (/(buy|pricing|price|discount|coupon|deal|order|cheap|subscription|quote|license)/i.test(lower)) {
    return "TRANSACTIONAL";
  }
  if (/(best|top|review|vs|versus|alternative|comparison|software|platform|tool|provider)/i.test(lower)) {
    return "COMMERCIAL";
  }
  if (/(login|sign in|portal|official site|website|app|dashboard|contact)/i.test(lower)) {
    return "NAVIGATIONAL";
  }
  return "INFORMATIONAL";
}
