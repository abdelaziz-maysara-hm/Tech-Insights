---
title: Network Access Control (NAC): Deciding What May Connect, and How Far
excerpt: What NAC adds on top of 802.1X (device profiling, posture checks, dynamic VLANs and quarantine), how it handles printers and IoT, and a rollout path that starts with visibility.
---

On many networks, plugging into a wall port gives you an IP address and a path to the servers. Network Access Control changes that: before a device gets meaningful access, the network asks who it is, what it is, and whether it's healthy, then places it accordingly.

## What NAC does

- **Authentication**: users and devices prove identity, typically with [802.1X](/article/802-1x-certificate-authentication) on wired and wireless.
- **Profiling**: identifying device types (printer, IP phone, camera, laptop) from DHCP fingerprints, MAC vendor, CDP/LLDP and traffic patterns. Essential for devices that can't do 802.1X.
- **Posture assessment**: checking a device's health, such as EDR running, disk encrypted and OS patched, often through an agent or MDM/EDR integration.
- **Enforcement**: assigning a VLAN, downloadable ACL or security group tag based on the result; restricting or quarantining devices that fail.
- **Guest and BYOD onboarding**: self-registration portals with limited, time-bound access.

## Products

Common platforms include Cisco ISE, Aruba ClearPass, Forescout and Fortinet FortiNAC, with cloud-delivered NAC options growing. Microsoft NPS handles RADIUS for 802.1X but lacks profiling and posture.

## Handling devices that can't authenticate

Printers, cameras and badge readers usually fall back to **MAC Authentication Bypass (MAB)**: the switch sends the MAC address to the NAC server, which checks it against a profile list. MAC addresses are easy to spoof, so MAB devices should land in restricted segments that allow only the traffic they need.

## A realistic rollout

1. **Visibility first**: run NAC in monitor mode to discover everything on the network. Most organisations find unknown devices.
2. **Classify and segment**: build profiles and target VLANs or policies for each device type.
3. **Low-impact enforcement**: start with guest and unknown devices, and keep known-good ones working.
4. **Add posture checks** for managed laptops once the basics are stable.
5. **Full enforcement** site by site, with an emergency bypass procedure.

## Common pitfalls

- Trying to enforce everywhere on day one.
- No owner for profile updates when new device types arrive.
- Forgetting that the RADIUS/NAC servers are now critical infrastructure needing redundancy.

## FAQ

**Is NAC still relevant with zero trust?**
Yes. Zero trust focuses on application access, but devices still connect to physical networks. NAC handles that layer. See [zero trust in plain terms](/article/zero-trust-explained-practically).

## References

- [NIST SP 1800-15: Securing Small-Business and Home IoT Devices (MUD)](https://csrc.nist.gov/pubs/sp/1800/15/final)
- [RFC 3580: IEEE 802.1X RADIUS Usage Guidelines](https://www.rfc-editor.org/rfc/rfc3580)
