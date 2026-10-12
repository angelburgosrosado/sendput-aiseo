"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import {
  FileSpreadsheet,
  Download,
  Calendar,
  Clock,
  Plus,
  CheckCircle2,
  Share2,
  FileText,
} from "lucide-react";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SyntheticBadge } from "@/components/ui/synthetic-badge";
import { useApp } from "@/lib/context/app-context";
import { demoReports } from "@/lib/demo-data";

export default function ReportsPage() {
  const params = useParams();
  const { currentProject } = useApp();
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleDownload = (id: string) => {
    setDownloadingId(id);
    setTimeout(() => {
      setDownloadingId(null);
    }, 1200);
  };

  const scheduled = [
    { title: "Weekly Executive Search & AI Briefing", freq: "Weekly (Every Monday 08:00 UTC)", recipients: "stakeholders@apexcloud.io", nextRun: "In 2 days" },
    { title: "Monthly Core Web Vitals & THQ Deep Dive", freq: "Monthly (1st of month)", recipients: "engineering@apexcloud.io", nextRun: "Nov 01, 2026" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-forge-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase text-forge-400">EXECUTIVE REPORTING & EXPORTS</span>
            <span className="text-forge-600">•</span>
            <span className="text-xs font-mono text-seafoam-400">{currentProject?.name}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-forge-50">
            Reports & Scheduled Distributions
          </h1>
          <p className="text-xs text-forge-400 mt-1">
            Automated PDF summaries, CSV raw data exports, and recurring email reports for leadership.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <SyntheticBadge />
          <Button variant="primary" size="sm" icon={<Plus className="w-3.5 h-3.5" />}>
            Create Scheduled Delivery
          </Button>
        </div>
      </div>

      {/* Generated Reports Table */}
      <Card className="p-0 overflow-hidden border-forge-800">
        <div className="p-4 border-b border-forge-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-forge-100">Archived Intelligence Reports</h3>
          <span className="text-xs text-forge-400 font-mono">Available for instant download</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="bg-forge-950 border-b border-forge-800 text-forge-400 text-[11px]">
                <th className="py-3 px-4 font-sans">Report Title</th>
                <th className="py-3 px-3">Report Category</th>
                <th className="py-3 px-3">Date Window</th>
                <th className="py-3 px-3">Generated Date</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forge-800/60 bg-forge-900/60">
              {demoReports.map((rep) => (
                <tr key={rep.id} className="hover:bg-forge-850/50">
                  <td className="py-3 px-4 font-bold text-forge-100 font-sans">{rep.title}</td>
                  <td className="py-3 px-3">
                    <Badge variant="outline" size="sm" className="text-[10px]">
                      {rep.type}
                    </Badge>
                  </td>
                  <td className="py-3 px-3 text-forge-300">{rep.dateRange}</td>
                  <td className="py-3 px-3 text-forge-400">{rep.generatedAt}</td>
                  <td className="py-3 px-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<Download className="w-3.5 h-3.5" />}
                      disabled={downloadingId === rep.id}
                      onClick={() => handleDownload(rep.id)}
                    >
                      {downloadingId === rep.id ? "Generating PDF..." : "Download"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Recurring Schedules */}
      <Card className="p-6 space-y-4">
        <CardHeader
          title="Active Automated Distributions"
          subtitle="Recurring emails delivering executive dashboards"
        />

        <div className="space-y-3">
          {scheduled.map((s, i) => (
            <div key={i} className="p-4 rounded-xl bg-forge-950 border border-forge-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <span className="font-bold text-forge-100 block">{s.title}</span>
                <span className="text-forge-400 font-mono text-[11px] block">{s.freq} • To: {s.recipients}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-seafoam-400 font-mono text-[11px]">Next: {s.nextRun}</span>
                <Button variant="outline" size="sm">Edit Schedule</Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
