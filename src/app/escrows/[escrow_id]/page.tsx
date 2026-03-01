"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useEscrow, useForceRefund } from "@/lib/hooks/useEscrows";
import { EscrowDetail } from "@/components/escrows/EscrowDetail";
import { EscrowTimeline } from "@/components/escrows/EscrowTimeline";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";

export default function EscrowDetailPage() {
  const params = useParams();
  const router = useRouter();
  const escrowId = params.escrow_id as string;

  const { data: escrow, isLoading } = useEscrow(escrowId);
  const forceRefundMutation = useForceRefund();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (!escrow) {
    return (
      <div className="space-y-6">
        <p className="text-muted-foreground">Escrow not found</p>
        <Button variant="outline" onClick={() => router.push("/escrows")}>
          Back to Escrows
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/escrows">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">{escrow.id}</h1>
      </div>

      <EscrowDetail escrow={escrow} />
      <EscrowTimeline escrow={escrow} />

      {(escrow.status === "pending" || escrow.status === "held" || escrow.status === "disputed") && (
        <Button
          variant="destructive"
          onClick={() => forceRefundMutation.mutate(escrowId)}
          disabled={forceRefundMutation.isPending}
        >
          Force Refund (Admin)
        </Button>
      )}
    </div>
  );
}
