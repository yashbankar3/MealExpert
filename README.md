# MealPrep Mini

MealPrep Mini is a production-ready, offline-first meal planning Progressive Web App (PWA) built with Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui-style components, Dexie (IndexedDB), and Recharts.

## Features

- Recipes CRUD with detail page, scaling servings, filters/search/sort.
- Weekly planner (Mon–Sun, breakfast/lunch/dinner) with quick assignment.
- Grocery list CRUD with check/uncheck, filters, clear checked, CSV export.
- Pantry CRUD with low-stock tracking and optional planner grocery deduction.
- Dashboard analytics with summary cards + Recharts visualizations.
- Settings for light/dark theme, accent color, seed demo data, import/export JSON, and full reset.
- IndexedDB persistence with Dexie schema versioning + migration.
- Import validation using zod and merge strategy based on latest `updatedAt`.
- PWA manifest + service worker support using `next-pwa`.

## Tech Stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- Radix + shadcn/ui-style UI wrappers
- Dexie + dexie-react-hooks
- Sonner (toasts)
- next-themes
- Recharts
- zod + react-hook-form

## Project Structure

- `src/app` route pages
- `src/components` reusable UI + app shell components
- `src/lib` DB, repositories, utilities, validators
- `src/hooks` reusable hooks
- `src/styles` global styles
- `public` manifest and app icons

## Local Setup

```bash
# 1) Create the app folder and enter it
mkdir MealExpert && cd MealExpert

# 2) Copy project files (or clone your repo)

# 3) Install dependencies
npm install

# 4) Run development server
npm run dev

# 5) Build production output
npm run build

# 6) Run production server
npm run start
```

## Exact Commands Used To Create This Project

```bash
mkdir -p src/app/{recipes,planner,grocery,pantry,dashboard,settings,recipes/[id]} src/components/{ui,app} src/lib src/hooks src/styles public
# followed by creating each file from this repository content
```

## Deployment on Vercel (Free)

1. Push this repository to GitHub.
2. Sign in to Vercel and click **Add New Project**.
3. Import the GitHub repository.
4. Build settings:
   - Framework Preset: **Next.js**
   - Build command: `npm run build`
   - Output: `.next`
5. Deploy.

### PWA Notes

- `next-pwa` generates the service worker in production builds.
- In development, service worker is disabled by config.
- Ensure you build (`npm run build`) and run (`npm run start`) to test installability/offline behavior.
- Manifest is at `/manifest.webmanifest`.

## Accessibility & UX Notes

- Keyboard-friendly controls with focus styles.
- ARIA labels added on key interactive controls.
- Toast notifications on CRUD actions.
- Confirm step included for dangerous reset action.

## Data Import/Export Format

Exported JSON includes:

- `recipes`
- `planner`
- `grocery`
- `pantry`
- `snapshots`
- `settings`

On import:

- payload is validated with zod
- merge keeps newest item by `updatedAt` for conflicts

## Known Environment Caveat

If your environment blocks package registry access, `npm install` may fail. Run in a standard Node environment or CI with npm registry access.
