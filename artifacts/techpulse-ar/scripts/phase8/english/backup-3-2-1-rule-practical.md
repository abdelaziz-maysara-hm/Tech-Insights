---
title: The 3-2-1 Backup Rule in Practice: From Slogan to Working Setup
excerpt: Three copies, two media, one offsite, and why ransomware pushed the rule to 3-2-1-1-0. How to apply it to servers, Microsoft 365 and laptops, and how to prove restores work.
---

The 3-2-1 rule is easy to say: **three copies of your data, on two different types of storage, with one copy offsite.** Its strength is that it survives very different failures: a dead disk, a burnt-out server room, an admin's mistake. Here's what it looks like when you actually build it.

## What each number protects against

- **3 copies** (production plus two backups): one backup can fail or be corrupt without leaving you with nothing.
- **2 media types**: a single storage failure, firmware bug or array problem doesn't take out every copy.
- **1 offsite**: fire, flood, theft or building access problems.

## The ransomware update: 3-2-1-1-0

Attackers now look for backups and destroy them before encrypting production. So many vendors and practitioners add:

- **1 copy offline, air-gapped or immutable**: it can't be changed or deleted, even by an admin account, for a set period. See [immutable backups](/article/immutable-backups-ransomware-defense).
- **0 errors**: backups are verified, and restores are tested.

## A practical layout for a small organisation

| Copy | Where | Notes |
|---|---|---|
| Production | Servers, SaaS | |
| Backup 1 | Local backup repository (NAS or backup server) | Fast restores; not domain-joined, separate credentials |
| Backup 2 | Cloud object storage with immutability, or rotated offline disks | Offsite and protected from deletion |

Don't forget data you don't host yourself. Microsoft 365 and Google Workspace keep your data available but aren't designed as a long-term, point-in-time backup of your choosing; many organisations add a third-party backup. Laptops need either synced folders backed up centrally or an endpoint backup tool.

## Protect the backup system itself

- Separate admin accounts with MFA for backup consoles; don't use domain admin.
- Keep the backup server out of the domain, or in a separate management domain.
- Encrypt backups and store the keys somewhere you can reach during a disaster.
- Alert on failed jobs and unexpected deletion or retention changes.

## Test restores

A backup you haven't restored is a hope. Schedule restores of a file, a full VM and an application (such as a database) at least quarterly, and time them. Compare the result with your recovery objectives; see [disaster recovery basics](/article/disaster-recovery-plan-basics).

## FAQ

**Is RAID a backup?**
No. RAID protects against a disk failure, not deletion, corruption or ransomware.

**Is sync (OneDrive, Dropbox) a backup?**
Not on its own. Deletions and encryption sync too, though version history helps.

## References

- [CISA: Ransomware Guide (#StopRansomware)](https://www.cisa.gov/stopransomware/ransomware-guide)
- [NIST SP 800-34 Rev. 1: Contingency Planning Guide for Federal Information Systems](https://csrc.nist.gov/pubs/sp/800/34/r1/upd1/final)
