---
title: Building a Central Syslog Server: A Practical Starting Point
excerpt: Why centralised logging matters, how to choose UDP, TCP or TLS transport, a basic rsyslog setup, and the habits that keep a log server useful.
---

Firewalls, switches, Linux servers and many appliances can send their logs off-box with syslog. Collecting them on one server gives you a single place to search during an incident, and a copy an attacker can't easily wipe from the device they compromised.

## Transport choices

- **UDP 514**: the classic. Simple, supported everywhere, but messages can be lost silently and travel unencrypted.
- **TCP (often 514 or 601)**: reliable delivery, still unencrypted.
- **TLS (6514)**: reliable and encrypted, defined in RFC 5425. Use it where devices support it, especially across untrusted links.

Whatever you choose, keep syslog traffic on a management network where possible.

## A minimal rsyslog receiver

On a Linux server with rsyslog, enable a listener and write each sender's logs to its own file:

```
module(load="imudp")
input(type="imudp" port="514")
module(load="imtcp")
input(type="imtcp" port="514")

template(name="PerHost" type="string" string="/var/log/remote/%HOSTNAME%/%PROGRAMNAME%.log")
if $fromhost-ip != '127.0.0.1' then {
  action(type="omfile" dynaFile="PerHost")
  stop
}
```

Restart rsyslog, open the port only to your devices' subnets, then point each device's syslog setting at the server.

## Habits that make it useful

- **Synchronise time**: configure NTP on every device and the server. Logs with wrong timestamps can't build a timeline.
- **Rotate and compress** with logrotate, and set retention deliberately; see [log retention](/article/log-retention-siem-basics).
- **Restrict access**: few people need shell access to the log server, and nobody should be able to edit history.
- **Watch disk space**: a full log disk means silent loss.
- **Choose severity levels** on devices sensibly. Debug logging from a firewall can drown everything else.
- **Monitor the monitor**: alert when an important device stops sending logs.

## When to move beyond plain syslog

Flat files are fine for a few devices. Once you need correlation, dashboards and alerts, forward from the syslog server into a SIEM or log platform (Wazuh, Graylog, Elastic, Splunk, Microsoft Sentinel). See [how a SIEM works](/article/how-siem-actually-works). Windows doesn't speak syslog natively; use an agent or Windows Event Forwarding for its logs.

## FAQ

**rsyslog or syslog-ng?**
Both are mature. rsyslog ships by default on most major distributions; pick whichever your team knows.

**Can I send Windows event logs to syslog?**
Yes, with an agent such as NXLog or a SIEM agent.

## References

- [RFC 5424: The Syslog Protocol](https://www.rfc-editor.org/rfc/rfc5424)
- [RFC 5425: TLS Transport Mapping for Syslog](https://www.rfc-editor.org/rfc/rfc5425)
- [rsyslog documentation](https://www.rsyslog.com/doc/)
