---
title: Secure Remote Work: A 12-Point Control Checklist for IT Teams
excerpt: Twelve controls that cover identity, devices, access, data and people for staff working from home or on the road, in priority order, with notes on how to verify each one.
---

Remote and hybrid work moved the perimeter to every kitchen table. This checklist covers the controls that matter most, roughly in priority order. Each item includes a quick way to check it's actually in place.

## Identity

**1. MFA on everything remote.** Email, VPN/ZTNA, SaaS and admin portals. Verify: sign-in logs show no successful single-factor logins.

**2. Phishing-resistant MFA for admins.** FIDO2 keys or Windows Hello for Business. Verify: privileged roles require an authentication strength policy.

**3. Conditional access.** Block legacy authentication, require compliant devices for sensitive apps, flag risky locations. Verify: legacy-auth sign-ins are zero.

## Devices

**4. Managed, encrypted laptops.** Intune or another MDM, with [BitLocker](/article/bitlocker-disk-encryption-basics) or FileVault enforced. Verify: compliance report shows encryption on all devices.

**5. EDR on every endpoint.** Verify: device counts in EDR match your asset inventory.

**6. Patching that works off-network.** Cloud-based update management so laptops patch without the VPN. Verify: patch compliance for devices not seen on the LAN for 30 days.

**7. No local admin for daily use.** Verify: local admin group membership report; see [Windows LAPS](/article/windows-local-admin-password-rotation).

## Access

**8. Remote access through a hardened gateway.** VPN or ZTNA with MFA and current firmware; no RDP or SMB exposed to the internet. Verify: external scan of your public IPs.

**9. Least-privilege access to internal apps.** Users reach only the apps they need. Verify: VPN or ZTNA policy review.

## Data

**10. Approved collaboration and storage.** OneDrive/SharePoint, Google Drive or equivalent, with external sharing controls and [DLP](/article/data-loss-prevention-dlp-guide). Verify: sharing reports for "anyone with the link".

**11. Backups for endpoint data.** Known-folder redirection to cloud storage or endpoint backup. Verify: a test restore.

## People

**12. Training and an easy way to report.** Phishing awareness, home Wi-Fi basics (see [small-office router hardening](/article/home-router-security-basics)), and a clear, fast way to report a lost device or suspicious message. Verify: report volumes and time to report.

## FAQ

**Should we allow personal devices?**
For limited, browser-based access with app protection policies, often yes. Full access belongs on managed devices; see the [BYOD policy guide](/article/byod-policy-security-guide).

## References

- [NIST SP 800-46 Rev. 2: Guide to Enterprise Telework, Remote Access, and BYOD Security](https://csrc.nist.gov/pubs/sp/800/46/r2/final)
