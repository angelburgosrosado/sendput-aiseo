"use client";

import React, { useState } from "react";
import {
  Search,
  Building2,
  FolderGit2,
  Calendar,
  Bell,
  CheckCircle2,
  Shield,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { useApp } from "@/lib/context/app-context";
import { Badge } from "@/components/ui/badge";

export function TopBar() {
  const {
    organizations,
    currentOrg,
    setCurrentOrg,
    projects,
    currentProject,
    setCurrentProject,
    currentUser,
    userRole,
    setUserRole,
    dateRange,
    setDateRange,
    setCommandPaletteOpen,
    isModeledDataMode,
  } = useApp();

  const [orgDropdownOpen, setOrgDropdownOpen] = useState(false);
  const [projectDropdownOpen, setProjectDropdownOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const notifications = [
    { id: 1, title: "AI Citation Spike: +14.2%", desc: "Perplexity now references Apex Cloud on 'kubernetes observability'.", time: "12m ago", unread: true },
    { id: 2, title: "Audit Crawl Complete", desc: "45 pages analyzed. 2 high severity canonical issues identified.", time: "1h ago", unread: true },
    { id: 3, title: "New Top 3 Keyword", desc: "'hybrid cloud governance enterprise' jumped from #5 to #2.", time: "3h ago", unread: false },
  ];

  return (
    <header className="h-16 border-b border-forge-800 bg-forge-950/90 backdrop-blur-md px-6 flex items-center justify-between gap-4 sticky top-0 z-40">
      {/* Left: Organization & Project Selectors */}
      <div className="flex items-center gap-3">
        {/* Organization Switcher */}
        <div className="relative">
          <button
            onClick={() => {
              setOrgDropdownOpen(!orgDropdownOpen);
              setProjectDropdownOpen(false);
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-forge-900 border border-forge-800 hover:border-forge-700 text-xs font-medium text-forge-100 transition-colors"
          >
            <Building2 className="w-3.5 h-3.5 text-seafoam-400" />
            <span className="max-w-[130px] truncate">{currentOrg.name}</span>
            <ChevronDown className="w-3 h-3 text-forge-400" />
          </button>

          {orgDropdownOpen && (
            <div className="absolute left-0 mt-1.5 w-60 bg-forge-900 border border-forge-750 rounded-xl shadow-2xl p-1.5 z-50">
              <div className="px-2 py-1 text-[10px] font-mono uppercase text-forge-400 border-b border-forge-800 mb-1">
                Select Organization
              </div>
              {organizations.map((org) => (
                <button
                  key={org.id}
                  onClick={() => {
                    setCurrentOrg(org);
                    setOrgDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs text-left transition-colors ${
                    org.id === currentOrg.id
                      ? "bg-seafoam-950/80 text-seafoam-300 font-semibold"
                      : "text-forge-200 hover:bg-forge-800"
                  }`}
                >
                  <span className="truncate">{org.name}</span>
                  <Badge variant="outline" size="sm" className="text-[10px] uppercase">
                    {org.tier}
                  </Badge>
                </button>
              ))}
            </div>
          )}
        </div>

        <span className="text-forge-700">/</span>

        {/* Project Switcher */}
        <div className="relative">
          <button
            onClick={() => {
              setProjectDropdownOpen(!projectDropdownOpen);
              setOrgDropdownOpen(false);
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-forge-900 border border-forge-800 hover:border-forge-700 text-xs font-medium text-forge-100 transition-colors"
          >
            <FolderGit2 className="w-3.5 h-3.5 text-seafoam-400" />
            <span className="max-w-[150px] truncate">{currentProject?.name}</span>
            <ChevronDown className="w-3 h-3 text-forge-400" />
          </button>

          {projectDropdownOpen && (
            <div className="absolute left-0 mt-1.5 w-64 bg-forge-900 border border-forge-750 rounded-xl shadow-2xl p-1.5 z-50">
              <div className="px-2 py-1 text-[10px] font-mono uppercase text-forge-400 border-b border-forge-800 mb-1">
                Select Property / Project
              </div>
              {projects.map((proj) => (
                <button
                  key={proj.id}
                  onClick={() => {
                    setCurrentProject(proj);
                    setProjectDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs text-left transition-colors ${
                    proj.id === currentProject?.id
                      ? "bg-seafoam-950/80 text-seafoam-300 font-semibold"
                      : "text-forge-200 hover:bg-forge-800"
                  }`}
                >
                  <div className="truncate">
                    <p className="font-medium truncate">{proj.name}</p>
                    <p className="text-[10px] text-forge-400 truncate">{proj.domain}</p>
                  </div>
                  <span className="text-[10px] font-mono text-seafoam-400 ml-2">
                    {proj.sfaiScore} SFAI
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Global Search Bar (Cmd+K trigger) */}
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="hidden md:flex items-center gap-2.5 px-3 py-1.5 bg-forge-900/80 border border-forge-800 hover:border-forge-700 rounded-lg text-xs text-forge-400 hover:text-forge-200 transition-all ml-2"
        >
          <Search className="w-3.5 h-3.5 text-forge-400" />
          <span>Quick search or jump...</span>
          <kbd className="text-[10px] font-mono bg-forge-800 px-1.5 py-0.5 rounded border border-forge-700 text-forge-300">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right: Date Range, Role Switcher, Alerts & User */}
      <div className="flex items-center gap-3">
        {/* Synthetic Data Mode Pill */}
        {isModeledDataMode && (
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-950/50 border border-amber-800/40 text-[11px] text-amber-300">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Modeled Data Mode</span>
          </div>
        )}

        {/* Date Range Selector */}
        <div className="flex items-center bg-forge-900 border border-forge-800 rounded-lg p-0.5 text-xs">
          <Calendar className="w-3.5 h-3.5 text-forge-400 ml-2 mr-1" />
          {(["7d", "30d", "90d"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setDateRange(r)}
              className={`px-2 py-1 rounded font-medium transition-colors ${
                dateRange === r
                  ? "bg-seafoam-600 text-forge-950 font-semibold"
                  : "text-forge-300 hover:text-forge-100"
              }`}
            >
              {r.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Live Workspace Role Switcher */}
        <div className="relative">
          <button
            onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-forge-900 border border-forge-800 hover:border-forge-700 text-xs text-forge-200"
            title="Switch simulated user role to preview permissions"
          >
            <Shield className="w-3.5 h-3.5 text-seafoam-400" />
            <span className="font-mono text-[11px]">{userRole}</span>
            <ChevronDown className="w-3 h-3 text-forge-400" />
          </button>

          {roleDropdownOpen && (
            <div className="absolute right-0 mt-1.5 w-44 bg-forge-900 border border-forge-750 rounded-xl shadow-2xl p-1 z-50">
              <div className="px-2 py-1 text-[10px] font-mono uppercase text-forge-400 border-b border-forge-800 mb-1">
                Preview Workspace Role
              </div>
              {(["OWNER", "ADMIN", "ANALYST", "VIEWER"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    setUserRole(r);
                    setRoleDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs text-left ${
                    userRole === r
                      ? "bg-seafoam-950 text-seafoam-300 font-semibold"
                      : "text-forge-300 hover:bg-forge-800 hover:text-forge-100"
                  }`}
                >
                  <span>{r}</span>
                  {userRole === r && <CheckCircle2 className="w-3 h-3 text-seafoam-400" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
            className="relative p-2 rounded-lg bg-forge-900 border border-forge-800 hover:border-forge-700 text-forge-300 hover:text-forge-100 transition-colors"
            title="Notification Center"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-seafoam-400" />
          </button>

          {notifDropdownOpen && (
            <div className="absolute right-0 mt-1.5 w-80 bg-forge-900 border border-forge-750 rounded-xl shadow-2xl p-2 z-50">
              <div className="flex items-center justify-between px-2 py-1.5 border-b border-forge-800 mb-2">
                <span className="text-xs font-semibold text-forge-100">Live Intelligence Feed</span>
                <span className="text-[10px] font-mono text-seafoam-400">2 New</span>
              </div>
              <div className="space-y-1.5">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-2 rounded-lg text-xs ${
                      n.unread ? "bg-forge-850 border border-forge-750" : "bg-transparent text-forge-400"
                    }`}
                  >
                    <div className="flex items-center justify-between font-medium text-forge-200">
                      <span>{n.title}</span>
                      <span className="text-[10px] text-forge-400">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-forge-300 mt-1 leading-snug">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-forge-800">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-8 h-8 rounded-full border border-seafoam-500/50 object-cover"
          />
          <div className="hidden lg:block text-left text-xs leading-none">
            <p className="font-semibold text-forge-100">{currentUser.name}</p>
            <p className="text-[10px] text-forge-400 mt-0.5">{currentUser.jobTitle}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
