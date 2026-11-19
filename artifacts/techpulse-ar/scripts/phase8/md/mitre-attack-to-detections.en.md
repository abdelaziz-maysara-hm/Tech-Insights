Every SOC slide deck seems to have an ATT&CK matrix painted green. Then an intrusion walks straight through the "covered" techniques. The matrix was never the problem; the way coverage was counted was. A rule *named* after a technique is not the same as a rule that fires when that technique happens in your environment.

Here is a five-step method that keeps ATT&CK honest.

## Step 1: Choose techniques from threat, not from the top-left corner

Start with evidence:

- Your own incident and near-miss history.
- Groups known to target your sector (the **Groups** pages on attack.mitre.org list the techniques each one uses).
- Techniques that dominate public incident-response reporting, such as credential theft and PowerShell abuse.

Commit to ten or fifteen techniques for the quarter. A short list you can test beats a long one you can't.

## Step 2: Check you can actually see them

For each technique, ATT&CK lists the data components that reveal it. Compare that with what you collect today:

| Technique | Evidence you need | Typical source |
|---|---|---|
| T1059.001 PowerShell | Script content | Event 4104 (Script Block Logging enabled) |
| T1003.001 LSASS Memory | A process opening lsass.exe | Sysmon event 10 or EDR telemetry |
| T1110 Brute Force | Failed authentications | Event 4625 on servers and DCs |
| T1558.003 Kerberoasting | RC4 service-ticket requests | Event 4769 with encryption type 0x17 |

No data, no detection. If the source is missing, the work item is "turn on logging", not "write a rule". Our [Windows event ID reference for SOC analysts](/article/windows-security-event-ids-soc) lists what to enable.

## Step 3: Write detections in a portable format

Sigma is an open, vendor-neutral rule format that converts to Splunk SPL, Microsoft Sentinel KQL, Elastic and others. A simplified LSASS-access rule:

```yaml
title: Suspicious LSASS Access
logsource:
  product: windows
  category: process_access
detection:
  selection:
    TargetImage|endswith: '\lsass.exe'
    GrantedAccess|contains: '0x1010'
  filter_known:
    SourceImage|endswith:
      - '\MsMpEng.exe'
  condition: selection and not filter_known
level: high
tags:
  - attack.credential-access
  - attack.t1003.001
```

The filter list is only an example. Build yours from what legitimately touches LSASS in *your* fleet.

## Step 4: Prove it fires

An untested rule is a hypothesis. Run the matching Atomic Red Team test in an isolated lab and check three things: the raw event arrived, the rule matched, and the alert landed with the right severity. If you need somewhere to do this, build the [free Wazuh and Sysmon lab](/article/wazuh-sysmon-free-soc-lab). For a worked rule end to end, see the [custom Wazuh brute-force rule](/article/wazuh-custom-rule-brute-force).

## Step 5: Score coverage with three colours, not one

Use ATT&CK Navigator, but define the colours strictly:

- **Red**: no telemetry.
- **Amber**: telemetry exists, no tested detection.
- **Green**: a detection that passed a simulation in the last 90 days.

Re-run the tests on a schedule. Agent upgrades and audit-policy changes quietly break rules that used to work.

## FAQ

**Do we need to cover the whole matrix?**
No. Some techniques are impractical to detect and others don't apply to you. Depth on the techniques your adversaries use beats breadth.

**Detection rule or hunting query?**
A detection runs automatically and must be precise enough to alert on. A hunt is broader and run by an analyst looking for patterns too noisy to alert on.

**How do I keep false positives down?**
Ship new rules in monitor mode, log every false positive with its cause, and add narrow exclusions rather than broad ones.

## References

- [MITRE ATT&CK](https://attack.mitre.org/)
- [ATT&CK Navigator (MITRE)](https://mitre-attack.github.io/attack-navigator/)
- [Sigma (SigmaHQ)](https://sigmahq.io/)
- [Atomic Red Team (Red Canary, GitHub)](https://github.com/redcanaryco/atomic-red-team)
