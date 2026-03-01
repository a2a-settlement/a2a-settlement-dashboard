"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listAgents,
  getAgent,
  suspendAgent,
  unsuspendAgent,
  revokeToken,
  type ListAgentsParams,
} from "@/lib/api/agents";

const POLL_INTERVAL =
  parseInt(process.env.NEXT_PUBLIC_POLL_INTERVAL || "5000", 10) || 5000;

export function useAgentsList(params: ListAgentsParams = {}) {
  return useQuery({
    queryKey: ["agents", "list", params],
    queryFn: () => listAgents(params),
    refetchInterval: POLL_INTERVAL,
    staleTime: POLL_INTERVAL / 2,
  });
}

export function useAgent(agentId: string | null) {
  return useQuery({
    queryKey: ["agents", "detail", agentId],
    queryFn: () => getAgent(agentId!),
    enabled: !!agentId,
    refetchInterval: POLL_INTERVAL,
    staleTime: POLL_INTERVAL / 2,
  });
}

export function useSuspendAgent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: suspendAgent,
    onSuccess: (_, agentId) => {
      qc.invalidateQueries({ queryKey: ["agents"] });
      qc.invalidateQueries({ queryKey: ["agents", "detail", agentId] });
    },
  });
}

export function useUnsuspendAgent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: unsuspendAgent,
    onSuccess: (_, agentId) => {
      qc.invalidateQueries({ queryKey: ["agents"] });
      qc.invalidateQueries({ queryKey: ["agents", "detail", agentId] });
    },
  });
}

export function useRevokeToken() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: revokeToken,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["agents"] });
    },
  });
}
