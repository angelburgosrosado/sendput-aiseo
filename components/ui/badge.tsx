import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "seafoam" | "amber" | "outline" | "danger" | "purple";
  className?: string;
  size?: "sm" | "md";
}

export function Badge({
  children,
  variant = "default",
  className = "",
  size = "md",
}: BadgeProps) {
  const base = "inline-flex items-center font-medium rounded-full transition-colors";
  const sizeClasses = size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs";

  const variants = {
    default: "bg-forge-800 text-forge-200 border border-forge-700",
    seafoam: "bg-seafoam-950/80 text-seafoam-300 border border-seafoam-700/50",
    amber: "bg-amber-950/80 text-amber-300 border border-amber-700/50",
    danger: "bg-rose-950/80 text-rose-300 border border-rose-800/50",
    purple: "bg-purple-950/80 text-purple-300 border border-purple-800/50",
    outline: "border border-forge-700 text-forge-300 hover:bg-forge-800/50",
  };

  return (
    <span className={`${base} ${sizeClasses} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
