---
title: Threat Modeling with STRIDE: Finding Design Flaws Before You Build
excerpt: A practical walkthrough of STRIDE threat modeling: drawing a data-flow diagram, applying the six threat categories, choosing mitigations, and fitting it into normal development and change work.
---

Most security work finds problems after something is built. Threat modeling finds them on the whiteboard, when fixing them costs almost nothing. STRIDE, developed at Microsoft, is a simple framework for asking "what could go wrong?" systematically.

## Four questions

Threat modeling boils down to:

1. What are we building?
2. What can go wrong?
3. What are we going to do about it?
4. Did we do a good enough job?

## Step 1: Draw a data-flow diagram

Sketch the system: **external entities** (users, partner systems), **processes** (web app, API, background jobs), **data stores** (databases, buckets), **data flows** between them, and **trust boundaries** where data crosses between levels of trust, such as internet to DMZ or app to database. Threats cluster at trust boundaries.

## Step 2: Apply STRIDE

| Threat | Violates | Example | Typical mitigation |
|---|---|---|---|
| **S**poofing | Authentication | Attacker logs in as another user | MFA, strong session handling |
| **T**ampering | Integrity | Changing a price in a request | Server-side validation, signing |
| **R**epudiation | Non-repudiation | User denies making a transfer | Audit logs, tamper-resistant logging |
| **I**nformation disclosure | Confidentiality | API returns other users' data | Authorisation checks, encryption |
| **D**enial of service | Availability | Flooding the login endpoint | [Rate limiting](/article/api-rate-limiting-basics), scaling |
| **E**levation of privilege | Authorisation | Normal user reaches admin functions | Least privilege, role checks |

Walk each element and flow in the diagram and ask which categories apply.

## Step 3: Decide and record

For each threat: mitigate, accept (with an owner and reason), transfer, or eliminate the feature. Record it in the backlog like any other work, and link findings to tests.

## Step 4: Keep it light and repeatable

- Model new features and significant changes, not just big projects.
- An hour with a developer, an architect and someone from security is often enough.
- Tools like OWASP Threat Dragon or Microsoft Threat Modeling Tool help, but a whiteboard works.
- Revisit models when architecture changes.

It fits naturally into a [secure development lifecycle](/article/secure-sdlc-guide), and it works for infrastructure too: a new VPN design or SaaS integration benefits just as much.

## FAQ

**STRIDE or attack trees or PASTA?**
STRIDE is the easiest start. Other methods add depth for specific needs.

## References

- [OWASP Threat Modeling Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html)
- [Threat Modeling Manifesto](https://www.threatmodelingmanifesto.org/)
- [Microsoft Threat Modeling Tool (Microsoft Learn)](https://learn.microsoft.com/en-us/azure/security/develop/threat-modeling-tool)
