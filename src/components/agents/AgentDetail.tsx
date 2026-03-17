"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TokenAmount } from "@/components/shared/TokenAmount";
import { DelegationChain } from "./DelegationChain";
import { TokenCard } from "./TokenCard";
import { SpendingLimits } from "./SpendingLimits";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { AttestationPanel } from "./AttestationPanel";
import { useState } from "react";
import type { AgentDetail as AgentDetailType, Attestation, RevocationReason } from "@/lib/api/types";
import { MOCK_ESCROWS } from "@/mock/data";
import { DataTable, type Column } from "@/components/shared/DataTable";
import Link from "next/link";

export function AgentDetail(props: {
  agent: AgentDetailType;
  onSuspend: () => Promise<void>;
  onRevokeToken: (jti: string) => Promise<void>;
  isSuspending: boolean;
  isRevoking: boolean;
  attestations?: Attestation[];
  onRevokeAttestation?: (id: string, reason: RevocationReason) => Promise<void>;
  onRenewAttestation?: (id: string) => Promise<void>;
  isAttestationLoading?: boolean;
}) {
  const {
    agent,
    onSuspend,
    onRevokeToken,
    isSuspending,
    isRevoking,
    attestations = [],
    onRevokeAttestation,
    onRenewAttestation,
    isAttestationLoading,
  } = props;
  const [confirmSuspend, setConfirmSuspend] = useState(false);

  const agentEscrows = MOCK_ESCROWS.filter(
    (e) => e.requester_id === agent.id || e.provider_id === agent.id
  );

  const escrowColumns: Column<typeof agentEscrows[0]>[] = [
    {
      id: "id",
      header: "Escrow ID",
      cell: (row) => (
        <Link href={`/escrows/${row.id}`} className="font-medium text-[#3b82f6] hover:underline">
          {row.id}
        </Link>
      ),
    },
    { id: "role", header: "Role", cell: (row) => (row.requester_id === agent.id ? "Requester" : "Provider") },
    {
      id: "counterparty",
      header: "Counterparty",
      cell: (row) => (row.requester_id === agent.id ? row.provider_id : row.requester_id),
    },
    { id: "amount", header: "Amount", cell: (row) => <TokenAmount amount={row.amount} /> },
    { id: "status", header: "Status", cell: (row) => <StatusBadge status={row.status} type="escrow" /> },
    { id: "created", header: "Created", cell: (row) => new Date(row.created_at).toLocaleDateString() },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <p className="text-sm font-medium text-muted-foreground">Agent Identity</p>
            <div className="flex items-center justify-between">
              <p className="text-lg font-semibold">{agent.id}</p>
              <StatusBadge status={agent.status} type="agent" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><span className="text-muted-foreground">Org:</span> {agent.org_id}</p>
            <p><span className="text-muted-foreground">Environment:</span> {agent.environment ?? "production"}</p>
            <p><span className="text-muted-foreground">Balance:</span> <TokenAmount amount={agent.balance} /></p>
            <p><span className="text-muted-foreground">Reputation:</span> {(agent.reputation * 100).toFixed(1)}%</p>
          </CardContent>
        </Card>

        {agent.delegation_chain && (
          <Card>
            <CardHeader>
              <p className="text-sm font-medium text-muted-foreground">Delegation Chain</p>
            </CardHeader>
            <CardContent>
              <DelegationChain chain={agent.delegation_chain} />
            </CardContent>
          </Card>
        )}
      </div>

      {agent.tokens && agent.tokens.length > 0 && (
        <Card>
          <CardHeader>
            <p className="text-sm font-medium text-muted-foreground">Active Tokens</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {agent.tokens.map((token) => (
              <TokenCard
                key={token.jti}
                token={token}
                onRevoke={() => onRevokeToken(token.jti)}
                isRevoking={isRevoking}
              />
            ))}
          </CardContent>
        </Card>
      )}

      {agent.spending_limits && (
        <Card>
          <CardHeader>
            <p className="text-sm font-medium text-muted-foreground">Spending vs Limits</p>
          </CardHeader>
          <CardContent>
            <SpendingLimits limits={agent.spending_limits} />
          </CardContent>
        </Card>
      )}

      <AttestationPanel
        attestations={attestations}
        onRevoke={onRevokeAttestation}
        onRenew={onRenewAttestation}
        isLoading={isAttestationLoading}
      />

      <div className="flex gap-2">
        <Button
          variant="destructive"
          onClick={() => setConfirmSuspend(true)}
          disabled={agent.status === "suspended" || isSuspending}
        >
          {agent.status === "suspended" ? "Suspended" : "Suspend Agent"}
        </Button>
      </div>

      <ConfirmDialog
        open={confirmSuspend}
        onOpenChange={setConfirmSuspend}
        title="Suspend Agent"
        description={`This will immediately revoke all economic authority for ${agent.id}. Active escrows will NOT be automatically refunded. Continue?`}
        confirmLabel="Suspend"
        onConfirm={onSuspend}
        isLoading={isSuspending}
      />

      <Card>
        <CardHeader>
          <p className="text-sm font-medium text-muted-foreground">Transaction History</p>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={escrowColumns}
            data={agentEscrows}
            keyExtractor={(row) => row.id}
            emptyMessage="No transactions"
          />
        </CardContent>
      </Card>

      {agent.counterparties && agent.counterparties.length > 0 && (
        <Card>
          <CardHeader>
            <p className="text-sm font-medium text-muted-foreground">Top Counterparties</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {agent.counterparties.map((cp) => (
                <div key={cp.agent_id} className="flex justify-between rounded border p-2 text-sm">
                  <Link href={`/agents/${cp.agent_id}`} className="text-[#3b82f6] hover:underline">
                    {cp.agent_id}
                  </Link>
                  <span>{cp.transaction_count} txns, <TokenAmount amount={cp.total_volume} /></span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
