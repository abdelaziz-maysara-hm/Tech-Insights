using System.Globalization;
using System.Management;
using System.Security.Principal;
using Microsoft.Win32;
using NetSecAtlas.Core;

namespace HealthCheck;

/// <summary>Read-only probes. Nothing here changes a setting.</summary>
static class Probes
{
    static object? Reg(RegistryKey hive, string path, string name)
    {
        try { using var k = hive.OpenSubKey(path); return k?.GetValue(name); } catch { return null; }
    }

    static List<ManagementBaseObject> Wmi(string scope, string query)
    {
        try { using var s = new ManagementObjectSearcher(scope, query); return s.Get().Cast<ManagementBaseObject>().ToList(); }
        catch { return new(); }
    }

    public static bool IsAdmin() { using var id = WindowsIdentity.GetCurrent(); return new WindowsPrincipal(id).IsInRole(WindowsBuiltInRole.Administrator); }

    public static List<HealthItem> RunAll()
    {
        var list = new List<HealthItem>();
        void Add(Func<HealthItem> f) { try { list.Add(f()); } catch (Exception ex) { list.Add(new("error", "Probe", Level.Unknown, ex.Message, "", "")); } }
        Add(Os); Add(Antivirus); Add(Signatures); Add(Firewall); Add(Updates); Add(Uac); Add(BitLocker); Add(Smb1); Add(Rdp); Add(SecureBoot); Add(Startup); Add(AdminUse);
        return list;
    }

    static HealthItem Os()
    {
        const string p = @"SOFTWARE\Microsoft\Windows NT\CurrentVersion";
        int build = int.TryParse(Reg(Registry.LocalMachine, p, "CurrentBuild") as string, out var b) ? b : Environment.OSVersion.Version.Build;
        var display = Reg(Registry.LocalMachine, p, "DisplayVersion") as string ?? "";
        var edition = Reg(Registry.LocalMachine, p, "EditionID") as string ?? "";
        bool server = (Reg(Registry.LocalMachine, p, "InstallationType") as string ?? "").Contains("Server");
        var name = server ? (Reg(Registry.LocalMachine, p, "ProductName") as string ?? "Windows Server") : build >= 22000 ? "Windows 11" : "Windows 10";
        var detail = $"{name} {edition} {display} (build {build}.{Reg(Registry.LocalMachine, p, "UBR")})";
        if (!server && build < 22000)
            return new("os", Tr.T("Windows version", "إصدار ويندوز"), edition.Contains("LTSC", StringComparison.OrdinalIgnoreCase) ? Level.Warn : Level.Bad, detail,
                Tr.T("Windows 10 support ended on 14 October 2025. Upgrade to Windows 11 or enrol in Extended Security Updates.", "انتهى دعم ويندوز 10 في 14 أكتوبر 2025. رقِّ إلى ويندوز 11 أو اشترك في التحديثات الأمنية الممتدة (ESU)."), "windows-patch-management-strategy");
        return new("os", Tr.T("Windows version", "إصدار ويندوز"), Level.Ok, detail,
            Tr.T("Check that this feature update is still in support on Microsoft's lifecycle page.", "تأكد أن هذا الإصدار ما زال مدعومًا في صفحة دورة حياة منتجات مايكروسوفت."), "windows-patch-management-strategy");
    }

    static ManagementBaseObject? Defender() => Wmi(@"root\Microsoft\Windows\Defender", "SELECT * FROM MSFT_MpComputerStatus").FirstOrDefault();

    static HealthItem Antivirus()
    {
        var title = Tr.T("Antivirus", "مضاد الفيروسات");
        var products = Wmi(@"root\SecurityCenter2", "SELECT displayName, productState FROM AntiVirusProduct")
            .Select(o => (Name: o["displayName"]?.ToString() ?? "?", State: Convert.ToInt32(o["productState"] ?? 0))).ToList();
        if (products.Count > 0)
        {
            // productState: second byte 0x10/0x11 = real-time protection on (widely documented Security Center encoding).
            var on = products.Where(p => ((p.State >> 8) & 0xFF) is 0x10 or 0x11).ToList();
            return on.Count > 0
                ? new("av", title, Level.Ok, string.Join(", ", on.Select(p => p.Name)) + Tr.T(" — real-time protection on", " — الحماية الفورية مفعّلة"), "", "how-edr-actually-works")
                : new("av", title, Level.Bad, string.Join(", ", products.Select(p => p.Name)) + Tr.T(" — real-time protection is OFF", " — الحماية الفورية متوقفة"),
                    Tr.T("Turn real-time protection back on in Windows Security.", "أعد تفعيل الحماية الفورية من تطبيق أمن ويندوز."), "how-edr-actually-works");
        }
        var d = Defender();
        if (d is null) return new("av", title, Level.Unknown, Tr.T("Security Center is not available (normal on Windows Server).", "مركز الأمان غير متاح (طبيعي على Windows Server)."), "", "how-edr-actually-works");
        bool rtp = d["RealTimeProtectionEnabled"] is true;
        return new("av", title, rtp ? Level.Ok : Level.Bad, $"Microsoft Defender — {(rtp ? Tr.T("real-time protection on", "الحماية الفورية مفعّلة") : Tr.T("real-time protection OFF", "الحماية الفورية متوقفة"))}", "", "how-edr-actually-works");
    }

    static HealthItem Signatures()
    {
        var title = Tr.T("Antivirus definitions", "تعريفات مضاد الفيروسات");
        var d = Defender();
        if (d?["AntivirusSignatureAge"] is { } age && d["AntivirusEnabled"] is true)
        {
            int days = Convert.ToInt32(age);
            return new("av-sig", title, days <= 3 ? Level.Ok : days <= 7 ? Level.Warn : Level.Bad,
                Tr.T($"Microsoft Defender definitions are {days} day(s) old", $"عمر تعريفات Microsoft Defender {days} يوم"), days > 3 ? Tr.T("Run Windows Update or click Check for updates in Windows Security.", "شغّل تحديثات ويندوز أو اضغط «التحقق من التحديثات» في أمن ويندوز.") : "", "");
        }
        var products = Wmi(@"root\SecurityCenter2", "SELECT productState FROM AntiVirusProduct").Select(o => Convert.ToInt32(o["productState"] ?? 0)).ToList();
        if (products.Count == 0) return new("av-sig", title, Level.Unknown, Tr.T("Not reported", "غير متاح"), "", "");
        bool upToDate = products.Any(s => (s & 0xFF) == 0x00);
        return new("av-sig", title, upToDate ? Level.Ok : Level.Bad, upToDate ? Tr.T("Reported up to date by Security Center", "محدثة حسب مركز الأمان") : Tr.T("Reported out of date", "غير محدثة"), "", "");
    }

    static HealthItem Firewall()
    {
        var title = Tr.T("Firewall", "الجدار الناري");
        var third = Wmi(@"root\SecurityCenter2", "SELECT displayName, productState FROM FirewallProduct")
            .Where(o => ((Convert.ToInt32(o["productState"] ?? 0) >> 8) & 0xFF) is 0x10 or 0x11).Select(o => o["displayName"]?.ToString()).ToList();
        string[] profiles = { "DomainProfile", "StandardProfile", "PublicProfile" };
        string[] names = { Tr.T("Domain", "المجال"), Tr.T("Private", "خاص"), Tr.T("Public", "عام") };
        var off = new List<string>();
        for (int i = 0; i < 3; i++)
        {
            var pol = Reg(Registry.LocalMachine, $@"SOFTWARE\Policies\Microsoft\WindowsFirewall\{profiles[i]}", "EnableFirewall");
            var local = Reg(Registry.LocalMachine, $@"SYSTEM\CurrentControlSet\Services\SharedAccess\Parameters\FirewallPolicy\{profiles[i]}", "EnableFirewall");
            if (Convert.ToInt32(pol ?? local ?? 1) == 0) off.Add(names[i]);
        }
        if (off.Count == 0) return new("firewall", title, Level.Ok, Tr.T("Windows Firewall is on for all profiles", "جدار ويندوز مفعّل لكل الملفات الشخصية"), "", "windows-firewall-advanced-rules");
        if (third.Count > 0) return new("firewall", title, Level.Ok, string.Join(", ", third) + Tr.T(" is managing the firewall", " يدير الجدار الناري"), "", "windows-firewall-advanced-rules");
        return new("firewall", title, off.Contains(names[2]) ? Level.Bad : Level.Warn, Tr.T($"Off for: {string.Join(", ", off)}", $"متوقف في: {string.Join("، ", off)}"),
            Tr.T("Turn the firewall back on; add a specific rule instead of disabling it.", "أعد تشغيل الجدار الناري، وأضف قاعدة محددة بدل إيقافه."), "windows-firewall-advanced-rules");
    }

    static HealthItem Updates()
    {
        var dates = Wmi(@"root\cimv2", "SELECT InstalledOn FROM Win32_QuickFixEngineering")
            .Select(o => o["InstalledOn"]?.ToString())
            .Select(s => DateTime.TryParse(s, CultureInfo.InvariantCulture, DateTimeStyles.AssumeLocal, out var d) ? d
                       : DateTime.TryParse(s, CultureInfo.CurrentCulture, DateTimeStyles.AssumeLocal, out d) ? d : (DateTime?)null)
            .Where(d => d.HasValue && d.Value <= DateTime.Now.AddDays(1)).ToList();
        var (lvl, text) = HealthScore.RateUpdateAge(dates.Count == 0 ? null : dates.Max(), DateTime.Now);
        return new("updates", Tr.T("Windows Update", "تحديثات ويندوز"), lvl, text,
            lvl is Level.Ok ? "" : Tr.T("Open Settings → Windows Update and install pending updates, then restart.", "افتح الإعدادات ← Windows Update وثبّت التحديثات المعلقة ثم أعد التشغيل."), "windows-patch-management-strategy");
    }

    static HealthItem Uac()
    {
        const string p = @"SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System";
        var title = Tr.T("User Account Control (UAC)", "التحكم في حساب المستخدم (UAC)");
        if (Convert.ToInt32(Reg(Registry.LocalMachine, p, "EnableLUA") ?? 1) == 0)
            return new("uac", title, Level.Bad, Tr.T("UAC is disabled", "UAC معطل"), Tr.T("Re-enable UAC: every program currently runs with full rights.", "أعد تفعيل UAC: كل البرامج تعمل الآن بصلاحيات كاملة."), "least-privilege-principle-practical");
        if (Convert.ToInt32(Reg(Registry.LocalMachine, p, "ConsentPromptBehaviorAdmin") ?? 5) == 0)
            return new("uac", title, Level.Warn, Tr.T("Admins are elevated without any prompt", "يتم رفع الصلاحيات دون أي تنبيه"), Tr.T("Set UAC back to the default level.", "أعد UAC إلى المستوى الافتراضي."), "least-privilege-principle-practical");
        return new("uac", title, Level.Ok, Tr.T("Enabled", "مفعّل"), "", "least-privilege-principle-practical");
    }

    static HealthItem BitLocker()
    {
        var title = Tr.T("Drive encryption (BitLocker)", "تشفير القرص (BitLocker)");
        var sys = Environment.GetEnvironmentVariable("SystemDrive") ?? "C:";
        var vols = Wmi(@"root\CIMV2\Security\MicrosoftVolumeEncryption", $"SELECT ProtectionStatus FROM Win32_EncryptableVolume WHERE DriveLetter='{sys}'");
        if (vols.Count == 0)
            return new("bitlocker", title, Level.Unknown, IsAdmin() ? Tr.T("BitLocker is not available on this edition/device", "BitLocker غير متاح على هذا الإصدار أو الجهاز")
                : Tr.T("Run as administrator to read BitLocker status", "شغّل البرنامج كمسؤول لقراءة حالة BitLocker"), "", "bitlocker-disk-encryption-basics");
        int status = Convert.ToInt32(vols[0]["ProtectionStatus"] ?? 0);
        return status == 1
            ? new("bitlocker", title, Level.Ok, Tr.T($"{sys} is encrypted and protected", $"القرص {sys} مشفر ومحمي"), Tr.T("Make sure the recovery key is backed up.", "تأكد من حفظ مفتاح الاسترداد."), "bitlocker-disk-encryption-basics")
            : new("bitlocker", title, Level.Warn, Tr.T($"{sys} is not protected", $"القرص {sys} غير محمي"), Tr.T("A stolen laptop exposes every file. Turn on BitLocker or Device Encryption.", "سرقة الجهاز تكشف كل الملفات. فعّل BitLocker أو تشفير الجهاز."), "bitlocker-disk-encryption-basics");
    }

    static HealthItem Smb1()
    {
        var title = "SMBv1";
        var start = Reg(Registry.LocalMachine, @"SYSTEM\CurrentControlSet\Services\mrxsmb10", "Start");
        var server = Reg(Registry.LocalMachine, @"SYSTEM\CurrentControlSet\Services\LanmanServer\Parameters", "SMB1");
        bool client = start != null && Convert.ToInt32(start) != 4;
        bool srv = server != null && Convert.ToInt32(server) != 0 && client;
        return client || srv
            ? new("smb1", title, Level.Bad, Tr.T("The obsolete SMBv1 protocol is installed", "بروتوكول SMBv1 القديم مثبت"), Tr.T("Remove the \"SMB 1.0/CIFS File Sharing Support\" Windows feature unless an old device truly needs it.", "أزل ميزة «SMB 1.0/CIFS File Sharing Support» إلا إذا احتاجها جهاز قديم فعلًا."), "")
            : new("smb1", title, Level.Ok, Tr.T("Not installed", "غير مثبت"), "", "");
    }

    static HealthItem Rdp()
    {
        var title = Tr.T("Remote Desktop", "سطح المكتب البعيد");
        bool enabled = Convert.ToInt32(Reg(Registry.LocalMachine, @"SYSTEM\CurrentControlSet\Control\Terminal Server", "fDenyTSConnections") ?? 1) == 0;
        if (!enabled) return new("rdp", title, Level.Ok, Tr.T("Disabled", "معطل"), "", "secure-rdp-brute-force-protection");
        bool nla = Convert.ToInt32(Reg(Registry.LocalMachine, @"SYSTEM\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp", "UserAuthentication") ?? 0) == 1;
        return nla
            ? new("rdp", title, Level.Warn, Tr.T("Enabled, with Network Level Authentication", "مفعّل مع مصادقة مستوى الشبكة (NLA)"), Tr.T("Never expose RDP directly to the internet; use a VPN.", "لا تعرّض RDP للإنترنت مباشرة؛ استخدم VPN."), "secure-rdp-brute-force-protection")
            : new("rdp", title, Level.Bad, Tr.T("Enabled WITHOUT Network Level Authentication", "مفعّل بدون مصادقة مستوى الشبكة"), Tr.T("Turn on NLA or disable Remote Desktop.", "فعّل NLA أو عطّل سطح المكتب البعيد."), "secure-rdp-brute-force-protection");
    }

    static HealthItem SecureBoot()
    {
        var v = Reg(Registry.LocalMachine, @"SYSTEM\CurrentControlSet\Control\SecureBoot\State", "UEFISecureBootEnabled");
        var title = "Secure Boot";
        return v is null ? new("secureboot", title, Level.Warn, Tr.T("Not supported or legacy BIOS mode", "غير مدعوم أو وضع BIOS القديم"), Tr.T("Use UEFI mode with Secure Boot when the hardware allows.", "استخدم وضع UEFI مع Secure Boot إن سمح الجهاز."), "")
            : Convert.ToInt32(v) == 1 ? new("secureboot", title, Level.Ok, Tr.T("On", "مفعّل"), "", "")
            : new("secureboot", title, Level.Warn, Tr.T("Off", "متوقف"), Tr.T("Enable Secure Boot in the UEFI settings to block boot-level malware.", "فعّل Secure Boot من إعدادات UEFI لمنع برمجيات الإقلاع الخبيثة."), "");
    }

    public static List<string> StartupEntries()
    {
        var list = new List<string>();
        foreach (var (hive, label) in new[] { (Registry.CurrentUser, "HKCU"), (Registry.LocalMachine, "HKLM") })
        {
            try
            {
                using var k = hive.OpenSubKey(@"Software\Microsoft\Windows\CurrentVersion\Run");
                if (k != null) list.AddRange(k.GetValueNames().Select(n => $"{label}\\Run: {n}"));
            }
            catch { }
        }
        foreach (var f in new[] { Environment.GetFolderPath(Environment.SpecialFolder.Startup), Environment.GetFolderPath(Environment.SpecialFolder.CommonStartup) })
            try { if (Directory.Exists(f)) list.AddRange(Directory.GetFiles(f).Where(x => !x.EndsWith("desktop.ini", StringComparison.OrdinalIgnoreCase)).Select(x => $"Startup: {Path.GetFileName(x)}")); } catch { }
        return list;
    }

    static HealthItem Startup()
    {
        var e = StartupEntries();
        return new("startup", Tr.T("Startup programs", "برامج بدء التشغيل"), e.Count > 15 ? Level.Warn : Level.Info,
            Tr.T($"{e.Count} entries: ", $"{e.Count} عنصر: ") + string.Join(", ", e.Take(12).Select(x => x.Split(": ").Last())) + (e.Count > 12 ? " …" : ""),
            e.Count > 15 ? Tr.T("Review unknown entries in Task Manager → Startup apps.", "راجع العناصر غير المعروفة في إدارة المهام ← تطبيقات بدء التشغيل.") : "", "");
    }

    static HealthItem AdminUse() => IsAdmin()
        ? new("admin", Tr.T("Daily account", "الحساب اليومي"), Level.Info, Tr.T("This app is running with administrator rights", "هذا البرنامج يعمل بصلاحيات المسؤول"), "", "least-privilege-principle-practical")
        : new("admin", Tr.T("Daily account", "الحساب اليومي"), Level.Info, Tr.T("Running as a standard user (good practice)", "يعمل كمستخدم عادي (ممارسة جيدة)"), "", "least-privilege-principle-practical");
}
