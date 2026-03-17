"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { useState } from "react";
import type { Attestation, RevocationReason } from "@/lib/api/types";

function ttlColor(att: Attestation): string {
  if (att.status === "revoked") return "text-red-500";
  if (att.status === "expired") return "text-red-400";
  if (att.status === "renewed") return "text-muted-foreground";
  if (!att.ttl_remaining_seconds || !att.expires_at) return "text-green-500";
  const total =
    new Date(att.expires_at).getTime() - new Date(att.issued_at).getTime();
  const remaining = att.ttl_remaining_seconds * 1000;
  const pct = total > 0 ? remaining / total : 1;
  if (pct > 0.2) return "text-green-500";
  if (pct > 0) return "text-yellow-500";
  return "text-red-500";
}

function formatRemaining(seconds?: number): string {
  if (seconds == null) return "Permanent";
  if (seconds <= 0) return "Expired";
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  if (days > 0) return `${days}d ${hours}h remaining`;
  const mins = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${mins}m remaining`;
}

function freshnessLabel(att: Attestation): string {
  const issuedAt = new Date(att.issued_at);
  const daysSince = Math.floor(
    (Date.now() - issuedAt.getTime()) / (1000 * 60 * 60 * 24)
  );
  return `Verified ${daysSince} day${daysSince === 1 ? "" : "s"} ago`;
}

export function AttestationPanel(props: {
  attestations: Attestation[];
  onRevoke?: (id: string, reason: RevocationReason) => Promise<void>;
  onRenew?: (id: string) => Promise<void>;
  isLoading?: boolean;
}) {
  const { attestations, onRevoke, onRenew, isLoading } = props;
  const [revokeTarget, setRevokeTarget] = useState<string | null>(null);

  if (!attestations.length) {
    return (
      <Card>
        <CardHeader>
          <p className="text-sm font-medium text-muted-foreground">
            Attestations
          </p>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No attestations found for this agent.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <p className="text-sm font-medium text-muted-foreground">
            Attestation Lifecycle
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {attestations.map((att) => (
            <div
              key={att.id}
              className="flex flex-col gap-1 rounded border p-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium capitalize">
                    {att.attestation_type}
                  </span>
                  <StatusBadge status={att.status} type="escrow" />
                </div>
                <p className="text-xs text-muted-foreground">
                  {freshnessLabel(att)}
                </p>
                <p className={`text-xs font-medium ${ttlColor(att)}`}>
                  {formatRemaining(att.ttl_remaining_seconds)}
                </p>
                {att.revocation_reason && (
                  <p className="text-xs text-red-400">
                    Reason: {att.revocation_reason.replace(/_/g, " ")}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                {att.status === "active" && onRenew && (
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isLoading}
                    onClick={() => onRenew(att.id)}
                  >
                    Renew
                  </Button>
                )}
                {att.status === "active" && onRevoke && (
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={isLoading}
                    onClick={() => setRevokeTarget(att.id)}
                  >
                    Revoke
                  </Button>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <ConfirmDialog
        open={revokeTarget !== null}
        onOpenChange={(open) => {
          if (!open) setRevokeTarget(null);
        }}
        title="Revoke Attestation"
        description="This will immediately invalidate the attestation. Identity revocations have zero grace period. Continue?"
        confirmLabel="Revoke"
        onConfirm={async () => {
          if (revokeTarget && onRevoke) {
            await onRevoke(revokeTarget, "policy_violation");
            setRevokeTarget(null);
          }
        }}
        isLoading={isLoading}
      />
    </>
  );
}
