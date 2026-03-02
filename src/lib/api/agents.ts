/**
 * Agents API - list, detail, suspend, revoke
 */

import { apiRequest, isMockMode } from "./client";
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
  const qs = new URLSearchParams(params as Record<string, string>);
  return apiRequest<{ agents: Agent[]; total: number }>(`/api/v1/agents?${qs}`);
}

export async function getAgent(agentId: string): Promise<AgentDetail | null> {
  if (isMockMode()) {
    return Promise.resolve(getMockAgentDetail(agentId) ?? null);
  }
  try {
    return await apiRequest<AgentDetail>(`/api/v1/agents/${agentId}`);
  } catch (e) {
    if (e instanceof Error && e.message.includes("404")) return null;
    throw e;
  }
}

export async function suspendAgent(agentId: string): Promise<void> {
  if (isMockMode()) {
    return Promise.resolve();
  }
  await apiRequest(`/api/v1/dashboard/agents/${agentId}/suspend`, { method: "POST" });
}

export async function unsuspendAgent(agentId: string): Promise<void> {
  if (isMockMode()) {
    return Promise.resolve();
  }
  await apiRequest(`/api/v1/dashboard/agents/${agentId}/unsuspend`, { method: "POST" });
}

export async function revokeToken(jti: string): Promise<void> {
  if (isMockMode()) {
    return Promise.resolve();
  }
  await apiRequest(`/api/v1/dashboard/tokens/${jti}/revoke`, { method: "POST" });
}
