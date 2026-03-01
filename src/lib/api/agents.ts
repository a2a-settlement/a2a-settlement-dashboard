/**
 * Agents API - list, detail, suspend, revoke
 */

import { isMockMode } from "./client";
import type { Agent, AgentDetail } from "./types";
import { MOCK_AGENTS } from "@/mock/data";
import { getMockAgentDetail } from "@/mock/data";

export interface ListAgentsParams {
  org?: string;
  status?: string;
  min_reputation?: number;
  max_reputation?: number;
  search?: string;
  limit?: number;
  offset?: number;
}

export async function listAgents(
  params: ListAgentsParams = {}
): Promise<{ agents: Agent[]; total: number }> {
  if (isMockMode()) {
    let filtered = [...MOCK_AGENTS];
    if (params.org) filtered = filtered.filter((a) => a.org_id === params.org);
    if (params.status) filtered = filtered.filter((a) => a.status === params.status);
    if (params.min_reputation != null)
      filtered = filtered.filter((a) => a.reputation >= params.min_reputation!);
    if (params.max_reputation != null)
      filtered = filtered.filter((a) => a.reputation <= params.max_reputation!);
    if (params.search) {
      const s = params.search.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.id.toLowerCase().includes(s) || a.org_id.toLowerCase().includes(s)
      );
    }
    const total = filtered.length;
    const offset = params.offset ?? 0;
    const limit = params.limit ?? 50;
    const agents = filtered.slice(offset, offset + limit);
    return { agents, total };
  }
  const base = process.env.NEXT_PUBLIC_EXCHANGE_URL || "";
  const qs = new URLSearchParams(params as Record<string, string>);
  const res = await fetch(`${base}/api/v1/agents?${qs}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getAgent(agentId: string): Promise<AgentDetail | null> {
  if (isMockMode()) {
    return Promise.resolve(getMockAgentDetail(agentId) ?? null);
  }
  const base = process.env.NEXT_PUBLIC_EXCHANGE_URL || "";
  const res = await fetch(`${base}/api/v1/agents/${agentId}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function suspendAgent(agentId: string): Promise<void> {
  if (isMockMode()) {
    return Promise.resolve();
  }
  const base = process.env.NEXT_PUBLIC_EXCHANGE_URL || "";
  const res = await fetch(`${base}/api/v1/dashboard/agents/${agentId}/suspend`, {
    method: "POST",
  });
  if (!res.ok) throw new Error(await res.text());
}

export async function unsuspendAgent(agentId: string): Promise<void> {
  if (isMockMode()) {
    return Promise.resolve();
  }
  const base = process.env.NEXT_PUBLIC_EXCHANGE_URL || "";
  const res = await fetch(`${base}/api/v1/dashboard/agents/${agentId}/unsuspend`, {
    method: "POST",
  });
  if (!res.ok) throw new Error(await res.text());
}

export async function revokeToken(jti: string): Promise<void> {
  if (isMockMode()) {
    return Promise.resolve();
  }
  const base = process.env.NEXT_PUBLIC_EXCHANGE_URL || "";
  const res = await fetch(`${base}/api/v1/dashboard/tokens/${jti}/revoke`, {
    method: "POST",
  });
  if (!res.ok) throw new Error(await res.text());
}
