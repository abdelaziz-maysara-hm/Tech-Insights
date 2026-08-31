# Phase 5B — i18n Audit Fix: Context-Length-Gated Arabic "Soon" Detection

Directly follows up on Batch 9's documented-but-unfixed gap: the placeholder-language detector
still false-flagged standalone "قريبًا" (soon) used as ordinary temporal language in normal-length
sentences, since Arabic's everyday usage of the word isn't as narrow/specific as English "coming
soon."

## The fix

Restricted the Arabic "soon" pattern to only count as a placeholder signal when the combined
title+body word count is short (≤20 words) -- the word is then plausibly the entire "coming soon"
message itself, not one ordinary word embedded inside an otherwise complete, substantial piece of
writing. The English/generic patterns (`todo`, `tbd`, `lorem ipsum`, `placeholder`, `coming soon`,
`تحت الإنشاء`) are unaffected -- they're specific enough phrases that they don't need this gating.

## Verified both directions, not just the fix target

Tested directly, not assumed:

- **Genuine short placeholders still correctly flagged**: `"قريبًا!" / "Coming soon!"` → flagged.
  `"المحتوى قريبًا"` (Arabic-only, no English) → flagged.
- **The original false-positive case no longer flagged**: a long, complete, natural sentence using
  "قريبًا" in its ordinary temporal sense (the exact `windows-disk-cleanup-safe` pattern found in
  Batch 9) → not flagged.
- Confirmed against the actual site content, not just synthetic test cases: re-running the full
  audit dropped `INVALID_PAIR` count from 8 to 7. `windows-disk-cleanup-safe` moved to
  `REVIEW_PAIR`. The remaining 7 are unrelated, genuine issues (3 PowerShell-heavy articles/
  comparisons correctly flagged for having more English than Arabic content, and 4 static pages
  with genuinely trivial/missing titles) -- none are placeholder-language false positives.

## Verification

```bash
pnpm run typecheck   # pass
pnpm --filter @workspace/techpulse-ar run build   # pass, sitemap=267, no regressions
pnpm --filter @workspace/techpulse-ar run audit:i18n   # INVALID_PAIR 8 -> 7; windows-disk-cleanup-safe confirmed fixed; remaining 7 confirmed genuine, unrelated issues
```

This closes the last known gap in the placeholder-language detector found during this session's
bilingual-quality work (Batch 9 found and partially fixed it; this closes the remainder). The
`arabic-side-not-predominantly-arabic` and `missing-or-trivial-title` signals for the remaining 7
items are real, separate issues -- not addressed here, since they're accurate flags, not tool
bugs.

<!-- END OF FILE -->
