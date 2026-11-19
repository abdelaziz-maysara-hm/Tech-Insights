---
title: Zero-Day Vulnerabilities: What They Are and How to Be Ready
excerpt: What makes a vulnerability a zero-day, how they're found, traded and exploited, why edge devices are frequent targets, and the resilience measures that limit damage before a patch exists.
---

A zero-day is a vulnerability that the vendor doesn't know about, or hasn't fixed, when attackers start exploiting it. The name refers to defenders having had zero days to prepare. You can't patch what has no patch, so preparation is about limiting what an attacker can do with one.

## The terms

- **Zero-day vulnerability**: the unknown or unpatched flaw.
- **Zero-day exploit**: code that takes advantage of it.
- **N-day**: a vulnerability with a public fix that many organisations haven't applied. Most real-world compromises use N-days, not zero-days.

## Who finds and uses them

- **Security researchers** who report them to vendors, often through bug bounty programmes.
- **Commercial exploit brokers and spyware vendors** who sell them.
- **State-sponsored groups** for espionage.
- **Criminal groups**, increasingly against widely deployed products such as VPN gateways, firewalls and file-transfer software.

Google's and Mandiant's yearly analyses have shown a growing share of zero-days hitting enterprise products, particularly security and networking appliances at the network edge.

## When one is announced

1. **Check exposure**: do you run the product and version? Is it internet-facing? An accurate asset inventory pays off here.
2. **Apply vendor mitigations** (configuration workarounds, disabling a feature) immediately if no patch exists.
3. **Patch quickly** when the fix arrives, starting with exposed systems; see [patch management](/article/windows-patch-management-strategy).
4. **Hunt for compromise**: vendors and CISA often publish indicators. Patching doesn't remove an attacker who got in first.
5. **Watch CISA's KEV catalogue** and vendor advisories.

## Resilience before the next one

- **Reduce attack surface**: fewer internet-facing services, management interfaces never exposed.
- **Segmentation** so a compromised device can't reach everything; see [network segmentation](/article/network-segmentation-compliance).
- **Least privilege and MFA**, limiting what stolen access achieves.
- **EDR and logging** to detect post-exploitation behaviour, even when the initial exploit is unknown; see [how EDR works](/article/how-edr-actually-works).
- **Backups and incident response plans** tested in advance.

## FAQ

**Are zero-days the main threat to most organisations?**
Usually not. Unpatched known vulnerabilities, weak credentials and phishing cause far more incidents. Fix those first.

## References

- [CISA Known Exploited Vulnerabilities Catalog](https://www.cisa.gov/known-exploited-vulnerabilities-catalog)
- [Google Project Zero: 0day "In the Wild" tracking](https://googleprojectzero.blogspot.com/p/0day.html)
