"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useDispute, useOverrideResolution } from "@/lib/hooks/useDisputes";
import { DisputeDetail } from "@/components/disputes/DisputeDetail";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";

export default function DisputeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const disputeId = params.dispute_id as string;

  const { data: dispute, isLoading } = useDispute(disputeId);
  const overrideMutation = useOverrideResolution();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (!dispute) {
    return (
      <div className="space-y-6">
        <p className="text-muted-foreground">Dispute not found</p>
        <Button variant="outline" onClick={() => router.push("/disputes")}>
          Back to Disputes
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/disputes">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">{dispute.id}</h1>
      </div>

      <DisputeDetail dispute={dispute} />

      {dispute.status !== "resolved" && (
        <div className="flex gap-2">
          <Button
            variant="default"
            onClick={() => overrideMutation.mutate({ disputeId, resolution: "release" })}
            disabled={overrideMutation.isPending}
          >
            Override: Release
          </Button>
          <Button
            variant="destructive"
            onClick={() => overrideMutation.mutate({ disputeId, resolution: "refund" })}
            disabled={overrideMutation.isPending}
          >
            Override: Refund
          </Button>
        </div>
      )}
    </div>
  );
}
