In a flat network, every device can talk to every other device. That's convenient right up until one laptop gets ransomware and finds the file servers, the backup appliance and the CCTV recorder all one hop away. VLANs are the cheapest first step out of that situation.

## What a VLAN actually is

A VLAN (IEEE 802.1Q) splits one physical switch into several logical ones. Ports in VLAN 10 and ports in VLAN 20 behave as if they were on different switches: broadcasts stay inside their VLAN, and devices can't reach each other at layer 2.

Two port types do most of the work:

- **Access port**: carries one VLAN, untagged. Used for PCs, printers and phones (phones often add a voice VLAN).
- **Trunk port**: carries several VLANs between switches, routers and firewalls, with each frame tagged with its VLAN ID.

To get from one VLAN to another, traffic has to be **routed**. That's the point. If routing happens on a firewall, or on a layer-3 switch with ACLs, you now have a place to decide what's allowed.

## A segmentation plan that fits most offices

| VLAN | Purpose | Typical policy |
|---|---|---|
| 10 Users | Staff workstations | Internet; specific servers on specific ports |
| 20 Servers | Internal servers | Only from users and admins on required services |
| 30 Management | Switch, firewall and hypervisor interfaces | Only from the admin jump host |
| 40 Voice | IP phones | Call manager and SIP trunk only |
| 50 Printers and IoT | Printers, cameras, building systems | Print servers in; nothing out except updates |
| 60 Guest | Visitor Wi-Fi | Internet only. See [guest Wi-Fi isolation](/article/guest-wifi-network-isolation) |

Start with this, then split further as needed: separate VLANs for payment systems, OT or a DMZ.

## Rolling it out

1. **Inventory and group devices** by function and trust.
2. **Create VLANs and trunks** on the switches. Prune trunks to only the VLANs each link needs.
3. **Move inter-VLAN routing to the firewall** (or add ACLs on the core switch).
4. **Start with logging-only allow rules** between VLANs, learn the real flows for a week or two, then tighten.
5. **Move devices in waves**, starting with low-risk groups like printers and guest.

## Mistakes that undo segmentation

- **Routing everything on the core switch with no ACLs.** The VLANs exist, but anything can still reach anything.
- **Leaving VLAN 1 as the native VLAN** on trunks and unused ports in VLAN 1. Change the native VLAN to an unused ID and shut unused ports.
- **Trunks allowing all VLANs** everywhere, which spreads every network to every closet.
- **Management interfaces in the user VLAN.**
- **No documentation**, so the next engineer adds a "temporary" any-any rule between VLANs.

Segmentation is also a compliance requirement in several frameworks. Our guide to [network segmentation and compliance](/article/network-segmentation-compliance) covers scoping, and [802.1X with certificates](/article/802-1x-certificate-authentication) can assign VLANs dynamically.

## FAQ

**VLANs or subnets?**
Both. Normally each VLAN maps to one IP subnet; the VLAN separates layer 2, the subnet gives routing and policy something to work with.

**Does a VLAN alone make things secure?**
No. It creates the boundary; firewall rules or ACLs between VLANs enforce it.

**What about VLAN hopping?**
Using a dedicated, unused native VLAN, disabling auto-trunking (DTP on Cisco) on access ports and pruning trunks closes the classic techniques.

## References

- [IEEE 802.1Q: Bridges and Bridged Networks (IEEE Standards Association)](https://standards.ieee.org/ieee/802.1Q/10323/)
- [NIST SP 800-41 Rev. 1: Guidelines on Firewalls and Firewall Policy](https://csrc.nist.gov/pubs/sp/800/41/r1/final)
