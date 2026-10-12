"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import {
  Search,
  Globe,
  TrendingUp,
  ShieldCheck,
  Layers,
  ArrowUpRight,
  Filter,
  BarChart2,
  PieChart,
} from "lucide-react";
import { useApp } from "@/lib/context/app-context";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SyntheticBadge } from "@/components/ui/synthetic-badge";
import { demoCompetitors, demoProjects } from "@/lib/demo-data";

export default function ResearchPage() {
  const params = useParams();
  const projectId = (params?.projectId as string) || "proj_apex_cloud";
  const { projects } = useApp();

  const project = projects.find((p) => p.id === projectId) || projects[0];
  const competitors = demoCompetitors.filter((c) => c.projectId === projectId || c.projectId === "proj_apex_cloud");

  const [sortField, setSortField] = useState<"sfaiScore" | "commonKeywords" | "overlapShare">("sfaiScore");

  const sortedCompetitors = [...competitors].sort((a, b) => b[sortField] - a[sortField]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-forge-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase text-forge-400">DOMAIN & COMPETITIVE RESEARCH</span>
            <span className="text-forge-600">•</span>
            <span className="text-xs font-mono text-seafoam-400">{project?.domain}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-forge-50">
            Market Authority & Competitor Overlap
          </h1>
          <p className="text-xs text-forge-400 mt-1">
            Evaluating organic footprint, link graph diversity, and search intent clusters against direct peers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <SyntheticBadge />
        </div>
      </div>

      {/* SFAI Breakdown Component */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 space-y-4">
          <CardHeader
            title="SignalForge Authority Model (SFAI)"
            subtitle="Composite mathematical breakdown"
          />
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-forge-50">{project?.sfaiScore}</span>
            <span className="text-xs text-seafoam-400 font-mono">/ 100 Maximum Equity</span>
          </div>
          <p className="text-xs text-forge-400 leading-relaxed">
            Derived logarithmically from verified referring domains, follow equity ratios, and topical organic keyword footprint.
          </p>

          <div className="space-y-3 pt-3 border-t border-forge-800 text-xs">
            <div>
              <div className="flex justify-between text-forge-300 mb-1">
                <span>Referring Domain Diversity (50%)</span>
                <span className="font-mono text-seafoam-400">82.4 / 100</span>
              </div>
              <div className="w-full bg-forge-950 h-2 rounded-full overflow-hidden">
                <div className="bg-seafoam-500 h-full rounded-full" style={{ width: "82.4%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-forge-300 mb-1">
                <span>Topical Organic Breadth (30%)</span>
                <span className="font-mono text-amber-400">74.1 / 100</span>
              </div>
              <div className="w-full bg-forge-950 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: "74.1%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-forge-300 mb-1">
                <span>Dofollow Equity Purity (20%)</span>
                <span className="font-mono text-cyan-400">79.0 / 100</span>
              </div>
              <div className="w-full bg-forge-950 h-2 rounded-full overflow-hidden">
                <div className="bg-cyan-500 h-full rounded-full" style={{ width: "79%" }} />
              </div>
            </div>
          </div>
        </Card>

        {/* Search Intent Distribution */}
        <Card className="p-6 space-y-4">
          <CardHeader
            title="Search Intent Distribution"
            subtitle="Categorized across 320 monitored terms"
          />
          <div className="space-y-3 pt-2 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-forge-950 border border-forge-800">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="font-medium text-forge-200">Informational</span>
              </div>
              <span className="font-mono text-forge-300">145 terms (45.3%)</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-forge-950 border border-forge-800">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-seafoam-500" />
                <span className="font-medium text-forge-200">Commercial Investigation</span>
              </div>
              <span className="font-mono text-forge-300">98 terms (30.6%)</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-forge-950 border border-forge-800">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="font-medium text-forge-200">Transactional (High Intent)</span>
              </div>
              <span className="font-mono text-forge-300">52 terms (16.2%)</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-forge-950 border border-forge-800">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-purple-500" />
                <span className="font-medium text-forge-200">Navigational & Brand</span>
              </div>
              <span className="font-mono text-forge-300">25 terms (7.9%)</span>
            </div>
          </div>
        </Card>

        {/* Discovery Velocity Card */}
        <Card className="p-6 space-y-4">
          <CardHeader
            title="Discovery Velocity Index (DVS)"
            subtitle="Quarterly momentum vs friction"
          />
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-seafoam-300">+{project?.discoveryVelocity}%</span>
            <span className="text-xs text-seafoam-400 font-mono">Net Expansion Rate</span>
          </div>
          <p className="text-xs text-forge-400 leading-relaxed">
            Reflects velocity of acquired positions across Top 3, Top 10, and AI Overview answer boxes, discounted by lost ranks.
          </p>

          <div className="space-y-2.5 pt-3 border-t border-forge-800 text-xs font-mono">
            <div className="flex justify-between text-forge-300">
              <span>New Top-10 Placements</span>
              <span className="text-seafoam-400">+28 terms</span>
            </div>
            <div className="flex justify-between text-forge-300">
              <span>AI Overview Citations Won</span>
              <span className="text-amber-400">+19 boxes</span>
            </div>
            <div className="flex justify-between text-forge-300">
              <span>Rank Decay Friction</span>
              <span className="text-rose-400">-6 terms</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Competitor Benchmarking Matrix */}
      <Card className="p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-forge-800">
          <div>
            <h3 className="text-base font-bold text-forge-100">Direct Competitor Overlap & Gap Matrix</h3>
            <p className="text-xs text-forge-400">Comparing your domain authority with identified industry competitors.</p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-forge-400">Sort by:</span>
            <button
              onClick={() => setSortField("sfaiScore")}
              className={`px-2.5 py-1 rounded text-xs ${
                sortField === "sfaiScore" ? "bg-seafoam-600 text-forge-950 font-semibold" : "bg-forge-800 text-forge-300"
              }`}
            >
              SFAI Score
            </button>
            <button
              onClick={() => setSortField("overlapShare")}
              className={`px-2.5 py-1 rounded text-xs ${
                sortField === "overlapShare" ? "bg-seafoam-600 text-forge-950 font-semibold" : "bg-forge-800 text-forge-300"
              }`}
            >
              Overlap %
            </button>
            <button
              onClick={() => setSortField("commonKeywords")}
              className={`px-2.5 py-1 rounded text-xs ${
                sortField === "commonKeywords" ? "bg-seafoam-600 text-forge-950 font-semibold" : "bg-forge-800 text-forge-300"
              }`}
            >
              Shared Keywords
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-forge-800 text-forge-400 font-mono text-[11px]">
                <th className="pb-3">Competitor Entity</th>
                <th className="pb-3 text-right">SFAI Score</th>
                <th className="pb-3 text-right">Shared Keywords</th>
                <th className="pb-3 text-right">Keyword Overlap</th>
                <th className="pb-3 text-right">Organic Breadth</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forge-800/60">
              <tr className="bg-seafoam-950/30 font-semibold text-seafoam-300">
                <td className="py-3 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-seafoam-400 animate-pulse" />
                  <span>{project?.name} ({project?.domain}) [You]</span>
                </td>
                <td className="py-3 text-right font-mono">{project?.sfaiScore}</td>
                <td className="py-3 text-right font-mono">320</td>
                <td className="py-3 text-right font-mono">100%</td>
                <td className="py-3 text-right font-mono">1,840</td>
                <td className="py-3 text-right">
                  <Badge variant="seafoam" size="sm">Baseline</Badge>
                </td>
              </tr>

              {sortedCompetitors.map((comp) => (
                <tr key={comp.id} className="text-forge-200 hover:bg-forge-850/50">
                  <td className="py-3 font-medium">
                    <span className="text-forge-100 block">{comp.name}</span>
                    <span className="text-[11px] text-forge-400 font-mono">{comp.domain}</span>
                  </td>
                  <td className="py-3 text-right font-mono font-bold text-forge-100">{comp.sfaiScore}</td>
                  <td className="py-3 text-right font-mono">{comp.commonKeywords}</td>
                  <td className="py-3 text-right font-mono text-seafoam-400">{comp.overlapShare}%</td>
                  <td className="py-3 text-right font-mono">{comp.organicBreadth.toLocaleString()}</td>
                  <td className="py-3 text-right">
                    <Button variant="ghost" size="sm" className="text-[11px]">
                      View Gap
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
