---
title: Wireshark for Troubleshooting and Security: Capture Smart, Filter Fast
excerpt: Where to capture, capture versus display filters, the filters admins use most, following streams, reading TLS traffic, and real cases from slow applications to suspicious beaconing.
---

Wireshark shows exactly what crossed the wire. When logs disagree and everyone blames the network, a packet capture settles the argument. The skill is less about knowing every protocol and more about capturing in the right place and filtering quickly.

## Capture in the right place

- **On the endpoint** having the problem, when you can install Wireshark or use `tcpdump`/`pktmon`.
- **On a switch mirror (SPAN) port** or network TAP to see traffic between other devices.
- **On both ends** when you suspect something in between (a firewall, a proxy) is changing or dropping traffic.

Capture only what you need and for as long as you need. Packet captures can contain passwords, personal data and confidential content; handle and store them accordingly, and get authorisation before capturing others' traffic.

## Capture filters vs display filters

- **Capture filters** (BPF syntax) decide what's recorded: `host 10.10.20.15 and port 443`. Use them on busy links.
- **Display filters** narrow what you see afterwards and are much richer: `ip.addr == 10.10.20.15 && tcp.port == 443`.

## Display filters worth memorising

```
dns                                   # all DNS
dns.flags.rcode != 0                  # failed lookups
tcp.analysis.retransmission           # retransmissions
tcp.flags.reset == 1                  # connection resets
tcp.analysis.zero_window              # receiver overwhelmed
http.response.code >= 400             # HTTP errors (unencrypted HTTP)
tls.handshake.type == 1               # TLS Client Hello
tls.handshake.extensions_server_name contains "example"
kerberos || ntlmssp                   # authentication traffic
```

**Follow > TCP Stream** reassembles a conversation. **Statistics > Conversations** and **Endpoints** show who talks most.

## Encrypted traffic

You won't see TLS payloads, but the handshake still tells you a lot: server name (SNI), TLS version, cipher suite, certificate errors and alerts. For your own test clients, browsers can write session keys to a file (`SSLKEYLOGFILE`) that Wireshark uses to decrypt; see [the TLS handshake explained](/article/tls-handshake-explained).

## Real cases

- **"The app is slow"**: compare time between request and response. Server delay points to the application; retransmissions and zero windows point to the network or an overloaded host.
- **"Can't connect"**: a SYN with no reply suggests a firewall drop; a SYN answered by RST means nothing is listening.
- **DNS problems**: failures, slow responses, or queries going to an unexpected resolver.
- **Suspicious beaconing**: regular small connections to the same external host at fixed intervals, worth checking against threat intelligence.

## FAQ

**Wireshark or tcpdump?**
Capture with tcpdump on servers, analyse in Wireshark on your workstation.

## References

- [Wireshark User's Guide](https://www.wireshark.org/docs/wsug_html_chunked/)
- [Wireshark display filter reference](https://www.wireshark.org/docs/dfref/)
