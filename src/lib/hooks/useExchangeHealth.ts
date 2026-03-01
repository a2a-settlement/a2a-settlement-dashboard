"use client";

import { useQuery } from "@tanstack/react-query";
import type { HealthResponse } from "@/lib/api/types";

const getBaseUrl = () =>
  process.env.NEXT_PUBLIC_EXCHANGE_URL || "http://localhost:3000";

async function checkHealth(): Promise<{
  ok: boolean;
  latency?: number;
  url: string;
}> {
  const url = getBaseUrl();
  if (process.env.NEXT_PUBLIC_USE_MOCK === "true") {
    return { ok: true, latency: 0, url };
  }
  const start = performance.now();
  try {
    const res = await fetch(`${url}/health`);
    const latency = Math.round(performance.now() - start);
    const data = (await res.json()) as HealthResponse;
    return {
      ok: res.ok && data.status === "ok",
      latency,
      url,
    };
  } catch {
    return { ok: false, url };
  }
}

export function useExchangeHealth() {
  return useQuery({
    queryKey: ["exchange-health"],
    queryFn: checkHealth,
    refetchInterval: 10000,
    staleTime: 5000,
  });
}
