No firewall is misconfigured on the day it's installed. It gets that way one reasonable-sounding request at a time: open this port "for now", add this vendor's range, leave that rule in case the project comes back. Three years later there are four hundred rules and nobody can say what half of them protect.

Below are the ten problems we see most often in reviews, followed by the routine that keeps them from coming back.

## The ten usual suspects

1. **Any-any rules.** Allow-everything rules added during an outage and never removed. Also look for rules where the *service* is `ALL`/`any` even when source and destination are specific.
2. **Admin interface on the internet.** HTTPS or SSH management enabled on the WAN side. Management-plane vulnerabilities turn up at every vendor; don't give them an audience.
3. **Shadowed rules.** A rule that can never match because a broader rule above it catches the same traffic. Harmless to packets, harmful to anyone reading the policy.
4. **Dead rules.** Zero hits for months: decommissioned servers, finished projects, departed vendors.
5. **No logging on allow rules.** Teams log denies and skip allows. In an incident, the question is usually what was *allowed*.
6. **No egress filtering.** Internal hosts can reach any port on the internet, which makes command-and-control and data exfiltration easy.
7. **Risky services published directly.** RDP, SMB or databases NAT-ed to the internet. Exposed RDP is a perennial ransomware entry point; put it behind VPN or ZTNA.
8. **Stale firmware.** No updates in a year, or a release that has left vendor support.
9. **Weak VPN crypto.** DES, 3DES, MD5 or weak DH groups kept for a peer that was retired long ago.
10. **No backups, no change control.** Nobody knows who changed what, and the last off-box backup predates the current design.

## A quarterly audit routine

**Export the rulebase** with hit counts and last-used dates. Reviewing in a spreadsheet beats squinting at the GUI.

**Use the platform's own tooling.**

| Platform | What helps |
|---|---|
| Palo Alto | **Policy Optimizer** finds unused rules and helps convert port-based rules to App-ID rules. CLI: `show rule-hit-count vsys vsys-name vsys1 rule-base security rules all` |
| FortiGate | The **Hit Count** and **Last Used** columns in the policy list, plus filtering for unused policies |

**Classify every rule** as keep, tighten or remove. To remove safely, disable first for an agreed period, then delete if nobody complains.

**Benchmark against a reference.** CIS publishes benchmarks for several firewall platforms, and NIST SP 800-41 sets out firewall policy principles.

**Change through change control.** Each edit gets a ticket and an owner, so next quarter's review starts cleaner.

Building a new firewall? Start from a clean baseline with our [FortiGate production setup](/article/fortigate-initial-setup-enterprise-guide). Struggling with a flat network? [Segmentation](/article/network-segmentation-compliance) makes policies shorter and audits easier.

## FAQ

**How often should we audit?**
Quarterly at minimum, with a lighter monthly pass over new rules. Frameworks such as PCI DSS set their own mandatory review intervals.

**Should zero-hit rules be deleted immediately?**
No. Some rules fire once a year, such as financial year-end jobs. Disable, wait, then delete.

**Do we need a commercial tool?**
Dedicated firewall policy management platforms exist and help at scale, but built-in hit counts and optimisers go a long way.

## References

- [NIST SP 800-41 Rev. 1: Guidelines on Firewalls and Firewall Policy](https://csrc.nist.gov/pubs/sp/800/41/r1/final)
- [CIS Benchmarks (Center for Internet Security)](https://www.cisecurity.org/cis-benchmarks)
- [Security policy rule optimization (Palo Alto Networks)](https://docs.paloaltonetworks.com/ngfw/administration/app-id/security-policy-rule-optimization)
