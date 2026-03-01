"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { formatTokenAmount } from "@/lib/utils/formatters";
import type { Agent, Escrow } from "@/lib/api/types";

export function OrgSpending({ agents, escrows }: { agents: Agent[]; escrows: Escrow[] }) {
  const byOrg = new Map<string, number>();
  for (const e of escrows) {
    if (e.status === "released") {
      const requester = agents.find((a) => a.id === e.requester_id);
      const org = requester?.org_id ?? "unknown";
      byOrg.set(org, (byOrg.get(org) ?? 0) + e.amount);
    }
  }
  const data = Array.from(byOrg.entries()).map(([org_id, volume]) => ({ org_id, volume }));

  return (
    <Card>
      <CardHeader>
        <p className="text-sm font-medium">Spending by Organization</p>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="org_id" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(v) => formatTokenAmount(v)} tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value: number) => [formatTokenAmount(value), "Volume"]} />
              <Bar dataKey="volume" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
