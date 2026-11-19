---
title: Group Policy That Behaves: Linking, Precedence and Troubleshooting
excerpt: How GPOs apply (LSDOU order, inheritance, enforcement, security filtering), design habits that keep policy readable, and the tools to find out why a setting didn't apply.
---

Group Policy is the backbone of Windows configuration in an AD domain, and also a common source of "why is this setting here?" Most confusion comes from not knowing the order in which policies apply and which one wins.

## The processing order: LSDOU

GPOs apply in this order, and **later wins** when two set the same thing:

1. **Local** policy on the machine
2. **Site**
3. **Domain**
4. **OU**, from the parent OU down to the OU holding the object

Within one container, link order matters: link order 1 has the highest precedence.

## Changing the default flow

- **Block Inheritance** on an OU stops GPOs from parent containers from applying.
- **Enforced** on a link overrides Block Inheritance, and an enforced GPO wins over conflicting settings lower down.
- **Security filtering** limits a GPO to specific users, computers or groups (by default, Authenticated Users). If you remove Authenticated Users, keep read access for Domain Computers, or the GPO may not be read at all.
- **WMI filters** apply a GPO only where a query matches, such as an OS version. They're powerful but slow logons if overused.
- **Loopback processing** applies user settings based on the computer's OU. It's useful for kiosks and RDS hosts.

Use enforcement and blocking sparingly. Each one makes the result harder to predict.

## Design habits

- **One purpose per GPO**, with a clear name such as `SEC - Workstation - Defender Baseline`.
- **Separate user and computer settings**, and disable the unused half of a GPO.
- **Don't edit the Default Domain Policy** beyond password, lockout and Kerberos settings; create new GPOs instead.
- **Test in a pilot OU** before linking widely.
- **Back up GPOs** (`Backup-GPO -All -Path`) before significant changes, and document changes.
- Start from security baselines such as the Microsoft Security Compliance Toolkit rather than building from scratch.

## Troubleshooting

- `gpupdate /force` refreshes policy; some settings still need a logoff or restart.
- `gpresult /r` shows which GPOs applied and which were filtered out. `gpresult /h report.html` gives the full picture.
- **Group Policy Results** and **Group Policy Modeling** in GPMC show applied versus planned results remotely.
- The **GroupPolicy operational log** in Event Viewer records processing errors, slow links and failed client-side extensions.
- If nothing applies, check DNS (clients must find a DC), SYSVOL replication, and the GPO's security filtering.

For quick account tasks without the GUI, see [Active Directory tasks in PowerShell](/article/ad-powershell-daily-tasks).

## FAQ

**How often does policy refresh?**
About every 90 minutes with a random offset on members, and every 5 minutes on domain controllers.

**Can Group Policy manage Entra-joined devices?**
No. Cloud-only devices are managed with Intune configuration profiles.

## References

- [Group Policy overview (Microsoft Learn)](https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/manage/group-policy/group-policy-overview)
- [Microsoft Security Compliance Toolkit (Microsoft Learn)](https://learn.microsoft.com/en-us/windows/security/operating-system-security/device-management/windows-security-configuration-framework/security-compliance-toolkit-10)
