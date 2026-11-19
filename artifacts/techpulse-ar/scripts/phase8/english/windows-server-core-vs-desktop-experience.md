---
title: Server Core or Desktop Experience? Picking the Right Windows Server Install
excerpt: How the two installation options differ in attack surface, patching, resource use and management, which roles suit each, and why the choice must be made at install time.
---

Windows Server installs with one of two options: **Server Core**, with no desktop shell, or **Server with Desktop Experience**, with the full GUI. Since Windows Server 2016 you can't switch between them after installation, so decide up front.

## Server Core

- **Smaller attack surface**: fewer components means fewer vulnerabilities to patch and fewer tools for an attacker on the box.
- **Fewer updates and restarts** in practice, since many patches target GUI components.
- **Lower resource use**: less disk, memory and CPU.
- **Management**: remotely through Windows Admin Center, Server Manager, RSAT and PowerShell, or locally with `sconfig` and PowerShell.

## Desktop Experience

- Familiar GUI for staff who aren't comfortable with remote tools.
- Needed for some third-party applications and for **Remote Desktop Session Host** servers where users work interactively; see [RDS licensing](/article/rdp-multi-user-rds-licensing).
- Larger footprint and more to patch.

## Which roles suit Server Core

Domain controllers, DNS, DHCP, file servers, Hyper-V hosts, IIS web servers and many infrastructure roles run well on Core and benefit most from the reduced attack surface. Microsoft recommends Core for most roles that support it.

## When Desktop Experience is the practical choice

- Applications that require the GUI or aren't supported on Core (check vendor documentation).
- RDS session hosts.
- Small teams without remote management in place yet. Even then, consider setting up Windows Admin Center first; it removes most reasons for a GUI.

## Making Core comfortable

- Install **Windows Admin Center** on a management server for browser-based administration.
- Use **RSAT** on admin workstations.
- Learn a few PowerShell commands for networking, roles and updates; see [PowerShell for sysadmins](/article/powershell-sysadmin-complete-guide).
- The **App Compatibility Feature on Demand** adds some GUI tools (MMC, Event Viewer, File Explorer) to Core if you need occasional local troubleshooting.

## FAQ

**Can I convert later?**
Not since Windows Server 2016. Changing means reinstalling.

**Does licensing differ?**
No. Both options use the same Standard or Datacenter licences.

## References

- [Install Server Core (Microsoft Learn)](https://learn.microsoft.com/en-us/windows-server/get-started/install-options-server-core-desktop-experience)
- [Windows Admin Center overview (Microsoft Learn)](https://learn.microsoft.com/en-us/windows-server/manage/windows-admin-center/overview)
