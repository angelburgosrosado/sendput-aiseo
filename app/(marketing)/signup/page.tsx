"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Radio, Lock, Mail, Building, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    orgName: "",
    domain: "",
  });

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/app/overview");
  };

  return (
    <div className="max-w-md mx-auto px-6 py-20 space-y-8">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-xl bg-seafoam-500/10 border border-seafoam-500/40 flex items-center justify-center text-seafoam-400 mx-auto shadow-glow">
          <Radio className="w-6 h-6 text-seafoam-400" />
        </div>
        <h1 className="text-2xl font-bold text-forge-50">Create SignalForge Workspace</h1>
        <p className="text-xs text-forge-400">14-day full platform access. No credit card required.</p>
      </div>

      <Card className="p-6 bg-forge-900 border-forge-800 space-y-4">
        <form onSubmit={handleSignup} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-forge-300">Your Name</label>
            <input
              required
              type="text"
              placeholder="Elena Rostova"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-forge-950 border border-forge-800 rounded-lg text-forge-100 focus:outline-none focus:border-seafoam-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-forge-300">Corporate Email</label>
            <input
              required
              type="email"
              placeholder="elena@company.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-forge-950 border border-forge-800 rounded-lg text-forge-100 focus:outline-none focus:border-seafoam-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-forge-300">Organization Name</label>
            <input
              required
              type="text"
              placeholder="Apex Global"
              value={form.orgName}
              onChange={(e) => setForm({ ...form, orgName: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-forge-950 border border-forge-800 rounded-lg text-forge-100 focus:outline-none focus:border-seafoam-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-forge-300">Primary Domain to Track</label>
            <input
              required
              type="text"
              placeholder="apexcloud.io"
              value={form.domain}
              onChange={(e) => setForm({ ...form, domain: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-forge-950 border border-forge-800 rounded-lg text-forge-100 focus:outline-none focus:border-seafoam-500"
            />
          </div>

          <Button type="submit" variant="primary" size="md" className="w-full" icon={<ArrowRight className="w-4 h-4" />}>
            Initialize Workspace
          </Button>
        </form>

        <div className="text-[11px] text-forge-400 text-center pt-2">
          By continuing, you agree to our{" "}
          <Link href="/security" className="text-seafoam-400 hover:underline">
            Ethics & No-Scraping Policy
          </Link>.
        </div>
      </Card>

      <div className="text-center text-xs text-forge-400">
        Already have a workspace?{" "}
        <Link href="/login" className="text-seafoam-400 font-semibold hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  );
}
