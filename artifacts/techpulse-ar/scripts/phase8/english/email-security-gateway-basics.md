---
title: What an Email Security Gateway Actually Stops (and What Slips Through)
excerpt: How secure email gateways and cloud email security filter spam, malware and phishing, the gaps they leave, and the controls you still need around them.
---

Email remains the top delivery route for phishing and malware, so most organisations put a filter in front of the mailbox. That might be a traditional secure email gateway (SEG) that sits in the MX path, or an API-based cloud email security product that plugs into Microsoft 365 or Google Workspace. Either way, it's worth knowing exactly what it covers.

## What gateways do well

- **Spam and bulk mail**: reputation, content analysis and rate limits remove the noise.
- **Known malware**: signature and sandbox scanning of attachments.
- **Malicious links**: URL reputation, and time-of-click rewriting that rechecks a link when it's opened rather than only on delivery.
- **Authentication checks**: SPF, DKIM and DMARC evaluation of inbound mail, which catches a lot of spoofing.
- **Data loss rules** on outbound mail, such as blocking card numbers or tagging sensitive attachments.

## What gets through

- **Business email compromise (BEC)**: a plain-text request from a look-alike domain or a compromised partner account has no payload to detect.
- **Messages from legitimate services**: phishing links hosted on well-known file-sharing or form platforms.
- **Delayed weaponisation**: a link that was clean on delivery and turns malicious later (partly covered by time-of-click checks).
- **Anything outside email**: Teams, Slack, SMS and QR codes.

## Controls to pair with it

- **DMARC on your own domains**, so attackers can't spoof you to customers; see [rolling out DMARC](/article/dmarc-rollout-none-to-reject).
- **Process controls** for payments: bank-detail changes confirmed by phone, dual approval for large transfers (see [dual control](/article/dual-control-critical-operations)).
- **A report button** and someone who triages reports quickly, removing similar messages from all mailboxes.
- **Endpoint protection** for what reaches the device anyway.
- **Awareness training** focused on recognising requests, not just links; see [spotting phishing](/article/phishing-spot-before-click).

## FAQ

**Do we need a gateway if we use Microsoft 365?**
Built-in protection has improved a lot. Many organisations add a third-party layer for better BEC detection or management features. Test with your own mail flow before deciding.

**SEG or API-based?**
Gateways change MX records and filter before delivery; API products scan inside the mailbox and can pull messages after delivery. Some organisations combine both.

## References

- [Microsoft Defender for Office 365 overview (Microsoft Learn)](https://learn.microsoft.com/en-us/defender-office-365/mdo-about)
