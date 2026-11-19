Plenty of organisations own a SIEM. Fewer get much out of it. The difference is rarely the product; it's whether the platform is doing the work in the middle, between "logs arrive" and "an analyst gets paged". This piece walks through that middle.

## A log store is not a SIEM

Collecting logs in one place is useful for searching after something happens. A SIEM earns its name by doing three more things continuously:

1. **Understanding** events from very different sources in a common format.
2. **Connecting** events that mean little alone but matter together.
3. **Prioritising** what a human should look at now.

If yours only does the first half of point one, you have expensive storage.

## The pipeline, stage by stage

**Collection.** Agents, syslog, cloud APIs and connectors pull events from firewalls, domain controllers, endpoints, identity providers and SaaS apps. Gaps here are invisible later, so keep a list of what *should* be sending and alert when a source goes quiet.

**Parsing and normalisation.** A Windows logon, a FortiGate session log and an Entra ID sign-in all describe "a user, a source, a destination, a result". Parsers map each into common fields (user, src_ip, dest, action), so one rule can query them all.

**Enrichment.** Add context at ingest: asset owner and criticality, user department, geolocation, threat-intelligence matches. "Failed login on SRV-PAY-01, owned by Finance, tier 0" is a different alert from "failed login on a test VM".

**Correlation.** Rules and analytics look for patterns across events and time: many failures then a success, a new admin account outside a change window, a host talking to a domain first seen yesterday.

**Alerting and case management.** Matches become alerts with a severity, grouped into incidents, and handed to an analyst or an automated playbook.

**Retention.** Hot storage for fast hunting, cheaper storage for compliance. Our note on [log retention for SIEM](/article/log-retention-siem-basics) covers how long to keep what.

## A worked example

Four events, from four sources, within twenty minutes:

| Time | Source | Event |
|---|---|---|
| 09:02 | Entra ID | 40 failed sign-ins for j.smith from one foreign IP |
| 09:05 | Entra ID | Successful sign-in for j.smith from the same IP |
| 09:09 | Exchange Online | New inbox rule forwarding to an external address |
| 09:20 | Firewall | j.smith's laptop has no connection from that country |

Each line alone is low priority. Correlated, they tell a clear story: a password was guessed, the account was taken over, and the attacker set up mail forwarding. That is the value a SIEM should deliver. A single high-severity incident, not four ignorable alerts.

## Tuning is the actual job

A new SIEM with every vendor rule enabled produces thousands of alerts a day, and analysts learn to ignore them. Effective teams:

- Enable rules in small batches, starting from the threats that matter to them (see [mapping MITRE ATT&CK to detections](/article/mitre-attack-to-detections)).
- Record every false positive and its cause, then add narrow exclusions.
- Measure alert-to-incident ratio and time to triage, not just alert counts.
- Re-test detections after agent or log-source changes.

Want hands-on practice? Build the [free Wazuh and Sysmon lab](/article/wazuh-sysmon-free-soc-lab) and watch this pipeline run end to end.

## FAQ

**What's the difference between SIEM and XDR?**
XDR platforms focus on deep telemetry from a vendor's own security stack with built-in response. A SIEM is broader and vendor-neutral, taking logs from almost anything. Many organisations use both.

**Which logs should we onboard first?**
Identity (domain controllers, Entra ID), endpoint security, firewalls and VPN, then email and critical servers.

**Can a small team run a SIEM?**
Yes, if scope is tight: a handful of high-value sources and well-tuned rules beat everything-on.

## References

- [Guide to Computer Security Log Management, NIST SP 800-92](https://csrc.nist.gov/pubs/sp/800/92/final)
- [MITRE ATT&CK](https://attack.mitre.org/)
