When traffic doesn't pass a FortiGate and the logs aren't clear, the debug flow tells you exactly what the firewall decided for each packet: which route it found, which policy matched, whether NAT was applied, or why it dropped the packet. Combined with the packet sniffer, it answers "is it the firewall?" in minutes.

Run these commands in the CLI (or the GUI CLI console). Debug output is CPU-intensive, so always filter it and stop it when you're done.

## A safe debug flow sequence

```text
diagnose debug reset
diagnose debug flow filter clear
diagnose debug flow filter addr 10.10.20.15
diagnose debug flow filter dport 443
diagnose debug flow show function-name enable
diagnose debug console timestamp enable
diagnose debug flow trace start 100
diagnose debug enable
```

Now reproduce the problem (open the website, start the connection). When you have enough output:

```text
diagnose debug disable
diagnose debug flow trace stop
diagnose debug reset
```

Notes on the options:

- `filter addr` matches source or destination. Use `saddr`, `daddr`, `sport`, `dport` and `proto` to narrow further. For IPv6 the commands use `filter6` and `trace start6`.
- `trace start 100` stops after 100 trace lines, which protects the CPU if you forget to stop it.
- The GUI offers the same tool under **Network > Diagnostics > Debug Flow**, with CSV export.

## Reading the output

Each packet produces a short story. The lines that matter most:

| Message | What it means |
|---|---|
| `received a packet(proto=6, 10.10.20.15:51514->203.0.113.10:443) from port2` | The packet arrived, with its 5-tuple and ingress interface |
| `allocate a new session` | No existing session; this is the first packet of a new flow |
| `find a route: ... via port1` | Routing decision and egress interface |
| `find SNAT: IP-...` | Source NAT applied |
| `Allowed by Policy-12` | The policy that permitted the traffic |
| `Denied by forward policy check (policy 0)` | No policy matched, so the implicit deny dropped it |
| `reverse path check fail, drop` | The return route to the source points out a different interface (anti-spoofing) |
| `iprope_in_check() check failed on policy 0, drop` | Traffic to the FortiGate itself was denied, for example admin access not allowed on that interface |
| `Find an existing session` | A reply or follow-up packet matched an existing session |

**Policy 0** always means the implicit deny. Check source and destination interfaces, address objects, services and schedules on the policy you expected to match. Policy lookup (**Policy & Objects > Policy Lookup**) in the GUI can confirm which policy should apply.

## When debug flow shows nothing

If you see no output at all, the packet probably never reached the FortiGate, or the traffic is being **offloaded to NP6/NP7 processors**. Offloaded sessions are not visible in debug flow. Either test with ICMP, which isn't offloaded, or temporarily disable offloading on the policy you're testing (as described in Fortinet's documentation), and remember to turn it back on.

## Add the packet sniffer

The sniffer shows the packets themselves on each interface, which proves whether they arrive and leave:

```text
diagnose sniffer packet any 'host 10.10.20.15 and port 443' 4 20 l
```

The arguments are: interface (`any` for all), a tcpdump-style filter in quotes, verbosity (`4` includes the interface name), packet count, and `l` for local timestamps. Typical conclusions:

- Packet seen arriving on the inside interface but never leaving: look at debug flow for the drop reason.
- Packet leaving but no reply returning: the problem is upstream (ISP, remote firewall, server).
- Nothing arriving at all: routing or switching before the FortiGate.

## Other quick checks

- `diagnose sys session filter dst 203.0.113.10` followed by `diagnose sys session list` shows the session table for matching traffic. Clear the filter afterwards with `diagnose sys session filter clear`.
- `get router info routing-table all` confirms routes.
- For IPsec problems, the IKE debug is the right tool; see our [FortiGate to Palo Alto IPsec guide](/article/ipsec-site-to-site-fortigate-palo-alto).

For initial configuration best practice, see [FortiGate initial setup](/article/fortigate-initial-setup-enterprise-guide), and for remote access issues [FortiClient error -7200](/article/forticlient-error-7200-fix).

## FAQ

### Is it safe to run debug flow on a production firewall?

Yes, with tight filters and a trace count. Unfiltered debugs on a busy unit can raise CPU noticeably. Also note that if the FortiGate logs to FortiAnalyzer or FortiCloud, debug output may be recorded as event logs, so don't leave it running.

### Why does the output stop after a few lines?

You reached the count set by `trace start`. Run it again with a higher number if needed.

### What does policy 0 mean?

The implicit deny at the end of the policy list: no configured policy matched.

## References

- [Fortinet Document Library: Debugging the packet flow (FortiOS 7.6.6)](https://docs.fortinet.com/document/fortigate/7.6.6/administration-guide/54688)
- [Fortinet Document Library: Performing a traffic trace (FortiOS 7.6.6)](https://docs.fortinet.com/document/fortigate/7.6.6/administration-guide/314439)
