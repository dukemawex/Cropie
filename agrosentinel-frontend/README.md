# AgroSentinel Frontend

Next.js 14 App Router frontend for satellite-powered crop disease detection.

## Architecture

```text
[Next.js App Router UI]
        |
        v
[Typed API Client (/lib/api.ts)] ---> [Netlify Functions Backend]
        |
        +--> [Supabase Auth Client]
```

## Setup

1. Install dependencies:
   ```bash
   npm ci
   ```
2. Configure env:
   ```bash
   cp .env.example .env.local
   ```
3. Start dev server:
   ```bash
   npm run dev
   ```

## Environment Variables

| Variable | Description |
|---|---|
| NEXT_PUBLIC_API_URL | Netlify backend base URL |
| NEXT_PUBLIC_SUPABASE_URL | Supabase URL |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Supabase anon key |

## Frontend Routes

| Route | Purpose |
|---|---|
| `/` | Landing page with animated satellite/NDVI design |
| `/dashboard` | Protected dashboard with KPI cards, alerts feed, and farms map |
| `/farms` | Farm management table and map polygon draw modal |
| `/farms/[id]` | Farm detail with analysis trigger, image viewer, alert timeline, NDVI chart |
| `/alerts` | Alert list with severity/farm/date filters |
| `/settings` | User profile and notification preferences |
| `/auth/login` | User login |
| `/auth/register` | User registration |

## Deployment (Vercel)

1. Set `NEXT_PUBLIC_*` variables in Vercel project settings.
2. Deploy:
   ```bash
   vercel deploy --prod
   ```
