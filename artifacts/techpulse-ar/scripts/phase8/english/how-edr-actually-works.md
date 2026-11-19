---
title: How EDR Works and Why It Isn't Just Better Antivirus
excerpt: What endpoint detection and response records, how it detects attacks that signature antivirus misses, the response actions it gives analysts, and what it takes to run one well.
---

Traditional antivirus asks one question about a file: is it known to be malicious? Modern attacks often don't use malicious files at all. They use PowerShell, legitimate admin tools and stolen credentials. Endpoint detection and response (EDR) watches **behaviour** over time instead.

## What EDR records

An EDR agent continuously collects telemetry from each endpoint:

- Process creation, with full command lines and parent-child relationships.
- File creation, modification and deletion.
- Registry changes (Windows).
- Network connections per process.
- Logons, privilege use, and loaded modules or scripts.

This telemetry streams to a central platform, usually cloud-based, where it's analysed and kept for searching.

## How it detects

- **Behavioural rules**: Word spawning PowerShell, which downloads and runs code; a process reading LSASS memory; mass file renames typical of ransomware.
- **Machine learning models** trained on malicious and benign activity.
- **Threat intelligence**: known-bad hashes, domains and IPs.
- **Correlation**: linking events across time and devices into one incident story, often mapped to MITRE ATT&CK techniques.

Most EDR platforms also include next-generation antivirus, so they block known malware before it runs.

## Response capabilities

- **Isolate a device** from the network while keeping the EDR connection.
- **Kill processes** and **quarantine files**.
- **Remote shell / live response** for investigation.
- **Threat hunting**: query telemetry across the fleet ("which machines ran this command line last week?").
- Rollback of ransomware changes on some platforms.

## EDR, XDR and MDR

- **XDR** extends correlation to email, identity, cloud and network telemetry.
- **MDR** is a managed service where an external team monitors and responds using an EDR/XDR platform. Popular with organisations that lack a 24/7 SOC.

## Running it well

- Deploy to **every** endpoint and server; gaps are where attackers hide.
- Enable **tamper protection** so attackers can't disable the agent.
- Tune exclusions narrowly; see [KES exclusions](/article/kes-12-exclusions-kaspersky-security-center) for the same principle.
- Make sure someone reviews and acts on alerts around the clock, in-house or via MDR.
- Practise response actions before an incident.

## FAQ

**Does EDR replace a SIEM?**
No. EDR covers endpoints deeply; a SIEM correlates many sources. See [how a SIEM works](/article/how-siem-actually-works).

## References

- [MITRE ATT&CK](https://attack.mitre.org/)
- [NIST SP 800-61 Rev. 3: Incident Response Recommendations](https://csrc.nist.gov/pubs/sp/800/61/r3/final)
