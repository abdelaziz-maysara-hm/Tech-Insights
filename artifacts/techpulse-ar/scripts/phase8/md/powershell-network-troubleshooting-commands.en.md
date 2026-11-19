`ping` and `ipconfig` still have their place, but PowerShell's networking cmdlets answer more questions with less guesswork, and their output can be filtered, exported and scripted. This is the short list we reach for when a Windows machine "has no network", grouped by the question you're trying to answer.

## 1. What is this machine's network configuration?

```powershell
Get-NetIPConfiguration
Get-NetIPConfiguration -Detailed
```

One command shows each interface's IP address, default gateway and DNS servers. It's the quickest way to spot a missing gateway, an APIPA address (169.254.x.x, which means DHCP failed) or the wrong DNS servers.

Related:

```powershell
Get-NetAdapter | Select-Object Name, Status, LinkSpeed, MacAddress
Get-DnsClientServerAddress -AddressFamily IPv4
Get-NetRoute -AddressFamily IPv4 | Sort-Object RouteMetric
```

A link speed of 100 Mbps on a gigabit network points to a cable or port problem; the route table shows which interface wins when a VPN and Wi-Fi are both connected.

## 2. Can I reach it, and on which port?

`Test-NetConnection` (alias `tnc`) is the most useful single cmdlet here:

```powershell
Test-NetConnection fileserver01
Test-NetConnection mail.example.com -Port 587
Test-NetConnection 10.10.20.15 -Port 3389 -InformationLevel Detailed
Test-NetConnection www.example.com -TraceRoute
```

With `-Port`, the result's `TcpTestSucceeded` property tells you whether a TCP connection opened, which ping can never tell you. Many servers block ICMP but serve their application normally, so a failed ping on its own proves little.

How to read it:

| Result | Likely meaning |
|---|---|
| Ping fails, TCP succeeds | ICMP is blocked; the service is fine |
| Ping succeeds, TCP fails | Host is up; service stopped or a firewall blocks the port |
| Both fail | Routing, the host itself or a firewall in between |
| Name resolution fails | Go to step 3 |

For path problems, `pathping` combines traceroute with per-hop loss statistics over a couple of minutes, which helps distinguish a lossy hop from a router that simply deprioritises ICMP replies.

## 3. Is DNS the problem?

```powershell
Resolve-DnsName intranet.example.com
Resolve-DnsName intranet.example.com -Server 10.0.0.10
Clear-DnsClientCache
Get-DnsClientCache | Where-Object Entry -like '*example*'
```

Comparing the default answer with a specific server's answer separates "wrong server" from "wrong record". Our [DNS troubleshooting guide](/article/dns-troubleshooting-nslookup-dig) covers response codes and common scenarios.

## 4. What is listening, and who is connected?

```powershell
Get-NetTCPConnection -State Listen | Sort-Object LocalPort |
  Select-Object LocalAddress, LocalPort, OwningProcess,
    @{n='Process';e={(Get-Process -Id $_.OwningProcess).ProcessName}}

Get-NetTCPConnection -State Established -RemotePort 443
Get-NetUDPEndpoint | Sort-Object LocalPort
```

Mapping ports to processes answers "why is port 8080 open?" and helps during investigations. The [common ports cheat sheet](/article/common-network-ports-cheat-sheet) explains what usually runs where.

## 5. Is the local firewall in the way?

```powershell
Get-NetFirewallProfile | Select-Object Name, Enabled, DefaultInboundAction
Get-NetFirewallRule -Enabled True -Direction Inbound |
  Where-Object DisplayName -like '*Remote Desktop*'
```

See [Windows Firewall advanced rules](/article/windows-firewall-advanced-rules) for building rules properly rather than switching the firewall off.

## 6. Quick fixes, used deliberately

```powershell
Restart-NetAdapter -Name 'Ethernet'
ipconfig /release; ipconfig /renew
Clear-DnsClientCache
```

Run these after you've collected the evidence above, not instead of it; otherwise the problem may disappear without you learning why.

## Putting it together: a one-screen health check

```powershell
$target = 'fileserver01'
Get-NetIPConfiguration | Select-Object InterfaceAlias, IPv4Address, IPv4DefaultGateway, DNSServer
Resolve-DnsName $target -ErrorAction SilentlyContinue | Select-Object Name, IPAddress
Test-NetConnection $target -Port 445 | Select-Object ComputerName, RemoteAddress, PingSucceeded, TcpTestSucceeded
```

Save it as a script and give it to the helpdesk; the output tells the network team most of what they need in the first ticket update. For broader scripting, see our [PowerShell for sysadmins guide](/article/powershell-sysadmin-complete-guide).

## FAQ

### Is Test-NetConnection available on every Windows version?

It's part of the NetTCPIP module on Windows 8/Windows Server 2012 and later. On PowerShell 7, `Test-Connection -TcpPort` offers similar checks.

### Why does Test-NetConnection take so long when a port is closed?

It waits for the TCP connection attempt to time out and also tries ping. That delay itself suggests the traffic is being dropped silently rather than refused.

### Can these cmdlets run against remote machines?

Many accept `-CimSession`, or you can run them through PowerShell remoting with `Invoke-Command`.

## References

- [Microsoft Learn: Test-NetConnection](https://learn.microsoft.com/en-us/powershell/module/nettcpip/test-netconnection)
- [Microsoft Learn: Get-NetIPConfiguration](https://learn.microsoft.com/en-us/powershell/module/nettcpip/get-netipconfiguration)
- [Microsoft Learn: Get-NetTCPConnection](https://learn.microsoft.com/en-us/powershell/module/nettcpip/get-nettcpconnection)
- [Microsoft Learn: Resolve-DnsName](https://learn.microsoft.com/en-us/powershell/module/dnsclient/resolve-dnsname)
- [Microsoft Learn: pathping](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/pathping)
