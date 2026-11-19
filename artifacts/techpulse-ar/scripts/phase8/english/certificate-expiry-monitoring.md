---
title: Never Again Surprised by an Expired Certificate: Monitoring That Works
excerpt: Why certificate expiry still causes major outages, how to build an inventory, automate renewal with ACME, monitor what can't be automated, and prepare for much shorter TLS lifetimes.
---

Expired certificates have taken down banking apps, cloud services and VPNs. The cause is almost always the same: nobody knew the certificate existed, or the person who did had left. It's one of the most preventable outages in IT.

## Lifetimes are getting shorter

The CA/Browser Forum has approved a schedule that cuts the maximum lifetime of public TLS certificates in steps, from 398 days to 200 days from March 2026, 100 days from March 2027, and 47 days from March 2029. Manual renewal won't scale. Automation is no longer optional for public certificates.

## Build an inventory

- **Public certificates**: search Certificate Transparency logs (for example crt.sh) for your domains; every publicly trusted certificate is logged there.
- **Internal certificates**: scan your networks for TLS services, and export issued certificates from your internal CA.
- **Hidden places**: load balancers, VPN gateways, firewalls doing SSL inspection, Wi-Fi RADIUS servers, SAML signing certificates, code-signing certificates, and appliances.

Record the owner, expiry date, issuer and where the private key lives.

## Automate renewal

- **ACME** (the protocol behind Let's Encrypt, supported by many commercial CAs) renews and installs automatically. Use it wherever possible.
- **Internal PKI**: Active Directory Certificate Services auto-enrolment for Windows machines and users.
- **Cloud services**: managed certificates in your cloud provider or CDN.

## Monitor what's left

- Alerts at 30, 14 and 7 days before expiry, sent to a team mailbox or ticket queue, not one person.
- External checks that connect to the service and read the certificate actually being served, which also catches renewed-but-not-installed cases.
- Monitor intermediate and root CA expiry too, plus CRL and OCSP availability for internal PKI. An unreachable CRL can break [802.1X authentication](/article/802-1x-certificate-authentication).

## FAQ

**Do internal certificates need to follow the shorter lifetimes?**
The CA/Browser Forum rules cover publicly trusted certificates. Internal CAs set their own policy, but shorter lifetimes with automation are a good direction.

**What happens when a certificate expires?**
Browsers and clients refuse the connection or show warnings, APIs fail, and devices relying on it (VPN, Wi-Fi) stop authenticating.

More on how trust chains work: [PKI and the chain of trust](/article/pki-certificate-authority-explained).

## References

- [CA/Browser Forum Ballot SC-081v3: shorter TLS certificate validity periods](https://cabforum.org/2025/04/11/ballot-sc081v3-introduce-schedule-of-reducing-validity-and-data-reuse-periods/)
- [RFC 8555: Automatic Certificate Management Environment (ACME)](https://www.rfc-editor.org/rfc/rfc8555)
