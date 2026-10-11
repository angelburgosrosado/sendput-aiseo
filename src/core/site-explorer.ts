export interface BacklinkItem {
  referringDomain: string;
  sourceUrl: string;
  targetUrl: string;
  anchorText: string;
  domainRating: number;
  isDofollow: boolean;
  discoveredDate: string;
}

export interface TopPageItem {
  url: string;
  estimatedTraffic: number;
  keywordCount: number;
  topKeyword: string;
}

export interface SiteExplorerResult {
  target: string;
  domainRating: number; // 0 - 100
  urlRating: number;
  backlinksCount: number;
  referringDomainsCount: number;
  dofollowPercentage: number;
  organicKeywordsCount: number;
  estimatedMonthlyOrganicTraffic: number;
  trafficValueUsd: number;
  topPages: TopPageItem[];
  recentBacklinks: BacklinkItem[];
  anchorDistribution: Array<{ anchor: string; count: number; percentage: number }>;
}

export function analyzeSiteExplorer(target: string): SiteExplorerResult {
  const cleanTarget = target.replace(/^https?:\/\//, '').replace(/\/.*$/, '').toLowerCase();

  // Synthetic deterministic algorithmic estimation
  let hash = 0;
  for (let i = 0; i < cleanTarget.length; i++) {
    hash = (hash << 5) - hash + cleanTarget.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const domainRating = Math.min(95, Math.max(12, (absHash % 75) + 15));
  const urlRating = Math.min(100, domainRating + 8);
  const referringDomainsCount = Math.round(domainRating * (25 + (absHash % 40)));
  const backlinksCount = Math.round(referringDomainsCount * (6 + (absHash % 12)));
  const dofollowPercentage = 78 + (absHash % 15);
  const organicKeywordsCount = Math.round(referringDomainsCount * 4.2);
  const estimatedMonthlyOrganicTraffic = Math.round(organicKeywordsCount * 8.5);
  const trafficValueUsd = Math.round(estimatedMonthlyOrganicTraffic * 1.85);

  const topPages: TopPageItem[] = [
    {
      url: `https://${cleanTarget}/`,
      estimatedTraffic: Math.round(estimatedMonthlyOrganicTraffic * 0.45),
      keywordCount: Math.round(organicKeywordsCount * 0.35),
      topKeyword: cleanTarget
    },
    {
      url: `https://${cleanTarget}/docs`,
      estimatedTraffic: Math.round(estimatedMonthlyOrganicTraffic * 0.25),
      keywordCount: Math.round(organicKeywordsCount * 0.2),
      topKeyword: `${cleanTarget} documentation`
    },
    {
      url: `https://${cleanTarget}/telemetry`,
      estimatedTraffic: Math.round(estimatedMonthlyOrganicTraffic * 0.18),
      keywordCount: Math.round(organicKeywordsCount * 0.15),
      topKeyword: 'web telemetry beacon sdk'
    },
    {
      url: `https://${cleanTarget}/llms.txt`,
      estimatedTraffic: Math.round(estimatedMonthlyOrganicTraffic * 0.12),
      keywordCount: Math.round(organicKeywordsCount * 0.1),
      topKeyword: 'llms.txt generator'
    }
  ];

  const recentBacklinks: BacklinkItem[] = [
    {
      referringDomain: 'github.com',
      sourceUrl: `https://github.com/awesome-ai-tools/list`,
      targetUrl: `https://${cleanTarget}/`,
      anchorText: cleanTarget,
      domainRating: 96,
      isDofollow: true,
      discoveredDate: '2026-09-28'
    },
    {
      referringDomain: 'news.ycombinator.com',
      sourceUrl: `https://news.ycombinator.com/item?id=418293`,
      targetUrl: `https://${cleanTarget}/telemetry`,
      anchorText: 'Sendput Telemetry Engine',
      domainRating: 91,
      isDofollow: false,
      discoveredDate: '2026-10-02'
    },
    {
      referringDomain: 'dev.to',
      sourceUrl: `https://dev.to/engineering/modern-aeo-infrastructure`,
      targetUrl: `https://${cleanTarget}/docs`,
      anchorText: 'autonomous information routing',
      domainRating: 84,
      isDofollow: true,
      discoveredDate: '2026-10-05'
    }
  ];

  const anchorDistribution = [
    { anchor: cleanTarget, count: Math.round(backlinksCount * 0.45), percentage: 45 },
    { anchor: 'https://' + cleanTarget, count: Math.round(backlinksCount * 0.22), percentage: 22 },
    { anchor: 'information routing', count: Math.round(backlinksCount * 0.18), percentage: 18 },
    { anchor: 'telemetry engine', count: Math.round(backlinksCount * 0.15), percentage: 15 }
  ];

  return {
    target: cleanTarget,
    domainRating,
    urlRating,
    backlinksCount,
    referringDomainsCount,
    dofollowPercentage,
    organicKeywordsCount,
    estimatedMonthlyOrganicTraffic,
    trafficValueUsd,
    topPages,
    recentBacklinks,
    anchorDistribution
  };
}
