Remote Desktop is one of the most useful tools in Windows administration and one of the most abused doors into corporate networks. Internet-facing RDP is scanned constantly, and government advisories on ransomware groups repeatedly list exposed RDP among the ways attackers get in. The good news: a handful of controls make RDP far harder to abuse without making it painful to use.

## First, find out where RDP is exposed

You can't protect what you don't know about. Check:

- **Firewall and NAT rules** for anything forwarding TCP or UDP 3389, or a custom port, to an internal host.
- **Cloud virtual machines** with public IPs and permissive security groups. This is the most common accidental exposure.
- **External scans** of your own public ranges, run with authorisation.

Anything reachable directly from the internet is the first thing to fix.

## The controls that matter, in priority order

### 1. Never publish RDP directly

Put RDP behind something that authenticates users before they reach Windows:

- **Remote Desktop Gateway**, which wraps RDP inside HTTPS on port 443 and lets you apply policies about who may connect to which hosts.
- **A VPN or a zero-trust access service** that requires MFA before any internal address is reachable. Our [ZTNA with FortiGate and FortiClient EMS](/article/ztna-fortigate-forticlient-ems) guide shows one approach.

Either way, the RDP listener itself should only accept connections from the gateway, VPN pool or management network.

### 2. Require MFA

Passwords alone will eventually be guessed or phished. Enforce MFA at the gateway or VPN layer, and use phishing-resistant methods for administrators where possible.

### 3. Keep Network Level Authentication on

NLA forces the user to authenticate before a full remote session is created. It reduces the resources an unauthenticated attacker can consume and blocks some pre-authentication attacks. It is on by default in modern Windows; make sure nobody turned it off for convenience.

### 4. Limit who can log on remotely

Remove broad groups from the "Allow log on through Remote Desktop Services" right and the Remote Desktop Users group. Grant access to specific admin or support groups per server. Use [Group Policy](/article/group-policy-basics-for-sysadmins) so the setting is consistent.

### 5. Lock out guessing, carefully

Configure an account lockout policy so automated guessing stalls. Recent Windows 11 releases ship with a default lockout policy for local accounts, but domain policy is up to you. Avoid making the threshold so low that attackers can lock out staff at will. See [finding the source of account lockouts](/article/ad-account-lockout-source-event-4740) for the operational side.

### 6. Protect admin credentials in transit

When administrators connect to servers, **Remote Credential Guard** keeps their credentials on the client instead of sending them to the remote host, which helps when that host might already be compromised. Combine it with unique local admin passwords via [Windows LAPS](/article/windows-local-admin-password-rotation).

### 7. Patch

RDP has had serious remote-code-execution vulnerabilities in the past. Keep both servers and clients updated as part of your normal [patch management](/article/windows-patch-management-strategy).

## Detect attacks against RDP

Even with good controls, monitor:

- **Event 4625** with logon type 10 (remote interactive) or 3 for failed logons; a burst from one source or across many accounts is a red flag.
- **Event 4624** with logon type 10 for successful RDP logons, especially at odd times or from unusual addresses.
- The **TerminalServices-RemoteConnectionManager** and **LocalSessionManager** operational logs, which record connection attempts and session logons.

Forward these to your SIEM and alert on spikes. [Windows security event IDs for SOC teams](/article/windows-security-event-ids-soc) lists the details.

## A quick hardening checklist

- [ ] No RDP reachable directly from the internet.
- [ ] Access only through RD Gateway, VPN or ZTNA, with MFA.
- [ ] NLA enabled on every host.
- [ ] Remote logon rights limited to named groups.
- [ ] Account lockout policy configured and monitored.
- [ ] LAPS deployed; Remote Credential Guard for admins.
- [ ] Failed and successful RDP logons sent to the SIEM.

## FAQ

### Is moving RDP to another port enough?

No. Scanners find RDP on non-standard ports quickly. It cuts noise, but it is not protection.

### We use a cloud VM. Do the same rules apply?

Yes. Restrict the security group to known addresses, or better, use the provider's bastion or just-in-time access feature, and keep MFA in front.

### Does NLA stop brute force?

No. It requires authentication earlier, which helps, but attackers can still guess passwords through it. Gateways, MFA and lockout do the heavy lifting.

## References

- [Microsoft Learn: Remote Desktop Gateway role](https://learn.microsoft.com/en-us/windows-server/remote/remote-desktop-services/remote-desktop-gateway-role)
- [Microsoft Learn: Remote Credential Guard](https://learn.microsoft.com/en-us/windows/security/identity-protection/remote-credential-guard)
- [Microsoft Learn: Account lockout policy](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/security-policy-settings/account-lockout-policy)
- [CISA: #StopRansomware: Royal Ransomware (AA23-061A)](https://www.cisa.gov/news-events/cybersecurity-advisories/aa23-061a)
