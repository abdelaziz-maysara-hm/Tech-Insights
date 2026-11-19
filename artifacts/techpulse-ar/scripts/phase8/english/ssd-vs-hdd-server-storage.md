---
title: SSD or HDD in the Server Room: Choosing by Workload, Not Just Speed
excerpt: Where SSDs earn their price (databases, VMs, boot), where HDDs still win (capacity, backups, archives), and the endurance, RAID and data-destruction details that matter in servers.
---

For laptops, the SSD question is settled. For servers, it's a cost-per-workload decision. Flash wins on latency and random I/O; spinning disks still win on cost per terabyte for large sequential data.

## Where SSDs belong

- **Databases and virtualisation hosts**: lots of small random reads and writes, where IOPS and latency matter far more than capacity.
- **Boot and OS volumes**: faster patching and restarts.
- **VDI and RDS**: boot storms and many users at once.
- **Cache and tiering layers** in front of HDD capacity.

NVMe drives connect over PCIe and remove the SATA/SAS interface limits, so they fit the most latency-sensitive workloads.

## Where HDDs still make sense

- **Backup repositories** and archives: large sequential writes, capacity first.
- **File shares** with mostly cold data.
- **Surveillance video** and log archives.

## Server-specific factors

- **Endurance**: SSDs are rated in TBW or drive writes per day (DWPD). Read-intensive drives (around 1 DWPD) suit most servers; write-heavy databases and caches may need mixed-use or write-intensive models.
- **Enterprise features**: power-loss protection (capacitors that flush cached writes), consistent latency under load, and vendor support. Consumer SSDs in servers are a false economy.
- **RAID**: rebuilds on large HDDs take a long time, and during that window a second failure can lose the array. Prefer RAID 6 or RAID 10 for big disks. RAID is still not a backup; see the [3-2-1 rule](/article/backup-3-2-1-rule-practical).
- **Monitoring**: watch SMART data and SSD wear indicators so you replace drives before they fail.
- **Secure disposal**: overwriting doesn't reliably clear SSDs because of wear levelling. Use the drive's cryptographic or sanitize erase, or physical destruction, following NIST SP 800-88. Encrypting drives from the start (for example with [BitLocker](/article/bitlocker-disk-encryption-basics) or self-encrypting drives) makes disposal much easier.

## A typical mix

NVMe or SAS SSD for hypervisor datastores and databases, large HDDs in RAID 6 for the backup repository, plus offsite or cloud copies. Hyperconverged and storage arrays often combine both automatically with tiering.

## FAQ

**Are SSDs less reliable than HDDs?**
Modern enterprise SSDs have failure rates comparable to or better than HDDs, but they fail differently, sometimes suddenly. Monitoring and redundancy apply to both.

## References

- [NIST SP 800-88 Rev. 2: Guidelines for Media Sanitization](https://csrc.nist.gov/pubs/sp/800/88/r2/final)
