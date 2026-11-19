---
title: Kerberoasting Explained: Spotting Service-Ticket Abuse and Shutting It Down
excerpt: How any domain user can request service tickets and crack service-account passwords offline, why RC4 makes it easier, how to detect it with event 4769 and honey SPNs, and the fixes that make it impractical (gMSA, long passwords, AES).
---

Kerberoasting is one of the most reliable privilege-escalation moves inside a Windows domain, and it doesn't exploit a bug. It abuses the way Kerberos is designed to work, combined with the weak, old passwords that service accounts so often have.

## How the attack works

When a user wants to use a service such as SQL Server, their machine asks a domain controller for a **service ticket**. Part of that ticket is encrypted with a key derived from the password of the account the service runs under, identified by its **Service Principal Name (SPN)**.

1. Any authenticated domain user may request a ticket for any SPN. That's normal.
2. The attacker saves the ticket and attacks it **offline**, guessing passwords on their own hardware. Nothing fails on the domain, so lockout policies never trigger.
3. If the password is weak, the attacker now holds a service account, and service accounts frequently have far more rights than they should.

All it takes is one compromised workstation or user account. For the protocol background, see [Kerberos authentication explained](/article/kerberos-authentication-explained).

## Why RC4 matters

Tickets encrypted with **RC4 (encryption type 0x17)** use a key derived directly from the account's NTLM hash and crack far faster than **AES tickets (0x11 and 0x12)**. Attack tools deliberately ask for RC4 when the account allows it. AES helps, but it only slows cracking; a short password is still crackable. Microsoft is phasing RC4 out of Kerberos and publishes guidance for finding and removing remaining RC4 use. Check its current status for your Windows versions.

## Detecting it

### Event 4769 on domain controllers

Turn on auditing of **Kerberos Service Ticket Operations** on DCs, then watch for:

- **Ticket encryption type 0x17** for accounts that support AES.
- **One account requesting tickets for many different SPNs** in a short window.
- Requests from hosts or users that never normally use those services.

A simple Event Viewer custom filter for RC4 ticket requests:

```xml
<QueryList>
  <Query Id="0" Path="Security">
    <Select Path="Security">*[EventData[Data[@Name='TicketEncryptionType']='0x17']]</Select>
  </Query>
</QueryList>
```

### A honey SPN

Create a decoy account with a realistic-looking SPN that no real service uses, and a very long random password. No legitimate client will ever request its ticket, so any 4769 for it is a high-confidence alert. More on decoys in [honeypots and deception](/article/honeypot-deception-basics).

### Built-in tooling

Microsoft Defender for Identity includes detections for SPN reconnaissance and suspicious ticket requests, and most SIEMs ship Kerberoasting rules.

## Prevention

| Fix | Why it works |
|---|---|
| Group managed service accounts (gMSA), or delegated managed service accounts (dMSA) on Windows Server 2025 | Long, automatically rotated passwords that are impractical to crack |
| 25+ character random passwords where managed accounts aren't possible | Raises cracking cost enormously |
| Enable AES for the account, then reset its password | AES keys only exist after a password change |
| Disable RC4 where compatibility allows | Removes the easy-to-crack ticket type |
| Least privilege for service accounts | Limits damage if one falls |
| Remove stale SPNs | Fewer targets |

### Find your exposed accounts

User accounts with SPNs are the targets:

```powershell
Get-ADUser -Filter "ServicePrincipalName -like '*'" -Properties ServicePrincipalName, PasswordLastSet, msDS-SupportedEncryptionTypes |
  Select-Object SamAccountName, PasswordLastSet, msDS-SupportedEncryptionTypes
```

Fix the oldest passwords and most privileged accounts first. More commands in [everyday AD work in PowerShell](/article/ad-powershell-daily-tasks).

### The cousin: AS-REP roasting

Accounts flagged "Do not require Kerberos preauthentication" can be attacked similarly, without the attacker even needing a domain account. Find them and clear the flag unless there's a documented reason.

## FAQ

### Does Kerberoasting need admin rights?

No. Any ordinary domain user can request service tickets.

### Will rotating a service account password break things?

It can, if the password is configured in several places. That's the strongest argument for gMSAs: Windows rotates the password and distributes it to authorised servers automatically.

### Is AES enough on its own?

No. Combine AES with a managed or very long password.

## References

- [Microsoft Security Blog: Microsoft's guidance to help mitigate Kerberoasting](https://www.microsoft.com/en-us/security/blog/2024/10/11/microsofts-guidance-to-help-mitigate-kerberoasting/)
- [Detect and remediate RC4 usage in Kerberos (Microsoft Learn)](https://learn.microsoft.com/en-us/windows-server/security/kerberos/detect-remediate-rc4-kerberos)
- [Event 4769 (Microsoft Learn)](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-4769)
- [Group Managed Service Accounts overview (Microsoft Learn)](https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/manage/group-managed-service-accounts/group-managed-service-accounts/group-managed-service-accounts-overview)
- [MITRE ATT&CK T1558.003: Kerberoasting](https://attack.mitre.org/techniques/T1558/003/)
