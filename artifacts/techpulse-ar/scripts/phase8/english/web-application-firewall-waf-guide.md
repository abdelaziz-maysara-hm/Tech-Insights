---
title: Web Application Firewalls: What a WAF Blocks and When It's Worth Deploying
excerpt: How WAFs inspect HTTP traffic with signatures, rule sets and anomaly scoring, deployment options from cloud to on-prem, tuning without breaking the app, and why a WAF complements secure code rather than replacing it.
---

A network firewall decides which ports and addresses can talk. A web application firewall looks inside HTTP and HTTPS requests and decides whether their **content** looks like an attack: SQL injection in a form field, a script tag in a parameter, a path traversal in a URL.

## How a WAF decides

- **Signatures and managed rule sets**: patterns for known attack techniques. The OWASP Core Rule Set (CRS) is the widely used open-source baseline; cloud WAFs ship their own managed rules.
- **Anomaly scoring**: each suspicious trait adds points, and the request is blocked above a threshold. This reduces false positives compared with blocking on any single match.
- **Positive security / allow-listing**: only expected methods, paths and parameter formats are allowed. Strong but laborious.
- **Bot management and rate limiting**: challenge or slow automated traffic; see [API rate limiting](/article/api-rate-limiting-basics).
- **Virtual patching**: a rule that blocks exploitation of a known vulnerability until the application is fixed.

## Deployment options

- **Cloud/CDN WAF** (Cloudflare, AWS WAF, Azure Front Door/Application Gateway WAF, Akamai): easy to adopt, absorbs volume, sits in front of the origin.
- **Appliance or virtual appliance** (F5, FortiWeb, Imperva and others) in your data centre.
- **Host or module** (ModSecurity-compatible engines with NGINX or Apache).

With a cloud WAF, lock down the origin so it accepts traffic only from the WAF; otherwise attackers simply bypass it.

## Tuning without breaking things

1. Start in **detection/log-only mode**.
2. Review hits and create narrow exclusions for legitimate traffic (for example, a rich-text field that legitimately contains HTML).
3. Switch to **blocking**, starting with high-confidence rules.
4. Keep tuning after application releases.

## When it's worth it

- Public web apps and APIs handling logins, payments or personal data.
- Legacy apps you can't easily fix.
- Compliance needs: PCI DSS accepts an automated technical solution such as a WAF for public-facing web applications.

## What it doesn't do

A WAF can't fix business-logic flaws or broken authorization, where requests look perfectly normal. It also adds a component to maintain. Secure code is still the foundation; see [OWASP Top 10](/article/owasp-top-10-overview) and [XSS](/article/cross-site-scripting-xss-basics).

## FAQ

**Does a WAF inspect HTTPS?**
Yes, it terminates TLS (or receives decrypted traffic) to inspect requests.

## References

- [OWASP Core Rule Set](https://coreruleset.org/)
- [AWS WAF Developer Guide](https://docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html)
