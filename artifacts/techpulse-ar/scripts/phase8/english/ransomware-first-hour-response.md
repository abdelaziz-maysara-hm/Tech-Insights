---
title: Ransomware Discovered: What to Do in the First Hour
excerpt: A first-hour playbook for IT teams: isolate without destroying evidence, protect backups and identity, start communication and logging, and avoid the moves that make recovery harder.
---

The first hour after spotting ransomware decides how bad the next month will be. The goals are simple: stop the spread, preserve what you need to recover and investigate, and get the right people involved. Panic, wiping machines and paying quickly are the usual mistakes.

## Minutes 0–15: contain

- **Isolate affected machines from the network**: pull the cable, disable Wi-Fi, or use your EDR's network isolation. **Don't power them off** unless encryption is actively spreading and you can't isolate; memory holds evidence and sometimes keys.
- **Block lateral movement**: if several systems are hit, isolate the affected segments or VLANs at the switch or firewall.
- **Disable compromised accounts** you can identify, and watch for new admin accounts.
- **Protect the backups**: disconnect or lock down backup repositories and change backup console credentials from a clean device. Attackers target backups first.

## Minutes 15–30: escalate and record

- **Start an incident log**: time, what was seen, what was done, by whom. You'll need it for insurers, regulators and lawyers.
- **Call your incident response contacts**: management, your IR retainer or provider, your cyber insurer (many policies require early notification and approved responders; see [cyber insurance](/article/cyber-insurance-what-it-covers)).
- **Use out-of-band communication**: assume email and Teams may be compromised. Use phones or a pre-agreed alternative channel.

## Minutes 30–60: scope

- Identify the strain from the ransom note or file extension, but **don't contact the attackers** yet. That's a decision for management, legal and your responders.
- Check identity systems: domain controller logs, recent changes to privileged groups, Entra ID sign-ins.
- Look for the entry point: VPN logs, exposed RDP, recent phishing reports.
- Photograph ransom notes and screens, and preserve logs before they rotate.

## Don't

- Don't wipe and rebuild before evidence is collected and the entry point is known; you'll be reinfected.
- Don't restore backups onto a network the attacker still controls.
- Don't run random "decryptor" tools from the internet.
- Don't announce details publicly before legal review.

## Next steps

Eradication and recovery follow a plan: rebuild identity trust, restore from clean, ideally [immutable backups](/article/immutable-backups-ransomware-defense), and reset credentials broadly. Practise this before it happens with [tabletop exercises](/article/incident-response-tabletop-exercises), and keep the broader [SOC and incident response guide](/article/soc-incident-response-guide) handy.

## FAQ

**Should we pay?**
That's a business, legal and sometimes sanctions question. Payment doesn't guarantee working keys or deletion of stolen data. Many governments advise against paying.

**Who should we report to?**
Depending on your country and sector: national CERT or cybercrime unit, your data protection regulator if personal data is involved, and your insurer.

## References

- [CISA #StopRansomware Guide](https://www.cisa.gov/stopransomware/ransomware-guide)
- [NIST SP 800-61 Rev. 3: Incident Response Recommendations](https://csrc.nist.gov/pubs/sp/800/61/r3/final)
