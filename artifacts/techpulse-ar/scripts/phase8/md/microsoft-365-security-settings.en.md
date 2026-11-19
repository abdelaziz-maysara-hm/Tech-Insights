Most Microsoft 365 compromises don't involve an exploit. They involve a phished password and a default nobody revisited. The fifteen settings below are ordered by impact, so if you only get through the first five this week, you've still closed the biggest doors. Licence requirements are noted where they apply.

## Identity

1. **MFA for everyone.** Use Conditional Access with Entra ID P1, or security defaults without it. Our [Conditional Access baseline](/article/entra-conditional-access-baseline) has the policy set.
2. **Block legacy authentication.** Protocols that can't prompt for MFA are a standing bypass.
3. **Two break-glass accounts.** Cloud-only, excluded from policies, protected with FIDO2 keys, with alerts on every sign-in.
4. **Password protection and SSPR.** Turn on Microsoft Entra Password Protection to ban common weak passwords, and require two methods for self-service reset.

## Administrators

5. **Few Global Administrators.** Microsoft recommends fewer than five. Use narrower roles (Exchange Administrator, User Administrator) for day-to-day work.
6. **Separate admin accounts.** Admins read mail and browse with a normal account, and administer with a separate, mailbox-less one.
7. **Privileged Identity Management** (Entra ID P2). Make high privilege just-in-time and time-limited instead of permanent.

## Applications

8. **Restrict user consent.** Consent phishing tricks users into granting a malicious app access to their mailbox. Allow user consent only for verified publishers and low-risk permissions, and turn on the **admin consent workflow** for everything else.

## Email

9. **Stop automatic external forwarding.** A hidden forwarding rule is one of the first things an attacker sets up in a compromised mailbox. Block external auto-forwarding in the outbound spam policy, with named exceptions only.
10. **Preset security policies.** In Defender for Office 365, apply the Standard or Strict preset to get Microsoft's recommended anti-phishing, Safe Links and Safe Attachments settings in one step.
11. **DKIM and DMARC on every domain.** Sign with DKIM for each custom domain and publish DMARC. If mail starts landing in junk, see [diagnosing SPF, DKIM and DMARC](/article/company-email-spam-spf-dmarc-diagnosis).

## Sharing and collaboration

12. **Tighten SharePoint and OneDrive sharing.** Move the default from "Anyone" links to existing or new guests (or narrower) and set link expiry.
13. **Review Teams external access.** Allow-list partner domains if your business allows it.

## Auditing and monitoring

14. **Confirm the unified audit log is on.** It's on by default for most modern tenants, but verify it in Microsoft Purview. Without it, there is no incident investigation.
15. **Review Secure Score and alert policies monthly.** Secure Score gives you a ranked to-do list. Alert policies flag events like new forwarding rules or admin role grants.

For the wider email picture, including gateways and user reporting, see the [enterprise email security guide](/article/enterprise-email-security-guide).

## FAQ

**Is Business Basic enough?**
You can do a lot: security defaults, sharing limits, blocking forwarding, DKIM. Conditional Access and Defender for Office 365 need higher plans such as Business Premium.

**Short on time. Where do I start?**
Items 1, 2, 5 and 9: MFA, legacy auth blocked, fewer global admins, no external auto-forwarding.

**Will users notice?**
Some changes, mainly MFA, are visible. Announce them first and pilot with a small group.

## References

- [Best practices for Microsoft Entra roles (Microsoft Learn)](https://learn.microsoft.com/entra/identity/role-based-access-control/best-practices)
- [Preset security policies in EOP and Defender for Office 365 (Microsoft Learn)](https://learn.microsoft.com/defender-office-365/preset-security-policies)
- [Configure how users consent to applications (Microsoft Learn)](https://learn.microsoft.com/entra/identity/enterprise-apps/configure-user-consent)
- [Microsoft Secure Score (Microsoft Learn)](https://learn.microsoft.com/defender-xdr/microsoft-secure-score)
