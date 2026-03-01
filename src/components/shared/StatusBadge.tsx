"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type EscrowStatusVariant = "pending" | "released" | "refunded" | "disputed" | "expired";
type AgentStatusVariant = "active" | "suspended";
type DisputeStatusVariant = "open" | "mediating" | "resolved";

const ESCROW_VARIANTS: Record<string, EscrowStatusVariant> = {
  pending: "pending",
  held: "pending",
  released: "released",
  refunded: "refunded",
  disputed: "disputed",
  expired: "expired",
};

export function StatusBadge({
  status,
  type = "escrow",
  className,
}: {
  status: string;
  type?: "escrow" | "agent" | "dispute";
  className?: string;
}) {
  const variant =
    type === "escrow"
      ? (ESCROW_VARIANTS[status] ?? "default")
      : type === "agent"
        ? (status === "suspended" ? "destructive" : "secondary")
        : status === "open"
          ? "destructive"
          : status === "mediating"
            ? "pending"
            : "released";

  const label =
    type === "escrow"
      ? status.charAt(0).toUpperCase() + status.slice(1)
      : status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <Badge
      variant={variant as "pending" | "released" | "refunded" | "disputed" | "expired"}
      className={cn(className)}
    >
      {label}
    </Badge>
  );
}
