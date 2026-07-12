---
name: Loading shared .ts server modules from Vite dev middleware
description: How to reuse the same TypeScript server/API handler in both a Vite dev-server middleware and a bundler-based serverless function (e.g. Netlify Functions) without duplicating code.
---

When a project needs one shared TypeScript request-handler module used by two different runtimes — a Vite dev-server middleware (for the Replit/local preview) and a bundled serverless function (e.g. a Netlify Function, built with esbuild) — the serverless side can `import` the `.ts` module directly (its bundler compiles TS). The Vite dev middleware side cannot: plain Node `import()`/`require()` fails on raw `.ts` files.

**Fix:** in the Vite dev middleware, load the shared module via `server.ssrLoadModule(path)` (Vite's own transform pipeline) instead of a native `import()`. This lets one handler module serve both environments without a separate dev-only copy.

**Why:** avoids duplicating request-handling logic between dev and production/serverless, and avoids adding a full TS-loader/register dependency just for the dev path.

**How to apply:** any time you're building a framework-agnostic handler meant to run both inside a Vite dev plugin and inside a bundled serverless function, load it in the Vite plugin with `server.ssrLoadModule(...)`, not `import()`.
