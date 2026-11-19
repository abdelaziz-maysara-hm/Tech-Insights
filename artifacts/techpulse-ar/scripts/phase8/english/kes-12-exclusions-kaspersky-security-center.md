---
title: Exclusions in Kaspersky Endpoint Security 12 via KSC: Narrow, Documented and Importable
excerpt: When an exclusion is justified, how scan exclusions differ from trusted applications in KES 12 for Windows, how to manage them centrally in a KSC policy, a reliable XML import workflow, and the paths you should never exclude.
---

Every exclusion you add to endpoint protection is a place it stops looking. Attackers know that, and some malware deliberately checks for excluded folders to drop its tools into. Exclusions are still sometimes necessary, but they should be the narrowest possible fix for a confirmed problem, managed centrally and reviewed.

## When an exclusion is justified

- Protection causes measurable harm: a database, backup or GIS application slows badly under real-time scanning.
- A specialised application conflicts with a protection component.
- A confirmed false positive on a legitimate tool.

Not justified: "the forum said so", or excluding something because it might be slow one day. Prefer the application vendor's documented list of recommended exclusions where one exists. The wider process for managing exclusions and risk is in the [endpoint security and vulnerability management guide](/article/endpoint-vulnerability-management-guide).

## Scan exclusions vs trusted applications

| | Scan exclusions | Trusted applications |
|---|---|---|
| What's excluded | Files, folders, object names or hashes from scanning | An application's activity (files it opens, its behaviour, network traffic) from monitoring |
| Typical use | Database files of a given extension in a given path | A backup agent reading millions of files |
| Main risk | Anything malicious placed in the excluded path goes unscanned | If the trusted app is exploited, its actions may go unwatched |

Choose the type that solves the problem with the least blind spot.

## Managing exclusions in a KSC policy

Manage exclusions in the **Kaspersky Endpoint Security for Windows policy** in Kaspersky Security Center, under General settings > Exclusions, where both the scan exclusions list and the trusted applications list live. Labels differ slightly between the Administration Console and the Web Console and across KES 12.x versions, so check the help for your exact version.

### Options for scan exclusions

- **File or folder path**, with masks (`*`, `?`) and environment variables.
- **Object name** from Kaspersky's classification, for example a legitimate remote administration tool detected as `not-a-virus`.
- **File hash**: the narrowest option, ideal for a single file that doesn't change.
- **Protection components**: apply the exclusion only to the component causing the issue, such as File Threat Protection, instead of all components.

### Options for trusted applications

For each trusted application, choose exactly what to relax: not scanning files it opens, not monitoring its activity, not monitoring child processes, not scanning its network traffic. Enable only what solves the problem.

### Inheritance and local exclusions

- In nested policies, the option to merge values when inheriting combines parent and child lists.
- Block users from adding their own local exclusions and trusted applications, so every exception is visible centrally. Since KES 12.6, the trusted zone is hidden from users when the administrator prohibits local exclusions.
- Since KES 12.6, **predefined exclusions** are available for SQL Server, Microsoft Exchange and System Center Configuration Manager. Use them instead of hand-built lists for those systems.

## Importing a long list as XML

Typing dozens of vendor-recommended paths by hand invites mistakes. The exclusions lists support export to and import from XML. The format can vary by version, so build your file from your own export:

1. Add one exclusion manually with exactly the settings you want.
2. Export the list to XML.
3. Copy that entry's structure for each additional path, changing only the path or hash.
4. Import into a **test policy** and confirm every entry appears correctly.
5. Apply to a pilot group, watch for problems, then roll out.

## Checklist before adding an exclusion

- [ ] The problem is confirmed and caused by protection (tested on a test machine, not by disabling protection fleet-wide).
- [ ] There's vendor guidance, or a documented reason.
- [ ] The scope is as narrow as possible: hash, file, or extension within a path rather than a whole folder.
- [ ] Standard users can't write to the excluded path.
- [ ] The exclusion applies only to the component involved.
- [ ] Owner, reason and review date are recorded.

## Never exclude

- A whole drive (`C:\`).
- User-writable locations: `Temp`, `Downloads`, `AppData`.
- `C:\Windows` or `System32`.
- Network shares everyone can write to.

To target different exclusion sets at different device roles, combine policies with [KSC device tags and policy profiles](/article/kaspersky-security-center-tagging).

## FAQ

### Can I exclude a process rather than a path?

Yes. Add it to trusted applications and enable only the options you need.

### Why doesn't a new exclusion reach devices?

Check that the policy is active for the right administration group, that devices are synchronising with the Administration Server, and that the setting is locked if you want to enforce it.

### Do exclusions affect scheduled scans as well?

That depends on which components you selected: real-time protection only, or scan tasks as well.

## References

- [Kaspersky Endpoint Security 12 for Windows Help: Creating a local trusted zone](https://support.kaspersky.com/help/KESWIN/12.9/en-US/128356.htm)
- [Kaspersky Endpoint Security 12.6 for Windows: What's new](https://support.kaspersky.com/kes-for-windows/12.6/127969)
- [Kaspersky Endpoint Security for Windows Help: Editing the list of trusted applications](https://support.kaspersky.com/KESWin/11.5.0/en-US/123510.htm)
