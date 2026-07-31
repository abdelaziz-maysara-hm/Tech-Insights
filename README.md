# Technical Insights (رؤى تقنية) — TechPulse

Bilingual Arabic/English tech magazine site with a Git-based admin CMS.

- **Live domain:** [https://technical-insights.com](https://technical-insights.com)
- **Admin panel:** `/admin`
- **Main app:** `artifacts/techpulse-ar`

## Stack

- React + Vite + TypeScript + Tailwind + shadcn/ui
- Admin CMS → Vercel Serverless (`/api/cms/*`) commits JSON to GitHub
- Optional Netlify deploy for static frontend
- pnpm workspaces monorepo

## Environment variables (Vercel / Netlify)

| Variable | Required | Purpose |
|----------|----------|----------|
| `GITHUB_REPO` | Yes (prod) | e.g. `abdelaziz-maysara-hm/Tech-Insights` |
| `GITHUB_BRANCH` | No | default `main` |
| `GITHUB_TOKEN` | Yes (prod) | PAT with `contents:write` |
| `JWT_SECRET` | Yes | Session signing secret |
| `ADMIN1_USERNAME` | Yes | First admin |
| `ADMIN1_PASSWORD` | Yes | First admin password |
| `ADMIN2_USERNAME` | No | Second admin |
| `ADMIN2_PASSWORD` | No | Second admin password |

## How content publishing works

1. Log in at `/admin`
2. Add articles via form **or** bulk-import JSON (paste / upload file)
3. CMS validates + normalizes fields, then commits to:
   - `artifacts/techpulse-ar/src/content/articles.json`
4. Hosting platform rebuilds → site shows new content (≈1–2 min)

### Article JSON shape (required fields)

```json
[
  {
    "title": { "ar": "...", "en": "..." },
    "excerpt": { "ar": "...", "en": "..." },
    "body": { "ar": "## heading\\n\\ntext", "en": "## heading\\n\\ntext" },
    "categoryId": "mobile",
    "tags": ["Phone", "Tips"],
    "readTime": 5,
    "isFeatured": false,
    "isTrending": false
  }
]
```

Optional: `slug`, `id`, `heroImage`, `youtubeVideoId`, `date`, `author`, `subcategoryId`.

Allowed `categoryId`: `cybersecurity` · `mobile` · `laptops` · `howto` · `ai` · `reviews` · `windows` · `comparisons` · `technology`

Invalid JSON is rejected with field-level errors (no bad data committed).

## Local development

```bash
corepack enable
pnpm install
pnpm --filter @workspace/techpulse-ar run dev
```

Admin API in dev is served by Vite middleware at `/cms/api/*` (see `vite.config.ts`).

## Deploy notes

- **Vercel:** root points at monorepo; serverless function lives at `artifacts/techpulse-ar/api/cms/[...path].ts`
- **Netlify:** see `netlify.toml` + `netlify/functions/cms-api.ts`
- Domain CNAME is `technical-insights.com`

## Security tips

- Use a fine-grained GitHub PAT limited to this repo + contents write
- Keep `JWT_SECRET` long and random
- Prefer strong unique admin passwords
- Consider branch protection if more than trusted admins get access
