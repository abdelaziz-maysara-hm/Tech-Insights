Every firewall rule, packet capture and incident ticket eventually comes down to a port number. This cheat sheet lists the ports network and security teams meet most often, what normally runs on them, and what to watch for when you see them open where they shouldn't be.

Port numbers are assigned by IANA. The ranges are: well-known ports 0–1023, registered ports 1024–49151, and dynamic or private ports 49152–65535 (RFC 6335). A service can run on any port, so a number is a hint, not proof of what is listening.

## Remote access and administration

| Port | Protocol | Service | Security note |
|---|---|---|---|
| 22 | TCP | SSH, SFTP, SCP | Keys instead of passwords; never expose to the internet without restrictions |
| 23 | TCP | Telnet | Cleartext; disable it everywhere |
| 3389 | TCP/UDP | RDP | Heavily brute-forced; publish only through a gateway or VPN |
| 5900 | TCP | VNC | Often weakly protected; keep internal |
| 5985 / 5986 | TCP | WinRM over HTTP / HTTPS | Restrict to admin networks |

## Web and email

| Port | Protocol | Service | Security note |
|---|---|---|---|
| 80 | TCP | HTTP | Redirect to HTTPS |
| 443 | TCP | HTTPS; also many VPNs | UDP 443 carries HTTP/3 (QUIC) |
| 25 | TCP | SMTP between mail servers | Block outbound from user devices |
| 465 | TCP | SMTP submission over implicit TLS | |
| 587 | TCP | SMTP submission (STARTTLS) | Require authentication |
| 110 / 995 | TCP | POP3 / POP3 over TLS | Prefer the TLS port |
| 143 / 993 | TCP | IMAP / IMAP over TLS | Prefer the TLS port |

## Core network services

| Port | Protocol | Service | Security note |
|---|---|---|---|
| 53 | UDP/TCP | DNS | TCP is needed for large answers and zone transfers |
| 67 / 68 | UDP | DHCP server / client | Use DHCP snooping on access switches |
| 123 | UDP | NTP | Accurate time is essential for logs |
| 161 / 162 | UDP | SNMP / SNMP traps | Use SNMPv3; v1/v2c send community strings in clear |
| 514 | UDP | Syslog | Cleartext; RFC 5425 defines syslog over TLS on 6514 |
| 1812 / 1813 | UDP | RADIUS authentication / accounting | Older gear may use 1645/1646 |
| 49 | TCP | TACACS+ | Device administration AAA |

## Windows and Active Directory

| Port | Protocol | Service | Security note |
|---|---|---|---|
| 88 | TCP/UDP | Kerberos | Domain controllers only |
| 135 | TCP | RPC endpoint mapper | Dynamic RPC then uses 49152–65535 |
| 137–139 | UDP/TCP | NetBIOS | Legacy; disable where possible |
| 389 / 636 | TCP | LDAP / LDAPS | Prefer signing and LDAPS |
| 445 | TCP | SMB | Never expose to the internet |
| 3268 / 3269 | TCP | Global Catalog / over TLS | |

## Databases and infrastructure

| Port | Service | Security note |
|---|---|---|
| 1433 | Microsoft SQL Server | Keep on server networks only |
| 3306 | MySQL / MariaDB | |
| 5432 | PostgreSQL | |
| 6379 | Redis | Historically shipped without authentication by default |
| 9200 | Elasticsearch HTTP API | Frequently found exposed in breaches |
| 27017 | MongoDB | Same story as Redis and Elasticsearch |
| 2049 | NFS | |
| 500 / 4500 | IKE / IPsec NAT traversal (UDP) | Needed for site-to-site and IPsec remote access |

## How to check what is really listening

On Windows, `Get-NetTCPConnection -State Listen` lists listening sockets with their owning process ID; add `Get-Process -Id <pid>` to name the program. `Test-NetConnection server -Port 443` checks reachability from a client.

On Linux, `ss -tulpn` shows listening TCP and UDP sockets with processes. From another machine, an authorised scan with Nmap tells you what is reachable across the network; our [Nmap guide](/article/nmap-network-scanning-complete-guide) covers safe usage.

Seeing an unexpected port? Identify the process before assuming malware: backup agents, monitoring tools and printers open odd ports all the time. If the owning process makes no sense, treat it as an incident.

## Turning this into firewall policy

1. Start from default deny between zones.
2. Allow by service and destination, not "any".
3. Keep admin ports (22, 3389, 5985/5986, SNMP) reachable only from a management network.
4. Log denies at zone boundaries and review them; scanning patterns show up quickly.

For the bigger picture, see [firewall misconfigurations to audit](/article/firewall-misconfigurations-audit) and [Windows Firewall advanced rules](/article/windows-firewall-advanced-rules).

## FAQ

### Does closing a port make a service secure?

It removes exposure from that path. The service still needs patching and authentication, because attackers who get inside can reach it from other directions.

### Why does RDP show both TCP and UDP 3389?

Modern RDP clients use UDP for better performance when available and fall back to TCP.

### Is changing SSH or RDP to a non-standard port worth it?

It reduces noise from automated scans but is not a security control. Restrict access by source and require strong authentication.

## References

- [IANA: Service Name and Transport Protocol Port Number Registry](https://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.xhtml)
- [RFC 6335: Procedures for the Management of the Service Name and Transport Protocol Port Number Registry](https://www.rfc-editor.org/rfc/rfc6335)
- [Microsoft Learn: Get-NetTCPConnection](https://learn.microsoft.com/en-us/powershell/module/nettcpip/get-nettcpconnection)
