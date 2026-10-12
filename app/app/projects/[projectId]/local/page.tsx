"use client";

import React from "react";
import { useParams } from "next/navigation";
import { MapPin, Phone, Star, CheckCircle2, ShieldCheck, ExternalLink } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SyntheticBadge } from "@/components/ui/synthetic-badge";
import { demoLocalLocations } from "@/lib/demo-data";

export default function LocalPresencePage() {
  const params = useParams();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-forge-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase text-forge-400">LOCAL SEARCH & PROFILE ACCURACY</span>
            <span className="text-forge-600">•</span>
            <span className="text-xs font-mono text-seafoam-400">3 Verified Physical Hubs</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-forge-50">
            Local Presence & Directory Sync
          </h1>
          <p className="text-xs text-forge-400 mt-1">
            Validating Name-Address-Phone (NAP) consistency across Google Business Profile, Apple Business Connect, and Bing Places.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <SyntheticBadge />
        </div>
      </div>

      {/* Locations Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {demoLocalLocations.map((loc) => (
          <Card key={loc.id} className="p-6 space-y-4 bg-forge-900 border-forge-800 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="w-10 h-10 rounded-xl bg-seafoam-950 border border-seafoam-700/50 flex items-center justify-center text-seafoam-400 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <Badge variant="seafoam" size="sm" className="font-mono">
                  {loc.accuracyScore}% NAP Match
                </Badge>
              </div>

              <div>
                <h3 className="text-base font-bold text-forge-100">{loc.businessName}</h3>
                <p className="text-xs text-forge-300 mt-0.5">{loc.address}</p>
                <p className="text-xs text-forge-400">{loc.city}, {loc.state} {loc.postalCode}</p>
                <p className="text-xs text-seafoam-400 font-mono mt-1 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" /> {loc.phone}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-forge-950 border border-forge-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{loc.averageRating} / 5.0</span>
                </div>
                <span className="text-forge-400 font-mono">{loc.totalReviews} Verified Reviews</span>
              </div>

              <div className="space-y-2 pt-2 border-t border-forge-800 text-xs">
                <span className="text-[10px] uppercase font-mono text-forge-400 block">Directory Sync Status</span>
                {loc.platforms.map((p, idx) => (
                  <div key={idx} className="flex items-center justify-between text-forge-200">
                    <span className="truncate">{p.name}</span>
                    <div className="flex items-center gap-2 font-mono text-[11px]">
                      <span className="text-amber-400">★ {p.rating}</span>
                      <span className="text-seafoam-400">{p.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Button variant="outline" size="sm" className="w-full">
              Inspect Citation NAP Audit
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
