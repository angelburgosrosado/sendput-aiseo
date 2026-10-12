import { describe, it, expect } from "vitest";
import { BaseDataProviderAdapter } from "@/lib/adapters/base-adapter";
import { providerRegistry, getProviderAdapter } from "@/lib/adapters";

describe("SignalForge Provider Adapters & Ethics Architecture", () => {
  it("masks sensitive secret keys properly for UI security", () => {
    expect(BaseDataProviderAdapter.maskCredential("sk-live-1234567890abcdef")).toBe("sk-l••••••••cdef");
    expect(BaseDataProviderAdapter.maskCredential("")).toBe("Not configured");
    expect(BaseDataProviderAdapter.maskCredential(undefined)).toBe("Not configured");
  });

  it("strictly honors robots.txt disallow and allow directives", () => {
    const robotsTxt = `
User-agent: *
Disallow: /admin/
Disallow: /private/
Allow: /private/public-preview/
Crawl-delay: 5
Sitemap: https://example.com/sitemap.xml
`;

    const blockedCheck = BaseDataProviderAdapter.checkRobotsTxt(robotsTxt, "/admin/settings");
    const allowedCheck = BaseDataProviderAdapter.checkRobotsTxt(robotsTxt, "/blog/article-1");
    const overrideCheck = BaseDataProviderAdapter.checkRobotsTxt(robotsTxt, "/private/public-preview/page");

    expect(blockedCheck.allowed).toBe(false);
    expect(allowedCheck.allowed).toBe(true);
    expect(overrideCheck.allowed).toBe(true);
    expect(blockedCheck.crawlDelaySec).toBe(5);
    expect(blockedCheck.sitemapUrls).toContain("https://example.com/sitemap.xml");
  });

  it("registers licensed providers and rejects unknown providers", () => {
    expect(getProviderAdapter("GOOGLE_SEARCH_CONSOLE")).toBeDefined();
    expect(getProviderAdapter("DATAFORSEO")).toBeDefined();
    expect(getProviderAdapter("SERPAPI")).toBeDefined();
    expect(getProviderAdapter("LICENSED_CRAWLER")).toBeDefined();

    expect(() => getProviderAdapter("UNKNOWN_PROVIDER" as any)).toThrow();
  });
});
