---
title: DMARC from p=none to p=reject Without Breaking Your Own Email
excerpt: A phased DMARC rollout under RFC 9989: monitor with aggregate reports, fix every legitimate sender's alignment, test quarantine with t=y, then enforce reject, plus lock down parked domains on day one.
---

Publishing `p=reject` on day one is the fastest way to discover that the billing system, the marketing platform and the scan-to-email printers all send mail as your domain, because customers stop receiving it. A phased rollout gets you to full spoofing protection without that outage. New to the concepts? Start with [SPF, DKIM and DMARC explained](/article/spf-dkim-dmarc-email-basics).

## Phase 1: observe (p=none), two weeks to two months

Publish a monitoring record:

```text
_dmarc.example.com.  TXT  "v=DMARC1; p=none; rua=mailto:dmarc@example.com; fo=1"
```

- **rua** receives daily aggregate reports (XML) from receivers. If the address is on another domain, that domain must publish an authorisation record to accept your reports.
- **fo=1** asks for failure reports when SPF or DKIM fails; many large providers don't send them, for privacy reasons.
- Feed reports into an analysis tool; reading raw XML doesn't scale.

Validate the record with our [DMARC record analyzer](/tools/dmarc-record-analyzer).

## Phase 2: find every sender and fix alignment

Sort each source in the reports:

| Source | What to do |
|---|---|
| Legitimate and aligned | Nothing |
| Legitimate but failing | Enable DKIM signing with your domain, or authorise it in SPF with a custom Return-Path on your domain |
| Forwarders and mailing lists | Usually pass on DKIM, so make sure DKIM is on |
| Unknown | Ask internally; if nobody owns it, it's what enforcement will stop |

Practical points:

- **Prefer DKIM alignment.** It survives forwarding; SPF doesn't.
- **Mind SPF's 10-DNS-lookup limit** as you add services; check with the [SPF record analyzer](/tools/spf-record-analyzer).
- **Subdomains** inherit the main policy unless you set `sp=`.

## Phase 3: quarantine in test mode

When legitimate mail has been passing at close to 100% for several weeks:

```text
_dmarc.example.com.  TXT  "v=DMARC1; p=quarantine; t=y; rua=mailto:dmarc@example.com"
```

**RFC 9989** (May 2026), which replaced RFC 7489, removed the old `pct` percentage tag and added the **testing tag `t`**. With `t=y`, receivers apply one step less than your stated policy: `quarantine` is handled like `none`, and `reject` like `quarantine`, while reports keep flowing. After at least two clean weeks, remove `t=y` (or set `t=n`) to enforce quarantine. Some receivers may still honour a legacy `pct`, but don't design a ramp around it; percentage sampling was rarely applied consistently.

## Phase 4: reject

```text
_dmarc.example.com.  TXT  "v=DMARC1; p=reject; rua=mailto:dmarc@example.com"
```

Optionally test this step first with `p=reject; t=y`, which receivers treat as quarantine. Keep reading reports after enforcement. New SaaS tools adopted without IT will fail, so add "configure SPF/DKIM for our domain" to the procurement checklist for anything that sends email.

## Parked domains: protect them now

Domains that never send email can be locked down immediately:

```text
parked-example.com.         TXT  "v=spf1 -all"
_dmarc.parked-example.com.  TXT  "v=DMARC1; p=reject"
```

## A realistic timeline

| Week | State |
|---|---|
| 0 | p=none with rua; parked domains at reject |
| 2–6 | Inventory senders, fix DKIM and SPF |
| 6–8 | p=quarantine with t=y |
| 8–10 | p=quarantine enforced |
| 10–12 | p=reject (optionally a short t=y step first) |

The real pace depends on how many senders you have and how quickly their owners respond.

## FAQ

### Isn't p=none enough for Google and Yahoo?

Since February 2024 their bulk-sender rules require a DMARC record (p=none is acceptable) plus alignment. But p=none protects nobody from spoofing; protection starts at quarantine.

### What if legitimate mail fails after enforcement?

Fix the sender's DKIM or SPF quickly. If the impact is large, step back to quarantine temporarily and record why.

### Does our DMARC record affect inbound mail?

No. It tells other receivers how to treat mail claiming to be from your domain. Inbound checks follow the senders' policies.

## References

- [RFC 9989: Domain-based Message Authentication, Reporting, and Conformance (DMARC)](https://www.rfc-editor.org/rfc/rfc9989)
- [Google Workspace Admin Help: Set up DMARC](https://support.google.com/a/answer/2466580)
- [Set up DMARC to validate the From address domain (Microsoft Learn)](https://learn.microsoft.com/en-us/defender-office-365/email-authentication-dmarc-configure)
- [Google: Email sender guidelines](https://support.google.com/a/answer/81126)
