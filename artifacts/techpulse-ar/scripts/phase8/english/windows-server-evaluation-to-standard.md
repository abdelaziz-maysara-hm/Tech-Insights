---
title: Moving Windows Server from Evaluation to a Licensed Edition In Place
excerpt: How to check whether a server is running an evaluation build, convert it to Standard or Datacenter with DISM and a valid key, and the limits that stop the conversion.
---

Evaluation editions of Windows Server are full-featured but time-limited. When the evaluation period ends, the server warns constantly and shuts down every hour. If a "temporary" lab server has quietly become production, you can usually convert it in place rather than reinstalling.

## Check what you're running

From an elevated prompt:

```
DISM /Online /Get-CurrentEdition
DISM /Online /Get-TargetEditions
```

An evaluation install reports an edition such as `ServerStandardEval` or `ServerDatacenterEval`. The second command lists the editions you can convert to. `slmgr /dlv` shows the licence status and remaining time.

## Convert

You need a valid product key for the target edition: a retail key, a volume licence key from your agreement, or the publicly documented KMS client setup key if your organisation activates through KMS.

```
DISM /Online /Set-Edition:ServerStandard /ProductKey:XXXXX-XXXXX-XXXXX-XXXXX-XXXXX /AcceptEula
```

Use `ServerDatacenter` for Datacenter. The server restarts (sometimes more than once). Afterwards, check with `DISM /Online /Get-CurrentEdition` and activate if it didn't happen automatically: `slmgr /ato`.

## Limits and gotchas

- **Domain controllers can't be converted.** Microsoft's guidance is to install a new domain controller on a retail edition, move any FSMO roles to it, then remove AD DS from the evaluation server.
- **Evaluation to Standard or Datacenter only.** You can't move from evaluation to a lower edition, and Server Core versus Desktop Experience is decided at install time; conversion doesn't change it.
- **Keys must match the version.** A Windows Server 2022 key won't convert a 2025 evaluation.
- **Licensing is separate from activation.** Standard and Datacenter are licensed per physical core, and you need the right number of core licences and CALs regardless of what the key accepts.

## Before you start

1. Take a backup or a checkpoint (and delete the checkpoint after; see [Hyper-V checkpoints](/article/hyper-v-vs-checkpoints-basics)).
2. Schedule a maintenance window for the restarts.
3. Record the change in your change log; see [IT change management](/article/it-change-management-process-basics).

## FAQ

**Can I extend the evaluation instead?**
`slmgr /rearm` can reset the evaluation clock a limited number of times. It's a stopgap, not a licence.

**Will roles and data survive?**
Yes. The conversion changes the edition in place and keeps installed roles, applications and data.

## References

- [Upgrade and conversion options for Windows Server (Microsoft Learn)](https://learn.microsoft.com/en-us/windows-server/get-started/upgrade-conversion-options)
- [KMS client activation and product keys (Microsoft Learn)](https://learn.microsoft.com/en-us/windows-server/get-started/kms-client-activation-keys)
