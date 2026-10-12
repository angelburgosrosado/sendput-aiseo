"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Radio, Menu, X, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MarketingNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const links = [
    { label: "Features", href: "/features" },
    { label: "Pricing", href: "/pricing" },
    { label: "Security & Trust", href: "/security" },
    { label: "Documentation", href: "/docs" },
    { label: "Contact Sales", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-forge-800/80 bg-forge-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-seafoam-500/10 border border-seafoam-500/30 flex items-center justify-center text-seafoam-400 group-hover:border-seafoam-400 transition-all shadow-glow">
            <Radio className="w-5 h-5 text-seafoam-400" />
          </div>
          <div>
            <span className="font-bold tracking-tight text-forge-50 text-xl">SignalForge</span>
            <span className="block text-[11px] text-forge-400 tracking-wider uppercase font-mono">
              Search & AI Discovery Intelligence
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-forge-300 hover:text-seafoam-300 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
          </Link>
          <Link href="/app/overview">
            <Button variant="primary" size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />}>
              Live Workspace Demo
            </Button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-forge-300 hover:text-forge-100"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-forge-800 bg-forge-950 px-6 py-4 space-y-3">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-forge-200 py-1.5"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-forge-800 flex flex-col gap-2">
            <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" size="sm" className="w-full">
                Sign In
              </Button>
            </Link>
            <Link href="/app/overview" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="primary" size="sm" className="w-full">
                Enter App Shell
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
