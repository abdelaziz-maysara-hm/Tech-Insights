using System.Globalization;
using System.Windows;
using NetSecAtlas.Core;

namespace NetSecAtlas.Ui;

/// <summary>
/// Command line: [file] [--lang ar|en] [--tool id] [--demo] [--test] [--screenshot-dir dir] [--screenshot file --delay s]
/// --test turns error dialogs into status text (for UI automation); --screenshot-dir saves a PNG after every sample run.
/// </summary>
public static class AtlasApp
{
    public static string[] Args { get; private set; } = Array.Empty<string>();
    public static bool Demo { get; private set; }
    public static bool Test { get; private set; }
    public static string? ScreenshotDir { get; private set; }
    public static string? ScreenshotPath { get; private set; }
    public static string LogPath => Path.Combine(Path.GetTempPath(), "NetSecAtlasTools.log");

    public static string? Arg(string name)
    {
        int i = Array.IndexOf(Args, name);
        return i >= 0 && i + 1 < Args.Length ? Args[i + 1] : null;
    }

    public static void Log(string line)
    {
        try { File.AppendAllText(LogPath, $"{DateTime.Now:yyyy-MM-dd HH:mm:ss} {line}{Environment.NewLine}"); } catch { }
    }

    public static void Init(string[] args)
    {
        Args = args;
        var lang = Arg("--lang") ?? Settings.Load().Lang ?? (CultureInfo.CurrentUICulture.TwoLetterISOLanguageName == "ar" ? "ar" : "en");
        Tr.Ar = lang == "ar";
        Test = args.Contains("--test");
        ScreenshotDir = Arg("--screenshot-dir");
        ScreenshotPath = Arg("--screenshot");
        Demo = args.Contains("--demo") || Test || ScreenshotPath != null;
    }
}

/// <summary>Per-user settings (language only). Stored in %APPDATA%\NetSecAtlas\settings.txt; nothing else is saved.</summary>
public sealed class Settings
{
    public string? Lang { get; set; }
    static string FilePath => Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData), "NetSecAtlas", "settings.txt");
    public static Settings Load()
    {
        try { var s = File.Exists(FilePath) ? File.ReadAllText(FilePath).Trim() : ""; return new Settings { Lang = s is "ar" or "en" ? s : null }; }
        catch { return new Settings(); }
    }
    public void Save()
    {
        if (AtlasApp.Test) return;
        try { Directory.CreateDirectory(Path.GetDirectoryName(FilePath)!); File.WriteAllText(FilePath, Lang ?? ""); } catch { }
    }
}
