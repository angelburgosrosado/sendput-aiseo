"use client";

import React, { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import {
  ShieldCheck,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle2,
  RefreshCw,
  Search,
  ExternalLink,
  Filter,
  FileCode,
} from "lucide-react";
import { useApp } from "@/lib/context/app-context";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SyntheticBadge } from "@/components/ui/synthetic-badge";
import { demoAuditIssues, demoCrawlPages, DemoAuditIssue } from "@/lib/demo-data";

export default function AuditsPage() {
  const params = useParams();
  const projectId = (params?.projectId as string) || "proj_apex_cloud";
  const { currentProject, canEdit } = useApp();

  const [activeTab, setActiveTab] = useState<"issues" | "pages">("issues");
  const [severityFilter, setSeverityFilter] = useState<string>("ALL");
  const [search, setSearch] = useState("");
  const [crawling, setCrawling] = useState(false);

  const issues = useMemo(() => {
    return demoAuditIssues.filter((iss) => {
      const matchProject = iss.projectId === projectId || iss.projectId === "proj_apex_cloud";
      const matchSeverity = severityFilter === "ALL" || iss.severity === severityFilter;
      const matchSearch =
        iss.message.toLowerCase().includes(search.toLowerCase()) ||
        iss.issueType.toLowerCase().includes(search.toLowerCase()) ||
        iss.pageUrl.toLowerCase().includes(search.toLowerCase());

      return matchProject && matchSeverity && matchSearch;
    });
  }, [projectId, severityFilter, search]);

  const crawlPages = useMemo(() => {
    return demoCrawlPages.filter((p) => p.projectId === projectId || p.projectId === "proj_apex_cloud");
  }, [projectId]);

  const handleRunAudit = () => {
    setCrawling(true);
    setTimeout(() => {
      setCrawling(false);
    }, 1800);
  };

  const counts = {
    critical: demoAuditIssues.filter((i) => i.severity === "CRITICAL").length,
    high: demoAuditIssues.filter((i) => i.severity === "HIGH").length,
    medium: demoAuditIssues.filter((i) => i.severity === "MEDIUM").length,
    low: demoAuditIssues.filter((i) => i.severity === "LOW").length,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-forge-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase text-forge-400">TECHNICAL SITE AUDIT & CRAWLER</span>
            <span className="text-forge-600">•</span>
            <span className="text-xs font-mono text-seafoam-400">RFC 9309 Compliant Bot</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-forge-50">
            Technical Health Quotient (THQ) & Hygiene
          </h1>
          <p className="text-xs text-forge-400 mt-1">
            Polite audit analyzing 45 indexable URLs for canonical consistency, HTTP response codes, and Core Web Vitals.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <SyntheticBadge />
          {canEdit && (
            <Button
              variant="primary"
              size="sm"
              icon={<RefreshCw className={`w-3.5 h-3.5 ${crawling ? "animate-spin" : ""}`} />}
              disabled={crawling}
              onClick={handleRunAudit}
            >
              {crawling ? "Crawling Target URLs..." : "Trigger Polite Audit"}
            </Button>
          )}
        </div>
      </div>

      {/* Severity Tiers Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Card className="p-4 bg-forge-900 border-forge-800 border-l-4 border-l-seafoam-500">
          <span className="text-[11px] font-mono text-forge-400 uppercase">Health Quotient</span>
          <p className="text-2xl font-bold text-forge-100 mt-1">{currentProject?.healthQuotient || 94.6} / 100</p>
          <span className="text-[10px] text-seafoam-400 font-mono">Clean Architecture</span>
        </Card>

        <Card className="p-4 bg-forge-900 border-forge-800 border-l-4 border-l-rose-500">
          <span className="text-[11px] font-mono text-rose-400 uppercase">Critical (5)</span>
          <p className="text-2xl font-bold text-rose-300 mt-1">{counts.critical}</p>
          <span className="text-[10px] text-rose-400 font-mono">Immediate Fix Req.</span>
        </Card>

        <Card className="p-4 bg-forge-900 border-forge-800 border-l-4 border-l-amber-500">
          <span className="text-[11px] font-mono text-amber-400 uppercase">High Severity</span>
          <p className="text-2xl font-bold text-amber-300 mt-1">{counts.high}</p>
          <span className="text-[10px] text-amber-400 font-mono">Index Blocks & 404s</span>
        </Card>

        <Card className="p-4 bg-forge-900 border-forge-800 border-l-4 border-l-blue-500">
          <span className="text-[11px] font-mono text-blue-400 uppercase">Medium Severity</span>
          <p className="text-2xl font-bold text-blue-300 mt-1">{counts.medium}</p>
          <span className="text-[10px] text-blue-400 font-mono">Metadata & LCP</span>
        </Card>

        <Card className="p-4 bg-forge-900 border-forge-800 border-l-4 border-l-forge-600">
          <span className="text-[11px] font-mono text-forge-400 uppercase">Pages Crawled</span>
          <p className="text-2xl font-bold text-forge-100 mt-1">45</p>
          <span className="text-[10px] text-seafoam-400 font-mono">100% Robots.txt Valid</span>
        </Card>
      </div>

      {/* Tabs: Issues vs Crawl Pages */}
      <div className="flex items-center justify-between border-b border-forge-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("issues")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === "issues"
                ? "bg-seafoam-600 text-forge-950"
                : "text-forge-300 hover:text-forge-100 hover:bg-forge-900"
            }`}
          >
            Categorized Issues ({issues.length})
          </button>
          <button
            onClick={() => setActiveTab("pages")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === "pages"
                ? "bg-seafoam-600 text-forge-950"
                : "text-forge-300 hover:text-forge-100 hover:bg-forge-900"
            }`}
          >
            Crawled Pages ({crawlPages.length})
          </button>
        </div>

        {activeTab === "issues" && (
          <div className="flex items-center gap-2">
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="px-2.5 py-1 text-xs bg-forge-900 border border-forge-800 rounded-lg text-forge-200"
            >
              <option value="ALL">All Severities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>
        )}
      </div>

      {/* Issues View */}
      {activeTab === "issues" && (
        <div className="space-y-3">
          {issues.map((iss) => (
            <Card key={iss.id} className="p-4 bg-forge-900/80 border-forge-800 space-y-2 hover:border-forge-700">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      iss.severity === "CRITICAL"
                        ? "danger"
                        : iss.severity === "HIGH"
                        ? "amber"
                        : "default"
                    }
                    size="sm"
                    className="font-mono text-[10px]"
                  >
                    {iss.severity}
                  </Badge>
                  <span className="text-xs font-mono text-seafoam-300">{iss.issueType}</span>
                </div>

                <Badge variant={iss.status === "RESOLVED" ? "seafoam" : "outline"} size="sm">
                  {iss.status}
                </Badge>
              </div>

              <p className="text-sm font-semibold text-forge-100">{iss.message}</p>

              <div className="p-2.5 rounded-lg bg-forge-950 border border-forge-800/80 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="truncate">
                  <span className="text-forge-400 mr-2 font-mono text-[11px]">Affected Page:</span>
                  <a
                    href={iss.pageUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-forge-200 hover:text-seafoam-300 underline font-mono text-[11px]"
                  >
                    {iss.pageUrl}
                  </a>
                </div>
                <div className="text-seafoam-400 font-medium shrink-0">
                  Recommendation: {iss.recommendation}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Crawl Pages View */}
      {activeTab === "pages" && (
        <Card className="p-0 overflow-hidden border-forge-800">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-forge-950 border-b border-forge-800 text-forge-400 font-mono text-[11px]">
                  <th className="py-3 px-4">Crawled URL</th>
                  <th className="py-3 px-3 text-right">HTTP Status</th>
                  <th className="py-3 px-3 text-right">Load Time (ms)</th>
                  <th className="py-3 px-3 text-right">Word Count</th>
                  <th className="py-3 px-3">Meta Robots</th>
                  <th className="py-3 px-4">Page Title</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-forge-800/60 bg-forge-900/60 font-mono">
                {crawlPages.map((page) => (
                  <tr key={page.id} className="hover:bg-forge-850/50">
                    <td className="py-3 px-4 text-forge-200 truncate max-w-xs">{page.url}</td>
                    <td className="py-3 px-3 text-right font-bold">
                      <span
                        className={
                          page.statusCode === 200
                            ? "text-seafoam-400"
                            : page.statusCode === 404
                            ? "text-rose-400"
                            : "text-amber-400"
                        }
                      >
                        {page.statusCode}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right text-forge-300">{page.loadTimeMs}ms</td>
                    <td className="py-3 px-3 text-right text-forge-300">{page.wordCount.toLocaleString()}</td>
                    <td className="py-3 px-3 text-forge-400 text-[11px]">{page.metaRobots}</td>
                    <td className="py-3 px-4 text-forge-200 font-sans text-xs truncate max-w-sm">
                      {page.title}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
