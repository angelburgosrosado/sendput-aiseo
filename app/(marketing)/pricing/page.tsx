import React from "react";
import Link from "next/link";
import { Check, ArrowRight, ShieldCheck, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export default function PricingPage() {
  const plans = [
    {
      id: "starter",
      name: "Starter",
      price: "$99",
      period: "per month",
      desc: "Essential search intelligence for growing SaaS products and boutique agencies.",
      highlight: false,
      badge: "Standard",
      features: [
        "3 Tracked Projects & Properties",
        "500 Monitored Keywords",
        "2,000 Crawled Pages / month",
        "50 AI-Query Citation Prompts",
        "Google Search Console & GA4 OAuth",
        "Weekly Executive Reports",
        "Role Support: 2 Team Members",
      ],
      cta: "Start 14-Day Free Trial",
    },
    {
      id: "growth",
      name: "Growth",
      price: "$249",
      period: "per month",
      desc: "Full-power discovery intelligence for high-velocity marketing and product teams.",
      highlight: true,
      badge: "Most Popular",
      features: [
        "10 Tracked Projects & Properties",
        "2,500 Monitored Keywords",
        "15,000 Crawled Pages / month",
        "250 AI-Query Citation Prompts",
        "DataForSEO & SerpAPI Gateway Access",
        "Daily SERP & AI Citation Refreshes",
        "Technical Site Health Alerts",
        "Role Support: 10 Team Members (Owner, Admin, Analyst)",
      ],
      cta: "Explore Growth Plan",
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "$699",
      period: "per month",
      desc: "Custom governance, dedicated crawler quotas, and white-label reporting for global brands.",
      highlight: false,
      badge: "Custom Scale",
      features: [
        "50 Tracked Projects & Properties",
        "15,000 Monitored Keywords",
        "100,000 Crawled Pages / month",
        "2,000 AI-Query Citation Prompts",
        "Custom Licensed Crawler Endpoints",
        "Automated Multi-Location Sync (50+ Locations)",
        "SSO / SAML 2.0 & Dedicated Account Executive",
        "Unlimited Seats across all 4 Roles",
      ],
      cta: "Contact Enterprise Sales",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 space-y-20">
      {/* Title */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <Badge variant="seafoam">PREDICTABLE PRICING</Badge>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-forge-50 tracking-tight">
          Transparent, Licensed Infrastructure Tiers
        </h1>
        <p className="text-base text-forge-300">
          No hidden credit surcharges. Every plan includes full access to our licensed data adapters,
          ethical crawlers, and AI citation tracking algorithms.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((p) => (
          <div
            key={p.id}
            className={`rounded-3xl p-8 flex flex-col justify-between border transition-all ${
              p.highlight
                ? "bg-gradient-to-b from-forge-900 to-forge-950 border-seafoam-500 shadow-glow relative"
                : "bg-forge-900/60 border-forge-800"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-bold text-forge-100">{p.name}</span>
                <Badge variant={p.highlight ? "seafoam" : "outline"} size="sm">
                  {p.badge}
                </Badge>
              </div>

              <div className="mb-4">
                <span className="text-4xl font-extrabold text-forge-50">{p.price}</span>
                <span className="text-xs text-forge-400 ml-2">{p.period}</span>
              </div>

              <p className="text-xs text-forge-400 mb-6 leading-relaxed">{p.desc}</p>

              <div className="space-y-3 pt-4 border-t border-forge-800/80 mb-8">
                <span className="text-[11px] font-mono text-forge-400 uppercase tracking-wider block">
                  Included Capabilities
                </span>
                {p.features.map((f, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-forge-200">
                    <Check className="w-4 h-4 text-seafoam-400 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Link href="/app/overview">
                <Button
                  variant={p.highlight ? "primary" : "outline"}
                  size="md"
                  className="w-full"
                  icon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  {p.cta}
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Guarantee Banner */}
      <div className="p-8 rounded-2xl bg-forge-900 border border-forge-800 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-seafoam-950 border border-seafoam-800/60 flex items-center justify-center text-seafoam-400 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-forge-100">Need Custom API Volumes or Air-Gapped Deployment?</h3>
            <p className="text-xs text-forge-400">Our solutions engineering team can provision dedicated proxy-free crawler nodes.</p>
          </div>
        </div>
        <Link href="/contact">
          <Button variant="secondary" size="md">
            Talk to Solutions Engineering
          </Button>
        </Link>
      </div>
    </div>
  );
}
