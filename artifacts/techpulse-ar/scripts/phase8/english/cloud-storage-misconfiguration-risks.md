---
title: Misconfigured Cloud Storage: How Buckets Leak Data and How to Lock Them Down
excerpt: The common mistakes behind exposed S3 buckets, Azure blobs and shared drives (public access, broad links, leaked keys), and the guardrails, scans and monitoring that prevent them.
---

Many of the largest data exposures weren't sophisticated attacks. Someone left a storage bucket readable by anyone on the internet, and a researcher or criminal found it with a simple scan. Cloud storage is secure by default today, but one setting or one shared link can undo that.

## How the leaks happen

- **Public access** turned on for convenience, such as sharing files with a partner or hosting assets, and never turned off.
- **Overly broad policies**: "any authenticated user" in some platforms means any account on that cloud, not just yours.
- **Anonymous sharing links** ("anyone with the link") on OneDrive, Google Drive or Dropbox, forwarded far beyond the intended recipient.
- **Leaked access keys or SAS tokens** in code or logs, with long expiry and full permissions; see [API key management](/article/api-key-management-best-practices).
- **Forgotten resources**: test buckets with copies of production data.

## Guardrails

- **Block public access at the account or organisation level**: AWS S3 Block Public Access, Azure "allow blob anonymous access" disabled on storage accounts, and policies preventing exceptions without approval.
- **Policy as code**: AWS SCPs, Azure Policy and Google organisation policies that deny public storage settings.
- **Least-privilege access** through roles and managed identities rather than long-lived keys; short expiry for SAS tokens and presigned URLs.
- **Encryption** at rest (default on major clouds) and in transit, with customer-managed keys for sensitive data.
- **Collaboration settings**: restrict "anyone" links, set default sharing to internal, and expire external links.

## Find what's already exposed

- Cloud security posture tools (AWS Security Hub and Macie, Microsoft Defender for Cloud, Google Security Command Center) flag public storage and sensitive data.
- Sharing reports in Microsoft 365 or Google Workspace show files shared with "anyone".
- Periodic reviews of every storage account against an owner list.

## Monitor

Enable storage access logging and alert on public-access changes, policy changes and unusual download volumes. Send logs to your SIEM; see [log retention](/article/log-retention-siem-basics).

## FAQ

**Are cloud providers responsible for these leaks?**
Under the shared responsibility model, the provider secures the platform; configuring access is the customer's job.

**What if we need public files, like website images?**
Use a dedicated bucket or CDN for public content only, never mixed with private data.

## References

- [Blocking public access to your Amazon S3 storage (AWS documentation)](https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-control-block-public-access.html)
- [Prevent anonymous read access to blobs (Microsoft Learn)](https://learn.microsoft.com/en-us/azure/storage/blobs/anonymous-read-access-prevent)
