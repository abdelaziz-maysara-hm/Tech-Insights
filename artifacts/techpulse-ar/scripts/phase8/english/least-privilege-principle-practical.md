---
title: Least Privilege in Practice: Cutting Access Without Breaking the Business
excerpt: Why excess rights turn small incidents into big ones, and a staged approach: admin accounts first, then groups, service accounts and regular access reviews.
---

Least privilege means every user, service and system gets only the access it needs to do its job, and nothing more. It's simple to state and hard to retrofit, because years of "just give them admin" pile up. Done in stages, it doesn't have to cause chaos.

## Why it matters

When an account is compromised, the attacker inherits its rights. A phished user with local admin can install tools and dump credentials. A phished Domain Admin can end the company. Least privilege limits the blast radius of every mistake and every breach.

## Stage 1: Admin accounts

- **Separate accounts**: admins use a normal account for email and browsing, and a separate admin account only for admin work.
- **Shrink privileged groups**: list members of Domain Admins, Enterprise Admins, global administrators in Entra ID, and firewall superusers. Most organisations can remove the majority.
- **Tiering**: accounts that administer domain controllers never sign into workstations.
- **Just-in-time access** where possible, such as Entra Privileged Identity Management, so admin rights are activated for a few hours with approval rather than held permanently.

## Stage 2: Local admin on endpoints

Remove local admin from standard users. Handle the real needs with software deployment, a self-service portal, or an elevation tool. Rotate the built-in admin password per machine with [Windows LAPS](/article/windows-local-admin-password-rotation).

## Stage 3: Role-based groups

Grant access to shares, apps and systems through groups that represent roles (`Finance-Read`, `Finance-Approvers`), never to individual users directly. New starters get the role group, leavers lose everything at once, and audits become readable.

## Stage 4: Service accounts

Service accounts often have powerful rights and old passwords. Use group managed service accounts (gMSA) where supported, give each service its own account, deny interactive logon, and remove rights they don't use.

## Stage 5: Keep it that way

- **Access reviews** every quarter or half-year: managers confirm what their people still need.
- **Joiner-mover-leaver process** tied to HR, so movers don't accumulate rights.
- **Monitoring** for additions to privileged groups (event IDs 4728, 4732, 4756).

## Avoiding chaos

Communicate before removing rights, start with a pilot team, keep a fast path to restore genuinely needed access, and track exceptions with an owner and expiry date.

## FAQ

**Isn't this just zero trust?**
It's one of its core principles. See [zero trust in plain terms](/article/zero-trust-explained-practically).

## References

- [Securing privileged access (Microsoft Learn)](https://learn.microsoft.com/en-us/security/privileged-access-workstations/overview)
- [NIST SP 800-53 Rev. 5, AC-6 Least Privilege](https://csrc.nist.gov/pubs/sp/800/53/r5/upd1/final)
