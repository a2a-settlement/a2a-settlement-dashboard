"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TokenAmount } from "@/components/shared/TokenAmount";
import type { Agent, Escrow } from "@/lib/api/types";

export function ConcentrationMap({ agents, escrows }: { agents: Agent[]; escrows: Escrow[] }) {
  const counterpartyMap = new Map<string, Map<string, number>>();
  for (const e of escrows) {
    if (e.status === "released") {
      if (!counterpartyMap.has(e.requester_id)) counterpartyMap.set(e.requester_id, new Map());
      const m = counterpartyMap.get(e.requester_id)!;
      m.set(e.provider_id, (m.get(e.provider_id) ?? 0) + e.amount);
    }
  }

  const concentration: { agent_id: string; top_counterparty: string; top_volume: number; total: number; pct: number }[] = [];
  for (const [agentId, counterparties] of counterpartyMap) {
    const entries = Array.from(counterparties.entries()).sort((a, b) => b[1] - a[1]);
    if (entries.length > 0) {
      const [topId, topVol] = entries[0];
      const total = entries.reduce((s, [, v]) => s + v, 0);
      concentration.push({
        agent_id: agentId,
        top_counterparty: topId,
        top_volume: topVol,
        total,
        pct: total > 0 ? (topVol / total) * 100 : 0,
      });
    }
  }
  concentration.sort((a, b) => b.pct - a.pct);

  return (
    <Card>
      <CardHeader>
        <p className="text-sm font-medium">Counterparty Concentration Risk</p>
        <p className="text-xs text-muted-foreground">Agents with highest reliance on a single counterparty</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {concentration.slice(0, 10).map((c) => (
            <div key={c.agent_id} className="flex items-center justify-between rounded border p-2 text-sm">
              <div>
                <Link href={`/agents/${c.agent_id}`} className="font-medium text-[#3b82f6] hover:underline">
                  {c.agent_id}
                </Link>
                <span className="text-muted-foreground"> → </span>
                <Link href={`/agents/${c.top_counterparty}`} className="text-[#3b82f6] hover:underline">
                  {c.top_counterparty}
                </Link>
              </div>
              <div className="text-right">
                <TokenAmount amount={c.top_volume} />
                <span className="text-muted-foreground ml-2">({c.pct.toFixed(0)}%)</span>
              </div>
            </div>
          ))}
          {concentration.length === 0 && (
            <p className="text-sm text-muted-foreground">No concentration data</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
