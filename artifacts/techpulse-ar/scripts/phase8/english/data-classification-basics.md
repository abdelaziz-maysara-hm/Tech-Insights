---
title: Data Classification Made Practical: Matching Protection to Sensitivity
excerpt: How to define a few clear classification levels, label data with minimal friction, tie each level to concrete handling rules, and use labels to drive DLP and access controls.
---

Not every file deserves the same protection. Treating the lunch menu like customer bank details wastes effort; treating customer data like the lunch menu causes breaches. Data classification lets you put protection where it matters.

## Keep the scheme small

Three or four levels are enough for most organisations:

| Level | Examples | Typical handling |
|---|---|---|
| Public | Marketing material, published docs | No restrictions |
| Internal | Policies, internal announcements | Staff only, no public sharing |
| Confidential | Contracts, HR data, customer lists | Need-to-know access, encryption in transit and at rest, no personal email |
| Restricted | Payment data, health records, credentials, M&A plans | Strict access, encryption, logging, DLP blocking, approval to share |

More levels mean more confusion and more mislabelling.

## Define handling rules per level

Classification only helps if each level has clear rules: where it may be stored, who may access it, whether it can be emailed externally, printed or copied to USB, how long it's kept and how it's destroyed.

## Labelling

- **Default labels**: new documents default to Internal so nothing is unlabelled.
- **User labelling** with simple prompts in Office apps (Microsoft Purview sensitivity labels, Google Workspace labels).
- **Automatic labelling** for patterns like card numbers, national IDs or health terms.
- **Location-based**: an HR or finance site can inherit a classification.

## What labels can drive

- **Encryption and access restrictions** that travel with the file.
- **DLP policies** blocking or warning on external sharing of Confidential or Restricted data; see [DLP channels and rollout](/article/data-loss-prevention-dlp-guide).
- **Visual markings**: headers and watermarks.
- **Retention policies**.

## Getting started

1. Identify where your most sensitive data lives: HR, finance, customer databases, file shares.
2. Agree the scheme with legal, HR and business owners.
3. Pilot labels with one department.
4. Train staff with short examples, not a long policy.
5. Turn on automatic labelling and DLP in audit mode, then enforce gradually.

## FAQ

**Who decides the classification?**
The data owner, usually the business department, with security setting the framework.

**Does classification help with privacy law?**
Yes. Knowing where personal data lives is the first step in meeting obligations under laws such as GDPR.

## References

- [Learn about sensitivity labels (Microsoft Learn)](https://learn.microsoft.com/en-us/purview/sensitivity-labels)
- [NIST SP 800-60 Vol. 1 Rev. 1: Mapping Types of Information to Security Categories](https://csrc.nist.gov/pubs/sp/800/60/v1/r1/final)
