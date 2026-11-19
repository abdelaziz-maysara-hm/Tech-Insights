Every time someone in your domain opens a file share, signs in to a server or connects to SQL, Kerberos is doing the work. Most admins only meet it when it breaks ("clock skew too great") or when a penetration test report says "Kerberoasting". Understanding the flow makes both situations much easier.

## The idea in one paragraph

Instead of sending a password to every server, the user proves who they are once to a trusted third party, the **Key Distribution Center (KDC)**, which runs on every domain controller. The KDC hands back tickets. The user presents tickets to services, and services trust them because they're encrypted with keys only the KDC and the service know.

## The three exchanges

**1. AS exchange: getting a Ticket Granting Ticket (TGT).**
At logon, the client sends an authentication request to the KDC, with a timestamp encrypted using a key derived from the user's password (pre-authentication). If it decrypts correctly, the KDC returns a **TGT**, encrypted with the key of the `krbtgt` account. The user can't read it; they just hold it. Windows event **4768** records this on the DC.

**2. TGS exchange: getting a service ticket.**
To reach `cifs/fileserver01`, the client presents its TGT and asks for a ticket for that **Service Principal Name (SPN)**. The KDC returns a **service ticket** encrypted with the key of the account running the service. Event **4769** records it.

**3. AP exchange: using the ticket.**
The client presents the service ticket to the file server, which decrypts it with its own key and learns who the user is and what groups they belong to. The domain controller isn't contacted for this step.

## Why time matters so much

Tickets carry timestamps to stop replay. By default, Active Directory tolerates five minutes of clock difference. Beyond that, authentication fails. In a domain, members sync time from DCs, and the PDC emulator should sync from a reliable external source. When Kerberos errors appear suddenly across many machines, check time first.

## Where it goes wrong: SPNs and fallbacks

- **Missing or duplicate SPNs** cause failures or a silent fall back to NTLM. `setspn -Q` and `setspn -X` find them.
- **Accessing servers by IP address** typically uses NTLM rather than Kerberos, because there's no SPN to match.
- **Encryption types:** modern domains should use AES. RC4 tickets are a red flag, both for compatibility debt and for attacks.

## Attacks that abuse Kerberos

Know these so you recognise them in logs. This is for defence, not a how-to.

| Attack | What the attacker does | Defensive signal |
|---|---|---|
| Kerberoasting | Requests service tickets for accounts with SPNs and cracks them offline | Bursts of 4769, especially with RC4 (0x17) |
| AS-REP roasting | Targets accounts with pre-authentication disabled | 4768 for accounts that don't require pre-auth |
| Golden ticket | Forges TGTs after stealing the krbtgt key | Anomalous ticket lifetimes; requires domain compromise first |
| Pass-the-ticket | Reuses stolen tickets from memory | Tickets used from unexpected hosts |

Our [Kerberoasting detection and prevention guide](/article/kerberoasting-detection-prevention) goes deeper on the most common one.

## Hardening checklist

- Use **group Managed Service Accounts (gMSA)** for services, with long automatic passwords.
- Remove RC4 where you can and prefer AES.
- Keep "Do not require Kerberos preauthentication" off for all accounts.
- Put privileged users in the **Protected Users** group where compatible.
- Rotate the `krbtgt` password periodically (twice, with replication in between).
- Collect 4768, 4769 and 4771 from every DC. See our [Windows event ID reference](/article/windows-security-event-ids-soc).

## FAQ

**Is NTLM going away?**
Microsoft has announced NTLM's deprecation path. Inventory where you still use it now; it's usually IP-based access and legacy apps.

**Why does Kerberos fail but NTLM works?**
Usually time skew, a missing or duplicate SPN, or DNS resolving to the wrong host.

**How long are tickets valid?**
By default in AD, TGTs last 10 hours and can be renewed for up to 7 days. These values are set in the domain's Kerberos policy.

## References

- [Kerberos authentication overview (Microsoft Learn)](https://learn.microsoft.com/windows-server/security/kerberos/kerberos-authentication-overview)
- [Protected Users security group (Microsoft Learn)](https://learn.microsoft.com/windows-server/security/credentials-protection-and-management/protected-users-security-group)
- [RFC 4120: The Kerberos Network Authentication Service (V5)](https://www.rfc-editor.org/rfc/rfc4120)
