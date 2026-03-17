"use client";

import { useQuery } from "@tanstack/react-query";
import {
  fetchFederationPeers,
  fetchFederationHealth,
  fetchTrustPolicy,
} from "@/lib/api/federation";

const POLL_INTERVAL =
  parseInt(process.env.NEXT_PUBLIC_POLL_INTERVAL || "5000", 10) || 5000;

export function useFederationPeers() {
  return useQuery({
    queryKey: ["federation", "peers"],
    queryFn: fetchFederationPeers,
    refetchInterval: POLL_INTERVAL,
    staleTime: POLL_INTERVAL / 2,
  });
}

export function useFederationHealth() {
  return useQuery({
    queryKey: ["federation", "health"],
    queryFn: fetchFederationHealth,
    refetchInterval: POLL_INTERVAL,
    staleTime: POLL_INTERVAL / 2,
  });
}

export function useTrustPolicy() {
  return useQuery({
    queryKey: ["federation", "trust-policy"],
    queryFn: fetchTrustPolicy,
    refetchInterval: POLL_INTERVAL,
    staleTime: POLL_INTERVAL / 2,
  });
}
