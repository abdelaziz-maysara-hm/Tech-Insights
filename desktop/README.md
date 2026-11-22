# NetSec Atlas Tools (desktop)

One Windows program with **18 network and security tools**, in Arabic and English. Version **2.0** merges the earlier NetSecAtlasTools 1.x calculators (WinForms) and the 11 NetSec Atlas apps (WPF, previously in [netsecatlas-apps](https://github.com/abdelaziz-maysara-hm/netsecatlas-apps)) into a single WPF app on .NET 10 LTS.

**Download:** [netsecatlas.com/en/tools](https://netsecatlas.com/en/tools) (direct `.exe` download) or [Releases](https://github.com/abdelaziz-maysara-hm/Tech-Insights/releases/latest). One file, no install, no .NET needed. x64 and ARM64. Check the SHA-256 against `SHA256SUMS.txt`:

```powershell
Get-FileHash .\NetSecAtlasTools.exe -Algorithm SHA256
```

> Not code-signed yet, so SmartScreen may say "Windows protected your PC": check the hash, then *More info → Run anyway*.

## Tools

| Category | Tool | From | Network use |
|---|---|---|---|
| Everyday security | Security Health Check | WPF app | none |
| | Hash Checker (files **and text**, SHA256SUMS, Explorer menu) | WPF app + 1.x Hash | none |
| | Passwords (**generator**, strength, breach check) | WPF app + 1.x Password generator | api.pwnedpasswords.com, 5-char prefix, only when you press it |
| | Wi-Fi Checker | WPF app | none (local scan) |
| Networking | Network Troubleshooter | WPF app | the target you enter |
| | Ping Monitor | WPF app | ICMP to your hosts |
| | DNS Benchmark | WPF app | DNS queries |
| | Ports & Services (listening ports, remote test, **common ports reference**) | WPF app + 1.x Common Ports | remote test only |
| | Subnet Calculator | 1.x | none |
| | VLSM Planner | 1.x | none |
| | Range → CIDR | 1.x | none |
| | IP Converter | 1.x | none |
| | MAC Vendor Lookup | 1.x | none |
| Admin & email | AD Lockout Tracer | WPF app | your domain controllers |
| | TLS Certificate Checker | WPF app | the hosts you list |
| | Email Header Analyzer | WPF app | none |
| Utilities | Encode / Decode (Base64, Hex, **URL**) | 1.x | none |
| | Timestamp Converter (seconds **and milliseconds**) | 1.x | none |

Duplicates removed: the 1.x hash, password generator and port list now live inside Hash Checker, Passwords and Ports & Services.

Fixes found while porting 1.x: `/0` returned a wrong block size (32-bit shift wrap), a range ending at `255.255.255.255` never finished, and the password generator could leave out a selected character type.

Command line: `NetSecAtlasTools.exe [file] [--lang ar|en] [--tool <id>] [--demo]`. A file path opens it in Hash Checker (used by the Explorer menu). Tool ids: `healthcheck hashchecker passwordcheck wificheck netdoctor pingmonitor dnsbench portcheck subnet vlsm range ipconvert mac lockouttracer certexpiry headeranalyzer encoding timestamp`.

Privacy: no telemetry, no ads, no accounts. Only the language choice is saved (`%APPDATA%\NetSecAtlas\settings.txt`).

## Layout

```
desktop/
  NetSecAtlasTools.slnx
  src/NetSecAtlas.Core/         logic, no UI (net10.0), unit tested; Classic/ = ported 1.x calculators
  src/NetSecAtlasTools/         the WPF exe: Shell/ (window, navigation, toolkit), Pages/ (one file per tool)
  tests/NetSecAtlas.Core.Tests/ xUnit unit tests
  tests/NetSecAtlasTools.UiTests/ FlaUI tests that drive the real exe
  build/                        manifest, icon, smoke.ps1 (launch test)
```

To add a tool: add a `ToolPage` subclass in `Pages/`, register it in `Shell/ToolRegistry.cs`, put the logic in Core with unit tests, override `OnDemoAsync` (powers "Try a sample", the UI tests and screenshots), and add its id to `UiTests.Tools`.

## Build and test

```powershell
dotnet test desktop/tests/NetSecAtlas.Core.Tests
dotnet publish desktop/src/NetSecAtlasTools -c Release -r win-x64 --self-contained -p:PublishSingleFile=true -o dist
./desktop/build/smoke.ps1 -Exe dist/NetSecAtlasTools.exe
$env:NSA_EXE = "$PWD/dist/NetSecAtlasTools.exe"; dotnet test desktop/tests/NetSecAtlasTools.UiTests
```

## CI and releases

`.github/workflows/desktop-ci.yml` runs on every change under `desktop/`, on both `windows-latest` (x64) and `windows-11-arm` (ARM64): unit tests → single-file publish → launch smoke test → UI tests that open every tool and run it → screenshots (English and Arabic) as artifacts.

Release: push a tag `desktop-vX.Y` (e.g. `git tag desktop-v2.1 && git push origin desktop-v2.1`). The release job runs only if every test job passed, and uploads `NetSecAtlasTools.exe`, `NetSecAtlasTools-arm64.exe`, `SHA256SUMS.txt` and `screenshots.zip`. The site then re-deploys and copies the files to `netsecatlas.com/downloads/`.

---

## بالعربي

**NetSec Atlas Tools** برنامج واحد لويندوز فيه 18 أداة شبكات وأمان بالعربي والإنجليزي. الإصدار 2.0 دمج برنامج NetSecAtlasTools 1.x (الحاسبات) مع برامج NetSec Atlas الأحد عشر في برنامج واحد، وحذف المكرر (البصمة ومولد كلمات المرور وقائمة المنافذ بقت جوه الأدوات الأكبر).

التحميل من [netsecatlas.com/ar/tools](https://netsecatlas.com/ar/tools) مباشرة. ملف واحد من غير تثبيت. كل إصدار بيعدي اختبارات وحدات واختبار تشغيل واختبار واجهة لكل أداة على x64 وARM64 قبل ما يتنشر.

الترخيص: MIT.
