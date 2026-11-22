# NetSec Atlas Desktop Tools

Windows desktop utilities written in C# (.NET 8 WinForms). Current release: [v1.3](https://github.com/abdelaziz-maysara-hm/Tech-Insights/releases/tag/desktop-v1.3).

## Tools included (v1.3)

- **Subnet Calculator** — network, mask, wildcard, broadcast, usable range
- **VLSM Calculator** — split a parent block into variable-sized subnets
- **Range to CIDR** — convert an IPv4 range to CIDR prefixes
- **Common Ports Lookup** — searchable list of frequently used ports
- **Hash** — hash text or a file (checksums)
- **Encoding** — Base64 and hex encode/decode
- **Password generator**
- **IP converter** — dotted decimal / integer / hex / binary
- **MAC vendor lookup**
- **Timestamp converter**

The app does not require an installer. The MAC vendor lookup may use a local or bundled vendor list; other tools run offline.

## Build a single-file EXE

Requires the [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0).

```bash
cd desktop/NetSecAtlasTools
dotnet publish -c Release -r win-x64 --self-contained true -p:PublishSingleFile=true
```

The EXE is produced at:

```
bin/Release/net8.0-windows/win-x64/publish/NetSecAtlasTools.exe
```

CI: `.github/workflows/build-desktop.yml` can be run with `workflow_dispatch` to attach `NetSecAtlasTools.exe` to a GitHub Release (tags `desktop-v*`).

This app is separate from the bilingual WPF suite in [netsecatlas-apps](https://github.com/abdelaziz-maysara-hm/netsecatlas-apps) (health check, lockout tracer, and similar). See `docs/ROADMAP.md`.
