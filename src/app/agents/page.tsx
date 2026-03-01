"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAgentsList } from "@/lib/hooks/useAgents";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TokenAmount } from "@/components/shared/TokenAmount";
import { TimeAgo } from "@/components/shared/TimeAgo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import type { Agent } from "@/lib/api/types";
import { MOCK_AGENTS } from "@/mock/data";

const ORGS = [...new Set(MOCK_AGENTS.map((a) => a.org_id))];

export default function AgentsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [orgFilter, setOrgFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data, isLoading } = useAgentsList({
    search: search || undefined,
    org: orgFilter !== "all" ? orgFilter : undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
  });

  const agents = data?.agents ?? [];
  const columns: Column<Agent>[] = [
    {
      id: "id",
      header: "Agent ID",
      cell: (row) => (
        <Link href={`/agents/${row.id}`} className="font-medium text-[#3b82f6] hover:underline">
          {row.id}
        </Link>
      ),
    },
    { id: "org", header: "Org ID", cell: (row) => row.org_id },
    {
      id: "balance",
      header: "Balance",
      cell: (row) => <TokenAmount amount={row.balance} />,
    },
    {
      id: "reputation",
      header: "Reputation",
      cell: (row) => `${(row.reputation * 100).toFixed(1)}%`,
    },
    { id: "txns", header: "Total Txns", cell: (row) => row.total_transactions },
    {
      id: "status",
      header: "Status",
      cell: (row) => <StatusBadge status={row.status} type="agent" />,
    },
    {
      id: "last_active",
      header: "Last Active",
      cell: (row) => <TimeAgo date={row.last_active} />,
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Agents</h1>

      <div className="flex flex-wrap gap-4">
        <Input
          placeholder="Search agents..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Select value={orgFilter} onValueChange={setOrgFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Org" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All orgs</SelectItem>
            {ORGS.map((org) => (
              <SelectItem key={org} value={org}>
                {org}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm">
          Export CSV
        </Button>
      </div>

      {isLoading ? (
        <Skeleton className="h-[400px] w-full" />
      ) : (
        <DataTable
          columns={columns}
          data={agents}
          keyExtractor={(row) => row.id}
          onRowClick={(row) => router.push(`/agents/${row.id}`)}
          emptyMessage="No agents found"
        />
      )}
    </div>
  );
}
