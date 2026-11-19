---
title: FortiGate SSL VPN Setup Checklist for FortiOS 7.4 and Early 7.6 (Before Tunnel Mode Goes)
excerpt: The five pieces a working FortiGate SSL VPN needs on releases that still have tunnel mode, the usual reasons it fails, a hardening list, and what changes from FortiOS 7.6.3 onward.
---

> **Version note (November 2026):** FortiOS 7.6.3 removed SSL VPN tunnel mode in favour of IPsec VPN, and tunnel-mode settings are not carried over on upgrade. This checklist is for FortiGates still on releases with tunnel mode (for example 7.4.x and 7.6.0–7.6.2). If you're planning an upgrade, start with the [IPsec migration plan](/article/fortios-ssl-vpn-tunnel-mode-removal-ipsec-migration).

A FortiGate SSL VPN is built from five pieces that depend on each other. Miss one and users get a vague error, a tunnel with no traffic, or names that won't resolve. Work through them in order.

## The five pieces

1. **Authentication source**: user groups backed by LDAP (Active Directory) or RADIUS rather than local accounts, with MFA (FortiToken or a RADIUS-based MFA service).
2. **Portal**: what users get after login. For tunnel mode: enable tunnel mode, choose an **IP pool** for clients, decide split tunnelling versus full tunnel, and set DNS for the tunnel.
3. **SSL VPN settings**: listening interface (usually WAN), port, server certificate, and authentication rules that map each user group to a portal, plus a default portal for everyone else.
4. **Firewall policy** from the `ssl.root` interface to the internal destinations, with the VPN user group as a source. No policy, no traffic, even though the tunnel comes up.
5. **Group-to-portal mapping** in the authentication rules, so each group lands on the right portal.

## Why it usually breaks

| Symptom | Likely cause |
|---|---|
| Tunnel up, nothing reachable | Missing or too narrow `ssl.root` policy, or wrong policy order; split-tunnel routes missing the destination subnet |
| Login fails or -7200 | User lands on a portal without tunnel mode or IP pool; cipher strength below the authentication rule's requirement; see [FortiClient error -7200](/article/forticlient-error-7200-fix) |
| Internal names don't resolve | Portal DNS points at public resolvers instead of internal DNS; DNS suffix missing |
| Works from the office, fails from home | Testing from inside takes a different path; always test from mobile data or another external network |

## Hardening checklist

1. MFA for every VPN user.
2. Latest supported firmware for your branch, and act on FortiGuard PSIRT advisories quickly. SSL VPN has been a frequent target.
3. A trusted CA certificate instead of the factory self-signed one.
4. Per-group policies that reach only the networks each group needs.
5. Restrict listening to required interfaces, and consider geo or IP restrictions for admin access.
6. Send VPN logs to your SIEM with alerts on unusual countries, hours, or brute-force patterns.

## From FortiOS 7.6.3 onward

- Tunnel mode is gone from the GUI and CLI, and `ssl.root` policies aren't migrated.
- Web mode continues as **Agentless VPN** on some models only; models with 2 GB of RAM or less don't support it.
- Fortinet's recommended replacement is **remote-access IPsec**, which can run over TCP 443 on FortiOS 7.4.2+ with FortiClient 7.4.1+, easing firewall traversal.

For the wider design, see the [enterprise network security guide](/article/enterprise-network-security-guide).

## FAQ

**Should we build new SSL VPN tunnel-mode deployments now?**
No. Build new remote access on IPsec, even on releases that still support tunnel mode, to avoid migrating later.

## References

- [FortiOS 7.6.3 Release Notes: SSL VPN tunnel mode replaced with IPsec VPN](https://docs.fortinet.com/document/fortigate/7.6.3/fortios-release-notes/173430/ssl-vpn-tunnel-mode-replaced-with-ipsec-vpn)
- [Fortinet PSIRT advisories](https://www.fortiguard.com/psirt)
