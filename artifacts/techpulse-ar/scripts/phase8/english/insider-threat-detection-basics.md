---
title: Insider Threats: Spotting Risk That Already Has a Login
excerpt: The three kinds of insider risk (malicious, negligent, compromised), the warning signs in logs and behaviour, and the controls that detect problems while respecting privacy.
---

External attackers have to break in. Insiders already have accounts, access and knowledge of where the valuable data is. Not every insider incident is malicious; many are mistakes, and some are outsiders using a stolen account.

## Three kinds of insider risk

- **Malicious**: an employee or contractor stealing data, committing fraud or sabotaging systems, often around resignation or a grievance.
- **Negligent**: someone emailing the wrong file, uploading data to a personal cloud, or falling for phishing.
- **Compromised**: an attacker operating with a legitimate user's credentials. To your logs, it looks like an insider.

## Warning signs in the data

- Unusual volumes of downloads, file-share access or printing, especially before a departure date.
- Access outside normal hours or from unusual locations.
- Accessing systems or data unrelated to the person's role.
- Copying to USB, personal email or unapproved cloud storage.
- Attempts to disable security tools or escalate privileges.

Behavioural signs (expressed grievances, sudden policy violations) are relevant, but should be handled through HR, not just security tooling.

## Controls

1. **Least privilege and access reviews** limit what any one person can take; see [least privilege](/article/least-privilege-principle-practical).
2. **Separation of duties and dual control** for financial and critical operations; see [dual control](/article/dual-control-critical-operations).
3. **DLP** on email, endpoints and cloud; see [data loss prevention](/article/data-loss-prevention-dlp-guide).
4. **Logging and UEBA** (user and entity behaviour analytics) in your SIEM to flag anomalies.
5. **Solid offboarding**: disable accounts on the last day (or immediately for dismissals), recover devices, revoke tokens and shared credentials.
6. **USB and personal cloud controls**; see [USB device control](/article/usb-device-control-policy).

## Privacy and fairness

Monitoring must be lawful, proportionate and transparent: tell staff what's monitored and why, involve HR and legal, limit who can see investigation data, and avoid targeting individuals without cause. A clumsy programme damages trust and can break employment law.

For a structured approach, see [building an insider risk programme](/article/insider-risk-program-guide).

## FAQ

**Are insider incidents common?**
Mistakes by insiders are among the most common causes of data incidents. Malicious cases are rarer but often costly.

## References

- [CISA: Insider Threat Mitigation](https://www.cisa.gov/topics/physical-security/insider-threat-mitigation)
- [CERT Common Sense Guide to Mitigating Insider Threats (SEI)](https://www.sei.cmu.edu/library/common-sense-guide-to-mitigating-insider-threats-seventh-edition/)
