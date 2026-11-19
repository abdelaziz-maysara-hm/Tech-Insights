---
title: IT Change Management Without the Bureaucracy: Why Every Change Gets Written Down
excerpt: How a lightweight change process prevents outages and helps investigations: change types, what a change record needs, approvals, rollback plans and post-change review.
---

A large share of outages are self-inflicted: a firewall rule, a "quick" patch, a DNS edit on a Friday afternoon. Change management doesn't mean a weekly meeting with forty slides. It means every change is thought through, recorded and reversible.

## Why it matters for security too

- During an incident, the change log answers "what changed recently?", often the fastest route to the cause.
- Unrecorded changes look exactly like attacker activity. A documented change can be ruled out; an undocumented one wastes hours.
- Auditors and frameworks (ISO 27001, PCI DSS, SOC 2) expect evidence of controlled change.

## Three types of change

| Type | Example | Process |
|---|---|---|
| Standard | Adding a user to a group, routine patching | Pre-approved, follow the documented procedure, log it |
| Normal | New firewall rule, server upgrade | Record, peer review or approval, schedule |
| Emergency | Patching an actively exploited flaw | Act fast, record during or right after, review later |

## What a change record needs

- **What and why**: the change and the business reason.
- **Systems affected** and who will notice.
- **Risk and impact**: what could go wrong.
- **Implementation steps**, including who does what and when.
- **Test plan**: how you'll know it worked.
- **Rollback plan**: how to undo it, and the point at which you'll decide to.
- **Approval** proportional to risk.

## Keeping it light

- Use your existing ticketing tool rather than a separate system.
- Templates for common changes.
- Peer review by one colleague is often enough for normal changes in small teams.
- Avoid change freezes that just push risky changes into bigger batches.

## After the change

Close the record with the outcome. For failed or problematic changes, hold a short no-blame review and update procedures. Store configuration backups before and after for network devices.

Related: [patch management strategy](/article/windows-patch-management-strategy) and [dual control for critical operations](/article/dual-control-critical-operations).

## FAQ

**Is this ITIL?**
ITIL describes change enablement in detail. You don't need the whole framework to use the core ideas.

## References

- [NIST SP 800-128: Guide for Security-Focused Configuration Management of Information Systems](https://csrc.nist.gov/pubs/sp/800/128/upd1/final)
