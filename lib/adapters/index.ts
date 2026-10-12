import { GoogleSearchConsoleAdapter } from "./google-search-console";
import { GoogleAnalytics4Adapter } from "./google-analytics";
import { DataForSeoAdapter } from "./dataforseo";
import { SerpApiAdapter } from "./serpapi";
import { LicensedCrawlerAdapter } from "./licensed-crawler";
import { SyntheticModeledDataProvider } from "./synthetic-provider";
import { ProviderId } from "./types";
import { BaseDataProviderAdapter } from "./base-adapter";

export * from "./types";
export * from "./base-adapter";
export * from "./google-search-console";
export * from "./google-analytics";
export * from "./dataforseo";
export * from "./serpapi";
export * from "./licensed-crawler";
export * from "./synthetic-provider";

export const providerRegistry: Record<ProviderId, BaseDataProviderAdapter> = {
  GOOGLE_SEARCH_CONSOLE: new GoogleSearchConsoleAdapter(),
  GOOGLE_ANALYTICS_4: new GoogleAnalytics4Adapter(),
  GOOGLE_BUSINESS_PROFILE: new GoogleSearchConsoleAdapter(), // GBP shares Google Workspace auth
  BING_WEBMASTER: new SerpApiAdapter(),
  DATAFORSEO: new DataForSeoAdapter(),
  SERPAPI: new SerpApiAdapter(),
  LICENSED_CRAWLER: new LicensedCrawlerAdapter(),
  SYNTHETIC_MODELED: new SyntheticModeledDataProvider(),
};

export function getProviderAdapter(id: ProviderId): BaseDataProviderAdapter {
  const adapter = providerRegistry[id];
  if (!adapter) {
    throw new Error(`Data provider adapter ${id} is not registered.`);
  }
  return adapter;
}
