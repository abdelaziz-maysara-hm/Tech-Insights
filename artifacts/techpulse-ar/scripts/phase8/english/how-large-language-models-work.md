---
title: How LLMs Work in Enterprise IT: A Practical Guide to Trust and Risk
excerpt: A practical explanation of tokens, context windows, and RAG—and why LLM output needs evidence and security controls.
---

IT teams are being asked to approve, integrate and support tools built on large language models. You don't need the maths to make good decisions, but you do need a clear picture of what these systems do, because it explains both their usefulness and their typical failures.

## Text prediction, not database lookup

An LLM is trained to predict the next piece of text, a **token** (roughly a word fragment), given everything before it. Repeat that thousands of times and you get fluent paragraphs. Nothing in that process checks the answer against an authoritative source. When the model "knows" something, it's because the pattern was common in training data; when it doesn't, it can still produce text that sounds just as certain.

## What happens when you ask a question

1. Your prompt, plus any system instructions and conversation history, is split into tokens.
2. Everything must fit in the **context window**, the maximum number of tokens the model can consider at once. Long conversations or documents can push earlier content out.
3. The model generates a response token by token, with some randomness controlled by settings like temperature.

## Training data is not a reference library

Training compresses patterns from a huge corpus up to a cut-off date. The model can't list its sources, may blend versions of a product, and won't know about last month's vulnerability or a renamed setting. That's why version-specific answers need checking.

## Retrieval-Augmented Generation (RAG)

RAG fetches relevant documents (your knowledge base, vendor docs, tickets) at question time and puts them into the context, so the model answers from that text. It improves freshness and lets the system cite sources. It does **not** guarantee correctness: retrieval can pick the wrong document, the source may be outdated, and the model can still misread it. RAG also creates a new risk: anyone who can edit the indexed content can influence answers, including through hidden instructions (indirect prompt injection).

## Trust boundaries for operations and security

- **Treat output as untrusted input.** Never pipe generated commands or scripts straight into production. Review them, test them, and keep a rollback plan.
- **Limit what the model can do.** If an assistant can call tools (run queries, open tickets, change settings), give it least-privilege permissions and require human approval for changes.
- **Control the data.** Know what's sent to the provider, whether it's retained or used for training, and where it's processed. Keep secrets and personal data out of prompts.
- **Guard against prompt injection.** Content from emails, web pages or documents can contain instructions aimed at the model. Separate trusted instructions from untrusted content and filter tool actions.
- **Log usage** for audit and incident response.

## A pre-use review checklist

- Which data will users submit, and is that permitted by your [data classification](/article/data-classification-basics)?
- What are the provider's retention, training and regional processing terms?
- Can the tool take actions, and with what permissions?
- How are answers verified, and who is accountable for decisions based on them?
- Is there logging, and a way to disable the tool quickly?

## FAQ

**Why does the same question give different answers?**
Generation includes controlled randomness, and small prompt differences change the context.

**Does a bigger model mean fewer errors?**
Often fewer, never none. Verification is still required.

For day-to-day use, see [learning technical skills with AI assistants safely](/article/chatgpt-study-without-harm).

## References

- [OWASP Top 10 for Large Language Model Applications](https://owasp.org/www-project-top-10-for-large-language-model-applications/)
- [NIST AI Risk Management Framework](https://www.nist.gov/itl/ai-risk-management-framework)
