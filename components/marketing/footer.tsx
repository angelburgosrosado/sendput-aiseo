import React from "react";
import Link from "next/link";
import { Radio, ShieldCheck, Lock, CheckCircle2 } from "lucide-react";

export function MarketingFooter() {
  return (
    <footer className="border-t border-forge-800 bg-forge-950 text-forge-400 py-16 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-10">
        {/* Brand statement */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-seafoam-500/10 border border-seafoam-500/30 flex items-center justify-center text-seafoam-400">
              <Radio className="w-4 h-4 text-seafoam-400" />
            </div>
            <span className="font-bold tracking-tight text-forge-100 text-lg">SignalForge</span>
          </div>

          <p className="text-xs text-forge-400 leading-relaxed max-w-sm">
            Search intelligence for teams building durable visibility across web and AI discovery.
            Engineered exclusively with licensed APIs, authorized customer telemetry, and strict ethical standards.
          </p>

          <div className="flex items-center gap-4 text-[11px] font-mono text-forge-400">
            <span className="inline-flex items-center gap-1 text-seafoam-400">
              <ShieldCheck className="w-3.5 h-3.5" /> SOC2 Type II
            </span>
            <span className="inline-flex items-center gap-1 text-seafoam-400">
              <Lock className="w-3.5 h-3.5" /> GDPR & CCPA Compliant
            </span>
          </div>
        </div>

        {/* Product Capabilities */}
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-forge-200 font-mono">Platform</p>
          <ul className="space-y-2 text-xs">
            <li><Link href="/features" className="hover:text-seafoam-300">Domain Research</Link></li>
            <li><Link href="/features" className="hover:text-seafoam-300">Keyword Intelligence</Link></li>
            <li><Link href="/features" className="hover:text-seafoam-300">AI Citation Tracker</Link></li>
            <li><Link href="/features" className="hover:text-seafoam-300">Technical Site Audits</Link></li>
            <li><Link href="/features" className="hover:text-seafoam-300">Link Graph Explorer</Link></li>
            <li><Link href="/features" className="hover:text-seafoam-300">Local Presence</Link></li>
          </ul>
        </div>

        {/* Integration Architecture */}
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-forge-200 font-mono">Connectors</p>
          <ul className="space-y-2 text-xs">
            <li><Link href="/docs" className="hover:text-seafoam-300">Google Search Console</Link></li>
            <li><Link href="/docs" className="hover:text-seafoam-300">Google Analytics 4</Link></li>
            <li><Link href="/docs" className="hover:text-seafoam-300">Bing Webmaster API</Link></li>
            <li><Link href="/docs" className="hover:text-seafoam-300">DataForSEO Index</Link></li>
            <li><Link href="/docs" className="hover:text-seafoam-300">SerpAPI Gateway</Link></li>
            <li><Link href="/security" className="hover:text-seafoam-300">Robots.txt Adherence</Link></li>
          </ul>
        </div>

        {/* Company & Legal */}
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-forge-200 font-mono">Trust & Legal</p>
          <ul className="space-y-2 text-xs">
            <li><Link href="/security" className="hover:text-seafoam-300">Security Architecture</Link></li>
            <li><Link href="/security" className="hover:text-seafoam-300">Ethics & No-Scrape Policy</Link></li>
            <li><Link href="/pricing" className="hover:text-seafoam-300">Subscription Plans</Link></li>
            <li><Link href="/contact" className="hover:text-seafoam-300">Contact Enterprise Sales</Link></li>
            <li><span className="text-forge-500">Privacy Policy</span></li>
            <li><span className="text-forge-500">Terms of Service</span></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-forge-900 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <p>© 2026 SignalForge Technologies Inc. All rights reserved.</p>
        <p className="text-[11px] text-forge-500 font-mono">
          All metrics and data providers conform strictly to customer licensing and public robots.txt directives.
        </p>
      </div>
    </footer>
  );
}
