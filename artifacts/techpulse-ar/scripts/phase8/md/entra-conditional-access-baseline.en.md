Turning on MFA is the easy part. The breaches we keep reading about happen in the gaps: an app nobody included in the policy, a legacy protocol that can't prompt for a second factor, a rule scoped to "Office 365" instead of everything. Conditional Access is how you close those gaps deliberately.

## What you need

Conditional Access requires Microsoft Entra ID P1 or higher (included in Microsoft 365 Business Premium, E3 and E5). Without it, switch on **security defaults**, which enforce MFA and block legacy authentication with no customisation. Small tenants should do that today.

## Why "all resources" matters: a 2026 example

In July 2026 Huntress described a password-spraying campaign through the Azure CLI client. More than 81 million attempts over ten days compromised 78 accounts across 64 organisations. The attackers used the legacy OAuth resource owner password credentials (ROPC) flow, which skips MFA when Conditional Access doesn't cover every cloud app. Many of the victims had MFA on email. They didn't have it on *everything*.

## Step zero: break-glass accounts

Before any policy, create at least two cloud-only emergency access accounts with Global Administrator. Exclude them from every policy, protect them with FIDO2 keys or certificate-based authentication, and alert on every sign-in. One bad policy without these can lock the whole IT team out of the tenant.

## The baseline set

Microsoft ships templates under **Entra admin center → Entra ID → Conditional Access → Create new policy from templates**, and they are created in report-only mode by default. Start with these five:

| Policy | Why |
|---|---|
| Require MFA for admins | Privileged roles are the first target. Plan to move them to phishing-resistant MFA. |
| Block legacy authentication | Basic-auth protocols can't do MFA, so they're a permanent bypass. |
| Require MFA for all users | Target **All resources**, not a hand-picked list of apps. |
| Require MFA for Azure management | Covers the portal, Azure CLI and Azure PowerShell. |
| Securing security info registration | Stops an attacker with a password from enrolling their own authenticator. |

Microsoft is also enforcing mandatory MFA for Azure sign-ins itself: the admin portals since 2024, and Azure CLI, PowerShell and IaC tools for create, update and delete operations since October 1, 2025. Treat that as a backstop, not as your policy.

## The second layer

Once the baseline is stable:

- Require a compliant or hybrid-joined device for sensitive apps (with Intune).
- Risk-based policies for risky sign-ins and high-risk users (requires Entra ID P2).
- Block unknown or unsupported device platforms.
- Separate MFA requirements for guests.

## Roll it out without breaking Monday morning

1. Create each policy in report-only mode.
2. Watch sign-in logs for one to two weeks. Who would be blocked? Which apps still use legacy auth?
3. Test edge cases with the **What If** tool.
4. Enable for a pilot group, then everyone.
5. Review exclusions quarterly. Temporary exclusions tend to become permanent.

For the on-premises half of identity, see the [Active Directory and identity security guide](/article/active-directory-identity-security-guide). For why push-notification MFA alone isn't the finish line, read about [MFA fatigue attacks](/article/mfa-fatigue-attacks-explained).

## FAQ

**Should service accounts be excluded?**
User accounts used as service accounts are a liability. Replace them with managed identities or service principals and use Conditional Access for workload identities.

**Are security defaults good enough?**
For small organisations without P1, yes, as a starting point. They don't allow exclusions or custom conditions.

**We still see "classic policies" in the portal.**
Microsoft says classic policies stopped enforcing controls after July 10, 2024. Document their settings, recreate them as modern policies, then disable them.

## References

- [Conditional Access templates (Microsoft Learn)](https://learn.microsoft.com/entra/identity/conditional-access/concept-conditional-access-policy-common)
- [Manage emergency access accounts in Microsoft Entra ID (Microsoft Learn)](https://learn.microsoft.com/entra/identity/role-based-access-control/security-emergency-access)
- [Plan for mandatory Microsoft Entra multifactor authentication (Microsoft Learn)](https://learn.microsoft.com/entra/identity/authentication/concept-mandatory-multifactor-authentication)
- [Block legacy authentication with Conditional Access (Microsoft Learn)](https://learn.microsoft.com/entra/identity/conditional-access/policy-block-legacy-authentication)
- [Massive password spray campaign targeting Azure CLI (SecurityWeek, July 2026)](https://www.securityweek.com/massive-password-spray-campaign-targeting-azure-cli/)
