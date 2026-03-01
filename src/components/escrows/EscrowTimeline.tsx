"use client";

import type { EscrowDetail } from "@/lib/api/types";

export function EscrowTimeline({ escrow }: { escrow: EscrowDetail }) {
  const resolvedStep =
    escrow.status === "released"
      ? "Released"
      : escrow.status === "refunded"
        ? "Refunded"
        : escrow.status === "disputed"
          ? "Disputed"
          : escrow.status === "expired"
            ? "Expired"
            : "Pending";

  return (
    <div className="flex items-center gap-2 overflow-x-auto py-4">
      <div className="flex items-center gap-2 min-w-max">
        <div className="flex flex-col items-center">
          <div className="h-3 w-3 rounded-full bg-[#22c55e]" />
          <p className="text-xs mt-1">Created</p>
          <p className="text-xs text-muted-foreground">
            {new Date(escrow.created_at).toLocaleDateString()}
          </p>
        </div>
        <div className="h-0.5 w-12 bg-muted" />
        <div className="flex flex-col items-center">
          <div
            className={`h-3 w-3 rounded-full ${
              ["released", "refunded", "disputed", "expired"].includes(escrow.status)
                ? "bg-[#22c55e]"
                : "bg-[#eab308]"
            }`}
          />
          <p className="text-xs mt-1">Pending</p>
        </div>
        <div className="h-0.5 w-12 bg-muted" />
        <div className="flex flex-col items-center">
          <div
            className={`h-3 w-3 rounded-full ${
              ["released", "refunded", "disputed", "expired"].includes(escrow.status)
                ? "bg-[#22c55e]"
                : "bg-muted"
            }`}
          />
          <p className="text-xs mt-1">{resolvedStep}</p>
          {escrow.resolved_at && (
            <p className="text-xs text-muted-foreground">
              {new Date(escrow.resolved_at).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
