"It's always DNS" is a joke because it's so often true. When a site won't load, mail won't flow or a domain join fails, a few targeted queries usually show whether name resolution is the culprit and where it breaks. This guide covers the three tools you'll actually use: `nslookup`, `dig` and PowerShell's `Resolve-DnsName`.

## Ask the right question first

DNS problems fall into three groups:

1. **The client asks the wrong server**, for example a laptop still using a home router or a VPN that didn't push its DNS servers.
2. **The server gives the wrong answer**, such as a stale record, a split-DNS mistake, or a forwarder returning something unexpected.
3. **Nobody can answer**: the zone is broken, the delegation is wrong, or the resolver can't reach the internet.

Each query below helps you place the problem in one of these groups.

## The basic queries

**Windows (nslookup):**

```text
nslookup portal.example.com
nslookup portal.example.com 8.8.8.8
nslookup -type=MX example.com
```

The first line shows which server answered (the "Server:" line), which immediately tells you whether the client is using the resolver you expect. The second asks a specific server, which is the quickest way to compare internal and public answers.

**PowerShell (Resolve-DnsName):**

```powershell
Resolve-DnsName portal.example.com
Resolve-DnsName portal.example.com -Server 10.0.0.10 -Type A
Resolve-DnsName example.com -Type TXT -DnsOnly
Clear-DnsClientCache
```

`-DnsOnly` skips other name-resolution methods such as LLMNR and NetBIOS, so you know the answer really came from DNS. Clearing the client cache rules out an old cached answer.

**Linux and macOS (dig):**

```bash
dig portal.example.com
dig @1.1.1.1 portal.example.com A +short
dig example.com MX
dig +trace www.example.com
```

`+trace` follows the delegation from the root servers down, which is the best way to find a broken delegation or a registrar pointing at the wrong name servers.

## Reading the response codes

| Status | Meaning | Typical cause |
|---|---|---|
| NOERROR with an answer | Resolution worked | If the address is wrong, look for stale or split-DNS records |
| NOERROR, no answer | The name exists but not with that record type | Asking for AAAA when only A exists, for example |
| NXDOMAIN | The name does not exist | Typo, missing record, or wrong zone on an internal server |
| SERVFAIL | The server could not get an answer | Broken delegation, DNSSEC validation failure, unreachable forwarder |
| REFUSED | The server won't answer you | Recursion disabled for your network, or an ACL |
| Timeout | No reply | Firewall blocking UDP/TCP 53, server down, wrong IP |

## Scenarios you'll meet

**Works on the office network but not on VPN.** Compare `nslookup name` on and off VPN. If the "Server:" differs, the VPN client isn't applying its DNS settings or split-DNS suffixes.

**Internal name resolves to a public address.** Your internal DNS server doesn't hold the zone (or record), so it forwarded the query. Add the record internally or fix the conditional forwarder.

**Mail delivery problems.** Check `MX`, then the A record of each MX host, then `TXT` for SPF and `_dmarc` for DMARC. Our [SPF](/tools/spf-record-analyzer) and [DMARC](/tools/dmarc-record-analyzer) analyzers explain the records you find.

**SERVFAIL for one domain only.** Try `dig +trace`, then `dig +cd` (checking disabled). If `+cd` returns an answer, DNSSEC validation is failing for that domain. More on that in [DNS security, filtering and DNSSEC](/article/dns-security-filtering-dnssec).

**Reverse lookups fail.** Many logs and some services rely on PTR records. See [setting up reverse lookup zones](/article/dns-reverse-lookup-zone-setup).

## Don't forget TCP

DNS uses UDP 53 for most queries, but TCP 53 is required for large responses and zone transfers. Firewalls that allow only UDP cause strange, intermittent failures with large TXT records and DNSSEC.

## FAQ

### Why do nslookup and the browser disagree?

Browsers may use their own cache or DNS over HTTPS, and Windows applications use the system resolver cache. Clear both, and check whether the browser has secure DNS enabled.

### How long do changes take to appear?

Until the record's previous TTL expires in every cache that holds it. Lower the TTL in advance if you plan a change.

### Is nslookup outdated?

It still works well for quick checks on Windows. `Resolve-DnsName` and `dig` give clearer, more scriptable output.

## References

- [RFC 1035: Domain Names, Implementation and Specification](https://www.rfc-editor.org/rfc/rfc1035)
- [Microsoft Learn: Resolve-DnsName](https://learn.microsoft.com/en-us/powershell/module/dnsclient/resolve-dnsname)
- [BIND 9 documentation: manual pages (dig)](https://bind9.readthedocs.io/en/latest/manpages.html)
