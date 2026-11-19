---
title: FortiClient Error -7200 Explained: A Gateway-First Troubleshooting Guide
excerpt: Error -7200 is rarely about the password. Work through the real causes in order (FortiOS 7.6.3 tunnel-mode removal, portal and IP pool, cipher strength, SAML, certificates) with the FortiGate debug commands that prove each one.
---

FortiClient's "Credential or SSLVPN configuration is wrong (-7200)" usually appears after the TLS session with the FortiGate has started, often around 48% of the connection progress bar. The wording sends people straight to password resets. In practice the cause is almost always on the **gateway**: what the user is mapped to after login, which settings the FortiGate demands, or a feature that no longer exists after an upgrade.

## Start on the FortiGate, not the laptop

If several users broke at the same time, something changed centrally: a firmware upgrade, a portal edit, a new authentication rule or cipher setting. Check the change log and system events before touching any client.

## Cause 1: you upgraded to FortiOS 7.6.3 or later

From FortiOS 7.6.3, Fortinet removed SSL VPN tunnel mode and replaced it with IPsec VPN, and tunnel-mode configuration isn't carried over during the upgrade. If every tunnel-mode user fails right after an upgrade, there's nothing to repair: the lasting fix is moving remote access to IPsec. The steps are in our [SSL VPN to IPsec migration plan](/article/fortios-ssl-vpn-tunnel-mode-removal-ipsec-migration).

On releases that still support tunnel mode, Fortinet has also documented portals coming up with tunnel mode disabled after an upgrade. Re-enabling it isn't enough on its own; the portal also needs an **IP pool**, or the same error returns.

## Cause 2: the user lands on the wrong portal

SSL VPN authentication rules map groups to portals, with a default portal for anyone who matches no rule. A user can authenticate perfectly and still be handed a portal with no tunnel mode or no address pool. Check what the portals and settings contain:

```text
config vpn ssl web portal
    show
end
config vpn ssl settings
    show
end
```

On the portal the user actually receives, look for `set tunnel-mode enable` and a `set ip-pools` entry. Confirm the user's group membership matches the rule you expect.

## Cause 3: cipher strength below what the rule requires

Fortinet documents that the cipher strength negotiated under SSL VPN settings must be equal to or stronger than the strength required in the authentication rule (168-bit by default). If someone restricted the cipher suites to something weaker, such as only TLS-AES-128-GCM-SHA256, the handshake completes and authentication then fails with -7200. Unset the custom cipher suite to return to defaults, or pick a stronger suite.

## Cause 4: SAML and the embedded browser

With SAML sign-in through Microsoft Entra ID, Okta or another identity provider, FortiClient's embedded browser may not cope with conditional access or modern MFA prompts. Enabling the option to use the external browser for SAML in the connection profile fixes many of these cases.

## Cause 5: the wrong certificate

When certificate authentication is in use, the client may offer a user certificate instead of the machine certificate, or the FortiGate may be missing the issuing CA. FortiClient's documentation shows `fnbamd` debug output reporting a failed chain build in this situation. Check the certificate the client selects and the CA certificates on the FortiGate.

## Less common causes

- The profile points at an old gateway address, wrong port, or an FQDN that resolves somewhere else.
- The FortiGate is in conserve mode (memory pressure), or the `ssl.root` interface is down.
- A FortiClient build far older than the FortiOS release.

## Debugging on the FortiGate

Start the debug, then have the user retry:

```text
diagnose debug reset
diagnose vpn ssl debug-filter src-addr4 <user-public-IP>
diagnose debug application fnbamd -1
diagnose debug application sslvpn -1
diagnose debug console timestamp enable
diagnose debug enable
```

Stop with `diagnose debug disable`. `fnbamd` shows authentication and group matching; `sslvpn` shows portal and tunnel setup. `diagnose hardware sysinfo conserve` reveals memory pressure, and `diagnose vpn ssl statistics` gives session counts.

## Things not to do

- **Don't disable TLS 1.3 on client machines as a permanent fix.** It can help isolate a negotiation problem, but leaving it off is a security downgrade.
- **Don't mass-reset passwords** before ruling out configuration.
- **Don't reinstall FortiClient everywhere.** It rarely helps when the cause is on the gateway.

## FAQ

### Why did everyone get -7200 at once?

Because something changed on the gateway: an upgrade, a portal or authentication-rule edit, or cipher changes. Start with the change log.

### Can we keep SSL VPN after FortiOS 7.6.3?

Tunnel mode is gone from 7.6.3. Web mode continues as Agentless VPN on some models only. Fortinet's recommended client-based remote access is IPsec.

### When is reinstalling the client worthwhile?

When only one user is affected, configuration causes have been ruled out, and their client is very old.

## References

- [Fortinet Community: FortiClient error -7200 after upgrading to v7.6.3](https://community.fortinet.com/fortigate-3/troubleshooting-tip-forticlient-error-credential-or-ssl-vpn-configuration-is-wrong-7200-after-upgrading-to-v7-6-3-206000)
- [Fortinet Community: -7200 and cipher strength in authentication rules](https://community.fortinet.com/fortigate-3/technical-tip-credential-or-ssl-vpn-configuration-is-wrong-7200-for-ssl-vpn-with-any-type-of-authentication-219912)
- [FortiClient Administration Guide: Wrong certificate selected](https://docs.fortinet.com/document/forticlient/8.0.0/administration-guide/525958/wrong-certificate-selected)
- [FortiOS 7.6.3 Release Notes: SSL VPN tunnel mode replaced with IPsec VPN](https://docs.fortinet.com/document/fortigate/7.6.3/fortios-release-notes/173430/ssl-vpn-tunnel-mode-replaced-with-ipsec-vpn)
