"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listEscrows,
  getEscrow,
  forceRefund,
  type ListEscrowsParams,
} from "@/lib/api/escrows";

const POLL_INTERVAL =
  parseInt(process.env.NEXT_PUBLIC_POLL_INTERVAL || "5000", 10) || 5000;

export function useEscrowsList(params: ListEscrowsParams = {}) {
  return useQuery({
    queryKey: ["escrows", "list", params],
    queryFn: () => listEscrows(params),
    refetchInterval: POLL_INTERVAL,
    staleTime: POLL_INTERVAL / 2,
  });
}

export function useEscrow(escrowId: string | null) {
  return useQuery({
    queryKey: ["escrows", "detail", escrowId],
    queryFn: () => getEscrow(escrowId!),
    enabled: !!escrowId,
    refetchInterval: POLL_INTERVAL,
    staleTime: POLL_INTERVAL / 2,
  });
}

export function useForceRefund() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: forceRefund,
    onSuccess: (_, escrowId) => {
      qc.invalidateQueries({ queryKey: ["escrows"] });
      qc.invalidateQueries({ queryKey: ["escrows", "detail", escrowId] });
    },
  });
}
