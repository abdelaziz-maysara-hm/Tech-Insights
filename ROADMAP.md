# NetSec Atlas Master Roadmap

## Project identity

- **Project:** NetSec Atlas
- **Production domain:** <https://netsecatlas.com>
- **Previous identity:** Technical Insights
- **Mission:** A practical bilingual Arabic/English knowledge platform for cybersecurity, networking, infrastructure, troubleshooting, enterprise vendors/products, professional comparisons, and engineering tools.
- **North star (owner's own words, recorded verbatim in intent):** Become the largest, most complete knowledge base for the security field across every sub-domain -- the single reference site that a student, a fresh graduate, a junior just starting out, and a senior practitioner can all return to for any kind of question in the field, across every content type this site supports (articles, comparisons, videos, vendor/product alternatives, and more). All of it grounded in each product's own official/authoritative sources, so the site earns the role of primary reference, not just another aggregator.
- **What this means operationally:**
  - Content must span the full experience range (fundamentals for newcomers through advanced troubleshooting for seniors), not just one skill level.
  - Every factual claim about a specific vendor/product (features, licensing, comparisons, ratings) must cite a real, checkable source (vendor docs, G2/PeerSpot/Gartner-style review platforms, or equivalent) -- never invented. This was already the working practice in Phase 5B Batch 5; this line makes it an explicit, permanent project rule, not just a habit.
  - Content-type breadth matters as much as depth: articles, comparisons, videos, and vendor/product "alternatives" pages are all first-class citizens of the mission, not just articles.
  - **"Alternatives" is a distinct, planned content type, not a subset of comparisons.** Confirmed via direct research (G2.com, the leading B2B software review platform, maintains two entirely separate page structures: `/products/{product}/alternatives` -- a broad "Top 10 Alternatives" list -- and `/compare/{product1}-vs-{product2}` -- a deep head-to-head). They serve different, complementary search intents: "X alternatives" targets a user still exploring a wide consideration set (often dissatisfied with or priced out of X), while "X vs Y" targets a user who has already narrowed to two specific options and wants a detailed decision. An alternatives page should link out to the site's own "vs" comparison pages for each listed alternative where one exists. This is a new content type requiring its own schema/data file, page component, and sitemap coverage -- not yet built as of this roadmap entry.
  - Vendor/product coverage should aim for comprehensiveness across the field over time -- see the vendor coverage gaps already logged in `docs/AGENT_HANDOFF.md`'s Known debt (F5, BeyondTrust, Broadcom, Trellix, Infoblox, VMware) as a concrete starting checklist, not the finish line.
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
- **5B — IN PROGRESS:** priority REWORK content; Batches 1–4 converted four generic AI articles into professional safe-training, troubleshooting, LLM trust, and synthetic-media governance guidance while preserving stable URLs. Batch 5 reworked a comparison (`palo-alto-ngfw-vs-forcepoint-ngfw`) with source-grounded content, and fixed a structural word-count-calculation bug affecting all 75 comparisons. Batch 6 reworked `wireguard-vs-openvpn` with cited technical detail. **Batch 7 found and fixed a significant classification bug**: the `professional` regex had zero IAM/identity vocabulary, causing 5 genuinely valuable security articles (2FA, password managers, least privilege, NIST guidelines, auth-vs-authz) to misclassify as REMOVE -- reclassified to KEEP/REWORK after the fix; nothing was ever actually deleted. Current audit: 109 KEEP / 48 REWORK / 47 REMOVE; 38 comparisons remain in REWORK. **Before further large REMOVE-driven cleanup, spot-check the REMOVE list for other missing-vocabulary domains** (see docs/AGENT_HANDOFF.md).
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

#### Phase 6C — PLANNED, not started: Alternatives pages as a distinct content type

Decision recorded under North star above (Mission section): "alternatives" pages (e.g. "Top 5 Alternatives to CrowdStrike Falcon") are a distinct content type from head-to-head comparisons, not a subset of them -- confirmed via direct research on G2.com, which maintains both `/products/{product}/alternatives` (broad ranked list) and `/compare/{a}-vs-{b}` (deep 2-way) as separate page structures serving different search intents.

Required before any content, in order:
1. Extend `mockData.ts` with an `AlternativesPage` type (own schema: a target product, a list of 5-10 ranked alternatives with brief per-item rationale and a citation, not a 2-way spec table).
2. Fill known vendor-registry gaps for whichever product the first page targets. Confirmed gap: **CrowdStrike is not yet in `src/data/taxonomy/vendors.ts`**, despite already being referenced in two REWORK comparisons (`crowdstrike-falcon-vs-microsoft-defender`, `crowdstrike-falcon-vs-microsoft-sentinel`) -- add it (and any other vendor the first alternatives page needs) before the page can link a proper vendor ID.
3. New page component + route (e.g. `/alternatives/:slug`).
4. Sitemap/RSS generator coverage, following the existing Comparisons pattern already in `scripts/generator/`.
5. Cross-linking: an alternatives page should link out to the site's own "vs" comparison page for each listed alternative where one already exists.

Every claim about a listed alternative (features, pricing tier, review scores) must cite a real, checkable source (G2/PeerSpot/vendor docs) -- this content type has zero tolerance for invented specifics, per the North star rule above. Treat this as its own multi-batch effort (schema+infra batch, then content batches), not a single session's work.

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
