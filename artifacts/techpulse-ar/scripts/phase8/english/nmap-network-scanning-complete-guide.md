---
title: Nmap for Network Admins: Core Scans, Useful Options and Staying Authorised
excerpt: Practical Nmap usage for inventory and security checks: host discovery, port and service scans, OS detection, NSE scripts, output formats, timing, and the authorisation rules you must follow.
---

Nmap is the standard tool for answering "what's on this network, and what is it running?" Admins use it for inventory, firewall verification and finding services that shouldn't be exposed. Attackers use it for the same reasons, which is why you should know what it sees first.

## Authorisation first

Only scan networks and systems you own or have **written permission** to test. Scanning other people's systems can breach contracts, acceptable use policies and laws, and can trigger incident responses. Inform your SOC or network team before scanning, especially with aggressive options.

## Host discovery

```
nmap -sn 10.10.20.0/24
```

`-sn` finds live hosts without port scanning, using ARP on local subnets and ICMP/TCP probes elsewhere. Firewalled hosts may not respond; `-Pn` skips discovery and treats every host as up (slower).

## Port scanning

```
nmap 10.10.20.15                 # top 1,000 TCP ports
nmap -p 22,80,443,3389 10.10.20.0/24
nmap -p- 10.10.20.15             # all 65,535 TCP ports
sudo nmap -sU --top-ports 50 10.10.20.15   # common UDP ports
```

With root privileges, Nmap defaults to a SYN scan (`-sS`); without, it uses a full connect scan (`-sT`). Port states are **open**, **closed** or **filtered** (no response, usually a firewall).

## Services, versions and OS

```
nmap -sV -O 10.10.20.15
nmap -A 10.10.20.15              # OS, versions, default scripts, traceroute
```

`-sV` identifies service versions, which is useful for matching against known vulnerabilities. `-A` is noisy; use it on targets you're responsible for.

## NSE scripts

The Nmap Scripting Engine adds checks:

```
nmap --script ssl-enum-ciphers -p 443 web01
nmap --script smb-protocols -p 445 10.10.20.0/24
```

Script categories include `default`, `safe`, `vuln` and `intrusive`. Read what a script does before running it; some can disrupt fragile services.

## Output and timing

- `-oA scan-name` writes normal, XML and grepable output at once. XML feeds other tools.
- `-T3` is the default timing; `-T4` is faster on reliable networks. Avoid `-T5` on production.
- Scan fragile devices (printers, OT equipment) gently or not at all.

## Practical uses

- Verify firewall rules from outside and inside.
- Find unexpected services such as RDP, Telnet or open databases.
- Compare scans over time (`ndiff`) to spot changes.

For deeper vulnerability checks, follow up with a scanner; see [Nessus Essentials](/article/nessus-essentials-first-scan).

## FAQ

**Is Nmap detectable?**
Yes. IDS/IPS and EDR commonly flag scans, which is another reason to coordinate.

## References

- [Nmap Reference Guide](https://nmap.org/book/man.html)
- [Nmap Scripting Engine documentation](https://nmap.org/book/nse.html)
