"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import {
  FileText,
  Plus,
  Search,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Clock,
  Layers,
  X,
} from "lucide-react";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SyntheticBadge } from "@/components/ui/synthetic-badge";
import { useApp } from "@/lib/context/app-context";
import { demoContentBriefs, DemoContentBrief } from "@/lib/demo-data";

export default function ContentPage() {
  const params = useParams();
  const projectId = (params?.projectId as string) || "proj_apex_cloud";
  const { canEdit } = useApp();

  const [search, setSearch] = useState("");
  const [selectedBrief, setSelectedBrief] = useState<DemoContentBrief | null>(demoContentBriefs[0]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newKeyword, setNewKeyword] = useState("");

  const projectBriefs = demoContentBriefs.filter(
    (b) =>
      (b.projectId === projectId || b.projectId === "proj_apex_cloud") &&
      (b.title.toLowerCase().includes(search.toLowerCase()) ||
        b.targetKeyword.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-forge-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase text-forge-400">EDITORIAL INTELLIGENCE LAB</span>
            <span className="text-forge-600">•</span>
            <span className="text-xs font-mono text-seafoam-400">25 Strategic Briefs</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-forge-50">
            Content Blueprints & Search Intent Lab
          </h1>
          <p className="text-xs text-forge-400 mt-1">
            Generate high-depth entity outlines optimized for generative LLM answer extraction and organic search capture.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <SyntheticBadge />
          {canEdit && (
            <Button
              variant="primary"
              size="sm"
              icon={<Plus className="w-3.5 h-3.5" />}
              onClick={() => setCreateModalOpen(true)}
            >
              Draft Content Blueprint
            </Button>
          )}
        </div>
      </div>

      {/* Main Two-Pane Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Briefs List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-forge-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Filter briefs by keyword or title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-forge-900 border border-forge-800 rounded-lg text-forge-100 focus:outline-none focus:border-seafoam-500"
            />
          </div>

          <div className="space-y-2 max-h-[640px] overflow-y-auto pr-1">
            {projectBriefs.map((brief) => (
              <button
                key={brief.id}
                onClick={() => setSelectedBrief(brief)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                  selectedBrief?.id === brief.id
                    ? "bg-forge-850 border-seafoam-500 shadow-sm"
                    : "bg-forge-900/80 border-forge-800 hover:border-forge-700 hover:bg-forge-850/50"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <Badge
                    variant={
                      brief.status === "PUBLISHED"
                        ? "seafoam"
                        : brief.status === "REVIEW"
                        ? "amber"
                        : "outline"
                    }
                    size="sm"
                    className="text-[10px]"
                  >
                    {brief.status}
                  </Badge>
                  <span className="text-[11px] font-mono text-seafoam-400 font-semibold">
                    Score: {brief.qualityScore}
                  </span>
                </div>

                <h3 className="text-xs font-bold text-forge-100 line-clamp-2 leading-snug">
                  {brief.title}
                </h3>

                <p className="text-[11px] text-forge-400 mt-1 font-mono">
                  Keyword: {brief.targetKeyword}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Brief Detail Viewer */}
        <div className="lg:col-span-7">
          {selectedBrief ? (
            <Card className="p-6 space-y-6 bg-forge-900 border-forge-800">
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-forge-800">
                <div>
                  <Badge variant="seafoam" size="sm" className="mb-2">
                    {selectedBrief.status}
                  </Badge>
                  <h2 className="text-xl font-bold text-forge-50">{selectedBrief.title}</h2>
                  <p className="text-xs text-forge-400 mt-1">
                    Audience: {selectedBrief.targetAudience}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-mono text-forge-400 block">Quality Index</span>
                  <span className="text-2xl font-bold text-seafoam-300">
                    {selectedBrief.qualityScore} <span className="text-xs font-normal text-forge-400">/ 100</span>
                  </span>
                </div>
              </div>

              {/* Targets */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-forge-950 border border-forge-800">
                  <span className="text-forge-400 font-mono text-[11px] block">Primary Entity Term</span>
                  <span className="font-bold text-forge-100 font-mono">{selectedBrief.targetKeyword}</span>
                </div>
                <div className="p-3 rounded-xl bg-forge-950 border border-forge-800">
                  <span className="text-forge-400 font-mono text-[11px] block">Target Length</span>
                  <span className="font-bold text-forge-100 font-mono">{selectedBrief.wordCountGoal} Words</span>
                </div>
              </div>

              {/* Recommended Outline Structure */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-forge-300 font-mono flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-seafoam-400" />
                  Recommended Editorial Outline (Entity Optimized)
                </h3>
                <div className="space-y-2">
                  {selectedBrief.outline.map((section, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-forge-950 border border-forge-800/80 text-xs text-forge-200 flex items-start gap-2.5"
                    >
                      <CheckCircle2 className="w-4 h-4 text-seafoam-400 shrink-0 mt-0.5" />
                      <span>{section}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-forge-800 flex items-center justify-between">
                <span className="text-xs text-forge-400">Structured for Gemini & Perplexity synthesis</span>
                <Button variant="primary" size="sm">
                  Export Markdown Blueprint
                </Button>
              </div>
            </Card>
          ) : (
            <Card className="p-12 text-center text-forge-400 text-xs">
              Select a content brief from the left panel to inspect its outline and keyword targets.
            </Card>
          )}
        </div>
      </div>

      {/* Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-forge-900 border border-forge-750 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-forge-800">
              <h3 className="text-base font-bold text-forge-100">Draft Content Blueprint</h3>
              <button onClick={() => setCreateModalOpen(false)} className="text-forge-400 hover:text-forge-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setCreateModalOpen(false);
              }}
              className="space-y-4"
            >
              <div className="space-y-1">
                <label className="text-xs font-semibold text-forge-300">Article Title</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. 2026 Kubernetes Multi-Cluster Observability"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-forge-950 border border-forge-800 rounded-lg text-forge-100 focus:outline-none focus:border-seafoam-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-forge-300">Target Keyword Term</label>
                <input
                  required
                  type="text"
                  placeholder="kubernetes observability enterprise"
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-forge-950 border border-forge-800 rounded-lg text-forge-100 focus:outline-none focus:border-seafoam-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button variant="ghost" size="sm" type="button" onClick={() => setCreateModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Generate Structured Brief
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
