# Phase 5B — Batch 6

Reworked `wireguard-vs-openvpn` while preserving its stable URL.

## What was different about this one

Unlike Batch 5's target, this comparison's `specs` table was already directionally
accurate (WireGuard scoring higher on speed/simplicity, OpenVPN scoring higher on
maturity/audit history and port-filtering flexibility -- both consistent with
well-documented facts about the two protocols). The problem was purely the
excerpt/verdict length (25-27 words), not the accuracy of the existing content.

## What changed

- Expanded the excerpt and verdict with real, cited technical detail rather than
  touching the already-accurate spec rows:
  - WireGuard's codebase size (~4,000 lines vs. OpenVPN's ~100,000, per both
    projects' own documentation) -- a concrete, checkable number, not a vague
    "simpler" claim.
  - WireGuard's official Linux kernel merge date (kernel 5.6, March 2020, per The
    Register and Linux Kernel Newbies) as third-party validation of maturity,
    not just WireGuard's own marketing claim.
  - WireGuard's specific cryptographic primitives (Curve25519, ChaCha20-Poly1305,
    BLAKE2s) and the deliberate design tradeoff of not supporting cipher
    negotiation, versus OpenVPN's configurable cipher suite.
  - Real-world adoption context: WireGuard is now offered by most modern
    commercial VPN providers, not just a kernel-level curiosity.
- Kept independently written Arabic and English bodies at conservative technical
  and translation review states, consistent with Batches 1-5.

## Verification

```bash
pnpm run typecheck   # pass
pnpm --filter @workspace/techpulse-ar run build   # pass, sitemap=267, no regressions
pnpm --filter @workspace/techpulse-ar run audit:phase3   # wordCount 239->282, thin: true->false
```

39 comparisons remain in REWORK (down from 40 after this batch).

<!-- END OF FILE -->
