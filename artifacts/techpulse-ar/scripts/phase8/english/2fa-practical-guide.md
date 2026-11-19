---
title: Choosing Two-Factor Authentication Methods: SMS, Apps, Push and Security Keys Compared
excerpt: Why passwords need a second factor, how SMS codes, authenticator apps, push approvals and FIDO2 security keys or passkeys compare on phishing resistance and usability, and a rollout order for personal and business accounts.
---

Passwords leak. They're reused on a site that gets breached, captured by infostealer malware, or typed into a convincing phishing page. A second factor means a stolen password alone no longer opens the account. But the methods differ a lot in how well they hold up against today's attacks.

## The methods, from weakest to strongest

### SMS and voice codes

Universal and easy, which is why so many services offer them. The weaknesses are serious: **SIM swapping** (an attacker persuades your mobile carrier to move your number to their SIM), interception, and phishing pages that simply ask you for the code and relay it in real time. Better than nothing; not good enough for important accounts.

### Authenticator apps (TOTP)

Apps such as Microsoft Authenticator, Google Authenticator or the code generator in many password managers create six-digit codes on the device from a shared secret and the current time (the TOTP standard, RFC 6238). No network is involved, so nothing can be intercepted in transit, and codes work offline. They can still be phished in real time, because the user types the code into whatever page asks for it. A solid default for most accounts.

### Push notifications

Tap "Approve" on your phone. Convenient, but plain approve/deny prompts invite **MFA fatigue** attacks: the attacker, who already has the password, triggers prompts until someone gives in. **Number matching**, where you type the number shown on the sign-in screen into the app, plus location and app context on the prompt, largely closes this gap. See [MFA fatigue attacks](/article/mfa-fatigue-attacks-explained).

### Security keys and passkeys (FIDO2/WebAuthn)

A hardware key such as a YubiKey, or a passkey stored on your phone or laptop and unlocked with a fingerprint, face or PIN. The browser binds the cryptographic response to the real website's domain, so a look-alike phishing site gets nothing usable. This is what "phishing-resistant MFA" means. Drawbacks: buying and distributing keys, and planning for lost devices.

## Quick comparison

| Method | Phishing-resistant | SIM-swap risk | Works offline | Effort |
|---|---|---|---|---|
| SMS | No | Yes | No | Lowest |
| Authenticator app | No | No | Yes | Low |
| Push with number matching | Partly | No | No | Low |
| Security key / passkey | Yes | No | Yes | Moderate |

## Where to turn it on first

1. **Primary email**: it resets every other password.
2. **Password manager**; see [password managers at work](/article/password-manager-start).
3. **Banking, payroll and finance tools.**
4. **Admin and remote-access accounts** at work: these deserve security keys or passkeys.
5. Social media and everything else.

Save backup or recovery codes somewhere separate (printed, or in a different secure vault), and register a second method or key.

## In organisations

- Require MFA for every user, enforced centrally with conditional access.
- Phishing-resistant methods for administrators and high-risk roles.
- Block legacy protocols that bypass MFA.
- Make "I got a prompt I didn't start" a one-click report, and treat it as a compromised password.

## Common mistakes

- Protecting one account and leaving the rest.
- Losing the phone with no backup codes.
- Keeping SMS on a critical account when a stronger option exists.
- Approving a prompt you didn't trigger.

## FAQ

**What if I lose my phone?**
Use backup codes or a second registered method. Without them, recovery depends on the provider's slower identity checks.

**Will I have to enter a code every time?**
Usually not. Most services can remember a trusted device for a period.

**Do authenticator apps need internet?**
No. TOTP codes depend only on the device clock and the stored secret.

## References

- [NIST SP 800-63B-4: Authentication and Authenticator Management](https://pages.nist.gov/800-63-4/sp800-63b.html)
- [CISA: Implementing Phishing-Resistant MFA](https://www.cisa.gov/sites/default/files/publications/fact-sheet-implementing-phishing-resistant-mfa-508c.pdf)
- [RFC 6238: TOTP, Time-Based One-Time Password Algorithm](https://www.rfc-editor.org/rfc/rfc6238)
- [FIDO Alliance: Passkeys](https://fidoalliance.org/passkeys/)
