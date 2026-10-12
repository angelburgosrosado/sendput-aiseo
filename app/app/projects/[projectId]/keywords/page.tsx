"use client";

import React, { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import {
  KeyRound,
  Search,
  Filter,
  Plus,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Minus,
  Sparkles,
  Download,
  X,
} from "lucide-react";
import { useApp } from "@/lib/context/app-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SyntheticBadge } from "@/components/ui/synthetic-badge";
import { demoKeywords, DemoKeyword } from "@/lib/demo-data";

export default function KeywordsPage() {
  const params = useParams();
  const projectId = (params?.projectId as string) || "proj_apex_cloud";
  const { canEdit } = useApp();

  const [search, setSearch] = useState("");
  const [intentFilter, setIntentFilter] = useState<string>("ALL");
  const [serpFilter, setSerpFilter] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<keyof DemoKeyword>("searchVolume");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const pageSize = 25;

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newKeyword, setNewKeyword] = useState({
    term: "",
    intent: "INFORMATIONAL",
    volume: "1200",
  });

  const filtered = useMemo(() => {
    return demoKeywords.filter((kw) => {
      const matchSearch =
        kw.term.toLowerCase().includes(search.toLowerCase()) ||
        kw.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));

      const matchIntent = intentFilter === "ALL" || kw.intent === intentFilter;

      const matchSerp =
        serpFilter === "ALL" ||
        kw.serpFeatures.includes(serpFilter.toLowerCase());

      return matchSearch && matchIntent && matchSerp;
    });
  }, [search, intentFilter, serpFilter]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let aVal = a[sortBy] ?? 0;
      let bVal = b[sortBy] ?? 0;
      if (typeof aVal === "string") aVal = aVal.toLowerCase();
      if (typeof bVal === "string") bVal = bVal.toLowerCase();

      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [filtered, sortBy, sortOrder]);

  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, page]);

  const totalPages = Math.ceil(sorted.length / pageSize);

  const toggleSort = (field: keyof DemoKeyword) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyword.term) return;
    setAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-forge-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase text-forge-400">KEYWORD DISCOVERY & RANKING</span>
            <span className="text-forge-600">•</span>
            <span className="text-xs font-mono text-seafoam-400">320 Monitored Entities</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-forge-50">
            Keyword Intelligence & Positions
          </h1>
          <p className="text-xs text-forge-400 mt-1">
            Tracking search volumes, SERP features won, difficulty indices, and movement across Google & Bing.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <SyntheticBadge />
          {canEdit && (
            <Button
              variant="primary"
              size="sm"
              icon={<Plus className="w-3.5 h-3.5" />}
              onClick={() => setAddModalOpen(true)}
            >
              Add Keywords
            </Button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-forge-900 border border-forge-800 rounded-xl p-4 space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-forge-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Filter by term or tag (e.g. 'kubernetes', 'finops', 'pricing')..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 text-xs bg-forge-950 border border-forge-800 rounded-lg text-forge-100 focus:outline-none focus:border-seafoam-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            {/* Intent Filter */}
            <select
              value={intentFilter}
              onChange={(e) => {
                setIntentFilter(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 text-xs bg-forge-950 border border-forge-800 rounded-lg text-forge-200 focus:outline-none focus:border-seafoam-500"
            >
              <option value="ALL">All Search Intents</option>
              <option value="INFORMATIONAL">Informational</option>
              <option value="COMMERCIAL">Commercial</option>
              <option value="TRANSACTIONAL">Transactional</option>
              <option value="NAVIGATIONAL">Navigational</option>
            </select>

            {/* SERP Features Filter */}
            <select
              value={serpFilter}
              onChange={(e) => {
                setSerpFilter(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 text-xs bg-forge-950 border border-forge-800 rounded-lg text-forge-200 focus:outline-none focus:border-seafoam-500"
            >
              <option value="ALL">All SERP Features</option>
              <option value="ai_overview">AI Overview</option>
              <option value="featured_snippet">Featured Snippet</option>
              <option value="people_also_ask">People Also Ask</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-forge-400 pt-1 font-mono">
          <span>Found {sorted.length} matching keywords</span>
          <span>Page {page} of {totalPages || 1}</span>
        </div>
      </div>

      {/* Main Table */}
      <Card className="p-0 overflow-hidden border-forge-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-forge-950 border-b border-forge-800 text-forge-400 font-mono text-[11px]">
                <th className="py-3 px-4 cursor-pointer" onClick={() => toggleSort("term")}>
                  <div className="flex items-center gap-1">
                    <span>Keyword Term</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-3 text-right cursor-pointer" onClick={() => toggleSort("currentPosition")}>
                  <div className="flex items-center justify-end gap-1">
                    <span>Position</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-3 text-right cursor-pointer" onClick={() => toggleSort("searchVolume")}>
                  <div className="flex items-center justify-end gap-1">
                    <span>Search Volume</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-3 text-right cursor-pointer" onClick={() => toggleSort("difficultyScore")}>
                  <div className="flex items-center justify-end gap-1">
                    <span>Difficulty (0-100)</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-3 text-right cursor-pointer" onClick={() => toggleSort("cpc")}>
                  <div className="flex items-center justify-end gap-1">
                    <span>CPC (USD)</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-3">Search Intent</th>
                <th className="py-3 px-3">SERP Features</th>
                <th className="py-3 px-4 text-right">Data Model</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forge-800/60 bg-forge-900/60">
              {paginated.map((kw) => {
                const delta = kw.previousPosition - kw.currentPosition;
                return (
                  <tr key={kw.id} className="hover:bg-forge-850/60 transition-colors">
                    {/* Keyword Term & Tags */}
                    <td className="py-3 px-4">
                      <span className="font-semibold text-forge-100 block">{kw.term}</span>
                      <div className="flex items-center gap-1 mt-1">
                        {kw.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-forge-950 text-forge-400 border border-forge-800"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Rank Position & Delta */}
                    <td className="py-3 px-3 text-right font-mono">
                      <div className="inline-flex items-center gap-1.5">
                        <span className="text-sm font-bold text-forge-50">#{kw.currentPosition}</span>
                        {delta > 0 ? (
                          <span className="inline-flex items-center text-seafoam-400 text-[10px]">
                            <ArrowUp className="w-3 h-3" />+{delta}
                          </span>
                        ) : delta < 0 ? (
                          <span className="inline-flex items-center text-rose-400 text-[10px]">
                            <ArrowDown className="w-3 h-3" />{delta}
                          </span>
                        ) : (
                          <span className="text-forge-400 text-[10px]">
                            <Minus className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Volume */}
                    <td className="py-3 px-3 text-right font-mono text-forge-200">
                      {kw.searchVolume.toLocaleString()}
                    </td>

                    {/* Difficulty */}
                    <td className="py-3 px-3 text-right">
                      <div className="inline-flex items-center gap-2">
                        <div className="w-12 bg-forge-950 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              kw.difficultyScore > 70
                                ? "bg-rose-500"
                                : kw.difficultyScore > 45
                                ? "bg-amber-500"
                                : "bg-seafoam-500"
                            }`}
                            style={{ width: `${kw.difficultyScore}%` }}
                          />
                        </div>
                        <span className="font-mono text-xs font-semibold text-forge-200">
                          {kw.difficultyScore}
                        </span>
                      </div>
                    </td>

                    {/* CPC */}
                    <td className="py-3 px-3 text-right font-mono text-forge-300">
                      ${kw.cpc.toFixed(2)}
                    </td>

                    {/* Intent */}
                    <td className="py-3 px-3">
                      <Badge
                        variant={
                          kw.intent === "TRANSACTIONAL"
                            ? "amber"
                            : kw.intent === "COMMERCIAL"
                            ? "seafoam"
                            : kw.intent === "NAVIGATIONAL"
                            ? "purple"
                            : "default"
                        }
                        size="sm"
                        className="text-[10px]"
                      >
                        {kw.intent}
                      </Badge>
                    </td>

                    {/* SERP Features */}
                    <td className="py-3 px-3">
                      <div className="flex flex-wrap gap-1">
                        {kw.serpFeatures.map((feat, idx) => (
                          <span
                            key={idx}
                            className={`text-[9px] font-mono px-1 py-0.5 rounded ${
                              feat === "ai_overview"
                                ? "bg-amber-950/80 text-amber-300 border border-amber-800/40"
                                : "bg-forge-950 text-forge-400 border border-forge-800"
                            }`}
                          >
                            {feat.replace("_", " ")}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Data tag */}
                    <td className="py-3 px-4 text-right">
                      <SyntheticBadge label="Modeled" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        <div className="p-4 border-t border-forge-800 bg-forge-950 flex items-center justify-between text-xs">
          <Button
            variant="ghost"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </Button>
          <span className="text-forge-400 font-mono">
            Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, sorted.length)} of {sorted.length} keywords
          </span>
          <Button
            variant="ghost"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </Button>
        </div>
      </Card>

      {/* Add Keyword Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-forge-900 border border-forge-750 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-forge-800">
              <h3 className="text-base font-bold text-forge-100">Add Keyword to Monitor</h3>
              <button onClick={() => setAddModalOpen(false)} className="text-forge-400 hover:text-forge-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-forge-300">Keyword Term</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. distributed tracing kubernetes platform"
                  value={newKeyword.term}
                  onChange={(e) => setNewKeyword({ ...newKeyword, term: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-forge-950 border border-forge-800 rounded-lg text-forge-100 focus:outline-none focus:border-seafoam-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-forge-300">Search Intent</label>
                <select
                  value={newKeyword.intent}
                  onChange={(e) => setNewKeyword({ ...newKeyword, intent: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-forge-950 border border-forge-800 rounded-lg text-forge-100 focus:outline-none focus:border-seafoam-500"
                >
                  <option value="INFORMATIONAL">Informational</option>
                  <option value="COMMERCIAL">Commercial</option>
                  <option value="TRANSACTIONAL">Transactional</option>
                  <option value="NAVIGATIONAL">Navigational</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button variant="ghost" size="sm" type="button" onClick={() => setAddModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Save & Queue SERP Check
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
