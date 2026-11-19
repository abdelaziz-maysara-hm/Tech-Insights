"Your connection is not private." "Certificate not trusted." "Hostname mismatch." Certificate errors are among the most common tickets for anyone running websites, VPN gateways, mail servers or internal applications. Almost all of them fall into five causes, and a couple of OpenSSL commands will tell you which one you are dealing with.

## The diagnostic command

From any machine with OpenSSL:

```bash
openssl s_client -connect portal.example.com:443 -servername portal.example.com -showcerts </dev/null
```

- `-servername` sends SNI, so a server hosting several sites returns the right certificate. Leaving it out is a common reason people see the "wrong" certificate in tests.
- `-showcerts` prints every certificate the server sends, not just the first.

Look at the end of the output for `Verify return code: 0 (ok)`. Anything else names the problem. To read one certificate in detail, save it to a file and run:

```bash
openssl x509 -in cert.pem -noout -subject -issuer -dates -ext subjectAltName
```

## Cause 1: incomplete chain

**Symptom:** works in some browsers, fails in others, in Java apps, `curl` or mobile devices. OpenSSL reports something like "unable to get local issuer certificate".

**Why:** the server sends its own certificate but not the intermediate certificate(s) that link it to a trusted root. Some browsers fetch or cache the missing intermediate, which hides the problem; stricter clients fail.

**Fix:** configure the server with the full chain: the server certificate followed by intermediates, in order. Don't include the root. Most CAs provide a "fullchain" or bundle file for exactly this purpose.

## Cause 2: name mismatch

**Symptom:** "certificate is not valid for this name" or `ERR_CERT_COMMON_NAME_INVALID`.

**Why:** the name in the address bar isn't listed in the certificate's **Subject Alternative Name** extension. Modern clients ignore the Common Name for this check, so a certificate with the right CN but no matching SAN still fails.

**Fix:** issue a certificate that lists every name users actually type, including `www` and bare domain variants. Remember that a wildcard like `*.example.com` covers `vpn.example.com` but not `example.com` itself or `a.b.example.com`.

## Cause 3: expired or not yet valid

**Symptom:** `certificate has expired` or "not yet valid".

**Why:** the certificate's validity period has ended, or the **client's clock** is wrong. A device with a dead CMOS battery or broken NTP can make a perfectly valid certificate look expired.

**Fix:** renew and deploy, and check the client's time before blaming the server. Prevent repeats with expiry monitoring; see [certificate expiry monitoring](/article/certificate-expiry-monitoring).

## Cause 4: untrusted issuer

**Symptom:** "self-signed certificate" or "certificate signed by unknown authority".

**Why:** the certificate was issued by a private CA (your own AD CS, a firewall's built-in CA) or is self-signed, and the client doesn't trust that root.

**Fix:** for public services, use a publicly trusted CA. For internal services, distribute your internal root CA to managed devices through Group Policy or MDM, rather than telling users to click through warnings. Background on how this works is in [PKI and certificate authorities explained](/article/pki-certificate-authority-explained).

## Cause 5: TLS inspection in the middle

**Symptom:** certificates for many unrelated sites suddenly show your firewall or proxy as the issuer, and some apps break.

**Why:** a firewall performing TLS inspection re-signs traffic with its own CA. Devices that don't trust that CA, or apps that pin certificates, fail.

**Fix:** deploy the inspection CA to managed devices and exempt applications that use certificate pinning or that you shouldn't decrypt, such as banking and health sites.

## Quick decision table

| What you see | Likely cause | First check |
|---|---|---|
| Fails only on some clients | Missing intermediate | `-showcerts` output |
| Name error | SAN does not include the hostname | `-ext subjectAltName` |
| Expired, but you just renewed | Old cert still loaded, or client clock wrong | Reload service; check client time |
| Unknown authority on internal app | Internal root not deployed | Device trust store |
| All sites show the firewall as issuer | TLS inspection | Inspection CA deployment |

For what happens during the handshake itself, read [the TLS handshake explained](/article/tls-handshake-explained).

## FAQ

### Why does the site work in Chrome but not with curl?

Browsers can work around a missing intermediate; curl and many libraries can't. Serve the full chain and both will work.

### Should I include the root certificate in the chain?

No. Clients already have trusted roots. Sending it adds bytes and can confuse some clients.

### Is it safe to tell users to click "proceed anyway"?

No. It trains them to ignore the one warning that protects them from interception. Fix the certificate or the trust instead.

## References

- [OpenSSL documentation: openssl-s_client](https://docs.openssl.org/3.0/man1/openssl-s_client/)
- [RFC 5280: Internet X.509 Public Key Infrastructure Certificate and CRL Profile](https://www.rfc-editor.org/rfc/rfc5280)
- [Let's Encrypt: Certificate compatibility](https://letsencrypt.org/docs/certificate-compatibility/)
