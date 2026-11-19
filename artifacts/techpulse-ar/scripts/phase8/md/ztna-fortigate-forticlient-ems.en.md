Remote-access VPN answers the question "should this laptop be on our network?" ZTNA asks a better one: "should this user, on this device, in its current state, reach this application right now?" Fortinet's implementation splits that decision across three products. Once you see which piece does what, the configuration is straightforward.

For the concept itself, start with [zero trust explained practically](/article/zero-trust-explained-practically). For why many Fortinet shops are looking at ZTNA now, see [the removal of SSL VPN tunnel mode](/article/fortios-ssl-vpn-tunnel-mode-removal-ipsec-migration).

## Who does what

- **FortiClient** (endpoint): reports device telemetry to EMS and presents a client certificate when connecting.
- **FortiClient EMS**: manages endpoints, evaluates *Zero Trust tagging rules* and acts as the certificate authority for ZTNA client certificates.
- **FortiGate** (ZTNA gateway): learns tags from EMS through the Fabric connector and enforces access.
- **ZTNA server** (an object on the FortiGate): the access proxy VIP clients connect to, plus the real servers behind it.

## 1. Connect the FortiGate to EMS

Under **Security Fabric → Fabric Connectors**, add the FortiClient EMS connector, point it at your EMS server and authorise the FortiGate on the EMS side. When the connection is healthy, EMS tags appear as objects you can use in policy.

## 2. Define posture with tagging rules

In EMS, write rules that apply a tag when a device meets conditions. A sensible first tag, `Compliant-Corp`, might require:

- a supported, patched OS,
- antivirus running with current signatures,
- disk encryption on,
- domain membership.

Keep the first version short. Every extra condition is a future helpdesk ticket until you've seen how your fleet actually looks.

## 3. Publish an application through a ZTNA server

Under **Policy & Objects → ZTNA**, create a ZTNA server:

- **Connect On**: the interface, IP and port the FortiGate listens on for client connections.
- **Certificate**: a server certificate users will trust.
- **Service/server mapping**: map a host name or path to the internal web app, or use TCP forwarding for RDP and SSH.

By default the access proxy demands a client certificate (`client-cert enable`) and drops clients that don't present one (`empty-cert-action block`). That is what ties access to an EMS-managed device.

## 4. Write the access policy

Create the ZTNA policy (a proxy policy in the CLI; the GUI presentation varies by FortiOS release) with:

- **Source**: users or groups, authenticated through SAML or LDAP.
- **Destination**: the ZTNA server from step 3.
- **Required tag**: `Compliant-Corp`.
- **Security profiles**, if you want inspection.

Now a managed, healthy laptop reaches the app. If its antivirus stops, EMS drops the tag and access stops until the device is fixed, with no firewall change needed.

## Migrating off VPN without a big bang

1. Pick one low-risk internal web app as the pilot.
2. Deploy FortiClient with the ZTNA feature to a pilot group.
3. Review denies and their reasons for two weeks.
4. Add apps in waves. Keep IPsec for workloads ZTNA doesn't suit, such as some non-TCP protocols.

## FAQ

**Is an EMS licence required?**
Yes. FortiClient's ZTNA features are managed through EMS and require appropriate licensing. Check current terms with Fortinet or your partner.

**What about personal phones?**
FortiOS can tag devices it cannot manage, for example `EMS_ALL_UNMANAGEABLE_CLIENTS`, so you can give them narrow access to low-risk apps only.

**Does ZTNA replace the firewall?**
No. The FortiGate *is* the ZTNA gateway and still inspects and logs the traffic. Our [FortiGate production setup guide](/article/fortigate-initial-setup-enterprise-guide) covers the baseline it should sit on.

## References

- [Zero Trust Network Access, FortiOS 7.6 (Fortinet Document Library)](https://docs.fortinet.com/ztna/7.6)
- [Access control of unmanageable and unknown devices, FortiOS 7.6 (Fortinet)](https://docs.fortinet.com/document/fortigate/7.6.6/administration-guide/710195/access-control-of-unmanageable-and-unknown-devices)
