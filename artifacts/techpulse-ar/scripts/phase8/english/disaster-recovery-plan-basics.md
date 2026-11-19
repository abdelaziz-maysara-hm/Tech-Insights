---
title: Disaster Recovery Planning: Setting RTO and RPO and Proving You Can Hit Them
excerpt: How to build a disaster recovery plan that works: business impact analysis, recovery time and recovery point objectives, recovery tiers, runbooks, and the testing that turns a document into a capability.
---

A disaster recovery plan answers a simple question: **if our main systems or site became unavailable, how would we get the business running again, and how fast?** Without a plan, recovery happens by improvisation under pressure, usually slower and with more data lost.

## Start with business impact

A business impact analysis (BIA) asks each department which systems they depend on, what happens if those systems stop for an hour, a day or a week, and what minimum service they need. This turns technical recovery into business priorities. Payroll the day before payday is critical; the intranet probably isn't.

## Two numbers that drive everything

- **RTO (Recovery Time Objective)**: the maximum acceptable time a system can be down. Four hours means the service must be back within four hours of the disaster.
- **RPO (Recovery Point Objective)**: the maximum acceptable data loss, measured in time. An RPO of one hour means you can lose at most the last hour of changes, so you need backups or replication at least hourly.

Shorter RTO and RPO cost more: replication, standby sites, more frequent backups. Agree them with the business, not just IT.

## Recovery tiers

| Tier | Example systems | RTO / RPO | Typical approach |
|---|---|---|---|
| 1 | ERP, identity, core customer services | Hours / minutes | Replication to a secondary site or cloud |
| 2 | File servers, internal apps | 1 day / 24 hours | Restore from backups |
| 3 | Archives, non-critical tools | Days / days | Restore when time allows |

Identity (Active Directory, Entra ID connectivity), DNS and networking come first: almost everything else depends on them.

## What the plan contains

- Roles and contacts, including vendors and an out-of-band communication method.
- Declaration criteria: who decides it's a disaster.
- Recovery order and dependencies.
- Step-by-step runbooks per system, written so a colleague could follow them.
- Where backups are, how to access them, and the credentials and encryption keys needed, stored somewhere reachable when the main site is down.
- Return-to-normal (failback) steps.

Ransomware is now the most likely "disaster" for many organisations, so the plan must assume compromised infrastructure and rely on clean, [immutable backups](/article/immutable-backups-ransomware-defense).

## Testing

- **Tabletop walkthroughs** of the plan; see [tabletop exercises](/article/incident-response-tabletop-exercises).
- **Restore tests** of individual systems, timed against RTO.
- **Failover tests** for tier 1, at least yearly.
- Update the plan after every test and every significant change.

## FAQ

**Is DR the same as business continuity?**
DR restores IT systems. Business continuity covers how the whole organisation keeps operating, including people, premises and manual workarounds.

## References

- [NIST SP 800-34 Rev. 1: Contingency Planning Guide for Federal Information Systems](https://csrc.nist.gov/pubs/sp/800/34/r1/upd1/final)
- [ISO 22301: Business continuity management systems](https://www.iso.org/standard/75106.html)
