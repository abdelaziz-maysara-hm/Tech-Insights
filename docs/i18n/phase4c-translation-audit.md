# NetSec Atlas Phase 4C Translation Pair Audit

> Automated validation is not human review. A field-complete pair is not necessarily a correct technical translation. The owner has identified the existing translations as literal and technically unreliable, so unreviewed pairs remain REVIEW_PAIR.

## Policy

- VALID_PAIR requires an explicit human-reviewed translation marker and passing structural checks.
- REVIEW_PAIR is excluded from hreflang until technical/editorial review is recorded.
- INVALID_PAIR is excluded because automated structural or language checks failed.
- This report is development documentation and is not imported by the production application.

## Results

| Content type | Evaluated | VALID_PAIR | REVIEW_PAIR | INVALID_PAIR |
| --- | ---: | ---: | ---: | ---: |
| articles | 129 | 0 (0.0%) | 126 (97.7%) | 3 (2.3%) |
| comparisons | 75 | 0 (0.0%) | 74 (98.7%) | 1 (1.3%) |
| staticPages | 9 | 0 (0.0%) | 5 (55.6%) | 4 (44.4%) |
| dynamicDiscoveryPages | 28 | 0 (0.0%) | 28 (100.0%) | 0 (0.0%) |

**Total:** 241 evaluated; 0 valid; 233 review; 8 invalid.

## Important distinction

- FIELD COMPLETE: required values exist.
- AUTOMATED CANDIDATE: obvious script-detectable defects were not found.
- HUMAN REVIEWED: a qualified reviewer explicitly approved technical and editorial equivalence.

Only the third state, combined with passing automated checks, is eligible for VALID_PAIR.

## Invalid examples

- `article:ad-powershell-daily-tasks` — Structural or language validation failed: arabic-side-not-predominantly-arabic.
- `article:windows-disk-cleanup-safe` — Structural or language validation failed: placeholder-language.
- `article:powershell-sysadmin-complete-guide` — Structural or language validation failed: arabic-side-not-predominantly-arabic.
- `comparison:ansible-vs-powershell-dsc` — Structural or language validation failed: arabic-side-not-predominantly-arabic.
- `static-page:disclaimer` — Structural or language validation failed: missing-or-trivial-title.
- `static-page:contact` — Structural or language validation failed: missing-or-trivial-title.
- `static-page:contribute` — Structural or language validation failed: missing-or-trivial-title.
- `static-page:advertising` — Structural or language validation failed: missing-or-trivial-title.
