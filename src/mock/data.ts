/**
 * Realistic mock data for A2A Settlement Dashboard development
 */

import type {
  Agent,
  AgentDetail,
  Escrow,
  EscrowDetail,
  Dispute,
  DashboardOverview,
  SpendingDataPoint,
  ActivityEvent,
  Alert,
  DelegationLink,
  TokenInfo,
  CounterpartySummary,
} from "@/lib/api/types";

const ORGS = ["org-acme", "org-globex", "org-initech", "org-umbrella", "org-wayne"];
const STATUSES = ["released", "released", "released", "released", "released", "released", "pending", "pending", "refunded", "refunded", "disputed", "disputed", "expired"] as const;

function randomId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 11)}`;
}

function randomDate(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - Math.random() * daysAgo);
  return d.toISOString();
}

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Generate 25 agents
export const MOCK_AGENTS: Agent[] = Array.from({ length: 25 }, (_, i) => {
  const org = ORGS[i % ORGS.length];
  const reputation = 0.3 + Math.random() * 0.65;
  const totalTxns = Math.floor(Math.random() * 200) + 5;
  return {
    id: `agent-${org}-${String(i + 1).padStart(2, "0")}`,
    org_id: org,
    balance: Math.floor(Math.random() * 5000) + 100,
    reputation: Math.round(reputation * 100) / 100,
    total_transactions: totalTxns,
    status: i === 3 || i === 7 ? "suspended" : "active",
    last_active: randomDate(2),
    created_at: randomDate(90),
    environment: i % 5 === 0 ? "sandbox" : "production",
  };
});

// Generate 150 escrows
const agentIds = MOCK_AGENTS.map((a) => a.id);
export const MOCK_ESCROWS: EscrowDetail[] = Array.from({ length: 150 }, (_, i) => {
  const requester = pick(agentIds);
  let provider = pick(agentIds);
  while (provider === requester) provider = pick(agentIds);
  const amount = Math.floor(Math.random() * 500) + 5;
  const status = pick(STATUSES);
  const created = randomDate(30);
  const updated = status === "pending" || status === "held" ? created : randomDate(20);
  return {
    id: `esc-${String(i + 1).padStart(4, "0")}`,
    requester_id: requester,
    provider_id: provider,
    amount,
    fee_amount: Math.ceil(amount * 0.0025) || 1,
    status,
    created_at: created,
    updated_at: updated,
    expires_at: new Date(new Date(created).getTime() + 30 * 60 * 1000).toISOString(),
    task_id: `task-${i}`,
    dispute_reason: status === "disputed" ? "Provider delivered incomplete results" : undefined,
    resolution_strategy: status === "disputed" && Math.random() > 0.5 ? "ai-mediator" : undefined,
    resolved_at: status !== "pending" && status !== "held" ? updated : undefined,
  };
});

// Generate 8 disputes
const disputedEscrows = MOCK_ESCROWS.filter((e) => e.status === "disputed");
export const MOCK_DISPUTES: Dispute[] = disputedEscrows.slice(0, 8).map((e, i) => ({
  id: `disp-${String(i + 1).padStart(3, "0")}`,
  escrow_id: e.id,
  filed_by: e.requester_id,
  against: e.provider_id,
  reason: "Provider delivered incomplete results",
  status: i < 3 ? "open" : i < 6 ? "mediating" : "resolved",
  filed_at: e.updated_at,
  mediator_id: i >= 3 ? "mediator-ai-01" : undefined,
  resolution: i >= 6 ? (Math.random() > 0.5 ? "refund" : "release") : undefined,
  resolved_at: i >= 6 ? randomDate(5) : undefined,
}));

// Spending time series (last 30 days)
const now = new Date();
export const MOCK_SPENDING: SpendingDataPoint[] = Array.from({ length: 30 }, (_, i) => {
  const d = new Date(now);
  d.setDate(d.getDate() - (29 - i));
  const baseVolume = 500 + Math.random() * 2000;
  const anomaly = i === 25 ? 2.5 : i === 15 ? 1.8 : 1;
  return {
    date: d.toISOString().slice(0, 10),
    volume: Math.floor(baseVolume * anomaly),
    count: Math.floor(10 + Math.random() * 40),
  };
});

// Activity feed (last 20 events)
const eventTypes = ["escrow_created", "escrow_released", "escrow_refunded", "escrow_disputed", "escrow_expired"] as const;
export const MOCK_ACTIVITY: ActivityEvent[] = Array.from({ length: 20 }, (_, i) => {
  const escrow = MOCK_ESCROWS[i % MOCK_ESCROWS.length];
  const type = pick(eventTypes);
  const desc = {
    escrow_created: `Escrow created for ${escrow.amount} tokens`,
    escrow_released: `Escrow released to provider`,
    escrow_refunded: `Escrow refunded to requester`,
    escrow_disputed: `Escrow disputed`,
    escrow_expired: `Escrow expired`,
  }[type];
  return {
    id: `evt-${i}`,
    type,
    timestamp: randomDate(1),
    agent_id: escrow.requester_id,
    amount: escrow.amount,
    escrow_id: escrow.id,
    description: desc,
  };
}).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

// Alerts
export const MOCK_ALERTS: Alert[] = [
  {
    id: "alert-1",
    type: "spending_limit",
    severity: "warning",
    agent_id: MOCK_AGENTS[0].id,
    message: `${MOCK_AGENTS[0].id} has spent 4,200 of 5,000 daily limit`,
    timestamp: new Date().toISOString(),
    link: `/agents/${MOCK_AGENTS[0].id}`,
  },
  {
    id: "alert-2",
    type: "dispute",
    severity: "critical",
    message: "3 new disputes filed in the last 24 hours",
    timestamp: randomDate(0.5),
    link: "/disputes",
  },
  {
    id: "alert-3",
    type: "reputation_drop",
    severity: "warning",
    agent_id: MOCK_AGENTS[5].id,
    message: `${MOCK_AGENTS[5].id} reputation dropped by 0.12`,
    timestamp: randomDate(1),
    link: `/agents/${MOCK_AGENTS[5].id}`,
  },
];

// Dashboard overview
const volume24h = MOCK_SPENDING.slice(-1)[0]?.volume ?? 0;
const totalDisputes = MOCK_DISPUTES.length;
const resolvedDisputes = MOCK_DISPUTES.filter((d) => d.status === "resolved").length;
export const MOCK_OVERVIEW: DashboardOverview = {
  total_agents: MOCK_AGENTS.length,
  active_escrows: MOCK_ESCROWS.filter((e) => e.status === "pending" || e.status === "held").length,
  volume_24h: volume24h,
  dispute_rate: totalDisputes > 0 ? resolvedDisputes / totalDisputes : 0,
};

// Get agent detail with delegation chain and tokens
export function getMockAgentDetail(agentId: string): AgentDetail | null {
  const agent = MOCK_AGENTS.find((a) => a.id === agentId);
  if (!agent) return null;

  const delegationChain: DelegationLink[] = [
    { id: "principal-1", type: "principal", name: "Human Principal" },
    { id: agent.id, type: "agent", name: agent.id },
  ];

  const tokens: TokenInfo[] = [
    {
      jti: `jti-${agentId}-1`,
      scopes: ["settlement:create", "settlement:release", "settlement:refund"],
      spending_limit: 10000,
      daily_limit: 5000,
      session_limit: 2000,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  const agentEscrows = MOCK_ESCROWS.filter(
    (e) => e.requester_id === agentId || e.provider_id === agentId
  );
  const counterpartyMap = new Map<string, { count: number; volume: number }>();
  for (const e of agentEscrows) {
    const other = e.requester_id === agentId ? e.provider_id : e.requester_id;
    const curr = counterpartyMap.get(other) ?? { count: 0, volume: 0 };
    curr.count += 1;
    curr.volume += e.amount;
    counterpartyMap.set(other, curr);
  }
  const counterparties: CounterpartySummary[] = Array.from(counterpartyMap.entries())
    .map(([agent_id, { count, volume }]) => ({
      agent_id,
      transaction_count: count,
      total_volume: volume,
      reputation: MOCK_AGENTS.find((a) => a.id === agent_id)?.reputation ?? 0.5,
    }))
    .sort((a, b) => b.transaction_count - a.transaction_count)
    .slice(0, 10);

  return {
    ...agent,
    delegation_chain: delegationChain,
    tokens,
    spending_limits: {
      daily_used: Math.floor(agent.balance * 0.8),
      daily_limit: 5000,
      session_used: 800,
      session_limit: 2000,
    },
    counterparties,
  };
}
