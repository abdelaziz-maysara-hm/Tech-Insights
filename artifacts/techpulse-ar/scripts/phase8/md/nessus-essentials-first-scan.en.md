A vulnerability scanner is the fastest way to see your network the way an attacker's tooling does, and Tenable's free Nessus Essentials is a solid place to learn. This walkthrough gets you from download to a prioritised fix list on a small lab.

## Ground rule: only scan what you are allowed to scan

Scanners send thousands of probes and can knock over fragile services. Scan your own lab, or systems you have written permission to test. If you are unsure where scanning ends and penetration testing begins, read [vulnerability scanning vs penetration testing](/article/vulnerability-scanning-vs-penetration-testing).

## What you get with Essentials

Nessus Essentials is the free edition of Nessus, aimed at students, home labs and small environments. It scans up to **16 IP addresses**, which is plenty for a handful of VMs.

## Install and activate

1. Register on the Nessus Essentials page; Tenable emails you an activation code.
2. Download the installer for your OS from Tenable's download page.
3. Browse to `https://localhost:8834`, enter the code and create the admin user.
4. Wait for the plugin download and compile to finish. The first run takes a while.

## Two scans, two different truths

**Unauthenticated scan.** Nessus talks to open ports and infers versions from banners and behaviour. It shows your external attack surface, but it guesses, so expect some false positives and plenty of misses.

**Credentialed scan.** Nessus logs in and reads installed software, patch levels and configuration directly. It is far more accurate and is what real vulnerability management runs on.

Run both on the same host and compare. The gap is the lesson.

## Run the unauthenticated scan

New Scan → **Basic Network Scan** → name it, list only your lab IPs under Targets, launch.

## Run the credentialed scan on Windows

Windows credentialed checks generally need:

- an account in the local Administrators group,
- File and Printer Sharing and SMB reachable from the scanner,
- the Remote Registry service (the scan policy can start it temporarily).

Add the account under the **Credentials** tab. Use a dedicated scan account with a strong password, never a Domain Admin. On Linux, an SSH key with narrowly scoped sudo rights is the usual approach.

## Turn findings into a fix list

Nessus sorts results by severity, based on CVSS. Severity alone is a poor queue. Rank by:

1. **Known exploitation.** Is the CVE in CISA's Known Exploited Vulnerabilities catalogue?
2. **Exposure.** Internet-facing, or holding sensitive data?
3. **Effort.** One cumulative update often clears a dozen findings.

Then rescan to confirm the fix. For the scoring itself, see [understanding CVSS](/article/understanding-cvss-score); for turning scans into a programme, see the [endpoint vulnerability management guide](/article/endpoint-vulnerability-management-guide).

## Beginner mistakes

- Scanning the office network from a personal laptop without approval.
- Treating every "Info" finding as a problem.
- Never rescanning after patching.
- Declaring a host clean after an unauthenticated scan.

## FAQ

**Can a business use Nessus Essentials?**
It is intended for learning, non-commercial use and small environments within the IP limit. Read Tenable's current licence terms before using it at work.

**Will scanning break anything?**
Basic scans are usually safe, but old printers, embedded and OT devices can misbehave. Scan them carefully and outside business hours.

**How often should I scan?**
In a lab, after every change. In production, at least monthly, and weekly for internet-facing systems.

## References

- [Nessus Essentials (Tenable)](https://www.tenable.com/products/nessus/nessus-essentials)
- [Nessus user guide: getting started (Tenable Documentation)](https://docs.tenable.com/nessus/Content/GettingStarted.htm)
- [Known Exploited Vulnerabilities Catalog (CISA)](https://www.cisa.gov/known-exploited-vulnerabilities-catalog)
