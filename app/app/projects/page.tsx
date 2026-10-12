"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FolderGit2,
  Plus,
  Search,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  ArrowRight,
  X,
} from "lucide-react";
import { useApp } from "@/lib/context/app-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SyntheticBadge } from "@/components/ui/synthetic-badge";

export default function ProjectsPage() {
  const { projects, setCurrentProject, canEdit } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    name: "",
    domain: "",
    country: "US",
    description: "",
  });

  const filtered = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.domain.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.name || !newProject.domain) return;
    setModalOpen(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-forge-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-forge-50 tracking-tight">
            Projects & Tracked Domains
          </h1>
          <p className="text-xs text-forge-400 mt-1">
            Enterprise properties currently monitored for organic rank shifts and generative AI citations.
          </p>
        </div>

        {canEdit && (
          <Button
            variant="primary"
            size="md"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setModalOpen(true)}
          >
            Add New Property
          </Button>
        )}
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-forge-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Filter projects by name or domain..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-forge-900 border border-forge-800 rounded-lg text-forge-100 focus:outline-none focus:border-seafoam-500"
          />
        </div>
        <span className="text-xs text-forge-400 font-mono">
          Showing {filtered.length} of {projects.length} properties
        </span>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((proj) => (
          <Card key={proj.id} hoverable className="p-6 space-y-5 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-forge-100">{proj.name}</h3>
                    <Badge variant="outline" size="sm" className="font-mono text-[10px]">
                      {proj.targetCountry}
                    </Badge>
                  </div>
                  <a
                    href={`https://${proj.domain}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-seafoam-400 hover:underline inline-flex items-center gap-1 font-mono"
                  >
                    <span>{proj.domain}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <Badge
                  variant={proj.status === "ACTIVE" ? "seafoam" : "outline"}
                  size="sm"
                >
                  {proj.status}
                </Badge>
              </div>

              <p className="text-xs text-forge-400 leading-relaxed">
                {proj.description}
              </p>

              {/* 4 Key Metrics */}
              <div className="grid grid-cols-4 gap-2 pt-2 border-t border-forge-800">
                <div className="bg-forge-950 p-2.5 rounded-lg border border-forge-800 text-center">
                  <span className="text-[10px] text-forge-400 font-mono block">SFAI</span>
                  <span className="text-base font-bold text-forge-100">{proj.sfaiScore}</span>
                </div>
                <div className="bg-forge-950 p-2.5 rounded-lg border border-forge-800 text-center">
                  <span className="text-[10px] text-forge-400 font-mono block">DVS</span>
                  <span className="text-base font-bold text-seafoam-400">+{proj.discoveryVelocity}%</span>
                </div>
                <div className="bg-forge-950 p-2.5 rounded-lg border border-forge-800 text-center">
                  <span className="text-[10px] text-forge-400 font-mono block">AI Share</span>
                  <span className="text-base font-bold text-amber-400">{proj.aiCitationShare}%</span>
                </div>
                <div className="bg-forge-950 p-2.5 rounded-lg border border-forge-800 text-center">
                  <span className="text-[10px] text-forge-400 font-mono block">Health</span>
                  <span className="text-base font-bold text-forge-100">{proj.healthQuotient}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-forge-800">
              <SyntheticBadge />
              <Link
                href={`/app/projects/${proj.id}/research`}
                onClick={() => setCurrentProject(proj)}
              >
                <Button variant="secondary" size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />}>
                  Enter Property Dashboard
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>

      {/* Create Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-forge-900 border border-forge-750 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-forge-800">
              <h3 className="text-base font-bold text-forge-100">Add New Property to Track</h3>
              <button onClick={() => setModalOpen(false)} className="text-forge-400 hover:text-forge-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-forge-300">Property Name</label>
                <input
                  required
                  type="text"
                  placeholder="Apex Cloud Storage"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-forge-950 border border-forge-800 rounded-lg text-forge-100 focus:outline-none focus:border-seafoam-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-forge-300">Domain (FQDN)</label>
                <input
                  required
                  type="text"
                  placeholder="storage.apexcloud.io"
                  value={newProject.domain}
                  onChange={(e) => setNewProject({ ...newProject, domain: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-forge-950 border border-forge-800 rounded-lg text-forge-100 focus:outline-none focus:border-seafoam-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-forge-300">Target Country</label>
                <select
                  value={newProject.country}
                  onChange={(e) => setNewProject({ ...newProject, country: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-forge-950 border border-forge-800 rounded-lg text-forge-100 focus:outline-none focus:border-seafoam-500"
                >
                  <option value="US">United States (US)</option>
                  <option value="GB">United Kingdom (GB)</option>
                  <option value="DE">Germany (DE)</option>
                  <option value="SE">Sweden (SE)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-forge-300">Description</label>
                <textarea
                  rows={2}
                  placeholder="Enterprise object storage with zero egress fees..."
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  className="w-full p-2.5 text-xs bg-forge-950 border border-forge-800 rounded-lg text-forge-100 focus:outline-none focus:border-seafoam-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button variant="ghost" size="sm" type="button" onClick={() => setModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Save & Initialize Crawl
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
