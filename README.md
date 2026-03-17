# A2A Settlement Dashboard

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node 18+](https://img.shields.io/badge/node-18%2B-green.svg)](https://nodejs.org)
[![Next.js 14](https://img.shields.io/badge/Next.js-14-black.svg)](https://nextjs.org)

**Human oversight dashboard for the [A2A Settlement Exchange](https://github.com/a2a-settlement/a2a-settlement).** Monitor agent spending, audit escrow transactions, review disputes, manage federation peers, and revoke economic authority — all from a single pane of glass.

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  A2A Settlement Dashboard                                                    │
│                                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │ Overview    │  │  Escrows    │  │  Agents     │  │  Disputes   │        │
│  │ KPIs &     │  │  List &     │  │  Directory, │  │  Queue &    │        │
│  │ charts     │  │  detail     │  │  tokens,    │  │  resolution │        │
│  │            │  │  view       │  │  delegation │  │  detail     │        │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                          │
│  │ Federation  │  │  Analytics  │  │  Settings   │                          │
│  │ Peer health │  │  Volume,    │  │  Exchange   │                          │
│  │ trust disc. │  │  trends     │  │  connection │                          │
│  └─────────────┘  └─────────────┘  └─────────────┘                          │
└──────────────────────────────────────────────────────────────────────────────┘
         │                                         ▲
         │           TanStack Query polling         │
         ▼                                         │
┌──────────────────────────────────────────────────────────────────────────────┐
│  A2A Settlement Exchange  (http://localhost:3000/v1)                          │
└──────────────────────────────────────────────────────────────────────────────┘
```

## Features

- **Overview dashboard** — KPI cards (total volume, active escrows, dispute rate), real-time charts via Recharts, exchange health indicator
- **Escrow management** — filterable escrow list, detail view with full lifecycle (pending → held → released/refunded/disputed), status badges
- **Agent directory** — agent profiles with reputation score, attestation panel, delegation chain viewer, spending limits, token balances
- **Dispute queue** — dispute list and detail view with mediator verdict, confidence score, escalation status
- **Federation** — peer health monitoring, trust discount configuration for cross-exchange settlement
- **Analytics** — settlement volume trends, agent activity breakdown, time-series charts
- **Settings** — exchange connection configuration, polling interval, mock/live toggle

## Quick Start

```bash
git clone https://github.com/a2a-settlement/a2a-settlement-dashboard
cd a2a-settlement-dashboard
npm install
npm run dev
```

The dashboard runs on http://localhost:3001. By default it uses mock data so you can explore the UI without a running exchange.

To connect to a live exchange:

```bash
NEXT_PUBLIC_USE_MOCK=false NEXT_PUBLIC_EXCHANGE_URL=http://localhost:3000 npm run dev
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_EXCHANGE_URL` | `http://localhost:3000` | A2A-SE exchange base URL (no `/v1` suffix) |
| `NEXT_PUBLIC_POLL_INTERVAL` | `5000` | Polling interval in milliseconds |
| `NEXT_PUBLIC_USE_MOCK` | `true` | Use mock data instead of live exchange |
| `NEXT_PUBLIC_APP_NAME` | `A2A Settlement Dashboard` | App display name |

## Build & Deploy

```bash
npm run build
npm start        # production server on :3001
```

Or with Docker:

```bash
docker build -t a2a-settlement-dashboard .
docker run -p 3001:3001 \
  -e NEXT_PUBLIC_EXCHANGE_URL=http://exchange:3000 \
  -e NEXT_PUBLIC_USE_MOCK=false \
  a2a-settlement-dashboard
```

## Tech Stack

- **Framework** — Next.js 14 (App Router)
- **UI** — React 18, Tailwind CSS, [shadcn/ui](https://ui.shadcn.com/) (Radix primitives)
- **Charts** — Recharts
- **Data fetching** — TanStack Query (auto-polling with configurable interval)
- **Icons** — Lucide React

## Project Structure

```
src/
  app/
    page.tsx                     # Overview dashboard
    agents/                      # Agent directory + detail
    escrows/                     # Escrow list + detail
    disputes/                    # Dispute queue + detail
    federation/                  # Federation peer health & trust config
    analytics/                   # Volume & trend analytics
    settings/                    # Exchange connection settings
  components/
    agents/                      # AgentDetail, AttestationPanel, DelegationChain, SpendingLimits, TokenCard
    disputes/                    # DisputeDetail
    federation/                  # PeerHealth, TrustDiscountConfig
    layout/                      # Sidebar, Header, StatusIndicator
    shared/                      # DataTable, StatusBadge, TimeAgo, TokenAmount, ConfirmDialog
    ui/                          # shadcn/ui primitives (badge, card, dialog, toast, etc.)
  lib/
    api/                         # API client layer (agents, escrows, disputes, dashboard, federation)
    hooks/                       # React hooks (useAgents, useEscrows, useDisputes, useDashboard, useFederation, useExchangeHealth)
  mock/                          # Mock data for development without a live exchange
```

## Related Projects

| Project | Description |
|---------|-------------|
| [a2a-settlement](https://github.com/a2a-settlement/a2a-settlement) | Core exchange — the API this dashboard connects to |
| [a2a-settlement-auth](https://github.com/a2a-settlement/a2a-settlement-auth) | OAuth economic authorization — revoke tokens via kill switch |
| [a2a-settlement-mediator](https://github.com/a2a-settlement/a2a-settlement-mediator) | Dispute resolution — view escalation status |
| [a2a-settlement-mcp](https://github.com/a2a-settlement/a2a-settlement-mcp) | MCP server — expose settlement operations to Claude, Cursor, etc. |
| [settlebridge-ai](https://github.com/a2a-settlement/settlebridge-ai) | SettleBridge Gateway — policy enforcement, bounty marketplace |
| [mcp-trust-gateway](https://github.com/a2a-settlement/mcp-trust-gateway) | MCP trust layer above OAuth |
| [otel-agent-provenance](https://github.com/a2a-settlement/otel-agent-provenance) | OpenTelemetry provenance conventions |

## License

MIT. See [LICENSE](LICENSE).
