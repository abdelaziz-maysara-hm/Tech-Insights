"Our invoices are going to customers' junk folders" is one of the most common tickets an IT team gets, and one of the most guessed-at. People start editing the SPF record before they know what failed. Don't. The receiving server has already written down why it distrusted your message. Read that first.

## 1. Get the verdict from a real message

Send a test to a Gmail and an Outlook.com mailbox. In Gmail use **Show original**; in Outlook view the message source. Find the `Authentication-Results` header:

```
Authentication-Results: mx.google.com;
  dkim=pass header.i=@example.com header.s=s1;
  spf=softfail smtp.mailfrom=bounce.mailer.example.net;
  dmarc=fail (p=QUARANTINE) header.from=example.com
```

Read it like a lab result. Here DKIM passed, SPF soft-failed for a third-party bounce domain, and DMARC failed. That tells you to look at alignment, not at your MX records.

## 2. SPF: one record, ten lookups, every sender

```bash
dig +short TXT example.com | grep spf1
```

What usually goes wrong:

- **Two SPF records** on the same name. Receivers treat that as a permanent error.
- **More than ten DNS-querying mechanisms** (`include`, `a`, `mx`, `redirect`, and so on), the limit set in RFC 7208. Each marketing tool adds its own `include` until you go over.
- **A forgotten sender**: the billing platform, the HR system, the scanner that emails PDFs.
- **`+all`** at the end, which authorises the entire internet.

## 3. DKIM: passing is not the same as aligning

A DKIM pass only helps DMARC when the signing domain (`d=`) is your From domain or a subdomain of it. Many SaaS senders sign with their own domain by default. Turn on custom-domain DKIM in each platform and publish the CNAME or TXT records it gives you. In Microsoft 365, enable DKIM signing for every custom domain from the Defender portal.

## 4. DMARC under the new standard

DMARC was republished as **RFC 9989** in May 2026, replacing RFC 7489. Two practical consequences:

- The `pct` tag has been removed from the specification. The new `t=y` testing flag replaces it. Some receivers still honour legacy `pct`, but don't plan a rollout around it.
- The path is unchanged: publish `p=none` with `rua` reporting, find every legitimate source, then move to quarantine and reject. Our [DMARC rollout guide](/article/dmarc-rollout-none-to-reject) walks through it.

## 5. When authentication passes and mail still lands in junk

At that point the problem is reputation or content:

| Check | How |
|---|---|
| Reverse DNS | The sending IP has a PTR record that matches its hostname |
| Blocklists | Check the IP and domain against major DNS blocklists |
| Complaint rate | Google Postmaster Tools; Google asks bulk senders to stay below 0.3% reported spam |
| Stream separation | Send marketing from a subdomain so a bad campaign doesn't sink invoices |

## Mailbox provider requirements

Since 2024, Google and Yahoo require bulk senders (over 5,000 messages a day to their users) to authenticate with SPF and DKIM, publish DMARC at `p=none` or stronger, and offer one-click unsubscribe on marketing mail. Microsoft announced similar requirements for Outlook.com consumer domains in 2025. Even at lower volumes, treat these as the baseline.

For the bigger picture of protecting mail, not just delivering it, see the [enterprise email security guide](/article/enterprise-email-security-guide).

## FAQ

**SPF passes but DMARC fails. How?**
SPF is evaluated against the envelope sender (Return-Path), not the visible From. If your email platform uses its own bounce domain, SPF passes for *them*, not for you.

**Is DKIM optional if SPF is clean?**
No. Forwarding breaks SPF; a DKIM signature usually survives it.

**How long does reputation take to recover?**
Days to weeks of consistent, clean sending. There is no reset button.

## References

- [Email sender guidelines (Google Workspace Admin Help)](https://support.google.com/mail/answer/81126)
- [RFC 9989: Domain-based Message Authentication, Reporting, and Conformance (DMARC)](https://www.rfc-editor.org/rfc/rfc9989)
- [RFC 7208: Sender Policy Framework (SPF)](https://www.rfc-editor.org/rfc/rfc7208)
- [Email authentication in Microsoft 365 (Microsoft Learn)](https://learn.microsoft.com/defender-office-365/email-authentication-about)
