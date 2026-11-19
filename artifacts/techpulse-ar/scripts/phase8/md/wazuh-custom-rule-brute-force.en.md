Wazuh already knows what a brute-force attack looks like. Out of the box, rule 5763 fires when sshd authentication failures (rule 5760) repeat eight times in 120 seconds from one source, and rule 60204 does the equivalent for Windows logon failures. So why write your own?

Because "eight in two minutes" is a compromise designed for every network on earth. A bastion host that three engineers use deserves a hair trigger. A public web server that absorbs internet noise all day deserves a higher bar. Custom rules let you set thresholds by asset value, without touching stock rule files that get replaced on upgrade.

## House rules for custom rules

- Put them in `/var/ossec/etc/rules/local_rules.xml` (or a new file in that directory for larger sets).
- Use IDs **100000–120000**, the range Wazuh reserves for custom rules.
- Build on stock rules with `if_matched_sid` instead of writing new decoders.

## Rule 1: Tight threshold on the SSH bastion

```xml
<group name="local,sshd,brute_force,">
  <rule id="100100" level="12" frequency="4" timeframe="300">
    <if_matched_sid>5760</if_matched_sid>
    <same_srcip />
    <hostname>^jump-01$</hostname>
    <description>Jump host: 4 SSH authentication failures from $(srcip) in 5 minutes</description>
    <mitre>
      <id>T1110</id>
    </mitre>
  </rule>
</group>
```

How to read it: four matches of the stock "sshd: authentication failed" rule, from the same source IP, within five minutes, on the host named jump-01, raised at level 12 because of what the box guards.

## Rule 2: RDP and SMB logon failures on Windows

```xml
<group name="local,windows,brute_force,">
  <rule id="100110" level="10" frequency="6" timeframe="180">
    <if_matched_sid>60122</if_matched_sid>
    <same_field>win.eventdata.ipAddress</same_field>
    <description>6 Windows logon failures (4625) from $(win.eventdata.ipAddress) in 3 minutes</description>
    <mitre>
      <id>T1110</id>
    </mitre>
  </rule>
</group>
```

Rule 60122 is the stock match for event 4625 ("unknown user or bad password"). Windows puts the source address in `win.eventdata.ipAddress`, so we correlate with `same_field` rather than `same_srcip`. Our [Windows event ID reference](/article/windows-security-event-ids-soc) explains the logon types you will see.

## Test it before you trust it

Restart the manager after editing:

```bash
sudo systemctl restart wazuh-manager
```

Then replay a real log line through the rule engine:

```bash
sudo /var/ossec/bin/wazuh-logtest
```

Paste a failed-password line from `/var/log/auth.log` several times and confirm rule 100100 appears on the fourth. Finally, generate real failures from another machine in your lab and check the alert lands in the dashboard. No lab yet? Build the [free Wazuh and Sysmon SOC lab](/article/wazuh-sysmon-free-soc-lab).

## Optional: automatic blocking

Wazuh's active response can run `firewall-drop` to block the source for a set time when rule 100100 fires. Configure it in the manager's `ossec.conf`. Start with short block times, and allow-list your admin networks and internal vulnerability scanners first, or you'll lock out your own team.

## Mistakes we see

- Editing stock rule files, then losing the change at the next upgrade.
- Low thresholds on internet-facing assets that bury analysts in alerts.
- Forgetting `same_srcip`/`same_field`, so unrelated failures from different users add up to a meaningless alert.

To apply the same discipline across other techniques, see [turning MITRE ATT&CK into working detections](/article/mitre-attack-to-detections).

## FAQ

**`same_srcip` or `same_source_ip`?**
Current Wazuh documentation lists `same_srcip`; `same_source_ip` is a deprecated alias that still works.

**Should a brute-force rule be level 15?**
Keep the top levels for near-certain compromise. Guessing is an attempt, not a breach.

**What about a success after many failures?**
That is the alert that matters most. Correlate the brute-force alert with a successful logon from the same source and treat it as a probable incident.

## References

- [Custom rules (Wazuh documentation)](https://documentation.wazuh.com/current/user-manual/ruleset/rules/custom.html)
- [Rules XML syntax (Wazuh documentation)](https://documentation.wazuh.com/current/user-manual/ruleset/ruleset-xml-syntax/rules.html)
- [wazuh-logtest (Wazuh documentation)](https://documentation.wazuh.com/current/user-manual/reference/tools/wazuh-logtest.html)
- [Active response (Wazuh documentation)](https://documentation.wazuh.com/current/user-manual/capabilities/active-response/index.html)
