"use client";

import { formatTokenAmount } from "@/lib/utils/formatters";

export function TokenAmount({
  amount,
  currency = "ATE",
  className,
}: {
  amount: number;
  currency?: string;
  className?: string;
}) {
  return (
    <span className={className}>
      {formatTokenAmount(amount)} {currency}
    </span>
  );
}
