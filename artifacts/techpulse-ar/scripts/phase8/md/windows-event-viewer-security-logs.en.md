Open the Security log on a busy domain controller and you'll see thousands of events an hour. Almost all of it is normal. The skill is knowing which handful of event IDs deserve your attention, and making Event Viewer show you only those.

## First, make sure the events exist

Windows only logs what audit policy tells it to. On domain controllers and servers, configure **Advanced Audit Policy Configuration** through Group Policy (not the legacy basic policy) for at least: Logon/Logoff, Account Logon, Account Management, Policy Change, Privilege Use (sensitive) and Process Creation. Also raise the Security log's maximum size. The defaults roll over quickly on a DC.

## The events worth knowing by heart

| ID | Meaning | Why you care |
|---|---|---|
| 4624 | Successful logon | Check logon type: 3 network, 10 RemoteInteractive (RDP) |
| 4625 | Failed logon | Bursts suggest password guessing |
| 4648 | Logon with explicit credentials | "Run as" use, and some lateral movement |
| 4672 | Special privileges assigned | Admin-equivalent logons |
| 4720 | User account created | Was it expected? |
| 4728 / 4732 / 4756 | Member added to a security group | Especially Domain Admins and other privileged groups |
| 4740 | Account locked out | Find the source of repeated failures |
| 4768 / 4769 | Kerberos TGT / service ticket | Baseline for Kerberos attacks |
| 1102 | Security log cleared | Rarely legitimate. Investigate |

The [Windows Security event ID reference for SOC analysts](/article/windows-security-event-ids-soc) expands on each one.

## Make Event Viewer do the filtering

**Filter Current Log** accepts a list of IDs (for example `4625,4740`) and a time range. For anything you check regularly, save it as a **Custom View** so it's one click next time.

For precise filters, use the XML tab. This shows failed logons for one account:

```xml
<QueryList>
  <Query Id="0" Path="Security">
    <Select Path="Security">
      *[System[(EventID=4625)]] and *[EventData[Data[@Name='TargetUserName']='j.smith']]
    </Select>
  </Query>
</QueryList>
```

From PowerShell, `Get-WinEvent` does the same and scales to many servers:

```powershell
Get-WinEvent -FilterHashtable @{LogName='Security'; Id=4740; StartTime=(Get-Date).AddDays(-1)}
```

## A ten-minute daily routine

1. **Privileged group changes** (4728, 4732, 4756): every one should match a ticket.
2. **New accounts** (4720) and **lockouts** (4740).
3. **Failed logon spikes** (4625) by source host.
4. **Log cleared** (1102) on any server.
5. **RDP logons** (4624 type 10) to servers from unusual sources.

When this routine starts taking an hour, you've outgrown Event Viewer. Forward events to a central collector or SIEM (see [how a SIEM works](/article/how-siem-actually-works)) so you can correlate across machines.

## FAQ

**Why don't I see 4688 process events?**
Process Creation auditing is off by default. Enable it, and the policy to include command lines, through Group Policy.

**Logs roll over too fast. What can I do?**
Increase the maximum log size and forward events off the server with Windows Event Forwarding or an agent.

**Is Event Viewer enough for compliance?**
Rarely. Most frameworks expect central, tamper-resistant log storage and defined retention.

## References

- [Advanced security audit policy settings (Microsoft Learn)](https://learn.microsoft.com/windows/security/threat-protection/auditing/advanced-security-audit-policy-settings)
- [Events to monitor (Microsoft Learn)](https://learn.microsoft.com/windows-server/identity/ad-ds/plan/appendix-l--events-to-monitor)
