import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "amber" | "danger";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  icon,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const base = "inline-flex items-center justify-center font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-seafoam-500/50 disabled:opacity-50 disabled:cursor-not-allowed select-none";

  const sizeClasses = {
    sm: "text-xs px-2.5 py-1.5 rounded-md gap-1.5",
    md: "text-sm px-3.5 py-2 rounded-lg gap-2",
    lg: "text-base px-5 py-2.5 rounded-lg gap-2.5",
  };

  const variantClasses = {
    primary: "bg-seafoam-600 hover:bg-seafoam-500 text-forge-950 font-semibold shadow-sm hover:shadow-glow",
    secondary: "bg-forge-800 hover:bg-forge-750 text-forge-100 border border-forge-700/80 shadow-subtle",
    outline: "border border-forge-700 hover:border-forge-600 text-forge-200 hover:bg-forge-850",
    ghost: "text-forge-300 hover:text-forge-100 hover:bg-forge-800/60",
    amber: "bg-amber-500 hover:bg-amber-400 text-forge-950 font-semibold shadow-sm hover:shadow-glow-amber",
    danger: "bg-rose-600 hover:bg-rose-500 text-white font-medium shadow-sm",
  };

  return (
    <button
      className={`${base} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
}
