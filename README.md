# line-gift-lottery

A Vercel-ready Next.js starter for the Akato LINE gift lottery flow.

## Environment Variables

Copy `.env.example` into `.env.local` for local development.

- `LINE_CHANNEL_SECRET`
- `LINE_CHANNEL_ACCESS_TOKEN`
- `N8N_WEBHOOK_URL`

## Endpoints

- `GET /api/health`
- `GET /api/line/webhook`
- `POST /api/line/webhook`

## Content Source

Edit `data/content-library.json` to add the 25 lots and blessing copy.
