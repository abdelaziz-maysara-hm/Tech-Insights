# NetSec Atlas Master Roadmap

## Project identity

- **Project:** NetSec Atlas
- **Production domain:** <https://netsecatlas.com>
- **Previous identity:** Technical Insights
- **Mission:** A practical bilingual Arabic/English knowledge platform for cybersecurity, networking, infrastructure, troubleshooting, enterprise vendors/products, professional comparisons, and engineering tools.
- **Differentiation:** Real technical problem-solving, not generic technology news or content volume.

## CURRENT PROJECT STATE

**The foundation is established, but large-scale NetSec Atlas content expansion has NOT started yet.**

The current inventory is primarily inherited Technical Insights content classified by Phase 3. Next work must move from foundation-building toward SEO/routing correctness, controlled migration, high-value improvement, new professional content, tools, performance, and finally launch/domain migration.

Validated baseline on `main` after Phase 3 commit `4524d8f548cc5ed3e20b038ba3aacb76a050ed18`:

- Typecheck and production build pass.
- Sitemap: 235 URLs; RSS: 50 items.
- Main JS: approximately 677.88 kB; articles chunk: approximately 974.30 kB.
- Canonical future production domain: `https://netsecatlas.com`.

## Architecture source map

- **Workspace:** pnpm monorepo configured by `pnpm-workspace.yaml`.
- **Application:** React, Vite, TypeScript and Tailwind in `artifacts/techpulse-ar/`.
- **Entry and routing:** `artifacts/techpulse-ar/src/main.tsx` and `artifacts/techpulse-ar/src/App.tsx`, using Wouter.
- **Article source:** `artifacts/techpulse-ar/src/content/articles.json`.
- **Article index/body split:** `articles-index.json` is consumed by `src/hooks/useAllArticles.ts`; full bodies are dynamically loaded by `src/hooks/useArticleBody.ts`.
- **Other content:** `src/content/comparisons.json`, `videos.json`, `collections.json`, and `pages.json`.
- **Content models:** `src/data/mockData.ts` and `src/data/cmsTypes.ts`.
- **Taxonomy:** `src/data/taxonomy/`; vendor/product registry is `src/data/taxonomy/vendors.ts`.
- **Discovery:** `src/lib/contentDiscovery.ts`; explicit metadata overrides inference.
- **Localization:** `src/context/LanguageContext.tsx`; bilingual fields use `{ ar, en }`.
- **SEO:** centralized site identity in `src/config/site.ts`; runtime metadata in `src/hooks/useSEO.ts`.
- **Sitemap/RSS:** `scripts/generate-sitemap.mjs` and `scripts/generate-rss.mjs`; generated outputs are `public/sitemap.xml` and `public/rss.xml`.
- **Content generation:** `scripts/generator/` and `scripts/generate-content.mjs`.
- **Deployment:** Vercel config is `artifacts/techpulse-ar/vercel.json`. It sets the SPA rewrites, and reserves `/api/cms/*`. The CMS API is under `artifacts/techpulse-ar/api/`. Deployment configuration must be verified before launch; README deployment/domain text is legacy and not authoritative.

## Phased delivery

### Phase 0 — Repository Audit — COMPLETE

### Phase 1 — Brand Foundation — COMPLETE

### Phase 1.5 — Technical Baseline — COMPLETE

### Phase 2 — Information Architecture — COMPLETE

### Phase 3 — Content Model & Automated Audit — COMPLETE

### Phase 4 — Bilingual Routing & Technical SEO — COMPLETE

- **4A — COMPLETE:** centralized routing architecture for real `/en/` and `/ar/` URLs, URL-first language selection, equivalent-route language switching, legacy route compatibility, and focused route-helper tests.
- **4B — COMPLETE:** centralized localized production canonicals, language-specific metadata, Open Graph URLs, and URL-bearing WebSite/Article structured data. Legacy unprefixed routes temporarily canonicalize deterministically to `/ar/...` without redirecting.
- **4C — COMPLETE:** deterministic translation auditing, explicit hreflang eligibility/head management, and canonical localized sitemap alternates are implemented. Current editorial content remains Arabic-only in the sitemap until explicit human translation review.
- **4D — COMPLETE:** maintained legacy unprefixed application and content routes redirect to their Arabic localized equivalents while preserving path identity, query strings, fragments, deployment base paths, and localized/unknown-route semantics. Cross-domain HTTP 301 activation remains deliberately deferred to Phase 10.
- **4E — COMPLETE:** localized 404 presentation and navigation, explicit `noindex, nofollow`, removal of stale canonical/hreflang/structured-data signals, and automated route/sitemap/RSS/production-domain validation.

### Phase 5 — Content Migration & Cleanup

- **5A — COMPLETE:** explicit audit-derived taxonomy metadata for all 100 KEEP records, synchronized between full and lightweight article sources, without claiming technical or translation review.
- **5B — IN PROGRESS:** priority REWORK content; Batches 1–4 converted four generic AI articles into professional safe-training, troubleshooting, LLM trust, and synthetic-media governance guidance while preserving stable URLs. Batch 5 reworked a comparison (`palo-alto-ngfw-vs-forcepoint-ngfw`) with source-grounded content, and fixed a structural word-count-calculation bug affecting all 75 comparisons (comparisons have no `body` field, so the old metric was structurally incapable of registering any comparison as non-thin). Current audit: 104 KEEP / 47 REWORK / 53 REMOVE; 40 comparisons remain in REWORK, confirmed still genuinely thin under the corrected metric.
- **5C:** owner-approved consumer cleanup/NOINDEX decisions.
- **5D:** redirect mapping before removal.
- **5E:** content, links, sitemap, and SEO validation.

No deletion is allowed merely because Phase 3 recommended REMOVE.

### Phase 6A — Static SEO Prerendering — COMPLETE

Build-time injection of route-specific SEO HTML into sitemap-materialized GitHub Pages paths (title, description, canonical, Open Graph/Twitter, eligibility-aware hreflang, Article JSON-LD). Not SSR; React still hydrates from the Vite SPA shell. HTTP 200 direct navigation preserved.

### Phase 6B — Performance & Bundle Optimization — COMPLETE

Route-level `React.lazy` / `Suspense` code splitting, Vite `manualChunks` (react-vendor, router, icons, vendor), featured-hero LCP priority (`eager` + `fetchPriority="high"`), Inter font weight trim (400/600/700 + `display=swap`), and automated `check:bundle-budget` / `test:bundle-budget` gates. Measured entry JS ~702 kB → ~191 kB; articles bodies remain a separate dynamic ~1003 kB chunk. SEO prerender, hreflang safeguards, and GitHub Pages static routes preserved.

### Phase 6 — High-Value Content Expansion

This is where large-scale new production starts. Use the first-100 roadmap and produce 10–20 pages per reviewed batch depending on complexity. Prioritize exact-error troubleshooting, configuration, migrations, interoperability, vendor-specific guides, and professional comparisons. Quality outranks count.

### Phase 7 — Professional Tools

- Networking: Subnet, CIDR, IP Range, and VLSM calculators.
- DNS/email: DNS and MX lookup, SPF analyzer, DMARC analyzer/generator.
- Security: hash utilities, JWT and certificate decoders, IOC utilities.
- Operations: syslog parser, timestamp converter, regex tester.

Prefer safe browser/client-side processing. Advanced configuration analyzers may follow only with an explicit threat/security model.

### Phase 8 — Performance & Bundle Optimization

Core route-level splitting, vendor chunking, LCP image priority, font trim, and bundle budgets were delivered under **Phase 6B** (entry JS ~702 kB → ~191 kB; articles dynamic chunk ~1003 kB). Remaining Phase 8 work: search/index optimization, further article-loading improvements, and field Core Web Vitals measurement. Optimize production runtime, not cosmetic `node_modules` size.

### Phase 9 — Quality Assurance

Automate route and broken-link testing, content integrity, bilingual RTL/LTR behavior, mobile, accessibility, SEO/schema, sitemap/RSS, redirects, tools, and browser compatibility.

### Phase 10 — Domain Migration & Launch

Configure `netsecatlas.com`; map `technical-insights.com` URLs with direct 301s; avoid homepage-only redirects and chains; verify canonicals, Search Console, sitemap, analytics, Cloudflare, Vercel, and production smoke tests.

### Phase 11 — Post-Launch Growth

Monitor crawl/index health, broken links, Search Console, performance, content freshness, troubleshooting/vendor/topic gaps, comparisons, tools, backlinks, and returning users.

## Content production strategy

Lifecycle: `IDEA → RESEARCH → DRAFT → TECHNICAL REVIEW → SEO/STRUCTURE REVIEW → PUBLISH → MONITOR → UPDATE`.

Troubleshooting lifecycle: `ERROR/PROBLEM → ENVIRONMENT → CAUSES → DIAGNOSIS → RESOLUTION → VERIFICATION → ROLLBACK/SAFETY → REFERENCES`. Include only sections relevant to the problem.

### Publication quality gate

A technical page must provide a meaningful combination of the exact problem, product/version, diagnostic commands, configuration, expected output, explanation, verification, rollback/safety, references, and related content. Vendor commands and claims require reliable verification. Generic AI filler fails the gate.

## Credit / Session Continuity Policy

1. Check whether exact remaining execution capacity is exposed; never invent it.
2. Split expensive work when capacity appears limited.
3. Every batch must remain buildable and independently useful.
4. Commit and push every completed batch.
5. Update handoff state before session exhaustion.
6. Never leave critical completed work only in an ephemeral environment.
7. Never call remote work complete until its commit is verified on the remote.

This policy records the operational lesson from the earlier partial Phase 1/2 push without relying on conversation history.

## Future success metrics

- **Technical:** build/typecheck, Core Web Vitals, bundle sizes, broken links, crawl errors.
- **Content:** high-value and reviewed troubleshooting pages, freshness, thin-content reduction.
- **Search:** indexed pages, impressions, clicks, CTR, query coverage.
- **Engagement:** tool usage, article engagement, return visitors.
- **Growth:** organic traffic, vendor/topic coverage, backlinks/referring domains.

Do not fabricate current analytics. Establish baselines only from actual production data.
