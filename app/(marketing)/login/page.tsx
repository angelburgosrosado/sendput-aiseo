"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Radio, Lock, Mail, ArrowRight, UserCheck, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useApp } from "@/lib/context/app-context";
import { demoUsers } from "@/lib/demo-data";

export default function LoginPage() {
  const router = useRouter();
  const { setCurrentUser, setUserRole } = useApp();
  const [email, setEmail] = useState("elena.rostova@signalforge.internal");
  const [password, setPassword] = useState("••••••••••••");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/app/overview");
  };

  const handleQuickRoleLogin = (userIndex: number) => {
    const selected = demoUsers[userIndex];
    setCurrentUser(selected);
    setUserRole(selected.role);
    router.push("/app/overview");
  };

  return (
    <div className="max-w-md mx-auto px-6 py-20 space-y-8">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-xl bg-seafoam-500/10 border border-seafoam-500/40 flex items-center justify-center text-seafoam-400 mx-auto shadow-glow">
          <Radio className="w-6 h-6 text-seafoam-400" />
        </div>
        <h1 className="text-2xl font-bold text-forge-50">Sign In to SignalForge</h1>
        <p className="text-xs text-forge-400">Enterprise Search & Generative AI Discovery Platform</p>
      </div>

      <Card className="p-6 bg-forge-900 border-forge-800 space-y-6">
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-forge-300">Corporate Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-forge-400 absolute left-3 top-2.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-forge-950 border border-forge-800 rounded-lg text-forge-100 focus:outline-none focus:border-seafoam-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-forge-300">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-forge-400 absolute left-3 top-2.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-forge-950 border border-forge-800 rounded-lg text-forge-100 focus:outline-none focus:border-seafoam-500"
              />
            </div>
          </div>

          <Button type="submit" variant="primary" size="md" className="w-full" icon={<ArrowRight className="w-4 h-4" />}>
            Sign In to Dashboard
          </Button>
        </form>

        {/* 1-Click Role Login for instant reviewer testing */}
        <div className="pt-4 border-t border-forge-800 space-y-2">
          <span className="text-[11px] font-mono text-forge-400 uppercase tracking-wider block">
            Instant 1-Click Demo Profiles:
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickRoleLogin(0)}
              className="p-2 rounded-lg bg-forge-950 border border-forge-800 hover:border-seafoam-500/50 text-left transition-colors"
            >
              <span className="text-xs font-semibold text-seafoam-300 block">Elena Rostova</span>
              <span className="text-[10px] font-mono text-forge-400">OWNER • CMO</span>
            </button>
            <button
              onClick={() => handleQuickRoleLogin(1)}
              className="p-2 rounded-lg bg-forge-950 border border-forge-800 hover:border-seafoam-500/50 text-left transition-colors"
            >
              <span className="text-xs font-semibold text-seafoam-300 block">Marcus Vance</span>
              <span className="text-[10px] font-mono text-forge-400">ADMIN • VP SEO</span>
            </button>
            <button
              onClick={() => handleQuickRoleLogin(2)}
              className="p-2 rounded-lg bg-forge-950 border border-forge-800 hover:border-seafoam-500/50 text-left transition-colors"
            >
              <span className="text-xs font-semibold text-seafoam-300 block">Priya Nair</span>
              <span className="text-[10px] font-mono text-forge-400">ANALYST • Growth</span>
            </button>
            <button
              onClick={() => handleQuickRoleLogin(5)}
              className="p-2 rounded-lg bg-forge-950 border border-forge-800 hover:border-seafoam-500/50 text-left transition-colors"
            >
              <span className="text-xs font-semibold text-seafoam-300 block">David Alvarez</span>
              <span className="text-[10px] font-mono text-forge-400">VIEWER • Read-Only</span>
            </button>
          </div>
        </div>
      </Card>

      <div className="text-center text-xs text-forge-400">
        Don&apos;t have an organization yet?{" "}
        <Link href="/signup" className="text-seafoam-400 font-semibold hover:underline">
          Create workspace
        </Link>
      </div>
    </div>
  );
}
