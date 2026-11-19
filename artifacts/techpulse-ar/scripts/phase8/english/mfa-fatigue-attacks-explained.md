---
title: MFA Fatigue (Push Bombing): How It Works and How to Shut It Down
excerpt: Attackers with a stolen password spam push approvals until someone taps Approve. Number matching, phishing-resistant methods, and user guidance stop it.
---

MFA fatigue, also called push bombing or prompt spamming, starts after an attacker already has a valid password. They trigger login after login, and the victim's phone fills with approval requests, often late at night. Sooner or later someone taps **Approve** to make it stop, or because a caller claiming to be IT tells them to.

## Why it works

- Simple "Approve / Deny" pushes give the user no context about where the login came from.
- Repetition wears people down, and tired people make mistakes.
- Attackers combine it with social engineering, phoning as the helpdesk to "confirm" the prompt.

## Technical controls

1. **Number matching**: the login screen shows a number the user must type into the authenticator app. A user who didn't start the login has no number to enter. Microsoft Authenticator enforces this for push notifications.
2. **Show context**: app name and location on the prompt help users spot logins that aren't theirs.
3. **Phishing-resistant MFA** for admins and high-risk roles: FIDO2 security keys, passkeys or Windows Hello for Business. These can't be approved remotely.
4. **Limit and alert**: rate-limit push attempts, and alert the SOC on repeated denied or ignored prompts for one account.
5. **Conditional access**: block or step up sign-ins from unusual locations, unmanaged devices or risky IPs, so the push never gets sent.

## User guidance

- Never approve a prompt you didn't start, even "just once".
- IT will never call and ask you to approve a sign-in.
- Repeated unexpected prompts mean your password is known: report it and change it immediately.

Make reporting a one-step action with no blame attached.

## If someone approved a malicious prompt

Revoke the user's sessions and refresh tokens, reset the password, review registered MFA methods (attackers often add their own), check mailbox rules and recent sign-ins, and hunt for activity from the attacker's session.

## FAQ

**Are SMS codes better than push here?**
Not really. SMS is vulnerable to SIM swapping and phishing. Number matching or phishing-resistant methods are the better upgrade. See our [MFA methods compared](/article/2fa-practical-guide).

## References

- [How number matching works in MFA push notifications (Microsoft Learn)](https://learn.microsoft.com/en-us/entra/identity/authentication/how-to-mfa-number-match)
- [CISA: Implementing Phishing-Resistant MFA](https://www.cisa.gov/sites/default/files/publications/fact-sheet-implementing-phishing-resistant-mfa-508c.pdf)
