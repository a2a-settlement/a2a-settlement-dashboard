/**
 * Escrow status values and their display config
 */
export const ESCROW_STATUS = {
  pending: { label: "Pending", color: "pending" as const },
  held: { label: "Held", color: "pending" as const },
  released: { label: "Released", color: "released" as const },
  refunded: { label: "Refunded", color: "refunded" as const },
  disputed: { label: "Disputed", color: "disputed" as const },
  expired: { label: "Expired", color: "expired" as const },
} as const;

/**
 * Agent status values
 */
export const AGENT_STATUS = {
  active: "active",
  suspended: "suspended",
  revoked: "revoked",
} as const;

/**
 * Dispute status values
 */
export const DISPUTE_STATUS = {
  open: "open",
  mediating: "mediating",
  resolved: "resolved",
} as const;

/**
 * Color system for dashboard
 */
export const COLORS = {
  healthy: "#22c55e",
  pending: "#eab308",
  danger: "#ef4444",
  info: "#3b82f6",
  inactive: "#6b7280",
} as const;

/**
 * Default poll interval in ms
 */
export const DEFAULT_POLL_INTERVAL = 5000;

/**
 * Alert threshold: flag when agent reaches this % of daily limit
 */
export const SPENDING_ALERT_THRESHOLD = 0.8;

/**
 * Alert threshold: flag when reputation drops by this amount
 */
export const REPUTATION_ALERT_THRESHOLD = 0.1;
