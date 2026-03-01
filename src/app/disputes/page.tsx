"use client";

import { useState } from "react";
import Link from "next/link";
import { useDisputesList } from "@/lib/hooks/useDisputes";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import type { Dispute } from "@/lib/api/types";

export default function DisputesPage() {
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data, isLoading } = useDisputesList({
    status: statusFilter !== "all" ? statusFilter : undefined,
  });

  const disputes = data?.disputes ?? [];
  const columns: Column<Dispute>[] = [
    {
      id: "id",
      header: "Dispute ID",
      cell: (row) => (
        <Link href={`/disputes/${row.id}`} className="font-medium text-[#3b82f6] hover:underline">
          {row.id}
        </Link>
      ),
    },
    {
      id: "escrow",
      header: "Escrow ID",
      cell: (row) => (
        <Link href={`/escrows/${row.escrow_id}`} className="text-[#3b82f6] hover:underline">
          {row.escrow_id}
        </Link>
      ),
    },
    { id: "filed_by", header: "Filed By", cell: (row) => row.filed_by },
    { id: "against", header: "Against", cell: (row) => row.against },
    { id: "reason", header: "Reason", cell: (row) => row.reason.slice(0, 40) + (row.reason.length > 40 ? "..." : "") },
    { id: "status", header: "Status", cell: (row) => <StatusBadge status={row.status} type="dispute" /> },
    { id: "filed_at", header: "Filed Date", cell: (row) => new Date(row.filed_at).toLocaleDateString() },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Disputes</h1>

      <div className="flex flex-wrap gap-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="mediating">Mediating</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <Skeleton className="h-[400px] w-full" />
      ) : (
        <DataTable
          columns={columns}
          data={disputes}
          keyExtractor={(row) => row.id}
          emptyMessage="No disputes found"
        />
      )}
    </div>
  );
}
