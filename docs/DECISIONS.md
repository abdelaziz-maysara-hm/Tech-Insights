# NetSec Atlas Decision Log

## ADR-001 — Pivot to NetSec Atlas
Technical Insights is being repositioned as NetSec Atlas, focused on professional networking, security, infrastructure, troubleshooting, comparisons, and tools.

## ADR-002 — Preserve the application architecture
Retain the existing React/Vite/TypeScript pnpm workspace and extend it instead of rebuilding.

## ADR-003 — Bilingual content is first-class
Arabic and English remain first-class in content, UI, metadata, routing, and quality assurance.

## ADR-004 — Use multidimensional taxonomy
Domains, topics, content types, vendors, and products may overlap; do not force content into one exclusive flat category.

## ADR-005 — Troubleshooting is a product pillar
Exact engineering problems, diagnosis, resolution, and verification are primary product value.

## ADR-006 — Explicit metadata overrides inference
Explicit article dimensions are authoritative; heuristic discovery is the fallback during migration.

## ADR-007 — Preserve legacy content until reviewed
No legacy content is removed before audit, approval, and redirect/indexing impact review.

## ADR-008 — NetSec Atlas is the future canonical domain
Use `netsecatlas.com` as the future production canonical domain.

## ADR-009 — Preserve the old domain for redirects
Keep `technical-insights.com` available for mapped migration redirects; do not redirect every URL blindly to the homepage.

## ADR-010 — Technical usefulness over volume
Specific, verified professional utility is more important than page count or generic search-volume assumptions.

## ADR-011 — Prefer safe client-side tools
Use browser/client-side processing where practical, private, and technically safe; backend services require explicit justification.

## ADR-012 — Never fabricate technical information
Vendor commands, configurations, version behavior, specifications, and references must be verified rather than generated as plausible filler.

## ADR-013 — Localized routes use shared pages and stable slugs
Arabic and English routes use `/ar/` and `/en/` prefixes over the same page components and stable slugs. The URL language overrides saved browser preference. Legacy unprefixed routes remain compatible until the later redirect/indexing migration batches; unsupported language prefixes retain normal not-found semantics.

## ADR-014 — Canonicals are production-only and URL-language aware
Canonical and URL-bearing runtime metadata are generated centrally from `https://netsecatlas.com`, never from the browser host. Valid `/ar/` and `/en/` prefixes remain canonical to their own language. Until Phase 4D redirects are approved, legacy unprefixed routes use deterministic Arabic-equivalent canonicals rather than a localStorage-dependent target. Query strings and fragments are excluded. The shared static SPA shell omits canonical and `og:url` values so it does not advertise the wrong localized URL before hydration.
