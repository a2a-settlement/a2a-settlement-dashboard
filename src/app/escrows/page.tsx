"use client";

import { useState } from "react";
import Link from "next/link";
import { useEscrowsList } from "@/lib/hooks/useEscrows";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TokenAmount } from "@/components/shared/TokenAmount";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import type { Escrow } from "@/lib/api/types";

const STATUS_OPTIONS = ["pending", "held", "released", "refunded", "disputed", "expired"];

export default function EscrowsPage() {
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data, isLoading } = useEscrowsList({
    status: statusFilter !== "all" ? statusFilter : undefined,
  });

  const escrows = data?.escrows ?? [];
  const columns: Column<Escrow>[] = [
    {
      id: "id",
      header: "Escrow ID",
      cell: (row) => (
        <Link href={`/escrows/${row.id}`} className="font-medium text-[#3b82f6] hover:underline">
          {row.id}
        </Link>
      ),
    },
    { id: "requester", header: "Requester", cell: (row) => row.requester_id },
    { id: "provider", header: "Provider", cell: (row) => row.provider_id },
    { id: "amount", header: "Amount", cell: (row) => <TokenAmount amount={row.amount} /> },
    { id: "status", header: "Status", cell: (row) => <StatusBadge status={row.status} type="escrow" /> },
    { id: "created", header: "Created", cell: (row) => new Date(row.created_at).toLocaleDateString() },
    { id: "updated", header: "Updated", cell: (row) => new Date(row.updated_at).toLocaleDateString() },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Escrows</h1>

      <div className="flex flex-wrap gap-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {STATUS_OPTIONS.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <Skeleton className="h-[400px] w-full" />
      ) : (
        <DataTable
          columns={columns}
          data={escrows}
          keyExtractor={(row) => row.id}
          emptyMessage="No escrows found"
        />
      )}
    </div>
  );
}
