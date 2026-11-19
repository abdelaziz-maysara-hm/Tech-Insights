---
title: Network Segmentation for Compliance: Shrinking Scope Without Overengineering
excerpt: How segmentation reduces the systems an audit has to cover (PCI DSS is the classic case), what a segmentation design needs, and how to prove it works.
---

Compliance frameworks care about where sensitive data lives and what can reach it. On a flat network, everything can reach everything, so every device is in scope for the audit. Segmentation shrinks that scope, and it's good security in its own right.

## The idea in one example

Under PCI DSS, any system that stores, processes or transmits cardholder data, plus anything connected to it, is in scope. If payment terminals and the card database sit on an isolated segment with tightly controlled access, the rest of the office network can fall out of scope. That means fewer systems to harden, scan and document.

The same logic applies to health records, industrial control systems, or a research network holding sensitive IP.

## What a segmentation design needs

1. **Data-flow mapping**: where does the sensitive data enter, move and rest? Which systems truly need to talk to it?
2. **Zones**: group systems by sensitivity and function, for example card environment, servers, users, management and guests.
3. **Enforcement points**: firewalls or ACLs between zones with **default deny**, allowing only documented flows (source, destination, port, business reason).
4. **Separate administration**: admin access to the sensitive zone through a jump host with MFA, not from every workstation.
5. **Logging** of traffic crossing zone boundaries.

VLANs separate broadcast domains but don't filter traffic by themselves; the filtering happens at the firewall or ACL. See [VLAN basics](/article/vlan-basics-why-segment).

## Proving it works

Auditors will want evidence, not diagrams:

- **Segmentation testing**: PCI DSS requires penetration testing of segmentation controls, at least annually for merchants and more often for service providers.
- **Rule reviews** on a schedule, removing rules nobody can justify.
- **Change control** so new connections into the zone are approved and recorded; see [change management](/article/it-change-management-process-basics).

## Common pitfalls

- "Temporary" any-any rules that become permanent.
- Shared services (AD, backup, monitoring) that connect into the zone and drag themselves into scope. Plan for them explicitly.
- Wi-Fi and remote access that bypass the firewall between zones.

## FAQ

**Is micro-segmentation required?**
Not by most frameworks. Start with well-enforced zones; per-workload controls are a later refinement.

**Does segmentation alone make us compliant?**
No. It reduces scope; the in-scope systems still need every control the framework requires.

## References

- [PCI SSC document library (PCI DSS and scoping/segmentation guidance)](https://www.pcisecuritystandards.org/document_library/)
- [NIST SP 800-207: Zero Trust Architecture](https://csrc.nist.gov/pubs/sp/800/207/final)
