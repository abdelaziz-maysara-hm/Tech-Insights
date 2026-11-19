---
title: Building Security into the Software Lifecycle, Stage by Stage
excerpt: What a secure software development lifecycle looks like in practice: requirements, design and threat modeling, secure coding, automated testing in CI, release controls, and handling vulnerabilities after launch.
---

Bolting security on at the end of a project means expensive rework or, more often, shipping known risks. A secure software development lifecycle (SSDLC) spreads small, routine security activities across every stage, so problems are found when they're cheap to fix.

## Requirements

- Identify the data the system handles and its classification.
- Capture security and privacy requirements alongside functional ones: authentication method, authorization rules, logging, data retention.
- Use a checklist such as OWASP ASVS to pick a target verification level.

## Design

- Run a short [threat model](/article/threat-modeling-stride-basics) for new features and architectural changes.
- Choose secure defaults: managed identity providers, parameterised data access, frameworks that escape output.
- Review third-party services and libraries before adopting them.

## Implementation

- Secure coding guidelines for your languages, and peer code review for every change.
- No secrets in code; use a secret manager; see [API key management](/article/api-key-management-best-practices).
- Pre-commit hooks for secret scanning and linting.

## Verification in CI/CD

- **SAST**: static analysis of your code.
- **SCA**: software composition analysis of dependencies for known vulnerabilities and licences.
- **Secret scanning** across the repository.
- **Container and IaC scanning** for images and Terraform/Bicep templates; see [container image scanning](/article/container-image-security-scanning).
- **DAST**: dynamic testing of the running application in staging.
- Set gates on serious, fixable findings rather than blocking on everything.

## Release

- Protect the pipeline: branch protection, required reviews, least-privilege CI credentials, signed artifacts.
- Generate an SBOM for each release.
- Change approval proportional to risk.

## Operations and response

- Monitor dependencies for new vulnerabilities after release.
- Publish a vulnerability disclosure policy so researchers know how to report issues.
- Fix by severity and exploitation status, and feed lessons back into requirements and training.
- Periodic penetration tests for important applications; see [scanning vs pen testing](/article/vulnerability-scanning-vs-penetration-testing).

## Frameworks to lean on

NIST's Secure Software Development Framework (SP 800-218) describes practices without prescribing tools. OWASP SAMM helps measure maturity and plan improvements.

## FAQ

**Does this slow developers down?**
Automated checks and clear guidance usually speed delivery, because fewer issues surface late. The friction comes from noisy tools and unclear ownership.

## References

- [NIST SP 800-218: Secure Software Development Framework (SSDF)](https://csrc.nist.gov/pubs/sp/800/218/final)
- [OWASP Application Security Verification Standard (ASVS)](https://owasp.org/www-project-application-security-verification-standard/)
- [OWASP SAMM](https://owaspsamm.org/)
