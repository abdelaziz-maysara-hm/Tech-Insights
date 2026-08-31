# Phase 5B — Batch 5

Reworked `palo-alto-ngfw-vs-forcepoint-ngfw` while preserving its stable URL.

## What was wrong

The comparison's `excerpt`/`verdict` fields were extremely short (24 words), and its
`device1Score`/`device2Score` values had no cited source or stated methodology --
numbers that looked precise but were not grounded in anything verifiable.

## What changed

- Replaced the generic excerpt and verdict with content grounded in real, cited
  sources: G2.com verified user ratings (Palo Alto NGFW 4.5/5 across 155 reviews;
  Forcepoint NGFW 4.4/5 across 35 reviews, checked 2026) and PeerSpot's 2026
  enterprise pricing/licensing comparison.
- Updated `spec1` (market share & support community) to state the actual G2 review
  counts and ratings directly, rather than an unsourced qualitative claim.
- Did not touch the `device1Score`/`device2Score` numeric fields elsewhere in the
  spec table -- they were already directionally consistent with the qualitative
  facts (e.g., Forcepoint scoring higher on DLP, matching its well-documented
  historical strength), and inventing a new scoring methodology risked introducing
  a *different* unsourced-numbers problem rather than solving the real one.
- Kept independently written Arabic and English bodies at conservative technical
  and translation review states (`technicalStatus: needs-review`,
  `translationStatus: unreviewed`), consistent with Batches 1-4.

## A structural finding in the Phase 3 audit tool itself

While reworking this comparison, the automated word count did not reflect the
improvement even after the content was substantially expanded (52 words after the
first revision, still `potentiallyThin: true`). Investigated and found the root
cause: **the `wordCount` calculation used `body ?? excerpt` for every content type,
but comparisons have no `body` field by design** -- their actual reader-facing
content lives across `excerpt`, `verdict`, and the four labeled spec rows.

Confirmed this wasn't specific to this one article: **even the single comparison
already classified `KEEP` (not REWORK) had a `wordCount` of 23** -- proof that no
comparison on the site could structurally exceed roughly 25 words under the old
calculation, regardless of actual content quality. The `potentiallyThin` (250-word
threshold) flag was therefore measuring a field this content type doesn't have,
not real thinness.

**Fixed** `scripts/content-audit-phase3.mjs`: for `source === 'comparison'` records,
`wordCount` now sums `excerpt + verdict + all four spec rows' labels and values`
instead of `body ?? excerpt`. This is a one-line-type-safe, additive change (article
records are unaffected) that makes the metric meaningful for all 75 comparisons
going forward, not just this one. After the fix, this article's `wordCount` is 301
(up from 24 before any content changes) and `potentiallyThin` is now `false`.

The refreshed audit remains 104 KEEP / 47 REWORK / 53 REMOVE (`proposedDisposition`
is driven by `strategicFit`/`valueLevel`, not `potentiallyThin`, so this fix changes
the diagnostic signal for all comparisons without silently reclassifying anything).

## Verification

```bash
pnpm run typecheck   # pass
pnpm --filter @workspace/techpulse-ar run build   # pass, sitemap=267, no regressions
pnpm --filter @workspace/techpulse-ar run audit:phase3   # confirms 232→301 words, thin: false
```

<!-- END OF FILE -->
