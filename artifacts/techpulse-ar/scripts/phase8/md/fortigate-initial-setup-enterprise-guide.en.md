A FortiGate fresh out of the box will pass traffic within minutes. That is the problem: it is just as easy to ship one to production with the admin GUI reachable from the internet and a temporary allow-all rule nobody remembers adding. This build sheet is the order we actually follow when staging a new unit, with the reasoning behind each step.

## Before you rack it

Write down five things on one page: interface addressing, internal subnets, the ISP gateway, your DNS and NTP servers, and the people allowed to administer the box. Every later step depends on these, and changing them after policies exist is painful.

## 1. Claim the box: credentials and named admins

Factory defaults are `admin` with an empty password, and FortiOS forces a change at first login. Set a long password, store it in the team vault, and then stop using that account day to day. Create a named administrator for each engineer so the event log shows *who* changed a policy, not just that `admin` did.

## 2. Get onto a supported FortiOS build first

Upgrading after the configuration is done means testing everything twice. Open Fortinet's Upgrade Path Tool, enter your model, current build and target build, and follow the hops it gives you. Read the release notes for known issues, and subscribe to FortiGuard PSIRT advisories; management-plane and VPN bugs are a recurring theme across every firewall vendor.

## 3. Lock down the management plane

If you only do one thing from this guide, do this:

- Remove HTTPS, SSH and PING from `allowaccess` on internet-facing interfaces.
- Restrict each admin with trusted hosts so logins only work from the management network.
- Put MFA on admin accounts (FortiToken, or RADIUS/SAML to your identity provider).
- Set a lockout threshold for repeated failures.

```
config system global
    set hostname "HQ-FGT-01"
    set admin-sport 8443
    set admin-lockout-threshold 3
end
config system admin
    edit "net-ahmed"
        set trusthost1 10.10.99.0 255.255.255.0
    next
end
```

Moving the GUI to port 8443 is not a security control; it just keeps scanner noise out of your logs.

## 4. Interfaces, VLANs and zones

Give interfaces aliases people can read (WAN1, USERS, SERVERS, DMZ, MGMT) and split user, server and management traffic into VLANs. Group interfaces with the same trust level into zones so one policy covers them, which keeps the rulebase short. If segmentation is new to your team, start with [why VLANs matter](/article/vlan-basics-why-segment).

## 5. DNS, time and routing

Point DNS at your internal resolvers or FortiGuard, enable NTP, and set the time zone. Wrong clocks make log correlation during an incident close to impossible. Add the default route to the ISP; with two circuits, use SD-WAN with performance SLAs instead of two competing static routes.

## 6. Write policies around business flows

FortiGate denies anything you have not allowed. Keep it that way:

- One policy per real flow: users to internet, users to file servers, DMZ web tier to database.
- Named services, never `ALL`, unless you can explain why.
- Log allowed traffic, at least on sensitive policies.
- Put a comment and a change-ticket number on every policy.

## 7. Turn on security profiles in stages

Attach antivirus, web filtering, application control and IPS to the outbound policy. Run them in monitor mode for a week, review what would have been blocked, then enforce. Decide on SSL inspection with legal and HR, not just the network team.

## 8. Logging and backups

Ship logs to FortiAnalyzer or your SIEM; local disk is not a log strategy. Back up the encrypted configuration after each significant change and keep copies off the device. Our note on [SIEM log retention](/article/log-retention-siem-basics) covers how long to keep them.

## Go-live checklist

- Supported FortiOS on the official upgrade path
- No management access on WAN; trusted hosts and admin MFA in place
- No any-any rule; every policy commented
- NTP synced and logs arriving centrally
- Config backup stored off-box

## FAQ

**NAT/route mode or transparent mode?**
Most offices run NAT/route mode. Transparent mode helps when you need to drop a firewall into an existing network without re-addressing it.

**Should I build SSL VPN for remote users?**
Fortinet has removed SSL VPN tunnel mode from current FortiOS releases, so plan on IPsec or ZTNA from day one. See [moving from SSL VPN tunnel mode to IPsec](/article/fortios-ssl-vpn-tunnel-mode-removal-ipsec-migration).

**How often should the rulebase be reviewed?**
Quarterly is a sensible minimum. Use hit counts to find dead rules, as described in our [firewall misconfiguration audit](/article/firewall-misconfigurations-audit).

## References

- [FortiOS Administration Guide (Fortinet Document Library)](https://docs.fortinet.com/product/fortigate)
- [FortiGate Upgrade Path Tool (Fortinet)](https://docs.fortinet.com/upgrade-tool)
- [FortiGuard PSIRT advisories](https://www.fortiguard.com/psirt)
