"My account keeps locking" is one of the most common helpdesk tickets in any Active Directory environment. Unlocking it is easy. Finding out *why* it locks, and stopping it from happening again, takes a little detective work. Occasionally the answer is not a forgotten password at all but someone guessing passwords, which is why lockouts deserve proper attention.

## How a lockout actually happens

When the account lockout threshold is set, every failed authentication increments a bad-password counter. Domain controllers forward failed attempts to the domain controller holding the **PDC emulator** role, which keeps the authoritative count. When the threshold is reached, the account locks and the PDC emulator writes **event 4740, "A user account was locked out"** to its Security log.

That event contains the field that matters most: **Caller Computer Name**, the machine the failed attempts came from. Start there.

## Step 1: find the PDC emulator and the 4740 events

```powershell
$pdc = (Get-ADDomain).PDCEmulator
Get-WinEvent -ComputerName $pdc -FilterHashtable @{LogName='Security'; Id=4740} -MaxEvents 50 |
  Select-Object TimeCreated,
    @{n='User';e={$_.Properties[0].Value}},
    @{n='Source';e={$_.Properties[1].Value}}
```

For event 4740 the first property is the locked account and the second is the caller computer. If the Security log on the PDC emulator rolls over quickly, forward it to a SIEM or increase its size; otherwise the evidence disappears within hours on busy domains.

To see who is locked out right now:

```powershell
Search-ADAccount -LockedOut | Select-Object Name, SamAccountName, LastLogonDate
```

## Step 2: go to the source machine

The caller computer tells you where to look, not what is wrong. On that machine, check the usual suspects:

- **Services and scheduled tasks** running as the user with an old password. Look at Services (Log On As column) and Task Scheduler.
- **Saved credentials** in Credential Manager, including old entries for file servers or remote desktops.
- **Mapped drives** reconnecting at logon with stored credentials.
- **A disconnected RDP session** on a server, still running under the old password.
- **Mobile devices and mail clients** retrying an old password. These often appear as the mail server or a gateway in the caller field rather than as a phone.

If Caller Computer Name is empty or shows a server such as an Exchange, ADFS, VPN or RADIUS host, the real source is behind that server. Check its own logs (for example IIS logs on a mail server, or NPS logs on a RADIUS server) to find the client IP.

## Step 3: read the failure events for detail

Domain controllers also record the failed attempts themselves:

| Event | Meaning | Useful field |
|---|---|---|
| 4625 | An account failed to log on (logged on the machine that processed the logon) | Status / Sub Status, Source Network Address, Logon Type |
| 4771 | Kerberos pre-authentication failed | Failure Code 0x18 means a bad password; Client Address |
| 4776 | NTLM credential validation attempt on the DC | Error code, Workstation |

For 4625, Sub Status 0xC000006A means a wrong password and 0xC0000234 means the account is already locked. Logon type tells you how the attempt arrived: 3 is network, 10 is remote interactive (RDP).

## Step 4: decide whether it is a mistake or an attack

A single source repeating one user's old password every few minutes is almost always a stale credential. Treat it as an attack instead when you see:

- many different accounts failing from the same source;
- failures from internet-facing systems such as VPN, webmail or RDP gateways;
- attempts at unusual hours or from unfamiliar addresses;
- a pattern of one or two attempts per account across many accounts, typical of password spraying, which is designed to stay below lockout thresholds.

Password spraying often causes **no** lockouts at all, so absence of lockouts is not proof of safety. Alert on the volume of failures across accounts too. Our guides on [Windows security event IDs](/article/windows-security-event-ids-soc) and [Wazuh rules for brute force](/article/wazuh-custom-rule-brute-force) show how to build those alerts.

## Choosing sensible lockout settings

Very low thresholds create helpdesk load and make it easy for an attacker to lock out staff deliberately. Very high thresholds give attackers more guesses. Many organisations settle on something around 10 attempts with a 15-minute reset, combined with MFA and banned-password checks. Whatever you choose, document it and apply stricter protection to privileged accounts rather than relying on lockout alone. Background on modern password policy is in [NIST password guidelines vs old rules](/article/nist-password-guidelines-vs-old-rules).

## FAQ

### Why does unlocking the account not fix the problem?

Because the device sending the bad password is still running. Until you remove or update the stale credential on the source machine or phone, the account will lock again.

### Do I need to check every domain controller?

No. Lockouts are recorded on the PDC emulator, so start there. Individual DCs hold the 4771 and 4776 failures for the requests they processed.

### Can I see lockouts without PowerShell?

Yes: filter the Security log for event 4740 in Event Viewer on the PDC emulator, or search for it in your SIEM.

## References

- [Microsoft Learn: Event 4740, a user account was locked out](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-4740)
- [Microsoft Learn: Event 4625, an account failed to log on](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-4625)
- [Microsoft Learn: Event 4771, Kerberos pre-authentication failed](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-4771)
- [Microsoft Learn: Account lockout policy](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/security-policy-settings/account-lockout-policy)
- [Microsoft Learn: Search-ADAccount](https://learn.microsoft.com/en-us/powershell/module/activedirectory/search-adaccount)
