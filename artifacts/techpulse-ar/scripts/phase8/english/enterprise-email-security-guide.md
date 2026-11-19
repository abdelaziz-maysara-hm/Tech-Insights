---
title: Enterprise Email Security: The Complete Guide to SPF, DKIM, DMARC and Inbound Defence
excerpt: A working plan for securing corporate email end to end: authenticating your own domain with SPF, DKIM and DMARC, filtering what arrives, protecting mailboxes from takeover and handling a reported phish from first click to closure.
---

Most serious incidents still begin with an email. A fake invoice, a shared-document lure, a password-reset page that looks right, a supplier whose mailbox was quietly taken over months ago. Email is old, open by design and trusted by everyone, which makes it the cheapest way into an organisation.

Securing it is not one product. It is three separate jobs that are often confused:

1. **Proving your own mail is genuine**, so nobody can send convincing mail as your domain.
2. **Inspecting what arrives**, so malicious messages are blocked, flagged or neutralised.
3. **Protecting the mailboxes themselves**, so a stolen password doesn't turn a real account into a weapon.

This guide works through each job, then covers what to do when something gets through anyway.

## Job one: make your domain hard to forge

The SMTP protocol lets any server claim to be sending from any domain. Three DNS-published standards close that gap. They only work well together.

### SPF: an allow list of sending servers

Sender Policy Framework (RFC 7208) is a TXT record listing the servers and services allowed to send mail for your domain. A receiving server compares the connecting IP with that list.

Things that trip teams up:

- **The ten-lookup limit.** Every `include:` and similar mechanism costs DNS lookups, and the standard caps evaluation at ten. Add a CRM, a ticketing system, a marketing platform and a payroll provider, and you can cross the limit without noticing. The result is a permanent error, which many receivers treat as a failure.
- **It checks the wrong address for users.** SPF validates the hidden envelope sender (Return-Path), not the From address people see. On its own it does nothing against display-level spoofing.
- **Forwarding breaks it.** When a message is forwarded, it arrives from the forwarder's IP, which is not in your record.

Test your record with the [SPF record analyzer](/tools/spf-record-analyzer) every time a new sending service is added.

### DKIM: a signature that survives the trip

DomainKeys Identified Mail (RFC 6376) has the sending server sign selected headers and the body with a private key. The public key is published in DNS under a selector, for example `selector1._domainkey.example.com`. The receiver checks the signature, so DKIM survives plain forwarding as long as the message isn't modified.

Good practice:

- Use 2048-bit keys where the provider supports them.
- Give every third-party sender its own selector, so one can be revoked without touching the others.
- Rotate keys on a schedule and remove selectors for services you no longer use.

### DMARC: the rule that ties it to the visible From

DMARC is what finally protects the address users actually read. The current standard is RFC 9989, published in May 2026, which replaces the original RFC 7489. A message passes DMARC when SPF or DKIM passes **and** the domain that passed is aligned with the From domain. The record also tells receivers what to do with failures (`p=none`, `p=quarantine` or `p=reject`) and where to send reports (`rua=`).

`p=none` changes nothing about delivery. It is a monitoring stage, not protection. Many organisations publish it, feel finished and stay there for years. The goal is `p=reject`, reached in stages once the reports show every legitimate sender is passing. The detailed rollout is in [DMARC from p=none to p=reject](/article/dmarc-rollout-none-to-reject), the fundamentals are in [SPF, DKIM and DMARC basics](/article/spf-dkim-dmarc-email-basics), and you can check your current record with the [DMARC record analyzer](/tools/dmarc-record-analyzer).

### What the big mailbox providers now expect

Since 2024, Google requires anyone sending more than about 5,000 messages a day to personal Gmail accounts to have SPF, DKIM and a DMARC record, with the From domain aligned, plus one-click unsubscribe for marketing mail and a low spam-complaint rate. Other large providers have moved in the same direction. In practice, authentication is no longer optional for anyone sending newsletters, notifications or invoices at scale. Check the current rules on the provider pages in the references, since thresholds change.

### Layers worth adding after DMARC

- **MTA-STS (RFC 8461)** tells other servers that mail to your domain must be delivered over verified TLS, which blocks downgrade attacks. Pair it with TLS reporting so you see failures.
- **BIMI** can display your logo in some mail clients, but only once DMARC is at enforcement. Treat it as a reward for finishing the work, not as a security control.
- **Parked domains** need protection too. A domain that never sends mail should publish an SPF record of `v=spf1 -all` and a DMARC record with `p=reject`.

## Reading DMARC reports without drowning

Aggregate reports arrive as daily XML files from each receiver. Nobody should read them raw; send them to a parser or reporting service. What to look for:

- **Volume by source IP.** Map every source to a known service. Anything unknown is either a forgotten legitimate system or someone spoofing you.
- **Alignment failures from known services.** Usually a vendor sending with its own Return-Path and no DKIM key for your domain. Fix by adding a custom DKIM selector for that vendor.
- **Forwarding noise.** Mailing lists and forwarders show up as SPF failures with DKIM passing. That is normal and is the main reason DKIM matters.

When known sources are all aligned for several weeks, move up a policy level.

## Job two: inspect what arrives

Authentication only proves who sent a message, not whether it is safe. A criminal with a freshly registered look-alike domain can pass SPF, DKIM and DMARC perfectly.

### Filtering layers

Whether you use a dedicated gateway or the protection built into your mail platform, the capabilities to confirm are:

- reputation and content filtering for spam and known phishing;
- attachment detonation in a sandbox before delivery;
- URL rewriting with time-of-click checks, since many links are weaponised after delivery;
- impersonation detection for executives and key suppliers, including look-alike domains;
- external-sender banners or tags so users can see a message came from outside.

For Microsoft 365 tenants, the built-in Defender for Office 365 features cover much of this, and a separate gateway is often a choice about policy control and reporting rather than raw detection. See [email security gateway basics](/article/email-security-gateway-basics) for how to compare options.

### Business email compromise

The most expensive email attacks often carry no malware at all. A message asks finance to change a supplier's bank details or a manager to buy gift cards. Filters struggle with these because there is nothing technically malicious to find. The defence is process: any change to payment details is confirmed by phone using a number already on file, never one from the email.

## Job three: protect the mailboxes

A stolen password lets attackers send from a genuine account, which defeats every authentication check above.

- **Require MFA for every mailbox**, and prefer phishing-resistant methods (security keys, passkeys, Windows Hello for Business) for administrators and finance staff. Compare methods in the [practical 2FA guide](/article/2fa-practical-guide).
- **Block legacy authentication protocols** that can't do MFA.
- **Alert on new inbox rules** that forward externally, delete messages or move them to obscure folders. Attackers create these within minutes of gaining access.
- **Restrict OAuth app consent** so users can't grant mailbox access to unknown third-party apps.
- **Turn off automatic external forwarding** by default and allow it by exception.

### Users as sensors, not scapegoats

Training works best when it makes reporting easy and rewarded. A one-click report button and a fast, friendly response do more than fear. Build the programme from [spotting phishing before you click](/article/phishing-spot-before-click), [phishing simulation programmes](/article/phishing-simulation-training-programs) and [measuring security awareness](/article/security-awareness-training-metrics). The metric that matters most is how quickly the first person reports a real phish.

## When a phish gets through

A practical sequence for a reported message:

1. **Triage.** Check headers, sender, links and attachments in a safe environment. Is it a real campaign?
2. **Scope.** Search all mailboxes for the same sender, subject or URL. Note who received it, who clicked and who entered credentials.
3. **Remove.** Purge the messages from every mailbox and block the sender, domain and URLs.
4. **Contain accounts.** For anyone who entered a password: reset it, revoke active sessions and tokens, review MFA methods for newly added devices and check inbox rules and app consents.
5. **Hunt.** Look for sign-ins from unusual locations and for internal phishing sent from compromised accounts.
6. **Close and learn.** Thank the reporter, record the timeline and adjust filtering rules.

The full incident process, including severity and communication, is in the [SOC and incident response guide](/article/soc-incident-response-guide).

## A one-page checklist

- [ ] SPF lists every sending service and stays under ten lookups.
- [ ] DKIM is signed for the main platform and each third-party sender, with 2048-bit keys.
- [ ] DMARC reports are parsed and reviewed; policy is on a written path to `p=reject`.
- [ ] Non-sending domains publish `-all` and `p=reject`.
- [ ] MTA-STS and TLS reporting are in place.
- [ ] Attachment sandboxing and time-of-click URL checks are on.
- [ ] MFA is enforced and legacy authentication is blocked.
- [ ] Alerts exist for external forwarding rules and risky OAuth consents.
- [ ] Payment-detail changes require call-back verification.
- [ ] Users have a report button and a known response time.

## FAQ

### Does DMARC at p=reject stop phishing?

It stops exact spoofing of your own domain. It does nothing against look-alike domains, compromised supplier accounts or free webmail addresses using your company name. You still need filtering and user reporting.

### Why does a service pass SPF but still fail DMARC?

Usually alignment. The vendor sends with its own domain in the Return-Path, so SPF passes for the vendor's domain, not yours. Ask the vendor to sign with a DKIM key under your domain, or to use a custom Return-Path on a subdomain you control.

### How long should the move to p=reject take?

It depends on how many services send as you. A small organisation with one mail platform can get there in a few weeks. A large one with many forgotten senders may need several months of report review. The risk is stalling, not going slowly.

### Is a gateway still needed on Microsoft 365 or Google Workspace?

Not always. The built-in protections are strong. A separate gateway makes sense when you need policy features, reporting or multi-platform coverage that the built-in tools don't provide.

## References

- [RFC 7208: Sender Policy Framework (SPF)](https://datatracker.ietf.org/doc/html/rfc7208)
- [RFC 6376: DomainKeys Identified Mail (DKIM) Signatures](https://datatracker.ietf.org/doc/html/rfc6376)
- [RFC 9989: Domain-based Message Authentication, Reporting, and Conformance (DMARC)](https://www.rfc-editor.org/rfc/rfc9989)
- [RFC 8461: SMTP MTA Strict Transport Security (MTA-STS)](https://datatracker.ietf.org/doc/html/rfc8461)
- [Google: Email sender guidelines](https://support.google.com/a/answer/81126)
- [Microsoft Learn: Set up DMARC to validate the From address domain](https://learn.microsoft.com/en-us/defender-office-365/email-authentication-dmarc-configure)
