"use client";

import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { formatTokenAmount } from "@/lib/utils/formatters";
import type { SpendingDataPoint } from "@/lib/api/types";

type Range = "24h" | "7d" | "30d";

export function SpendingChart(props: { data: SpendingDataPoint[]; isLoading: boolean; onRangeChange?: (range: Range) => void }) {
  const { data, isLoading, onRangeChange } = props;
  const [range, setRange] = useState<Range>("7d");

  const handleRangeChange = (v: string) => {
    const r = v as Range;
    setRange(r);
    onRangeChange?.(r);
  };

  const chartData = data.map((d) => ({
    ...d,
    displayDate: new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
  }));

  if (isLoading) {
    return (
      <Card>
        <CardHeader><Skeleton className="h-6 w-32" /></CardHeader>
        <CardContent><Skeleton className="h-[300px] w-full" /></CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <p className="text-sm font-medium">Settlement Volume</p>
        <Tabs value={range} onValueChange={handleRangeChange}>
          <TabsList>
            <TabsTrigger value="24h">24h</TabsTrigger>
            <TabsTrigger value="7d">7d</TabsTrigger>
            <TabsTrigger value="30d">30d</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="displayDate" tick={{ fontSize: 12 }} tickLine={false} />
              <YAxis tickFormatter={(v) => formatTokenAmount(v)} tick={{ fontSize: 12 }} tickLine={false} />
              <Tooltip formatter={(value: number) => [formatTokenAmount(value), "Volume"]} labelFormatter={(_, payload) => payload?.[0]?.displayDate ?? ""} />
              <Area type="monotone" dataKey="volume" stroke="#3b82f6" fill="url(#volumeGradient)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
