---
title: Spotting Phishing Before You Click: A Field Guide for Staff and IT
excerpt: The tells that give phishing away (pressure, mismatched senders, odd links and attachments), what to do with a suspicious message, and how IT makes reporting easy.
---

Phishing works because it borrows trust. The message looks like it came from your bank, your CEO or Microsoft, and it asks you to act before you think. Filters catch most of it. What gets through has to be caught by people, so it helps to know exactly what to look for.

## Five questions to ask before you click

1. **Is it trying to rush me?** "Your account will be closed in 24 hours", "wire this before the auditor arrives". Urgency is the most reliable tell.
2. **Who really sent it?** Look at the actual address, not the display name. `IT Support <helpdesk@micros0ft-support.co>` is not your IT team.
3. **Where does the link go?** Hover (or long-press on mobile) to see the real URL. Watch for look-alike domains and login pages hosted on file-sharing or form services.
4. **Was I expecting this attachment?** Unexpected invoices, voicemails and "scanned documents" are classic lures, especially archives, HTML files and macro-enabled documents.
5. **Does the request make sense?** A supplier changing bank details by email or a manager asking for gift cards should always be verified through a different channel.

## Phishing that doesn't look like email

- **Smishing and voice calls**: texts with delivery or bank links; callers posing as the helpdesk asking you to approve an MFA prompt.
- **QR codes** in emails or posters that lead to credential-harvesting pages.
- **Collaboration tools**: messages in Teams or Slack from external "IT" accounts.
- **MFA push spam**: a flood of approval requests. Never approve one you didn't start; see [MFA fatigue attacks](/article/mfa-fatigue-attacks-explained).

## If you think you've received one

- Don't click, reply or forward it to colleagues "to check".
- Use the **Report** button in your mail client, or send it to the address IT gave you.
- If you already clicked or entered a password, tell IT straight away. Minutes matter, and nobody should be punished for reporting fast.

## What IT should put in place

- A one-click report button that feeds a mailbox someone actually triages.
- External-sender banners, and DMARC on your own domains so attackers can't send as you (see [SPF, DKIM and DMARC explained](/article/spf-dkim-dmarc-email-basics)).
- Phishing-resistant MFA for high-risk accounts.
- Realistic training and simulations that measure reporting, not just clicks. See [phishing simulation programmes](/article/phishing-simulation-training-programs).

## FAQ

**Is a padlock in the browser proof a site is safe?**
No. It only means the connection is encrypted. Phishing sites routinely use valid certificates.

**What if the email comes from a real colleague's account?**
Accounts get compromised. If the request is unusual, confirm it by phone or chat using details you already have.

## References

- [Recognize and report phishing (CISA)](https://www.cisa.gov/secure-our-world/recognize-and-report-phishing)
