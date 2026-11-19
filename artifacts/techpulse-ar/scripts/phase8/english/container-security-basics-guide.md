---
title: Securing Containers from Build to Runtime
excerpt: The container security layers that matter: trusted images, least-privilege runtime settings, Kubernetes access control and network policies, secrets handling, and runtime monitoring.
---

Containers package applications neatly, but they share the host's kernel and often run with more privilege than they need. Security has to cover the whole path: the image you build, how it runs, the orchestrator around it, and how you watch it.

## 1. Trusted images

- Build from minimal, maintained base images and rebuild regularly.
- Scan images in CI and in the registry; see [container image scanning](/article/container-image-security-scanning).
- Pull only from approved registries, and sign and verify images.

## 2. Least-privilege runtime

- **Run as non-root** (`USER` in the Dockerfile, `runAsNonRoot` in Kubernetes).
- **Read-only root filesystem** where possible.
- **Drop Linux capabilities** and add back only what's needed.
- **No privileged containers** and no host path mounts of sensitive directories (especially the container runtime socket).
- **Seccomp and AppArmor/SELinux** profiles to limit system calls.
- **Resource limits** on CPU and memory so one container can't starve others.

Kubernetes Pod Security Standards (Baseline and Restricted), enforced through Pod Security Admission, apply many of these automatically.

## 3. The orchestrator

- **RBAC**: least-privilege roles for people and service accounts; avoid cluster-admin bindings.
- **API server** not exposed to the internet, with authentication through your identity provider.
- **Network policies**: default deny between pods, allowing only required flows.
- **Keep Kubernetes and nodes patched**; managed services (EKS, AKS, GKE) simplify control-plane patching.

## 4. Secrets

Don't bake secrets into images or plain environment variables in manifests committed to Git. Use Kubernetes Secrets with encryption at rest, or better, an external secret manager integrated through a CSI driver or operator.

## 5. Runtime detection and logging

- Runtime security tools (for example Falco) alert on suspicious behaviour: a shell spawned in a container, unexpected outbound connections, writes to sensitive paths.
- Collect container, node and Kubernetes audit logs centrally; see [how a SIEM works](/article/how-siem-actually-works).

## FAQ

**Are containers less secure than virtual machines?**
They provide weaker isolation because they share a kernel. For untrusted multi-tenant workloads, consider sandboxed runtimes or VMs.

## References

- [NIST SP 800-190: Application Container Security Guide](https://csrc.nist.gov/pubs/sp/800/190/final)
- [Kubernetes Pod Security Standards](https://kubernetes.io/docs/concepts/security/pod-security-standards/)
- [CIS Kubernetes Benchmark](https://www.cisecurity.org/benchmark/kubernetes)
