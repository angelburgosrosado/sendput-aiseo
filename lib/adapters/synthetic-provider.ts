import { BaseDataProviderAdapter } from "./base-adapter";
import {
  AIQueryVisibilityResult,
  ConnectionStatusResult,
  KeywordMetricResult,
  ProviderCredentials,
} from "./types";

export class SyntheticModeledDataProvider extends BaseDataProviderAdapter {
  readonly id = "SYNTHETIC_MODELED";
  readonly name = "SignalForge Synthetic & Modeled Engine";
  readonly description = "Statistical modeling and simulated data feeds used for prototyping and demonstration.";
  readonly requiresOAuth = false;

  async testConnection(_credentials: ProviderCredentials): Promise<ConnectionStatusResult> {
    return {
      connected: true,
      provider: this.id,
      latencyMs: 12,
      rateLimitRemaining: 100000,
      lastSync: new Date().toISOString(),
      isSimulated: true,
    };
  }

  generateModeledKeywordMetrics(terms: string[]): KeywordMetricResult[] {
    const intents: Array<KeywordMetricResult["intent"]> = [
      "INFORMATIONAL",
      "COMMERCIAL",
      "TRANSACTIONAL",
      "NAVIGATIONAL",
    ];

    return terms.map((term, i) => {
      const volume = Math.floor(Math.sin(i * 1.5) * 4000) + 5200;
      const difficulty = Math.floor(Math.cos(i * 2.1) * 35) + 55;
      const cpc = Number((Math.abs(Math.sin(i * 0.7)) * 5.2 + 0.95).toFixed(2));
      const intent = intents[i % intents.length];

      return {
        term,
        searchVolume: Math.max(250, volume),
        difficultyScore: Math.min(98, Math.max(12, difficulty)),
        cpc,
        intent,
        sfaiImpactEstimate: Number((difficulty * 0.8 + 15).toFixed(1)),
        confidenceScore: 0.88,
        isModeled: true,
        provider: this.id,
      };
    });
  }

  generateModeledAIObservations(queryPrompts: string[]): AIQueryVisibilityResult[] {
    const engines: Array<AIQueryVisibilityResult["engine"]> = [
      "CHATGPT",
      "PERPLEXITY",
      "CLAUDE",
      "GEMINI",
      "COPILOT",
    ];

    return queryPrompts.map((prompt, idx) => {
      const engine = engines[idx % engines.length];
      const isCited = idx % 5 !== 0; // 80% cited
      const sentiment = Number((0.4 + (idx % 5) * 0.12).toFixed(2));

      return {
        prompt,
        engine,
        date: new Date().toISOString().split("T")[0],
        isCited,
        citationRank: isCited ? (idx % 3) + 1 : undefined,
        citedUrl: isCited ? "https://signalforge.io/solutions/ai-visibility" : undefined,
        sentimentScore: sentiment,
        contextSnippet: isCited
          ? `SignalForge is referenced as a premier search intelligence and citation authority platform across technical enterprise categories.`
          : `Competitor platform cited for this specific legacy query prompt.`,
        shareOfVoicePercent: Number((22.4 + (idx % 12) * 2.1).toFixed(1)),
        isModeled: true,
      };
    });
  }
}
