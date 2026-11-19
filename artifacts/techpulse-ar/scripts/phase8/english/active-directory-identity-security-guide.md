---
title: Active Directory and Identity Security: The Complete Guide to Protecting Your Domain
excerpt: A defender's plan for Active Directory: how attackers climb from one workstation to Domain Admin, and the controls that stop them, from tiered administration, gMSAs and Windows LAPS to AD CS template reviews, the event IDs worth alerting on and a tested forest recovery.
---

In most Windows organisations, Active Directory decides who can log on to what. That makes it the prize in nearly every serious intrusion. Ransomware operators rarely encrypt a network one machine at a time. They take control of the domain first, then push their payload everywhere at once through the same tools administrators use.

The good news is that the paths attackers follow inside AD are well documented, and most of them can be closed with configuration rather than new products.

## How an intrusion usually unfolds

A typical chain looks like this:

1. **Foothold.** A user opens a malicious attachment or enters a password on a phishing page. The attacker now runs code as that user, or holds their credentials.
2. **Discovery.** Any domain user can read most of the directory by default. Tools map groups, sessions, ACLs and trust relationships to find a short path to privileged accounts.
3. **Credential theft.** The attacker harvests what is cached on the machine, requests service tickets to crack offline, or abuses a shared local administrator password.
4. **Lateral movement.** Using those credentials, they hop to servers where privileged users have logged on and steal more powerful credentials from memory.
5. **Domain dominance.** With Domain Admin or equivalent rights, they can create accounts, change Group Policy, extract every password hash and deploy ransomware domain-wide.

Each control below breaks one or more links in that chain.

## Separate privilege into tiers

The most effective structural change is to stop highly privileged credentials from ever touching machines that ordinary users and malware can reach. Microsoft's guidance has evolved from the classic three-tier model into the broader **enterprise access model**, but the core idea is unchanged:

- **Tier 0 (control plane):** domain controllers, AD CS, identity sync servers, and the accounts and systems that manage them.
- **Tier 1:** member servers and applications.
- **Tier 2:** workstations and user devices.

Rules that follow from this:

- Domain Admins log on only to domain controllers and dedicated admin workstations, never to regular servers or laptops.
- Administrators have separate accounts for admin work and for email and browsing.
- Tier 0 admins use a privileged access workstation that isn't used for anything else.
- Membership of privileged groups is small, reviewed and, where possible, granted just in time.

Put high-value accounts in the **Protected Users** group, which blocks weaker protocols and credential caching for its members. Test first, since it can break older applications. More context is in [the least-privilege principle in practice](/article/least-privilege-principle-practical) and [the complete Active Directory setup guide](/article/active-directory-complete-setup-guide).

## Service accounts

Service accounts tend to be old, over-privileged, exempt from password changes and set with passwords people can remember. Any account with a Service Principal Name can be targeted by Kerberoasting: any domain user can request a ticket for it and try to crack the password offline.

Fixes, in order of preference:

- Replace them with **group Managed Service Accounts (gMSAs)**. AD generates and rotates long random passwords automatically, so there's nothing to crack in practice.
- Where a gMSA isn't supported, use a long random password (25 characters or more) stored in a vault, and rotate it.
- Enforce AES encryption for Kerberos and phase out RC4.
- Remove interactive logon rights and any privileged group memberships the service doesn't need.

Detection and the attack in detail are covered in [Kerberoasting detection and prevention](/article/kerberoasting-detection-prevention), with protocol background in [Kerberos authentication explained](/article/kerberos-authentication-explained).

## Local administrator passwords

Images built years ago often share one local Administrator password across every machine. Steal it once and you can log in everywhere. **Windows LAPS**, built into supported Windows versions since the April 2023 updates, gives every device a unique, automatically rotated password stored in AD or Microsoft Entra ID, with access controlled by permissions. Deploy it everywhere, and limit who can read the passwords. See [rotating the local admin password](/article/windows-local-admin-password-rotation).

## Group Policy: powerful in both directions

Group Policy is how you push hardening to every machine: disabling legacy protocols, restricting who can log on locally, configuring audit settings and enforcing firewall rules. It is also how attackers push their tools once they control it. Anyone who can edit a GPO linked to domain controllers effectively holds Tier 0 rights, so review GPO edit permissions as carefully as group membership. See [Group Policy basics](/article/group-policy-basics-for-sysadmins).

## Passwords and MFA

Current NIST guidance in SP 800-63B favours length and screening against known breached passwords over composition rules and forced periodic changes. In AD, Fine-Grained Password Policies let you require longer passwords for privileged and service accounts than for everyone else. Background is in [NIST password guidelines vs old rules](/article/nist-password-guidelines-vs-old-rules).

If identities sync to Microsoft Entra ID, cloud sign-in becomes another door into the same accounts. Enforce MFA for everyone and phishing-resistant methods (FIDO2 security keys, passkeys, Windows Hello for Business) for administrators. Watch for push-approval abuse as described in [MFA fatigue attacks](/article/mfa-fatigue-attacks-explained), and compare options in the [practical 2FA guide](/article/2fa-practical-guide).

## Hidden privilege: ACLs and delegation

Group membership is only part of the picture. Rights such as GenericAll, WriteDACL or the right to reset passwords on a privileged account can be just as powerful, and they accumulate silently through years of helpdesk delegation. So can unconstrained Kerberos delegation on servers, which lets them impersonate users who connect to them.

Practical steps:

- Run a graph-based analysis of attack paths regularly and fix the shortest paths to Tier 0 first.
- Remove unconstrained delegation; use constrained or resource-based delegation where it's needed.
- Check the AdminSDHolder object, which sets permissions on protected groups, for unexpected entries.

## AD Certificate Services

An enterprise CA integrated with AD is a Tier 0 system. Misconfigured certificate templates are a well-known route to domain compromise. The classic case lets the requester supply the subject name on a template that allows client authentication, so a normal user can request a certificate as a Domain Admin. Review every published template, restrict enrolment rights, require approval for sensitive templates, and monitor issuance. More in [PKI and certificate authorities explained](/article/pki-certificate-authority-explained).

## Events worth alerting on

Make sure advanced audit policy is configured on domain controllers and logs are forwarded to a SIEM. A starting set:

| Event ID | Why it matters |
|---|---|
| 4728, 4732, 4756 | A member was added to a security group. Alert for privileged groups. |
| 4720 | A user account was created. |
| 4769 | Kerberos service ticket requested. Watch for RC4 tickets and bursts from one account. |
| 4625 and 4771 | Failed logons and Kerberos pre-authentication failures, for spraying patterns. |
| 5136 | A directory object was modified, including GPOs. |
| 1102 | The security log was cleared. |

Details are in [Windows security event IDs for SOC teams](/article/windows-security-event-ids-soc) and [Event Viewer security logs](/article/windows-event-viewer-security-logs).

## Plan to rebuild

Assume that one day you will need to recover the forest from backup after a total compromise. Microsoft publishes a forest recovery guide for exactly this. Prepare by:

- keeping offline or immutable backups of at least two domain controllers per domain;
- documenting the recovery order and testing it in an isolated lab;
- knowing how to reset the krbtgt account password twice, with a gap for replication, to invalidate forged tickets;
- keeping break-glass accounts whose credentials are stored offline.

A recovery you have never practised is a hope, not a plan.

## Where to start

If this feels like a lot, a sensible first quarter is:

1. Count and reduce members of Domain Admins, Enterprise Admins and Administrators.
2. Deploy Windows LAPS to every workstation and server.
3. Move the most privileged service accounts to gMSAs or long vaulted passwords.
4. Turn on the audit settings and alerts above.
5. Run an attack-path analysis and fix the top findings.

## FAQ

### Is a strong Domain Admin password enough?

No. Attackers rarely guess Domain Admin passwords. They steal credentials or tickets from machines where those accounts have logged on. Where an account is used matters as much as its password.

### How is a gMSA different from a normal service account?

AD manages the password: it is long, random and rotated automatically, and only authorised servers can retrieve it. No human needs to know it, so it can't be reused, written down or practically cracked.

### Can we turn NTLM off completely?

Eventually, and Microsoft has deprecated it, but many organisations still have applications that depend on it. Audit NTLM usage first, fix or isolate the dependencies, then restrict it step by step.

### How many Domain Admins should we have?

As few as possible, often a handful in a medium-sized organisation, with no service accounts among them. Day-to-day tasks should use delegated rights rather than Domain Admin.

## References

- [Microsoft Learn: Best practices for securing Active Directory](https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/plan/security-best-practices/best-practices-for-securing-active-directory)
- [Microsoft Learn: Enterprise access model](https://learn.microsoft.com/en-us/security/privileged-access-workstations/privileged-access-access-model)
- [Microsoft Learn: Group Managed Service Accounts overview](https://learn.microsoft.com/en-us/windows-server/security/group-managed-service-accounts/group-managed-service-accounts-overview)
- [Microsoft Learn: Windows LAPS overview](https://learn.microsoft.com/en-us/windows-server/identity/laps/laps-overview)
- [Microsoft Learn: Active Directory forest recovery guide](https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/manage/forest-recovery-guide/ad-forest-recovery-guide)
- [Microsoft Security Blog: Guidance to help mitigate Kerberoasting](https://www.microsoft.com/en-us/security/blog/2024/10/11/microsofts-guidance-to-help-mitigate-kerberoasting/)
- [NIST SP 800-63B: Digital Identity Guidelines](https://pages.nist.gov/800-63-4/sp800-63b.html)
