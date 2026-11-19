---
title: Automating Admin Work with Windows Task Scheduler (Securely)
excerpt: Building reliable scheduled tasks for scripts and maintenance: triggers, run-as accounts, gMSAs, PowerShell creation, logging, and why attackers also love scheduled tasks.
---

Task Scheduler runs scripts and programs on a schedule or when something happens: at startup, at logon, on an event log entry. For sysadmins it's the simplest automation engine already on every Windows machine.

## Common uses

- Nightly scripts: reports, cleanup, exports.
- Running a PowerShell health check every hour.
- Reacting to an event, for example sending an alert when a specific event ID appears.
- Maintenance at startup or on idle.

## Building a reliable task

- **Trigger**: schedule, startup, logon, or **On an event** (log, source, event ID).
- **Action**: for PowerShell, run `powershell.exe` (or `pwsh.exe`) with `-NoProfile -ExecutionPolicy Bypass -File "C:\Scripts\task.ps1"`. Use full paths everywhere.
- **Run whether user is logged on or not**, so it works on servers.
- **Settings**: stop if it runs longer than expected, don't start a new instance if one is running, retry on failure.

Creating it in PowerShell makes it repeatable:

```powershell
$action  = New-ScheduledTaskAction -Execute "powershell.exe" -Argument '-NoProfile -File "C:\Scripts\report.ps1"'
$trigger = New-ScheduledTaskTrigger -Daily -At 2am
Register-ScheduledTask -TaskName "Nightly report" -Action $action -Trigger $trigger -User "CORP\svc-report$" -LogonType Password
```

## Run-as accounts

- Avoid running tasks as Domain Admin or a person's account.
- **Group managed service accounts (gMSA)** are ideal: AD manages and rotates the password, and you register the task with the gMSA (the `$` suffix) and `-LogonType Password`.
- **SYSTEM** is very powerful locally; use it only when needed, and never for tasks that run scripts users can edit.

## Secure the scripts

- Store scripts in folders only admins can write to. A task that runs a user-writable script as SYSTEM is a privilege escalation waiting to happen.
- Log output to a file or the event log, and alert on failure.

## The attacker's view

Scheduled tasks are a favourite persistence technique (MITRE ATT&CK T1053.005). Monitor task creation (security event 4698, when "Audit Other Object Access Events" is enabled, and the TaskScheduler operational log) and review tasks on servers periodically. See [Windows security event IDs](/article/windows-security-event-ids-soc).

## FAQ

**Why does my task work manually but not on schedule?**
Usually relative paths, a missing "run whether logged on" setting, or the run-as account lacking rights. Check the task's History tab.

## References

- [Register-ScheduledTask (Microsoft Learn)](https://learn.microsoft.com/en-us/powershell/module/scheduledtasks/register-scheduledtask)
- [MITRE ATT&CK T1053.005: Scheduled Task](https://attack.mitre.org/techniques/T1053/005/)
