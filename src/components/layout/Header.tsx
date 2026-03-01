"use client";

import { useExchangeHealth } from "@/lib/hooks/useExchangeHealth";
import { StatusIndicator } from "./StatusIndicator";
import { getBaseUrl } from "@/lib/api/client";

export function Header() {
  const { data: health, isLoading } = useExchangeHealth();
  const isMock = process.env.NEXT_PUBLIC_USE_MOCK === "true";

  const status =
    isLoading ? "loading" : health?.ok ? "ok" : "error";
  const label = isMock
    ? "Mock mode"
    : health
      ? `${health.url}${health.latency != null ? ` (${health.latency}ms)` : ""}`
      : getBaseUrl();

  return (
    <header className="flex h-14 items-center justify-between border-b px-4">
      <div className="flex items-center gap-4">
        <StatusIndicator status={status} label={label} />
      </div>
      <div className="text-sm text-muted-foreground">
        Dashboard User
      </div>
    </header>
  );
}
