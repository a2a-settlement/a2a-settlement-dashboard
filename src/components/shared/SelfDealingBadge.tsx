import type { SelfDealingClass } from "@/lib/api/types";

interface SelfDealingBadgeProps {
  value: SelfDealingClass | null | undefined;
  showArmsLength?: boolean;
}

const CONFIG: Record<
  SelfDealingClass,
  { label: string; className: string }
> = {
  arms_length: {
    label: "Arms-Length",
    className:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  },
  suspected_self_dealing: {
    label: "Suspected",
    className:
      "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  },
  self_dealing: {
    label: "Self-Dealing",
    className:
      "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  },
};

export function SelfDealingBadge({
  value,
  showArmsLength = false,
}: SelfDealingBadgeProps) {
  if (!value) return null;
  if (value === "arms_length" && !showArmsLength) return null;

  const { label, className } = CONFIG[value];

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}
      title={`Transaction class: ${value}`}
    >
      {label}
    </span>
  );
}
