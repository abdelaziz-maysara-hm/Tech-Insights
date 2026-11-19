---
title: Forcepoint NGFW VPN Client Users with RADIUS (NPS): Configuration and Troubleshooting
excerpt: Connecting Forcepoint NGFW mobile VPN authentication to a RADIUS server such as Microsoft NPS from the SMC: server and method elements, the access rule that ties them to the VPN, and how to troubleshoot failed logins.
---

Local user accounts on a firewall drift out of date: leavers keep access, passwords never change, and nobody enforces MFA. Pointing Forcepoint NGFW's VPN client authentication at RADIUS (Microsoft NPS, FreeRADIUS, or an MFA server that speaks RADIUS) moves those decisions to your directory, so disabling an AD account also ends VPN access.

## What you need first

- A RADIUS server reachable from the NGFW engine, with policies that check AD group membership (for example `VPN-Users`).
- The engine registered as a **RADIUS client** on that server. The identity the engine presents is the IP address of the interface chosen as **IPv4 Identity for Authentication Requests** in the engine's Interface Options, so register that address. The actual connection still follows routing.
- A long, random **shared secret**, identical on both sides.

## Configuration in the SMC

### 1. RADIUS Authentication Server element

In the Management Client, go to **Configuration > User Authentication > Servers > New > RADIUS Authentication Server**. Set the name, IP address, port (1812 by default; the predefined firewall template allows the default port, and a custom port needs an access rule), shared secret, retries and timeout.

### 2. Authentication Method element

Under **User Authentication > Authentication Methods > New > Authentication Method**, choose type **RADIUS** and add the server element. The server's Authentication Methods tab fills in automatically.

### 3. Access rule for VPN client users

Edit the policy of the engine acting as the mobile VPN gateway and add a rule:

| Field | Value |
|---|---|
| Source | VPN clients' virtual adapter address pool (or ANY if virtual adapters aren't used) |
| Destination | Only the internal networks these users need |
| Service | As required |
| Action | Allow, with VPN Action **Enforce VPN** (or Apply VPN) and the mobile VPN selected |
| Authentication | The users or groups allowed, and the RADIUS method under accepted authentication methods |

For RADIUS-only authentication without LDAP integration, Forcepoint documents using the `*external*` user from the internal domain in the rule. Save and install the policy. Keep separate, narrower rules for groups that need different access.

## Troubleshooting

- **Rejected despite the right password**: shared secret mismatch, or the engine's identity address isn't registered as a client. On NPS, check the Security log for event 6273 (denied) and its reason code.
- **Timeouts**: something between the engine and the RADIUS server blocks UDP 1812, or the reply returns by a different path. Check routing and intermediate firewalls.
- **Authenticated but no access**: the access rule doesn't match. Check the source address pool, the user/authentication cells, and rule order in the logs.
- **MFA push delays**: increase the timeout on the server element to allow time to approve.

NPS events also appear under **Event Viewer > Custom Views > Server Roles > Network Policy and Access Services**. Test from a real external connection, not from inside the office.

## Hardening

Use an MFA-capable RADIUS back end, keep engines patched, restrict each group to the networks it needs, and send VPN logs to your SIEM; see [what a VPN protects](/article/vpn-basics-what-it-does).

## FAQ

**Can the same RADIUS method protect admin logins?**
Yes, RADIUS can also be used for administrator authentication, configured separately. Keep a break-glass local account.

## References

- [Forcepoint: How to Configure NGFW to Use RADIUS Authentication](https://support.forcepoint.com/s/article/How-to-Configure-NGFW-to-Use-RADIUS-Authentication)
- [Forcepoint: Create Access rules for VPN client connections](https://help.forcepoint.com/fpnsp/en-us/7.5.0/GUID-32F38C61-B938-4062-A4D4-3CFDBA89F1B6.html)
- [Network Policy Server (Microsoft Learn)](https://learn.microsoft.com/en-us/windows-server/networking/technologies/nps/nps-top)
