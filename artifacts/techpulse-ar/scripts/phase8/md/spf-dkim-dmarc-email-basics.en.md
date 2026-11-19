SMTP was designed for a small, trusting network. Nothing in the original protocol stops a server anywhere from sending mail that says it's from `ceo@yourcompany.com`. SPF, DKIM and DMARC are the add-ons that let receivers check that claim. Each proves something different, and you need all three.

## What each one proves

**SPF: "this server may send for my domain."**
A DNS TXT record lists the servers and services allowed to send mail using your domain in the envelope sender (Return-Path):

```
example.com.  TXT  "v=spf1 include:spf.protection.outlook.com include:_spf.mailvendor.example -all"
```

Limits worth knowing: one SPF record per name, and no more than ten DNS-querying lookups (RFC 7208). SPF also breaks when mail is forwarded, because the forwarding server isn't on your list.

**DKIM: "this message was signed by my domain and hasn't been altered."**
Your mail server signs selected headers and the body with a private key. Receivers fetch the public key from DNS at `selector._domainkey.example.com` and verify the signature. DKIM usually survives forwarding, which is why it matters even when SPF is perfect.

**DMARC: "here's what to do when neither checks out, and tell me about it."**
DMARC adds the piece SPF and DKIM lack: **alignment** with the From address people actually see. A message passes DMARC if SPF or DKIM passes *and* the domain it passed for matches the visible From domain. The record also sets a policy and a reporting address:

```
_dmarc.example.com.  TXT  "v=DMARC1; p=none; rua=mailto:dmarc-reports@example.com"
```

DMARC is now specified in **RFC 9989** (May 2026), which replaced RFC 7489. Among other changes it removed the `pct` tag and added a `t=y` testing flag.

## Why alignment is the part people miss

A marketing platform can pass SPF and DKIM for *its own* domain while sending as yours. Without alignment, that's indistinguishable from a spoofer who also authenticated their own domain. Configure custom-domain DKIM on every service that sends as you so the signature aligns.

## A safe deployment order

1. **Inventory senders.** Mail servers, Microsoft 365 or Google Workspace, CRM, ticketing, billing, scanners, website forms.
2. **Publish SPF** covering them, ending in `-all` or `~all`. Never `+all`.
3. **Enable DKIM** on each platform with your own domain.
4. **Publish DMARC at `p=none`** with aggregate reports and read them for a few weeks.
5. **Fix stragglers** the reports reveal.
6. **Move to quarantine, then reject.** Our [DMARC rollout guide](/article/dmarc-rollout-none-to-reject) covers the steps, including the new testing flag.

Domains that never send email should still publish `v=spf1 -all` and a DMARC `p=reject` record so they can't be spoofed.

If legitimate mail is already landing in spam, use the [SPF, DKIM and DMARC diagnosis guide](/article/company-email-spam-spf-dmarc-diagnosis).

## FAQ

**Does DMARC stop all phishing?**
No. It stops exact-domain spoofing. Look-alike domains (examp1e.com) need other controls, such as gateway filtering and user reporting.

**Is `~all` or `-all` better?**
With DMARC enforcing, the difference matters less; many teams use `~all` during rollout and `-all` once the sender list is stable.

**Do Google and Microsoft require this?**
Bulk senders to Gmail, Yahoo and Outlook.com consumer addresses must authenticate with SPF and DKIM and publish DMARC. Everyone else benefits anyway.

## References

- [RFC 7208: Sender Policy Framework (SPF)](https://www.rfc-editor.org/rfc/rfc7208)
- [RFC 6376: DomainKeys Identified Mail (DKIM) Signatures](https://www.rfc-editor.org/rfc/rfc6376)
- [RFC 9989: DMARC](https://www.rfc-editor.org/rfc/rfc9989)
