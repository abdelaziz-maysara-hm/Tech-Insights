---
title: Scanning Container Images Before They Ship: A Practical Pipeline
excerpt: What image scanners look for (vulnerable packages, secrets, misconfigurations), where to scan in the pipeline, how to set sensible gates, and how to keep base images lean and current.
---

A container image bundles your application with an operating system layer and dozens or hundreds of packages. Each one can carry known vulnerabilities, and images are often built once and run for months. Scanning catches problems before they reach production.

## What scanners check

- **Known vulnerabilities (CVEs)** in OS packages and language dependencies (npm, pip, Maven, Go modules).
- **Secrets** accidentally baked into layers: keys, tokens, passwords.
- **Misconfigurations** in the Dockerfile: running as root, `latest` tags, unnecessary packages, exposed ports.
- **Licences**, for compliance teams.

Widely used tools include Trivy, Grype, Docker Scout, and the scanners built into registries and cloud platforms (Amazon ECR, Azure Container Registry with Defender, Google Artifact Registry).

## Where to scan

1. **On the developer's machine or in pull requests**: fast feedback.
2. **In CI after build**: the main gate, before pushing to the registry.
3. **In the registry continuously**: new CVEs are published daily, so yesterday's clean image may not be clean today.
4. **At deploy time**: admission control in Kubernetes can refuse images that weren't scanned or signed.

## Setting gates

Blocking every CVE stops all deployments. Practical rules:

- Fail builds on **critical and high** vulnerabilities **with a fix available**.
- Treat actively exploited ones (CISA KEV) as blocking regardless.
- Track the rest and set deadlines.
- Allow documented, time-limited exceptions.

## Reduce what there is to scan

- **Minimal base images**: distroless, Alpine or vendor "slim" images contain far fewer packages.
- **Multi-stage builds**: compile in one stage, copy only the result into the runtime image.
- **Rebuild regularly** so base-image fixes flow in, not only when code changes.
- **Pin base images by digest**, and update deliberately.
- **Run as a non-root user**.
- **Sign images** (for example with Sigstore cosign) and generate an SBOM so you can answer "are we affected?" quickly.

Scanning is the build-time half; runtime controls are covered in [container security basics](/article/container-security-basics-guide).

## FAQ

**Why do two scanners report different results?**
They use different vulnerability databases and matching logic. Pick one as the source of truth for gating.

## References

- [NIST SP 800-190: Application Container Security Guide](https://csrc.nist.gov/pubs/sp/800/190/final)
- [Trivy documentation](https://trivy.dev/latest/docs/)
