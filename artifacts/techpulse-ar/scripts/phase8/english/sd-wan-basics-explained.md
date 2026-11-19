---
title: SD-WAN in Plain Terms: What It Fixes for Multi-Site Networks
excerpt: How SD-WAN steers traffic across broadband, LTE and MPLS links based on application and link quality, the operational benefits, the security considerations, and how it relates to SASE.
---

Traditional branch networks backhauled everything over expensive MPLS circuits to headquarters, then out to the internet. That made sense when applications lived in the head-office data centre. With Microsoft 365, SaaS and cloud workloads, it adds latency and cost. SD-WAN changes how branches connect.

## What SD-WAN does

- **Uses several links at once**: broadband, fibre, LTE/5G and MPLS, combined into an overlay of encrypted tunnels.
- **Steers traffic by application**: voice and video over the link with the lowest latency and loss right now; bulk backups over the cheapest.
- **Measures link quality continuously** and moves traffic away from a degrading link within seconds.
- **Local internet breakout**: trusted SaaS traffic goes straight to the internet from the branch instead of via headquarters.
- **Central management**: policies, templates and zero-touch provisioning, so a new branch device configures itself when plugged in.

## What it solves

- Lower WAN costs by replacing or reducing MPLS with business broadband.
- Better SaaS and video-call performance.
- Resilience: a failed circuit no longer means a branch outage.
- Faster deployment of new sites.

## Security considerations

- **Local breakout means local security**: each branch needs firewalling, web filtering and threat protection, either on the SD-WAN appliance (many are also NGFWs, such as FortiGate) or in a cloud security service.
- **Segmentation**: keep guest, IoT, POS and corporate traffic in separate segments end to end.
- **Management plane**: the orchestrator controls every site. Protect it with MFA, restricted admin access and logging.
- **Patch the edge devices**: they're internet-facing and targeted.

## SD-WAN and SASE

SASE combines SD-WAN with cloud-delivered security (secure web gateway, CASB, ZTNA, firewall as a service). SD-WAN handles connectivity; the security service edge (SSE) handles inspection and access control. Many organisations adopt SD-WAN first and add SSE later.

## FAQ

**Does SD-WAN replace a VPN for remote users?**
No. SD-WAN connects sites. Remote users need remote access VPN or ZTNA; see [what a VPN protects](/article/vpn-basics-what-it-does).

**Is broadband reliable enough to replace MPLS?**
With two diverse links and SD-WAN steering, many organisations get comparable or better availability for most applications.

## References

- [MEF 3.0 SD-WAN service standards](https://www.mef.net/service-standards/overlay-services/sd-wan/)
- [NIST SP 800-215: Guide to a Secure Enterprise Network Landscape](https://csrc.nist.gov/pubs/sp/800/215/final)
