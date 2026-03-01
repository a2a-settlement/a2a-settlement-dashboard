"use client";

import type { SpendingLimit } from "@/lib/api/types";

export function SpendingLimits({ limits }: { limits: SpendingLimit }) {
  const dailyPct = limits.daily_limit > 0 ? (limits.daily_used / limits.daily_limit) * 100 : 0;
  const sessionPct =
    limits.session_limit && limits.session_limit > 0
      ? (limits.session_used / limits.session_limit) * 100
      : 0;

  const barColor = (pct: number) =>
    pct >= 80 ? "bg-[#ef4444]" : pct >= 60 ? "bg-[#eab308]" : "bg-[#22c55e]";

  return (
    <div className="space-y-4">
      <div>
        <div className="flex justify-between text-sm mb-1">
          <span>Daily: {limits.daily_used} / {limits.daily_limit}</span>
          <span>{dailyPct.toFixed(0)}%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${barColor(dailyPct)}`}
            style={{ width: `${Math.min(dailyPct, 100)}%` }}
          />
        </div>
      </div>
      {limits.session_limit != null && (
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Session: {limits.session_used} / {limits.session_limit}</span>
            <span>{sessionPct.toFixed(0)}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${barColor(sessionPct)}`}
              style={{ width: `${Math.min(sessionPct, 100)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
