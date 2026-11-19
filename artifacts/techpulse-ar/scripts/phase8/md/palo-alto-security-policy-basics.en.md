A Palo Alto firewall reads its security rulebase the way you read a list of instructions: top to bottom, stopping at the first line that applies. Everything else about writing good PAN-OS policy follows from that one behaviour.

## How PAN-OS picks a rule

For each new session the firewall checks rules in order and applies the **first match**. Nothing below it is considered. Two default rules sit at the bottom of every rulebase:

- **intrazone-default**: allows traffic within the same zone.
- **interzone-default**: denies traffic between different zones.

So between zones, anything you haven't explicitly allowed is already blocked. Your job is to allow precisely, not to block everything by hand.

Matching uses source zone, destination zone, addresses, users, **applications** and services. If NAT is involved, remember the rule of thumb: pre-NAT IP addresses, post-NAT destination zone. Our [Palo Alto NAT worked examples](/article/palo-alto-nat-types-examples) walk through it.

## A layout that stays readable

Order rules from specific to general, and group them so a reviewer can find things:

1. **Explicit blocks** that must win: known-bad destinations, geolocation blocks, high-risk applications.
2. **Infrastructure**: DNS, NTP, domain controllers, management access from the admin network.
3. **Server and DMZ flows**: one rule per business flow, such as web tier to database on its port.
4. **User internet access**: allowed applications with security profiles attached.
5. **A final deny with logging**: an explicit "deny-all" above the defaults, so blocked sessions are logged where you can see them.

Tags and rule groups (or Panorama device groups at scale) keep this structure visible as the rulebase grows.

## Use App-ID properly

PAN-OS identifies the application, not just the port. A rule that allows `ssl` and `web-browsing` is narrower than one that allows TCP/443. Two habits make App-ID work for you:

- Set the service to **application-default**, so each app only runs on its standard ports.
- Use **Policy Optimizer** to find old port-based rules and see which applications actually use them, then convert them.

## Attach security profiles to allow rules

An allow rule without profiles just passes traffic. Attach a profile group (antivirus, anti-spyware, vulnerability protection, URL filtering, file blocking, WildFire) to every rule that allows internet or cross-zone traffic. Start with the vendor's best-practice profiles and tune from your logs.

## A complete example

| Field | Value |
|---|---|
| Name | users-to-internet-web |
| Source zone / address | trust / user subnets |
| Source user | known-user |
| Destination zone | untrust |
| Application | web-browsing, ssl |
| Service | application-default |
| Action | allow |
| Profiles | best-practice profile group |
| Log at session end | yes |

## Mistakes that weaken a rulebase

- **Service set to any** on an App-ID rule, which lets the app run on any port.
- **Shadowed rules**: a broad rule above a specific one means the specific one never matches. PAN-OS can flag shadowed rules at commit.
- **No logging on allow rules**, which leaves you blind in an investigation.
- **Rules nobody owns.** Every rule needs a description and a change reference. Review hit counts quarterly, as covered in our [firewall misconfiguration audit](/article/firewall-misconfigurations-audit).

## FAQ

**Do I need an explicit deny rule if interzone traffic is denied by default?**
It isn't required, but the default rules don't log by default. An explicit logged deny gives you visibility.

**Should I allow intrazone traffic?**
The default allows it. In sensitive zones, add rules that restrict it, or segment further.

**Is application-default always right?**
For most apps, yes. Some internal apps use non-standard ports. Define a custom service for those rather than using any.

## References

- [Security policy (Palo Alto Networks)](https://docs.paloaltonetworks.com/network-security/security-policy/administration/security-policy)
- [Security policy rule optimization (Palo Alto Networks)](https://docs.paloaltonetworks.com/ngfw/administration/app-id/security-policy-rule-optimization)
