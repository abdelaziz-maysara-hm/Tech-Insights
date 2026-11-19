---
title: Zero Trust in Plain Terms: The Idea and the First Practical Steps
excerpt: Zero trust means no implicit trust based on network location. Here's what that looks like in practice and where a small or mid-size team should begin.
---

Zero trust gets sold as a product. It isn't one. It's a design principle: **don't grant access because a request comes from "inside" the network; verify every request based on who is asking, from what device, for what resource.**

## Why the old model broke

The traditional model trusted anything on the LAN. Once an attacker got in, through phishing, a stolen VPN password or an infected laptop, they could move sideways with little resistance. Cloud apps and remote work also mean most access no longer comes from "inside" anyway.

## The core ideas

- **Verify explicitly**: authenticate and authorise every access using identity, device health and context.
- **Least privilege**: give only the access needed, for as long as it's needed. See [least privilege in practice](/article/least-privilege-principle-practical).
- **Assume breach**: segment, monitor and limit blast radius as if an attacker is already present.

## Where to start

1. **Strong identity first.** Single sign-on for as many apps as possible, MFA for everyone, and phishing-resistant MFA for admins.
2. **Know your devices.** Only managed, patched, encrypted devices get access to sensitive apps. Conditional access policies can enforce this.
3. **Replace flat network access.** Instead of a VPN that drops users onto the whole LAN, publish specific apps through an identity-aware proxy or ZTNA. If a VPN remains, restrict what each group can reach.
4. **Segment the network.** Separate servers, users, management interfaces and IoT; see [VLAN basics](/article/vlan-basics-why-segment).
5. **Log and review.** Send authentication and access logs to a central place, and alert on anomalies.

## Common mistakes

- Buying a "zero trust" product and calling it done.
- Leaving legacy exceptions (service accounts without MFA, old protocols) that become the way in.
- Making the policy so strict that people find workarounds. Usability is part of security.

## FAQ

**Does zero trust mean we don't trust employees?**
No. It means trust is based on verified signals for each request rather than network location. Employees usually see fewer VPN prompts, not more friction.

**Is it only for large enterprises?**
The principles scale down well. A small team with SSO, MFA, managed devices and basic segmentation is already most of the way there.

## References

- [NIST SP 800-207: Zero Trust Architecture](https://csrc.nist.gov/pubs/sp/800/207/final)
- [CISA Zero Trust Maturity Model](https://www.cisa.gov/zero-trust-maturity-model)
