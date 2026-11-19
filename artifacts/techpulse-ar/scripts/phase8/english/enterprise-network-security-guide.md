---
title: Enterprise Network Security: The Complete Guide to Segmentation, Access Control and Remote Access
excerpt: A practical design for securing a corporate network: a hardened perimeter, internal segmentation, 802.1X access control, remote access after the FortiOS SSL VPN tunnel-mode removal, firewall policy you can maintain, the infrastructure services everyone forgets, and a 90-day plan.
---

A firewall at the edge used to be the whole network security strategy. Users sat in the office, servers sat in the server room and the internet sat outside. That picture is gone. Staff work from home, applications live in several clouds, and attackers who get past the perimeter usually find a flat internal network where every device can talk to every other.

Network security today is about limiting what each connection can reach, knowing who and what is on the network, and keeping enough records to investigate when something goes wrong. This guide sets out a design built on those three ideas.

## Principles before products

- **Assume breach.** Design as if one device is already compromised. What can it reach?
- **Default deny.** Traffic that hasn't been explicitly allowed is blocked, between zones as well as at the edge.
- **Identity over address.** Rules based on users and device posture survive change better than rules based on IP ranges.
- **Visibility first.** A control you can't log is a control you can't trust.

## Layer 1: the perimeter

The edge firewall still matters. It is the first filter for everything coming from the internet, and the last checkpoint for data leaving.

- Publish nothing directly to the internet unless it must be public. Put published services behind a reverse proxy or in a DMZ with strict rules back into the internal network.
- Restrict outbound traffic too. Servers rarely need to reach arbitrary internet hosts, and blocking that stops a lot of malware from calling home.
- Enable the inspection features you will actually monitor: intrusion prevention, application identification, URL filtering and, where policy allows, TLS inspection for user traffic.
- Keep the management interface off the internet.

## Layer 2: internal segmentation

Segmentation turns one big network into zones, so a compromise in one zone doesn't hand over the rest. Common zones:

- user workstations;
- servers, often split by sensitivity or role;
- management interfaces of switches, firewalls, hypervisors and storage;
- printers, cameras, building systems and other devices that can't run security software;
- guest and contractor access.

VLANs create the separation, but traffic between VLANs should pass through a firewall with explicit rules, not just a router that forwards everything. Start by isolating the management network and the devices you can't patch, since those deliver the most value for the effort. Read more in [VLAN basics](/article/vlan-basics-why-segment), [segmentation and compliance](/article/network-segmentation-compliance) and [guest Wi-Fi isolation](/article/guest-wifi-network-isolation).

## Layer 3: network access control

Knowing which switch port is live isn't the same as knowing what is plugged into it. IEEE 802.1X with a RADIUS server authenticates the user or device before it gets network access. A managed laptop with a valid certificate lands in the corporate VLAN; an unknown device lands in a restricted one, or nowhere.

- Prefer certificate-based authentication (EAP-TLS) for managed devices over passwords.
- Use MAC authentication bypass only for devices that can't do 802.1X, such as printers, and put them in their own restricted VLAN.
- Roll out in monitor mode first to find what breaks.

See [802.1X certificate authentication](/article/802-1x-certificate-authentication) and [NAC basics](/article/network-access-control-nac-basics).

## Layer 4: remote access

Remote access gateways are among the most attacked devices on the internet, and VPN appliance vulnerabilities have been behind many recent intrusions. Treat them as critical systems:

- Patch them as a top priority when the vendor releases security fixes.
- Require MFA for every remote user.
- Give users access to the applications they need, not the whole internal network.
- Check device posture where the product supports it.

**A change Fortinet customers must plan for:** from FortiOS 7.6.3, SSL VPN tunnel mode is no longer available and remote users are expected to move to IPsec VPN, which can run over TCP port 443 for networks that block other ports. Tunnel-mode settings are not converted when you upgrade, so the migration has to be done before upgrading, not after. The step-by-step plan is in the [SSL VPN to IPsec migration guide](/article/fortios-ssl-vpn-tunnel-mode-removal-ipsec-migration), and if FortiClient reports error -7200, see [FortiClient error -7200 explained](/article/forticlient-error-7200-fix).

## Layer 5: monitoring

Firewall rules without logs leave you blind during an investigation. Send firewall, VPN, DNS, DHCP and NAC logs to a central syslog server or SIEM, synchronise clocks with NTP so events line up, and keep logs long enough to investigate an intrusion that went unnoticed for weeks. Start with [setting up a syslog server](/article/syslog-server-setup-basics), then [how a SIEM actually works](/article/how-siem-actually-works).

## Firewall policy you can maintain

Firewall rule bases rot. Rules get added for a project, never removed, and after a few years nobody knows which ones matter. Keep yours healthy:

- **Every rule has an owner, a reason and a ticket reference** in its description.
- **Use objects and groups** with meaningful names rather than raw IP addresses.
- **Avoid "any" in source, destination or service** except where truly required, and never all three.
- **Order matters.** Specific rules first, a logged deny-all at the end.
- **Review regularly.** Remove rules with zero hits over a long period, after checking with the owner.
- **Change control.** Test, approve and record changes; keep configuration backups.

Platform-specific examples are in [Palo Alto security policy basics](/article/palo-alto-security-policy-basics) and [advanced Windows Firewall rules](/article/windows-firewall-advanced-rules).

## Infrastructure services everyone forgets

- **DNS:** filter known malicious domains, log queries and watch for unusual patterns such as very long subdomains used for tunnelling. See [DNS security, filtering and DNSSEC](/article/dns-security-filtering-dnssec).
- **DHCP:** enable DHCP snooping on access switches to block rogue DHCP servers, and make the service redundant as described in [DHCP failover](/article/dhcp-failover-high-availability).
- **SNMP:** use SNMPv3 with authentication and encryption instead of plaintext community strings. See [SNMP monitoring basics](/article/snmp-monitoring-basics).
- **Certificates:** track expiry on gateways, load balancers and servers before an expired certificate causes an outage. See [certificate expiry monitoring](/article/certificate-expiry-monitoring).

## Zero Trust, minus the marketing

Zero Trust is a set of principles, not a product you can buy. NIST SP 800-207 describes it as removing implicit trust based on network location: every access request is evaluated on identity, device state and context. In practice it builds on the layers above: strong identity with MFA, finer segmentation, and application-level access instead of broad network access. You can move toward it one application at a time. See [Zero Trust explained practically](/article/zero-trust-explained-practically).

## Hardening the firewalls and switches themselves

Network devices are targets too, and they rarely run endpoint security:

- Keep firmware current and subscribe to vendor security advisories.
- Restrict management access to the management network and named admin accounts with MFA.
- Disable unused services, such as HTTP management, Telnet and old SNMP versions.
- Back up configurations and store them securely; they often contain secrets.
- Send device logs and admin logins to the SIEM.

The NSA's Network Infrastructure Security Guide covers these practices in more depth.

## IPsec design notes

For both site-to-site and remote-access IPsec:

- Use IKEv2 with modern algorithms such as AES-GCM and strong Diffie-Hellman groups; retire DES, 3DES, MD5 and SHA-1.
- Prefer certificate-based authentication for site-to-site links over shared pre-shared keys reused across sites.
- Limit the traffic each tunnel carries with firewall policy, rather than allowing everything once the tunnel is up.

## A 90-day plan

**Days 1–30: see what you have.** Inventory network devices and firmware versions, export firewall rules, map internet-facing services and centralise logs.

**Days 31–60: close the biggest gaps.** Patch edge devices and VPN gateways, enforce MFA on remote access, isolate the management network and remove obviously unused or overly broad firewall rules.

**Days 61–90: start segmentation.** Separate servers from workstations, isolate unmanaged devices, pilot 802.1X in monitor mode and plan the IPsec migration if you run FortiGate SSL VPN.

## Common mistakes

- A flat network where every workstation can reach every server.
- Management interfaces reachable from user VLANs or the internet.
- Remote access appliances left unpatched for months.
- Firewall rules with "any" everywhere and no owners.
- Logs collected but never reviewed, or kept only a few days.

## FAQ

### What makes a firewall next-generation?

A traditional firewall decides based on addresses and ports. A next-generation firewall also identifies applications and users and adds intrusion prevention, URL filtering and often malware inspection.

### Is SSL VPN still safe to use?

The protocol isn't the main problem; vulnerable, unpatched gateways are. That said, some vendors are moving away from SSL VPN, Fortinet's tunnel-mode removal being one example, so plan for IPsec or application-level access where your platform requires it.

### Our network is completely flat. Where do we start?

Isolate the management interfaces and the devices you can't patch first, then separate servers from user workstations. Those steps give the biggest reduction in risk for the least disruption.

### Does VLAN segmentation replace an internal firewall?

No. VLANs separate traffic, but if a router forwards everything between them, nothing is enforced. Inter-VLAN traffic needs filtering with explicit rules.

## References

- [NIST SP 800-207: Zero Trust Architecture](https://csrc.nist.gov/pubs/sp/800/207/final)
- [NIST SP 800-41 Rev. 1: Guidelines on Firewalls and Firewall Policy](https://csrc.nist.gov/pubs/sp/800/41/r1/final)
- [Fortinet: SSL VPN tunnel mode to IPsec VPN migration (FortiOS 7.6.3)](https://docs.fortinet.com/document/fortigate/7.6.3/administration-guide/155142/ssl-vpn-tunnel-mode-to-ipsec-vpn-migration)
- [NSA: Network Infrastructure Security Guide](https://www.nsa.gov/Press-Room/Press-Releases-Statements/Press-Release-View/Article/2949885/nsa-details-network-infrastructure-best-practices/)
- [RFC 3580: IEEE 802.1X RADIUS Usage Guidelines](https://datatracker.ietf.org/doc/html/rfc3580)
