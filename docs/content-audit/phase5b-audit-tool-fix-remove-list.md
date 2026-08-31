# Phase 5B — Audit Tool Fix: 30 Misclassified REMOVE Items Recovered

Following directly from Batch 7's recommendation ("spot-check the REMOVE list for other
missing-vocabulary domains before trusting it for a large cleanup pass"), did exactly that
-- and found the problem was far larger than the single IAM gap fixed in Batch 7.

## What was found

Reviewed all 47 REMOVE-classified items by title. **30 of 47 (64%) were, by title alone,
unambiguously professional/security tooling or content**: SIEM tools (Splunk, Wazuh,
Elastic/ELK), IDS/IPS (Snort, Suricata), pentest tools (Metasploit, Burp Suite, Nikto,
OWASP ZAP), EDR/XDR (CrowdStrike, SentinelOne, Microsoft Defender), enterprise password
managers (1Password, Bitwarden, Keeper), disk encryption (BitLocker, VeraCrypt), CI/CD
tooling (Jenkins, GitHub Actions, GitLab), observability (Grafana, Prometheus, Datadog,
Kibana), firewalls (pfSense, OPNsense, FortiGate, additional Palo Alto pairings), enterprise
Windows management (Group Policy, Intune, LAPS, Citrix), networking hardware (UniFi,
Meraki), and core security-concept articles (threat modeling/STRIDE, honeypots, TLS
handshake, data classification, dual control).

## Root cause

Confirmed directly (`snort-vs-suricata`): the comparison's excerpt describes the two IDS/IPS
tools by name and by qualitative tradeoffs ("huge community", "higher performance") without
ever using a generic keyword the `professional` regex was looking for ("security",
"network", etc.). **Naming a well-known security product is not the same as using a generic
security keyword**, and no free-text regex alone can reliably bridge that gap for every
short-excerpt comparison on the site.

## Fix

Two changes to `content-audit-phase3.mjs`:

1. Expanded the `professional` regex with additional domain vocabulary that was entirely
   absent: IDS/IPS, penetration testing, threat modeling/STRIDE, honeypot/deception, dual
   control, data classification, TLS handshake, encryption, log management, observability,
   monitoring, CI/CD, virtual desktop, group policy, password manager, breach monitoring,
   vulnerability scanning.
2. Added a `KNOWN_PROFESSIONAL_PRODUCTS` name list (Snort, Suricata, Wazuh, Splunk, Elastic
   Stack, Grafana, Prometheus, Datadog, Metasploit, Burp Suite, Nikto, OWASP ZAP,
   CrowdStrike, SentinelOne, Microsoft Defender, Zscaler, Prisma Access, pfSense, OPNsense,
   UniFi, Cisco Meraki, FortiGate/Fortinet, Palo Alto, Bitwarden, 1Password, Keeper, Have I
   Been Pwned, BitLocker, VeraCrypt, Citrix, Group Policy, Microsoft Intune, Microsoft LAPS,
   Jenkins, GitHub Actions, GitLab, GitHub, Postman, Insomnia), matched directly against
   `device1Name`/`device2Name` (comparisons) and `title`/`slug` -- not an attempt at an
   exhaustive vendor database (that's `src/data/taxonomy/vendors.ts`'s job for full
   articles), just enough to stop a short-excerpt comparison naming a well-known tool from
   falling through to `unrelated` purely because the excerpt didn't also use a generic
   keyword.

## Verified impact, precisely

Diffed the full audit JSON against the pre-fix version via `git show`, not assumed:

- **Exactly 30 items reclassified**, all previously flagged as obviously professional by
  title -- 5 to KEEP (the core-concept articles), 25 to REWORK (the tool comparisons, which
  still need the same excerpt-expansion treatment as prior batches, not just a
  classification fix).
- **Zero false positives**: spot-checked the remaining 17-item REMOVE list -- every one is
  genuinely consumer content (phone/laptop battery guides, iPhone vs. Galaxy, PS5 vs. Xbox,
  Apple Watch vs. Galaxy Watch, AnyDesk vs. TeamViewer) with no professional/security
  content misclassified there.

Disposition counts: **114 KEEP / 73 REWORK / 17 REMOVE** (previously 109/48/47, and 104/47/53
before Batch 7's IAM fix). The REMOVE list has gone from 53 to 47 to 17 across two rounds of
audit-tool accuracy fixes in this session -- a reminder that this list should not be treated
as authoritative for any bulk cleanup action without this kind of periodic verification.

Nothing was ever actually deleted at any point -- `AGENTS.md`/`AI_RULES.md` require explicit
owner review before any REMOVE action -- but this closes a large, real accuracy gap before
any future cleanup pass would have trusted a REMOVE list that was wrong for nearly two-thirds
of its entries.

## Verification

```bash
pnpm run typecheck   # pass
pnpm --filter @workspace/techpulse-ar run build   # pass, sitemap=267, no regressions
pnpm --filter @workspace/techpulse-ar run audit:phase3   # confirms 30 reclassifications, diffed directly against pre-fix JSON via git show; spot-checked remaining 17 REMOVE items are genuine consumer content
```

## What this means for future REWORK batches

Comparisons specifically in REWORK grew from 38 to 67 as a direct result of this fix (25
newly recovered comparisons reclassified from REMOVE, plus the pre-existing 38). None of
the 25 newly recovered comparisons have had their content reworked yet -- they were
misclassified, not yet improved. Future batches should treat these as equally valid REWORK
candidates alongside the previously-known 38, likely prioritizing by the same criteria
already established (excerpt/verdict length, spec-table accuracy).

<!-- END OF FILE -->
