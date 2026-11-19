---
title: Remote Browser Isolation: An Extra Layer Between Users and the Web
excerpt: How browser isolation keeps web code off the endpoint, the different approaches (pixel streaming, DOM reconstruction, local sandboxes), where it fits, and its trade-offs.
---

Most attacks still arrive through a browser: a malicious link in an email, a compromised website, a drive-by download. Browser isolation adds a layer by running web content away from the user's device, so whatever the page tries to do happens somewhere disposable.

## How it works

The page loads and executes in an isolated environment, usually a container in the cloud or on-prem. The user sees and interacts with a safe rendering of it. When the session ends, the container is thrown away along with anything malicious.

## Approaches

- **Pixel streaming**: the user receives a video-like stream of the page. Very safe, but can feel laggy and use more bandwidth.
- **DOM reconstruction**: the remote browser rebuilds a cleaned version of the page, removing active content, and sends that to the local browser. More responsive; some complex sites may break.
- **Local isolation**: the browser runs in a hardware-isolated container on the device, such as virtualisation-based sandboxes.

## Where it fits best

You don't have to isolate everything. Common patterns:

- **Uncategorised and risky sites**: your secure web gateway sends unknown or newly registered domains to isolation instead of blocking them outright.
- **Links in email**: clicks open in isolation, which limits damage from phishing.
- **High-risk users**: finance, executives, admins.
- **Unmanaged devices**: contractors reach internal web apps through an isolated session, often with copy, paste, print and download disabled.

## Limits

- **It doesn't stop credential theft by itself.** A user can still type a password into a convincing phishing page. Pair isolation with read-only mode for unknown sites, or blocking form input.
- **Downloads** need a policy: block, scan and sanitise (content disarm and reconstruction), or allow.
- **User experience** and cost rise if you isolate everything.

Browser isolation is often bundled into SSE/SASE platforms alongside secure web gateways and ZTNA, and works best as one layer with [DNS filtering](/article/dns-security-filtering-dnssec), endpoint protection and phishing-resistant MFA.

## FAQ

**Does isolation replace antivirus or EDR?**
No. It reduces web-borne risk; other threats still reach the device.

**Can users tell they're isolated?**
With good DOM-based products, often not, apart from occasional rendering quirks.

## References

- [CISA Capacity Enhancement Guides: Securing Web Browsers and Defending Against Malvertising (includes browser isolation)](https://www.cisa.gov/resources-tools/resources/capacity-enhancement-guides-non-federal-organizations)
