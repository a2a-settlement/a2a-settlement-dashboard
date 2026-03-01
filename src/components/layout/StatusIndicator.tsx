"use client";

import { cn } from "@/lib/utils";

export function StatusIndicator({
  status,
  label,
  className,
}: {
  status: "ok" | "error" | "loading";
  label?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span
        className={cn(
          "h-2 w-2 rounded-full",
          status === "ok" && "bg-[#22c55e]",
          status === "error" && "bg-[#ef4444]",
          status === "loading" && "animate-pulse bg-[#eab308]"
        )}
      />
      {label && (
        <span className="text-sm text-muted-foreground">{label}</span>
      )}
    </div>
  );
}
