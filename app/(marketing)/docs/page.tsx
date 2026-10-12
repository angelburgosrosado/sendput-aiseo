import React from "react";
import Link from "next/link";
import { BookOpen, Code, Terminal, Layers, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export default function DocsPage() {
  const sections = [
    {
      title: "Getting Started with SignalForge",
      items: [
        { name: "Platform Architecture Overview", desc: "Understanding the separation between customer telemetry, licensed SERP indexers, and synthetic modeling." },
        { name: "Creating Your First Project", desc: "Configuring primary domain verification, target countries, and language locales." },
        { name: "Understanding Roles & Permissions", desc: "Owner, Admin, Analyst, and Viewer capabilities in enterprise workspaces." },
      ],
    },
    {
      title: "Data Provider Adapters",
      items: [
        { name: "Google Search Console (OAuth 2.0)", desc: "Step-by-step setup to authorize verified click and impression telemetry." },
        { name: "Google Analytics 4 Measurement Protocol", desc: "Correlating organic SERP impressions with downstream session conversions." },
        { name: "DataForSEO & SerpAPI Index Gateways", desc: "Configuring commercial API credentials for high-throughput SERP monitoring." },
        { name: "Polite Crawler User-Agent Specs", desc: "Verifying our SignalForgeBot User-Agent and verifying robots.txt syntax." },
      ],
    },
    {
      title: "Proprietary Scoring Engines",
      items: [
        { name: "SignalForge Authority Index (SFAI)", desc: "Mathematical formula and logarithmic weighting of link graphs and domain trust." },
        { name: "Discovery Velocity Score (DVS)", desc: "Tracking net acceleration of SERP real estate acquisition and AI overview wins." },
        { name: "AI Citation Share (AICS)", desc: "How generative answer engine prominence is sampled and quantified." },
        { name: "Technical Health Quotient (THQ)", desc: "Deduction weights for Core Web Vitals, 404s, and canonical integrity." },
      ],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 space-y-16">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <Badge variant="seafoam">KNOWLEDGE BASE</Badge>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-forge-50 tracking-tight">
          SignalForge Technical Documentation
        </h1>
        <p className="text-base text-forge-300">
          Comprehensive integration guides, mathematical scoring specifications, and data provider API references.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {sections.map((sec, i) => (
          <Card key={i} className="p-6 space-y-4 bg-forge-900/60 border-forge-800">
            <h2 className="text-lg font-bold text-forge-100 pb-2 border-b border-forge-800 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-seafoam-400" />
              <span>{sec.title}</span>
            </h2>
            <div className="space-y-4">
              {sec.items.map((it, idx) => (
                <div key={idx} className="space-y-1">
                  <p className="text-xs font-semibold text-seafoam-300 hover:underline cursor-pointer">
                    {it.name}
                  </p>
                  <p className="text-[11px] text-forge-400 leading-snug">{it.desc}</p>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* Code Snippet Example */}
      <div className="p-8 rounded-3xl bg-forge-950 border border-forge-800 space-y-4 font-mono text-xs">
        <div className="flex items-center justify-between text-forge-400 pb-3 border-b border-forge-800">
          <span>Example: SignalForge robots.txt Polite Crawler Header</span>
          <span className="text-seafoam-400">RFC 9309 Compliant</span>
        </div>
        <pre className="text-forge-200 overflow-x-auto leading-relaxed">
{`# User-agent identification
User-Agent: SignalForgeBot/1.0 (+https://signalforge.io/bot; security@signalforge.io)
Accept: text/html,application/xhtml+xml
Accept-Encoding: gzip, deflate, br

# Crawl behavior contract:
# 1. Strictly observes 'Disallow' directives
# 2. Honors 'Crawl-delay' rates
# 3. Maximum concurrency: 2 requests/sec per origin domain`}
        </pre>
      </div>
    </div>
  );
}
