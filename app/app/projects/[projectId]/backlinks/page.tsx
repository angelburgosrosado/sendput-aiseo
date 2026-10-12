"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { Link2, ShieldCheck, ArrowUpRight, Globe, Filter, ExternalLink } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SyntheticBadge } from "@/components/ui/synthetic-badge";
import { useApp } from "@/lib/context/app-context";

export default function BacklinksPage() {
  const params = useParams();
  const projectId = (params?.projectId as string) || "proj_apex_cloud";
  const { currentProject } = useApp();

  const demoDomains = [
    { domain: "techcrunch.com", authority: 92.4, links: 14, dofollow: true, firstSeen: "2025-01-12", ip: "192.0.78.24" },
    { domain: "github.com", authority: 96.1, links: 48, dofollow: true, firstSeen: "2025-01-18", ip: "140.82.112.4" },
    { domain: "kubernetes.io", authority: 88.5, links: 9, dofollow: true, firstSeen: "2025-02-04", ip: "147.75.40.148" },
    { domain: "cncf.io", authority: 85.0, links: 12, dofollow: true, firstSeen: "2025-02-15", ip: "104.18.22.42" },
    { domain: "stackoverflow.com", authority: 91.0, links: 31, dofollow: false, firstSeen: "2025-02-28", ip: "151.101.65.69" },
    { domain: "news.ycombinator.com", authority: 89.2, links: 22, dofollow: false, firstSeen: "2025-03-02", ip: "209.216.230.240" },
    { domain: "dev.to", authority: 79.4, links: 18, dofollow: true, firstSeen: "2025-03-14", ip: "151.101.1.91" },
    { domain: "medium.com", authority: 84.6, links: 27, dofollow: true, firstSeen: "2025-03-22", ip: "162.159.152.4" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-forge-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase text-forge-400">LINK GRAPH & EQUITY</span>
            <span className="text-forge-600">•</span>
            <span className="text-xs font-mono text-seafoam-400">{currentProject?.domain}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-forge-50">
            Referring Domains & Link Architecture
          </h1>
          <p className="text-xs text-forge-400 mt-1">
            Mapping authoritative incoming equity, anchor text distributions, and dofollow purity.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <SyntheticBadge />
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-forge-900 border-forge-800">
          <span className="text-xs font-mono text-forge-400 uppercase">Referring Domains</span>
          <p className="text-2xl font-bold text-forge-100 mt-1">428</p>
          <span className="text-[11px] text-seafoam-400 font-mono">+14 new this month</span>
        </Card>
        <Card className="p-4 bg-forge-900 border-forge-800">
          <span className="text-xs font-mono text-forge-400 uppercase">Total Inbound Backlinks</span>
          <p className="text-2xl font-bold text-forge-100 mt-1">3,490</p>
          <span className="text-[11px] text-seafoam-400 font-mono">92% active status</span>
        </Card>
        <Card className="p-4 bg-forge-900 border-forge-800">
          <span className="text-xs font-mono text-forge-400 uppercase">Dofollow Ratio</span>
          <p className="text-2xl font-bold text-seafoam-300 mt-1">78.4%</p>
          <span className="text-[11px] text-forge-400 font-mono">Optimal natural curve</span>
        </Card>
        <Card className="p-4 bg-forge-900 border-forge-800">
          <span className="text-xs font-mono text-forge-400 uppercase">Average Link Authority</span>
          <p className="text-2xl font-bold text-amber-300 mt-1">74.2</p>
          <span className="text-[11px] text-forge-400 font-mono">High enterprise trust</span>
        </Card>
      </div>

      {/* Domains Table */}
      <Card className="p-0 overflow-hidden border-forge-800">
        <div className="p-4 border-b border-forge-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-forge-100">Top Authoritative Referring Domains</h3>
          <span className="text-xs text-forge-400 font-mono">Sampled from index feeds</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="bg-forge-950 border-b border-forge-800 text-forge-400 text-[11px]">
                <th className="py-3 px-4">Referring Domain</th>
                <th className="py-3 px-3 text-right">Domain Authority</th>
                <th className="py-3 px-3 text-right">Active Links</th>
                <th className="py-3 px-3">Follow Equity</th>
                <th className="py-3 px-3">First Seen</th>
                <th className="py-3 px-4 text-right">Server Subnet</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forge-800/60 bg-forge-900/60">
              {demoDomains.map((d, i) => (
                <tr key={i} className="hover:bg-forge-850/50">
                  <td className="py-3 px-4 font-bold text-forge-100 font-sans">{d.domain}</td>
                  <td className="py-3 px-3 text-right font-bold text-seafoam-400">{d.authority}</td>
                  <td className="py-3 px-3 text-right text-forge-200">{d.links}</td>
                  <td className="py-3 px-3">
                    <Badge variant={d.dofollow ? "seafoam" : "outline"} size="sm" className="text-[10px]">
                      {d.dofollow ? "DOFOLLOW" : "NOFOLLOW"}
                    </Badge>
                  </td>
                  <td className="py-3 px-3 text-forge-400 text-[11px]">{d.firstSeen}</td>
                  <td className="py-3 px-4 text-right text-forge-400 text-[11px]">{d.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
