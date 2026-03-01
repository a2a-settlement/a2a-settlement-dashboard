"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatTokenAmount, formatReputation } from "@/lib/utils/formatters";
import type { DashboardOverview } from "@/lib/api/types";

export function SummaryCards({
  data,
  isLoading,
}: {
  data: DashboardOverview | undefined;
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const overview = data!;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <p className="text-sm font-medium text-muted-foreground">
            Total Agents
          </p>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{overview.total_agents}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <p className="text-sm font-medium text-muted-foreground">
            Active Escrows
          </p>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{overview.active_escrows}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <p className="text-sm font-medium text-muted-foreground">
            24h Volume
          </p>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">
            {formatTokenAmount(overview.volume_24h)} ATE
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <p className="text-sm font-medium text-muted-foreground">
            Dispute Rate
          </p>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">
            {formatReputation(overview.dispute_rate)}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
