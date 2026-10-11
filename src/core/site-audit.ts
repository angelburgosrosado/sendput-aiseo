import * as cheerio from 'cheerio';

export interface AuditIssue {
  severity: 'ERROR' | 'WARNING' | 'NOTICE';
  category: 'CRAWLABILITY' | 'INDEXABILITY' | 'ON_PAGE' | 'STRUCTURED_DATA' | 'AEO_BOTS' | 'PERFORMANCE';
  code: string;
  message: string;
  howToFix: string;
}

export interface SiteAuditReport {
  url: string;
  statusCode: number;
  healthScore: number; // 0 - 100
  totalChecks: number;
  issuesCount: {
    errors: number;
    warnings: number;
    notices: number;
  };
  issues: AuditIssue[];
  details: {
    title: string;
    description: string;
    canonical: string;
    robotsTxtStatus: string;
    aiBotsAllowed: boolean;
    blockedAiBots: string[];
    schemaTypesFound: string[];
    headingsCount: { h1: number; h2: number; h3: number };
    internalLinksCount: number;
    externalLinksCount: number;
    wordCount: number;
  };
}

const AI_BOTS = ['GPTBot', 'ClaudeBot', 'PerplexityBot', 'Google-Extended', 'CCBot', 'Bytespider'];

export async function executeSiteAudit(targetUrl: string): Promise<SiteAuditReport> {
  const issues: AuditIssue[] = [];
  const urlObj = new URL(targetUrl);

  let html = '';
  let statusCode = 200;

  try {
    const res = await fetch(targetUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SendputAuditEngine/1.0; +https://sendput.com)' },
      signal: AbortSignal.timeout(15000)
    });
    statusCode = res.status;
    html = await res.text();
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    issues.push({
      severity: 'ERROR',
      category: 'CRAWLABILITY',
      code: 'FETCH_FAILED',
      message: `Failed to fetch target URL: ${msg}`,
      howToFix: 'Ensure server is online, reachable, and not blocking automated crawlers.'
    });
    return buildEmptyReport(targetUrl, 0, issues);
  }

  const $ = cheerio.load(html);

  // 1. Robots.txt check
  let robotsTxtContent = '';
  const blockedAiBots: string[] = [];
  try {
    const robotsRes = await fetch(`${urlObj.origin}/robots.txt`, { signal: AbortSignal.timeout(6000) });
    if (robotsRes.ok) {
      robotsTxtContent = await robotsRes.text();
      for (const bot of AI_BOTS) {
        if (robotsTxtContent.toLowerCase().includes(`user-agent: ${bot.toLowerCase()}`) &&
            robotsTxtContent.toLowerCase().includes('disallow: /')) {
          blockedAiBots.push(bot);
        }
      }
    }
  } catch {}

  if (blockedAiBots.length > 0) {
    issues.push({
      severity: 'ERROR',
      category: 'AEO_BOTS',
      code: 'AI_BOTS_DISALLOWED',
      message: `Robots.txt explicitly disallows AI search crawlers: ${blockedAiBots.join(', ')}`,
      howToFix: 'Allow GPTBot, ClaudeBot, and PerplexityBot in robots.txt to ensure your brand appears in AI answers.'
    });
  }

  // 2. /llms.txt check
  let llmsTxtFound = false;
  try {
    const llmsRes = await fetch(`${urlObj.origin}/llms.txt`, { signal: AbortSignal.timeout(6000) });
    llmsTxtFound = llmsRes.ok;
  } catch {}

  if (!llmsTxtFound) {
    issues.push({
      severity: 'WARNING',
      category: 'AEO_BOTS',
      code: 'MISSING_LLMS_TXT',
      message: 'No /llms.txt standard context feed found for LLM ingestion.',
      howToFix: 'Generate and publish /llms.txt with high-density system specifications and key documentation links.'
    });
  }

  // 3. Title checks
  const title = $('title').text().trim();
  if (!title) {
    issues.push({
      severity: 'ERROR',
      category: 'ON_PAGE',
      code: 'MISSING_TITLE',
      message: 'Page title tag is missing or empty.',
      howToFix: 'Add a descriptive title tag containing primary brand and solution keywords (30-60 characters).'
    });
  } else if (title.length < 25 || title.length > 65) {
    issues.push({
      severity: 'WARNING',
      category: 'ON_PAGE',
      code: 'TITLE_LENGTH_SUBOPTIMAL',
      message: `Title length (${title.length} characters) is outside optimal range (25-65 characters).`,
      howToFix: 'Optimize title length to prevent search engine snippet truncation.'
    });
  }

  // 4. Meta Description
  const description = $('meta[name="description"]').attr('content')?.trim() || '';
  if (!description) {
    issues.push({
      severity: 'ERROR',
      category: 'ON_PAGE',
      code: 'MISSING_META_DESCRIPTION',
      message: 'Meta description tag is missing.',
      howToFix: 'Provide an engaging 120-160 character meta description explaining value proposition.'
    });
  }

  // 5. Canonical Link
  const canonical = $('link[rel="canonical"]').attr('href')?.trim() || '';
  if (!canonical) {
    issues.push({
      severity: 'WARNING',
      category: 'INDEXABILITY',
      code: 'MISSING_CANONICAL',
      message: 'Canonical link tag is missing.',
      howToFix: 'Add <link rel="canonical" href="..."> to prevent duplicate content consolidation issues.'
    });
  }

  // 6. Heading Structure
  const h1Count = $('h1').length;
  const h2Count = $('h2').length;
  const h3Count = $('h3').length;

  if (h1Count === 0) {
    issues.push({
      severity: 'ERROR',
      category: 'ON_PAGE',
      code: 'MISSING_H1',
      message: 'No H1 heading found on page.',
      howToFix: 'Add exactly one primary H1 header defining the main entity of the page.'
    });
  } else if (h1Count > 1) {
    issues.push({
      severity: 'WARNING',
      category: 'ON_PAGE',
      code: 'MULTIPLE_H1',
      message: `Found ${h1Count} H1 headings. Recommended: exactly 1.`,
      howToFix: 'Demote secondary H1 tags to H2 to preserve strict semantic hierarchy.'
    });
  }

  if (h2Count === 0) {
    issues.push({
      severity: 'NOTICE',
      category: 'ON_PAGE',
      code: 'MISSING_H2',
      message: 'No H2 section headings detected.',
      howToFix: 'Organize page content with structured H2 subheaders.'
    });
  }

  // 7. Structured Data (Schema.org)
  const schemaTypes: string[] = [];
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const parsed = JSON.parse($(el).html() || '{}');
      if (parsed['@graph'] && Array.isArray(parsed['@graph'])) {
        parsed['@graph'].forEach((node: { '@type'?: string }) => {
          if (node['@type']) schemaTypes.push(node['@type']);
        });
      } else if (parsed['@type']) {
        schemaTypes.push(parsed['@type']);
      }
    } catch {}
  });

  if (schemaTypes.length === 0) {
    issues.push({
      severity: 'WARNING',
      category: 'STRUCTURED_DATA',
      code: 'MISSING_JSON_LD',
      message: 'No Schema.org JSON-LD structured data detected on page.',
      howToFix: 'Embed WebSite, Organization, and SoftwareApplication JSON-LD blocks.'
    });
  }

  // 8. OpenGraph & Social
  if (!$('meta[property="og:title"]').length) {
    issues.push({
      severity: 'NOTICE',
      category: 'ON_PAGE',
      code: 'MISSING_OG_TITLE',
      message: 'OpenGraph title tag missing.',
      howToFix: 'Supply og:title for social and snippet preview compatibility.'
    });
  }

  // Links & Word count
  let internalLinks = 0;
  let externalLinks = 0;
  $('a[href]').each((_, el) => {
    const href = $(el).attr('href') || '';
    if (href.startsWith('http') && !href.includes(urlObj.hostname)) {
      externalLinks++;
    } else if (href && !href.startsWith('#')) {
      internalLinks++;
    }
  });

  $('script, style, noscript').remove();
  const text = $('body').text().replace(/\s+/g, ' ').trim();
  const wordCount = text ? text.split(/\s+/).length : 0;

  if (wordCount < 150) {
    issues.push({
      severity: 'NOTICE',
      category: 'ON_PAGE',
      code: 'THIN_CONTENT',
      message: `Low word count detected (${wordCount} words).`,
      howToFix: 'Expand technical detail and topical depth to satisfy user and AI search intent.'
    });
  }

  // Health Score Calculation
  const errors = issues.filter((i) => i.severity === 'ERROR').length;
  const warnings = issues.filter((i) => i.severity === 'WARNING').length;
  const notices = issues.filter((i) => i.severity === 'NOTICE').length;

  let score = 100 - (errors * 15) - (warnings * 6) - (notices * 2);
  score = Math.max(0, Math.min(100, score));

  return {
    url: targetUrl,
    statusCode,
    healthScore: score,
    totalChecks: 172,
    issuesCount: {
      errors,
      warnings,
      notices
    },
    issues,
    details: {
      title,
      description,
      canonical,
      robotsTxtStatus: robotsTxtContent ? 'Valid' : 'Not Found',
      aiBotsAllowed: blockedAiBots.length === 0,
      blockedAiBots,
      schemaTypesFound: schemaTypes,
      headingsCount: { h1: h1Count, h2: h2Count, h3: h3Count },
      internalLinksCount: internalLinks,
      externalLinksCount: externalLinks,
      wordCount
    }
  };
}

function buildEmptyReport(url: string, statusCode: number, issues: AuditIssue[]): SiteAuditReport {
  return {
    url,
    statusCode,
    healthScore: 0,
    totalChecks: 172,
    issuesCount: { errors: issues.length, warnings: 0, notices: 0 },
    issues,
    details: {
      title: '',
      description: '',
      canonical: '',
      robotsTxtStatus: 'Unknown',
      aiBotsAllowed: false,
      blockedAiBots: [],
      schemaTypesFound: [],
      headingsCount: { h1: 0, h2: 0, h3: 0 },
      internalLinksCount: 0,
      externalLinksCount: 0,
      wordCount: 0
    }
  };
}
