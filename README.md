**Monorepo Overview**
- **Workspace**: pnpm workspace with three packages.
- **Apps**: `api` (Express + pg) and `web` (Vite + React).
- **Tests**: `e2e` (Playwright) spins up both apps and runs tests.
- **DB**: Postgres via Docker (local) and GitHub Actions service (CI).

**Quick Start**
- Prerequisites: Node 20+, pnpm 9+, Docker (for local Postgres).
- Install deps: `pnpm install`
- Start Postgres locally: `docker compose up -d`
- Dev servers (api + web): `pnpm dev`
- Run e2e locally: `pnpm test:e2e`

`api` reads `DATABASE_URL`. In local dev and CI, this is supplied externally. See `apps/api/.env.example` for a reference value.

**Packages**
- `apps/api`
  - Port `4000`. Routes: `GET /api/health`, `GET /api/items`, `POST /api/items`.
  - Uses Drizzle ORM (PostgreSQL). On startup, runs SQL migrations from `apps/api/drizzle` via Drizzle migrator so the DB is ready for local and CI.
- `apps/web`
  - Port `5173`. Vite dev proxy forwards `/api` to `http://localhost:4000`.
- `apps/e2e`
  - `playwright.config.ts` starts both servers; tests interact with the UI and DB.

**Environment**
- Local Postgres (Docker): `postgres://postgres:postgres@localhost:5433/playwright`.
- API CORS origin: `http://localhost:5173`.

**GitHub Actions**
- Workflow: `.github/workflows/e2e.yml`
  - Brings up Postgres as a service (exposed on 5432 inside the runner).
  - Installs deps (with pnpm store cache) and Playwright browsers.
  - Runs `pnpm test:e2e` which starts `api` and `web` via Playwright webServer.
  - Uploads Playwright HTML report as an artifact.

**Common Commands**
- `pnpm dev`: Runs `api` and `web` in parallel.
- `pnpm --filter api dev`: Run only the API dev server.
- `pnpm --filter web dev`: Run only the Web dev server.
- `pnpm test:e2e`: Run Playwright headless tests.
- `pnpm test:e2e:ui`: Run Playwright in UI mode.
- `pnpm --filter api migrate`: Apply Drizzle SQL migrations manually.
- `pnpm db:generate`: Generate SQL migrations from Drizzle schema (drizzle-kit).
- `pnpm db:migrate`: Apply SQL migrations using drizzle-kit.

**Notes**
- Ensure Postgres is running before starting the API or e2e tests.
- The API uses `dotenv/config`, but CI/local tests pass `DATABASE_URL` via env so a `.env` file is optional.
