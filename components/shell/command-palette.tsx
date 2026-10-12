"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  FolderGit2,
  KeyRound,
  ShieldCheck,
  Sparkles,
  Link2,
  FileText,
  Plug,
  X,
  ArrowRight,
} from "lucide-react";
import { useApp } from "@/lib/context/app-context";

export function CommandPalette() {
  const router = useRouter();
  const { commandPaletteOpen, setCommandPaletteOpen, projects, setCurrentProject, currentProject } = useApp();
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!commandPaletteOpen) {
      setQuery("");
    }
  }, [commandPaletteOpen]);

  if (!commandPaletteOpen) return null;

  const projectId = currentProject?.id || "proj_apex_cloud";

  const navigationCommands = [
    { title: "Domain Research", category: "Navigation", href: `/app/projects/${projectId}/research`, icon: Search },
    { title: "Keyword Intelligence", category: "Navigation", href: `/app/projects/${projectId}/keywords`, icon: KeyRound },
    { title: "AI Citation Tracker", category: "Navigation", href: `/app/projects/${projectId}/ai-answers`, icon: Sparkles },
    { title: "Technical Site Audits", category: "Navigation", href: `/app/projects/${projectId}/audits`, icon: ShieldCheck },
    { title: "Link Graph & Backlinks", category: "Navigation", href: `/app/projects/${projectId}/backlinks`, icon: Link2 },
    { title: "Content Lab & Briefs", category: "Navigation", href: `/app/projects/${projectId}/content`, icon: FileText },
    { title: "Data Provider Settings", category: "Settings", href: "/app/settings/integrations", icon: Plug },
    { title: "Team & Permissions", category: "Settings", href: "/app/settings/team", icon: FolderGit2 },
  ];

  const filteredCommands = navigationCommands.filter((c) =>
    c.title.toLowerCase().includes(query.toLowerCase())
  );

  const filteredProjects = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.domain.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-forge-900 border border-forge-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-forge-800 bg-forge-950/60">
          <Search className="w-5 h-5 text-seafoam-400 mr-3 shrink-0" />
          <input
            autoFocus
            type="text"
            placeholder="Search projects, keywords, audit reports, or jump to module..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-forge-100 placeholder-forge-400 focus:outline-none"
          />
          <button
            onClick={() => setCommandPaletteOpen(false)}
            className="p-1 rounded text-forge-400 hover:text-forge-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-4">
          {/* Projects Match */}
          {filteredProjects.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[11px] font-mono uppercase text-forge-400 font-semibold">
                Properties & Projects
              </div>
              <div className="space-y-1 mt-1">
                {filteredProjects.map((proj) => (
                  <button
                    key={proj.id}
                    onClick={() => {
                      setCurrentProject(proj);
                      setCommandPaletteOpen(false);
                      router.push(`/app/projects/${proj.id}/research`);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs hover:bg-forge-800 text-forge-200 group transition-colors text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <FolderGit2 className="w-4 h-4 text-seafoam-400" />
                      <div>
                        <span className="font-semibold text-forge-100 block">{proj.name}</span>
                        <span className="text-[10px] text-forge-400">{proj.domain}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-seafoam-400">{proj.sfaiScore} SFAI</span>
                      <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-seafoam-400 transition-opacity" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Commands */}
          {filteredCommands.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[11px] font-mono uppercase text-forge-400 font-semibold">
                Application Modules
              </div>
              <div className="space-y-1 mt-1">
                {filteredCommands.map((cmd, i) => {
                  const Icon = cmd.icon;
                  return (
                    <button
                      key={i}
                      onClick={() => {
                        setCommandPaletteOpen(false);
                        router.push(cmd.href);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs hover:bg-forge-800 text-forge-200 group transition-colors text-left"
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 text-forge-400 group-hover:text-seafoam-400" />
                        <span className="font-medium text-forge-100">{cmd.title}</span>
                      </div>
                      <span className="text-[10px] font-mono text-forge-400">{cmd.category}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 bg-forge-950 border-t border-forge-800 text-[11px] font-mono text-forge-400 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span>Navigation: ↑ ↓</span>
            <span>Select: ↵</span>
            <span>Dismiss: Esc</span>
          </div>
          <span className="text-seafoam-400">SignalForge OmniCommand</span>
        </div>
      </div>
    </div>
  );
}
