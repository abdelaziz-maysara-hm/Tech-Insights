Subnetting looks like arithmetic homework until you are staring at a firewall rule at 2 a.m. and need to know whether 10.20.37.14 sits inside 10.20.32.0/21. This page is the reference we wish we had pinned next to the rack: the prefix table, the few rules that make mental subnetting fast, and the mistakes that cause real outages.

## The one idea behind every subnet

An IPv4 address is 32 bits. The prefix length after the slash says how many of those bits identify the network; the rest identify hosts. A /24 leaves 8 host bits, so the block holds 2^8 = 256 addresses. A /26 leaves 6, so 64 addresses. Every other number in the table below comes from that single rule.

In a normal subnet two addresses are reserved: the first (the network address) and the last (the broadcast address). That is why a /24 offers 254 usable hosts, not 256. Two exceptions matter in practice: a /31 on point-to-point links can use both addresses (RFC 3021), and a /32 describes a single host, which is how loopbacks and host routes are written.

## Prefix cheat sheet

| Prefix | Netmask | Wildcard | Addresses | Usable hosts |
|---|---|---|---|---|
| /16 | 255.255.0.0 | 0.0.255.255 | 65,536 | 65,534 |
| /20 | 255.255.240.0 | 0.0.15.255 | 4,096 | 4,094 |
| /21 | 255.255.248.0 | 0.0.7.255 | 2,048 | 2,046 |
| /22 | 255.255.252.0 | 0.0.3.255 | 1,024 | 1,022 |
| /23 | 255.255.254.0 | 0.0.1.255 | 512 | 510 |
| /24 | 255.255.255.0 | 0.0.0.255 | 256 | 254 |
| /25 | 255.255.255.128 | 0.0.0.127 | 128 | 126 |
| /26 | 255.255.255.192 | 0.0.0.63 | 64 | 62 |
| /27 | 255.255.255.224 | 0.0.0.31 | 32 | 30 |
| /28 | 255.255.255.240 | 0.0.0.15 | 16 | 14 |
| /29 | 255.255.255.248 | 0.0.0.7 | 8 | 6 |
| /30 | 255.255.255.252 | 0.0.0.3 | 4 | 2 |
| /31 | 255.255.255.254 | 0.0.0.1 | 2 | 2 (point-to-point) |
| /32 | 255.255.255.255 | 0.0.0.0 | 1 | 1 (host route) |

The wildcard column is simply the mask inverted. Cisco ACLs and OSPF network statements use it, so it is worth reading fluently.

## Doing it in your head: the block-size trick

Find the "interesting" octet, the one where the mask is neither 255 nor 0. Subtract the mask value in that octet from 256 to get the block size. Subnets start at multiples of that block size.

Example: is 10.20.37.14 inside 10.20.32.0/21?

1. A /21 mask is 255.255.248.0, so the interesting octet is the third.
2. Block size is 256 − 248 = 8. Third-octet boundaries are 0, 8, 16, 24, 32, 40...
3. 37 falls between 32 and 39, so the address belongs to 10.20.32.0/21, which runs from 10.20.32.0 to 10.20.39.255.

Yes, it is inside. With a little practice this takes seconds.

## Private ranges you will meet everywhere

RFC 1918 reserves three blocks for internal networks: 10.0.0.0/8, 172.16.0.0/12 (172.16.0.0 to 172.31.255.255) and 192.168.0.0/16. A common mistake is assuming all of 172.x.x.x is private; only 172.16 through 172.31 is.

Pick internal ranges that are unlikely to collide with home routers and partner networks. Using 192.168.1.0/24 for an office guarantees pain the first time a remote worker on a home network with the same range connects over VPN.

## Planning subnets that don't fight you later

- **Size for growth.** If a VLAN has 50 devices today, a /26 (62 hosts) leaves almost no room. A /25 costs little and avoids renumbering.
- **Allocate largest first.** When splitting a block into different sizes (VLSM), place the biggest subnets first so every block stays aligned to its own size.
- **Keep summarisation possible.** Give each site a contiguous block, such as a /20 per branch, so the core and the firewalls can route and filter it as one prefix.
- **Document as you go.** An address plan in a spreadsheet beats one in someone's memory.

Our [VLSM subnet calculator](/tools/vlsm-subnet-calculator) builds a non-overlapping plan from host counts, and the [range to CIDR and wildcard tool](/tools/ip-range-to-cidr-wildcard) turns an arbitrary IP range into the minimal list of CIDR blocks for firewall objects. For why segmentation matters in the first place, read [VLAN basics](/article/vlan-basics-why-segment).

## Mistakes that cause real outages

- **A wrong mask on one host.** A server configured with /16 instead of /24 believes far-away addresses are local and sends ARP requests instead of using its gateway.
- **Overlapping subnets across a VPN.** Two sites both using 192.168.10.0/24 cannot route to each other without NAT.
- **Using the network or broadcast address as a host.** Some devices accept it; many others behave strangely.
- **Forgetting the gateway, printers and management interfaces** when counting hosts.

## FAQ

### How many hosts does a /23 give me?

510 usable addresses: 512 in total minus the network and broadcast addresses.

### Should I use /30 or /31 for router links?

If both devices support RFC 3021, a /31 saves two addresses per link. /30 remains the safe choice on mixed or older equipment.

### What is the difference between a netmask and a wildcard mask?

They are bitwise opposites. 255.255.255.0 as a netmask corresponds to 0.0.0.255 as a wildcard. Netmasks configure interfaces; wildcards appear in ACLs and some routing statements.

### Is subnetting still worth learning with IPv6 coming?

Yes. IPv4 will run alongside IPv6 in most networks for years, and the same prefix logic applies to IPv6, just with far larger numbers.

## References

- [RFC 4632: Classless Inter-domain Routing (CIDR)](https://www.rfc-editor.org/rfc/rfc4632)
- [RFC 1918: Address Allocation for Private Internets](https://www.rfc-editor.org/rfc/rfc1918)
- [RFC 3021: Using 31-Bit Prefixes on IPv4 Point-to-Point Links](https://www.rfc-editor.org/rfc/rfc3021)
