import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { SyntheticBadge } from "./synthetic-badge";

interface MetricCardProps {
  label: string;
  value: string | number;
  change?: number; // e.g. +3.2 or -1.5
  changeLabel?: string;
  suffix?: string;
  subtext?: string;
  isSynthetic?: boolean;
  icon?: React.ReactNode;
  accentColor?: "seafoam" | "amber" | "cyan" | "purple";
}

export function MetricCard({
  label,
  value,
  change,
  changeLabel = "vs last period",
  suffix = "",
  subtext,
  isSynthetic = true,
  icon,
  accentColor = "seafoam",
}: MetricCardProps) {
  const accentBorders = {
    seafoam: "border-l-seafoam-500",
    amber: "border-l-amber-500",
    cyan: "border-l-cyan-500",
    purple: "border-l-purple-500",
  };

  return (
    <div className={`bg-forge-900 border border-forge-800 border-l-4 ${accentBorders[accentColor]} rounded-xl p-4 shadow-card hover:border-forge-700/80 transition-all`}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-forge-400 tracking-wide uppercase">{label}</span>
        <div className="flex items-center gap-1.5">
          {isSynthetic && <SyntheticBadge />}
          {icon && <div className="text-forge-400">{icon}</div>}
        </div>
      </div>

      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-2xl font-bold tracking-tight text-forge-50">
          {value}
          {suffix && <span className="text-base font-normal text-forge-400 ml-0.5">{suffix}</span>}
        </span>

        {change !== undefined && (
          <div
            className={`inline-flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded ${
              change > 0
                ? "bg-seafoam-950/80 text-seafoam-400"
                : change < 0
                ? "bg-rose-950/80 text-rose-400"
                : "bg-forge-800 text-forge-400"
            }`}
          >
            {change > 0 ? (
              <TrendingUp className="w-3 h-3" />
            ) : change < 0 ? (
              <TrendingDown className="w-3 h-3" />
            ) : (
              <Minus className="w-3 h-3" />
            )}
            <span>
              {change > 0 ? `+${change}` : change}%
            </span>
          </div>
        )}
      </div>

      {(subtext || changeLabel) && (
        <p className="mt-1 text-[11px] text-forge-400 truncate">
          {subtext || changeLabel}
        </p>
      )}
    </div>
  );
}
