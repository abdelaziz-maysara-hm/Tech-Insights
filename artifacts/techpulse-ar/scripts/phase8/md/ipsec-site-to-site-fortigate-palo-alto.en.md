Mixed-vendor tunnels have a reputation for being fiddly. In practice FortiOS and PAN-OS interoperate well. Almost every failure comes down to one parameter that differs between the two ends, usually a default someone didn't know about. So we start with paper, not with the GUI.

## The parameter sheet (agree this first)

| Setting | Value used here |
|---|---|
| IKE version | IKEv2 |
| Authentication | Pre-shared key, 32+ random characters |
| Phase 1 | AES-256, SHA-256, DH group 14, 28,800 s |
| Phase 2 | ESP AES-256, SHA-256, PFS group 14, 3,600 s |
| Branch (FortiGate) LAN | 10.20.0.0/16, public IP 198.51.100.20 |
| HQ (Palo Alto) LAN | 10.10.0.0/16, public IP 203.0.113.10 |

The two products ship with different default lifetimes, so set them explicitly on both sides. If both ends support DH groups 19 or 20, prefer them.

## FortiGate side (CLI)

```
config vpn ipsec phase1-interface
    edit "to-HQ"
        set interface "wan1"
        set ike-version 2
        set peertype any
        set proposal aes256-sha256
        set dhgrp 14
        set keylife 28800
        set remote-gw 203.0.113.10
        set psksecret <pre-shared-key>
    next
end
config vpn ipsec phase2-interface
    edit "to-HQ-p2"
        set phase1name "to-HQ"
        set proposal aes256-sha256
        set dhgrp 14
        set keylifeseconds 3600
        set src-subnet 10.20.0.0 255.255.0.0
        set dst-subnet 10.10.0.0 255.255.0.0
    next
end
config router static
    edit 0
        set dst 10.10.0.0 255.255.0.0
        set device "to-HQ"
    next
end
```

Add two firewall policies (LAN → to-HQ and to-HQ → LAN) with NAT disabled.

## Palo Alto side (GUI order)

1. **Tunnel interface**: `tunnel.10`, in your virtual router, in a new zone `vpn-branch`.
2. **IKE Crypto profile**: AES-256 / SHA-256 / group14 / 8 hours.
3. **IPSec Crypto profile**: ESP, AES-256 / SHA-256, PFS group14, 1 hour.
4. **IKE Gateway**: IKEv2 only, external interface, peer 198.51.100.20, PSK.
5. **IPSec Tunnel**: bind `tunnel.10`, the gateway and crypto profile. Under **Proxy IDs** add local 10.10.0.0/16, remote 10.20.0.0/16.
6. **Static route**: 10.20.0.0/16 via `tunnel.10`.
7. **Security policy**: trust ↔ vpn-branch both ways. Make sure no NAT rule catches this traffic.

## The proxy-ID trap

PAN-OS builds route-based tunnels and, with no proxy IDs configured, proposes 0.0.0.0/0 traffic selectors. Our FortiGate proposes specific subnets. When selectors disagree, Phase 1 comes up and Phase 2 fails, which looks baffling until you know why. Either match specific subnets on both sides (as above) or use 0.0.0.0/0 on both and let routing decide.

## Troubleshooting toolkit

FortiGate:

```
diagnose vpn ike gateway list name to-HQ
diagnose vpn tunnel list name to-HQ
diagnose debug application ike -1
diagnose debug enable
```

Palo Alto:

```
show vpn ike-sa gateway <gateway>
show vpn ipsec-sa tunnel <tunnel>
test vpn ike-sa gateway <gateway>
less mp-log ikemgr.log
```

Symptom to cause:

- **No negotiation at all**: UDP 500/4500 blocked upstream, or no interesting traffic to trigger it.
- **Phase 1 fails**: PSK mismatch, or proposal/DH group mismatch.
- **Phase 2 fails**: traffic selectors (proxy IDs) or PFS mismatch.
- **Tunnel up, no traffic**: missing route, missing policy, or NAT translating tunnel traffic.

If inbound NAT rules on the Palo Alto side are part of your design, our [Palo Alto NAT worked examples](/article/palo-alto-nat-types-examples) cover rule ordering.

## FAQ

**Should I fall back to IKEv1 for compatibility?**
Only if one side cannot do IKEv2. IKEv2 rekeys more reliably and needs fewer messages.

**Do I need NAT traversal?**
Yes, if either peer sits behind NAT. Both products negotiate it automatically over UDP 4500.

**How do I add redundancy?**
Build a second tunnel over another ISP with tunnel monitoring and route preference, or use SD-WAN on the FortiGate.

## References

- [General IPsec VPN configuration (FortiOS 7.6, Fortinet)](https://docs.fortinet.com/document/fortigate/7.6.0/administration-guide/762500/ipsec-vpns)
- [Configure IPSec VPN tunnels, site-to-site (Palo Alto Networks)](https://docs.paloaltonetworks.com/network-security/ipsec-vpn/administration/set-up-site-to-site-vpn)
