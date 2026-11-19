---
title: Cloud or On-Prem Backup? The Questions That Matter More Than Price
excerpt: Comparing cloud and on-premises backup on restore speed, bandwidth, ransomware resilience, sovereignty and operations, and why most organisations end up with a hybrid.
---

Backup decisions often start with a storage price per terabyte and stop there. The better question is: **when something goes wrong, how fast can we get back, and what could stop us?** Cloud and on-prem backup answer that differently.

## Restore speed

- **On-prem** repositories restore at LAN speed. Bringing back a 5 TB file server can take hours.
- **Cloud** restores are limited by your internet link. The same 5 TB over a 500 Mbps line takes most of a day even at full speed, and egress fees may apply. Some providers offer restore to cloud VMs or shipped disks for large recoveries.

Check both against your recovery time objectives; see [disaster recovery basics](/article/disaster-recovery-plan-basics).

## Bandwidth and the first backup

The initial full copy to the cloud can take weeks on a slow link. Seeding (shipping a disk) helps. After that, incremental-forever and deduplication keep daily uploads manageable.

## Ransomware resilience

- Cloud object storage with **immutability (object lock)** gives an offsite copy that even a compromised admin account can't delete during the lock period.
- On-prem can do the same with hardened Linux repositories, immutable appliances or tape, but it needs deliberate design. A NAS joined to the domain is easy for attackers to wipe.

See [immutable backups](/article/immutable-backups-ransomware-defense).

## Sovereignty and compliance

Where the data physically lives matters for some regulations and contracts. Confirm the provider's region, who holds the encryption keys, and the terms for law-enforcement access.

## Operations and cost

- **On-prem**: hardware purchase and refresh, power, space, and staff time to patch and monitor.
- **Cloud**: predictable subscription, but watch storage growth, API, retrieval and egress charges, and the cost of long retention.

## Why hybrid wins

Most organisations keep a **local copy for fast everyday restores** and an **immutable cloud copy for disasters**, which also satisfies the [3-2-1 rule](/article/backup-3-2-1-rule-practical). SaaS data (Microsoft 365, Google Workspace) is usually best backed up by a cloud service directly.

## FAQ

**Is cloud backup secure?**
It can be very secure with encryption, MFA on the console and immutability. Misconfigured access is the bigger risk than the cloud itself.

**What about tape?**
Still a cheap, genuinely offline option for long retention, if you can manage rotation and testing.

## References

- [CISA #StopRansomware Guide](https://www.cisa.gov/stopransomware/ransomware-guide)
- [Amazon S3 Object Lock (AWS documentation)](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lock.html)
