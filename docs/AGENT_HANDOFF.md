# NetSec Atlas Agent Handoff

## Read in this order

1. `ROADMAP.md`
2. `CHANGELOG.md`
3. `docs/AGENT_HANDOFF.md`
4. `docs/content-audit/phase3-content-audit.md`
5. `docs/content-audit/phase3-first-100-roadmap.md`

## Current handoff

- Completed: Phases 0, 1, 1.5, 2, 3, 4A, and 4B.
- In progress: Phase 4C only. 4C-1 translation audit is complete; next is 4C-2 centralized hreflang eligibility/head management, followed by 4C-3 localized sitemap strategy. Phase 4 remains high risk and must stay batched.
- Branch/workflow: `main`; use fast-forward pull, focused commits, normal push, never force-push.
- Production domain: `https://netsecatlas.com`.
- Legacy redirect domain: `technical-insights.com`.
- Baseline after 4B: Phase 4 tests 11/11, typecheck/build pass; sitemap 235; RSS 50; main JS ~680.15 kB; articles chunk ~974.30 kB.
- Phase 4A routing source: `src/lib/localizedRouting.ts` and `src/hooks/useLocalizedLocation.ts`. `/ar/...` and `/en/...` share the existing page components; legacy unprefixed URLs remain supported. Unsupported prefixes such as `/fr/...` are not interpreted as languages.
- Phase 4A deliberately did not add localized sitemap entries, hreflang, redirects, or complete localized canonical/schema behavior; those remain 4B–4E.
- Phase 4B canonical source is `src/lib/seoUrl.ts`. Prefixed URLs canonicalize to the same language; legacy unprefixed routes temporarily canonicalize to the Arabic equivalent. No redirects were added.
- Translation inventory finding: all 129 articles have non-empty Arabic/English title, excerpt, and body fields; all 75 comparisons have both title, excerpt, and verdict; all 9 static pages have both title and content. Field completeness does not prove human-reviewed editorial equivalence, so Phase 4C must gate hreflang/alternates conservatively.
- Translation quality finding: the owner identifies the existing translations as literal and technically unreliable. The 4C-1 audit therefore requires an explicit human-reviewed marker before `VALID_PAIR`; current automated results are 0 valid, 223 review, and 18 invalid across 241 evaluated pairs. See `docs/i18n/phase4c-translation-audit.*`.
- The static SPA shell intentionally carries no canonical or `og:url`; `useSEO` creates the route-correct values after hydration. Full pre-rendered localized metadata would require SSR/static rendering and is not claimed by Phase 4B.

## Validation

```bash
pnpm install --frozen-lockfile
pnpm run typecheck
pnpm --filter @workspace/techpulse-ar run build
```

Do not assume `pnpm run validate` exists. Run phase-specific checks explicitly.

## Operational rules

- Preserve the React/Vite/TypeScript and content-generation architecture.
- Do not edit `public/sitemap.xml`, `public/rss.xml`, `src/content/articles-index.json`, or `dist/` manually; update their source and regenerate.
- Do not delete/rewrite legacy content without the Phase 3 audit and owner-approved SEO/redirect decision.
- Explicit article metadata overrides inference; absence falls back to `src/lib/contentDiscovery.ts`.
- Do not fabricate vendor commands, configurations, scores, specifications, references, or SEO metrics.
- Known debt: oversized main/articles chunks; legacy README deployment/brand text; consumer content; 74 potentially thin items requiring human review; limited coverage for F5, BeyondTrust, Broadcom, Trellix, Infoblox, and VMware.

## Credit / Session Continuity Policy

Exact credits may not be exposed. Never invent a value. Split large phases into buildable batches, commit and push each completed batch, update this handoff before exhaustion, keep no critical work only in ephemeral storage, and verify the remote SHA before reporting completion.

For every phase, follow `docs/PHASE_CHECKLIST.md` and update ROADMAP, CHANGELOG, and this handoff when state changes.
