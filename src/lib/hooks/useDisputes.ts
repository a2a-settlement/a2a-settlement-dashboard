"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listDisputes,
  getDispute,
  overrideResolution,
  type ListDisputesParams,
} from "@/lib/api/disputes";

const POLL_INTERVAL =
  parseInt(process.env.NEXT_PUBLIC_POLL_INTERVAL || "5000", 10) || 5000;

export function useDisputesList(params: ListDisputesParams = {}) {
  return useQuery({
    queryKey: ["disputes", "list", params],
    queryFn: () => listDisputes(params),
    refetchInterval: POLL_INTERVAL,
    staleTime: POLL_INTERVAL / 2,
  });
}

export function useDispute(disputeId: string | null) {
  return useQuery({
    queryKey: ["disputes", "detail", disputeId],
    queryFn: () => getDispute(disputeId!),
    enabled: !!disputeId,
    refetchInterval: POLL_INTERVAL,
    staleTime: POLL_INTERVAL / 2,
  });
}

export function useOverrideResolution() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ disputeId, resolution }: { disputeId: string; resolution: "release" | "refund" }) =>
      overrideResolution(disputeId, resolution),
    onSuccess: (_, { disputeId }) => {
      qc.invalidateQueries({ queryKey: ["disputes"] });
      qc.invalidateQueries({ queryKey: ["disputes", "detail", disputeId] });
    },
  });
}
