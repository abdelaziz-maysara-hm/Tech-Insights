---
title: Locking Down a Small-Office Router: The Settings That Matter
excerpt: A practical hardening list for small-office and home routers: firmware, admin access, Wi-Fi encryption, WPS and UPnP, guest networks, and what to check every few months.
---

For a small office or a remote worker, the router is often the only firewall between the internet and every device on the network. Most ship with settings chosen for easy setup, not for security. Fifteen minutes in the admin page fixes the biggest gaps.

## 1. Update the firmware, then keep it updated

Router vulnerabilities are actively exploited, often by botnets scanning the whole internet. Install the latest firmware, enable automatic updates if available, and replace devices the vendor no longer supports. An end-of-life router will never get another fix.

## 2. Secure the admin interface

- Change the default admin password to a long unique one.
- **Disable remote administration** from the internet unless you truly need it. If you do, restrict it to specific IPs.
- Prefer HTTPS for the admin page, and log out when done.

## 3. Use strong Wi-Fi encryption

- Choose **WPA3**, or WPA2/WPA3 mixed mode if older devices need it. Avoid WEP and WPA (TKIP) entirely.
- Use a long passphrase, and change it when staff leave.
- Rename the network so it doesn't reveal the router model or the business's address.

## 4. Turn off features you don't use

- **WPS**: the PIN method has well-known weaknesses. Disable it.
- **UPnP**: lets devices open ports on the router by themselves. Convenient, and abused by malware. Disable it unless something specific needs it.
- **Port forwarding**: review every rule. Never expose RDP or file shares directly; use a VPN instead.

## 5. Separate guests and gadgets

Put visitors and smart devices (TVs, cameras, printers) on a **guest network** isolated from work computers. Our guide to [guest Wi-Fi isolation](/article/guest-wifi-network-isolation) explains the setup.

## 6. Check DNS and logs occasionally

Attackers who compromise routers often change DNS settings to redirect traffic. Every few months, confirm the DNS servers are the ones you chose (a filtering resolver is a good option; see [DNS security](/article/dns-security-filtering-dnssec)) and glance at connected devices.

## FAQ

**Is the ISP-supplied router good enough?**
Sometimes. Check whether it receives regular firmware updates and lets you disable WPS, UPnP and remote admin. If not, use your own router behind it.

**Do I still need endpoint security?**
Yes. The router protects the edge; laptops still need patches, disk encryption and endpoint protection.

## References

- [Secure by Design Alert: Security Design Improvements for SOHO Device Manufacturers (CISA)](https://www.cisa.gov/resources-tools/resources/secure-design-alert-security-design-improvements-soho-device-manufacturers)
