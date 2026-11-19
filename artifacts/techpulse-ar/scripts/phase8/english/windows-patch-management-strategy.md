---
title: Patch Management for a Small IT Team: A Strategy That Fits
excerpt: A realistic patching process for small environments: inventory, rings, timelines by severity, handling the systems you can't reboot, and proving it worked.
---

Small teams rarely lose to exotic attacks. They lose to a known vulnerability with a patch that's been available for months. A light, repeatable process beats an ambitious one that's skipped when things get busy.

## 1. Know what you have

You can't patch what you don't know about. Keep an inventory of servers, workstations, network devices and key applications, including versions. Your endpoint management or vulnerability scanner can usually produce this automatically.

## 2. Patch in rings

- **Ring 0, test**: a few IT machines and non-critical servers, patched as soon as updates release.
- **Ring 1, pilot**: a representative group of users, a few days later.
- **Ring 2, broad**: everyone else once the pilot is quiet.
- **Critical servers**: a scheduled window after pilot results, with a rollback plan.

Windows Update for Business, Intune or WSUS can enforce these rings for Windows devices.

## 3. Set timelines by risk, not habit

- **Actively exploited vulnerabilities** (for example, on CISA's KEV catalogue) and internet-facing systems: days, not weeks.
- **Critical and high severity** elsewhere: within a couple of weeks.
- **Everything else**: the monthly cycle.

Use [CVSS](/article/understanding-cvss-score) as one input, but exploitation status and exposure matter more.

## 4. Don't forget the non-Windows stuff

Firewalls, VPN appliances, hypervisors, browsers, PDF readers, Java and third-party apps are frequent entry points. VPN and firewall firmware deserves top priority; edge devices are heavily targeted.

## 5. Plan for the systems you can't patch

Legacy or vendor-locked systems need compensating controls: isolate them on their own segment, restrict access, monitor closely, and record the exception with an owner and review date.

## 6. Verify

"Deployed" isn't "installed". Use compliance reports or a [vulnerability scan](/article/vulnerability-scanning-vs-penetration-testing) to confirm, and chase machines that are offline or failing.

## FAQ

**Should we wait a week after Patch Tuesday?**
Waiting for broad deployment is reasonable; the test ring shouldn't wait. For actively exploited flaws, move faster.

**What about automatic reboots?**
Give users deadlines with warnings rather than open-ended snoozes. Unrebooted machines are unpatched machines.

## References

- [CISA Known Exploited Vulnerabilities Catalog](https://www.cisa.gov/known-exploited-vulnerabilities-catalog)
- [NIST SP 800-40 Rev. 4: Guide to Enterprise Patch Management Planning](https://csrc.nist.gov/pubs/sp/800/40/r4/final)
