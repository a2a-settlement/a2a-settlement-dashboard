"use client";

import { useAgentsList } from "@/lib/hooks/useAgents";
import { useEscrowsList } from "@/lib/hooks/useEscrows";
import { OrgSpending } from "@/components/analytics/OrgSpending";
import { VelocityChart } from "@/components/analytics/VelocityChart";
import { ConcentrationMap } from "@/components/analytics/ConcentrationMap";
import { Button } from "@/components/ui/button";

export default function AnalyticsPage() {
  const { data: agentsData } = useAgentsList({});
  const { data: escrowsData } = useEscrowsList({});
  const agents = agentsData?.agents ?? [];
  const escrows = escrowsData?.escrows ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Spending Analytics</h1>
        <Button variant="outline" size="sm">
          Export CSV
        </Button>
      </div>

      <OrgSpending agents={agents} escrows={escrows} />
      <VelocityChart escrows={escrows} />
      <ConcentrationMap agents={agents} escrows={escrows} />
    </div>
  );
}
