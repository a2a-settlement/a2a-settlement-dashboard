"use client";

import { useCallback } from "react";
import { useAgentsList } from "@/lib/hooks/useAgents";
import { useEscrowsList } from "@/lib/hooks/useEscrows";
import { OrgSpending } from "@/components/analytics/OrgSpending";
import { VelocityChart } from "@/components/analytics/VelocityChart";
import { ConcentrationMap } from "@/components/analytics/ConcentrationMap";
import { Button } from "@/components/ui/button";
import type { Escrow } from "@/lib/api/types";

function escrowsToCsv(escrows: Escrow[]): string {
  const header = "id,requester_id,provider_id,amount,fee_amount,status,created_at,expires_at,task_id";
  const rows = escrows.map((e) =>
    [
      e.id,
      e.requester_id,
      e.provider_id,
      e.amount,
      e.fee_amount ?? "",
      e.status,
      e.created_at,
      e.expires_at ?? "",
      e.task_id ?? "",
    ].join(",")
  );
  return [header, ...rows].join("\n");
}

function downloadCsv(content: string, filename: string) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AnalyticsPage() {
  const { data: agentsData } = useAgentsList({});
  const { data: escrowsData } = useEscrowsList({});
  const agents = agentsData?.agents ?? [];
  const escrows = escrowsData?.escrows ?? [];

  const handleExport = useCallback(() => {
    const csv = escrowsToCsv(escrows);
    const date = new Date().toISOString().slice(0, 10);
    downloadCsv(csv, `a2a-settlement-escrows-${date}.csv`);
  }, [escrows]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Spending Analytics</h1>
        <Button variant="outline" size="sm" onClick={handleExport}>
          Export CSV
        </Button>
      </div>

      <OrgSpending agents={agents} escrows={escrows} />
      <VelocityChart escrows={escrows} />
      <ConcentrationMap agents={agents} escrows={escrows} />
    </div>
  );
}
