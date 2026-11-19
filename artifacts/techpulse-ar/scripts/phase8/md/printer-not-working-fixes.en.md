In an office, "the printer won't print" is rarely about paper or toner. It's a stuck spooler, a broken driver, a network printer that changed address, or a security control blocking a driver install. And the print service itself gave us one of the best-known Windows vulnerabilities of the decade, **PrintNightmare** (CVE-2021-34527). This guide treats printing as what it is in a business: a support problem and a security surface at the same time.

## Scope it before you touch anything

- **One user or everyone?** One user points at their device or permissions; everyone points at the printer or the print server.
- **One printer or all of them?**
- **What changed?** A Windows update, a new driver, a network change?

## The Print Spooler

On the client or print server:

```powershell
Get-Service -Name Spooler
Restart-Service -Name Spooler -Force
```

For a job that's stuck and blocking the queue: stop the service, clear `C:\Windows\System32\spool\PRINTERS`, start it again. If you're doing this weekly, a specific driver or document is the real fault. Find it.

## Network printers

- Give printers a **static IP or DHCP reservation**. "It just stopped working" is very often an address change.
- Test reachability: `Test-NetConnection <printer-ip> -Port 9100` for raw printing, or whatever port your environment uses.
- Put printers on their own VLAN and allow only the traffic clients and print servers need. See [why VLANs matter](/article/vlan-basics-why-segment).

## Drivers and Point and Print after PrintNightmare

Microsoft's post-PrintNightmare updates changed how printer drivers are installed. KB5005010 explains that setting `RestrictDriverInstallationToAdministrators` to 1 ensures only administrators can install printer drivers from a print server. In practice, standard users may now see an elevation prompt when adding a printer. **Don't respond by switching protections off.** Instead:

- Pre-deploy printers and drivers through Group Policy or Intune.
- Use vendor-signed drivers and keep them current.

## Harden the print service

- **Disable the Print Spooler where nothing prints**, above all on domain controllers and servers that don't need it. Microsoft's guidance on disabling Windows Server system services covers this.
- **Patch** every machine running the spooler, print servers first.
- **Change default admin passwords on the printers** and turn off protocols you don't use. More in [printers: the overlooked security risk](/article/printer-security-overlooked-risk).

## Anti-patterns we keep finding

- Giving users local admin "so they can install the printer".
- Setting `NoWarningNoElevationOnInstall` to 1 to silence prompts, which reopens the PrintNightmare door.
- The print server is also a domain controller.

## FAQ

**Is PrintNightmare still relevant?**
The bug is patched. The workarounds people applied to make printer installs "just work" still turn up in audits.

**Do we need a print server at all?**
Small offices can print directly to network printers. Larger ones benefit from central driver management, or can evaluate cloud print services.

**How do I see which drivers are installed?**
`Get-PrinterDriver` in PowerShell lists them.

## References

- [CVE-2021-34527 Windows Print Spooler remote code execution (Microsoft Security Response Center)](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2021-34527)
- [KB5005010: Restricting installation of new printer drivers (Microsoft Support)](https://support.microsoft.com/topic/kb5005010-restricting-installation-of-new-printer-drivers-after-applying-the-july-6-2021-updates-31b91c02-05bc-4ada-a7ea-183b129578a7)
- [Guidance on disabling system services on Windows Server (Microsoft Learn)](https://learn.microsoft.com/windows-server/security/windows-services/security-guidelines-for-disabling-system-services-in-windows-server)
