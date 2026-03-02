/**
 * Disputes API - list, detail, override resolution
 */

import { apiRequest, isMockMode } from "./client";
import type { Dispute } from "./types";
import { MOCK_DISPUTES } from "@/mock/data";

export interface ListDisputesParams {
  status?: string;
  agent_id?: string;
  from_date?: string;
  to_date?: string;
  limit?: number;
  offset?: number;
}

export async function listDisputes(
  params: ListDisputesParams = {}
): Promise<{ disputes: Dispute[]; total: number }> {
  if (isMockMode()) {
    let filtered = [...MOCK_DISPUTES];
    if (params.status)
      filtered = filtered.filter((d) => d.status === params.status);
    if (params.agent_id)
      filtered = filtered.filter(
        (d) => d.filed_by === params.agent_id || d.against === params.agent_id
      );
    if (params.from_date)
      filtered = filtered.filter(
        (d) => new Date(d.filed_at) >= new Date(params.from_date!)
      );
    if (params.to_date)
      filtered = filtered.filter(
        (d) => new Date(d.filed_at) <= new Date(params.to_date!)
      );
    const total = filtered.length;
    const offset = params.offset ?? 0;
    const limit = params.limit ?? 50;
    const disputes = filtered.slice(offset, offset + limit);
    return { disputes, total };
  }
  const qs = new URLSearchParams(params as Record<string, string>);
  return apiRequest<{ disputes: Dispute[]; total: number }>(`/api/v1/disputes?${qs}`);
}

export async function getDispute(disputeId: string): Promise<Dispute | null> {
  if (isMockMode()) {
    const dispute = MOCK_DISPUTES.find((d) => d.id === disputeId);
    return Promise.resolve(dispute ?? null);
  }
  try {
    return await apiRequest<Dispute>(`/api/v1/disputes/${disputeId}`);
  } catch (e) {
    if (e instanceof Error && e.message.includes("404")) return null;
    throw e;
  }
}

export async function overrideResolution(
  disputeId: string,
  resolution: "release" | "refund"
): Promise<void> {
  if (isMockMode()) {
    return Promise.resolve();
  }
  await apiRequest(`/api/v1/disputes/${disputeId}/resolve`, {
    method: "POST",
    body: { resolution },
  });
}
