SSH is how most Linux servers are managed, which makes it the first thing attackers try once they find one. Default installations are reasonably safe, but "reasonably" isn't enough for a server on the internet or holding important data. This guide walks through the changes that matter, in an order that won't lock you out.

## Before you touch sshd_config

Two habits prevent most self-inflicted outages:

1. **Keep a second session open** while you change settings. If the new configuration breaks logins, you still have a way in.
2. **Test the configuration before reloading:** `sudo sshd -t` checks syntax and reports errors. Only then run `sudo systemctl reload ssh` (the service is called `sshd` on some distributions).

On many current distributions, `/etc/ssh/sshd_config` includes files from `/etc/ssh/sshd_config.d/`. For each keyword, sshd uses the **first** value it reads, so a setting in an included file that is read earlier wins over one further down. Put your hardening in a single drop-in file such as `00-hardening.conf` so it takes effect and is easy to audit.

## Step 1: switch to key-based authentication

Generate a modern key on your workstation:

```bash
ssh-keygen -t ed25519 -C "alice@workstation"
ssh-copy-id alice@server.example.com
```

Protect the private key with a passphrase, and use an agent so you don't type it every time. For administrators, a FIDO2 security key (`ssh-keygen -t ed25519-sk`) keeps the private key on hardware.

Confirm you can log in with the key **before** disabling passwords.

## Step 2: the core hardening settings

```text
PermitRootLogin no
PasswordAuthentication no
KbdInteractiveAuthentication no
PubkeyAuthentication yes
AllowGroups ssh-admins
MaxAuthTries 3
LoginGraceTime 30
X11Forwarding no
AllowAgentForwarding no
AllowTcpForwarding no
ClientAliveInterval 300
ClientAliveCountMax 2
```

What each line buys you:

- **No root login and no passwords** remove the two things brute-force bots rely on. Admins log in as themselves and use `sudo`, which also leaves a clearer audit trail.
- **AllowGroups** means only members of a named group can log in at all, so a forgotten service account with a shell cannot be used.
- **MaxAuthTries and LoginGraceTime** limit how long an unauthenticated connection can try.
- **Disabling forwarding** stops the server being used as a pivot or tunnel unless you need it. If you do, enable it only for specific users with a `Match` block.
- **ClientAlive settings** drop dead sessions.

Run `sudo sshd -t`, reload, and test a new login from a fresh terminal.

## Step 3: reduce who can reach the port

The strongest SSH configuration still benefits from fewer people being able to connect:

- Allow port 22 only from your management network or VPN on the host firewall (`ufw`, `firewalld` or nftables) and on any cloud security group.
- For internet-facing hosts, use a bastion host or your cloud provider's session manager rather than opening SSH to everyone.
- A tool like fail2ban can ban addresses after repeated failures. It reduces log noise, but with password logins disabled it is a convenience, not your main defence.

## Step 4: manage keys like credentials

Keys don't expire by themselves, so old ones pile up in `~/.ssh/authorized_keys` files across servers. NIST IR 7966 is a whole report on this problem. Practical rules:

- Keep an inventory of who has access to which servers.
- Remove keys when people leave or change roles, as part of offboarding.
- Consider SSH certificates or a central access tool for larger estates, so access can be granted and revoked in one place.
- Never share one key between several people.

## Step 5: log and watch

SSH logins are written to the system journal or `/var/log/auth.log` (`/var/log/secure` on Red Hat family systems). Forward them to your SIEM and alert on successful logins from unexpected sources, logins by accounts that rarely use SSH, and bursts of failures. Our [Wazuh brute-force rule guide](/article/wazuh-custom-rule-brute-force) shows a working example.

## FAQ

### Should I change the SSH port?

It reduces automated noise in logs but provides no real protection. Do it only if it helps your operations, and never instead of the steps above.

### Is PermitRootLogin prohibit-password good enough?

It blocks root password logins but still allows root with a key. Logging in as a named user and using sudo gives better accountability, so `no` is preferable where possible.

### What if I lock myself out?

Use the second session you kept open, or the provider's console access, then fix the configuration and test with `sshd -t` again.

## References

- [OpenBSD manual: sshd_config(5)](https://man.openbsd.org/sshd_config)
- [NIST IR 7966: Security of Interactive and Automated Access Management Using Secure Shell](https://csrc.nist.gov/pubs/ir/7966/final)
