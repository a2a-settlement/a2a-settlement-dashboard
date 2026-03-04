/**
 * Dashboard API types - aligned with spec shapes
 */

export interface Agent {
  id: string;
  org_id: string;
  balance: number;
  reputation: number;
  total_transactions: number;
  status: "active" | "suspended";
  last_active: string;
  created_at?: string;
  environment?: "production" | "sandbox";
}

export interface AgentDetail extends Agent {
  bot_name?: string;
  developer_id?: string;
  developer_name?: string;
  contact_email?: string;
  description?: string;
  skills?: string[];
  daily_spend_limit?: number;
  frozen_until?: string | null;
  delegation_chain?: DelegationLink[];
  tokens?: TokenInfo[];
  spending_limits?: SpendingLimit;
  counterparties?: CounterpartySummary[];
}

export interface DelegationLink {
  id: string;
  type: "principal" | "agent";
  name: string;
}

export interface TokenInfo {
  jti: string;
  scopes: string[];
  spending_limit?: number;
  daily_limit?: number;
  session_limit?: number;
  expires_at: string;
}

export interface SpendingLimit {
  daily_used: number;
  daily_limit: number;
  session_used: number;
  session_limit?: number;
}

export interface CounterpartySummary {
  agent_id: string;
  transaction_count: number;
  total_volume: number;
  reputation: number;
}

export interface Escrow {
  id: string;
  requester_id: string;
  provider_id: string;
  amount: number;
  fee_amount?: number;
  status: "pending" | "held" | "released" | "refunded" | "disputed" | "expired";
  created_at: string;
  updated_at: string;
  expires_at?: string;
  task_id?: string;
}

export interface SourceRef {
  uri: string;
  method?: string;
  timestamp?: string;
  content_hash?: string;
}

export interface Provenance {
  source_type: "api" | "database" | "web" | "generated" | "hybrid";
  source_refs: SourceRef[];
  attestation_level: "self_declared" | "signed" | "verifiable";
  signature?: string;
}

export interface ProvenanceResult {
  verified: boolean;
  tier: string;
  confidence: number;
  flags: string[];
  recommendation: "approve" | "flag" | "reject";
}

export interface EscrowDetail extends Escrow {
  dispute_reason?: string;
  resolution_strategy?: string;
  resolved_at?: string;
  group_id?: string;
  depends_on?: string[];
  required_attestation_level?: "self_declared" | "signed" | "verifiable";
  delivered_content?: string;
  provenance?: Provenance;
  provenance_result?: ProvenanceResult;
  delivered_at?: string;
}

export interface Dispute {
  id: string;
  escrow_id: string;
  filed_by: string;
  against: string;
  reason: string;
  status: "open" | "mediating" | "resolved";
  filed_at: string;
  mediator_id?: string;
  resolution?: "release" | "refund" | "split";
  resolved_at?: string;
}

export interface DashboardOverview {
  total_agents: number;
  active_escrows: number;
  volume_24h: number;
  dispute_rate: number;
}

export interface SpendingDataPoint {
  date: string;
  volume: number;
  count: number;
}

export interface ActivityEvent {
  id: string;
  type: "escrow_created" | "escrow_delivered" | "escrow_released" | "escrow_refunded" | "escrow_disputed" | "escrow_expired";
  timestamp: string;
  agent_id: string;
  amount?: number;
  escrow_id?: string;
  description: string;
}

export interface Alert {
  id: string;
  type: "spending_limit" | "reputation_drop" | "dispute" | "anomaly";
  severity: "warning" | "critical";
  agent_id?: string;
  message: string;
  timestamp: string;
  link?: string;
}

export interface HealthResponse {
  status: "ok";
  service?: string;
  version?: string;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    request_id?: string;
  };
}
