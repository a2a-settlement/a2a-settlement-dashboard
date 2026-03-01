/**
 * Dashboard aggregate API - overview, spending, alerts
 */

import { isMockMode } from "./client";
import type {
  DashboardOverview,
  SpendingDataPoint,
  ActivityEvent,
  Alert,
} from "./types";
import {
  MOCK_OVERVIEW,
  MOCK_SPENDING,
  MOCK_ACTIVITY,
  MOCK_ALERTS,
} from "@/mock/data";

export interface GetSpendingParams {
  range?: "24h" | "7d" | "30d";
  agent_id?: string;
}

export async function getOverview(): Promise<DashboardOverview> {
  if (isMockMode()) {
    return Promise.resolve(MOCK_OVERVIEW);
  }
  const base = process.env.NEXT_PUBLIC_EXCHANGE_URL || "";
  const res = await fetch(`${base}/api/v1/dashboard/overview`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getSpending(
  params: GetSpendingParams = {}
): Promise<SpendingDataPoint[]> {
  if (isMockMode()) {
    const { range = "7d" } = params;
    const days = range === "24h" ? 1 : range === "7d" ? 7 : 30;
    return Promise.resolve(MOCK_SPENDING.slice(-days));
  }
  const base = process.env.NEXT_PUBLIC_EXCHANGE_URL || "";
  const qs = new URLSearchParams(params as Record<string, string>);
  const res = await fetch(`${base}/api/v1/dashboard/spending?${qs}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getActivity(limit = 20): Promise<ActivityEvent[]> {
  if (isMockMode()) {
    return Promise.resolve(MOCK_ACTIVITY.slice(0, limit));
  }
  const base = process.env.NEXT_PUBLIC_EXCHANGE_URL || "";
  const res = await fetch(`${base}/api/v1/dashboard/overview?activity_limit=${limit}`);
  const data = await res.json();
  return data.recent_activity ?? [];
}

export async function getAlerts(): Promise<Alert[]> {
  if (isMockMode()) {
    return Promise.resolve(MOCK_ALERTS);
  }
  const base = process.env.NEXT_PUBLIC_EXCHANGE_URL || "";
  const res = await fetch(`${base}/api/v1/dashboard/alerts`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
