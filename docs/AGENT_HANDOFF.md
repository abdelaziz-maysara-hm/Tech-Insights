# NetSec Atlas Agent Handoff

## Read in this order

1. `ROADMAP.md`
2. `CHANGELOG.md`
3. `docs/AGENT_HANDOFF.md`
4. `docs/content-audit/phase3-content-audit.md`
5. `docs/content-audit/phase3-first-100-roadmap.md`

## Current handoff

- Completed: Phases 0, 1, 1.5, 2, 3, 4 (4A–4E), 5A, and Phase 5B Batches 1–5.
- Next: continue Phase 5B priority REWORK content in another small verified batch -- 40 comparisons remain in the REWORK list (all previously showing ~19-27 words before the Batch 5 word-count-calculation fix; re-check actual `potentiallyThin` status per item now that the metric is fixed before assuming which still need rework). Do not combine it with consumer cleanup or removal decisions.
- Branch/workflow: `main`; use fast-forward pull, focused commits, normal push, never force-push.
- Production domain: `https://netsecatlas.com`.
- Legacy redirect domain: `technical-insights.com`.
- Baseline after 4B: Phase 4 tests 11/11, typecheck/build pass; sitemap 235; RSS 50; main JS ~680.15 kB; articles chunk ~974.30 kB.
- Phase 4A routing source: `src/lib/localizedRouting.ts` and `src/hooks/useLocalizedLocation.ts`. `/ar/...` and `/en/...` share the existing page components; legacy unprefixed URLs remain supported. Unsupported prefixes such as `/fr/...` are not interpreted as languages.
- Phase 4A deliberately did not add localized sitemap entries, hreflang, redirects, or complete localized canonical/schema behavior; those remain 4B–4E.
- Phase 4B canonical source is `src/lib/seoUrl.ts`. Prefixed URLs canonicalize to the same language; legacy unprefixed routes temporarily canonicalize to the Arabic equivalent. No redirects were added.
- Translation inventory finding: all 129 articles have non-empty Arabic/English title, excerpt, and body fields; all 75 comparisons have both title, excerpt, and verdict; all 9 static pages have both title and content. Field completeness does not prove human-reviewed editorial equivalence, so Phase 4C must gate hreflang/alternates conservatively.
- Translation quality finding: the owner identifies the existing translations as literal and technically unreliable. The 4C-1 audit therefore requires an explicit human-reviewed marker before `VALID_PAIR`; current automated results are 0 valid, 223 review, and 18 invalid across 241 evaluated pairs. See `docs/i18n/phase4c-translation-audit.*`.
- Phase 4C-2 source is `src/lib/hreflang.ts`. Content alternates require explicit `translationStatus: reviewed`; no current content is approved. Maintained discovery classes are evaluated separately. User language switching remains available even where SEO alternates are withheld. `x-default` targets the Arabic localized canonical, never a legacy URL.
- Phase 4C-3 source is `scripts/generate-sitemap.mjs`, consuming `src/config/hreflang-policy.json`. Sitemap baseline is now 267 canonical URLs: 241 Arabic plus 26 English approved discovery URLs. It contains no legacy/unprefixed locations, no query filters, and no English editorial content pending review. RSS remains a single 50-item feed.
- Phase 4D source is `src/lib/legacyRedirect.ts`, activated once in `src/App.tsx`. It redirects only the maintained legacy route surface to `/ar/...`, preserves query/hash/base paths, and ignores localized, unknown, API, and asset paths. This is the backward-compatible GitHub Pages runtime layer, not a claim of HTTP 301 behavior. Direct `technical-insights.com` to `netsecatlas.com` 301 activation remains Phase 10 work.
- Phase 4E adds explicit non-indexable SEO behavior through `useSEO({ indexable: false })` and applies it to the localized 404 view. `scripts/phase4e-validation.test.mjs` verifies the complete route surface, catch-all order, 404 indexing cleanup, 267 localized sitemap URLs, 50 RSS items, and absence of the legacy host. Phase 4 closes with 32 focused tests plus passing workspace typecheck and production build.
- Phase 5A uses `scripts/apply-phase5a-metadata.mjs` and the unchanged Phase 3 audit to apply exact explicit metadata to 99 KEEP articles and one KEEP comparison. Full articles and `articles-index.json` are synchronized. `technicalStatus: needs-review` and `translationStatus: unreviewed` are intentional: KEEP is a reuse decision, not human technical/translation approval. See `docs/content-audit/phase5a-keep-metadata.md`.
- Phase 5B Batch 1 reworks `chatgpt-study-without-harm` into safe AI-assisted technical training while preserving the slug. The refreshed audit is 101 KEEP / 50 REWORK / 53 REMOVE. Its Arabic and English bodies are independently written, but remain `needs-review` and `unreviewed`. See `docs/content-audit/phase5b-batch1.md`.
- Phase 5B Batch 2 reworks `effective-ai-prompting-guide` into evidence-led technical troubleshooting prompts while preserving the slug. The refreshed audit is 102 KEEP / 49 REWORK / 53 REMOVE. See `docs/content-audit/phase5b-batch2.md`.
- Phase 5B Batch 3 reworks `how-large-language-models-work` into enterprise IT guidance on LLM trust boundaries, RAG validation, and safe operational use while preserving the slug. The refreshed audit is 103 KEEP / 48 REWORK / 53 REMOVE. See `docs/content-audit/phase5b-batch3.md`.
- Phase 5B Batch 4 reworks `how-ai-image-generation-works` into enterprise guidance for data handling, rights review, synthetic impersonation response, and controlled publishing while preserving the slug. The refreshed audit is 104 KEEP / 47 REWORK / 53 REMOVE. See `docs/content-audit/phase5b-batch4.md`.
- Phase 5B Batch 5 reworks `palo-alto-ngfw-vs-forcepoint-ngfw` (a comparison, not an article) with content grounded in cited sources (G2 verified user ratings, PeerSpot enterprise pricing review) rather than unsourced claims. While doing this, found and fixed a structural issue in `scripts/content-audit-phase3.mjs`'s `wordCount` calculation: it used `body ?? excerpt` for every content type, but comparisons have no `body` field by design, making `potentiallyThin` structurally true for every comparison on the site regardless of quality (confirmed: even the one comparison already classified KEEP had wordCount 23). Fixed for `source === 'comparison'` records to sum excerpt + verdict + all spec rows instead. The refreshed audit remains 104 KEEP / 47 REWORK / 53 REMOVE (`proposedDisposition` isn't driven by `potentiallyThin`), but the diagnostic signal is now meaningful for all 75 comparisons, not just this one. See `docs/content-audit/phase5b-batch5.md`.
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
