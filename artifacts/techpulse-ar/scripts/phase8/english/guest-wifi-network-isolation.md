---
title: Guest Wi-Fi Done Properly: Isolation, Limits and a Simple Setup
excerpt: Why visitors and personal devices must never share the staff network, how to build a guest network with VLAN separation and client isolation, and the settings that keep it from becoming a liability.
---

Visitors, contractors and staff phones all want Wi-Fi. Putting them on the same network as company laptops and servers gives every unknown device a path to your internal systems. A properly isolated guest network costs little and removes that risk.

## What isolation means

- **Separate SSID mapped to its own VLAN**, with its own IP range.
- **Firewall rules** allowing guest traffic only to the internet: deny everything to internal subnets, including management interfaces of the firewall and APs.
- **Client isolation** (also called AP or peer isolation) so guest devices can't reach each other.
- **Separate DNS and DHCP** for guests, ideally a filtering resolver; see [DNS security](/article/dns-security-filtering-dnssec).

## Setup steps

1. Create a guest VLAN on the switch and firewall; trunk it to the access points.
2. Create the guest SSID on the wireless controller or APs, mapped to that VLAN, with client isolation enabled.
3. On the firewall, allow guest VLAN to internet (DNS, HTTP/HTTPS and what's genuinely needed) and deny guest to all RFC 1918 internal ranges.
4. Apply bandwidth limits per client so one guest can't saturate the link.
5. Test from a guest device: internal IPs, the router's admin page and other guests should be unreachable.

On small-office routers without VLANs, the built-in "guest network" option usually provides basic isolation. Check that "allow guests to access local network" is off; see [small-office router hardening](/article/home-router-security-basics).

## Access and accountability

- **WPA2/WPA3 passphrase rotated regularly**, or a captive portal with terms of use and time-limited vouchers.
- **WPA3 OWE (Enhanced Open)** encrypts open networks without a password where clients support it.
- **Log DHCP leases and firewall sessions** for a reasonable period, in line with privacy law.

## Where IoT belongs

Smart TVs, meeting-room displays and cameras shouldn't be on the guest network or the staff network. Give them their own VLAN with rules for only what they need; see [VLAN basics](/article/vlan-basics-why-segment).

## FAQ

**Can staff phones use guest Wi-Fi?**
Personal phones, yes. Managed devices that need internal resources belong on the staff network with [802.1X authentication](/article/802-1x-certificate-authentication).

## References

- [Wi-Fi CERTIFIED Enhanced Open (Wi-Fi Alliance)](https://www.wi-fi.org/discover-wi-fi/security)
- [RFC 1918: Address Allocation for Private Internets](https://www.rfc-editor.org/rfc/rfc1918)
