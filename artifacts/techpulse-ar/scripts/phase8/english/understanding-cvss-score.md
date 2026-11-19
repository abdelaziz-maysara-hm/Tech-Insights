---
title: Reading CVSS Scores Properly: What the Number Hides and What to Add
excerpt: How CVSS base metrics are built (attack vector, complexity, privileges, user interaction, impact), what changed in CVSS 4.0, and how to combine the score with exploitation data (KEV, EPSS) and your own exposure.
---

Vulnerability scanners and advisories lead with a CVSS score: 9.8, 7.5, 4.3. It's tempting to sort by that number and work down the list. But CVSS measures **technical severity in general**, not **risk in your environment**, and the difference matters when you have hundreds of findings.

## What goes into a base score

The vector string behind the number tells you more than the number itself. In CVSS 3.1 and 4.0, the main exploitability metrics are:

- **Attack Vector (AV)**: Network, Adjacent, Local or Physical. Remotely exploitable flaws are the most dangerous.
- **Attack Complexity (AC)**: whether special conditions beyond the attacker's control are needed.
- **Attack Requirements (AT)**: new in 4.0, covering preconditions on the target such as a specific configuration.
- **Privileges Required (PR)**: none, low or high.
- **User Interaction (UI)**: whether a victim must click or open something.

Impact metrics then rate the effect on confidentiality, integrity and availability. CVSS 4.0 separates impact on the vulnerable system from impact on subsequent systems.

Example vector: `CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H` scores 9.8: remote, easy, no privileges, no interaction, full impact.

## CVSS 4.0 changes

Released by FIRST in late 2023, version 4.0 adds clearer naming (CVSS-B for base only, CVSS-BT with threat metrics, CVSS-BTE with environmental metrics), the Attack Requirements metric, and supplemental metrics such as "Automatable". Many databases still publish 3.1 scores alongside or instead of 4.0, so check which version you're reading.

## Why the base score isn't your priority

- A 9.8 on an isolated lab server may matter less than a 6.5 on an internet-facing system holding customer data.
- The base score doesn't know whether anyone is **actually exploiting** the flaw.
- It doesn't know your compensating controls.

## Signals to add

1. **Known exploitation**: CISA's Known Exploited Vulnerabilities (KEV) catalogue lists flaws exploited in the wild. Treat these as urgent regardless of score.
2. **Exploit likelihood**: FIRST's EPSS estimates the probability of exploitation in the next 30 days.
3. **Exposure**: internet-facing, reachable from user networks, or isolated?
4. **Asset value**: what data or function does the system hold?
5. **Environmental metrics**: CVSS lets you adjust for your own requirements and mitigations.

A simple policy: KEV or internet-facing critical within days; other critical and high within weeks; the rest in the normal cycle. See [patch management](/article/windows-patch-management-strategy).

## FAQ

**Who assigns CVSS scores?**
The vendor or CVE numbering authority, and databases like NVD may add their own. Scores sometimes differ between sources.

## References

- [FIRST: CVSS v4.0 Specification](https://www.first.org/cvss/v4-0/specification-document)
- [FIRST: Exploit Prediction Scoring System (EPSS)](https://www.first.org/epss/)
- [CISA Known Exploited Vulnerabilities Catalog](https://www.cisa.gov/known-exploited-vulnerabilities-catalog)
