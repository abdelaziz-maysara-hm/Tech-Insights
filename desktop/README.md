# NetSec Atlas Desktop Tools

Windows desktop utilities written in C# (.NET 8 WinForms).

## Tools included

- **Subnet Calculator** — network, mask, wildcard, broadcast, usable range
- **VLSM Calculator** — split a parent block into variable-sized subnets
- **Common Ports Lookup** — searchable list of frequently used ports

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

Copy that file anywhere and run it. No installer needed. Nothing is sent over the network.

