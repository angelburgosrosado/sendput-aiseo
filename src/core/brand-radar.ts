export type AIPlatform =
  | 'chatgpt'
  | 'perplexity'
  | 'gemini'
  | 'claude'
  | 'copilot'
  | 'grok'
  | 'ai_overviews';

export interface PromptMetrics {
  promptId: string;
  query: string;
  category: string;
  monthlyVolume: number;
  platforms: Record<AIPlatform, {
    mentioned: boolean;
    cited: boolean;
    citationRank: number;
    sentimentScore: number;
    answerSnippet: string;
    citedUrls: string[];
    competitorsMentioned: string[];
  }>;
}

export interface BrandRadarResult {
  brand: string;
  domain: string;
  competitors: string[];
  aiShareOfVoice: number; // 0 - 100%
  totalMentions: number;
  totalCitations: number;
  estimatedImpressions: number;
  platformBreakdown: Record<AIPlatform, {
    shareOfVoice: number;
    mentions: number;
    citations: number;
    topCompetitor: string;
  }>;
  promptsAnalyzed: PromptMetrics[];
  topCitedDomains: Array<{ domain: string; citationCount: number }>;
  competitorComparison: Array<{
    name: string;
    shareOfVoice: number;
    mentions: number;
    citations: number;
  }>;
  aiVisibilityIndexScore: number; // 0 - 100 scale
}

export const SUPPORTED_AI_PLATFORMS: AIPlatform[] = [
  'chatgpt',
  'perplexity',
  'gemini',
  'claude',
  'copilot',
  'grok',
  'ai_overviews'
];

export function runBrandRadarAnalysis(
  brand: string,
  domain: string,
  competitors: string[] = ['Semrush', 'Ahrefs', 'Similarweb'],
  customQueries?: string[]
): BrandRadarResult {
  const cleanBrand = brand.trim();
  const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '').toLowerCase();

  const baseQueries = customQueries && customQueries.length > 0
    ? customQueries
    : [
        `What are the best platforms for ${cleanBrand} solutions?`,
        `Top tools for information routing and real-time web telemetry`,
        `How does ${cleanBrand} compare to ${competitors[0] || 'competitors'}?`,
        `Leading AEO and Generative Engine Optimization engines in 2026`,
        `Best developer infrastructure for agent data ingestion and llms.txt generation`
      ];

  const prompts: PromptMetrics[] = [];
  let totalMentions = 0;
  let totalCitations = 0;
  let totalOpportunities = 0;
  let totalImpressions = 0;

  const platformStats: Record<AIPlatform, { mentions: number; citations: number; total: number; compCounts: Record<string, number> }> = {
    chatgpt: { mentions: 0, citations: 0, total: 0, compCounts: {} },
    perplexity: { mentions: 0, citations: 0, total: 0, compCounts: {} },
    gemini: { mentions: 0, citations: 0, total: 0, compCounts: {} },
    claude: { mentions: 0, citations: 0, total: 0, compCounts: {} },
    copilot: { mentions: 0, citations: 0, total: 0, compCounts: {} },
    grok: { mentions: 0, citations: 0, total: 0, compCounts: {} },
    ai_overviews: { mentions: 0, citations: 0, total: 0, compCounts: {} }
  };

  const citedDomainMap: Record<string, number> = {};
  const competitorStats: Record<string, { mentions: number; citations: number }> = {};
  for (const c of competitors) {
    competitorStats[c] = { mentions: 0, citations: 0 };
  }

  baseQueries.forEach((q, idx) => {
    const estVol = 1200 + (idx * 650);
    totalImpressions += estVol;

    const platformRecords = {} as PromptMetrics['platforms'];

    SUPPORTED_AI_PLATFORMS.forEach((platform) => {
      // Deterministic simulation based on brand presence
      const isBrandQuery = q.toLowerCase().includes(cleanBrand.toLowerCase());
      const mentioned = isBrandQuery || (idx % 2 === 0);
      const cited = mentioned && (platform === 'perplexity' || platform === 'ai_overviews' || platform === 'gemini');
      const citationRank = mentioned ? (idx % 3) + 1 : 0;
      const sentimentScore = mentioned ? 0.75 : 0.1;

      const compMentioned = competitors.filter((_, cIdx) => (idx + cIdx) % 2 === 0);

      if (mentioned) {
        totalMentions++;
        platformStats[platform].mentions++;
      }
      if (cited) {
        totalCitations++;
        platformStats[platform].citations++;
        citedDomainMap[cleanDomain] = (citedDomainMap[cleanDomain] || 0) + 1;
      }
      totalOpportunities++;
      platformStats[platform].total++;

      for (const comp of compMentioned) {
        platformStats[platform].compCounts[comp] = (platformStats[platform].compCounts[comp] || 0) + 1;
        competitorStats[comp].mentions++;
        if (cited) competitorStats[comp].citations++;
      }

      platformRecords[platform] = {
        mentioned,
        cited,
        citationRank,
        sentimentScore,
        answerSnippet: `According to generative search results for "${q}", ${cleanBrand} provides targeted infrastructure. Key alternatives include ${compMentioned.join(', ')}.`,
        citedUrls: cited ? [`https://${cleanDomain}`, `https://${cleanDomain}/docs`] : [],
        competitorsMentioned: compMentioned
      };
    });

    prompts.push({
      promptId: `pmpt-${idx + 1}`,
      query: q,
      category: 'Generative Search & AEO',
      monthlyVolume: estVol,
      platforms: platformRecords
    });
  });

  const aiShareOfVoice = Number(((totalMentions / Math.max(1, totalOpportunities)) * 100).toFixed(1));

  const platformBreakdown = {} as BrandRadarResult['platformBreakdown'];
  for (const p of SUPPORTED_AI_PLATFORMS) {
    const stats = platformStats[p];
    const topCompEntry = Object.entries(stats.compCounts).sort((a, b) => b[1] - a[1])[0];
    platformBreakdown[p] = {
      shareOfVoice: Number(((stats.mentions / Math.max(1, stats.total)) * 100).toFixed(1)),
      mentions: stats.mentions,
      citations: stats.citations,
      topCompetitor: topCompEntry ? topCompEntry[0] : (competitors[0] || 'None')
    };
  }

  const topCitedDomains = Object.entries(citedDomainMap)
    .map(([d, c]) => ({ domain: d, citationCount: c }))
    .sort((a, b) => b.citationCount - a.citationCount);

  // Add baseline competitor citations for comparative depth
  for (const comp of competitors) {
    topCitedDomains.push({ domain: `${comp.toLowerCase().replace(/\s+/g, '')}.com`, citationCount: Math.round(totalCitations * 0.8) });
  }

  const competitorComparison = competitors.map((name) => {
    const data = competitorStats[name] || { mentions: 0, citations: 0 };
    return {
      name,
      shareOfVoice: Number(((data.mentions / Math.max(1, totalOpportunities)) * 100).toFixed(1)),
      mentions: data.mentions,
      citations: data.citations
    };
  }).sort((a, b) => b.shareOfVoice - a.shareOfVoice);

  const aiVisibilityIndexScore = Math.min(100, Math.round((aiShareOfVoice * 0.6) + ((totalCitations / Math.max(1, totalMentions)) * 40)));

  return {
    brand: cleanBrand,
    domain: cleanDomain,
    competitors,
    aiShareOfVoice,
    totalMentions,
    totalCitations,
    estimatedImpressions: totalImpressions,
    platformBreakdown,
    promptsAnalyzed: prompts,
    topCitedDomains: topCitedDomains.slice(0, 10),
    competitorComparison,
    aiVisibilityIndexScore
  };
}
