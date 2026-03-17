/**
 * Federation API client — peers, health, Trust Discount policy
 */

import { apiRequest, isMockMode } from "./client";

export interface FederationPeer {
  id: number;
  peer_did: string;
  name: string;
  operator?: string;
  peering_id?: string;
  peered_at: string;
  status: "active" | "suspended" | "terminated";
  current_rho: number;
  rho_updated_at?: string;
  health_status?: "healthy" | "degraded" | "unreachable" | "unknown";
  last_health_check?: string;
  uptime_90d?: number;
  avg_attestation_latency_ms?: number;
}

export interface FederationHealth {
  status: "operational" | "degraded" | "unavailable";
  node_did: string;
  avg_attestation_latency_ms: number;
  uptime_90d: number;
  version?: string;
  timestamp: string;
  active_peers: number;
  federation_protocol_version?: string;
}

export interface TrustDiscountPolicy {
  algorithm_id: string;
  initial_rho: number;
  max_rho?: number;
  attestation_success_floor?: number;
  review_cadence_days?: number;
  parameters?: Record<string, unknown>;
}

export interface FederationPeersResponse {
  peers: FederationPeer[];
  total: number;
}

export async function fetchFederationPeers(): Promise<FederationPeersResponse> {
  if (isMockMode()) {
    return Promise.resolve(MOCK_FEDERATION_PEERS);
  }
  return apiRequest<FederationPeersResponse>("/api/v1/federation/peers");
}

export async function fetchFederationHealth(): Promise<FederationHealth> {
  if (isMockMode()) {
    return Promise.resolve(MOCK_FEDERATION_HEALTH);
  }
  return apiRequest<FederationHealth>("/api/v1/federation/health");
}

export async function fetchTrustPolicy(): Promise<TrustDiscountPolicy> {
  if (isMockMode()) {
    return Promise.resolve(MOCK_TRUST_POLICY);
  }
  return apiRequest<TrustDiscountPolicy>("/api/v1/federation/trust-policy");
}

// Mock data for development
const MOCK_FEDERATION_PEERS: FederationPeersResponse = {
  peers: [
    {
      id: 1,
      peer_did: "did:web:exchange-alpha.example.org",
      name: "Exchange Alpha",
      operator: "Alpha Corp",
      peering_id: "urn:uuid:peer-001",
      peered_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      status: "active",
      current_rho: 0.72,
      rho_updated_at: new Date().toISOString(),
      health_status: "healthy",
      last_health_check: new Date().toISOString(),
      uptime_90d: 0.99,
      avg_attestation_latency_ms: 45,
    },
    {
      id: 2,
      peer_did: "did:web:exchange-beta.example.org",
      name: "Exchange Beta",
      operator: "Beta Inc",
      peered_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: "active",
      current_rho: 0.35,
      health_status: "degraded",
      last_health_check: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      uptime_90d: 0.92,
      avg_attestation_latency_ms: 180,
    },
    {
      id: 3,
      peer_did: "did:web:exchange-gamma.example.org",
      name: "Exchange Gamma",
      peered_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: "active",
      current_rho: 0.15,
      health_status: "unreachable",
      last_health_check: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      uptime_90d: 0.85,
      avg_attestation_latency_ms: 0,
    },
  ],
  total: 3,
};

const MOCK_FEDERATION_HEALTH: FederationHealth = {
  status: "operational",
  node_did: "did:web:exchange.a2a-settlement.org",
  avg_attestation_latency_ms: 52,
  uptime_90d: 0.998,
  version: "0.10.0",
  timestamp: new Date().toISOString(),
  active_peers: 3,
  federation_protocol_version: "0.1.0",
};

const MOCK_TRUST_POLICY: TrustDiscountPolicy = {
  algorithm_id: "urn:a2a:trust:discount:linear-volume-weighted-v1",
  initial_rho: 0.15,
  max_rho: 1.0,
  attestation_success_floor: 0.95,
  review_cadence_days: 30,
  parameters: {
    volume_weight_factor: 0.5,
    success_bonus_per_txn: 0.001,
  },
};
