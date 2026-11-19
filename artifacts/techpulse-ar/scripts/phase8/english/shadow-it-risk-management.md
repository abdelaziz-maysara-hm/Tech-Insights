---
title: Shadow IT: Finding Unapproved Tools and Bringing Them Under Control
excerpt: Why staff adopt tools IT didn't approve, the data and access risks that follow, how to discover shadow SaaS and AI use, and a governance approach that doesn't drive it further underground.
---

Shadow IT is any software, cloud service or device used for work without IT's knowledge or approval: a free file-sharing site, a personal AI assistant, a team's own project tool paid on a credit card. It usually starts with someone trying to get work done faster, not with bad intent.

## The risks

- **Data leaving your control**: company documents in personal accounts, customer data pasted into unvetted AI tools.
- **No offboarding**: when someone leaves, their access to the unofficial tool (and the data in it) leaves with them.
- **Weak authentication**: no SSO, no MFA, reused passwords.
- **Compliance gaps**: data stored in unknown regions, or processed without the agreements regulations require.
- **Integration sprawl**: OAuth apps granted access to mailboxes or files with broad permissions.

## Discovering it

- **Network and proxy logs**: secure web gateways and firewalls can report which cloud apps are in use. CASB tools such as Microsoft Defender for Cloud Apps categorise and risk-score them.
- **OAuth app consents**: review third-party apps users have authorised in Microsoft 365 or Google Workspace, and restrict user consent to verified publishers or low-risk permissions.
- **Expense reports and card statements** reveal paid subscriptions.
- **Ask people.** A simple survey often finds more than tooling.

## Governing it without a crackdown

1. **Understand the need**: find out why the tool was adopted. Often there's a gap in the approved toolset.
2. **Offer a fast approval path**: a lightweight review (data handled, SSO/MFA, vendor security, contract) measured in days, not months.
3. **Provide approved alternatives**, including sanctioned AI tools with data-protection terms; see [using AI assistants safely](/article/chatgpt-study-without-harm).
4. **Classify apps**: sanctioned, tolerated with limits, blocked. Block only high-risk ones.
5. **Bring adopted tools under management**: SSO, central billing, admin ownership, data export.
6. **Set expectations in policy** and training, linked to your [data classification](/article/data-classification-basics) scheme.

## FAQ

**Should we just block everything unapproved?**
Blanket blocking pushes usage to personal devices and phones, where you see even less. Visibility plus good alternatives works better.

**Is shadow IT always bad?**
It's a signal of unmet needs. Some of today's standard tools started as shadow IT.

## References

- [Discover and manage shadow IT (Microsoft Learn)](https://learn.microsoft.com/en-us/defender-cloud-apps/tutorial-shadow-it)
