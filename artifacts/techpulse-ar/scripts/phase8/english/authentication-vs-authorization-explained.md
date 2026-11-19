---
title: Authentication vs Authorization: Who You Are Versus What You May Do
excerpt: A clear explanation of authentication and authorization with everyday IT examples, how protocols like Kerberos, OAuth 2.0, OpenID Connect and SAML fit, and the common bugs when the two are confused.
---

The words sound alike and are often abbreviated the same way ("auth"), but they answer different questions:

- **Authentication (AuthN)**: *Who are you?* Proving identity.
- **Authorization (AuthZ)**: *What are you allowed to do?* Deciding access once identity is known.

Authentication always comes first. Authorization happens on every request after that.

## Everyday examples

| Situation | Authentication | Authorization |
|---|---|---|
| Logging into Windows | Password, Windows Hello, smart card | Group membership decides which shares you can open |
| VPN connection | Username, password and MFA | Policy decides which subnets you reach |
| A banking app | Biometrics and device binding | You can view your accounts, not others' |
| An API call | API key or OAuth access token | Scopes decide which endpoints and data |

## How common protocols fit

- **Kerberos** (Active Directory): authenticates users and issues tickets that carry group membership, which services use to authorize; see [Kerberos explained](/article/kerberos-authentication-explained).
- **SAML and OpenID Connect**: authentication protocols for single sign-on. The identity provider tells the application who the user is.
- **OAuth 2.0**: an **authorization** framework. It lets an app access resources on a user's behalf with scoped tokens. On its own it doesn't tell the app who the user is; OpenID Connect adds that layer on top.
- **RBAC and ABAC**: authorization models based on roles or attributes.

## Bugs when they're confused

- **Authenticated equals authorized**: an API checks that a user is logged in but not whether the record belongs to them. Change an ID in the URL and you see someone else's data. This is broken object level authorization (BOLA), the top OWASP API risk, and broken access control is the top OWASP web risk; see [OWASP Top 10](/article/owasp-top-10-overview).
- **Client-side authorization**: hiding admin buttons in the interface while the server accepts the request anyway.
- **Using OAuth access tokens as proof of login** without validating audience and issuer.

## Good practice

- Strong authentication: MFA, phishing-resistant for admins; see [2FA methods compared](/article/2fa-practical-guide).
- Authorization enforced server-side on every request, deny by default.
- [Least privilege](/article/least-privilege-principle-practical) and regular access reviews.
- Log both: failed logins and denied access attempts are valuable signals.

## FAQ

**Is MFA authentication or authorization?**
Authentication. It strengthens proof of identity.

## References

- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [OWASP Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)
- [RFC 6749: The OAuth 2.0 Authorization Framework](https://www.rfc-editor.org/rfc/rfc6749)
