# NetSec Atlas Decision Log

## ADR-001 ? Pivot to NetSec Atlas
Technical Insights is being repositioned as NetSec Atlas, focused on professional networking, security, infrastructure, troubleshooting, comparisons, and tools.

## ADR-002 ? Preserve the application architecture
Retain the existing React/Vite/TypeScript pnpm workspace and extend it instead of rebuilding.

## ADR-003 ? Bilingual content is first-class
Arabic and English remain first-class in content, UI, metadata, routing, and quality assurance.

## ADR-004 ? Use multidimensional taxonomy
Domains, topics, content types, vendors, and products may overlap; do not force content into one exclusive flat category.

## ADR-005 ? Troubleshooting is a product pillar
Exact engineering problems, diagnosis, resolution, and verification are primary product value.

## ADR-006 ? Explicit metadata overrides inference
Explicit article dimensions are authoritative; heuristic discovery is the fallback during migration.

## ADR-007 ? Preserve legacy content until reviewed
No legacy content is removed before audit, approval, and redirect/indexing impact review.

## ADR-008 ? NetSec Atlas is the future canonical domain
Use `netsecatlas.com` as the future production canonical domain.

## ADR-009 ? Preserve the old domain for redirects
Keep `technical-insights.com` available for mapped migration redirects; do not redirect every URL blindly to the homepage.

## ADR-010 ? Technical usefulness over volume
Specific, verified professional utility is more important than page count or generic search-volume assumptions.

## ADR-011 ? Prefer safe client-side tools
Use browser/client-side processing where practical, private, and technically safe; backend services require explicit justification.

## ADR-012 ? Never fabricate technical information
Vendor commands, configurations, version behavior, specifications, and references must be verified rather than generated as plausible filler.

## ADR-013 ? Localized routes use shared pages and stable slugs
Arabic and English routes use `/ar/` and `/en/` prefixes over the same page components and stable slugs. The URL language overrides saved browser preference. Legacy unprefixed routes remain compatible until the later redirect/indexing migration batches; unsupported language prefixes retain normal not-found semantics.

## ADR-014 ? Canonicals are production-only and URL-language aware
Canonical and URL-bearing runtime metadata are generated centrally from `https://netsecatlas.com`, never from the browser host. Valid `/ar/` and `/en/` prefixes remain canonical to their own language. Until Phase 4D redirects are approved, legacy unprefixed routes use deterministic Arabic-equivalent canonicals rather than a localStorage-dependent target. Query strings and fragments are excluded. The shared static SPA shell omits canonical and `og:url` values so it does not advertise the wrong localized URL before hydration.

## ADR-015 ? Hreflang requires explicit translation review
Field completeness and automated language heuristics do not prove semantic, technical, or editorial equivalence. A content pair is eligible for `VALID_PAIR` only when it passes automated structural checks and carries an explicit human-reviewed translation marker. The owner has identified the current translations as literal and technically unreliable; unreviewed `REVIEW_PAIR` and structurally defective `INVALID_PAIR` records must not receive reciprocal hreflang or localized sitemap alternates.

## ADR-016 ? Discovery eligibility and x-default are explicit
Application/discovery routes may be hreflang-eligible independently from editorial content when their maintained UI/data is meaningfully bilingual. Current approved classes are home, article/comparison listings, categories, troubleshooting, guides, tools, vendors/vendor details, and domain pages; search and videos are excluded pending separate review. Eligible pairs use reciprocal Arabic and English localized canonicals, with `x-default` pointing to the Arabic localized canonical. Legacy unprefixed URLs are never alternate targets. User language navigation is not evidence of SEO translation eligibility.

## ADR-017 ? Sitemap contains canonical localized URLs only
The production sitemap excludes transitional unprefixed URLs and noncanonical query-filter variants. Every current route identity is represented by its Arabic localized canonical. English locations and reciprocal XHTML alternates are added only when the shared hreflang policy explicitly approves the route or content translation status is reviewed. This keeps sitemap discovery aligned with HTML canonicals without fabricating translation quality.

## ADR-018 ? Legacy route migration is allowlisted and host-aware
Maintained unprefixed application and content routes migrate to the same stable slug under `/ar/`, preserving query strings, fragments, and deployment base paths. Already-localized, unknown, API, and asset paths are never redirected by a catch-all. GitHub Pages receives a history-replacing browser redirect for backward compatibility; this is not represented as an HTTP 301. Direct old-domain HTTP redirects require production hosting control and remain a separate Phase 10 activation with explicit one-to-one mappings.

## ADR-019 ? Not-found views must not emit indexable page signals
The SPA catch-all remains localized and navigable, but it explicitly emits `noindex, nofollow` and removes canonical, hreflang, Article, and WebSite structured-data elements while active. This prevents an unknown route from inheriting valid metadata left by prior client navigation. Returning a true HTTP 404 still depends on host-level routing and is validated separately during production deployment.

## ADR-020 ? KEEP metadata is explicit but not an approval claim
Phase 5A copies deterministic taxonomy dimensions from the Phase 3 audit into KEEP records so discovery no longer depends on inference. The migration sets technical status to `needs-review` and translation status to `unreviewed`; a strategic KEEP classification does not prove current technical accuracy, translation quality, difficulty, or a human review date. Empty vendor/product/topic arrays are explicit audit results rather than missing metadata.

## ADR-021 ? REWORK preserves URLs and requires measurable professional value
Phase 5B keeps established slugs while replacing off-mission material with independently written Arabic and English professional content. A batch must add concrete operational value, explicit taxonomy, safety boundaries, and regression tests, and must improve the deterministic disposition before completion. Automated work remains `needs-review` and `unreviewed` until separate human technical and translation review.
