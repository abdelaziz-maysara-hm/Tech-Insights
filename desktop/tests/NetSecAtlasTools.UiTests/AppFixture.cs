using System.Diagnostics;
using FlaUI.Core;
using FlaUI.Core.AutomationElements;
using FlaUI.Core.Conditions;
using FlaUI.Core.Tools;
using FlaUI.UIA3;

[assembly: CollectionBehavior(DisableTestParallelization = true)]

namespace NetSecAtlasTools.UiTests;

/// <summary>Starts the real published exe once (English, --test mode) and drives it through UI Automation.</summary>
public sealed class AppFixture : IDisposable
{
    public static string ExePath => Environment.GetEnvironmentVariable("NSA_EXE") is { Length: > 0 } p ? Path.GetFullPath(p)
        : throw new InvalidOperationException("Set NSA_EXE to the published NetSecAtlasTools.exe");
    public static string ShotDir => Path.GetFullPath(Environment.GetEnvironmentVariable("NSA_SHOTS") is { Length: > 0 } d ? d : "screenshots");

    public Application App { get; }
    public UIA3Automation Automation { get; } = new();
    public Window Main { get; private set; }
    public ConditionFactory Cf => Automation.ConditionFactory;

    public AppFixture()
    {
        Directory.CreateDirectory(ShotDir);
        var log = Path.Combine(Path.GetTempPath(), "NetSecAtlasTools.log");
        if (File.Exists(log)) File.Delete(log);
        var psi = new ProcessStartInfo(ExePath, $"--test --lang en --screenshot-dir \"{ShotDir}\"") { UseShellExecute = false };
        App = Application.Launch(psi);
        Main = App.GetMainWindow(Automation, TimeSpan.FromSeconds(60)) ?? throw new Exception("Main window did not appear within 60 s");
        Main.SetForeground();
    }

    public AutomationElement? Find(string id, AutomationElement? root = null) => (root ?? Main).FindFirstDescendant(Cf.ByAutomationId(id));

    public AutomationElement Wait(string id, double seconds = 20)
    {
        var r = Retry.WhileNull(() => Find(id), TimeSpan.FromSeconds(seconds), TimeSpan.FromMilliseconds(200));
        return r.Result ?? throw new Exception($"Element '{id}' not found after {seconds} s");
    }

    public string State => Find("state")?.Name ?? "";
    public string Status => Find("status")?.Name ?? "";
    public string ToolTitle => Find("tool-title")?.Name ?? "";

    public void Open(string toolId)
    {
        var item = Wait("nav-" + toolId);
        item.AsListBoxItem().Select();
        Retry.WhileFalse(() => Find("page-" + toolId) != null, TimeSpan.FromSeconds(20), TimeSpan.FromMilliseconds(200));
        Assert.NotNull(Find("page-" + toolId));
    }

    /// <summary>Clicks "Try a sample" and waits for the state field to leave "busy".</summary>
    public string RunSample(double timeoutSeconds)
    {
        Wait("sample").AsButton().Invoke();
        Retry.WhileFalse(() => State == "busy" || State == "done" || State.StartsWith("error"), TimeSpan.FromSeconds(5), TimeSpan.FromMilliseconds(100));
        Retry.WhileTrue(() => State == "busy", TimeSpan.FromSeconds(timeoutSeconds), TimeSpan.FromMilliseconds(250));
        return State;
    }

    public void SetText(string id, string text) => Wait(id).AsTextBox().Text = text;
    public void Click(string id) => Wait(id).AsButton().Invoke();
    public string ResultText(string id = "result")
    {
        string v = "";
        Retry.WhileTrue(() => string.IsNullOrEmpty(v = Wait(id).AsTextBox().Text), TimeSpan.FromSeconds(10), TimeSpan.FromMilliseconds(200));
        return v;
    }

    /// <summary>Extra screenshot through UI Automation (the app also saves its own rendering after each sample).</summary>
    public void Capture(string name)
    {
        try { FlaUI.Core.Capturing.Capture.Element(Main).ToFile(Path.Combine(ShotDir, "uia", name + ".png")); } catch { }
    }

    public bool Alive => !App.HasExited;

    public void Dispose()
    {
        try { App.Close(); } catch { }
        try { if (!App.HasExited) App.Kill(); } catch { }
        Automation.Dispose();
    }
}

[CollectionDefinition("app")]
public sealed class AppCollection : ICollectionFixture<AppFixture> { }
