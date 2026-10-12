"use client";

import React, { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import {
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  ExternalLink,
  MessageSquare,
  TrendingUp,
  Cpu,
  Layers,
} from "lucide-react";
import { useApp } from "@/lib/context/app-context";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SyntheticBadge } from "@/components/ui/synthetic-badge";
import { demoAIObservations, DemoAIQueryObservation } from "@/lib/demo-data";

export default function AIAnswersPage() {
  const params = useParams();
  const projectId = (params?.projectId as string) || "proj_apex_cloud";
  const { currentProject } = useApp();

  const [engineFilter, setEngineFilter] = useState<string>("ALL");
  const [search, setSearch] = useState("");
  const [selectedObs, setSelectedObs] = useState<DemoAIQueryObservation | null>(null);

  const observations = useMemo(() => {
    return demoAIObservations.filter((obs) => {
      const matchProject = obs.projectId === projectId || obs.projectId === "proj_apex_cloud";
      const matchEngine = engineFilter === "ALL" || obs.engine === engineFilter;
      const matchSearch =
        obs.prompt.toLowerCase().includes(search.toLowerCase()) ||
        obs.snippetContext.toLowerCase().includes(search.toLowerCase());

      return matchProject && matchEngine && matchSearch;
    });
  }, [projectId, engineFilter, search]);

  const stats = useMemo(() => {
    const total = observations.length;
    const cited = observations.filter((o) => o.isClientCited).length;
    const primary = observations.filter((o) => o.mentionType === "PRIMARY_RECOMMENDATION").length;
    const avgSentiment =
      observations.reduce((acc, o) => acc + o.sentimentScore, 0) / (total || 1);

    return {
      citationRate: total > 0 ? ((cited / total) * 100).toFixed(1) : "0",
      primaryCount: primary,
      avgSentiment: avgSentiment.toFixed(2),
    };
  }, [observations]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-forge-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase text-forge-400">GENERATIVE ANSWER ENGINES</span>
            <span className="text-forge-600">•</span>
            <span className="text-xs font-mono text-amber-400">85 Monitored Prompts</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-forge-50">
            AI-Answer Citation & Share of Voice
          </h1>
          <p className="text-xs text-forge-400 mt-1">
            Monitoring brand authority, source links, and recommendation sentiment across Perplexity, ChatGPT, Claude, and Gemini.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <SyntheticBadge label="Simulated Prompts" />
        </div>
      </div>

      {/* Metric Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-4 bg-forge-900 border-forge-800 border-l-4 border-l-amber-500">
          <span className="text-xs font-mono text-forge-400 uppercase">Citation Win Rate</span>
          <p className="text-3xl font-extrabold text-amber-300 mt-1">{stats.citationRate}%</p>
          <span className="text-[11px] text-forge-400 font-mono">Domain cited as authoritative</span>
        </Card>

        <Card className="p-4 bg-forge-900 border-forge-800 border-l-4 border-l-seafoam-500">
          <span className="text-xs font-mono text-forge-400 uppercase">Primary Recommendations</span>
          <p className="text-3xl font-extrabold text-seafoam-300 mt-1">{stats.primaryCount}</p>
          <span className="text-[11px] text-seafoam-400 font-mono">Rank #1 Citation Source</span>
        </Card>

        <Card className="p-4 bg-forge-900 border-forge-800 border-l-4 border-l-blue-500">
          <span className="text-xs font-mono text-forge-400 uppercase">Average Sentiment</span>
          <p className="text-3xl font-extrabold text-blue-300 mt-1">+{stats.avgSentiment}</p>
          <span className="text-[11px] text-blue-400 font-mono">Strong Positive Endorsement</span>
        </Card>

        <Card className="p-4 bg-forge-900 border-forge-800 border-l-4 border-l-purple-500">
          <span className="text-xs font-mono text-forge-400 uppercase">Engines Covered</span>
          <p className="text-3xl font-extrabold text-purple-300 mt-1">5</p>
          <span className="text-[11px] text-purple-400 font-mono">Perplexity, ChatGPT, Claude, etc.</span>
        </Card>
      </div>

      {/* Filter and Query Search */}
      <div className="bg-forge-900 border border-forge-800 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-forge-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search prompt query or context snippet..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-forge-950 border border-forge-800 rounded-lg text-forge-100 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-2">
          {(["ALL", "PERPLEXITY", "CHATGPT", "CLAUDE", "GEMINI"] as const).map((eng) => (
            <button
              key={eng}
              onClick={() => setEngineFilter(eng)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                engineFilter === eng
                  ? "bg-amber-500 text-forge-950 font-semibold"
                  : "bg-forge-950 text-forge-300 hover:text-forge-100 border border-forge-800"
              }`}
            >
              {eng}
            </button>
          ))}
        </div>
      </div>

      {/* Observations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {observations.map((obs) => (
          <Card
            key={obs.id}
            hoverable
            className="p-5 space-y-3 bg-forge-900/80 border-forge-800 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Badge
                  variant={
                    obs.engine === "PERPLEXITY"
                      ? "amber"
                      : obs.engine === "CHATGPT"
                      ? "seafoam"
                      : "purple"
                  }
                  size="sm"
                  className="font-mono text-[10px]"
                >
                  {obs.engine}
                </Badge>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-forge-400">{obs.date}</span>
                  <Badge
                    variant={obs.isClientCited ? "seafoam" : "outline"}
                    size="sm"
                    className="text-[10px]"
                  >
                    {obs.mentionType.replace(/_/g, " ")}
                  </Badge>
                </div>
              </div>

              <h3 className="text-sm font-bold text-forge-100 leading-snug">
                &ldquo;{obs.prompt}&rdquo;
              </h3>

              <div className="p-3 rounded-lg bg-forge-950 border border-forge-800/80 text-xs text-forge-300 leading-relaxed italic">
                {obs.snippetContext}
              </div>
            </div>

            <div className="pt-2 border-t border-forge-800/80 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="text-forge-400">Citation Rank:</span>
                <span className="text-seafoam-300 font-bold">
                  {obs.citationRank ? `#${obs.citationRank}` : "None"}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-forge-400">Sentiment:</span>
                <span className="text-blue-300 font-bold">{obs.sentimentScore > 0 ? `+${obs.sentimentScore}` : obs.sentimentScore}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
