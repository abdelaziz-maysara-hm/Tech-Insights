---
title: How Long to Keep Logs: Setting a Retention Policy That Holds Up
excerpt: Balancing investigation needs, legal requirements and storage cost: hot versus archive tiers, which logs deserve longer retention, and how to make sure the logs are actually there when you need them.
---

During an incident, the first question is usually "when did this start?" Attackers often sit in a network for weeks before being noticed, so logs that roll over after seven days may be gone exactly when you need them. Retention is a decision, not a default.

## What drives the number

- **Investigation needs**: you want logs covering at least the time an attacker might stay undetected, plus margin.
- **Legal and regulatory requirements**: sector regulations, contracts and standards such as PCI DSS set minimums for some data. Check what applies to you.
- **Privacy law**: keeping personal data longer than necessary is itself a risk. Retention must have an end as well as a start.
- **Cost**: ingest and storage add up, especially in a SIEM priced per gigabyte.

## Tiered retention

| Tier | Purpose | Typical approach |
|---|---|---|
| Hot (searchable in the SIEM) | Detection, triage | Weeks to a few months |
| Warm/cold | Investigations | Several months, slower search |
| Archive | Legal hold, long-tail forensics | A year or more in cheap, immutable storage |

PCI DSS, for example, requires a year of audit log history with the most recent three months immediately available. That's a useful benchmark even if it doesn't apply to you.

## Which logs deserve longest retention

- Authentication: domain controllers, identity provider, VPN, MFA.
- Firewall and proxy connections at the perimeter.
- EDR telemetry and alerts.
- Privileged activity and changes to security settings.
- DNS query logs, which are invaluable for tracing malware callbacks.

## Making retention real

- **Centralise**: logs on the device that's compromised can be deleted. Ship them to a [central syslog server](/article/syslog-server-setup-basics) or SIEM.
- **Synchronise time** with NTP so timelines line up.
- **Protect integrity**: restrict deletion and use immutable storage for archives.
- **Test retrieval**: once a quarter, pull a three-month-old event. Retention you can't search isn't retention.
- **Document it** in a policy: data type, retention period, location, owner.

## FAQ

**Is there one "correct" retention period?**
No. Many organisations land on around 90 days hot and 12 months total, adjusted for regulations and budget.

**Should we log everything?**
Collect what you'll use for detection and investigation. Noisy, unused logs cost money and hide signal. See [how a SIEM works](/article/how-siem-actually-works).

## References

- [NIST SP 800-92: Guide to Computer Security Log Management](https://csrc.nist.gov/pubs/sp/800/92/final)
- [PCI Security Standards Council document library](https://www.pcisecuritystandards.org/document_library/)
