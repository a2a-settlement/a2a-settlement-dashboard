"use client";

import { useState } from "react";
import { SelfDealingBadge } from "@/components/shared/SelfDealingBadge";
import { TimeAgo } from "@/components/shared/TimeAgo";
import { TokenAmount } from "@/components/shared/TokenAmount";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest } from "@/lib/api/client";
import { useQuery } from "@tanstack/react-query";
import type { ComplianceFeedEntry, DiversityOutlier, SelfDealingClass } from "@/lib/api/types";

// ---------------------------------------------------------------------------
// Fetchers
// ---------------------------------------------------------------------------

function useComplianceFeed(classFilter?: SelfDealingClass) {
  return useQuery({
    queryKey: ["compliance", "self-dealing-feed", classFilter],
    queryFn: () =>
      apiRequest<{ total: number; entries: ComplianceFeedEntry[] }>(
        `/api/compliance/self-dealing-feed?limit=50${classFilter ? `&class_filter=${classFilter}` : ""}`
      ),
    staleTime: 30_000,
  });
}

function useNullResolutions() {
  return useQuery({
    queryKey: ["compliance", "null-resolutions"],
    queryFn: () =>
      apiRequest<{ entries: ComplianceFeedEntry[] }>(
        "/api/compliance/null-resolutions?limit=50"
      ),
    staleTime: 30_000,
  });
}

function useEmaSuppressions() {
  return useQuery({
    queryKey: ["compliance", "ema-suppressions"],
    queryFn: () =>
      apiRequest<{ entries: ComplianceFeedEntry[] }>(
        "/api/compliance/ema-suppressions?limit=50"
      ),
    staleTime: 30_000,
  });
}

function useDiversityOutliers(hhi: number) {
  return useQuery({
    queryKey: ["compliance", "diversity-outliers", hhi],
    queryFn: () =>
      apiRequest<{ outliers: DiversityOutlier[] }>(
        `/api/compliance/diversity-outliers?hhi_threshold=${hhi}&limit=50`
      ),
    staleTime: 60_000,
  });
}

// ---------------------------------------------------------------------------
// Sub-panels
// ---------------------------------------------------------------------------

function SelfDealingFeed() {
  const { data, isLoading } = useComplianceFeed();

  if (isLoading) return <div className="py-8 text-center text-muted-foreground">Loading…</div>;
  const entries = data?.entries ?? [];

  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground mb-4">
        Transactions classified as self-dealing or suspected self-dealing. Total: {data?.total ?? 0}
      </p>
      {entries.length === 0 ? (
        <div className="rounded-lg border p-8 text-center text-muted-foreground">
          No self-dealing transactions detected
        </div>
      ) : (
        <div className="rounded-lg border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-2 text-left">Time</th>
                <th className="px-4 py-2 text-left">Requester</th>
                <th className="px-4 py-2 text-left">Provider</th>
                <th className="px-4 py-2 text-left">Class</th>
                <th className="px-4 py-2 text-left">Escrow</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {entries.map((e) => (
                <tr key={e.id} className="hover:bg-muted/30">
                  <td className="px-4 py-2 text-muted-foreground">
                    <TimeAgo timestamp={e.timestamp} />
                  </td>
                  <td className="px-4 py-2 font-mono text-xs">{e.source_agent}</td>
                  <td className="px-4 py-2 font-mono text-xs">{e.target_agent}</td>
                  <td className="px-4 py-2">
                    <SelfDealingBadge value={e.self_dealing_class} showArmsLength />
                  </td>
                  <td className="px-4 py-2 font-mono text-xs">
                    {e.escrow_id ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function NullResolutionsPanel() {
  const { data, isLoading } = useNullResolutions();

  if (isLoading) return <div className="py-8 text-center text-muted-foreground">Loading…</div>;
  const entries = data?.entries ?? [];

  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground mb-4">
        Disputes null-resolved by the mediator due to confirmed self-dealing.
        Funds were returned to the requester without LLM arbitration.
      </p>
      {entries.length === 0 ? (
        <div className="rounded-lg border p-8 text-center text-muted-foreground">
          No null-resolved disputes
        </div>
      ) : (
        <div className="rounded-lg border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-2 text-left">Time</th>
                <th className="px-4 py-2 text-left">Requester</th>
                <th className="px-4 py-2 text-left">Provider</th>
                <th className="px-4 py-2 text-left">Escrow</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {entries.map((e) => (
                <tr key={e.id} className="hover:bg-muted/30">
                  <td className="px-4 py-2 text-muted-foreground">
                    <TimeAgo timestamp={e.timestamp} />
                  </td>
                  <td className="px-4 py-2 font-mono text-xs">{e.source_agent}</td>
                  <td className="px-4 py-2 font-mono text-xs">{e.target_agent}</td>
                  <td className="px-4 py-2 font-mono text-xs">{e.escrow_id ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function EmaSuppressionsPanel() {
  const { data, isLoading } = useEmaSuppressions();

  if (isLoading) return <div className="py-8 text-center text-muted-foreground">Loading…</div>;
  const entries = data?.entries ?? [];

  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground mb-4">
        Transactions where the reputation EMA update was suppressed or downweighted
        due to self-dealing classification.
      </p>
      {entries.length === 0 ? (
        <div className="rounded-lg border p-8 text-center text-muted-foreground">
          No EMA suppressions recorded
        </div>
      ) : (
        <div className="rounded-lg border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-2 text-left">Time</th>
                <th className="px-4 py-2 text-left">Agent</th>
                <th className="px-4 py-2 text-left">Class</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {entries.map((e) => (
                <tr key={e.id} className="hover:bg-muted/30">
                  <td className="px-4 py-2 text-muted-foreground">
                    <TimeAgo timestamp={e.timestamp} />
                  </td>
                  <td className="px-4 py-2 font-mono text-xs">{e.source_agent}</td>
                  <td className="px-4 py-2">
                    <SelfDealingBadge value={e.self_dealing_class} showArmsLength />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function DiversityOutliersPanel() {
  const { data, isLoading } = useDiversityOutliers(0.5);

  if (isLoading) return <div className="py-8 text-center text-muted-foreground">Loading…</div>;
  const outliers = data?.outliers ?? [];

  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground mb-4">
        Agents with Herfindahl-Hirschman Index (HHI) above 0.5 — indicating
        single-relationship concentration risk. Higher HHI means fewer counterparties.
      </p>
      {outliers.length === 0 ? (
        <div className="rounded-lg border p-8 text-center text-muted-foreground">
          No high-concentration agents detected
        </div>
      ) : (
        <div className="rounded-lg border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-2 text-left">Agent</th>
                <th className="px-4 py-2 text-left">HHI</th>
                <th className="px-4 py-2 text-left">Snapshot</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {outliers.map((o) => (
                <tr key={o.exchange_account_id} className="hover:bg-muted/30">
                  <td className="px-4 py-2">
                    <p className="font-medium">{o.bot_name}</p>
                    <p className="text-xs text-muted-foreground font-mono">{o.exchange_account_id}</p>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-24 rounded-full bg-muted overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            o.counterparty_hhi >= 0.7
                              ? "bg-red-500"
                              : o.counterparty_hhi >= 0.4
                              ? "bg-amber-500"
                              : "bg-green-500"
                          }`}
                          style={{ width: `${Math.round(o.counterparty_hhi * 100)}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono">
                        {Math.round(o.counterparty_hhi * 100)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-2 text-muted-foreground">
                    {o.snapshot_at ? <TimeAgo timestamp={o.snapshot_at} /> : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export default function CompliancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Compliance</h1>
        <p className="text-muted-foreground mt-1">
          Anti-self-dealing monitoring — principal clusters, classification events, and diversity signals.
        </p>
      </div>

      <Tabs defaultValue="self-dealing">
        <TabsList>
          <TabsTrigger value="self-dealing">Self-Dealing Feed</TabsTrigger>
          <TabsTrigger value="null-resolutions">Null Resolutions</TabsTrigger>
          <TabsTrigger value="ema-suppressions">EMA Suppressions</TabsTrigger>
          <TabsTrigger value="diversity-outliers">Diversity Outliers</TabsTrigger>
        </TabsList>

        <TabsContent value="self-dealing" className="mt-4">
          <SelfDealingFeed />
        </TabsContent>
        <TabsContent value="null-resolutions" className="mt-4">
          <NullResolutionsPanel />
        </TabsContent>
        <TabsContent value="ema-suppressions" className="mt-4">
          <EmaSuppressionsPanel />
        </TabsContent>
        <TabsContent value="diversity-outliers" className="mt-4">
          <DiversityOutliersPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}
