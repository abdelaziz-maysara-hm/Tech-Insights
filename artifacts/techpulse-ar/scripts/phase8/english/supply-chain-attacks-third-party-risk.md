---
title: Supply Chain Attacks: Managing the Risk That Arrives Through Trusted Vendors
excerpt: How attackers compromise software updates, service providers and open-source packages to reach many victims at once, and the vendor-risk and technical controls that limit the damage.
---

Why break into a thousand companies when you can break into one supplier they all trust? Supply chain attacks abuse exactly that trust: a poisoned software update, a compromised managed service provider, or a malicious open-source package.

## Common patterns

- **Compromised software updates**: attackers insert code into a vendor's build process, and customers install it as a signed, legitimate update. SolarWinds Orion (2020) is the best-known case.
- **Service provider access**: MSPs and IT contractors hold remote access to many clients. One compromised provider account, or a vulnerable remote management tool, can reach all of them, as the Kaseya VSA attack (2021) showed.
- **Open-source dependencies**: typosquatted packages, hijacked maintainer accounts, or backdoors inserted over time. The xz Utils backdoor (2024) was caught shortly before wide distribution.
- **Hardware and firmware** tampering, rarer but hard to detect.

## Vendor risk management

- **Inventory your suppliers** and rank them by access and data: who has remote access, who processes sensitive data, whose software runs with high privileges.
- **Assess the critical ones**: security questionnaires, certifications (ISO 27001, SOC 2 reports), and breach history. Proportion the effort to the risk.
- **Contract for security**: breach notification timelines, minimum controls, right to audit, and what happens to your data at the end.
- **Review regularly**, not only at onboarding.

## Technical controls

- **Limit supplier access**: named accounts with MFA, just-in-time access, and session recording for remote support. No shared or always-on vendor accounts.
- **Segment** vendor-managed systems and restrict their outbound connections.
- **Monitor trusted software** too: EDR should alert on unusual behaviour even from signed processes; see [how EDR works](/article/how-edr-actually-works).
- **For software you build**: lock dependency versions, verify signatures and checksums, generate SBOMs, scan dependencies, and protect CI/CD; see [secure SDLC](/article/secure-sdlc-guide).
- **Stage updates** through test rings where practical.

## When a supplier is breached

Disable their access immediately, identify every system they touch, check for indicators the vendor or authorities publish, and follow your incident process.

## FAQ

**Can small organisations do vendor risk management?**
Yes, scaled down: list the ten suppliers with the most access, ask them the key questions, and enforce MFA on their accounts.

## References

- [NIST SP 800-161 Rev. 1: Cybersecurity Supply Chain Risk Management Practices](https://csrc.nist.gov/pubs/sp/800/161/r1/upd1/final)
- [CISA: Information and Communications Technology Supply Chain Risk Management](https://www.cisa.gov/topics/information-communications-technology-supply-chain-security)
