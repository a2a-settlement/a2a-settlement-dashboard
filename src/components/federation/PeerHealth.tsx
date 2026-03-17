"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { FederationPeer } from "@/lib/api/federation";

const HEALTH_VARIANTS: Record<
  string,
  "released" | "pending" | "disputed" | "destructive" | "secondary"
> = {
  healthy: "released",
  degraded: "pending",
  unreachable: "destructive",
  unknown: "secondary",
};

export function PeerHealth({ peer }: { peer: FederationPeer }) {
  const healthStatus = peer.health_status ?? "unknown";
  const variant = HEALTH_VARIANTS[healthStatus] ?? "secondary";
  const rhoPercent = Math.round((peer.current_rho ?? 0) * 100);
  const uptimePercent = peer.uptime_90d != null ? (peer.uptime_90d * 100).toFixed(1) : "—";
  const latencyMs = peer.avg_attestation_latency_ms ?? 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <h3 className="text-sm font-medium">{peer.name}</h3>
        <Badge variant={variant}>
          {healthStatus.charAt(0).toUpperCase() + healthStatus.slice(1)}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Trust (ρ)</span>
            <span>{rhoPercent}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all",
                healthStatus === "healthy" && "bg-[#22c55e]",
                healthStatus === "degraded" && "bg-[#eab308]",
                healthStatus === "unreachable" && "bg-[#ef4444]",
                healthStatus === "unknown" && "bg-muted-foreground/50"
              )}
              style={{ width: `${rhoPercent}%` }}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-muted-foreground">Uptime (90d)</p>
            <p className="font-medium">{uptimePercent}%</p>
          </div>
          <div>
            <p className="text-muted-foreground">Avg latency</p>
            <p className="font-medium">{latencyMs > 0 ? `${latencyMs} ms` : "—"}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
