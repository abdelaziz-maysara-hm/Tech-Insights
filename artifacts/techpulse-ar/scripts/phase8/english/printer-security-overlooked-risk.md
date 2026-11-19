---
title: Network Printers: The Security Blind Spot on Most Networks
excerpt: Why multifunction printers are full network computers with storage and credentials, how attackers abuse them, and a hardening checklist for IT teams.
---

A modern multifunction printer is a networked computer with an operating system, a web server, often a hard disk, stored address books and sometimes domain credentials for scan-to-email or scan-to-folder. It rarely gets patched, rarely gets monitored, and usually sits on the same network as everyone else.

## How printers get abused

- **Default admin passwords** on the web interface let anyone change settings, read address books or redirect scans.
- **Stored credentials**: scan-to-folder and LDAP lookups often use a domain account. Attackers can sometimes point the LDAP setting at their own server and capture the password in clear text.
- **Unpatched firmware** with known vulnerabilities, a foothold on the internal network that EDR doesn't see.
- **Stored jobs and disks**: copies of printed or scanned documents kept on internal storage, exposed when the device is resold or serviced.
- **Exposed services**: printers reachable from the internet over IPP, raw port 9100 or their admin page.
- **The print spooler on Windows**: vulnerabilities like PrintNightmare hit Windows print servers and clients rather than the printer itself. See [printer troubleshooting for IT teams](/article/printer-not-working-fixes).

## Hardening checklist

1. **Inventory** every printer and MFP, including model and firmware version.
2. **Change default admin passwords** and restrict the admin interface to IT subnets.
3. **Update firmware** on a schedule; subscribe to vendor security advisories.
4. **Disable unused protocols**: Telnet, FTP, SNMPv1/v2c (use [SNMPv3](/article/snmp-monitoring-basics)), WSD if unused, legacy SMBv1 for scan-to-folder.
5. **Least-privilege service accounts** for scan-to-folder, with access only to the scan share, and LDAPS rather than plain LDAP.
6. **Put printers on their own VLAN**, reachable only from print servers or the user subnets that need them.
7. **Enable secure printing / pull printing** so documents release only when the user authenticates at the device.
8. **Encrypt and wipe storage**: enable disk encryption if available, and perform a secure wipe before return, resale or disposal.
9. **Send printer logs** to your central log server where supported.

## FAQ

**Are printers really a target?**
Yes. Researchers and attackers regularly find printer vulnerabilities, and an unmonitored device inside the network is attractive for persistence.

**Do cloud printing services remove the risk?**
They can reduce exposure by removing print servers, but the devices still need firmware updates and hardening.

## References

- [NIST SP 800-88 Rev. 2: Guidelines for Media Sanitization](https://csrc.nist.gov/pubs/sp/800/88/r2/final)
- [Microsoft: Point and Print default behavior change (KB5005652)](https://support.microsoft.com/en-us/topic/kb5005652-manage-new-point-and-print-default-driver-installation-behavior-cve-2021-34481-873642bf-2634-49c5-a23b-6d8e9a302872)
