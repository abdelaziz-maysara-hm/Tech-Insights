---
title: Controlling USB Devices Without Stopping People Working
excerpt: The risks removable media still carries, the options from read-only to allow-lists by device ID, how to roll out device control with Intune, Group Policy or your EDR, and how to handle exceptions.
---

USB drives still move malware between networks, carry data out of the organisation, and get lost on trains. But keyboards, headsets and authenticators are USB too, so "block USB" is rarely the answer. Device control is about deciding which devices can do what.

## The risks

- **Data loss**: copying sensitive files to a personal drive, deliberately or not.
- **Malware**: infected drives, especially between office and air-gapped or industrial networks.
- **Malicious devices**: "BadUSB" devices that pretend to be keyboards and type commands.
- **Lost media**: unencrypted drives with customer data.

## Policy options, from loose to strict

1. **Audit only**: log what's connected and what's copied. A good first step to see real usage.
2. **Read-only removable storage**: people can open files from drives but not write to them.
3. **Allow approved devices only**: company-issued encrypted drives identified by vendor ID, product ID or serial number; everything else blocked.
4. **Block all removable storage**, while still allowing keyboards, mice, headsets and security keys.

Most organisations combine levels: read-only or approved-only for general staff, full block for high-risk roles, exceptions by request.

## Implementation tools

- **Microsoft Defender for Endpoint device control and Intune** policies can allow or block by device class, vendor/product ID or serial, with read/write/execute granularity.
- **Group Policy** (`Computer Configuration > Administrative Templates > System > Device Installation` and `Removable Storage Access`) offers basic controls without extra licences.
- **Most EDR and endpoint suites**, including Kaspersky and others, include device control modules with logging.
- **BitLocker To Go**, enforced so data can only be written to encrypted drives; see [BitLocker basics](/article/bitlocker-disk-encryption-basics).

## Rolling it out

- Start in audit mode for a few weeks to see who uses what.
- Issue encrypted drives to people who genuinely need them.
- Communicate the change, with the alternatives: OneDrive/SharePoint sharing, secure file transfer.
- Create a quick exception process with an expiry date.
- Review logs for blocked attempts; repeated attempts can signal [insider risk](/article/insider-threat-detection-basics).

## FAQ

**Does disabling autorun solve the malware problem?**
It helps, and is already default in modern Windows, but malicious files can still be opened by hand. Keep scanning removable media on connect.

**What about phones over USB?**
MTP connections from phones can transfer files too. Make sure your policy covers portable devices, not just mass-storage.

## References

- [Device control in Microsoft Defender for Endpoint (Microsoft Learn)](https://learn.microsoft.com/en-us/defender-endpoint/device-control-overview)
