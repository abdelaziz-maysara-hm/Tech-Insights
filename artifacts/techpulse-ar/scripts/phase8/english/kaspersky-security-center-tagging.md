---
title: Device Tags in Kaspersky Security Center: Auto-Tagging, Profiles and Selections
excerpt: How tags complement administration groups in KSC, how to create automatic tagging rules, and how to use tags in policy profile activation, device selections and reports, with a naming scheme that stays clean.
---

Administration groups in Kaspersky Security Center give you one hierarchy: each device sits in exactly one group, and policies inherit down the tree. Real fleets have more dimensions than that. A laptop can be in the Cairo branch, belong to Finance, run Windows 11 and be used remotely. Tags let you describe those extra dimensions without rebuilding the group tree.

## Groups vs tags

| | Administration groups | Tags |
|---|---|---|
| Membership | One group per device | Any number of tags per device |
| Main use | Policy inheritance and structure | Filtering, selections, policy profiles, reports |
| Changes | Moving devices between groups | Assigned manually, by rule, or by an application |

A good pattern: keep groups simple (by site or by workstation/server), and use tags for everything else.

## Automatic tagging rules

Manual tags get forgotten. Rules apply them automatically. In the Administration Console, open the Administration Server **Properties > Tagging rules** and add a rule (the Web Console offers the same through its device tags settings). Each rule assigns one tag when a device meets any of its conditions, for example:

- **Network**: domain membership, DNS name, IP subnet (e.g. tag `Site-Cairo` for 10.20.0.0/16).
- **Active Directory**: OU or group membership (e.g. `Dept-Finance`).
- **Operating system** type and version (e.g. `OS-Server2022`).
- **Virtual machine** type.
- **Installed applications** from the application registry (e.g. `App-SQLServer`).

Auto-assigned tags are removed when the device no longer matches, or when the rule is disabled. Kaspersky recommends not mixing manual and rule-based assignment for the same tag. Rules are per Administration Server.

## Using tags

- **Policy profiles**: a profile is a subset of policy settings that activates on devices matching a condition. In the profile's activation rules, "Conditions using tags" lets you activate it on devices that carry all the selected tags (or, inverted, none of them). For example, a stricter device control profile for devices tagged `Dept-Finance`, or SQL-friendly exclusions for `App-SQLServer`; see [KES exclusions](/article/kes-12-exclusions-kaspersky-security-center).
- **Device selections**: dynamic lists filtered by tag, used to target tasks such as updates or scans.
- **Moving devices**: rules for distributing devices among administration groups can use tags.
- **Reports and searches**: find every remote laptop or every server running a given application in seconds.

## A naming scheme that stays useful

Agree a pattern before tagging anything: `Category-Value`, such as `Site-Cairo`, `Type-Laptop`, `Dept-HR`, `Risk-High`. Inconsistent variants (`Cairo`, `cairo-branch`, `Branch-Cairo`) quietly break filters and profiles. Document the list and who may create new tags.

## Keep it tidy

- Review devices that have no tags, or are missing a site tag, after every rollout.
- Remove obsolete tags and their rules.
- Check profile activation results on a few devices after changing rules.

## FAQ

**Do tags replace administration groups?**
No. Policies still attach to groups; tags refine targeting through profiles and selections.

## References

- [Kaspersky Security Center: Automatic device tagging](https://support.kaspersky.com/ksc/15.1/en-us/147191.htm)
- [Kaspersky Security Center: Policy setup and propagation, device-centric approach](https://support.kaspersky.com/ksc/15.1/en-US/177128_1.htm)
- [Kaspersky Security Center: Creating a policy profile activation rule](https://support.kaspersky.com/help/KSC/14/en-US/144953.htm)
