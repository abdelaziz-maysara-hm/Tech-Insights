---
title: Learning Technical Skills with AI Assistants, Safely
excerpt: How IT and security staff can use ChatGPT-style assistants to learn faster without leaking data or running commands they don't understand: what to share, how to verify, and where to practise.
---

AI assistants are good teachers for technical topics. They explain a Kerberos ticket flow at 2 a.m., rephrase a confusing RFC, or walk through what each flag in a command does. They're also confidently wrong at times, and anything you paste in may leave your organisation's control. Used with a few habits, they speed learning without creating new risks.

## Treat it as a tutor, not an authority

An assistant predicts plausible text. It can invent command options, mix up product versions, or describe a setting that was renamed two releases ago. Use it to understand concepts and generate questions; confirm facts in vendor documentation, RFCs and standards.

## Decide what you may share before you type

- **Never paste**: passwords, keys, tokens, customer data, personal data, internal IP plans, full configs or logs from production.
- **Sanitise** examples: replace hostnames, IPs, usernames and domains with placeholders like `server01` and `10.0.0.10`.
- **Use the tool your organisation approved**, with business data-protection terms, rather than a personal account. If none is approved, ask; see [shadow IT](/article/shadow-it-risk-management).

## A workflow that keeps you safe

1. **Ask why, not just what.** "Explain what this PowerShell command does, line by line, and what could go wrong" teaches more than "give me a command".
2. **Ask for sources.** Request the official documentation page for each claim, then open it yourself. If the link doesn't exist or doesn't say that, discard the claim.
3. **Read before you run.** Understand every command's effect, especially anything that deletes, changes permissions, or touches the network.
4. **Practise outside production.** Use a lab: a few VMs, a trial tenant, a home network you own. Never test AI-suggested commands on live systems first.
5. **Write down what you verified.** Your notes become your own reference, independent of the assistant.

## Prompts that work well for learning

- "Quiz me on the differences between NTLM and Kerberos; don't give the answers until I respond."
- "Here is a sanitised error message. List likely causes in order and how I would confirm each one using read-only checks."
- "Explain this concept as you would to a junior network engineer, then give me three lab exercises."

## When to stop and ask a person

- The suggestion affects production, security controls or many users.
- You can't find the claim in official documentation.
- The assistant contradicts itself when asked the same thing differently.

For writing troubleshooting prompts in detail, see [safe AI prompts for technical troubleshooting](/article/effective-ai-prompting-guide); for how these models behave, see [how LLMs work in enterprise IT](/article/how-large-language-models-work).

## FAQ

**Can I use AI to prepare for certifications?**
Yes, for explanations and practice questions, but check answers against official exam objectives and documentation. Some generated questions are wrong.

**Is it cheating to learn this way?**
No more than using a book, as long as you understand and verify what you learn.

## References

- [NIST AI Risk Management Framework](https://www.nist.gov/itl/ai-risk-management-framework)
- [OWASP Top 10 for Large Language Model Applications](https://owasp.org/www-project-top-10-for-large-language-model-applications/)
