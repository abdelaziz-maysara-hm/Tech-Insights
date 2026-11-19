---
title: The OWASP Top 10 (2025) for Busy Teams: What Each Risk Means in Practice
excerpt: A plain-English tour of the OWASP Top 10:2025, from broken access control to mishandled exceptional conditions, with a worked SQL injection example and advice on using the list without treating it as a checklist.
---

The OWASP Top 10 is the best-known summary of web application risk. It's built from vulnerability data contributed by many organisations plus a community survey, and it changes every few years as attacks and development practices shift. The 2025 edition is the current one.

## The 2025 list in brief

1. **Broken Access Control**: users reach data or functions they shouldn't, such as changing an ID in a URL to see someone else's invoice. Still number one.
2. **Security Misconfiguration**: default credentials, verbose errors, open cloud storage, unnecessary features enabled.
3. **Software Supply Chain Failures**: vulnerable or malicious dependencies, compromised build pipelines and update channels. Expanded from the old "vulnerable components" category; see [supply chain attacks](/article/supply-chain-attacks-third-party-risk).
4. **Cryptographic Failures**: sensitive data unencrypted, weak algorithms, poor key handling.
5. **Injection**: untrusted input interpreted as code or commands, including SQL injection and [cross-site scripting](/article/cross-site-scripting-xss-basics).
6. **Insecure Design**: flaws in the design itself, such as no rate limit on a password reset flow; see [threat modeling with STRIDE](/article/threat-modeling-stride-basics).
7. **Authentication Failures**: credential stuffing, weak session handling, missing MFA.
8. **Software or Data Integrity Failures**: trusting updates, data or serialised objects without verifying integrity.
9. **Security Logging and Alerting Failures**: attacks go unnoticed because nothing is logged, or nobody is alerted.
10. **Mishandling of Exceptional Conditions**: new in 2025. Errors and unexpected states that fail open, leak information or leave the system inconsistent.

## Worked example: SQL injection

Vulnerable code builds a query by concatenating input:

```
query = "SELECT * FROM users WHERE username = '" + input + "'"
```

Entering `' OR '1'='1` changes the query's meaning so it returns every user. The fix is **parameterised queries** (prepared statements), where input is always treated as data:

```
cursor.execute("SELECT * FROM users WHERE username = %s", (input,))
```

Add layers: a least-privilege database account, input validation, and a [WAF](/article/web-application-firewall-waf-guide) as a safety net, not a substitute.

## Using the list well

- **It's an awareness document**, not a complete standard. For testable requirements, use OWASP ASVS.
- **Prioritise by your context**: an internal app with no sensitive data differs from a public payment site.
- **Build it into development**: training, code review checklists, automated testing; see [secure SDLC](/article/secure-sdlc-guide).
- **For APIs**, also read the separate OWASP API Security Top 10, where broken object level authorization leads.

## FAQ

**How often does it change?**
Roughly every three to four years. The previous edition was 2021.

**Is compliance with the Top 10 enough?**
No. It covers the most common risk categories, not everything an application needs.

## References

- [OWASP Top 10:2025](https://owasp.org/Top10/2025/)
- [OWASP SQL Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html)
- [OWASP API Security Top 10 (2023)](https://owasp.org/API-Security/editions/2023/en/0x11-t10/)
