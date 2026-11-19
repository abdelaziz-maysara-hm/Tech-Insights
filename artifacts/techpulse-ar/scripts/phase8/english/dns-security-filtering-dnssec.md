---
title: DNS Security in Practice: Protective Filtering, Logging and DNSSEC
excerpt: How attackers use DNS, how protective DNS blocks malicious domains, why DNS logs are gold during investigations, and what DNSSEC does (and doesn't) protect.
---

Almost every connection starts with a DNS lookup, including malware calling home and phishing pages loading. That makes DNS both a target and one of the cheapest places to add protection.

## How attackers use DNS

- **Malicious domains** for phishing, malware delivery and command-and-control.
- **DNS tunnelling** to smuggle data out inside queries.
- **Hijacking and poisoning**: changing a router's DNS settings or a domain's records to redirect traffic.
- **Domain look-alikes** and newly registered domains used for short-lived campaigns.

## Protective DNS filtering

A protective DNS resolver checks each queried domain against threat intelligence and refuses to resolve known-bad or risky categories. It blocks threats before a connection even starts, for every device that uses the resolver.

- Options range from free public resolvers with security filtering to commercial services and on-prem appliances with category control, reporting and roaming clients.
- **Point internal DNS servers' forwarders** at the filtering resolver so domain-joined machines are covered without changing clients.
- **Block outbound DNS (UDP/TCP 53) to the internet** except from your resolvers, so malware can't bypass them.
- Decide a policy for encrypted DNS (DoH/DoT) in browsers; uncontrolled DoH bypasses your filtering. Enterprise browser policies can disable it or point it at your resolver.

## DNS logging

Query logs show which machine looked up which domain and when. During an incident, they can reveal the first contact with a malicious domain and every other infected host. Collect them centrally and keep them as long as your other security logs; see [log retention](/article/log-retention-siem-basics).

## DNSSEC

DNSSEC adds digital signatures to DNS records so resolvers can verify an answer really came from the domain owner and wasn't altered. It protects against cache poisoning and forged responses.

It does **not** encrypt queries (that's DoH/DoT) and doesn't stop users visiting malicious domains that are correctly signed.

To use it:

- **Validate**: make sure your resolvers perform DNSSEC validation (most public resolvers do).
- **Sign your own zones** if your registrar and DNS host support it, and monitor key rollovers. A broken signature makes your domain unreachable for validating resolvers.

## FAQ

**Can DNS filtering replace a web proxy?**
No. It works at the domain level and can't inspect URLs or content, but it's simple, fast and covers every protocol.

## References

- [CISA: Protective Domain Name System (DNS) Resolver](https://www.cisa.gov/resources-tools/services/protective-domain-name-system-resolver)
- [RFC 4033: DNS Security Introduction and Requirements](https://www.rfc-editor.org/rfc/rfc4033)
