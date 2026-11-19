---
title: PowerShell for Sysadmins: From First Commands to Reliable Automation
excerpt: The core ideas that make PowerShell different (cmdlets, objects, the pipeline), everyday commands for services, processes, files and AD, a first real script with logging and error handling, and the mistakes to avoid.
---

PowerShell isn't just a newer command prompt. It works with **objects** instead of text, which means you can filter, sort and export results without parsing strings. Once that clicks, routine admin work becomes a few lines you can reuse.

## Core ideas

- **Cmdlets** follow a `Verb-Noun` pattern: `Get-Service`, `Restart-Computer`, `New-ADUser`. `Get-Command *service*` finds commands; `Get-Help Get-Service -Examples` shows usage.
- **Objects and the pipeline**: `Get-Service | Where-Object Status -eq 'Stopped'` passes service objects, not text, so you filter on real properties. `Get-Member` shows what properties an object has.
- **Variables** start with `$`: `$svc = Get-Service Spooler`.
- **Windows PowerShell 5.1 vs PowerShell 7**: 5.1 ships with Windows; PowerShell 7 is cross-platform and installs side by side (`pwsh`). Most admin modules work in both.

## Everyday commands

```powershell
# Services
Get-Service | Where-Object { $_.StartType -eq 'Automatic' -and $_.Status -ne 'Running' }
Restart-Service Spooler

# Processes using the most memory
Get-Process | Sort-Object WorkingSet64 -Descending | Select-Object -First 10 Name, Id, WorkingSet64

# Disk space on remote servers
Invoke-Command -ComputerName srv01, srv02 { Get-PSDrive -PSProvider FileSystem }

# Files older than 30 days in a log folder (preview first)
Get-ChildItem D:\Logs -File | Where-Object LastWriteTime -lt (Get-Date).AddDays(-30) | Remove-Item -WhatIf
```

For Active Directory work, see [everyday AD commands](/article/ad-powershell-daily-tasks).

## A first real script

```powershell
[CmdletBinding()]
param([string[]]$Servers = @('srv01','srv02'), [int]$MinFreeGB = 20)

$log = "C:\Scripts\Logs\diskcheck-$(Get-Date -Format yyyyMMdd).log"
foreach ($s in $Servers) {
    try {
        $disks = Get-CimInstance Win32_LogicalDisk -ComputerName $s -Filter "DriveType=3" -ErrorAction Stop
        foreach ($d in $disks) {
            $free = [math]::Round($d.FreeSpace / 1GB, 1)
            if ($free -lt $MinFreeGB) { "$(Get-Date -f s) WARN $s $($d.DeviceID) $free GB free" | Add-Content $log }
        }
    } catch {
        "$(Get-Date -f s) ERROR $s $($_.Exception.Message)" | Add-Content $log
    }
}
```

It takes parameters, handles errors per server, and logs results. Schedule it with [Task Scheduler](/article/windows-task-scheduler-automation).

## Mistakes to avoid

1. **Confusing `-eq` and `-like`**: `-eq` is exact; `-like 'web*'` uses wildcards; `-match` uses regex.
2. **Skipping `-WhatIf`** on commands that delete or change things.
3. **Setting the execution policy to Unrestricted** everywhere. Use `RemoteSigned` or signed scripts. The execution policy isn't a security boundary, but it prevents accidents.
4. **No error handling**: many cmdlets write non-terminating errors; add `-ErrorAction Stop` inside `try/catch`.
5. **Filtering late**: use `-Filter` parameters on the source instead of pulling everything and piping to `Where-Object`.
6. **Hard-coding credentials** in scripts. Use `Get-Credential`, gMSAs or the SecretManagement module.

## Security notes

Enable PowerShell script block logging and transcription on servers; attackers use PowerShell too, and these logs are invaluable for investigations.

## FAQ

**Do I need to learn programming first?**
No. Start with one-liners for tasks you already do, then combine them into scripts.

## References

- [PowerShell documentation (Microsoft Learn)](https://learn.microsoft.com/en-us/powershell/)
- [about_Execution_Policies (Microsoft Learn)](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_execution_policies)
- [about_Logging_Windows (Microsoft Learn)](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_logging_windows)
