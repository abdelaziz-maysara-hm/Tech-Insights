---
title: Wi-Fi 6 or Wi-Fi 5 for the Office: When the Upgrade Pays Off
excerpt: What 802.11ax actually changes (OFDMA, MU-MIMO, BSS colouring, WPA3), where it helps a business network, and when better design beats new access points.
---

Wi-Fi 6 (802.11ax) is often sold on peak speed. For an office, peak speed is the least interesting part. The real gains are in **busy environments**: many devices, many neighbouring networks, lots of small traffic.

## What changed from Wi-Fi 5 (802.11ac)

- **OFDMA**: an access point can serve several clients in one transmission by splitting the channel into smaller resource units. That cuts waiting time when lots of devices send small packets: chat, voice, IoT.
- **Uplink and downlink MU-MIMO**: Wi-Fi 5 had downlink only; Wi-Fi 6 adds uplink, which helps video calls.
- **BSS colouring**: helps APs ignore transmissions from neighbouring networks on the same channel, improving reuse in dense buildings.
- **Target Wake Time**: devices schedule when to wake, saving battery for phones and sensors.
- **2.4 GHz support**: Wi-Fi 6 improves both 2.4 and 5 GHz, where Wi-Fi 5 was 5 GHz only.
- **WPA3** is mandatory for Wi-Fi 6 certification.

**Wi-Fi 6E** adds the 6 GHz band, with far more clean spectrum, where regulators allow it. Wi-Fi 7 builds further on this, but client support is still growing in many fleets.

## When upgrading makes sense

- High device density: open-plan offices, meeting rooms, classrooms, warehouses with scanners.
- Lots of voice and video traffic.
- Existing APs are end of life or no longer receive firmware updates. That's a security reason on its own.
- You need WPA3 across the board.

## When it won't fix the problem

- **Poor coverage design**: too few APs, APs in cupboards, wrong channel widths. A site survey and better placement often help more than new hardware.
- **Old clients**: an AP only uses Wi-Fi 6 features with Wi-Fi 6 clients.
- **The bottleneck is elsewhere**: an overloaded internet link, a 1 Gbps switch uplink, or DHCP running out of addresses.

## Upgrade checklist

1. Survey: measure coverage, interference and client mix.
2. Check switch ports: PoE budget (Wi-Fi 6 APs often need more power) and uplink speed (2.5 Gbps multigig for high-end APs).
3. Plan channels: 20 or 40 MHz in dense 5 GHz deployments, not 80 MHz everywhere.
4. Use WPA3-Enterprise with [802.1X certificate authentication](/article/802-1x-certificate-authentication) for staff, and an isolated [guest network](/article/guest-wifi-network-isolation).

## FAQ

**Will Wi-Fi 6 make the internet faster?**
Only if Wi-Fi was the bottleneck. It mainly improves consistency under load.

**Can Wi-Fi 5 and Wi-Fi 6 APs mix?**
Yes, within the same vendor system, though roaming and features work best on a uniform deployment.

## References

- [Wi-Fi CERTIFIED 6 (Wi-Fi Alliance)](https://www.wi-fi.org/discover-wi-fi/wi-fi-certified-6)
- [Wi-Fi CERTIFIED WPA3 (Wi-Fi Alliance)](https://www.wi-fi.org/discover-wi-fi/security)
