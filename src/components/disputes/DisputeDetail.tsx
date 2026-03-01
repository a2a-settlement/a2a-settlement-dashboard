"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/StatusBadge";
import type { Dispute } from "@/lib/api/types";

export function DisputeDetail({ dispute }: { dispute: Dispute }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">{dispute.id}</p>
          <StatusBadge status={dispute.status} type="dispute" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">Escrow</p>
          <Link href={`/escrows/${dispute.escrow_id}`} className="text-[#3b82f6] hover:underline">
            {dispute.escrow_id}
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground">Filed By</p>
            <Link href={`/agents/${dispute.filed_by}`} className="text-[#3b82f6] hover:underline">
              {dispute.filed_by}
            </Link>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Against</p>
            <Link href={`/agents/${dispute.against}`} className="text-[#3b82f6] hover:underline">
              {dispute.against}
            </Link>
          </div>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Reason</p>
          <p>{dispute.reason}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Filed At</p>
          <p>{new Date(dispute.filed_at).toLocaleString()}</p>
        </div>
        {dispute.mediator_id && (
          <div>
            <p className="text-sm text-muted-foreground">Mediator</p>
            <p>{dispute.mediator_id}</p>
          </div>
        )}
        {dispute.resolution && (
          <div>
            <p className="text-sm text-muted-foreground">Resolution</p>
            <p>{dispute.resolution}</p>
          </div>
        )}
        {dispute.resolved_at && (
          <div>
            <p className="text-sm text-muted-foreground">Resolved At</p>
            <p>{new Date(dispute.resolved_at).toLocaleString()}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
