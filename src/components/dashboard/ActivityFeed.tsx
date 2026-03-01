"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TimeAgo } from "@/components/shared/TimeAgo";
import { TokenAmount } from "@/components/shared/TokenAmount";
import type { ActivityEvent } from "@/lib/api/types";

const eventLabels: Record<ActivityEvent["type"], string> = {
  escrow_created: "Escrow created",
  escrow_released: "Escrow released",
  escrow_refunded: "Escrow refunded",
  escrow_disputed: "Escrow disputed",
  escrow_expired: "Escrow expired",
};

export function ActivityFeed(props: { events: ActivityEvent[]; isLoading: boolean }) {
  const { events, isLoading } = props;

  if (isLoading) {
    return (
      <Card>
        <CardHeader><Skeleton className="h-6 w-32" /></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <p className="text-sm font-medium">Recent Activity</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {events.length === 0 ? (
            <p className="text-sm text-muted-foreground">No recent activity</p>
          ) : (
            events.map((evt) => (
              <div key={evt.id} className="flex items-center justify-between rounded-md border p-3 text-sm">
                <div>
                  <p className="font-medium">{eventLabels[evt.type]}</p>
                  <p className="text-muted-foreground">{evt.agent_id}</p>
                </div>
                <div className="text-right">
                  {evt.amount != null && <TokenAmount amount={evt.amount} className="font-medium" />}
                  <p className="text-xs text-muted-foreground"><TimeAgo date={evt.timestamp} /></p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
