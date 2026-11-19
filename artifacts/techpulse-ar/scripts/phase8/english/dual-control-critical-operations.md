---
title: Dual Control: Requiring Two People for Operations That Can't Be Undone
excerpt: The four-eyes principle applied to IT: which operations deserve a second approver, how it defends against mistakes, insiders and stolen accounts, and how to implement it without slowing everything down.
---

Banks have long required two people to open a vault. The same idea, often called the four-eyes principle, applies to IT operations where one person's action could cause irreversible damage. It's one of the most effective controls against both mistakes and abuse.

## Why it works

- **Mistakes**: a second person catches the wrong server name, the extra zero, or the rule that opens everything.
- **Insiders**: one disgruntled or coerced person can't act alone.
- **Compromised accounts**: an attacker with one admin's credentials still needs a second approval, often from a different person on a different device.

Ransomware operators routinely delete backups and disable security tools before encrypting. Requiring a second approval for those actions can stop the attack at its most damaging step.

## Operations worth covering

- Deleting backups, changing backup retention or disabling immutability.
- Adding members to Domain Admins, Global Administrator or other privileged roles.
- Disabling security tools (EDR, logging, MFA policies).
- Accessing or exporting master encryption keys and recovery keys.
- Large or new-beneficiary payments and bank-detail changes.
- Mass deletion of mailboxes, users or data.
- Production firewall changes that open broad access.

Keep the list short. Too many approvals and people start rubber-stamping.

## Implementing it

- **Built-in features**: many backup products offer multi-person authorisation or delete protection; Microsoft Entra Privileged Identity Management supports approval for role activation; Azure Backup supports multi-user authorisation through Resource Guard; payment systems support dual approval.
- **Process controls** where tools can't enforce it: a change ticket needs approval from a second named person before execution. See [change management](/article/it-change-management-process-basics).
- **Split knowledge** for secrets: no single person holds a complete recovery key or root password.

## Making it fast

- Approvals from a phone app or chat workflow with clear context: who, what, why.
- Defined approvers with backups for holidays.
- Emergency procedure for urgent cases, reviewed afterwards.
- Log every approval and denial for audit.

## FAQ

**Is this realistic for a two-person IT team?**
Yes, with a manager or trusted outsider as second approver for the few critical operations.

**How does this relate to separation of duties?**
Separation of duties splits roles (the requester isn't the approver); dual control requires two people for a single action. They complement each other. See also [insider threats](/article/insider-threat-detection-basics).

## References

- [NIST SP 800-53 Rev. 5, AC-5 Separation of Duties and AC-3(2) Dual Authorization](https://csrc.nist.gov/pubs/sp/800/53/r5/upd1/final)
- [Multi-user authorization using Resource Guard (Microsoft Learn)](https://learn.microsoft.com/en-us/azure/backup/multi-user-authorization-concept)
