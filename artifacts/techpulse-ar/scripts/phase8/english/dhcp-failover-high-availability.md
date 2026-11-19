---
title: DHCP Failover on Windows Server: Keeping Addresses Flowing When a Server Fails
excerpt: How Windows Server DHCP failover works, load balance versus hot standby, the MCLT setting, and the steps to configure and test it.
---

When the only DHCP server goes down, nothing breaks immediately. Clients keep their leases. Then leases start expiring, new laptops and phones can't join, and the outage spreads slowly. DHCP failover, built into Windows Server since 2012, removes that single point of failure.

## How it works

Two DHCP servers share the same scopes and replicate lease information with each other. If one fails, the partner keeps serving the whole scope. No shared storage or clustering is needed.

## The two modes

- **Load balance**: both servers answer clients, splitting the work (50/50 by default). Good when both sit at the same site.
- **Hot standby**: one active server; the standby keeps a reserved percentage of addresses (5% by default) and takes over fully when the partner is down. Common for a branch office backed by a central server.

## Settings to understand

- **Maximum Client Lead Time (MCLT)**: how long a surviving server waits before taking over the partner's address pool after the partner enters the "partner down" state. One hour by default.
- **State switchover interval**: whether the server automatically moves to partner-down after a period of lost communication. Without it, an admin must mark the partner down manually.
- **Shared secret**: authenticates replication messages between the servers. Use it.

## Setting it up

1. Install the DHCP role on the second server and authorise it in Active Directory.
2. On the server holding the scope, right-click the scope (or IPv4) and choose **Configure Failover**.
3. Pick the partner, the mode, MCLT, and the shared secret.
4. Confirm that scope options and reservations replicated. After later changes, use **Replicate Scope** or `Invoke-DhcpServerv4FailoverReplication`, because configuration changes don't sync automatically.
5. If clients are on other subnets, add **both** servers as DHCP relay (IP helper) targets on routers and switches.

## Test it

Stop the DHCP service on one server during a quiet window, renew a client lease, and confirm the partner answers. Then restore the service and check the relationship returns to normal.

## FAQ

**Does failover cover IPv6?**
No. Windows DHCP failover supports IPv4 scopes only.

**Is split-scope still needed?**
Not for Windows Server 2012 and later. Failover replaced the old 80/20 split-scope practice.

## References

- [DHCP failover overview (Microsoft Learn)](https://learn.microsoft.com/en-us/windows-server/networking/technologies/dhcp/dhcp-failover)
