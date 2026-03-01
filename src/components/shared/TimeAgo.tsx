"use client";

import { formatDate } from "@/lib/utils/formatters";

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return formatDate(date);
}

export function TimeAgo({
  date,
  showFull = false,
}: {
  date: string | Date;
  showFull?: boolean;
}) {
  const d = typeof date === "string" ? new Date(date) : date;
  return (
    <span title={formatDate(d)}>
      {showFull ? formatDate(d) : formatRelativeTime(d)}
    </span>
  );
}
