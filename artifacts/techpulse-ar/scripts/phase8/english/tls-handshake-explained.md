---
title: The TLS Handshake Step by Step: What Happens Before the Padlock Appears
excerpt: How a TLS 1.3 connection is set up (Client Hello, key exchange, certificate verification, Finished), what changed from TLS 1.2, and how to troubleshoot common handshake failures.
---

Before any HTTPS page loads, the browser and server run a short negotiation called the TLS handshake. In a few milliseconds they agree on encryption settings, create shared keys, and the client checks it's really talking to the right server. Understanding the steps makes certificate and connection errors much easier to diagnose.

## What the handshake achieves

1. **Agreement** on the protocol version and cipher suite.
2. **Key exchange**: both sides derive the same secret keys without ever sending them.
3. **Authentication**: the server proves its identity with a certificate; optionally, the client does too (mutual TLS).

## TLS 1.3, step by step

1. **Client Hello**: the client sends supported versions and cipher suites, a random value, the server name it wants (SNI), and a key share (its half of an ephemeral Diffie-Hellman exchange, usually X25519 or a P-256 curve, increasingly combined with a post-quantum algorithm).
2. **Server Hello**: the server picks the version and cipher suite and returns its own key share. Both sides can now compute the shared secret, and everything after this point is encrypted.
3. **Encrypted extensions, Certificate and CertificateVerify**: the server sends its certificate chain and signs the handshake transcript with its private key, proving it holds the key matching the certificate.
4. **Finished**: both sides send a message authenticating the whole handshake, which detects tampering.
5. **Application data** flows, encrypted with keys derived from the shared secret.

That's one round trip before data can be sent. Resumed sessions can even send data in the first flight (0-RTT), with some replay risk.

## What changed from TLS 1.2

- One round trip instead of two.
- Removal of old, weak options: RSA key exchange, CBC-mode ciphers, SHA-1, RC4, renegotiation.
- **Forward secrecy always**: ephemeral key exchange means a stolen server key can't decrypt past recorded traffic.
- More of the handshake is encrypted, including the certificate.

TLS 1.0 and 1.1 are deprecated (RFC 8996). Keep TLS 1.2 with strong ciphers where older clients need it, and prefer 1.3.

## Certificate checks the client performs

Valid chain to a trusted root, hostname match, validity dates, key usage, and revocation status where checked; see [PKI and the chain of trust](/article/pki-certificate-authority-explained).

## Troubleshooting handshake failures

- `openssl s_client -connect host:443 -servername host` shows the certificate chain and negotiated version.
- **Missing intermediate certificate**: works in some clients, fails in others.
- **Name mismatch**: certificate issued for a different hostname.
- **Expired certificate**; see [certificate expiry monitoring](/article/certificate-expiry-monitoring).
- **No shared cipher or version**: old clients or hardened servers.
- **TLS inspection** by a firewall replacing certificates with its own CA, which clients must trust.

Wireshark shows the handshake clearly even when the data is encrypted; see [Wireshark for troubleshooting](/article/wireshark-network-analysis-complete-guide).

## FAQ

**Does the padlock mean a site is safe?**
It means the connection is encrypted to the named domain, not that the site is honest.

## References

- [RFC 8446: The Transport Layer Security (TLS) Protocol Version 1.3](https://www.rfc-editor.org/rfc/rfc8446)
- [RFC 8996: Deprecating TLS 1.0 and TLS 1.1](https://www.rfc-editor.org/rfc/rfc8996)
- [Mozilla Server Side TLS recommendations](https://wiki.mozilla.org/Security/Server_Side_TLS)
