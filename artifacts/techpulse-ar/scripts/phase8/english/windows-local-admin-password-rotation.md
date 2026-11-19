---
title: Windows LAPS: Unique, Rotating Local Admin Passwords on Every Machine
excerpt: Why one shared local admin password lets attackers hop across a whole fleet, how Windows LAPS fixes it with per-device rotated passwords stored in AD or Entra ID, and how to deploy it safely.
---

Many fleets were built from one image, which means the built-in local Administrator account has the same password on every PC. An attacker who extracts that password, or its hash, from one compromised laptop can log into all of them. This is the classic pass-the-hash lateral movement path.

## What Windows LAPS does

Windows Local Administrator Password Solution gives each device a **unique, random local admin password**, rotates it automatically, and stores it securely in **Active Directory or Microsoft Entra ID**. Authorised admins retrieve it when needed; after use, it can rotate again.

Windows LAPS is built into Windows 10, Windows 11 and Windows Server 2019 and later (with the April 2023 updates). It replaces the older "legacy" Microsoft LAPS, which needed a separate install.

## Key capabilities

- Password backup to Entra ID (cloud or hybrid joined devices) or to AD.
- **Encrypted password storage** in AD (Windows Server 2016 domain functional level or higher), readable only by specified groups.
- **Password history** in AD.
- **Post-authentication actions**: after someone uses the password, rotate it and optionally log off or reboot.
- **DSRM password backup** for domain controllers.

## Deploying it

1. **Update AD schema** (for AD backup): `Update-LapsADSchema`.
2. **Grant devices permission** to write their passwords: `Set-LapsADComputerSelfPermission -Identity "OU=Workstations,DC=corp,DC=local"`.
3. **Configure policy** with Group Policy (`Computer Configuration > Administrative Templates > System > LAPS`) or an Intune account-protection policy: backup directory, password length and complexity, age (for example 30 days), post-authentication actions.
4. **Control who can read passwords**: use `Set-LapsADReadPasswordPermission` for a dedicated helpdesk group, and enable encryption with an authorised decryptor group. In Entra ID, use roles with the right permissions.
5. **Retrieve a password** with `Get-LapsADPassword -Identity PC01 -AsPlainText` or in the Entra/Intune portal.

## Common mistakes

- **Too many readers**: if every IT account can read every password, a single compromised helpdesk account exposes all machines. Scope by OU and role.
- **Forgetting other local admin accounts**: LAPS manages one account. Remove or disable other shared local admin accounts.
- **Leaving legacy LAPS and Windows LAPS fighting** over the same account. Migrate cleanly.
- **Not auditing retrieval**: enable auditing so password reads are logged.

## FAQ

**Does LAPS replace removing local admin from users?**
No. It protects the built-in admin account. Users still shouldn't have admin rights day to day; see [least privilege](/article/least-privilege-principle-practical).

## References

- [Windows LAPS overview (Microsoft Learn)](https://learn.microsoft.com/en-us/windows-server/identity/laps/laps-overview)
- [Get started with Windows LAPS and Active Directory (Microsoft Learn)](https://learn.microsoft.com/en-us/windows-server/identity/laps/laps-scenarios-windows-server-active-directory)
