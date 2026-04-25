# Multi-Platform Travel Bot Backend

Backend-only European travel assistant chatbot using:
- Vercel Chat SDK (`chat`) for write-once bot logic
- Slack + Discord adapters
- Vercel AI SDK (`streamText`) with tool calling
- Vercel AI Gateway model routing

## Backend files

- `src/bot/tools/travel-tools.ts` - AI tools for prices, delays, layovers, discounts
- `src/bot/prompts/system-prompt.ts` - travel-agent system behavior
- `src/bot/chat-bot.ts` - Chat SDK init, adapters, state, event handlers
- `app/api/chat/route.ts` - Next.js App Router webhook entrypoint
- `src/server.ts` - standalone Node server webhook entrypoint

## Environment variables

Copy `.env.example` to `.env.local` (or your environment config) and set:

- Slack:
  - `SLACK_BOT_TOKEN`
  - `SLACK_SIGNING_SECRET`
  - `SLACK_APP_TOKEN`
- Discord:
  - `DISCORD_TOKEN`
  - `DISCORD_PUBLIC_KEY`
  - `DISCORD_APPLICATION_ID`
- AI Gateway:
  - `VERCEL_OIDC_TOKEN` (preferred via `vercel env pull .env.local`)
  - `AI_GATEWAY_API_KEY` (optional static fallback)

The adapter factories are initialized without hard-coded credentials so they can auto-detect values from environment variables.

## Running options

### Next.js App Router route

- Use `POST /api/chat?platform=slack` for Slack webhooks
- Use `POST /api/chat?platform=discord` for Discord webhooks

### Standalone Node server

Start your server entrypoint (`src/server.ts`) and use:
- `POST /webhooks/slack`
- `POST /webhooks/discord`
- `GET /health`

## Notes

- Current implementation uses `@chat-adapter/state-memory` for development.
- For production, swap to `@chat-adapter/state-redis` in `src/bot/chat-bot.ts`.
- AI gateway fallback behavior is configured in `providerOptions.gateway` near the `streamText` call.