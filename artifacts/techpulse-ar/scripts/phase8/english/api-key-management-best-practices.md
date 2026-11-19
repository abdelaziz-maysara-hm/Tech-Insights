---
title: API Keys Done Right: Stop Leaking Secrets in Code and Logs
excerpt: How API keys and tokens leak (Git history, front-end code, logs, CI variables), and the practices that contain the damage: secret managers, scoping, rotation and scanning.
---

API keys are passwords for software. They leak constantly: pushed to public repositories, embedded in mobile apps, printed in logs, pasted in chat. Attackers scan public code within minutes of a push, looking for cloud and payment keys.

## How keys leak

- **Hard-coded in source** and committed to Git. Deleting the line later doesn't remove it from history.
- **In front-end or mobile code**, where any user can extract it.
- **In logs and error messages**, including full request URLs with keys in query strings.
- **In CI/CD**, printed by build scripts or stored in variables with broad access.
- **Shared in tickets, chat and documentation.**

## Practices that work

1. **Never put secrets in code.** Load them from environment variables or, better, a secret manager (HashiCorp Vault, AWS Secrets Manager, Azure Key Vault, Google Secret Manager).
2. **Prefer short-lived credentials.** Use workload identity, managed identities or OIDC federation for CI instead of static keys where the platform supports it.
3. **Scope tightly**: each key gets the minimum permissions, restricted to specific APIs, IP ranges or referrers, and separate keys per environment and application.
4. **Rotate** on a schedule and immediately when someone with access leaves or a key might have been exposed. Design apps so rotation doesn't need a redeploy.
5. **Keep secrets out of URLs**; send them in headers.
6. **Scan for secrets** with pre-commit hooks and repository scanning (GitHub secret scanning and push protection, gitleaks, trufflehog).
7. **Monitor usage**: alert on spikes, new source IPs or calls to unusual APIs.

## When a key leaks

- **Revoke or rotate it first**, then investigate. Removing it from the repo is not enough.
- Check the provider's logs for misuse during the exposure window.
- Rewrite Git history if needed, but treat the key as compromised regardless.

## Keys you expose on purpose

Some keys are designed to be public (for example, map or analytics keys in a browser). Restrict them by domain or app, limit quotas, and never give them write access.

Protect the API itself as well: see [API rate limiting](/article/api-rate-limiting-basics).

## FAQ

**Is a private repository safe for secrets?**
Safer, not safe. Private repos get cloned, forked, shared with contractors and occasionally made public by accident.

## References

- [OWASP Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
- [About secret scanning (GitHub Docs)](https://docs.github.com/en/code-security/secret-scanning/introduction/about-secret-scanning)
