If you have ever built a perfectly good NAT rule on a Palo Alto firewall and still watched the traffic hit the default deny, you are in good company. NAT on PAN-OS is not hard, but it follows one counter-intuitive rule. Learn that first and the rest is pattern-matching.

## The pre-NAT / post-NAT rule

> **Security policy:** match on the **pre-NAT IP addresses** and the **post-NAT destination zone**.
> **NAT policy:** everything is pre-NAT, including the destination zone, which comes from a route lookup on the original destination IP.

The firewall decides the egress zone from the routing table once NAT has been evaluated, but it still matches the addresses that arrived in the packet. Keep that table in your head and most NAT tickets solve themselves.

## Scenario 1: Office users out to the internet (DIPP)

Dynamic IP and Port (DIPP) is the everyday choice: hundreds of internal hosts share one public address and the firewall rewrites source ports.

| NAT rule field | Value |
|---|---|
| Source zone | trust |
| Destination zone | untrust |
| Translation | Dynamic IP and Port, interface address of ethernet1/1 |

The matching security rule is simply trust → untrust with the applications you allow. No public IPs appear in it.

## Scenario 2: A pool of public IPs (Dynamic IP)

Dynamic IP translates to an address pool without rewriting ports. It helps with applications that dislike port translation. Pools can run out, so configure DIPP as the overflow option.

## Scenario 3: One server, one public identity (Static IP)

Your mail relay at 10.1.1.25 should always appear as 203.0.113.25. Use a Static IP source translation. Ticking **Bi-directional** makes PAN-OS create the inbound mapping implicitly as well. Many teams prefer an explicit destination NAT rule instead, because reviewers can see it in the rulebase.

## Scenario 4: Publishing a web server (Destination NAT)

Web server 10.1.1.10 lives in the dmz zone and should answer on 203.0.113.10:443.

**NAT rule**
- Source zone: untrust
- Destination zone: **untrust** (the public IP routes out the internet interface)
- Destination address: 203.0.113.10, service: service-https
- Destination translation: 10.1.1.10

**Security rule**
- untrust → **dmz** (post-NAT zone)
- Destination address: **203.0.113.10** (pre-NAT IP)
- Applications: ssl, web-browsing

Get either of those two bold values wrong and the session is denied.

## Scenario 5: Staff browsing to the public IP (U-turn)

An internal user resolves the site through public DNS, gets 203.0.113.10, and sends the request from the trust zone. The DNAT rule above does not match, because its source zone is untrust. Two fixes:

1. **Split DNS** (usually the cleanest): internal DNS answers with 10.1.1.10.
2. **U-turn NAT**: trust → untrust, destination 203.0.113.10, translate the destination to 10.1.1.10 *and* translate the source to the firewall's dmz interface IP. Without the source translation the server replies straight to the client, bypassing the firewall, and the session breaks.

## Rule order matters

NAT rules are evaluated top-down and the first match wins. Put specific rules (published servers, exceptions) above the broad DIPP rule.

## Verify before you test with real traffic

```
test nat-policy-match from untrust to untrust source 198.51.100.5 destination 203.0.113.10 destination-port 443 protocol 6
show session all filter destination 203.0.113.10
show running nat-policy
```

`test nat-policy-match` tells you which rule will hit before you touch production traffic. If you are new to PAN-OS rule design, read [Palo Alto security policy basics](/article/palo-alto-security-policy-basics) first, and see the [site-to-site IPsec guide](/article/ipsec-site-to-site-fortigate-palo-alto) for when you need NAT exemptions over a tunnel.

## FAQ

**Why is the DNAT rule's destination zone untrust?**
Because NAT is evaluated against the original packet, and the original destination (the public IP) routes toward the internet interface.

**Do I need proxy ARP for NAT addresses?**
If the public IP sits in the WAN interface subnet, PAN-OS answers ARP for it in most designs. If it belongs to a separate block, ask your ISP to route that block to your interface address.

**Can one rule translate both source and destination?**
Yes. That is exactly what a U-turn rule does.

## References

- [NAT (PAN-OS Networking Administrator's Guide, Palo Alto Networks)](https://docs.paloaltonetworks.com/ngfw/networking/nat)
- [NAT policy rules (PAN-OS Networking Administrator's Guide, Palo Alto Networks)](https://docs.paloaltonetworks.com/ngfw/networking/nat/nat-policy-rules)
