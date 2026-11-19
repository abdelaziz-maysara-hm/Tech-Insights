---
title: Freeing Disk Space on Windows Safely: What You Can Delete and What to Leave
excerpt: Which Windows folders and caches are safe to clear, which ones break things if you touch them, and the built-in tools that do the job without risk.
---

A full system drive slows Windows down, blocks updates and can stop services that need temporary space. The fix is rarely deleting files by hand from `C:\Windows`. Windows has safe cleanup tools; the risk comes from guesswork.

## Safe to clean

- **Temporary files**: `%TEMP%` and `C:\Windows\Temp`. Files in use will refuse to delete; skip them.
- **Windows Update cleanup**: superseded update files, removed through Disk Cleanup or Storage Sense rather than manually.
- **Delivery Optimization files**: cached update pieces shared with other PCs.
- **Recycle Bin and Downloads**: check with the user first; Downloads often holds the only copy of something.
- **Browser caches**: cleared from the browser's own settings.
- **Previous Windows installation** (`Windows.old`) once you're sure you won't roll back a feature update.

## Leave alone

- **`C:\Windows\WinSxS`**: the component store. Deleting from it manually can break updates and features. Use `DISM /Online /Cleanup-Image /StartComponentCleanup` instead.
- **`C:\Windows\Installer`**: needed to repair and uninstall software.
- **`pagefile.sys` and `hiberfil.sys`**: managed by Windows. Disable hibernation with `powercfg /h off` if you don't need it, rather than deleting the file.
- **System32 and driver folders**: nothing to gain, plenty to break.
- **Restore points** on systems where they're your only rollback.

## The right tools

1. **Storage Sense** (Settings > System > Storage) can clean temp files and the Recycle Bin automatically.
2. **Disk Cleanup** (`cleanmgr`), with "Clean up system files", for update leftovers.
3. **DISM component cleanup** for the WinSxS store on servers and long-lived PCs.
4. A disk-usage viewer to find what's actually big; it's often a user's video folder or an old VM, not Windows.

## On servers

Check logs and application data first: IIS logs, SQL backups, and old installers in random folders are common culprits. Rotate logs or move them to a central [syslog server](/article/syslog-server-setup-basics) instead of letting them grow forever.

## FAQ

**Are "PC cleaner" apps worth it?**
Usually not. Built-in tools do the same job, and some cleaners delete things they shouldn't or bundle unwanted software.

**How much free space should a system drive keep?**
Enough for the next feature update and normal temp use; many admins alert below 15 to 20 percent.

## References

- [Clean up the WinSxS folder (Microsoft Learn)](https://learn.microsoft.com/en-us/windows-hardware/manufacture/desktop/clean-up-the-winsxs-folder)
- [Free up drive space in Windows (Microsoft Support)](https://support.microsoft.com/en-us/windows/free-up-drive-space-in-windows-85529ccb-c365-490d-b548-831022bc9b32)
