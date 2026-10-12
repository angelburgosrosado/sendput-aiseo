import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  FileCheck,
  Cpu,
  Key,
  Users2,
  CheckCircle2,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export default function SecurityPage() {
  const pillars = [
    {
      icon: ShieldCheck,
      title: "Strict No-Scraping & Ethical Standards",
      desc: "SignalForge does not employ headless bot evasion, CAPTCHA bypasses, residential proxy rotation, or unauthorized site scraping. All search metrics stem from licensed commercial search index APIs and customer-authorized feeds.",
    },
    {
      icon: FileCheck,
      title: "100% Robots.txt & Crawl-Delay Adherence",
      desc: "Our automated site auditor verifies robots.txt disallow rules prior to fetching any URL. If a webmaster imposes a crawl delay or disallow directive, our crawler honors it unconditionally without exception.",
    },
    {
      icon: Lock,
      title: "Data Encryption & Tenant Isolation",
      desc: "All client telemetry and API credentials are encrypted with AES-256 at rest and TLS 1.3 in transit. Multi-tenant database schemas isolate customer projects, audit logs, and search observations strictly by organization ID.",
    },
    {
      icon: Users2,
      title: "Granular Role-Based Access Control (RBAC)",
      desc: "Protect sensitive integration credentials and billing with 4 distinct permission roles: Owner, Admin, Analyst, and Viewer. Team settings and OAuth tokens remain inaccessible to read-only viewers.",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 space-y-20">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <Badge variant="seafoam">TRUST & COMPLIANCE</Badge>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-forge-50 tracking-tight">
          Enterprise Security, Ethical Crawling & Legal Compliance
        </h1>
        <p className="text-base text-forge-300">
          How SignalForge protects your data, honors webmaster autonomy, and adheres strictly to
          international privacy and copyright laws.
        </p>
      </div>

      {/* Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {pillars.map((p, i) => {
          const Icon = p.icon;
          return (
            <Card key={i} className="p-8 space-y-4 bg-forge-900/60 border-forge-800">
              <div className="w-12 h-12 rounded-xl bg-seafoam-950 border border-seafoam-700/50 flex items-center justify-center text-seafoam-400">
                <Icon className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-forge-100">{p.title}</h2>
              <p className="text-xs text-forge-400 leading-relaxed">{p.desc}</p>
            </Card>
          );
        })}
      </div>

      {/* Policy Notice Box */}
      <div className="p-8 rounded-3xl bg-amber-950/20 border border-amber-800/40 space-y-4">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400" />
          <h3 className="text-base font-bold text-amber-300">SignalForge Zero-Evasion Architecture</h3>
        </div>
        <p className="text-xs text-forge-300 leading-relaxed">
          Many legacy SEO tools rely on questionable scraping networks that place undue burdens on target web servers
          and violate terms of service. SignalForge was designed from the ground up as a compliance-first platform:
          we never rotate residential proxies, bypass Cloudflare or Akamai challenges, or store non-public user data.
        </p>
      </div>

      {/* CTA */}
      <div className="text-center p-10 rounded-2xl bg-forge-900 border border-forge-800">
        <h3 className="text-lg font-semibold text-forge-100 mb-2">Request Security Documentation</h3>
        <p className="text-xs text-forge-400 mb-6">Need our SOC2 Type II report, penetration testing summary, or DPA?</p>
        <Link href="/contact">
          <Button variant="primary" size="md" icon={<ArrowRight className="w-4 h-4" />}>
            Contact Trust & Compliance Officer
          </Button>
        </Link>
      </div>
    </div>
  );
}
