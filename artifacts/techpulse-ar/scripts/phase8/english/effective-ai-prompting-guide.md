---
title: Writing Safe AI Prompts for Technical Troubleshooting: An Engineer’s Template
excerpt: A structured diagnostic prompt that separates facts from assumptions, starts read-only, and requires risks, verification, and rollback.
---

Ask an AI assistant "why is my VPN broken?" and you'll get a generic list, and possibly a confident instruction to change something you shouldn't. The quality and safety of the answer depend heavily on how you frame the problem. This template turns a vague question into a structured diagnostic request.

## The problem with vague prompts

A short prompt forces the model to guess the environment, the versions and what you've already tried. It fills the gaps with the most common scenario, which may not be yours, and often jumps straight to a fix. In production, a wrong fix can cause a second outage on top of the first.

## Facts first, guesses labelled

Before writing the prompt, split what you know into two lists:

- **Observed facts**: exact error text, product and version, what changed recently, what you've already ruled out, timestamps.
- **Assumptions**: "I think it's DNS", "probably the certificate".

Labelling assumptions stops the model from treating your hunch as a fact and building on it.

## The template

```
Role: You are helping a network/systems engineer troubleshoot.
Environment: <product, version, OS, topology in one or two lines; sanitised>
Symptom: <exact error, who is affected, since when>
Recent changes: <updates, config edits, none known>
Already checked: <tests and results>
Assumptions (unverified): <your hunches>
Constraints: production system; no changes without approval.

Please:
1. List likely causes, most probable first, and why.
2. For each, give read-only checks to confirm or rule it out.
3. Only after that, suggest fixes, each with risk, impact, a verification step and a rollback.
4. Cite official documentation for each command or setting.
5. Say clearly when you are unsure.
```

## Why "read-only checks" first

Diagnostic commands (`show`, `Get-`, `diagnose ... list`, log queries) don't change anything. Starting there means you confirm the cause before touching configuration, and you collect evidence for the change record.

## Short example

Instead of "FortiClient error 7200 fix", write: "FortiGate on FortiOS 7.4, users on FortiClient 7.2 get -7200 at 48% since this morning; we edited the SSL VPN portal yesterday; password resets didn't help; I assume it's the portal change." The answer will be specific, and you can compare it with our [-7200 troubleshooting guide](/article/forticlient-error-7200-fix).

## Keep sensitive data out

Sanitise hostnames, IPs, usernames and domains. Never paste secrets, full configurations, customer data or unredacted logs. Use the AI tool your organisation approved.

## Review before you run anything

Check every suggested command against vendor documentation, understand its effect, and run changes through your normal process: test first, change record, rollback plan. See [change management](/article/it-change-management-process-basics).

## FAQ

**Does a longer prompt always help?**
Relevant detail helps; pasted pages of logs usually don't. Extract the lines that matter.

**Can I trust cited documentation links?**
Open them. Models sometimes produce links that look right but don't exist.

## References

- [OWASP Top 10 for Large Language Model Applications](https://owasp.org/www-project-top-10-for-large-language-model-applications/)
- [NIST AI 600-1: Generative AI Profile](https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence)
