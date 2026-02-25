# BYON Demo — Pipes.bot

Demo app for the Pipes.bot **Bring Your Own Number (BYON)** feature. Partners select an identity, complete WhatsApp Embedded Signup via Pipes.bot, then test API endpoints for templates and messaging.

## Setup

```bash
pnpm install
cp .env.example .env.local
```

Fill in `.env.local`:

| Variable | Description |
|---|---|
| `PIPES_APP_API_KEY` | App API key (`ak_` prefixed) |
| `PIPES_APP_SLUG` | App slug used to construct the onboarding redirect URL |
| `PARTNER_REDIRECT_URL` | Where users return after onboarding (e.g. `http://localhost:3000/dashboard`) |
| `PIPES_API_BASE_URL` | API base URL (defaults to `https://api.pipes.bot`) |

```bash
pnpm dev
```

## How it works

### 1. Partner Selection (`/`)

The home page generates 5 random partner IDs. Clicking one triggers a server action that:

1. Creates a token via `POST /v1/apps/token` with the partner ID as metadata
2. Redirects to `https://app.pipes.bot/apps/<slug>?token=<token>` for WhatsApp Embedded Signup

### 2. Dashboard (`/dashboard`)

After onboarding, the user lands on the dashboard with their pool number ID. Three operations are available:

- **Get Templates** — fetches templates for the pool number
- **Send Template** — sends a WhatsApp template message (template name, language code, recipient)
- **Send Message** — sends a freeform text message to a recipient

All API calls are proxied through server actions — API keys never reach the client.

## Tech stack

- Next.js 16 (App Router, Server Actions)
- Tailwind CSS 4
- No database, no auth — lightweight demo only
