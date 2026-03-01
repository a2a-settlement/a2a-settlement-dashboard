"use client";

import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { useState } from "react";
import type { TokenInfo } from "@/lib/api/types";

export function TokenCard(props: {
  token: TokenInfo;
  onRevoke: () => Promise<void>;
  isRevoking: boolean;
}) {
  const { token, onRevoke, isRevoking } = props;
  const [confirmRevoke, setConfirmRevoke] = useState(false);

  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-mono text-sm text-muted-foreground">{token.jti}</p>
          <p className="text-sm mt-1">Scopes: {token.scopes.join(", ")}</p>
          {token.daily_limit != null && (
            <p className="text-sm">Daily limit: {token.daily_limit}</p>
          )}
          {token.spending_limit != null && (
            <p className="text-sm">Spending limit: {token.spending_limit}</p>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            Expires: {new Date(token.expires_at).toLocaleDateString()}
          </p>
        </div>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => setConfirmRevoke(true)}
          disabled={isRevoking}
        >
          Revoke
        </Button>
      </div>

      <ConfirmDialog
        open={confirmRevoke}
        onOpenChange={setConfirmRevoke}
        title="Revoke Token"
        description="This will immediately revoke this token's spending authority. Continue?"
        confirmLabel="Revoke"
        onConfirm={onRevoke}
        isLoading={isRevoking}
      />
    </div>
  );
}
