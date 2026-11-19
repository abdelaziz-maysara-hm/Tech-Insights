---
title: The Windows Security Event IDs a SOC Should Actually Watch
excerpt: A focused set of Windows and domain controller event IDs that expose real attack steps (password spraying, Kerberoasting, privilege changes, new services, log clearing), the audit settings they depend on, and starter detection rules.
---

Windows can log hundreds of event types. Collect everything and your SIEM bill grows while analysts drown; collect too little and the attack leaves no trace. The events below map to steps attackers almost always take: signing in with stolen credentials, gaining privileges, persisting, running tools and covering tracks.

## First, make sure the events exist

Many of these events aren't recorded by default. Configure **Advanced Audit Policy** through Group Policy (account logon, logon/logoff, account management, process creation, policy change and others), based on Microsoft's recommended baselines. Also enable "Include command line in process creation events" and PowerShell script block logging. Otherwise you'll write detections for events that never arrive.

## Sign-ins and authentication

| ID | Meaning | What to look at |
|---|---|---|
| 4624 | Successful logon | Logon type (2 interactive, 3 network, 10 RemoteInteractive/RDP), source host and IP |
| 4625 | Failed logon | Status/sub-status codes; one source failing against many accounts suggests password spraying |
| 4648 | Logon with explicit credentials | `runas`, scripts or lateral-movement tools using alternate credentials |
| 4672 | Special privileges assigned | Privileged sign-ins; admin accounts appearing on ordinary workstations |
| 4740 | Account locked out | Caller Computer Name points to the source of bad attempts |
| 4776 | NTLM credential validation (DC) | Where NTLM is still used, and by whom |

### Kerberos on domain controllers

| ID | Meaning | What to look at |
|---|---|---|
| 4768 | TGT requested | Bursts of failures; accounts without pre-authentication are AS-REP roasting targets |
| 4769 | Service ticket requested | Encryption type 0x17 (RC4) and one account requesting tickets for many services: possible Kerberoasting |
| 4771 | Pre-authentication failed | Failure code 0x18 means a wrong password |

See [Kerberoasting detection and prevention](/article/kerberoasting-detection-prevention) and [how Kerberos works](/article/kerberos-authentication-explained).

## Account and group changes

| ID | Meaning | Why it matters |
|---|---|---|
| 4720 | User account created | Backdoor accounts |
| 4722 | Account enabled | Old disabled accounts brought back |
| 4724 | Password reset attempt | Privileged accounts reset by someone unexpected |
| 4738 | User account changed | Sensitive attributes altered |
| 4728 / 4732 / 4756 | Member added to global / local / universal security group | Domain Admins, Administrators, Enterprise Admins |

## Processes, services and tasks

| ID | Log | Meaning | Why it matters |
|---|---|---|---|
| 4688 | Security | Process created | With command lines, shows exactly what ran |
| 4697 | Security | Service installed | Tools like PsExec install temporary services |
| 7045 | System | New service installed | Logged by default; complements 4697 |
| 4698 | Security | Scheduled task created | Common persistence |
| 4104 | PowerShell/Operational | Script block logged | Reveals obfuscated PowerShell after decoding |

Legitimate task automation is covered in [Task Scheduler automation](/article/windows-task-scheduler-automation).

## Tampering

| ID | Meaning | Why it matters |
|---|---|---|
| 1102 | Security log cleared | Almost never legitimate |
| 4719 | System audit policy changed | Someone reducing what's recorded |

Forward events off the host in near real time; a cleared local log doesn't matter if the SIEM already has the copy.

## Starter detections

1. **Password spraying**: 4625 from one source against 20 or more distinct accounts within 10 minutes.
2. **Privileged group change**: any 4728, 4732 or 4756 touching Domain Admins, Enterprise Admins or DC Administrators.
3. **Log tampering**: any 1102 or 4719.
4. **New service on a server**: 7045 or 4697 outside an approved change window.
5. **Unusual RDP**: 4624 type 10 to a sensitive server from a non-admin workstation.
6. **RC4 tickets for AES-capable service accounts**: 4769 with encryption type 0x17.

## Operational tips

- Enlarge the Security log on busy servers and DCs, or forward events immediately.
- Keep time synchronised; timelines depend on it.
- Correlate rather than alert on single events: failures, then a success, then 4672 tells a story.

For reading events by hand, see [Event Viewer security logs](/article/windows-event-viewer-security-logs); for the wider process, the [SOC and incident response guide](/article/soc-incident-response-guide).

## FAQ

### Why does 4688 have no command line?

Enable process creation auditing and the "Include command line in process creation events" policy.

### Every device, or just domain controllers?

Start with DCs and critical servers. Add endpoints through EDR or Windows Event Forwarding as budget allows.

### Does Sysmon replace these logs?

No. Sysmon adds rich detail such as network connections and image loads, but authentication events on DCs still come from the Security log.

## References

- [Advanced security audit policy settings (Microsoft Learn)](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/advanced-security-audit-policy-settings)
- [Event 4769: A Kerberos service ticket was requested (Microsoft Learn)](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-4769)
- [Events to monitor in Active Directory (Microsoft Learn)](https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/plan/appendix-l--events-to-monitor)
- [Sysmon (Microsoft Sysinternals)](https://learn.microsoft.com/en-us/sysinternals/downloads/sysmon)
