---
title: FortiOS 7.6.3 Drops SSL VPN Tunnel Mode: Planning Your Move to IPsec
excerpt: What Fortinet removed in FortiOS 7.6.3, why IPsec over TCP 443 is the replacement, and a step-by-step migration that builds IPsec before the upgrade so remote users never lose access.
---

If your remote users connect to a FortiGate with FortiClient in SSL VPN tunnel mode, FortiOS 7.6.3 is a hard stop. Upgrading without preparation disconnects everyone. The good news: the replacement can be built and tested on the release you're already running, before the upgrade.

## What changed

Per the FortiOS 7.6.3 release notes:

- **SSL VPN tunnel mode is replaced by IPsec VPN** on all FortiGate models. Tunnel mode disappears from the GUI and CLI.
- **Its configuration is not upgraded**, including firewall policies that reference the `ssl.root` interface.
- **Web mode survives as Agentless VPN** on some models only. Models with 2 GB of RAM or less support neither web nor tunnel mode.
- A FortiGate can no longer be an SSL VPN client of another FortiGate; use an IPsec dial-up client instead.

Users who upgrade unprepared usually see error -7200; see [FortiClient error -7200 explained](/article/forticlient-error-7200-fix).

## Why IPsec over TCP 443

SSL VPN was popular because port 443 gets through almost any network. Classic IPsec uses UDP 500 and 4500, which hotel networks and carrier-grade NAT sometimes block. Fortinet's answer is **IKE and ESP over TCP**, available on FortiOS 7.4.2 and later with FortiClient 7.4.1 and later, defaulting to port 443. Users keep the reachability; you get a standard, widely supported protocol.

## The migration, step by step

### 1. Map what SSL VPN does today

| Today (SSL VPN) | Tomorrow (IPsec remote access) |
|---|---|
| User groups from local, LDAP, RADIUS or SAML | Same groups via XAuth or EAP |
| Tunnel IP pool | Mode Config client address range |
| Reachable internal subnets | Phase 2 selectors / protected subnets |
| Split tunnelling | IPv4 split-tunnel setting in Phase 1 |
| `ssl.root` → LAN policies | Equivalent policies on the IPsec tunnel interface |
| Different portals per group | Separate tunnels, or Peer ID to tell them apart |

### 2. Back up

Save a full configuration backup off the device.

### 3. Build IPsec next to SSL VPN, before upgrading

On your current release (7.4.x or 7.6.0–7.6.2), create the remote-access IPsec tunnel through the GUI, CLI or Fortinet's FortiConverter service. Prefer IKEv2 where clients support it, modern algorithms, and TCP transport if you need 443. With FortiManager, upgrade FortiManager to 7.6.3 first and build the tunnels there.

### 4. Prepare FortiClient

Push the new IPsec profile through FortiClient EMS or an XML configuration, and make sure client versions support IPsec over TCP if you use it.

### 5. Pilot

Move a small group, IT first, and test sign-in and MFA, application access, internal DNS, throughput, and connections from home, hotel and mobile networks.

### 6. Cut over, then upgrade

Move the remaining groups in waves with a short user guide. Only when nobody depends on tunnel mode, upgrade to 7.6.3 and remove the old SSL VPN profiles from EMS.

## Watch-outs

- **MFA**: confirm FortiToken, RADIUS or SAML flows work with the new tunnel before moving users.
- **Policies**: recreate them with least privilege rather than copying broad rules.
- **Monitoring**: update SIEM rules and dashboards that parsed SSL VPN logs.
- **Small models**: check hardware limits before planning on Agentless VPN.

If you still run tunnel mode on an older release, our [FortiGate SSL VPN checklist](/article/fortigate-ssl-vpn-checklist) covers it in the meantime.

## FAQ

### Can we just stay below 7.6.3?

For a while, on a supported branch such as 7.4, as long as you keep applying security fixes and watch the support timeline. It buys time; it doesn't remove the need to migrate.

### Do users need new software?

Usually the same FortiClient with a new IPsec profile; TCP transport may need a client update.

### Is IPsec more secure than SSL VPN?

Both are secure when configured and patched well. Patching, MFA and least privilege matter more than the protocol.

## References

- [FortiOS 7.6.3 Release Notes: SSL VPN tunnel mode replaced with IPsec VPN](https://docs.fortinet.com/document/fortigate/7.6.3/fortios-release-notes/173430/ssl-vpn-tunnel-mode-replaced-with-ipsec-vpn)
- [FortiOS 7.6.3 Administration Guide: SSL VPN tunnel mode to IPsec VPN migration](https://docs.fortinet.com/document/fortigate/7.6.3/administration-guide/155142/ssl-vpn-tunnel-mode-to-ipsec-vpn-migration)
- [Fortinet Community: Changes on SSL VPN modes starting from v7.6.3](https://community.fortinet.com/fortigate-3/technical-tip-changes-on-ssl-vpn-modes-starting-from-v7-6-3-204117)
- [Fortinet Community: Using FortiManager for SSL VPN to IPsec VPN migration](https://community.fortinet.com/fortimanager-27/technical-tip-using-fortimanager-for-ssl-vpn-to-ipsec-vpn-migration-206094)
