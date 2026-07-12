# [Project name]

_Replace the heading above with the project's name, and this line with one sentence describing what this app does for users._

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

_Populate as you build — short repo map plus pointers to the source-of-truth file for DB schema, API contracts, theme files, etc._

## Architecture decisions

_Populate as you build — non-obvious choices a reader couldn't infer from the code (3-5 bullets)._

## Product

- `artifacts/techpulse-ar` — TechPulse (تيك بالس), a bilingual Arabic/English tech magazine site. Includes a Git-based admin CMS at `/admin` (login-gated, 2 fixed users) for managing articles, videos, custom pages, and a JSON bulk-import. Admin actions write to `src/content/*.json` and commit directly to the GitHub repo (`GITHUB_REPO`/`GITHUB_BRANCH`); the site itself is also deployed on Netlify (via that same GitHub repo), which is the real production target — not Replit's own deploy.

## User preferences

- TechPulse admin panel: exactly 2 fixed admin users, direct-commit publishing (no PR review step), scope limited to articles/videos/pages/footer links — not arbitrary code/design changes.

## Gotchas

- TechPulse admin CMS (`artifacts/techpulse-ar/server/admin/*`) is a framework-agnostic handler shared between the Vite dev middleware (Replit preview, loaded via `server.ssrLoadModule` since Node can't `import()` `.ts` directly) and a Netlify Function (`netlify/functions/cms-api.ts`). Any env var used by it (`GITHUB_TOKEN`, `GITHUB_REPO`, `GITHUB_BRANCH`, `JWT_SECRET`, `ADMIN1_USERNAME`, `ADMIN1_PASSWORD`, `ADMIN2_USERNAME`, `ADMIN2_PASSWORD`) must be duplicated in Netlify's site environment variables — Netlify Functions read their own process env, not Replit's secrets.
- Netlify's function filesystem is read-only, so on Netlify only the GitHub commit persists (no local disk write). Public pages read content via static JSON imports bundled at build time, so edits appear on the live site only after Netlify rebuilds; the admin panel itself talks to live API endpoints for immediate CRUD feedback.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
