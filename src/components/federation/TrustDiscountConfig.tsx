"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { TrustDiscountPolicy } from "@/lib/api/federation";

function formatAlgorithmId(id: string): string {
  const match = id.match(/:([^:]+)-v\d+$/);
  return match ? match[1].replace(/-/g, " ") : id;
}

export function TrustDiscountConfig({ policy }: { policy: TrustDiscountPolicy }) {
  const algorithmName = formatAlgorithmId(policy.algorithm_id);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <h3 className="text-sm font-medium">Trust Discount Policy</h3>
        <Badge variant="secondary">{algorithmName}</Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Algorithm</p>
            <p className="font-mono text-xs break-all">{policy.algorithm_id}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Initial ρ</p>
            <p className="font-medium">{policy.initial_rho}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Max ρ</p>
            <p className="font-medium">{policy.max_rho ?? "1.0"}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Attestation success floor</p>
            <p className="font-medium">
              {policy.attestation_success_floor != null
                ? `${(policy.attestation_success_floor * 100).toFixed(0)}%`
                : "—"}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Review cadence</p>
            <p className="font-medium">
              {policy.review_cadence_days != null
                ? `${policy.review_cadence_days} days`
                : "—"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
