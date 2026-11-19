---
title: Creating a Reverse Lookup Zone on Windows Server DNS
excerpt: Why PTR records matter for logs, mail and troubleshooting, how to create an AD-integrated reverse zone for IPv4, and how to keep PTR records populated automatically.
---

Forward lookup turns a name into an address. Reverse lookup does the opposite, using PTR records in special zones under `in-addr.arpa` (IPv4) or `ip6.arpa` (IPv6). Networks run without them, but you'll miss them when a firewall log is full of bare IP addresses.

## Why bother

- **Readable logs and tools**: firewalls, SIEMs, `nslookup`, `tracert` and Wireshark can show names instead of numbers.
- **Mail servers**: receiving servers often check that a sending IP has a PTR record that matches. That's for your public IPs, which your ISP or cloud provider controls, not your internal zone.
- **Some applications** verify reverse records during authentication or logging.

## How reverse zones are named

The network portion of the address is written backwards. For `10.20.30.0/24`, the zone is `30.20.10.in-addr.arpa`, and the host `10.20.30.15` gets a PTR record named `15` in that zone pointing to `server01.corp.local`.

## Creating the zone

1. Open **DNS Manager**, right-click **Reverse Lookup Zones**, choose **New Zone**.
2. Choose **Primary zone** and tick **Store the zone in Active Directory** (on a DC) so it replicates with AD and supports secure updates.
3. Pick the replication scope, usually all DNS servers in the domain.
4. Choose **IPv4 Reverse Lookup Zone** and enter the network ID (for example `10.20.30`).
5. Select **Allow only secure dynamic updates**.

Or in PowerShell:

```powershell
Add-DnsServerPrimaryZone -NetworkId "10.20.30.0/24" -ReplicationScope Domain -DynamicUpdate Secure
```

Create one zone per subnet you use, or a broader zone such as `20.10.in-addr.arpa` for a /16.

## Filling it with records

- **Domain-joined Windows clients** register their own PTR records once the zone exists, when "Register this connection's addresses in DNS" is enabled.
- **DHCP** can register records for clients that don't: in the DHCP server's DNS settings, enable dynamic updates. Configure DHCP to use a dedicated low-privilege credential for registration.
- **Servers and network devices with static addresses**: tick "Update associated pointer (PTR) record" when creating A records, or add PTRs manually.

Test with `nslookup 10.20.30.15`.

## Housekeeping

Enable **scavenging** on the zone and server so stale dynamic records are cleaned up. Set it carefully: overly aggressive scavenging removes valid records. Static records aren't scavenged.

## FAQ

**Do I need reverse zones for Active Directory to work?**
No. AD needs forward zones and SRV records. Reverse zones are strongly recommended for operations.

**Why does my public IP have the wrong PTR?**
Public reverse zones belong to whoever owns the address block. Ask your ISP or set it in your cloud provider's console.

## References

- [Add-DnsServerPrimaryZone (Microsoft Learn)](https://learn.microsoft.com/en-us/powershell/module/dnsserver/add-dnsserverprimaryzone)
- [RFC 1035: Domain Names, Implementation and Specification](https://www.rfc-editor.org/rfc/rfc1035)
