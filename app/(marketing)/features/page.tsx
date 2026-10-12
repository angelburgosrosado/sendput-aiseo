import React from "react";
import Link from "next/link";
import {
  Sparkles,
  Search,
  KeyRound,
  ShieldCheck,
  Link2,
  FileText,
  MapPin,
  Plug,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export default function FeaturesPage() {
  const capabilities = [
    {
      id: "ai-citations",
      icon: Sparkles,
      title: "Generative AI Search & Answer Engine Visibility",
      subtitle: "Track brand sentiment and citation rank across conversational LLM engines",
      points: [
        "Continuous synthetic and licensed query prompting across Perplexity, ChatGPT Search, Claude, Gemini, and Microsoft Copilot.",
        "Share of Voice (SoV) measurement tracking whether your domain is cited as the primary recommendation or secondary reference.",
        "Entity extraction & sentiment scoring to diagnose narrative shifts before they degrade conversion rates.",
      ],
      badge: "AI-Native",
    },
    {
      id: "sfai-authority",
      icon: Search,
      title: "SignalForge Authority Index (SFAI)",
      subtitle: "Deterministic domain equity based on link graph quality and index footprint",
      points: [
        "Non-linear logarithmic calculation reflecting true brand equity, not vanity metric inflation.",
        "Verified referring domain graph analysis filtered by topical authority and IP subnet diversity.",
        "Dofollow equity balance and toxic anchor text early warning flags.",
      ],
      badge: "Proprietary Model",
    },
    {
      id: "rank-tracking",
      icon: KeyRound,
      title: "Keyword Intelligence & SERP Velocity",
      subtitle: "Comprehensive rank tracking with SERP feature attribution",
      points: [
        "Tracks 90+ days of historical position movement across Desktop and Mobile viewports.",
        "Automated SERP feature classification: AI Overviews, Featured Snippets, People Also Ask, and Knowledge Panels.",
        "Discovery Velocity Score (DVS) calculating positive ranking momentum vs negative friction.",
      ],
      badge: "Core Metric",
    },
    {
      id: "site-audits",
      icon: ShieldCheck,
      title: "Technical Site Audits & Polite Crawling",
      subtitle: "Identify crawl bottlenecks with 100% robots.txt compliance",
      points: [
        "Strict adherence to robots.txt disallow rules, crawl-delays, and host resource limits.",
        "Categorized issue reporting spanning Critical, High, Medium, Low, and Notice severity tiers.",
        "Largest Contentful Paint (LCP), canonical loop, and internal redirect chain diagnostics.",
      ],
      badge: "Ethical Engine",
    },
    {
      id: "content-briefs",
      icon: FileText,
      title: "Content Lab & Entity Coverage Blueprints",
      subtitle: "Equip editorial teams with data-backed content briefs",
      points: [
        "Search intent classification: Informational, Commercial, Transactional, and Navigational.",
        "Automated outline generator targeting entity depth and structured answer extraction.",
        "Target word count goals and readability scoring benchmarks.",
      ],
      badge: "Editorial Workflow",
    },
    {
      id: "local-presence",
      icon: MapPin,
      title: "Local Presence & Multi-Location Accuracy",
      subtitle: "Synchronize NAP consistency and customer ratings across physical branches",
      points: [
        "Name, Address, and Phone (NAP) accuracy validation across Google Maps, Apple Business Connect, and Bing Places.",
        "Aggregated review sentiment tracking and rating trend alerts.",
        "Multi-location filtering for enterprise retail and branch networks.",
      ],
      badge: "Local SEO",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 space-y-20">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <Badge variant="seafoam">PRODUCT CAPABILITIES</Badge>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-forge-50 tracking-tight">
          Enterprise Search Intelligence Built for the Generative Era
        </h1>
        <p className="text-base text-forge-300">
          Discover the complete suite of SignalForge modules designed for cross-functional marketing,
          engineering, and product teams.
        </p>
      </div>

      {/* Capabilities List */}
      <div className="space-y-12">
        {capabilities.map((cap, i) => {
          const Icon = cap.icon;
          return (
            <div
              key={cap.id}
              className={`p-8 md:p-12 rounded-3xl border border-forge-800 bg-forge-900/60 flex flex-col md:flex-row items-start gap-8 ${
                i % 2 === 1 ? "md:flex-row-reverse" : ""
              }`}
            >
              <div className="w-16 h-16 rounded-2xl bg-seafoam-950 border border-seafoam-700/50 flex items-center justify-center text-seafoam-400 shrink-0">
                <Icon className="w-8 h-8" />
              </div>

              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold text-forge-100">{cap.title}</h2>
                  <Badge variant="outline" size="sm">{cap.badge}</Badge>
                </div>
                <p className="text-sm text-seafoam-300 font-medium">{cap.subtitle}</p>

                <ul className="space-y-2.5 pt-2">
                  {cap.points.map((p, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-forge-300 leading-relaxed">
                      <CheckCircle2 className="w-4 h-4 text-seafoam-400 shrink-0 mt-0.5" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA Bottom */}
      <div className="text-center p-12 rounded-3xl bg-forge-900 border border-forge-800 space-y-4">
        <h2 className="text-2xl font-bold text-forge-100">Ready to explore these capabilities live?</h2>
        <p className="text-xs text-forge-400">Launch the pre-seeded interactive demo workspace instantly.</p>
        <Link href="/app/overview">
          <Button variant="primary" size="lg" icon={<ArrowRight className="w-4 h-4" />}>
            Open Live Workspace
          </Button>
        </Link>
      </div>
    </div>
  );
}
