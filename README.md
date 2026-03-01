# A2A Settlement Dashboard

Human oversight dashboard for the A2A Settlement Exchange — monitor agent spending, audit transactions, revoke economic authority.

## Quickstart

```bash
# Install dependencies
npm install

# Run development server (port 3001)
npm run dev
```

The dashboard runs on http://localhost:3001. By default it uses mock data. Set `NEXT_PUBLIC_USE_MOCK=false` and `NEXT_PUBLIC_EXCHANGE_URL` to your exchange URL to connect to a live A2A-SE instance.

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_EXCHANGE_URL` | http://localhost:3000 | A2A-SE exchange base URL |
| `NEXT_PUBLIC_POLL_INTERVAL` | 5000 | Polling interval in ms |
| `NEXT_PUBLIC_USE_MOCK` | true | Use mock data instead of real exchange |
| `NEXT_PUBLIC_APP_NAME` | A2A Settlement Dashboard | App display name |

## Build

```bash
npm run build
npm start
```

## Tech Stack

- Next.js 14 (App Router)
- React 18, Tailwind CSS, shadcn/ui
- Recharts, TanStack Query
