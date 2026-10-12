"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderGit2,
  Search,
  KeyRound,
  Eye,
  ShieldCheck,
  Link2,
  FileText,
  Sparkles,
  MapPin,
  FileSpreadsheet,
  Plug,
  Users2,
  History,
  Radio,
  ExternalLink,
} from "lucide-react";
import { useApp } from "@/lib/context/app-context";
import { Badge } from "@/components/ui/badge";

export function AppSidebar() {
  const pathname = usePathname();
  const { currentProject, userRole } = useApp();

  const projectId = currentProject?.id || "proj_apex_cloud";

  const navigationModules = [
    {
      group: "Core Workspace",
      items: [
        {
          name: "Executive Overview",
          href: "/app/overview",
          icon: LayoutDashboard,
        },
        {
          name: "Projects Directory",
          href: "/app/projects",
          icon: FolderGit2,
        },
      ],
    },
    {
      group: `Active Project: ${currentProject?.name || "Apex Cloud"}`,
      items: [
        {
          name: "Domain Research",
          href: `/app/projects/${projectId}/research`,
          icon: Search,
        },
        {
          name: "Keyword Intelligence",
          href: `/app/projects/${projectId}/keywords`,
          icon: KeyRound,
          badge: "320",
        },
        {
          name: "SERP & Rank Tracking",
          href: `/app/projects/${projectId}/visibility`,
          icon: Eye,
        },
        {
          name: "AI Citation Tracker",
          href: `/app/projects/${projectId}/ai-answers`,
          icon: Sparkles,
          badge: "AI",
        },
        {
          name: "Technical Site Audit",
          href: `/app/projects/${projectId}/audits`,
          icon: ShieldCheck,
        },
        {
          name: "Link Graph & Backlinks",
          href: `/app/projects/${projectId}/backlinks`,
          icon: Link2,
        },
        {
          name: "Content Lab & Briefs",
          href: `/app/projects/${projectId}/content`,
          icon: FileText,
        },
        {
          name: "Local Presence",
          href: `/app/projects/${projectId}/local`,
          icon: MapPin,
        },
        {
          name: "Reports & Exports",
          href: `/app/projects/${projectId}/reports`,
          icon: FileSpreadsheet,
        },
      ],
    },
    {
      group: "Administration & Connectors",
      items: [
        {
          name: "Authorized Providers",
          href: "/app/settings/integrations",
          icon: Plug,
          badge: "8",
        },
        {
          name: "Team & Role Access",
          href: "/app/settings/team",
          icon: Users2,
        },
        {
          name: "Audit Logs",
          href: "/app/settings/audit-logs",
          icon: History,
        },
      ],
    },
  ];

  return (
    <aside className="w-64 shrink-0 bg-forge-950 border-r border-forge-800/80 flex flex-col h-screen sticky top-0 select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-forge-800/80 bg-forge-950/60">
        <Link href="/app/overview" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-seafoam-500/10 border border-seafoam-500/40 flex items-center justify-center text-seafoam-400 group-hover:border-seafoam-400 transition-colors">
            <Radio className="w-4 h-4 text-seafoam-400 animate-pulse" />
          </div>
          <div>
            <span className="font-bold tracking-tight text-forge-50 text-base">SignalForge</span>
            <span className="block text-[10px] text-forge-400 uppercase tracking-widest font-mono">Enterprise AI/SEO</span>
          </div>
        </Link>

        <Badge variant="seafoam" size="sm" className="font-mono text-[9px]">
          v2.4
        </Badge>
      </div>

      {/* Active Project Banner */}
      <div className="px-4 py-2.5 bg-forge-900/60 border-b border-forge-800/60 text-xs flex items-center justify-between">
        <div className="truncate">
          <span className="text-[10px] uppercase font-mono text-forge-400 block">Current Property</span>
          <span className="font-semibold text-forge-100 truncate block">{currentProject?.domain}</span>
        </div>
        <a
          href={`https://${currentProject?.domain}`}
          target="_blank"
          rel="noreferrer"
          className="text-forge-400 hover:text-seafoam-300 p-1"
          title="Open client property"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navigationModules.map((grp, idx) => (
          <div key={idx} className="space-y-1">
            <div className="px-3 pb-1 text-[10px] font-mono font-semibold tracking-wider uppercase text-forge-400 truncate">
              {grp.group}
            </div>

            {grp.items.map((item) => {
              const isActive = pathname === item.href || (item.href.includes("/projects/") && pathname.startsWith(item.href));
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group ${
                    isActive
                      ? "bg-seafoam-950/70 text-seafoam-300 border border-seafoam-800/60 shadow-sm"
                      : "text-forge-300 hover:text-forge-100 hover:bg-forge-900/80"
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive ? "text-seafoam-400" : "text-forge-400 group-hover:text-forge-200"
                      }`}
                    />
                    <span className="truncate">{item.name}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                        isActive
                          ? "bg-seafoam-900/80 text-seafoam-200"
                          : "bg-forge-850 text-forge-400"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Role Footer */}
      <div className="p-3 border-t border-forge-800/80 bg-forge-900/40 text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-seafoam-400" />
            <span className="text-[11px] font-mono text-forge-400">ROLE: {userRole}</span>
          </div>
          <span className="text-[10px] font-mono text-forge-500">GDPR & SOC2</span>
        </div>
      </div>
    </aside>
  );
}
