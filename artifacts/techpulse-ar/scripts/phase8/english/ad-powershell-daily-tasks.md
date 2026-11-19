---
title: Everyday Active Directory Work in PowerShell: Commands Worth Keeping
excerpt: Tested ActiveDirectory module one-liners for the jobs that fill a sysadmin's week: finding and unlocking users, resetting passwords, group membership, stale accounts and quick reports.
---

The ActiveDirectory PowerShell module turns repetitive console clicking into commands you can repeat, review and script. Install it with RSAT on a management workstation (`Add-WindowsCapability -Online -Name Rsat.ActiveDirectory.DS-LDS.Tools~~~~0.0.1.0`) or use it on a server with the AD DS tools feature, then `Import-Module ActiveDirectory`.

Run these from an admin workstation with an account that has only the rights it needs, not from a domain controller session with Domain Admin.

## Finding users

```powershell
# One user with the properties you usually need
Get-ADUser jsmith -Properties Department, LastLogonDate, LockedOut, PasswordLastSet

# Search by display name
Get-ADUser -Filter "Name -like '*Ahmed*'" | Select-Object Name, SamAccountName, Enabled
```

## Locked accounts and password resets

```powershell
# Who is locked out right now?
Search-ADAccount -LockedOut | Select-Object Name, SamAccountName

# Unlock
Unlock-ADAccount -Identity jsmith

# Reset and force a change at next sign-in
Set-ADAccountPassword -Identity jsmith -Reset -NewPassword (Read-Host -AsSecureString "New password")
Set-ADUser -Identity jsmith -ChangePasswordAtLogon $true
```

If the same account keeps locking, find the source in the domain controller security log (event 4740) rather than unlocking repeatedly. See [key Windows security event IDs](/article/windows-security-event-ids-soc).

## Groups

```powershell
Get-ADGroupMember "VPN-Users" | Select-Object Name, SamAccountName
Add-ADGroupMember -Identity "VPN-Users" -Members jsmith
Remove-ADGroupMember -Identity "VPN-Users" -Members jsmith -Confirm:$false

# Which groups is a user in?
Get-ADPrincipalGroupMembership jsmith | Select-Object Name
```

Review privileged group membership regularly: `Get-ADGroupMember "Domain Admins" -Recursive`.

## Stale accounts

```powershell
# Users not signed in for 90 days
Search-ADAccount -AccountInactive -TimeSpan 90.00:00:00 -UsersOnly |
  Where-Object Enabled | Select-Object Name, LastLogonDate

# Computers not seen for 90 days
Search-ADAccount -AccountInactive -TimeSpan 90.00:00:00 -ComputersOnly
```

`LastLogonDate` comes from a replicated attribute that can lag by up to about two weeks, so it's fine for stale-account cleanup but not for exact timelines. Disable first, move to a "Disabled" OU, and delete after a waiting period.

## Quick reports

```powershell
# Accounts with passwords set to never expire
Get-ADUser -Filter 'PasswordNeverExpires -eq $true -and Enabled -eq $true' | Select-Object Name

# Export users from an OU to CSV
Get-ADUser -SearchBase "OU=Staff,DC=corp,DC=local" -Filter * -Properties Department, Title |
  Select-Object Name, SamAccountName, Department, Title |
  Export-Csv .\staff.csv -NoTypeInformation -Encoding UTF8
```

## Safe habits

- Test destructive commands with `-WhatIf` first.
- Filter on the server side with `-Filter` instead of piping everything to `Where-Object`.
- Log what scripts change. For a broader path, see [PowerShell for system administrators](/article/powershell-sysadmin-complete-guide).

## FAQ

**Do I need to run these on a domain controller?**
No. RSAT on a management workstation is the better practice.

**Why does `Get-ADUser` not show a property I need?**
Only default properties are returned. Add it with `-Properties`.

## References

- [ActiveDirectory module reference (Microsoft Learn)](https://learn.microsoft.com/en-us/powershell/module/activedirectory/)
