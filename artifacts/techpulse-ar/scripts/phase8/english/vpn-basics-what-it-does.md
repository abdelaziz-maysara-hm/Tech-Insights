---
title: What a VPN Really Protects (and What It Doesn't)
excerpt: A clear look at what VPNs do for remote access and public Wi-Fi, where they stop helping, and how business VPN differs from consumer privacy services.
---

"Use a VPN" is common advice, but VPNs are often credited with protections they don't provide. Knowing the boundaries helps you use one properly and avoid a false sense of security.

## What a VPN does

A VPN builds an encrypted tunnel between your device and a VPN gateway. Everything inside the tunnel is hidden from the network you're physically on.

- **On public Wi-Fi**, the café or hotel network can't read or tamper with your traffic.
- **For remote work**, the business VPN lets you reach internal systems (file servers, intranet apps) as if you were in the office.
- **Your apparent IP address** becomes the gateway's, which matters for allow-listing and geolocation.

## What it doesn't do

- **It doesn't stop phishing or malware.** If you enter your password on a fake site, the tunnel carries it there securely.
- **It doesn't make you anonymous.** The VPN provider sees your traffic metadata instead of your ISP. With a business VPN, your employer does.
- **It doesn't fix a compromised device.** An infected laptop on VPN brings the infection closer to the internal network.
- **It doesn't replace HTTPS.** After traffic leaves the gateway, it travels normally across the internet.

## Business VPN vs consumer VPN

| | Business remote-access VPN | Consumer VPN service |
|---|---|---|
| Purpose | Reach internal company resources | Privacy on untrusted networks, location change |
| Who runs the gateway | Your IT team or provider | A commercial VPN company |
| Typical tech | IPsec or vendor clients (FortiClient, GlobalProtect) | WireGuard, OpenVPN |

## Doing business VPN well

- Require **MFA** for every VPN login and keep the gateway patched; VPN appliances are a favourite target.
- Grant access to the systems people need, not the whole network. This is where [zero trust](/article/zero-trust-explained-practically) and ZTNA come in.
- Check device health before connecting where your platform supports it.
- For Fortinet environments, note that SSL VPN tunnel mode is gone in recent FortiOS; see [migrating to IPsec](/article/fortios-ssl-vpn-tunnel-mode-removal-ipsec-migration).

## FAQ

**Should staff use a VPN on hotel Wi-Fi even for cloud apps?**
Modern cloud apps already use TLS, so the gain is smaller than it used to be. A VPN still helps against captive-portal tricks and DNS tampering.

**Split tunnelling or full tunnel?**
Full tunnel gives more visibility and control; split tunnelling reduces load. Many organisations split trusted SaaS traffic and tunnel the rest.

## References

- [NIST SP 800-46 Rev. 2: Guide to Enterprise Telework, Remote Access, and BYOD Security](https://csrc.nist.gov/pubs/sp/800/46/r2/final)
