# Phase 5B — Batch 7

Reworked `okta-vs-microsoft-entra-id` while preserving its stable URL, and found/fixed a
significant classification bug in the audit tool itself.

## The content update

- Expanded the excerpt and verdict with real, cited detail: both products' Gartner Magic
  Quadrant "Leader" status for Access Management (multiple consecutive years, including
  Okta's ninth consecutive year per Okta's own 2025 announcement), Okta's 18,000+
  integration catalog, Entra ID's 700,000+ paid customer base, and the real licensing
  structure (Entra ID P1 bundled into Microsoft 365 E3).
- Added a balanced, carefully-worded mention of Okta's October 2023 support-system
  breach (confirmed by Okta itself and by affected customers BeyondTrust and Cloudflare;
  ~134 of ~18,400 customers affected) as a legitimate factor in identity-vendor risk
  evaluation -- explicitly noting it affected the support case system, not the core
  identity platform, to keep the framing accurate and not overstated.
- Kept the existing spec table (already directionally accurate) unchanged.

## A significant bug found while doing this

After the content update, the deterministic audit reclassified this article from REWORK
to **REMOVE** -- an unexpected regression given the update made the content *more*
detailed and source-grounded, not less relevant.

Investigated and found the root cause: `content-audit-phase3.mjs`'s `professional` regex
(used to detect enterprise/professional-IT relevance) had **zero identity/access-management
terminology** -- not even the word "identity" itself, only the bare abbreviation `iam`.
The rewritten excerpt used full terminology ("Access Management", "identity", "Gartner
Magic Quadrant") rather than the exact string "iam", so it matched nothing in the regex
and fell through to `strategicFit: 'unrelated'` -> `proposedDisposition: 'REMOVE'`.

**Fixed** by adding `identity`, `single sign-on`, `\bsso\b`, `\bmfa\b`, `authentication`,
and `access management` to the `professional` regex.

### The fix's blast radius was much larger than one article

Re-running the audit after the fix changed disposition for **6 items total**, not just
this one -- all of them genuine security/identity content that should never have been
anywhere near REMOVE:

| Slug | Before | After |
|---|---|---|
| `2fa-practical-guide` | REMOVE | **KEEP** |
| `password-manager-start` | REMOVE | **KEEP** |
| `least-privilege-principle-practical` | REMOVE | **KEEP** |
| `nist-password-guidelines-vs-old-rules` | REMOVE | **KEEP** |
| `authentication-vs-authorization-explained` | REMOVE | **KEEP** |
| `auth0-vs-firebase-authentication` | REMOVE | REWORK |
| `okta-vs-microsoft-entra-id` | REWORK | REWORK (now correctly `strategicFit: enterprise`) |

**Five genuinely valuable, professionally-written security articles were misclassified as
REMOVE purely because the audit tool's IAM vocabulary was incomplete** -- not because
anything was wrong with the content itself. Per `AGENTS.md`/`AI_RULES.md`, no REMOVE
disposition is ever acted on without explicit owner review, so nothing was actually
deleted -- but this is exactly the kind of tool-accuracy issue worth catching before a
future cleanup pass trusts the REMOVE list at face value.

Updated disposition counts: **109 KEEP / 48 REWORK / 47 REMOVE** (previously 104/47/53).

## Verification

```bash
pnpm run typecheck   # pass
pnpm --filter @workspace/techpulse-ar run build   # pass, sitemap=267, no regressions
pnpm --filter @workspace/techpulse-ar run audit:phase3   # confirms all 6 reclassifications, diffed directly against the pre-fix JSON via git show
```

38 comparisons remain in REWORK (down from 39 -- this batch's own comparison moved
forward; `auth0-vs-firebase-authentication`, an article-adjacent reclassification, is a
bonus find for a future REWORK pass, not counted in the comparisons total).

<!-- END OF FILE -->
