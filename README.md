# MealPrep Mini

MealPrep Mini is a production-ready, responsive, installable PWA built with Next.js App Router + TypeScript + Tailwind.
It now uses **MongoDB Atlas (free tier)** through Next.js API route handlers, with per-device data isolation via clientId.

## What changed

- Replaced local Dexie-only persistence with online MongoDB storage.
- Added full REST API route handlers under `src/app/api/**`.
- Added one-time legacy migration from old IndexedDB data to MongoDB.
- Kept all existing routes and user flows.
- Upgraded styling to a more premium Minimal Glass++ look.

## Requirements

- Node.js 20+
- npm
- MongoDB Atlas free cluster

## Environment variables

Create `.env.local` from `.env.example`:

```bash
cp .env.example .env.local
```

Set:

```bash
MONGODB_URI=your_mongodb_connection_string
```

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

### Production build check

```bash
npm run build
npm run start
```

## API overview

All APIs require `x-client-id` header (generated automatically in client app on first load):

- `GET/POST /api/recipes`
- `GET/PATCH/DELETE /api/recipes/[id]`
- `GET/POST /api/pantry`
- `PATCH/DELETE /api/pantry/[id]`
- `GET/POST /api/grocery`
- `PATCH/DELETE /api/grocery/[id]`
- `GET/POST /api/planner`
- `PATCH/DELETE /api/planner/[id]`
- `GET /api/settings`
- `GET/PATCH /api/settings/[id]`
- `GET/POST/DELETE /api/snapshots`
- `POST /api/migrate` (import/merge + legacy data migration)
- `GET /api/health` (DB connectivity check)

## MongoDB Atlas + Vercel deployment (Free)

1. Create a MongoDB Atlas free cluster.
2. Create a DB user (username/password).
3. Add IP access rule:
   - For quick demo: allow `0.0.0.0/0` (less secure)
   - Recommended: restrict IP ranges later.
4. Copy connection string and set `MONGODB_URI`.
5. Push repo to GitHub.
6. Import repo in Vercel.
7. In Vercel Project Settings → Environment Variables, add `MONGODB_URI`.
8. Deploy.
9. Verify health endpoint: `/api/health` should return `{ "ok": true }`.

## PWA notes

- Service worker is enabled in production build via `next-pwa`.
- In development, service worker is disabled.
- Installability/offline shell support should be tested with production run.

## Data isolation without auth

- On first load, app creates a UUID `clientId` and stores it in browser localStorage.
- Every record includes this `clientId`.
- APIs always filter by `clientId`, so users do not see each other’s data.

## Legacy migration

- If old Dexie IndexedDB data exists (`mealprep-mini` DB), app performs one-time upload to MongoDB.
- Merge strategy keeps the newest `updatedAt` record on conflicts.

