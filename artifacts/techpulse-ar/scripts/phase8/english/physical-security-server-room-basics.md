---
title: Server Room Physical Security: The Basics Everyone Skips
excerpt: Access control, visitor handling, cameras, environmental monitoring, power and fire protection, and the console and media risks that physical access creates.
---

Every logical control assumes the attacker can't walk up to the server. In many small and mid-size organisations, the "server room" is a cupboard with a lock nobody checks, or the rack is next to the office kitchen. Physical access can undo firewalls, MFA and encryption in minutes.

## Access control

- **A locked room or rack**, not shared storage space.
- **Electronic access** (badge or PIN) that logs who entered and when, rather than a key with unknown copies.
- **A short list** of people with access, reviewed regularly and updated when staff leave.
- **Visitors and contractors escorted** and signed in, including cleaning and facilities staff.

## Monitoring

- **Cameras** covering the door and racks, with footage retained long enough to investigate.
- **Door-open alerts**, especially out of hours.
- **Environmental sensors** for temperature, humidity and water leaks, with alerts to on-call staff. Heat kills hardware faster than most attacks.

## Power and fire

- **UPS** sized for a graceful shutdown or generator start, with tested batteries and shutdown software configured.
- **Separate circuits** and, where possible, dual power supplies on critical servers.
- **Appropriate fire suppression** and detection; avoid water sprinklers directly over equipment where alternatives are possible, and follow local codes.
- **Keep it tidy**: no cardboard, cleaning supplies or stored furniture in the room.

## What physical access lets an attacker do

- Plug in a rogue device, keylogger or network implant.
- Boot from USB to bypass the OS on unencrypted servers.
- Steal disks or backup media.
- Use an unlocked console session.

## Mitigations beyond the door

- **Lock consoles** and KVMs; set short screen-lock timeouts on servers.
- **Encrypt server and backup disks** ([BitLocker](/article/bitlocker-disk-encryption-basics) or equivalent).
- **Disable unused switch ports** or protect them with [802.1X](/article/802-1x-certificate-authentication).
- **Secure BIOS/UEFI** with passwords and Secure Boot.
- **Track and securely dispose of media**.
- **Label cables and keep an inventory**, so a new device stands out.

## FAQ

**We use the cloud. Does this still apply?**
Less, but network closets with switches, firewalls and Wi-Fi controllers still need the same care.

## References

- [NIST SP 800-53 Rev. 5: PE (Physical and Environmental Protection) controls](https://csrc.nist.gov/pubs/sp/800/53/r5/upd1/final)
