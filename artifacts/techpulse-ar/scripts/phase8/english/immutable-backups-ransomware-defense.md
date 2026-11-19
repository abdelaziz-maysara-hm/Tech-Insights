---
title: Immutable Backups: Making Sure Ransomware Can't Delete Your Way Back
excerpt: Why attackers target backups first, how immutability works (object lock, WORM, hardened repositories), choosing retention, the compliance-versus-governance trade-off, and testing restores.
---

Modern ransomware crews don't just encrypt servers. They spend days inside the network finding backup consoles, deleting restore points, shortening retention and encrypting backup repositories, so the victim has no choice but to pay. Immutable backups exist to make that step fail.

## What immutable means

An immutable backup **cannot be modified or deleted until a set retention period expires**, by anyone, including administrators and including an attacker who has stolen administrator credentials. Ordinary permissions aren't enough, because those are exactly what attackers steal.

## How it's implemented

- **Object lock on cloud storage**: Amazon S3 Object Lock, Azure immutable blob storage, Google Cloud bucket lock and S3-compatible services apply retention per object.
  - *Compliance mode*: nobody, including the account root, can shorten retention or delete. The strongest protection.
  - *Governance mode*: users with a special permission can override. Easier to manage, weaker if those permissions are compromised.
- **Hardened Linux repositories** used by backup software, with immutability flags and no SSH or admin credentials stored in the backup server.
- **Purpose-built backup appliances** with WORM (write once, read many) storage and their own retention locks.
- **Offline media**: tape or removable disks taken offline, immutable by physical separation.

## Choosing the lock period

Attackers often sit in networks for weeks before encrypting. Retention should cover that dwell time with margin. Many organisations lock 14 to 30 days of restore points, and keep longer retention for monthly copies. Remember that locked storage can't be cleaned up early, so plan capacity and cost.

## Protect the rest of the backup system

Immutability protects the data, not the ability to restore it:

- Separate, MFA-protected accounts for backup administration, not domain accounts.
- Backup servers outside the production domain.
- Encryption keys and console credentials stored where you can reach them during an incident.
- Alerts on retention changes, deleted jobs and failed backups.
- Multi-person authorisation for destructive actions where supported; see [dual control](/article/dual-control-critical-operations).

## Test restores

Restore from the immutable copy on a schedule: individual files, whole VMs, and an application end to end. Time it against your recovery objectives; see [disaster recovery planning](/article/disaster-recovery-plan-basics). Also scan restored data, since backups may contain dormant malware from before the attack.

Immutability is the "1" in the modern 3-2-1-1-0 approach; see [the 3-2-1 backup rule](/article/backup-3-2-1-rule-practical).

## FAQ

**Is immutability the same as an air gap?**
Not exactly. Immutable storage may be online but undeletable; an air gap is physically or logically disconnected. Both serve the same goal.

## References

- [Amazon S3 Object Lock (AWS documentation)](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lock.html)
- [Immutable storage for Azure Blob Storage (Microsoft Learn)](https://learn.microsoft.com/en-us/azure/storage/blobs/immutable-storage-overview)
- [CISA #StopRansomware Guide](https://www.cisa.gov/stopransomware/ransomware-guide)
