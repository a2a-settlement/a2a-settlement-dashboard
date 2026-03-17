"use client";

import { useFederationPeers, useTrustPolicy } from "@/lib/hooks/useFederation";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { PeerHealth } from "@/components/federation/PeerHealth";
import { TrustDiscountConfig } from "@/components/federation/TrustDiscountConfig";
import { Badge } from "@/components/ui/badge";
import { TimeAgo } from "@/components/shared/TimeAgo";
import { Skeleton } from "@/components/ui/skeleton";
import type { FederationPeer } from "@/lib/api/federation";

const HEALTH_VARIANTS: Record<string, "released" | "pending" | "destructive" | "secondary"> = {
  healthy: "released",
  degraded: "pending",
  unreachable: "destructive",
  unknown: "secondary",
};

export default function FederationPage() {
  const { data: peersData, isLoading: peersLoading } = useFederationPeers();
  const { data: trustPolicy, isLoading: policyLoading } = useTrustPolicy();

  const peers = peersData?.peers ?? [];

  const columns: Column<FederationPeer>[] = [
    {
      id: "name",
      header: "Name",
      cell: (row) => <span className="font-medium">{row.name}</span>,
    },
    {
      id: "did",
      header: "DID",
      cell: (row) => (
        <code className="text-xs text-muted-foreground truncate max-w-[200px] block">
          {row.peer_did}
        </code>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: (row) => (
        <Badge variant={row.status === "active" ? "released" : "secondary"}>
          {row.status}
        </Badge>
      ),
    },
    {
      id: "rho",
      header: "Current ρ",
      cell: (row) => `${((row.current_rho ?? 0) * 100).toFixed(1)}%`,
    },
    {
      id: "health",
      header: "Health",
      cell: (row) => {
        const status = row.health_status ?? "unknown";
        const variant = HEALTH_VARIANTS[status] ?? "secondary";
        return (
          <Badge variant={variant}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        );
      },
    },
    {
      id: "peered_at",
      header: "Peered since",
      cell: (row) => <TimeAgo date={row.peered_at} />,
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Federation</h1>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Federation Peers</h2>
          {peersLoading ? (
            <Skeleton className="h-[300px] w-full" />
          ) : (
            <DataTable
              columns={columns}
              data={peers}
              keyExtractor={(row) => row.peer_did}
              emptyMessage="No federation peers"
            />
          )}
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-4">Local Trust Discount</h2>
          {policyLoading ? (
            <Skeleton className="h-[200px] w-full" />
          ) : trustPolicy ? (
            <TrustDiscountConfig policy={trustPolicy} />
          ) : (
            <p className="text-sm text-muted-foreground">
              Trust Discount policy not available
            </p>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Peer Health</h2>
        {peersLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-[180px]" />
            ))}
          </div>
        ) : peers.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {peers.map((peer) => (
              <PeerHealth key={peer.peer_did} peer={peer} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No peers to display</p>
        )}
      </div>
    </div>
  );
}
