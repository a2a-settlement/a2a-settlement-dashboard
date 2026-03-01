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
