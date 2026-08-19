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
- **Content generation:** `scripts/generator/`; live content is generated/merged into `src/content/`. `articles-index.json` is generated from articles with `body` omitted.
- **CMS/deployment:** root `vercel.json` installs the pnpm workspace, builds `@workspace/techpulse-ar`, publishes `dist/public`, supports SPA rewrites, and reserves `/api/cms/*`. The CMS API is under `artifacts/techpulse-ar/api/`. Deployment configuration must be verified before launch; README deployment/domain text is legacy and not authoritative.

Never edit generated sitemap, RSS, article index, or `dist/` as the source of truth. Change source/configuration and regenerate.

## Completed phases

### Phase 0 ? Repository Audit ? COMPLETE

Audited Technical Insights and confirmed the pivot could preserve the application architecture.

### Phase 1 ? Brand Foundation ? COMPLETE

Technical Insights became NetSec Atlas; site configuration, UI positioning, SEO identity, sitemap/RSS domain, and homepage positioning were established.

### Phase 1.5 ? Technical Baseline ? COMPLETE

Corrected TypeScript failures, clarified `Article` versus `ArticleListItem`, and established passing typecheck/build baselines.

### Phase 2 ? Information Architecture ? COMPLETE

Added multidimensional domains, topics, content types, vendors/products, discovery, vendor hubs, and routes for Cybersecurity, Networking, Infrastructure, Troubleshooting, Guides, Tools, Vendors, and Comparisons. A partial Phase 2 merge temporarily reached `main`; it was repaired by commit `3c0dae7` and follow-up verification.

### Phase 3 ? Content Model & Automated Audit ? COMPLETE

Added optional explicit migration metadata and deterministic audit reporting. Of 204 editorial items, 100 are KEEP, 51 REWORK, and 53 REMOVE recommendations; 74% are reusable. Inventory: 213 total, 129 articles, 75 comparisons, 9 static pages. Strategic fit: 65 enterprise, 75 professional IT, 11 mixed, 9 consumer, 44 unrelated. Technical value: 50 high, 80 medium, 74 low. Coverage: Cybersecurity 77, Infrastructure 47, Networking 41; 45 vendor-associated items and 29 troubleshooting items. See:

- `docs/content-audit/phase3-content-audit.md`
- `docs/content-audit/phase3-content-audit.json`
- `docs/content-audit/phase3-first-100-roadmap.md`

## Remaining phases

### Phase 4 ? Bilingual Routing & Technical SEO ? COMPLETE

Implement in independently valid batches:

- **4A ? COMPLETE:** centralized routing architecture for real `/en/` and `/ar/` URLs, URL-first language selection, equivalent-route language switching, legacy route compatibility, and focused route-helper tests.
- **4B ? COMPLETE:** centralized localized production canonicals, language-specific metadata, Open Graph URLs, and URL-bearing WebSite/Article structured data. Legacy unprefixed routes temporarily canonicalize deterministically to `/ar/...` without redirecting.
- **4C ? COMPLETE:** deterministic translation auditing, explicit hreflang eligibility/head management, and canonical localized sitemap alternates are implemented. Current editorial content remains Arabic-only in the sitemap until explicit human translation review.
- **4D ? COMPLETE:** maintained legacy unprefixed application and content routes redirect to their Arabic localized equivalents while preserving path identity, query strings, fragments, deployment base paths, and localized/unknown-route semantics. Cross-domain HTTP 301 activation remains deliberately deferred to Phase 10.
- **4E ? COMPLETE:** localized 404 presentation and navigation, explicit `noindex, nofollow`, removal of stale canonical/hreflang/structured-data signals, and automated route/sitemap/RSS/production-domain validation.

URL migration can damage indexing. Do not combine all batches or change URLs without verified mappings.

### Phase 5 ? Content Migration & Cleanup

- **5A:** explicit metadata for KEEP content.
- **5B:** priority REWORK content.
- **5C:** owner-approved consumer cleanup/NOINDEX decisions.
- **5D:** redirect mapping before removal.
- **5E:** content, links, sitemap, and SEO validation.

No deletion is allowed merely because Phase 3 recommended REMOVE.

### Phase 6 ? High-Value Content Expansion

This is where large-scale new production starts. Use the first-100 roadmap and produce 10?20 pages per reviewed batch depending on complexity. Prioritize exact-error troubleshooting, configuration, migrations, interoperability, vendor-specific guides, and professional comparisons. Quality outranks count.

### Phase 7 ? Professional Tools

- Networking: Subnet, CIDR, IP Range, and VLSM calculators.
- DNS/email: DNS and MX lookup, SPF analyzer, DMARC analyzer/generator.
- Security: hash utilities, JWT and certificate decoders, IOC utilities.
- Operations: syslog parser, timestamp converter, regex tester.

Prefer safe browser/client-side processing. Advanced configuration analyzers may follow only with an explicit threat/security model.

### Phase 8 ? Performance & Bundle Optimization

Baseline: main 677.88 kB; articles 974.30 kB. Add route-level lazy loading, code splitting, dependency/bundle analysis, search/index optimization, and further article-loading improvements. Optimize production runtime, not cosmetic `node_modules` size.

### Phase 9 ? Quality Assurance

Automate route and broken-link testing, content integrity, bilingual RTL/LTR behavior, mobile, accessibility, SEO/schema, sitemap/RSS, redirects, tools, and browser compatibility.

### Phase 10 ? Domain Migration & Launch

Configure `netsecatlas.com`; map `technical-insights.com` URLs with direct 301s; avoid homepage-only redirects and chains; verify canonicals, Search Console, sitemap, analytics, Cloudflare, Vercel, and production smoke tests.

### Phase 11 ? Post-Launch Growth

Monitor crawl/index health, broken links, Search Console, performance, content freshness, troubleshooting/vendor/topic gaps, comparisons, tools, backlinks, and returning users.

## Content production strategy

Lifecycle: `IDEA ? RESEARCH ? DRAFT ? TECHNICAL REVIEW ? SEO/STRUCTURE REVIEW ? PUBLISH ? MONITOR ? UPDATE`.

Troubleshooting lifecycle: `ERROR/PROBLEM ? ENVIRONMENT ? CAUSES ? DIAGNOSIS ? RESOLUTION ? VERIFICATION ? ROLLBACK/SAFETY ? REFERENCES`. Include only sections relevant to the problem.

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
