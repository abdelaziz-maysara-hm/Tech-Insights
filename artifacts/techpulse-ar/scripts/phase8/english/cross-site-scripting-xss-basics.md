---
title: Cross-Site Scripting (XSS): How Injected Scripts Hijack Users, and How to Stop Them
excerpt: Reflected, stored and DOM-based XSS explained with simple examples, what an attacker can do with it, and the defences that work: output encoding, safe frameworks, CSP and cookie flags.
---

Cross-site scripting happens when a website includes untrusted input in a page without handling it safely, so the browser runs it as code. The script runs with the site's identity, so it can read what the user sees, act as the user, and sometimes steal their session.

## The three types

- **Reflected**: input in a URL or form is echoed straight back. A link like `https://shop.example/search?q=<script>…</script>` runs the script for whoever clicks it.
- **Stored**: the payload is saved, for example in a comment, profile name or support ticket, and runs for every visitor who views it. The most dangerous kind, especially when admins view the content.
- **DOM-based**: client-side JavaScript takes data from the URL or another source and writes it into the page unsafely (`innerHTML`, `document.write`), without the server being involved.

## What attackers do with it

- Steal session cookies that aren't protected with `HttpOnly`.
- Perform actions as the user: change email, transfer funds, create admin accounts.
- Show fake login forms on the real domain.
- Log keystrokes or pull data from the page.

## Defences

1. **Context-aware output encoding**: encode data for the place it's inserted (HTML body, attribute, JavaScript, URL). This is the primary defence.
2. **Use frameworks that escape by default**: React, Angular, Vue and modern template engines escape output unless you deliberately bypass them (`dangerouslySetInnerHTML`, `v-html`, `bypassSecurityTrust…`). Treat those bypasses as code-review red flags.
3. **Sanitise HTML** when you must accept rich text, with a maintained library such as DOMPurify, never home-grown regex.
4. **Content Security Policy (CSP)**: restrict where scripts may load from and block inline scripts. A strict nonce- or hash-based CSP greatly limits what an XSS bug can do.
5. **Cookie flags**: `HttpOnly`, `Secure` and `SameSite` on session cookies.
6. **Validate input** as an extra layer (types, lengths, allowed characters), but don't rely on it alone.
7. **Test**: DAST scanners and code review catch many XSS bugs; a [WAF](/article/web-application-firewall-waf-guide) can block common payloads but is not a fix.

XSS sits in the Injection category of the [OWASP Top 10](/article/owasp-top-10-overview).

## FAQ

**Is XSS still common with modern frameworks?**
Less common, but it appears wherever developers bypass escaping, in legacy code, and in DOM-based bugs.

## References

- [OWASP Cross Site Scripting Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [Content Security Policy (MDN)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP)
