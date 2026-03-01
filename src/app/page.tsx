"use client";

import { useState } from "react";
import { useOverview, useSpending, useActivity, useAlerts } from "@/lib/hooks/useDashboard";
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { SpendingChart } from "@/components/dashboard/SpendingChart";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { AlertsBanner } from "@/components/dashboard/AlertsBanner";
import type { SpendingDataPoint } from "@/lib/api/types";

export default function OverviewPage() {
  const [spendingRange, setSpendingRange] = useState<"24h" | "7d" | "30d">("7d");

  const { data: overview, isLoading: overviewLoading } = useOverview();
  const { data: spending, isLoading: spendingLoading } = useSpending({
    range: spendingRange,
  });
  const { data: activity, isLoading: activityLoading } = useActivity(20);
  const { data: alerts, isLoading: alertsLoading } = useAlerts();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Overview</h1>

      <SummaryCards data={overview} isLoading={overviewLoading} />

      <AlertsBanner alerts={alerts ?? []} isLoading={alertsLoading} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SpendingChart
            data={spending ?? []}
            isLoading={spendingLoading}
            onRangeChange={setSpendingRange}
          />
        </div>
        <div>
          <ActivityFeed
            events={activity ?? []}
            isLoading={activityLoading}
          />
        </div>
      </div>
    </div>
  );
}
