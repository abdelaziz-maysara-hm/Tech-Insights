Most people trying to break into a SOC role have read about SIEM. Far fewer have watched a raw Windows event turn into an alert and then had to decide whether it matters. Two virtual machines and an afternoon fix that. This lab uses **Wazuh**, an open-source SIEM/XDR platform, and Microsoft's **Sysmon** for the endpoint visibility Windows does not give you out of the box.

## What the finished lab looks like

- **wazuh-01**: an Ubuntu VM running the Wazuh indexer, server and dashboard (all-in-one).
- **win-victim**: a Windows 10/11 or evaluation Windows Server VM with Sysmon and the Wazuh agent.
- An **isolated** host-only or internal NAT network. Keep it away from your work LAN.

Budget at least 16 GB of RAM on the host. Check the hardware table in the Wazuh Quickstart before sizing the server VM; the dashboard and indexer are the hungry parts.

## Step 1: Install Wazuh all-in-one

The official installer deploys all three central components on one machine, which is exactly what a lab needs:

```bash
curl -sO https://packages.wazuh.com/4.14/wazuh-install.sh
sudo bash ./wazuh-install.sh -a
```

When it finishes it prints the dashboard `admin` password. Save it and browse to `https://<server-ip>`. Confirm the current version in the documentation before copying commands, because the URL path tracks the release line (4.14 at the time of writing).

## Step 2: Give Windows real telemetry with Sysmon

Default Windows auditing will tell you a logon failed. It will not tell you which process opened a socket to which IP, or what command line launched PowerShell. Sysmon does, but only as well as its configuration. Start from a well-known community baseline (SwiftOnSecurity's sysmon-config or Olaf Hartong's sysmon-modular) and tune from there:

```powershell
.\Sysmon64.exe -accepteula -i sysmonconfig.xml
```

The events you will use most at first:

| Sysmon ID | What it records | Why analysts care |
|---|---|---|
| 1 | Process creation with full command line | Encoded PowerShell, LOLBins |
| 3 | Network connection per process | Beaconing, unexpected outbound |
| 10 | Process access | Credential theft from LSASS |
| 11 | File creation | Dropped payloads |

## Step 3: Enrol the agent and collect the Sysmon channel

In the dashboard choose **Deploy new agent**, pick Windows, and run the generated PowerShell one-liner as administrator. Once the agent shows as active, add the Sysmon channel to the agent's `ossec.conf`:

```xml
<localfile>
  <location>Microsoft-Windows-Sysmon/Operational</location>
  <log_format>eventchannel</log_format>
</localfile>
```

Restart the agent service. Wazuh's built-in decoders and rules already understand much of the Sysmon schema, so alerts should start appearing within minutes.

## Step 4: Generate safe, realistic noise

Never use live malware. Red Canary's Atomic Red Team gives you small, documented tests mapped to MITRE ATT&CK techniques. Good first exercises, inside the lab only:

1. A burst of failed logons (Windows event 4625).
2. PowerShell launched with `-EncodedCommand`.
3. A new local user added to the Administrators group.

Take a VM snapshot first; some atomics change system settings.

## Step 5: Practise triage, not just collection

For every alert, write down: host, user, parent process, what happened five minutes either side, and whether it is expected. That short note is the core of SOC work and makes a strong interview story. Keep our [Windows Security event ID reference](/article/windows-security-event-ids-soc) open while you work.

## Where to go next

Write your own correlation logic with a [custom Wazuh brute-force rule](/article/wazuh-custom-rule-brute-force), then plan coverage systematically using [MITRE ATT&CK-driven detections](/article/mitre-attack-to-detections). For the concepts behind all of this, see [how a SIEM actually works](/article/how-siem-actually-works).

## FAQ

**Can I skip Sysmon?**
You can, but you lose process command lines and per-process network data, which are the fields most detections depend on.

**Can the lab run in the cloud?**
Yes. Watch the bill, and never expose the Wazuh dashboard to the internet without an IP allow-list.

**Is Atomic Red Team safe?**
It is built for testing, not for harm, but it does make real changes. Isolated VMs and snapshots only.

## References

- [Wazuh Quickstart (Wazuh documentation)](https://documentation.wazuh.com/current/quickstart.html)
- [Log data collection (Wazuh documentation)](https://documentation.wazuh.com/current/user-manual/capabilities/log-data-collection/index.html)
- [Sysmon (Microsoft Sysinternals)](https://learn.microsoft.com/sysinternals/downloads/sysmon)
- [Atomic Red Team (Red Canary, GitHub)](https://github.com/redcanaryco/atomic-red-team)
