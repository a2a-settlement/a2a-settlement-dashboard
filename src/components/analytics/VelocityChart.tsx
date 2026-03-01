"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { formatTokenAmount } from "@/lib/utils/formatters";
import type { Escrow } from "@/lib/api/types";

export function VelocityChart({ escrows }: { escrows: Escrow[] }) {
  const byDay = new Map<string, number>();
  for (const e of escrows) {
    if (e.status === "released") {
      const day = new Date(e.updated_at).toISOString().slice(0, 10);
      byDay.set(day, (byDay.get(day) ?? 0) + e.amount);
    }
  }
  const data = Array.from(byDay.entries())
    .map(([date, volume]) => ({ date, volume }))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-14);

  return (
    <Card>
      <CardHeader>
        <p className="text-sm font-medium">Spending Velocity (Last 14 Days)</p>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(v) => formatTokenAmount(v)} tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value: number) => [formatTokenAmount(value), "Volume"]} />
              <Line type="monotone" dataKey="volume" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
