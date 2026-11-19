---
title: Dark Web Monitoring for Business: What It Tells You and What It Doesn't
excerpt: How credential and data-leak monitoring works, which alerts are worth acting on, the limits of these services, and cheaper options to try first.
---

Dark web monitoring services watch criminal forums, leak sites, paste sites and infostealer log markets for your domains, email addresses and brand. When your company's data shows up, you get an alert. It's useful, but it's often sold as more than it is.

## What it can find

- **Leaked credentials** for your domain from third-party breaches, where staff reused a work email (and maybe a password) on another site.
- **Infostealer logs**: browser-saved passwords and session cookies taken from infected devices, including employees' personal machines used for work. These are the most urgent findings.
- **Data from your own breach** posted on a ransomware group's leak site.
- **Brand abuse**: look-alike domains, fake profiles, sales of access to your network.

## What it can't do

- It sees only what the provider can access. Plenty of trading happens in closed channels.
- It tells you after the fact. It's an early warning of exposure, not prevention.
- Old breach data gets recycled and reposted, so many alerts are duplicates.

## Acting on alerts

| Finding | Response |
|---|---|
| Work email in an old third-party breach | Confirm MFA, check for reuse, educate the user |
| Recent password for a work account | Reset now, revoke sessions, check sign-in logs |
| Infostealer log with session cookies | Treat as an incident: reset passwords, revoke all tokens, investigate the infected device |
| Your data on a leak site | Incident response and legal/notification process |

## Cheaper first steps

- **Have I Been Pwned's domain search** lets verified domain owners see which addresses appear in breaches it indexes.
- **Microsoft Entra ID Protection** (with the right licence) flags leaked credentials it detects for your users.
- **Password managers** often warn about breached passwords.

## Do you need a paid service?

It's worth it if you have a large workforce, valuable brand, or regulatory pressure, and someone to act on alerts. Without a response process it's just noise. Strong basics reduce the impact of anything found: MFA everywhere, no password reuse ([password managers](/article/password-manager-start)), and short session lifetimes.

## FAQ

**Is it legal for providers to buy stolen data?**
Reputable providers collect from public and semi-public sources and avoid paying criminals. Ask any vendor how they collect.

**Can we get leaked data removed?**
Rarely. Assume it's permanent and make it useless: reset, revoke, rotate.

## References

- [Have I Been Pwned: domain search](https://haveibeenpwned.com/DomainSearch)
- [What is risk? Microsoft Entra ID Protection (Microsoft Learn)](https://learn.microsoft.com/en-us/entra/id-protection/concept-identity-protection-risks)
