import React from "react";
import { Sparkles, Info } from "lucide-react";

interface SyntheticBadgeProps {
  label?: string;
  tooltip?: string;
  className?: string;
}

export function SyntheticBadge({
  label = "Modeled Metric",
  tooltip = "This metric is statistically modeled from calibrated samples and synthetic signals. Real-world verification requires authorized provider connections.",
  className = "",
}: SyntheticBadgeProps) {
  return (
    <div
      className={`group relative inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-forge-800/80 text-amber-300 border border-amber-500/30 cursor-help ${className}`}
      title={tooltip}
    >
      <Sparkles className="w-2.5 h-2.5 text-amber-400" />
      <span>{label}</span>
      <Info className="w-2.5 h-2.5 text-amber-500/70 ml-0.5" />

      {/* Tooltip on hover */}
      <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden w-52 p-2 bg-forge-950 border border-forge-700 text-[11px] text-forge-200 rounded shadow-xl group-hover:block z-50">
        <p className="font-semibold text-amber-300 mb-0.5">Synthetic & Modeled Data</p>
        <p className="text-forge-400 leading-tight">{tooltip}</p>
      </div>
    </div>
  );
}
