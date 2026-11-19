"Windows has detected an IP address conflict." Two devices claiming the same address leads to intermittent connectivity for both, and when the duplicate is a gateway or a server, it can affect a whole subnet. Here is how to find the other device and stop conflicts from coming back.

## How conflicts happen

- **A static address inside the DHCP scope.** Someone configures a printer or server with an address that the DHCP server later hands to a laptop.
- **Two DHCP servers on one network**, often a home router or a misconfigured device plugged into the office LAN.
- **Cloned virtual machines or images** that kept a static address.
- **A device returning after a long absence** with an address that has since been reused.
- **Rarely, an attacker** deliberately answering ARP for someone else's address to intercept traffic (ARP spoofing).

## Step 1: confirm the conflict and get the other MAC address

On Windows, conflicts are logged in the **System** log by the **Tcpip** source as **event 4199**, which includes the hardware (MAC) address of the other system. That MAC is the key to everything that follows.

You can also check from any machine on the same subnet:

```powershell
Test-Connection 10.10.20.50 -Count 2
Get-NetNeighbor -IPAddress 10.10.20.50
```

`Get-NetNeighbor` (or `arp -a`) shows which MAC currently answers for the address. Run it a few times; if the MAC alternates, two devices are fighting over it.

On Linux, `arping -D -I eth0 10.10.20.50` performs duplicate address detection in the style of RFC 5227 and reports any reply.

Network gear logs conflicts too; Cisco IOS, for example, reports `%IP-4-DUPADDR` with the offending MAC when someone uses the switch's own interface address.

## Step 2: find the device behind the MAC

1. **Look up the vendor** from the first half of the MAC address (the OUI). "Printer manufacturer" or "hypervisor" narrows it down instantly.
2. **Find the switch port:** on the core or distribution switch, look the MAC up in the address table (`show mac address-table address aaaa.bbbb.cccc` on Cisco), then follow it down to the access switch and port.
3. **Check DHCP:** search the DHCP server's leases for the MAC, for example with `Get-DhcpServerv4Lease -ScopeId 10.10.20.0` on Windows Server, to see its hostname.
4. **Check the IPAM spreadsheet or tool** for who was assigned that address.

## Step 3: fix it properly

- If a static device sits inside the DHCP scope, either move it outside the scope or add a **DHCP exclusion or reservation** for its address.
- If a rogue DHCP server is handing out addresses, shut its port and enable **DHCP snooping** on access switches so only trusted ports can answer DHCP requests.
- For cloned machines, give each its own address and document it.
- On the Windows DHCP server, you can enable **conflict detection attempts**, which makes the server ping an address before leasing it. It adds a small delay to each lease, so use one or two attempts, and only while you clean up.

## Preventing repeat conflicts

- Keep a clear split between static ranges and DHCP scopes, and write it down.
- Use DHCP reservations instead of static addresses wherever devices support it.
- Enable DHCP snooping and Dynamic ARP Inspection on access switches. DAI uses the snooping binding table to drop ARP replies that don't match, which also blocks ARP spoofing.
- Make your DHCP service resilient; see [DHCP failover and high availability](/article/dhcp-failover-high-availability).
- Plan subnets with room to grow so nobody is tempted to squeeze in "just one" static address. The [subnetting cheat sheet](/article/subnetting-cheat-sheet-cidr) helps.

## FAQ

### Can an IP conflict be an attack?

It can. ARP spoofing makes an attacker's device answer for another address, often the gateway, to intercept traffic. If the conflicting MAC belongs to an unknown device, especially for the gateway address, treat it as a security incident.

### Why do conflicts appear after a power cut?

Devices come back in a different order. A static device that was off for a while may find its address already leased, or a DHCP server may start before its failover partner.

### Does IPv6 have the same problem?

IPv6 hosts run Duplicate Address Detection automatically before using an address, so silent conflicts are much rarer, though not impossible with static configuration.

## References

- [RFC 5227: IPv4 Address Conflict Detection](https://www.rfc-editor.org/rfc/rfc5227)
- [Microsoft Learn: Get-DhcpServerv4Lease](https://learn.microsoft.com/en-us/powershell/module/dhcpserver/get-dhcpserverv4lease)
- [Microsoft Learn: DHCP on Windows Server](https://learn.microsoft.com/en-us/windows-server/networking/technologies/dhcp/dhcp-top)
