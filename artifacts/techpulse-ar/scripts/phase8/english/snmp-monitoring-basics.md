---
title: SNMP for Network Monitoring: Choosing a Version and Securing It
excerpt: How SNMP polling and traps work, why v1 and v2c community strings are a liability, and how to configure SNMPv3 with authentication, encryption and restricted access.
---

SNMP is still the common language of network monitoring. Switches, routers, firewalls, UPS units and printers all speak it, and every monitoring tool can read it. It's also frequently left in its least secure configuration.

## How SNMP works

- **Managers** (your monitoring server) **poll agents** on devices over UDP 161, asking for values such as interface counters, CPU and temperature.
- Values are identified by **OIDs** and described in **MIBs**.
- Agents can also send **traps or informs** to the manager over UDP 162 when something happens, such as a link going down.

## The versions

| Version | Authentication | Encryption | Verdict |
|---|---|---|---|
| v1 | Community string, plain text | None | Avoid |
| v2c | Community string, plain text | None | Only if a device can't do v3, and tightly restricted |
| v3 | Username with SHA-based auth | AES | Use this |

The community string in v1/v2c is effectively a password sent in clear text. Default strings like `public` and `private` are among the first things attackers try, and write access (`private`) can let them change device configuration.

## Securing SNMP

1. **Use SNMPv3 with authPriv**: authentication and privacy (encryption) both on, with SHA-2 family and AES where the device supports them.
2. **Read-only by default.** Monitoring rarely needs write access.
3. **Restrict who can query**: ACLs on the device permitting only the monitoring server's IP.
4. **Keep it off the internet.** Block UDP 161/162 at the perimeter and carry SNMP on a management network or VLAN.
5. **Remove default communities** on every device, including printers and UPS cards.
6. **Use views** on devices that support them to limit which OIDs a user can read.

## What to monitor first

Interface utilisation and errors, device CPU and memory, environmental sensors, and link up/down traps. Feed traps and logs to a central system so alerts correlate with events, alongside your [syslog server](/article/syslog-server-setup-basics).

## FAQ

**Can SNMP replace syslog?**
No, they complement each other. SNMP gives metrics and state; syslog gives event detail.

**What about streaming telemetry?**
Newer platforms offer gRPC/gNMI telemetry for high-frequency data. SNMP remains the widest-supported baseline.

## References

- [RFC 3414: User-based Security Model for SNMPv3](https://www.rfc-editor.org/rfc/rfc3414)
- [RFC 3826: AES Cipher in the SNMP User-based Security Model](https://www.rfc-editor.org/rfc/rfc3826)
