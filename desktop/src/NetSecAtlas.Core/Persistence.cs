using System.Runtime.Versioning;
using System.Text;
using Microsoft.Win32;

namespace NetSecAtlas.Core;

public sealed record PersistenceEntry(string Source, string Name, string Command, string Location);

/// <summary>Read-only view of common Windows startup locations (Run keys and Startup folders). Does not add, change or delete anything.</summary>
public static class Persistence
{
    public static List<PersistenceEntry> Read()
    {
        var list = new List<PersistenceEntry>();
        if (!OperatingSystem.IsWindows()) return list;
        ReadRun(list, Registry.CurrentUser, @"Software\Microsoft\Windows\CurrentVersion\Run", Tr.T("Current user Run", "تشغيل المستخدم الحالي"));
        ReadRun(list, Registry.CurrentUser, @"Software\Microsoft\Windows\CurrentVersion\RunOnce", Tr.T("Current user RunOnce", "تشغيل مرة واحدة (المستخدم)"));
        ReadRun(list, Registry.LocalMachine, @"Software\Microsoft\Windows\CurrentVersion\Run", Tr.T("Local machine Run", "تشغيل الجهاز"));
        ReadRun(list, Registry.LocalMachine, @"Software\Microsoft\Windows\CurrentVersion\RunOnce", Tr.T("Local machine RunOnce", "تشغيل مرة واحدة (الجهاز)"));
        ReadRun(list, Registry.LocalMachine, @"Software\WOW6432Node\Microsoft\Windows\CurrentVersion\Run", Tr.T("Local machine Run (32-bit)", "تشغيل الجهاز (32-بت)"));
        ReadFolder(list, Environment.GetFolderPath(Environment.SpecialFolder.Startup), Tr.T("User Startup folder", "مجلد بدء تشغيل المستخدم"));
        ReadFolder(list, Environment.GetFolderPath(Environment.SpecialFolder.CommonStartup), Tr.T("All-users Startup folder", "مجلد بدء التشغيل لكل المستخدمين"));
        return list
            .OrderBy(e => e.Source, StringComparer.OrdinalIgnoreCase)
            .ThenBy(e => e.Name, StringComparer.OrdinalIgnoreCase)
            .ToList();
    }

    public static string ToText(IEnumerable<PersistenceEntry> entries)
    {
        var list = entries.ToList();
        var sb = new StringBuilder();
        sb.AppendLine(Tr.T($"Startup and persistence entries: {list.Count} (read-only).", $"عناصر بدء التشغيل والثبات: {list.Count} (للقراءة فقط)."));
        string? last = null;
        foreach (var e in list)
        {
            if (e.Source != last) { sb.AppendLine().AppendLine(e.Source); last = e.Source; }
            sb.AppendLine($"  {e.Name}: {e.Command}");
        }
        return sb.ToString().TrimEnd();
    }

    [SupportedOSPlatform("windows")]
    static void ReadRun(List<PersistenceEntry> list, RegistryKey root, string path, string source)
    {
        try
        {
            using var key = root.OpenSubKey(path);
            if (key is null) return;
            foreach (var name in key.GetValueNames())
            {
                var value = key.GetValue(name)?.ToString() ?? "";
                if (string.IsNullOrWhiteSpace(name) && string.IsNullOrWhiteSpace(value)) continue;
                list.Add(new PersistenceEntry(source, string.IsNullOrEmpty(name) ? "(default)" : name, value, root.Name + "\\" + path));
            }
        }
        catch { /* no permission or missing hive — skip that source */ }
    }

    static void ReadFolder(List<PersistenceEntry> list, string folder, string source)
    {
        if (string.IsNullOrWhiteSpace(folder) || !Directory.Exists(folder)) return;
        try
        {
            foreach (var file in Directory.EnumerateFileSystemEntries(folder))
            {
                var name = Path.GetFileName(file);
                if (name.Equals("desktop.ini", StringComparison.OrdinalIgnoreCase)) continue;
                list.Add(new PersistenceEntry(source, name, file, folder));
            }
        }
        catch { }
    }
}
