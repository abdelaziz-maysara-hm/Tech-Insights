---
title: Multiple Users on One Windows Server over RDP: Doing RDS Properly
excerpt: Why Windows Server allows only two admin RDP sessions by default, how to deploy the Remote Desktop Session Host role and licensing, and why patching termsrv.dll is a bad idea.
---

Out of the box, Windows Server allows **two simultaneous Remote Desktop sessions for administration**. When a team wants several people working on one server at once, for example to run a line-of-business app, you need Remote Desktop Services (RDS) and the matching licences.

## The pieces of an RDS deployment

- **RD Session Host (RDSH)**: the server users actually work on.
- **RD Connection Broker**: tracks sessions and load-balances across session hosts.
- **RD Web Access** (optional): a web portal for published apps and desktops.
- **RD Gateway** (recommended for remote users): tunnels RDP over HTTPS so port 3389 isn't exposed to the internet.
- **RD Licensing**: issues RDS Client Access Licences (CALs).

A small deployment can put several roles on one server. Server Manager's **Remote Desktop Services installation** wizard (Quick Start for one server) sets them up together.

## Licensing in brief

- Every user or device that connects needs an **RDS CAL**, in addition to the normal Windows Server CAL.
- Choose **Per User** or **Per Device** mode, and set the licensing mode and licence server in the deployment properties (or Group Policy).
- Activate the licence server and install your CALs on it.
- Without a configured licence server, Windows gives a **120-day grace period**. When it ends, connections are refused, and that tends to happen at the worst possible moment. Put a reminder in your calendar on day one.

Per User CALs aren't strictly enforced technically, but you're still contractually required to have one for each user.

## Don't patch termsrv.dll

Guides online show how to modify system files to allow more sessions. It breaks licensing terms, can be undone by any update, and leaves you running modified system binaries, which is exactly what you don't want on a server people log into. Use RDS properly.

## Securing multi-user RDP

- **Never expose 3389 to the internet.** Use RD Gateway with MFA, or a VPN. Exposed RDP is one of the most common ransomware entry points.
- **Network Level Authentication** on.
- **Restrict who can sign in** through the Remote Desktop Users group, and keep admins out of daily-use sessions.
- **Disable drive and clipboard redirection** where users don't need them, to limit data leakage.
- **Patch** session hosts promptly and monitor sign-in failures (event 4625).

## FAQ

**Can Windows 10 or 11 host multiple RDP users?**
Client Windows allows one interactive session at a time. Multi-session Windows is an Azure Virtual Desktop feature.

**Per User or Per Device?**
Per User suits people with several devices; Per Device suits shift workers sharing a few terminals.

## References

- [License your RDS deployment with client access licenses (Microsoft Learn)](https://learn.microsoft.com/en-us/windows-server/remote/remote-desktop-services/rds-client-access-license)
- [Remote Desktop Services overview (Microsoft Learn)](https://learn.microsoft.com/en-us/windows-server/remote/remote-desktop-services/remote-desktop-services-overview)
