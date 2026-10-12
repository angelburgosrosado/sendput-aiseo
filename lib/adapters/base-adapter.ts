import {
  ProviderId,
  ProviderCredentials,
  ConnectionStatusResult,
  RobotsTxtCheckResult,
} from "./types";

export abstract class BaseDataProviderAdapter {
  abstract readonly id: ProviderId;
  abstract readonly name: string;
  abstract readonly description: string;
  abstract readonly requiresOAuth: boolean;

  protected rateLimitRemaining: number = 1000;
  protected rateLimitResetEpoch: number = Date.now() + 3600000;

  // Mask sensitive secrets for UI display
  static maskCredential(secret?: string): string {
    if (!secret) return "Not configured";
    if (secret.length <= 8) return "••••••••";
    return `${secret.slice(0, 4)}••••••••${secret.slice(-4)}`;
  }

  // Pure compliance checker for robots.txt rules
  static checkRobotsTxt(robotsTxtContent: string, targetPath: string, userAgent = "SignalForgeBot"): RobotsTxtCheckResult {
    const lines = robotsTxtContent.split("\n").map((l) => l.trim());
    let activeAgentMatches = false;
    let allowed = true;
    let matchingRule: string | undefined;
    let crawlDelaySec: number | undefined;
    const sitemapUrls: string[] = [];

    for (const rawLine of lines) {
      const line = rawLine.split("#")[0].trim();
      if (!line) continue;

      const [directive, ...rest] = line.split(":");
      const key = directive.trim().toLowerCase();
      const val = rest.join(":").trim();

      if (key === "user-agent") {
        activeAgentMatches = val === "*" || val.toLowerCase() === userAgent.toLowerCase();
      } else if (key === "sitemap") {
        sitemapUrls.push(val);
      } else if (activeAgentMatches) {
        if (key === "crawl-delay") {
          crawlDelaySec = parseFloat(val) || undefined;
        } else if (key === "disallow") {
          if (val === "" || val === "/") {
            if (val === "/" && targetPath.startsWith("/")) {
              allowed = false;
              matchingRule = line;
            }
          } else if (targetPath.startsWith(val)) {
            allowed = false;
            matchingRule = line;
          }
        } else if (key === "allow") {
          if (targetPath.startsWith(val)) {
            allowed = true;
            matchingRule = line;
          }
        }
      }
    }

    return {
      allowed,
      userAgent,
      matchingRule,
      crawlDelaySec,
      sitemapUrls,
      reason: allowed
        ? "Path conforms to robots.txt guidelines"
        : `Blocked by rule: ${matchingRule}`,
    };
  }

  // Rate-limiting check prior to outbound calls
  protected async checkRateLimit(): Promise<boolean> {
    if (this.rateLimitRemaining <= 0 && Date.now() < this.rateLimitResetEpoch) {
      return false;
    }
    this.rateLimitRemaining--;
    return true;
  }

  abstract testConnection(credentials: ProviderCredentials): Promise<ConnectionStatusResult>;
}
