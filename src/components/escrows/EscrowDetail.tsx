"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TokenAmount } from "@/components/shared/TokenAmount";
import type { EscrowDetail as EscrowDetailType, EvidenceSubmission } from "@/lib/api/types";

function EvidenceTimeline({ evidence }: { evidence: EvidenceSubmission[] }) {
  if (evidence.length === 0) return null;
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">Evidence Submissions</p>
      <div className="space-y-2">
        {evidence.map((e) => (
          <div key={e.id} className="rounded-md border p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium capitalize">{e.evidence_type.replace("_", " ")}</span>
              <span className="text-xs text-muted-foreground">
                {new Date(e.submitted_at).toLocaleString()}
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{e.summary}</p>
            <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
              <span>From: {e.submitter_id.slice(0, 8)}...</span>
              <span>{e.artifact_count} artifact(s)</span>
              {e.encrypted && (
                <span className="rounded bg-amber-100 px-1.5 py-0.5 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                  Encrypted
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EvidenceWindowCountdown({ closesAt }: { closesAt: string }) {
  const [remaining, setRemaining] = useState("");

  useEffect(() => {
    const update = () => {
      const diff = new Date(closesAt).getTime() - Date.now();
      if (diff <= 0) {
        setRemaining("Expired");
        return;
      }
      const hours = Math.floor(diff / 3_600_000);
      const minutes = Math.floor((diff % 3_600_000) / 60_000);
      setRemaining(`${hours}h ${minutes}m remaining`);
    };
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, [closesAt]);

  return (
    <div>
      <p className="text-sm text-muted-foreground">Evidence Window</p>
      <p className="font-mono text-sm">{remaining}</p>
    </div>
  );
}

export function EscrowDetail({
  escrow,
  evidence = [],
  exchangeUrl,
}: {
  escrow: EscrowDetailType;
  evidence?: EvidenceSubmission[];
  exchangeUrl?: string;
}) {
  const handleExportCompliance = async () => {
    if (!exchangeUrl) return;
    try {
      const resp = await fetch(
        `${exchangeUrl}/v1/exchange/escrow/${escrow.id}/compliance-bundle`,
        { credentials: "include" },
      );
      const bundle = await resp.json();
      const blob = new Blob([JSON.stringify(bundle, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `compliance-bundle-${escrow.id}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // Compliance export failed silently
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">{escrow.id}</p>
          <StatusBadge status={escrow.status} type="escrow" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground">Requester</p>
            <Link href={`/agents/${escrow.requester_id}`} className="text-[#3b82f6] hover:underline">
              {escrow.requester_id}
            </Link>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Provider</p>
            <Link href={`/agents/${escrow.provider_id}`} className="text-[#3b82f6] hover:underline">
              {escrow.provider_id}
            </Link>
          </div>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Amount</p>
          <TokenAmount amount={escrow.amount} />
          {escrow.fee_amount != null && (
            <p className="text-sm text-muted-foreground">Fee: {escrow.fee_amount}</p>
          )}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground">Created</p>
            <p>{new Date(escrow.created_at).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Updated</p>
            <p>{new Date(escrow.updated_at).toLocaleString()}</p>
          </div>
        </div>
        {escrow.required_attestation_level && (
          <div>
            <p className="text-sm text-muted-foreground">Required Attestation</p>
            <p className="font-mono text-sm">{escrow.required_attestation_level}</p>
          </div>
        )}

        {/* Dispute Stake */}
        {escrow.dispute_stake_amount != null && escrow.dispute_stake_amount > 0 && (
          <div className="rounded-md border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-950">
            <p className="mb-1 text-sm font-medium">Dispute Stake</p>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <p className="text-sm text-muted-foreground">Amount</p>
                <TokenAmount amount={escrow.dispute_stake_amount} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="text-sm font-mono capitalize">{escrow.dispute_stake_status ?? "unknown"}</p>
              </div>
              {escrow.dispute_filed_by && (
                <div>
                  <p className="text-sm text-muted-foreground">Filed By</p>
                  <p className="text-sm font-mono">{escrow.dispute_filed_by.slice(0, 8)}...</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Evidence Window */}
        {escrow.status === "evidence_pending" && escrow.evidence_window_closes_at && (
          <EvidenceWindowCountdown closesAt={escrow.evidence_window_closes_at} />
        )}

        {escrow.delivered_at && (
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Delivered</p>
              <p>{new Date(escrow.delivered_at).toLocaleString()}</p>
            </div>
            {escrow.provenance && (
              <div>
                <p className="text-sm text-muted-foreground">Source</p>
                <p className="font-mono text-sm">
                  {escrow.provenance.source_type} ({escrow.provenance.attestation_level})
                </p>
              </div>
            )}
          </div>
        )}
        {escrow.provenance_result && (
          <div className="rounded-md border p-3">
            <p className="mb-1 text-sm font-medium">Provenance Verification</p>
            <div className="flex items-center gap-2">
              <span className={`inline-block h-2 w-2 rounded-full ${escrow.provenance_result.verified ? "bg-green-500" : "bg-red-500"}`} />
              <span className="text-sm">
                {escrow.provenance_result.verified ? "Verified" : "Failed"} —{" "}
                {escrow.provenance_result.recommendation} ({(escrow.provenance_result.confidence * 100).toFixed(0)}% confidence)
              </span>
            </div>
            {escrow.provenance_result.flags.length > 0 && (
              <div className="mt-1 flex flex-wrap gap-1">
                {escrow.provenance_result.flags.map((flag) => (
                  <span key={flag} className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
                    {flag}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
        {escrow.dispute_reason && (
          <div>
            <p className="text-sm text-muted-foreground">Dispute Reason</p>
            <p className="text-[#ef4444]">{escrow.dispute_reason}</p>
          </div>
        )}

        {/* Evidence Timeline */}
        <EvidenceTimeline evidence={evidence} />

        {/* Compliance Bundle Export */}
        {exchangeUrl && (
          <button
            onClick={handleExportCompliance}
            className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            Export Compliance Bundle
          </button>
        )}
      </CardContent>
    </Card>
  );
}
