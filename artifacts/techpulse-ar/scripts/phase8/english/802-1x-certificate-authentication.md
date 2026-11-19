---
title: 802.1X with Certificates: How the Pieces Fit and How to Roll It Out
excerpt: The supplicant, authenticator and RADIUS server roles, why EAP-TLS beats passwords for network access, and a staged rollout that avoids locking users out.
---

802.1X decides whether a device may use a switch port or Wi-Fi network before it gets an IP address. With certificate-based EAP-TLS, the decision is based on a certificate the device holds, not a password someone can phish or share.

## The three roles

- **Supplicant**: the client (Windows, macOS, a phone) that presents credentials.
- **Authenticator**: the switch or wireless controller. It doesn't decide anything; it relays EAP messages and enforces the result.
- **Authentication server**: usually RADIUS (Microsoft NPS, Cisco ISE, FreeRADIUS, Aruba ClearPass), which checks the credentials and returns accept or reject, often with a VLAN assignment.

## Why certificates

- Nothing for users to type, so nothing to phish.
- Both sides authenticate: the client verifies the RADIUS server certificate, which stops evil-twin access points from harvesting credentials.
- Access is revoked by revoking or not renewing a certificate.

Password-based methods such as PEAP-MSCHAPv2 are simpler to start but weaker, especially if clients aren't set to validate the server certificate.

## What you need

1. **A PKI** to issue device and/or user certificates; see [PKI and the chain of trust](/article/pki-certificate-authority-explained).
2. **Automated enrolment**: Group Policy auto-enrolment for domain machines, or MDM (Intune, others) via SCEP or PKCS profiles.
3. **A RADIUS server** with policies matching certificate attributes and groups.
4. **Switch and Wi-Fi configuration** pointing to RADIUS, with sensible fallback behaviour.

## A rollout that doesn't break things

1. **Pilot on Wi-Fi first** with IT devices. It's easier to fix than wired.
2. **Run wired ports in monitor or low-impact mode**, logging authentication results without blocking.
3. **Handle devices that can't do 802.1X** (printers, phones, cameras) with MAC Authentication Bypass into a restricted VLAN, and treat MAB as weaker.
4. **Enforce gradually**, building by building, with a documented way to restore a port quickly.
5. **Monitor certificate expiry and CRL availability**. An expired CA or unreachable CRL can take everyone offline; see [certificate expiry monitoring](/article/certificate-expiry-monitoring).

## FAQ

**Machine or user certificates?**
Machine certificates let devices connect before login (needed for Group Policy and scripts). Many deployments use both.

**Is 802.1X the same as NAC?**
802.1X is the authentication mechanism; NAC adds posture checks, profiling and policy. See [network access control basics](/article/network-access-control-nac-basics).

## References

- [RFC 5216: The EAP-TLS Authentication Protocol](https://www.rfc-editor.org/rfc/rfc5216)
- [Network Policy Server (Microsoft Learn)](https://learn.microsoft.com/en-us/windows-server/networking/technologies/nps/nps-top)
