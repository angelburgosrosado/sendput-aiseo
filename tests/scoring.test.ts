import { describe, it, expect } from "vitest";
import {
  calculateSFAI,
  calculateDVS,
  calculateAICS,
  calculateTHQ,
  classifySearchIntent,
} from "@/lib/scoring";

describe("SignalForge Proprietary Scoring Engines", () => {
  it("calculates SFAI (SignalForge Authority Index) within 0-100 bounds", () => {
    const highAuthority = calculateSFAI({
      uniqueReferringDomains: 2500,
      dofollowRatio: 0.85,
      averageDomainQuality: 88,
      organicKeywordBreadth: 4500,
    });

    const lowAuthority = calculateSFAI({
      uniqueReferringDomains: 5,
      dofollowRatio: 0.4,
      averageDomainQuality: 20,
      organicKeywordBreadth: 15,
    });

    expect(highAuthority).toBeGreaterThan(65);
    expect(highAuthority).toBeLessThanOrEqual(100);
    expect(lowAuthority).toBeLessThan(30);
    expect(lowAuthority).toBeGreaterThan(0);
  });

  it("calculates Discovery Velocity Score (DVS) with positive momentum and friction", () => {
    const positiveMomentum = calculateDVS({
      recentRankGains: 45,
      newTop10Keywords: 12,
      serpFeaturesWon: 8,
      lostTop10Keywords: 2,
    });

    const negativeMomentum = calculateDVS({
      recentRankGains: 2,
      newTop10Keywords: 1,
      serpFeaturesWon: 0,
      lostTop10Keywords: 15,
    });

    expect(positiveMomentum).toBeGreaterThan(0);
    expect(negativeMomentum).toBeLessThan(0);
  });

  it("calculates AI Citation Share (AICS) across generative engines", () => {
    const highCitation = calculateAICS({
      totalQueryPrompts: 100,
      promptsWithCitation: 82,
      promptsAsPrimarySource: 35,
      enginesMonitoredCount: 5,
    });

    expect(highCitation).toBeGreaterThan(50);
    expect(highCitation).toBeLessThanOrEqual(100);
  });

  it("calculates Technical Health Quotient (THQ) with severity weighting", () => {
    const cleanSite = calculateTHQ({
      totalPagesCrawled: 100,
      criticalIssues: 0,
      highIssues: 1,
      mediumIssues: 2,
      lowIssues: 3,
    });

    const brokenSite = calculateTHQ({
      totalPagesCrawled: 50,
      criticalIssues: 15,
      highIssues: 25,
      mediumIssues: 30,
      lowIssues: 10,
    });

    expect(cleanSite).toBeGreaterThan(95);
    expect(brokenSite).toBeLessThan(70);
  });

  it("classifies search intent correctly according to semantic cues", () => {
    expect(classifySearchIntent("buy enterprise kubernetes platform")).toBe("TRANSACTIONAL");
    expect(classifySearchIntent("best hybrid cloud monitoring software comparison")).toBe("COMMERCIAL");
    expect(classifySearchIntent("apex cloud login portal")).toBe("NAVIGATIONAL");
    expect(classifySearchIntent("how to configure opentelemetry collector on eks")).toBe("INFORMATIONAL");
  });
});
