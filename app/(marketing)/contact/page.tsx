"use client";

import React, { useState } from "react";
import { Mail, Building, User, MessageSquare, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    domain: "",
    tier: "GROWTH",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.name) return;
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-16 space-y-12">
      <div className="text-center space-y-3">
        <Badge variant="seafoam">ENTERPRISE INQUIRIES</Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-forge-50">
          Contact SignalForge Solutions Engineering
        </h1>
        <p className="text-sm text-forge-400">
          Discuss enterprise deployment, custom crawler node provisioning, or high-volume search index licenses.
        </p>
      </div>

      <Card className="p-8 sm:p-10 bg-forge-900 border-forge-800">
        {submitted ? (
          <div className="text-center py-12 space-y-4">
            <div className="w-14 h-14 rounded-full bg-seafoam-950 border border-seafoam-500/50 flex items-center justify-center text-seafoam-400 mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-forge-100">Inquiry Received</h2>
            <p className="text-xs text-forge-300 max-w-md mx-auto">
              Thank you, {form.name}. A SignalForge solutions architect will reach out to{" "}
              <span className="text-seafoam-300 font-mono">{form.email}</span> within 2 business hours.
            </p>
            <div className="pt-4">
              <Button variant="outline" size="sm" onClick={() => setSubmitted(false)}>
                Submit Another Inquiry
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-forge-300">Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-forge-400 absolute left-3 top-3" />
                  <input
                    required
                    type="text"
                    placeholder="Elena Rostova"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-forge-950 border border-forge-800 rounded-lg text-forge-100 focus:outline-none focus:border-seafoam-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-forge-300">Corporate Email *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-forge-400 absolute left-3 top-3" />
                  <input
                    required
                    type="email"
                    placeholder="elena@company.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-forge-950 border border-forge-800 rounded-lg text-forge-100 focus:outline-none focus:border-seafoam-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-forge-300">Company Name</label>
                <div className="relative">
                  <Building className="w-4 h-4 text-forge-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Apex Technologies"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-forge-950 border border-forge-800 rounded-lg text-forge-100 focus:outline-none focus:border-seafoam-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-forge-300">Primary Domain to Track</label>
                <input
                  type="text"
                  placeholder="apexcloud.io"
                  value={form.domain}
                  onChange={(e) => setForm({ ...form, domain: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-forge-950 border border-forge-800 rounded-lg text-forge-100 focus:outline-none focus:border-seafoam-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-forge-300">Estimated Plan Tier</label>
              <select
                value={form.tier}
                onChange={(e) => setForm({ ...form, tier: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-forge-950 border border-forge-800 rounded-lg text-forge-100 focus:outline-none focus:border-seafoam-500"
              >
                <option value="STARTER">Starter ($99/mo) - 500 Keywords</option>
                <option value="GROWTH">Growth ($249/mo) - 2,500 Keywords</option>
                <option value="ENTERPRISE">Enterprise ($699/mo) - Custom Scale & Dedicated SLAs</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-forge-300">Discovery Needs & Objectives</label>
              <textarea
                rows={4}
                placeholder="Tell us about your target keywords, AI search monitoring priorities, or crawl volume requirements..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full p-3 text-xs bg-forge-950 border border-forge-800 rounded-lg text-forge-100 focus:outline-none focus:border-seafoam-500"
              />
            </div>

            <Button type="submit" variant="primary" size="lg" className="w-full" icon={<Send className="w-4 h-4" />}>
              Submit Enterprise Request
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
}
