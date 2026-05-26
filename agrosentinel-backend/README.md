# AgroSentinel Backend

AI-powered crop disease early warning backend running on Netlify Functions.

## Architecture

```text
[Frontend (Next.js)]
        |
        v
[Netlify Functions: auth/farms/analyze/alerts/notify/cron]
        |
        v
[Supabase (Auth + Postgres + PostGIS)]
        |
        +--> [Sentinel Hub API]
        +--> [Anthropic Claude Vision]
        +--> [Africa's Talking / Twilio WhatsApp]
```

## Setup

1. Install dependencies:
   ```bash
   npm ci
   ```
2. Copy env file:
   ```bash
   cp .env.example .env
   ```
3. Run Supabase migration in your Supabase SQL editor from `supabase/migrations/001_init.sql`.
4. Run locally:
   ```bash
   npm run dev
   ```

## Environment Variables

| Variable | Description |
|---|---|
| SUPABASE_URL | Supabase project URL |
| SUPABASE_SERVICE_KEY | Supabase service role key |
| ANTHROPIC_API_KEY | Claude API key |
| SENTINEL_HUB_CLIENT_ID | Sentinel Hub OAuth client id |
| SENTINEL_HUB_CLIENT_SECRET | Sentinel Hub OAuth secret |
| AFRICASTALKING_API_KEY | Africa's Talking API key |
| AFRICASTALKING_USERNAME | Africa's Talking username |
| TWILIO_SID | Twilio account SID |
| TWILIO_AUTH_TOKEN | Twilio auth token |
| TWILIO_WHATSAPP_NUMBER | Twilio-enabled WhatsApp sender number |

## API Endpoints

| Method | Path | Description |
|---|---|---|
| POST | `/auth/register` | Register a user via Supabase Auth |
| POST | `/auth/login` | Log in and return Supabase session |
| POST | `/auth/logout` | Logout current session token |
| GET | `/farms` | List user farms |
| POST | `/farms` | Create a farm with GeoJSON polygon |
| DELETE | `/farms/:id` | Delete a farm |
| POST | `/analyze/:farmId` | Run Sentinel + Claude analysis and create alert |
| GET | `/alerts/:farmId` | List alerts for farm |
| POST | `/notify/:alertId` | Send SMS/WhatsApp notification |
| Scheduled | `cron-analyze` | Daily analysis for all farms |

## Deployment

1. Push repository to GitHub.
2. Set environment variables in Netlify.
3. Connect repo in Netlify and deploy with:
   ```bash
   netlify deploy --prod
   ```
