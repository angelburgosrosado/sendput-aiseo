"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  Search,
  KeyRound,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  ExternalLink,
  Plus,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Globe,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { useApp } from "@/lib/context/app-context";
import { MetricCard } from "@/components/ui/metric-card";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SyntheticBadge } from "@/components/ui/synthetic-badge";
import { demoCompetitors, demoAIObservations, demoAuditIssues } from "@/lib/demo-data";

export default function OverviewPage() {
  const { currentProject, currentOrg, dateRange } = useApp();

  const projectId = currentProject?.id || "proj_apex_cloud";

  // 14-day trending chart data
  const chartData = [
    { date: "Oct 01", sfai: 74.2, aiCitationShare: 24.0, organicTop10: 112 },
    { date: "Oct 03", sfai: 74.8, aiCitationShare: 25.2, organicTop10: 116 },
    { date: "Oct 05", sfai: 75.1, aiCitationShare: 26.8, organicTop10: 120 },
    { date: "Oct 07", sfai: 75.9, aiCitationShare: 27.5, organicTop10: 124 },
    { date: "Oct 09", sfai: 76.4, aiCitationShare: 28.9, organicTop10: 130 },
    { date: "Oct 11", sfai: 77.0, aiCitationShare: 30.1, organicTop10: 138 },
    { date: "Oct 13", sfai: 78.4, aiCitationShare: 31.8, organicTop10: 142 },
  ];

  const projectCompetitors = demoCompetitors.filter((c) => c.projectId === projectId).slice(0, 4);
  const recentAiWins = demoAIObservations.filter((a) => a.projectId === projectId && a.isClientCited).slice(0, 3);
  const openIssues = demoAuditIssues.filter((i) => i.projectId === projectId && i.status === "OPEN").slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-forge-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase text-forge-400">{currentOrg.name}</span>
            <span className="text-forge-600">•</span>
            <span className="text-xs font-mono text-seafoam-400">ORGANIC & AI DISCOVERY MATRIX</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-forge-50 tracking-tight flex items-center gap-3">
            <span>{currentProject?.name}</span>
            <Badge variant="seafoam" size="sm" className="font-mono text-[11px]">
              {currentProject?.domain}
            </Badge>
          </h1>
          <p className="text-xs text-forge-400 mt-1">
            {currentProject?.description} (Target: {currentProject?.targetCountry} • Window: Last {dateRange})
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href={`/app/projects/${projectId}/research`}>
            <Button variant="secondary" size="sm" icon={<Search className="w-3.5 h-3.5" />}>
              Deep Research
            </Button>
          </Link>
          <Link href={`/app/projects/${projectId}/keywords`}>
            <Button variant="primary" size="sm" icon={<KeyRound className="w-3.5 h-3.5" />}>
              Explore 320 Keywords
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Core Proprietary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="SignalForge Authority Index (SFAI)"
          value={currentProject?.sfaiScore || 78.4}
          suffix="/ 100"
          change={4.2}
          subtext="Normalized link graph & index breadth"
          accentColor="seafoam"
          icon={<Search className="w-4 h-4" />}
        />
        <MetricCard
          label="Discovery Velocity Score (DVS)"
          value={`+${currentProject?.discoveryVelocity || 18.2}`}
          suffix="%"
          change={3.5}
          subtext="Net top-10 SERP feature acceleration"
          accentColor="cyan"
          icon={<TrendingUp className="w-4 h-4" />}
        />
        <MetricCard
          label="AI Citation Share (AICS)"
          value={currentProject?.aiCitationShare || 31.8}
          suffix="%"
          change={8.4}
          subtext="Prominence in Perplexity & ChatGPT"
          accentColor="amber"
          icon={<Sparkles className="w-4 h-4" />}
        />
        <MetricCard
          label="Technical Health Quotient (THQ)"
          value={currentProject?.healthQuotient || 94.6}
          suffix="/ 100"
          change={-0.6}
          subtext="45 crawl pages checked for CWV"
          accentColor="purple"
          icon={<ShieldCheck className="w-4 h-4" />}
        />
      </div>

      {/* Main Interactive Chart & AI Intelligence Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visibility Chart */}
        <Card className="lg:col-span-2 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold text-forge-100">Discovery Momentum & AI Citation Growth</h3>
                <p className="text-xs text-forge-400">Correlation between SFAI domain equity and AI Answer Citation Share</p>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="flex items-center gap-1.5 text-seafoam-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-seafoam-400" /> SFAI Equity
                </span>
                <span className="flex items-center gap-1.5 text-amber-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> AI Citation %
                </span>
              </div>
            </div>

            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSfai" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#14B8A6" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorAi" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1F293D" vertical={false} />
                  <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} domain={[20, 90]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0B0F19",
                      borderColor: "#1F293D",
                      borderRadius: "8px",
                      fontSize: "12px",
                      color: "#F4F7FD",
                    }}
                  />
                  <Area type="monotone" dataKey="sfai" stroke="#14B8A6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSfai)" />
                  <Area type="monotone" dataKey="aiCitationShare" stroke="#F59E0B" strokeWidth={2.5} fillOpacity={1} fill="url(#colorAi)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-forge-800 flex items-center justify-between text-xs text-forge-400">
            <span>Aggregated from licensed SERP indexes and synthetic query benchmarks.</span>
            <SyntheticBadge />
          </div>
        </Card>

        {/* Live AI Citation Feed */}
        <Card className="p-6 flex flex-col justify-between">
          <div>
            <CardHeader
              title="Recent AI Citation Hits"
              subtitle="Where LLMs cite this domain"
              action={
                <Link href={`/app/projects/${projectId}/ai-answers`}>
                  <Button variant="ghost" size="sm" className="text-xs">
                    View All (85)
                  </Button>
                </Link>
              }
            />

            <div className="space-y-3">
              {recentAiWins.map((win, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-forge-950 border border-forge-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Badge variant="amber" size="sm" className="font-mono text-[10px]">
                      {win.engine}
                    </Badge>
                    <span className="text-[10px] font-mono text-seafoam-400">
                      Rank #{win.citationRank} Source
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-forge-200 line-clamp-1">{win.prompt}</p>
                  <p className="text-[11px] text-forge-400 leading-snug line-clamp-2">
                    {win.snippetContext}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-forge-800 flex items-center justify-between">
            <span className="text-xs text-forge-400 font-mono">Sentiment Avg: +0.84</span>
            <Badge variant="seafoam" size="sm">High Authority</Badge>
          </div>
        </Card>
      </div>

      {/* Competitor Benchmark & Technical Health Previews */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Competitor Overlap Preview */}
        <Card className="p-6">
          <CardHeader
            title="Competitor Equity Benchmarks"
            subtitle="Comparing domain authority against peer properties"
            action={
              <Link href={`/app/projects/${projectId}/research`}>
                <Button variant="ghost" size="sm">
                  Full Matrix
                </Button>
              </Link>
            }
          />

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-forge-800 text-forge-400 font-mono text-[11px]">
                  <th className="pb-2.5">Competitor Domain</th>
                  <th className="pb-2.5 text-right">SFAI Score</th>
                  <th className="pb-2.5 text-right">Shared Terms</th>
                  <th className="pb-2.5 text-right">Overlap %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-forge-800/60">
                <tr className="bg-seafoam-950/20 font-semibold text-seafoam-300">
                  <td className="py-2.5 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-seafoam-400" />
                    <span>{currentProject?.domain} (Your Site)</span>
                  </td>
                  <td className="py-2.5 text-right font-mono">{currentProject?.sfaiScore}</td>
                  <td className="py-2.5 text-right font-mono">320</td>
                  <td className="py-2.5 text-right font-mono">100%</td>
                </tr>
                {projectCompetitors.map((comp) => (
                  <tr key={comp.id} className="text-forge-300 hover:bg-forge-850/50">
                    <td className="py-2.5">{comp.domain}</td>
                    <td className="py-2.5 text-right font-mono text-forge-100">{comp.sfaiScore}</td>
                    <td className="py-2.5 text-right font-mono">{comp.commonKeywords}</td>
                    <td className="py-2.5 text-right font-mono text-seafoam-400">{comp.overlapShare}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Technical Audit Health Preview */}
        <Card className="p-6">
          <CardHeader
            title="Technical Audit Hygiene"
            subtitle="Polite crawler findings & Core Web Vitals"
            action={
              <Link href={`/app/projects/${projectId}/audits`}>
                <Button variant="ghost" size="sm">
                  View 105 Issues
                </Button>
              </Link>
            }
          />

          <div className="space-y-3">
            {openIssues.map((issue) => (
              <div key={issue.id} className="p-3 rounded-xl bg-forge-950 border border-forge-800 space-y-1">
                <div className="flex items-center justify-between">
                  <Badge
                    variant={
                      issue.severity === "CRITICAL"
                        ? "danger"
                        : issue.severity === "HIGH"
                        ? "amber"
                        : "default"
                    }
                    size="sm"
                    className="text-[10px]"
                  >
                    {issue.severity}
                  </Badge>
                  <span className="text-[10px] font-mono text-forge-400 truncate max-w-[200px]">
                    {issue.pageUrl.split("/").pop() || "/"}
                  </span>
                </div>
                <p className="text-xs font-medium text-forge-100">{issue.message}</p>
                <p className="text-[11px] text-seafoam-400 font-mono">
                  Fix: {issue.recommendation}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
