"use client";

import React, { useState } from "react";
import { Users2, Plus, Shield, CheckCircle2, Mail, Lock, X } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/context/app-context";
import { demoUsers } from "@/lib/demo-data";

export default function TeamPage() {
  const { currentOrg, canManageTeam, userRole } = useApp();
  const [members, setMembers] = useState(demoUsers);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("ANALYST");

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    setInviteModalOpen(false);
  };

  const roleDefinitions = [
    { role: "OWNER", scope: "Full control over organization billing, member management, and external API/provider credentials." },
    { role: "ADMIN", scope: "Can create and configure projects, properties, crawl schedules, and manage team members." },
    { role: "ANALYST", scope: "Can perform keyword research, generate content briefs, create reports, and run audits." },
    { role: "VIEWER", scope: "Read-only access to existing project dashboards, reports, and search intelligence." },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-forge-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase text-forge-400">ORGANIZATION SETTINGS</span>
            <span className="text-forge-600">•</span>
            <span className="text-xs font-mono text-seafoam-400">{currentOrg.name}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-forge-50">
            Team Members & Role Access Control
          </h1>
          <p className="text-xs text-forge-400 mt-1">
            Manage organization members, assign granular workspace privileges, and invite stakeholders.
          </p>
        </div>

        {canManageTeam && (
          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="w-3.5 h-3.5" />}
            onClick={() => setInviteModalOpen(true)}
          >
            Invite Member
          </Button>
        )}
      </div>

      {/* Role Definitions Card */}
      <Card className="p-6 space-y-4 bg-forge-900 border-forge-800">
        <CardHeader
          title="Role Governance Matrix"
          subtitle="Granular permissions enforced across SignalForge APIs and routes"
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {roleDefinitions.map((rd, i) => (
            <div key={i} className="p-4 rounded-xl bg-forge-950 border border-forge-800 space-y-1.5">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-seafoam-400" />
                <span className="text-xs font-bold text-forge-100 font-mono">{rd.role}</span>
              </div>
              <p className="text-[11px] text-forge-400 leading-snug">{rd.scope}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Members Table */}
      <Card className="p-0 overflow-hidden border-forge-800">
        <div className="p-4 border-b border-forge-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-forge-100">Active Organization Members</h3>
          <span className="text-xs text-forge-400 font-mono">{members.length} Members</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-forge-950 border-b border-forge-800 text-forge-400 font-mono text-[11px]">
                <th className="py-3 px-4">Member</th>
                <th className="py-3 px-3">Corporate Email</th>
                <th className="py-3 px-3">Title</th>
                <th className="py-3 px-3">Assigned Role</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forge-800/60 bg-forge-900/60">
              {members.map((m) => (
                <tr key={m.id} className="hover:bg-forge-850/50">
                  <td className="py-3 px-4 flex items-center gap-2.5">
                    <img
                      src={m.avatar}
                      alt={m.name}
                      className="w-7 h-7 rounded-full object-cover border border-forge-700"
                    />
                    <span className="font-semibold text-forge-100">{m.name}</span>
                  </td>
                  <td className="py-3 px-3 font-mono text-forge-300">{m.email}</td>
                  <td className="py-3 px-3 text-forge-400">{m.jobTitle}</td>
                  <td className="py-3 px-3">
                    <Badge
                      variant={
                        m.role === "OWNER"
                          ? "seafoam"
                          : m.role === "ADMIN"
                          ? "amber"
                          : "default"
                      }
                      size="sm"
                      className="font-mono text-[10px]"
                    >
                      {m.role}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Button variant="ghost" size="sm" disabled={!canManageTeam} className="text-[11px]">
                      Edit Role
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Invite Modal */}
      {inviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-forge-900 border border-forge-750 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-forge-800">
              <h3 className="text-base font-bold text-forge-100">Invite Team Member</h3>
              <button onClick={() => setInviteModalOpen(false)} className="text-forge-400 hover:text-forge-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleInvite} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-forge-300">Corporate Email</label>
                <input
                  required
                  type="email"
                  placeholder="colleague@apexcloud.io"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-forge-950 border border-forge-800 rounded-lg text-forge-100 focus:outline-none focus:border-seafoam-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-forge-300">Role Privilege Level</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-forge-950 border border-forge-800 rounded-lg text-forge-100 focus:outline-none focus:border-seafoam-500"
                >
                  <option value="ADMIN">Admin (Projects & Team configuration)</option>
                  <option value="ANALYST">Analyst (Research, Briefs & Audits)</option>
                  <option value="VIEWER">Viewer (Read-Only access)</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button variant="ghost" size="sm" type="button" onClick={() => setInviteModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Send Invitation Link
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
