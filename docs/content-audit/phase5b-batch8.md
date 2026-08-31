# Phase 5B — Batch 8

Reworked `crowdstrike-falcon-vs-sentinelone` while preserving its stable URL. This is the
first content rework from the 25 comparisons recovered by the audit-tool classification
fix -- previously misclassified as REMOVE, correctly REWORK now, but never actually
reviewed for content quality until this batch.

## Source handling: this topic has unusually biased primary sources

Both `crowdstrike.com/en-us/compare/crowdstrike-vs-sentinelone/` and
`sentinelone.com/vs/crowdstrike/` are official vendor comparison pages -- each,
unsurprisingly, claims superiority over the other. Deliberately did not lift claims from
either vendor's own comparison page without independent corroboration or explicit framing
as "the vendor's own claim." Used independent analyst/press sources instead (Gartner Magic
Quadrant coverage, press reporting on both companies) for anything stated as fact.

## What changed

- Expanded the excerpt and verdict with real, cited detail:
  - Both products' Gartner Magic Quadrant "Leader" status for Endpoint Protection Platforms
    across multiple consecutive years.
  - **The July 19, 2024 CrowdStrike Falcon outage**: a faulty sensor content update
    triggered a global crash affecting roughly 8.5 million Windows devices, disrupting
    airlines, hospitals, and point-of-sale systems -- among the largest IT outages in
    history, independently and extensively reported, and directly relevant to evaluating
    any EDR vendor whose agent runs with kernel-level privileges on every endpoint. This is
    not vendor marketing from either side; it's independently documented history that a
    fair comparison of these two products cannot omit.
  - An explicit caution on MITRE ATT&CK Evaluation claims: MITRE itself publishes raw
    detection/protection data without ranking or scoring vendors, so any "X% detection"
    headline either vendor cites is that vendor's own interpretation, not an official MITRE
    verdict -- stated directly rather than repeating either vendor's percentage as fact.
  - SentinelOne's Storyline Active Response (STAR) native ransomware rollback capability
    versus CrowdStrike's independently-documented Falcon Complete MDR managed-response
    results -- a genuine capability tradeoff stated on both sides, not a one-sided pitch.
- Kept the existing 2-spec table unchanged (deployment scale and automated-response reliance
  were already reasonable, sourced comparisons).
- Kept independently written Arabic and English content at conservative technical/
  translation review states, consistent with prior batches.

## Verification

```bash
pnpm run typecheck   # pass
pnpm --filter @workspace/techpulse-ar run build   # pass, sitemap=267, no regressions
pnpm --filter @workspace/techpulse-ar run audit:phase3   # wordCount ~confirmed 270, thin: false
```

66 comparisons remain in REWORK (67 minus this one). 24 of the 25 newly-recovered
comparisons from the audit-tool fix still need this same content-review treatment.

<!-- END OF FILE -->
