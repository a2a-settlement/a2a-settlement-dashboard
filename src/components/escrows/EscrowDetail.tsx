"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TokenAmount } from "@/components/shared/TokenAmount";
import type { EscrowDetail as EscrowDetailType } from "@/lib/api/types";

export function EscrowDetail({ escrow }: { escrow: EscrowDetailType }) {
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
      </CardContent>
    </Card>
  );
}
