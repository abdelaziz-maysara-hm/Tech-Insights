---
title: Data Loss Prevention (DLP): Covering the Channels Without Drowning in Alerts
excerpt: Where data leaves an organisation (email, endpoints, cloud, web), how DLP detects sensitive content, and a phased rollout from audit to enforcement that users will tolerate.
---

Data loss prevention tries to stop sensitive information leaving the organisation through the wrong channel, whether by accident (the wrong email recipient) or on purpose (a departing employee's USB stick). Its tools are powerful, and a badly tuned rollout can bury the security team and frustrate everyone else.

## The channels

- **Email**: external recipients, personal addresses, auto-forwarding rules.
- **Endpoints**: USB, printing, copying to personal cloud sync clients, uploading through browsers.
- **Cloud and SaaS**: sharing links in OneDrive, SharePoint, Google Drive; data in unsanctioned apps (CASB coverage).
- **Web**: uploads to file-sharing sites, paste into AI tools and web forms.
- **Collaboration tools**: Teams, Slack, external chats.

## How DLP recognises sensitive data

- **Pattern matching** with validation: card numbers (with Luhn check), IBANs, national ID formats.
- **Keywords and dictionaries**: project code names, medical terms.
- **Document fingerprinting and exact data match**: recognising a specific form or records from a real database.
- **Sensitivity labels**: the most reliable signal when users and automation label data; see [data classification](/article/data-classification-basics).
- **Trainable classifiers**: machine-learned categories such as contracts or source code.

## Phased rollout

1. **Pick the data that matters most**: two or three types (customer personal data, payment data, HR records).
2. **Audit mode**: detect and log only, for several weeks. Learn where data actually flows.
3. **Tune**: remove false positives, add exceptions for legitimate business flows.
4. **Policy tips**: warn users and let them justify or override. This educates without blocking work.
5. **Enforce** blocking for the highest-risk cases: bulk personal data to personal email, Restricted data to USB.
6. **Expand** to more channels and data types.

## Operating it

- Route alerts by severity; only high-severity ones need human review.
- Agree with HR and legal how investigations work, and respect privacy laws.
- Report trends, not just counts.

## FAQ

**Can DLP stop a determined insider?**
It raises the effort and creates evidence, but a person can photograph a screen. Combine it with least privilege and monitoring; see [insider threats](/article/insider-threat-detection-basics).

## References

- [Learn about data loss prevention (Microsoft Learn)](https://learn.microsoft.com/en-us/purview/dlp-learn-about-dlp)
- [NIST SP 1800-28: Data Confidentiality, Identifying and Protecting Assets Against Data Breaches](https://csrc.nist.gov/pubs/sp/1800/28/final)
