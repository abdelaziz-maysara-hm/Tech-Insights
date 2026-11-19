---
title: Building an Active Directory Domain from Scratch: Install, Structure, Secure
excerpt: A step-by-step path for a new AD DS domain: planning names and DNS, installing and promoting domain controllers, designing OUs, first Group Policies, day-one security settings and fixes for the classic errors.
---

Active Directory Domain Services is still the identity backbone for most Windows networks: user and computer accounts, authentication, Group Policy and DNS for the domain. Getting the foundations right on day one saves years of workarounds.

## Plan before you click

- **Domain name**: use a subdomain of a domain you own, such as `corp.example.com` or `ad.example.com`. Avoid `.local` and never use a domain you don't control.
- **At least two domain controllers** for redundancy, ideally on different hosts.
- **Static IP addresses** for DCs, and a plan for DNS: DCs normally run DNS for the domain.
- **Supported OS**: a current Windows Server release, fully patched, and Server Core where your team can manage it; see [Server Core vs Desktop Experience](/article/windows-server-core-vs-desktop-experience).
- **Time**: the PDC emulator should sync from a reliable NTP source; Kerberos tolerates only a few minutes of clock skew.

## Install and promote

```powershell
Install-WindowsFeature AD-Domain-Services -IncludeManagementTools

# First DC in a new forest
Install-ADDSForest -DomainName "corp.example.com" -DomainNetbiosName "CORP" -InstallDns
```

You'll be asked for the Directory Services Restore Mode (DSRM) password; store it in your password vault. For the second DC, join the server to the domain and run `Install-ADDSDomainController -DomainName "corp.example.com" -InstallDns`.

## Verify

- `dcdiag /v` for DC health.
- `repadmin /replsummary` once you have two DCs.
- Check that DNS has the domain's SRV records (`_ldap._tcp.dc._msdcs.<domain>`).
- Point every DC's DNS client at another DC first and itself second; point clients only at DCs, never at public DNS.

## Design the OU structure for administration

Organise OUs by **how you manage and apply policy**, not by the org chart. A simple starting point:

```
CORP
├── Admin (admin accounts, groups, PAWs)
├── Users
├── Workstations
├── Servers
├── Groups
└── Service Accounts
```

Link Group Policy to OUs, delegate rights at OU level (helpdesk can reset passwords in Users, nothing more), and keep the default Computers and Users containers empty by redirecting them (`redircmp`, `redirusr`).

## First Group Policies

- Password and lockout settings in the Default Domain Policy (or fine-grained password policies); follow [NIST password guidance](/article/nist-password-guidelines-vs-old-rules).
- Security baselines for workstations and servers.
- Audit policy so security events are logged; see [Windows security event IDs](/article/windows-security-event-ids-soc).
- [Windows LAPS](/article/windows-local-admin-password-rotation) for local admin passwords.

More on precedence and troubleshooting: [Group Policy fundamentals](/article/group-policy-basics-for-sysadmins).

## Day-one security

- Separate admin accounts; keep Domain Admins nearly empty and never use it for daily work.
- Enable the **AD Recycle Bin**.
- Disable SMBv1 and plan to restrict NTLM; require LDAP signing and channel binding.
- Back up system state of at least one DC regularly and test it.
- Protect privileged accounts with the Protected Users group where compatible.

For hardening in depth, see the [Active Directory and identity security guide](/article/active-directory-identity-security-guide).

## Classic problems

- **"The trust relationship between this workstation and the primary domain failed"**: the computer account password is out of sync, often after restoring an old snapshot. Fix with `Test-ComputerSecureChannel -Repair -Credential CORP\admin` or rejoin the domain.
- **Duplicate SIDs from cloned images**: always generalise images with Sysprep before deployment.
- **Slow logons**: usually DNS (clients pointing at non-DC resolvers), unreachable DCs for the site, or heavy logon scripts and GPOs. Check AD Sites and Services subnets and `gpresult`.

## FAQ

**Can I rename the domain later?**
Technically possible but complex and risky. Choose the name carefully.

**Do I still need AD if we use Entra ID?**
Cloud-only organisations may not. Hybrid environments sync AD to Entra ID with Entra Connect.

## References

- [Install Active Directory Domain Services (Microsoft Learn)](https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/deploy/install-active-directory-domain-services--level-100-)
- [Best practices for securing Active Directory (Microsoft Learn)](https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/plan/security-best-practices/best-practices-for-securing-active-directory)
