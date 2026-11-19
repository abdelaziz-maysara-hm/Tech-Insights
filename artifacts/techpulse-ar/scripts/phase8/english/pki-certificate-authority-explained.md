---
title: PKI and the Chain of Trust: How a Certificate Proves Who's on the Other End
excerpt: How public key infrastructure works: key pairs, certificate authorities, root and intermediate certificates, chain validation, revocation, and the operational basics of running an internal CA.
---

Every HTTPS site, signed driver, VPN certificate and 802.1X login depends on public key infrastructure. PKI answers one question: **how can I trust that this public key really belongs to that server or person?** The answer is a chain of signatures leading to someone you already trust.

## The building blocks

- **Key pair**: a private key kept secret and a public key shared freely. Data signed with the private key can be verified with the public key.
- **Certificate**: a document binding a public key to an identity (a domain name, a user, a device), with validity dates and allowed uses, signed by a certificate authority.
- **Certificate authority (CA)**: an entity that verifies identities and signs certificates.

## The chain of trust

1. **Root CA**: its self-signed certificate is pre-installed in operating systems and browsers (the trust store). Root private keys are kept offline and heavily protected.
2. **Intermediate CA**: signed by the root and used for day-to-day issuance, so the root key stays offline.
3. **Leaf (end-entity) certificate**: issued to a server, user or device.

When your browser connects, the server sends its leaf certificate and intermediates. The browser checks each signature up to a trusted root, verifies the name matches, the dates are valid, the usage is appropriate, and the certificate isn't revoked. A missing intermediate on the server is a classic cause of "works in one browser, not another".

## Revocation

If a private key is compromised, its certificate must be revoked before it expires. Clients check revocation through **CRLs** (published lists) or **OCSP** (online queries). Public CAs are moving towards shorter certificate lifetimes, partly because revocation checking is unreliable; see [certificate expiry monitoring](/article/certificate-expiry-monitoring).

## Public vs internal PKI

- **Public CAs** issue certificates for internet-facing services trusted by everyone's devices, following CA/Browser Forum rules.
- **Internal CAs** (for example Active Directory Certificate Services) issue certificates for internal servers, users and devices, trusted only by machines you configure. They power [802.1X](/article/802-1x-certificate-authentication), smart cards, VPN and internal TLS.

## Running an internal CA safely

- Two tiers: an **offline root** and online issuing CAs.
- Protect CA keys, ideally with an HSM.
- Restrict certificate templates; misconfigured AD CS templates are a well-known privilege escalation path.
- Publish CRLs reliably and monitor their expiry.
- Document renewal of the CA certificates themselves years in advance.

How TLS uses all this is covered in [the TLS handshake explained](/article/tls-handshake-explained).

## FAQ

**Is a self-signed certificate insecure?**
The encryption is fine, but nothing vouches for identity, so users learn to click through warnings. Use an internal CA instead.

## References

- [RFC 5280: Internet X.509 PKI Certificate and CRL Profile](https://www.rfc-editor.org/rfc/rfc5280)
- [Active Directory Certificate Services overview (Microsoft Learn)](https://learn.microsoft.com/en-us/windows-server/identity/ad-cs/active-directory-certificate-services-overview)
