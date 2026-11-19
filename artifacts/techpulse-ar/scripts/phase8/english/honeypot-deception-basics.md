---
title: Honeypots and Deception: Catching Intruders with Bait They Can't Resist
excerpt: How honeypots, honey accounts and honeytokens produce high-confidence alerts, low versus high interaction options, cheap ways to start, and the isolation rules that keep bait from becoming a risk.
---

Most security alerts are probabilistic: maybe malicious, maybe a user doing something odd. Deception flips this. You create something that no legitimate person or process should ever touch. When it's touched, you know something is wrong.

## Why deception works

- **Very low false positives**: there's no business reason to log into a decoy server or use a fake admin account.
- **Catches attackers mid-reconnaissance**: intruders who have just landed on a network explore it, enumerate accounts and try credentials. Decoys sit right in that path.
- **Cheap**: some forms cost nothing but a little configuration.

## Types of deception

- **Honeypot systems**: decoy servers or services (a fake file server, an exposed-looking RDP host, a fake SQL server).
  - *Low interaction*: emulates a service's login prompt and logs attempts. Safe and easy.
  - *High interaction*: a real system attackers can actually use, giving rich intelligence but needing careful containment.
- **Honey accounts**: AD users that look attractive (`svc-backup-admin`) but are never used. Any authentication attempt is an alert.
- **Honeytokens**: fake credentials, API keys, documents or DNS names planted where attackers look. Free services such as Canarytokens generate tokens that alert when used or opened.

## Starting cheaply

1. **Create a decoy account** with a tempting name and description, a long random password, no real privileges, and no legitimate use. Alert on any logon attempt (event IDs 4624, 4625, 4768, 4771 for that account) in your SIEM. Giving it a service principal name also makes it a Kerberoasting tripwire; see [Kerberoasting detection](/article/kerberoasting-detection-prevention).
2. **Plant honeytokens**: a fake `passwords.xlsx` on a file share, fake AWS keys in an old script, each wired to alert.
3. **Run a low-interaction honeypot** on an unused internal IP, such as OpenCanary, emulating SMB, RDP or SSH, sending alerts to your SOC.

## Isolation rules

- Decoys must not be usable as a stepping stone: no real credentials, no trust relationships, restricted outbound traffic.
- High-interaction honeypots belong in a tightly segmented network with full monitoring.
- Internet-facing research honeypots attract constant attack traffic; that's a different project from internal detection.
- Document decoys so your own team doesn't trigger or remove them.

## FAQ

**Is deception legal?**
Internal decoys on your own network are standard defensive practice. Check with legal before high-interaction or internet-facing honeypots that collect attacker data.

## References

- [MITRE Engage: adversary engagement framework](https://engage.mitre.org/)
- [Canarytokens documentation (Thinkst)](https://docs.canarytokens.org/guide/)
