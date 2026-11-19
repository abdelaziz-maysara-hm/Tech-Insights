When a suspicious email lands in a mailbox, the visible part (sender name, subject, logo) is exactly what the attacker controls best. The full message headers tell a more honest story: which servers handled the message, whether authentication passed, and where replies would really go. This guide shows how to read them in a few minutes.

## Getting the full headers

- **Outlook (desktop):** open the message, then File > Properties, and copy the "Internet headers" box. In Outlook on the web, use the message's "View message source" or "View message details" option.
- **Gmail:** open the message, click the three-dot menu, then "Show original".

Copy the headers into a text editor. They read bottom to top: the oldest hop is at the bottom.

## The fields that matter

### From, Reply-To and Return-Path

- **From** is what users see. Anyone can write anything here.
- **Reply-To**, if present, is where replies go. A From of your CEO with a Reply-To at a free webmail address is a classic sign of business email compromise.
- **Return-Path** (the envelope sender) is where bounces go and what SPF checks. A mismatch with From isn't automatically bad, since mailing services use their own, but it is worth noting.

### Received lines

Each server that handled the message adds a `Received:` line at the top. Read from the bottom up to follow the path from the original sender to your server. Look for:

- the first external server, often showing the real sending IP;
- unexpected countries or hosting providers for a supposedly internal or local sender;
- time gaps that suggest queuing or replay.

Lines added before the message reached your own servers can be forged, so trust the ones your own gateway added most.

### Authentication-Results

Your receiving server adds an `Authentication-Results` header (RFC 8601) summarising checks:

```text
Authentication-Results: mx.example.com;
  spf=pass smtp.mailfrom=bounce.vendor.com;
  dkim=pass header.d=vendor.com;
  dmarc=pass header.from=vendor.com
```

What to look for:

- **dmarc=fail** on a message claiming to be from a well-known brand or your own domain is a strong warning.
- **spf=pass and dkim=pass for a different domain** than the From domain means the message is authenticated, just not *as* the brand it shows. Check the domain carefully.
- **All checks pass for a look-alike domain** such as `rnicrosoft-support.com`. Authentication proves who sent it, not that they are trustworthy.

If you are diagnosing your own domain's results, our [SPF analyzer](/tools/spf-record-analyzer) and [DMARC analyzer](/tools/dmarc-record-analyzer) explain the records behind them.

### Message-ID and X- headers

`Message-ID` usually contains the sending system's domain; one that doesn't match the claimed sender can be a hint. Vendor-specific `X-` headers, such as spam-filter verdicts, explain why your gateway let the message through.

## A 5-minute triage routine

1. Compare **From**, **Reply-To** and **Return-Path**. Do the domains make sense together?
2. Read **Authentication-Results**. Did DMARC pass for the domain shown in From?
3. Follow **Received** from the bottom. Where did the message really come from?
4. Hover over links without clicking and check the real destinations. Are they on the claimed brand's domain?
5. Check attachments by type and hash in your sandbox, never by opening them on a workstation.
6. Decide: report, block, purge similar messages, or close as benign.

Our [phishing awareness guide](/article/phishing-spot-before-click) covers what users should look for, and the [company email spam diagnosis guide](/article/company-email-spam-spf-dmarc-diagnosis) covers the opposite problem: legitimate mail being flagged.

## Common traps when reading headers

- **Trusting a pass blindly.** Attackers authenticate their own domains too.
- **Forwarded messages.** Forwarding can break SPF and sometimes DKIM. Look for ARC headers, which some providers add to preserve the original results.
- **Mailing services.** Newsletters legitimately send via third parties, so Return-Path and Received lines point to the service, not the brand.

## FAQ

### Can a sender fake the Received headers?

They can add fake lines before the message reaches your servers. The lines your own mail infrastructure added are reliable; anything below them is a claim.

### Is a message safe if SPF, DKIM and DMARC all pass?

It is genuinely from the domain that passed. Whether that domain is the organisation it claims to be is a separate question.

### Should users send headers to the security team?

Better to give them a report button that forwards the whole message as an attachment, so the security team gets headers and content intact.

## References

- [RFC 8601: Message Header Field for Indicating Message Authentication Status](https://www.rfc-editor.org/rfc/rfc8601)
- [RFC 5322: Internet Message Format](https://www.rfc-editor.org/rfc/rfc5322)
- [Microsoft Support: View internet message headers in Outlook](https://support.microsoft.com/en-us/office/view-internet-message-headers-in-outlook-cd039382-dc6e-4264-ac74-c048563d212c)
- [Google: Trace an email with its full headers](https://support.google.com/mail/answer/29436)
