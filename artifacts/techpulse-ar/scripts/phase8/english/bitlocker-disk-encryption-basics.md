---
title: BitLocker Essentials for IT: TPM, Recovery Keys and Central Management
excerpt: What BitLocker protects against, how TPM and startup PINs work, where recovery keys must live, and how to enforce encryption with Intune or Group Policy.
---

A lost or stolen laptop without disk encryption is a data breach. With BitLocker turned on, it's a hardware loss. BitLocker is built into Windows Pro, Enterprise and Education, so for most fleets the work is enforcement and key management, not buying anything.

## What it protects against

BitLocker encrypts the whole volume. If someone removes the drive or boots another OS, the data is unreadable. It doesn't protect a running, unlocked machine from malware or a signed-in attacker; that's the job of other controls.

## Protectors

- **TPM only**: the TPM releases the key if the boot chain is unchanged. Seamless for users, and the default on most deployments.
- **TPM + PIN**: the user enters a PIN before Windows starts. Stronger against attacks on the boot process and memory; worth considering for high-risk devices.
- **Recovery password**: a 48-digit key used when the TPM refuses to release the key, for example after firmware changes or hardware swaps.

## Recovery keys: the part that bites

Encryption without recoverable keys turns a motherboard failure into permanent data loss. Escrow every key automatically:

- **Entra ID / Intune** for cloud-managed devices.
- **Active Directory** for domain-joined machines (Group Policy setting to back up recovery information to AD DS).
- **MBAM/Configuration Manager** in some older environments.

Restrict who can read recovery keys, and audit access.

## Enforcing it

- **Intune**: endpoint security disk-encryption policy, silent enablement, XTS-AES 256 if your policy requires it, recovery key backup required before encryption.
- **Group Policy**: settings under `Computer Configuration > Administrative Templates > Windows Components > BitLocker Drive Encryption`.
- **Removable drives**: BitLocker To Go, optionally blocking writes to unencrypted drives; see [USB device control](/article/usb-device-control-policy).

Verify with `manage-bde -status` or compliance reports.

## Before firmware updates

Suspend BitLocker for a reboot (`Suspend-BitLocker -RebootCount 1`) before BIOS/UEFI updates, or users will hit recovery screens. Many update tools do this automatically.

## FAQ

**Does BitLocker slow computers down?**
On modern hardware with AES acceleration the impact is negligible.

**What about servers?**
Encrypting server volumes protects against stolen disks and decommissioned hardware; see [SSD vs HDD for servers](/article/ssd-vs-hdd-server-storage) on disposal.

## References

- [BitLocker overview (Microsoft Learn)](https://learn.microsoft.com/en-us/windows/security/operating-system-security/data-protection/bitlocker/)
- [BitLocker recovery overview (Microsoft Learn)](https://learn.microsoft.com/en-us/windows/security/operating-system-security/data-protection/bitlocker/recovery-overview)
