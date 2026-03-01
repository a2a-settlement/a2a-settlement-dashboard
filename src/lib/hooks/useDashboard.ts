"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getOverview,
  getSpending,
  getActivity,
  getAlerts,
  type GetSpendingParams,
} from "@/lib/api/dashboard";

const POLL_INTERVAL =
  parseInt(process.env.NEXT_PUBLIC_POLL_INTERVAL || "5000", 10) || 5000;

export function useOverview() {
  return useQuery({
    queryKey: ["dashboard", "overview"],
    queryFn: getOverview,
    refetchInterval: POLL_INTERVAL,
    staleTime: POLL_INTERVAL / 2,
  });
}

export function useSpending(params: GetSpendingParams = {}) {
  return useQuery({
    queryKey: ["dashboard", "spending", params],
    queryFn: () => getSpending(params),
    refetchInterval: POLL_INTERVAL,
    staleTime: POLL_INTERVAL / 2,
  });
}

export function useActivity(limit = 20) {
  return useQuery({
    queryKey: ["dashboard", "activity", limit],
    queryFn: () => getActivity(limit),
    refetchInterval: POLL_INTERVAL,
    staleTime: POLL_INTERVAL / 2,
  });
}

export function useAlerts() {
  return useQuery({
    queryKey: ["dashboard", "alerts"],
    queryFn: getAlerts,
    refetchInterval: POLL_INTERVAL,
    staleTime: POLL_INTERVAL / 2,
  });
}
