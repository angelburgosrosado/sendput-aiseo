"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import {
  Eye,
  TrendingUp,
  Monitor,
  Smartphone,
  Sparkles,
  Layers,
  ArrowUp,
  ArrowDown,
  Calendar,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { useApp } from "@/lib/context/app-context";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SyntheticBadge } from "@/components/ui/synthetic-badge";
import { demoRankingObservations, demoKeywords } from "@/lib/demo-data";

export default function VisibilityPage() {
  const params = useParams();
  const projectId = (params?.projectId as string) || "proj_apex_cloud";
  const { dateRange } = useApp();
  const [selectedDevice, setSelectedDevice] = useState<"ALL" | "DESKTOP" | "MOBILE">("ALL");

  // Format 90 days observations into daily average rankings
  const chartObservations = [
    { day: "Day -90", avgRank: 16.4, top3Count: 8, top10Count: 38 },
    { day: "Day -75", avgRank: 15.2, top3Count: 11, top10Count: 44 },
    { day: "Day -60", avgRank: 14.8, top3Count: 12, top10Count: 49 },
    { day: "Day -45", avgRank: 13.9, top3Count: 15, top10Count: 56 },
    { day: "Day -30", avgRank: 12.5, top3Count: 19, top10Count: 68 },
    { day: "Day -15", avgRank: 11.8, top3Count: 22, top10Count: 79 },
    { day: "Today", avgRank: 9.8, top3Count: 28, top10Count: 94 },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-forge-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase text-forge-400">RANK TRACKING & VISIBILITY</span>
            <span className="text-forge-600">•</span>
            <span className="text-xs font-mono text-seafoam-400">90-Day Observation Window</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-forge-50">
            SERP Trajectory & Position Distribution
          </h1>
          <p className="text-xs text-forge-400 mt-1">
            Analyzing long-term organic rank evolution across Desktop and Mobile viewports.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <SyntheticBadge />
        </div>
      </div>

      {/* Tier Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-forge-900 border-forge-800">
          <span className="text-xs font-mono text-forge-400 uppercase">Top 1–3 Positions</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-seafoam-300">28</span>
            <span className="text-xs text-seafoam-400 font-mono">+6 this month</span>
          </div>
          <p className="text-[11px] text-forge-400 mt-1">Dominant click-share cluster</p>
        </Card>

        <Card className="p-4 bg-forge-900 border-forge-800">
          <span className="text-xs font-mono text-forge-400 uppercase">Top 4–10 Positions</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-forge-100">66</span>
            <span className="text-xs text-seafoam-400 font-mono">+12 this month</span>
          </div>
          <p className="text-[11px] text-forge-400 mt-1">Page 1 high-opportunity terms</p>
        </Card>

        <Card className="p-4 bg-forge-900 border-forge-800">
          <span className="text-xs font-mono text-forge-400 uppercase">Top 11–20 (Striking Distance)</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-amber-300">84</span>
            <span className="text-xs text-forge-400 font-mono">Page 2 threshold</span>
          </div>
          <p className="text-[11px] text-forge-400 mt-1">Target for internal link boosts</p>
        </Card>

        <Card className="p-4 bg-forge-900 border-forge-800">
          <span className="text-xs font-mono text-forge-400 uppercase">Average Rank Across Corpus</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-forge-100">#9.8</span>
            <span className="text-xs text-seafoam-400 font-mono">+4.1 spots improved</span>
          </div>
          <p className="text-[11px] text-forge-400 mt-1">Weighted by search volume</p>
        </Card>
      </div>

      {/* 90-Day Trend Chart */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-base font-bold text-forge-100">90-Day Rank Trajectory Curve</h3>
            <p className="text-xs text-forge-400">Lower average position indicates higher search engine placement.</p>
          </div>

          <div className="flex items-center gap-2">
            {(["ALL", "DESKTOP", "MOBILE"] as const).map((dev) => (
              <button
                key={dev}
                onClick={() => setSelectedDevice(dev)}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  selectedDevice === dev
                    ? "bg-seafoam-600 text-forge-950 font-semibold"
                    : "bg-forge-800 text-forge-300 hover:text-forge-100"
                }`}
              >
                {dev}
              </button>
            ))}
          </div>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartObservations} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F293D" vertical={false} />
              <XAxis dataKey="day" stroke="#94A3B8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} domain={[5, 20]} reversed />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0B0F19",
                  borderColor: "#1F293D",
                  borderRadius: "8px",
                  fontSize: "12px",
                  color: "#F4F7FD",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
              <Line
                type="monotone"
                dataKey="avgRank"
                name="Average SERP Rank (Inverted)"
                stroke="#14B8A6"
                strokeWidth={3}
                dot={{ r: 4, fill: "#14B8A6" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 pt-3 border-t border-forge-800 flex items-center justify-between text-xs text-forge-400">
          <span>Continuous daily snapshots recorded via licensed index APIs and verified search signals.</span>
          <span className="font-mono text-seafoam-400">90 Days Indexed</span>
        </div>
      </Card>
    </div>
  );
}
