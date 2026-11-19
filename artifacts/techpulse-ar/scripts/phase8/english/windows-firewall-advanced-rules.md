---
title: Windows Defender Firewall Beyond On and Off: Rules That Limit Lateral Movement
excerpt: Using profiles, scoped inbound rules, outbound control and central management to make the built-in Windows firewall stop attackers moving between machines.
---

On most networks, the Windows firewall is either left at defaults or switched off "to fix something". Used properly, it's one of the best free tools against lateral movement: workstations rarely need to accept connections from other workstations, and attackers rely on exactly that.

## Profiles

Windows applies one of three profiles per network connection: **Domain** (domain controller reachable), **Private** and **Public**. Keep all three on. Make Public the strictest; laptops in cafés should accept nothing.

## Inbound: deny by default, allow narrowly

The default blocks unsolicited inbound traffic; rules open exceptions. Make each exception specific:

- **Program or service**, not just a port.
- **Remote IP scope**: allow RDP, WinRM and SMB admin shares only from admin jump hosts or management subnets, not "Any".
- **Profile**: Domain only for admin access.

Example in PowerShell:

```powershell
New-NetFirewallRule -DisplayName "RDP from admin subnet" -Direction Inbound `
  -Protocol TCP -LocalPort 3389 -RemoteAddress 10.10.50.0/24 -Profile Domain -Action Allow
```

## Workstation-to-workstation blocking

A strong baseline: block inbound SMB (445), RDP (3389), WinRM (5985/5986) and RPC to workstations from everything except management systems. Ransomware and tools like PsExec spread through these.

## Outbound control

Outbound is allowed by default. Restricting it everywhere is a lot of work, but targeted rules help: block common living-off-the-land binaries from reaching the internet, or limit servers to the destinations they need.

## Manage centrally

- **Group Policy** (`Windows Defender Firewall with Advanced Security`) or **Intune** endpoint security firewall policies.
- Disable local rule merging on managed machines so users and malware can't add their own exceptions.
- Enable **logging of dropped packets** (`pfirewall.log`) and forward it when investigating.

## Troubleshooting without turning it off

Check which profile is active (`Get-NetConnectionProfile`), look at rules with `Get-NetFirewallRule`, and read the Windows Firewall event logs. Turning the firewall off "temporarily" tends to become permanent.

## FAQ

**Do we need it if we have a network firewall?**
Yes. Network firewalls rarely see traffic between machines on the same subnet. Host firewalls do. See also [network segmentation](/article/vlan-basics-why-segment).

## References

- [Windows Firewall overview (Microsoft Learn)](https://learn.microsoft.com/en-us/windows/security/operating-system-security/network-security/windows-firewall/)
- [New-NetFirewallRule (Microsoft Learn)](https://learn.microsoft.com/en-us/powershell/module/netsecurity/new-netfirewallrule)
