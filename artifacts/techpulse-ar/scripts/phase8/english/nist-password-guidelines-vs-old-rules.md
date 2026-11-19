---
title: Why NIST Dropped Complexity Rules and Forced Resets for Passwords
excerpt: What NIST SP 800-63B now says about password length, composition rules, expiry, blocklists and hints, why the old rules backfired, and how to update an organisation's policy.
---

For years, password policy meant eight characters, an uppercase letter, a number, a symbol, and a change every 90 days. NIST's digital identity guidelines (SP 800-63B) now say most of that should go. The reasoning is about how people actually behave.

## Why the old rules backfired

- **Composition rules** produce predictable patterns: `Password1!`, `Summer2026!`. Attackers' cracking tools try exactly these first.
- **Forced periodic changes** lead to tiny increments (`Summer2026!` becomes `Autumn2026!`) and more written-down passwords.
- **Short maximum lengths** and banned characters stop people using passphrases or password managers.

## What current guidance says

For passwords used as an authenticator (SP 800-63B, Revision 4):

- **Length is what counts**: at least 15 characters when the password is the only factor, and at least 8 when used with MFA. Allow at least 64 characters.
- **No composition rules**: verifiers shall not require mixtures of character types.
- **No periodic expiry**: don't force changes on a schedule. **Do force a change** if there's evidence of compromise.
- **Blocklist check**: compare new passwords against lists of breached, common and context-specific values (company name, username).
- **Allow all printable characters**, including spaces and Unicode.
- **No hints or knowledge-based questions** ("first pet's name").
- **Allow paste**, so password managers work.
- **Rate-limit failed attempts** rather than relying on complexity.

## Updating your organisation's policy

1. Raise the minimum length and remove composition rules.
2. Remove scheduled expiry, but keep compromise-driven resets, backed by monitoring for leaked credentials.
3. Add a banned-password list. Microsoft Entra Password Protection does this for Entra ID and can extend to on-prem AD.
4. Encourage passphrases and [password managers](/article/password-manager-start).
5. Most importantly, add MFA, preferably phishing-resistant. Even a great password can be phished. See [2FA methods compared](/article/2fa-practical-guide).

Check your compliance obligations before removing expiry: some frameworks and contracts still specify rotation, though many have updated to follow NIST.

## FAQ

**Does this apply outside the US government?**
NIST writes for US federal agencies, but its guidance is widely adopted as best practice internationally.

**What about admin accounts?**
Same principles, with stronger MFA and privileged access controls on top.

## References

- [NIST SP 800-63B-4: Authentication and Authenticator Management](https://pages.nist.gov/800-63-4/sp800-63b.html)
- [Microsoft Entra Password Protection (Microsoft Learn)](https://learn.microsoft.com/en-us/entra/identity/authentication/concept-password-ban-bad)
