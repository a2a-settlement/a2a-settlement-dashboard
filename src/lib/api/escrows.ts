/**
 * Escrows API - list, detail, force refund
 */

import { isMockMode } from "./client";
import type { Escrow, EscrowDetail } from "./types";
import { MOCK_ESCROWS } from "@/mock/data";

export interface ListEscrowsParams {
  status?: string;
  agent_id?: string;
  min_amount?: number;
  max_amount?: number;
  from_date?: string;
  to_date?: string;
  limit?: number;
  offset?: number;
}

export async function listEscrows(
  params: ListEscrowsParams = {}
): Promise<{ escrows: Escrow[]; total: number }> {
  if (isMockMode()) {
    let filtered = [...MOCK_ESCROWS];
    if (params.status)
      filtered = filtered.filter((e) => e.status === params.status);
    if (params.agent_id)
      filtered = filtered.filter(
        (e) => e.requester_id === params.agent_id || e.provider_id === params.agent_id
      );
    if (params.min_amount != null)
      filtered = filtered.filter((e) => e.amount >= params.min_amount!);
    if (params.max_amount != null)
      filtered = filtered.filter((e) => e.amount <= params.max_amount!);
    if (params.from_date)
      filtered = filtered.filter(
        (e) => new Date(e.created_at) >= new Date(params.from_date!)
      );
    if (params.to_date)
      filtered = filtered.filter(
        (e) => new Date(e.created_at) <= new Date(params.to_date!)
      );
    const total = filtered.length;
    const offset = params.offset ?? 0;
    const limit = params.limit ?? 50;
    const escrows = filtered.slice(offset, offset + limit);
    return { escrows, total };
  }
  const base = process.env.NEXT_PUBLIC_EXCHANGE_URL || "";
  const qs = new URLSearchParams(params as Record<string, string>);
  const res = await fetch(`${base}/api/v1/escrows?${qs}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getEscrow(escrowId: string): Promise<EscrowDetail | null> {
  if (isMockMode()) {
    const escrow = MOCK_ESCROWS.find((e) => e.id === escrowId);
    return Promise.resolve(escrow ?? null);
  }
  const base = process.env.NEXT_PUBLIC_EXCHANGE_URL || "";
  const res = await fetch(`${base}/api/v1/escrows/${escrowId}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function forceRefund(escrowId: string): Promise<void> {
  if (isMockMode()) {
    return Promise.resolve();
  }
  const base = process.env.NEXT_PUBLIC_EXCHANGE_URL || "";
  const res = await fetch(
    `${base}/api/v1/dashboard/escrows/${escrowId}/force-refund`,
    { method: "POST" }
  );
  if (!res.ok) throw new Error(await res.text());
}
