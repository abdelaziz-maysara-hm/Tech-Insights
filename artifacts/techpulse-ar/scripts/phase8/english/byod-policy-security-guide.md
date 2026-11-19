---
title: BYOD Without Regret: Policy and Controls for Personal Devices at Work
excerpt: Deciding what personal phones and laptops may access, MAM versus full MDM enrolment, the minimum security requirements, privacy boundaries, and what happens when a device is lost or an employee leaves.
---

Staff already read work email on personal phones. A bring-your-own-device policy makes that deliberate: what's allowed, under which conditions, and what the company can and can't see or do on a device it doesn't own.

## Decide the scope first

- **Which data and apps**: email, Teams and documents? Admin consoles? Customer data?
- **Which devices**: phones and tablets only, or personal laptops too? Laptops are much harder to secure without full management.
- **Who**: all staff, or roles with a business case?

A common pattern: personal phones may access email and collaboration apps under app protection; personal laptops get browser-only access with restrictions; admin and sensitive systems require company-managed devices.

## Two management approaches

- **Mobile application management (MAM)**: protect company data inside specific apps (Outlook, Teams, OneDrive) without enrolling the whole device. Policies can require a PIN, block copy/paste to personal apps, prevent saving to personal storage, and wipe only company data. Usually the best fit for personal phones.
- **Full device enrolment (MDM)**: the organisation manages the whole device. More control, but more privacy concerns, and staff often refuse on personal devices. Android Work Profile and Apple User Enrollment offer a middle ground that separates work and personal data.

## Minimum requirements

- Supported, updated OS version; no jailbroken or rooted devices.
- Screen lock with PIN or biometrics; device encryption on.
- MFA for work accounts; conditional access blocking non-compliant devices.
- Work apps from official stores only.

## Privacy boundaries

Write down what the company **can't** see: personal photos, messages, browsing history, personal apps, location (unless explicitly needed and agreed). Clear limits make people more willing to participate. Check employment and privacy law with HR and legal.

## Loss and departure

- Staff report lost devices immediately; IT performs a selective wipe of company data.
- On departure, company data is removed from personal devices as part of offboarding.
- A full wipe of a personal device should be rare and agreed in the policy in advance.

Related: [secure remote work checklist](/article/secure-remote-work-checklist).

## FAQ

**Is BYOD cheaper?**
It saves hardware costs but adds management and support effort. The bigger benefit is often user convenience.

## References

- [NIST SP 800-46 Rev. 2: Guide to Enterprise Telework, Remote Access, and BYOD Security](https://csrc.nist.gov/pubs/sp/800/46/r2/final)
- [App protection policies overview (Microsoft Learn)](https://learn.microsoft.com/en-us/intune/intune-service/apps/app-protection-policy)
