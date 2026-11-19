---
title: Hyper-V Checkpoints: Useful for Changes, Dangerous as Backups
excerpt: The difference between standard and production checkpoints, why long-lived checkpoints hurt performance and storage, and the rules for using them safely.
---

A Hyper-V checkpoint captures a virtual machine at a point in time so you can return to it. Before a risky update or configuration change, that's very handy. Left in place for weeks or treated as a backup, it causes real problems.

## Standard vs production checkpoints

- **Production checkpoints** (the default since Windows Server 2016) use VSS inside Windows guests, or file system freeze on Linux, for an application-consistent snapshot. Memory state isn't saved, so applying one is like booting after a clean shutdown.
- **Standard checkpoints** save the VM's memory and device state as well. Restoring returns the VM to the exact running moment, which can confuse applications with time-sensitive or replicated data, such as domain controllers and databases.

## What happens on disk

Creating a checkpoint switches the VM to a new **differencing disk (.avhdx)**. Every write after that goes into it, and the chain grows. Consequences of keeping checkpoints too long:

- The differencing disk keeps growing and can fill the volume, which pauses the VM.
- Disk performance degrades as reads traverse the chain.
- Deleting an old checkpoint triggers a merge that can take a long time and load the storage.

## Rules for safe use

1. **Short-lived only**: create before a change, delete once the change is verified, ideally within days.
2. **Not a backup**: checkpoints live on the same storage as the VM. If that storage fails or ransomware encrypts it, both are gone. Use real backups following the [3-2-1 rule](/article/backup-3-2-1-rule-practical).
3. **Prefer production checkpoints** for servers.
4. **Be careful with domain controllers and replicated apps**. Modern AD has protections (VM-Generation ID), but restoring old states of replicated systems still needs care.
5. **Never edit or delete .avhdx files by hand**. Delete checkpoints from Hyper-V Manager or PowerShell (`Remove-VMCheckpoint`) so the merge runs properly.
6. **Monitor for forgotten checkpoints**: `Get-VM | Get-VMCheckpoint` across hosts, reviewed weekly.

## FAQ

**Do backup tools create checkpoints?**
Many do, temporarily, and remove them after the backup. A failed job can leave one behind, so the weekly check catches those too.

**Can I disable checkpoints on a VM?**
Yes, in VM settings. Some teams do this for databases to prevent accidental use.

## References

- [Choose between standard or production checkpoints in Hyper-V (Microsoft Learn)](https://learn.microsoft.com/en-us/windows-server/virtualization/hyper-v/manage/choose-between-standard-or-production-checkpoints-in-hyper-v)
