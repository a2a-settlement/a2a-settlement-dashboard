"use client";

import type { DelegationLink } from "@/lib/api/types";

export function DelegationChain({ chain }: { chain: DelegationLink[] }) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {chain.map((link, i) => (
        <span key={link.id} className="flex items-center gap-2">
          <span
            className={`rounded px-2 py-1 text-sm ${
              link.type === "principal"
                ? "bg-[#3b82f6]/20 text-[#3b82f6]"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {link.name}
          </span>
          {i < chain.length - 1 && (
            <span className="text-muted-foreground">→</span>
          )}
        </span>
      ))}
    </div>
  );
}
