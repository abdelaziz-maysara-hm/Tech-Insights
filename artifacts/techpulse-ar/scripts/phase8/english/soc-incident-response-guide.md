---
title: SOC and Incident Response: The Complete Guide to Detection, Triage and Recovery
excerpt: How to build security operations that catch real attacks and an incident response process that holds up under pressure: choosing log sources, writing detections, triaging alerts, running the response lifecycle from NIST SP 800-61 Rev. 3, and measuring whether any of it works.
---

A security operations centre is not a room full of screens. It is a capability: the people, processes and tools that notice an attack in progress and do something about it before it becomes a disaster. Incident response is what happens once something has been noticed. You need both, and they only work if they were designed together.

This guide is written for organisations building or rebuilding that capability, whether with an in-house team, a managed provider or a mix.

## Decide what the SOC is for

Before buying a SIEM, write down what the SOC must achieve. For most organisations that comes down to:

- detecting the attacks most likely to hurt you, such as ransomware, account takeover, business email compromise and data theft;
- responding quickly enough to limit the damage;
- giving management an honest view of security risk;
- meeting regulatory or contractual obligations for monitoring and reporting.

Everything else, from tools to staffing, should follow from those goals.

## Pick an operating model

| Model | Fits when | Watch out for |
|---|---|---|
| In-house, 24x7 | Large organisation, strict regulation, enough budget to staff round-the-clock shifts | Hiring and retention, analyst burnout |
| Managed (MDR or MSSP) | Small and mid-sized teams that need round-the-clock coverage | Providers lack business context; define what they may do without asking |
| Hybrid | In-house team in business hours, provider covers nights and weekends | Clean handovers and shared case notes |

Whatever the model, someone inside the organisation must own incidents. A provider can detect and contain; it cannot decide whether to shut down the payment system.

## Roles

- **Triage analysts** review alerts, close false positives, enrich the rest and escalate.
- **Investigators and responders** dig into escalated cases, scope incidents and lead containment.
- **Detection engineers** write and tune detection rules, and remove noisy ones.
- **Threat hunters** look for attacker activity that no rule caught.
- **SOC lead** owns priorities, staffing, metrics and the relationship with the business.

In a small team one person wears several hats. That's fine as long as each job is actually done.

## Logs: collect what catches real attacks

Collecting everything is expensive and makes searching slower. Start with the sources that see the steps attackers can't avoid:

1. **EDR telemetry** from every endpoint and server.
2. **Identity logs**: domain controller security events, Microsoft Entra ID or other identity provider sign-ins, MFA events.
3. **Email security logs**: delivered phishing, clicks, user reports.
4. **Perimeter logs**: firewall, VPN, web proxy and DNS.
5. **Cloud and SaaS audit logs** for your main platforms.

Decide retention based on how long attackers typically go unnoticed and on your legal obligations, not on the default licence setting. For the Windows events that matter most, see [Windows security event IDs for SOC teams](/article/windows-security-event-ids-soc); for retention, see [log retention and SIEM basics](/article/log-retention-siem-basics).

## Detection engineering

A SIEM correlates and searches logs; EDR watches endpoints in depth. Both are covered in [how a SIEM actually works](/article/how-siem-actually-works) and [how EDR actually works](/article/how-edr-actually-works). Neither detects anything useful out of the box without tuning.

Treat detections like code:

- **Map them to MITRE ATT&CK techniques** so you can see which attacker behaviours you cover and which you don't.
- **Prefer behaviours over indicators.** A rule for "Office application spawns PowerShell" lasts longer than a list of yesterday's malicious IP addresses.
- **Document each rule:** what it detects, why it matters, known false positives and what the analyst should do when it fires.
- **Test them.** Simulate the technique in a lab and confirm the alert appears.
- **Retire noise.** A rule that fires a hundred times a day and is always closed as benign is training analysts to ignore alerts.

## Triage without drowning

Every alert should get a quick, consistent first look:

1. Is the activity real, or a known benign pattern?
2. Which user, device and data are involved, and how important are they?
3. Is there related activity from the same user, host or indicator?
4. Escalate, close with a reason, or tune the rule.

Record the reason for every closure. Those notes are the raw material for tuning and for spotting attacks that were dismissed too quickly.

## The incident response lifecycle

NIST SP 800-61 Rev. 3, published in 2025, ties incident response to the six functions of the NIST Cybersecurity Framework 2.0: Govern, Identify, Protect, Detect, Respond and Recover. The practical message is that response isn't a separate activity that starts when an alarm rings; preparation and lessons learned are part of normal risk management. In day-to-day terms the work still follows a familiar flow.

### Prepare

- A written plan that names who leads, who decides and who communicates.
- Contact lists for legal, management, insurers, key vendors and law enforcement, kept outside the systems that may be encrypted.
- Pre-approved containment actions, such as isolating endpoints or disabling accounts.
- Backups that are tested and protected from the same administrators an attacker might impersonate.

### Detect and analyse

Confirm the incident, set an initial severity, and scope it: which accounts, devices and data are affected, and since when. Preserve evidence as you go.

### Contain

Stop the spread. Short-term containment might mean isolating hosts, disabling compromised accounts, blocking indicators at the firewall or cutting a site-to-site tunnel. Balance speed against tipping off the attacker before you understand the scope; in active ransomware, speed wins.

### Eradicate and recover

Remove the attacker's access: malware, persistence mechanisms, rogue accounts and stolen credentials. Rebuild rather than clean when in doubt. Restore from known-good backups, then monitor closely for signs of return.

### Learn

Hold a blameless review within a couple of weeks. What happened, what worked, what didn't, and what will change, with owners and dates.

For the worst case, see [the first hour after a ransomware attack](/article/ransomware-first-hour-response), and rehearse the plan through [tabletop exercises](/article/incident-response-tabletop-exercises).

## Severity levels

| Level | Example | Response |
|---|---|---|
| Critical | Active ransomware, domain compromise, confirmed data theft | Immediate, all hands, executive notification |
| High | Compromised privileged account, malware on a server | Same day, incident lead assigned |
| Medium | Single user account compromised, contained malware | Within one business day |
| Low | Blocked phishing, policy violation | Routine queue |

## Playbooks

Write short, specific playbooks for the incidents you see most: phishing with credential entry, malware on an endpoint, suspicious sign-in, lost device and ransomware. Each should list triggers, first steps, containment options, who to inform and when to escalate. Keep them to a page or two; nobody reads a forty-page document during an incident.

## Communication and evidence

- Use an out-of-band channel if email or chat may be compromised.
- Keep one timeline of actions and findings, with times and names.
- Preserve logs, memory images and disk images before rebuilding critical systems, and record chain of custody.
- Route all external communication through the people named in the plan.

## A six-month build plan

1. **Month 1:** goals, operating model, incident plan and contact lists.
2. **Month 2:** EDR coverage and identity logs into the SIEM.
3. **Month 3:** first detections for top threats, triage process, phishing and malware playbooks.
4. **Month 4:** first tabletop exercise; fix the gaps it reveals.
5. **Month 5:** extend to cloud and network logs; start ATT&CK coverage mapping.
6. **Month 6:** review metrics, tune detections, plan the next half-year.

## Measuring the SOC

- **Time to detect** and **time to contain** for real incidents.
- **True-positive rate** per detection rule.
- **ATT&CK coverage** for the techniques most relevant to you.
- **Log source health**: sources that stopped sending without anyone noticing.
- **Exercise findings closed** since the last tabletop.

## Common mistakes

- Buying a SIEM before deciding what to detect.
- Measuring the number of alerts closed rather than incidents caught.
- No authority for analysts to contain without a long approval chain.
- Backups reachable with the same admin credentials as production.
- A plan that has never been exercised.

## FAQ

### Do we need a SIEM on day one?

Not necessarily. A well-configured EDR with identity protection and a managed service can provide strong detection for a small organisation. A SIEM becomes important as log sources and compliance needs grow.

### What is the difference between EDR and a SIEM?

EDR gives deep visibility and response actions on endpoints. A SIEM collects logs from many sources and correlates them. They complement each other.

### How often should we test the incident response plan?

At least once a year with a tabletop exercise, and after major changes such as a merger, a new core platform or a real incident.

### Should we pay if ransomware hits us?

CISA and the FBI advise against paying, since payment doesn't guarantee recovery and funds further attacks. The decision involves legal, insurance and sanctions considerations, so it should be made by leadership with legal advice, and planned for before it happens.

## References

- [NIST SP 800-61 Rev. 3: Incident Response Recommendations and Considerations for Cybersecurity Risk Management](https://csrc.nist.gov/pubs/sp/800/61/r3/final)
- [NIST Cybersecurity Framework 2.0](https://www.nist.gov/cyberframework)
- [MITRE ATT&CK](https://attack.mitre.org/)
- [CISA: #StopRansomware Guide](https://www.cisa.gov/stopransomware/ransomware-guide)
