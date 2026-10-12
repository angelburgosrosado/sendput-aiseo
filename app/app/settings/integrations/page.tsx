"use client";

import React, { useState } from "react";
import {
  Plug,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Lock,
  ExternalLink,
  ShieldCheck,
  Key,
} from "lucide-react";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/context/app-context";
import { BaseDataProviderAdapter } from "@/lib/adapters/base-adapter";

export default function IntegrationsPage() {
  const { canManageIntegrations, userRole } = useApp();
  const [testingId, setTestingId] = useState<string | null>(null);

  const [connectors, setConnectors] = useState([
    {
      id: "GOOGLE_SEARCH_CONSOLE",
      name: "Google Search Console",
      type: "First-Party OAuth 2.0",
      description: "Direct verified impressions, click-through rates, and exact average SERP positions.",
      status: "CONNECTED",
      account: "apex-gsc-service@apexcloud.iam.gserviceaccount.com",
      keyMasked: "OAuth 2.0 Client • Active Token",
      lastSync: "12m ago",
    },
    {
      id: "GOOGLE_ANALYTICS_4",
      name: "Google Analytics 4",
      type: "Measurement Telemetry",
      description: "Organic search landing page conversion rates and cohort engagement metrics.",
      status: "CONNECTED",
      account: "GA4 Property ID: 394820194",
      keyMasked: BaseDataProviderAdapter.maskCredential("ga4_secret_k8392109481"),
      lastSync: "34m ago",
    },
    {
      id: "DATAFORSEO",
      name: "DataForSEO Licensed SERP Index",
      type: "Commercial API Feed",
      description: "Licensed global search result index feeds, search volume estimates, and CPC data.",
      status: "CONNECTED",
      account: "Account Login: dataforseo_apex_prod",
      keyMasked: BaseDataProviderAdapter.maskCredential("dfseo_live_94819284729184"),
      lastSync: "1h ago",
    },
    {
      id: "SERPAPI",
      name: "SerpAPI Search Engine Gateway",
      type: "Official Gateway API",
      description: "Real-time search engine snapshots and structured SERP feature extraction.",
      status: "CONNECTED",
      account: "Production Gateway Node #4",
      keyMasked: BaseDataProviderAdapter.maskCredential("serp_live_839218492049182"),
      lastSync: "2h ago",
    },
    {
      id: "BING_WEBMASTER",
      name: "Bing Webmaster Tools",
      type: "Official API",
      description: "Bing & Microsoft Copilot crawl telemetry and search performance signals.",
      status: "CONNECTED",
      account: "Partner ID: ms_apex_2026",
      keyMasked: BaseDataProviderAdapter.maskCredential("bing_api_749102847192"),
      lastSync: "4h ago",
    },
    {
      id: "GOOGLE_BUSINESS_PROFILE",
      name: "Google Business Profile",
      type: "Local Profile API",
      description: "Physical location listing synchronization and aggregated review signals.",
      status: "CONNECTED",
      account: "Verified Multi-Location Org: Apex Technologies",
      keyMasked: "Google Workspace Authorized",
      lastSync: "1d ago",
    },
    {
      id: "LICENSED_CRAWLER",
      name: "SignalForge Licensed Polite Crawler",
      type: "RFC 9309 Compliant Bot",
      description: "Automated site crawler respecting robots.txt directives, crawl-delays, and SSL handshakes.",
      status: "CONNECTED",
      account: "SignalForgeBot/1.0 User-Agent",
      keyMasked: "Dedicated Node: 2 req/sec",
      lastSync: "Just now",
    },
  ]);

  const handleTestConnection = (id: string) => {
    setTestingId(id);
    setTimeout(() => {
      setTestingId(null);
    }, 1000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-forge-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase text-forge-400">ORGANIZATION CONNECTORS</span>
            <span className="text-forge-600">•</span>
            <span className="text-xs font-mono text-seafoam-400">7 Active Providers</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-forge-50">
            Authorized Data Provider Adapters
          </h1>
          <p className="text-xs text-forge-400 mt-1">
            SignalForge connects exclusively to licensed APIs and customer-authorized data streams. No scraping.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="seafoam" size="sm" className="font-mono">
            All Feeds Compliant
          </Badge>
        </div>
      </div>

      {/* Role Notice if not OWNER */}
      {!canManageIntegrations && (
        <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-800/50 flex items-center gap-3 text-xs text-amber-200">
          <Lock className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            Provider credentials and OAuth tokens are restricted to the <strong>OWNER</strong> role. You are currently previewing as <strong>{userRole}</strong>. Use the role switcher in the top bar to test Owner privileges.
          </span>
        </div>
      )}

      {/* Connectors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {connectors.map((c) => (
          <Card key={c.id} className="p-6 space-y-4 bg-forge-900 border-forge-800 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold text-forge-100">{c.name}</h3>
                  <span className="text-[11px] text-seafoam-400 font-mono">{c.type}</span>
                </div>
                <Badge variant="seafoam" size="sm">
                  {c.status}
                </Badge>
              </div>

              <p className="text-xs text-forge-400 leading-relaxed">
                {c.description}
              </p>

              <div className="p-3 rounded-xl bg-forge-950 border border-forge-800/80 font-mono text-[11px] space-y-1">
                <div className="text-forge-300 truncate">{c.account}</div>
                <div className="text-forge-400 flex items-center justify-between">
                  <span>Key: {c.keyMasked}</span>
                  <span className="text-seafoam-400">Sync: {c.lastSync}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-forge-800">
              <span className="text-[11px] text-forge-400 font-mono">Status: Healthy</span>
              <Button
                variant="outline"
                size="sm"
                icon={<RefreshCw className={`w-3.5 h-3.5 ${testingId === c.id ? "animate-spin" : ""}`} />}
                disabled={!canManageIntegrations || testingId === c.id}
                onClick={() => handleTestConnection(c.id)}
              >
                {testingId === c.id ? "Pinging Adapter..." : "Test Connection"}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
