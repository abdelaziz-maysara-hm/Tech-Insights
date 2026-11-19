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
| articles | 135 | 0 (0.0%) | 133 (98.5%) | 2 (1.5%) |
| comparisons | 69 | 0 (0.0%) | 68 (98.6%) | 1 (1.4%) |
| staticPages | 10 | 0 (0.0%) | 7 (70.0%) | 3 (30.0%) |
| dynamicDiscoveryPages | 28 | 0 (0.0%) | 28 (100.0%) | 0 (0.0%) |

**Total:** 242 evaluated; 0 valid; 236 review; 6 invalid.

## Important distinction

- FIELD COMPLETE: required values exist.
- AUTOMATED CANDIDATE: obvious script-detectable defects were not found.
- HUMAN REVIEWED: a qualified reviewer explicitly approved technical and editorial equivalence.

Only the third state, combined with passing automated checks, is eligible for VALID_PAIR.

## Invalid examples

- `article:ad-powershell-daily-tasks` — Structural or language validation failed: arabic-side-not-predominantly-arabic.
- `article:powershell-sysadmin-complete-guide` — Structural or language validation failed: arabic-side-not-predominantly-arabic.
- `comparison:ansible-vs-powershell-dsc` — Structural or language validation failed: arabic-side-not-predominantly-arabic.
- `static-page:disclaimer` — Structural or language validation failed: missing-or-trivial-title.
- `static-page:contribute` — Structural or language validation failed: missing-or-trivial-title.
- `static-page:advertising` — Structural or language validation failed: missing-or-trivial-title.
