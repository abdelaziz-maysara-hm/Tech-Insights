# Launch smoke test: the exe must start, show its window, stay alive, and render a screenshot in both languages.
param([Parameter(Mandatory)][string]$Exe, [string]$Out = "screenshots")
$ErrorActionPreference = "Stop"
New-Item -ItemType Directory -Force -Path $Out | Out-Null
$Exe = (Resolve-Path $Exe).Path
$size = (Get-Item $Exe).Length
Write-Host "exe: $Exe ($([math]::Round($size / 1MB, 1)) MB)"
if ($size -lt 20MB) { throw "exe is suspiciously small" }

# 1) Normal start: window must appear and the process must still be running after 15 s.
$p = Start-Process -FilePath $Exe -ArgumentList "--test" -PassThru
$deadline = (Get-Date).AddSeconds(60)
while ((Get-Date) -lt $deadline) { $p.Refresh(); if ($p.HasExited -or $p.MainWindowHandle -ne 0) { break }; Start-Sleep -Milliseconds 500 }
if ($p.HasExited) { throw "app exited during start-up with code $($p.ExitCode)" }
if ($p.MainWindowHandle -eq 0) { throw "no main window after 60 s" }
Write-Host "window: '$($p.MainWindowTitle)'"
Start-Sleep -Seconds 15
$p.Refresh()
if ($p.HasExited) { throw "app crashed after start-up (exit $($p.ExitCode))" }
Stop-Process -Id $p.Id -Force
Write-Host "start-up OK"

# 2) Render-to-PNG mode exits 0 by itself (English and Arabic home page).
foreach ($lang in "en", "ar") {
  $png = Join-Path (Resolve-Path $Out) "smoke-home-$lang.png"
  $q = Start-Process -FilePath $Exe -ArgumentList "--lang", $lang, "--tool", "home", "--screenshot", "`"$png`"", "--delay", "2" -PassThru
  if (-not $q.WaitForExit(90000)) { $q.Kill(); throw "screenshot mode timed out ($lang)" }
  if ($q.ExitCode -ne 0) { throw "screenshot mode exit code $($q.ExitCode) ($lang)" }
  if (-not (Test-Path $png) -or (Get-Item $png).Length -lt 5000) { throw "no screenshot ($lang)" }
  Write-Host "ok $png"
}
