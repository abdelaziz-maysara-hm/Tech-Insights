---
title: API Rate Limiting: Keeping Abuse, Scraping and Overload in Check
excerpt: Why APIs need request limits, the common algorithms (fixed window, sliding window, token bucket), what to limit by, how to respond with HTTP 429, and where to enforce it.
---

Without limits, an API serves as many requests as anyone sends, whether that's a buggy client stuck in a loop, a scraper copying your data, or an attacker trying thousands of passwords. Rate limiting caps how much any client can do in a period of time.

## What it protects against

- **Credential stuffing and brute force** against login and password-reset endpoints.
- **Scraping and data harvesting**.
- **Resource exhaustion**: expensive queries that slow or crash the service for everyone.
- **Cost spikes** on metered back ends.
- **Abuse of messaging endpoints** (SMS, email) that cost money per message.

Unrestricted resource consumption is one of the OWASP API Security Top 10 risks.

## Algorithms

- **Fixed window**: N requests per minute, counter resets each minute. Simple, but allows bursts at window edges.
- **Sliding window**: smooths the edges by counting over a rolling period.
- **Token bucket**: tokens refill at a steady rate; each request spends one. Allows short bursts up to the bucket size while enforcing an average rate. Widely used.
- **Leaky bucket**: processes requests at a constant rate, queueing or dropping the excess.

## What to limit by

- **API key or authenticated user**: the fairest and most reliable.
- **IP address**: useful for anonymous endpoints, but shared IPs (offices, mobile carriers) and distributed attackers complicate it.
- **Endpoint**: tighter limits on login, search and expensive operations than on simple reads.
- **Combined**: per user per endpoint, plus a global safety limit.

## Responding well

- Return **HTTP 429 Too Many Requests** with a `Retry-After` header.
- Tell legitimate clients their limits, for example with rate-limit headers, so they can back off.
- Log and alert on clients that repeatedly hit limits; it may be an attack.

## Where to enforce it

API gateways (Kong, AWS API Gateway, Azure API Management, NGINX), CDNs and [WAFs](/article/web-application-firewall-waf-guide) offer built-in rate limiting. Use a shared store (such as Redis) if you implement it in the application across several instances. Layer it: a coarse limit at the edge, finer limits in the application.

Pair it with strong authentication and secret handling; see [API key management](/article/api-key-management-best-practices).

## FAQ

**Does rate limiting stop DDoS?**
It helps against application-level floods, but large volumetric attacks need upstream DDoS protection.

## References

- [OWASP API Security Top 10 (2023): API4 Unrestricted Resource Consumption](https://owasp.org/API-Security/editions/2023/en/0xa4-unrestricted-resource-consumption/)
- [RFC 6585: Additional HTTP Status Codes (429)](https://www.rfc-editor.org/rfc/rfc6585)
