"use client";

import React from "react";
import { History, ShieldCheck, Search, Filter, Lock } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/context/app-context";

export default function AuditLogsPage() {
  const { currentOrg } = useApp();

  const auditEvents = [
    { id: "log_1", user: "Elena Rostova", role: "OWNER", action: "CONNECTOR_SYNC_REFRESH", resource: "Google Search Console (OAuth)", ip: "198.51.100.42", time: "14 mins ago" },
    { id: "log_2", user: "Marcus Vance", role: "ADMIN", action: "PROJECT_SETTINGS_UPDATE", resource: "Apex Cloud (apexcloud.io)", ip: "198.51.100.89", time: "1 hour ago" },
    { id: "log_3", user: "Priya Nair", role: "ANALYST", action: "KEYWORD_COLLECTION_CREATED", resource: "Collection: 'K8s Observability'", ip: "203.0.113.12", time: "3 hours ago" },
    { id: "log_4", user: "Liam Chen", role: "ANALYST", action: "CONTENT_BRIEF_GENERATED", resource: "Brief: 'FinOps Cost Allocation'", ip: "203.0.113.19", time: "5 hours ago" },
    { id: "log_5", user: "Marcus Vance", role: "ADMIN", action: "CRAWL_AUDIT_TRIGGERED", resource: "45 URLs via SignalForgeBot", ip: "198.51.100.89", time: "12 hours ago" },
    { id: "log_6", user: "Elena Rostova", role: "OWNER", action: "ROLE_PERMISSION_CHANGED", resource: "David Alvarez -> VIEWER", ip: "198.51.100.42", time: "1 day ago" },
    { id: "log_7", user: "System Scheduler", role: "SYSTEM", action: "SCHEDULED_REPORT_DISPATCHED", resource: "Weekly Brief to stakeholders@apexcloud.io", ip: "10.0.4.12", time: "2 days ago" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-forge-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase text-forge-400">SECURITY & COMPLIANCE</span>
            <span className="text-forge-600">•</span>
            <span className="text-xs font-mono text-seafoam-400">{currentOrg.name}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-forge-50">
            Immutable Audit Trail & Activity Logs
          </h1>
          <p className="text-xs text-forge-400 mt-1">
            Tamper-evident logs of all security actions, configuration changes, crawler executions, and provider sync events.
          </p>
        </div>

        <Badge variant="seafoam" size="sm" className="font-mono">
          SOC2 Type II Log Retention
        </Badge>
      </div>

      {/* Log Table */}
      <Card className="p-0 overflow-hidden border-forge-800">
        <div className="p-4 border-b border-forge-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-forge-100">Enterprise Activity Stream</h3>
          <span className="text-xs text-forge-400 font-mono">Retained for 365 Days</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="bg-forge-950 border-b border-forge-800 text-forge-400 text-[11px]">
                <th className="py-3 px-4 font-sans">Timestamp</th>
                <th className="py-3 px-3 font-sans">User & Role</th>
                <th className="py-3 px-3">Action Event</th>
                <th className="py-3 px-3 font-sans">Target Resource</th>
                <th className="py-3 px-4 text-right">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forge-800/60 bg-forge-900/60">
              {auditEvents.map((log) => (
                <tr key={log.id} className="hover:bg-forge-850/50">
                  <td className="py-3 px-4 text-forge-400">{log.time}</td>
                  <td className="py-3 px-3 font-sans">
                    <span className="font-bold text-forge-100 block">{log.user}</span>
                    <span className="text-[10px] text-seafoam-400 font-mono">{log.role}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-forge-200 font-bold">{log.action}</span>
                  </td>
                  <td className="py-3 px-3 font-sans text-forge-300">
                    {log.resource}
                  </td>
                  <td className="py-3 px-4 text-right text-forge-400">
                    {log.ip}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
