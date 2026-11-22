using System.Diagnostics;
using System.Windows;
using System.Windows.Controls;
using NetSecAtlas.Core;
using NetSecAtlas.Ui;
using NetSecAtlasTools;

namespace HealthCheck;

public sealed class HealthCheckPage : ToolPage
{
    List<HealthItem>? _items;

    public HealthCheckPage() : base("HealthCheck", "Security Health Check", "فحص صحة الأمان",
        "A read-only check of the Windows settings that matter most. Changes nothing.", "فحص للقراءة فقط لأهم إعدادات أمان ويندوز. لا يغيّر أي شيء.", "security-health-check")
    {
        Loaded += async (_, _) => { if (!AtlasApp.Demo) await RunAsync(); };
    }

    protected override Task OnDemoAsync() => RunAsync();

    async Task RunAsync()
    {
        SetStatus(Tr.T("Checking…", "جارٍ الفحص…"));
        _items = await Task.Run(Probes.RunAll);
        Rebuild();
        SetStatus(Tr.T($"Checked {_items.Count} items at {DateTime.Now:HH:mm}.", $"تم فحص {_items.Count} عنصرًا الساعة {DateTime.Now:HH:mm}."));
    }

    protected override UIElement BuildBody()
    {
        var s = new StackPanel();
        if (_items is null) { s.Children.Add(U.P(Tr.T("Checking…", "جارٍ الفحص…"))); return s; }
        int score = HealthScore.Compute(_items);
        var (lvl, label) = HealthScore.Grade(score);
        s.Children.Add(U.Card(U.Row(
            new TextBlock { Text = $"{score}", FontSize = 46, FontWeight = FontWeights.Bold, Foreground = U.LevelBrush(lvl), Margin = new Thickness(0, 0, 14, 0) }.Aid("result"),
            U.Stack(new TextBlock { Text = "/100", Foreground = U.Muted, FontSize = 18 }, U.Badge(lvl, label)),
            new TextBlock { Text = Tr.T("Score covers antivirus, firewall, updates, UAC, encryption, SMBv1, RDP, Secure Boot and Windows version. Unknown items are left out.",
                "تشمل النتيجة مضاد الفيروسات والجدار الناري والتحديثات وUAC والتشفير وSMBv1 وRDP وSecure Boot وإصدار ويندوز. العناصر غير المعروفة مستبعدة."),
                TextWrapping = TextWrapping.Wrap, MaxWidth = 520, Margin = new Thickness(18, 0, 0, 0), Foreground = U.Muted, VerticalAlignment = VerticalAlignment.Center })));
        var list = new StackPanel();
        foreach (var i in _items.OrderBy(i => i.Level switch { Level.Bad => 0, Level.Warn => 1, Level.Unknown => 2, Level.Ok => 3, _ => 4 }))
            list.Children.Add(U.FindingRow(i.Level, i.Title, i.Detail + (i.Advice.Length > 0 ? "\n→ " + i.Advice : ""),
                i.ArticleSlug.Length > 0 ? Tr.T("Read the guide", "اقرأ الدليل") : null, i.ArticleSlug.Length > 0 ? Links.Article(i.ArticleSlug) : null));
        s.Children.Add(U.Card(list));
        var actions = U.Row(U.AsyncBtn(Tr.T("Check again", "افحص مجددًا"), RunAsync, true).Aid("run"),
            U.Btn(Tr.T("Save report…", "حفظ التقرير…"), () => U.SaveText(this, HealthScore.ToText(_items, Environment.MachineName), $"health-{Environment.MachineName}-{DateTime.Now:yyyyMMdd}.txt")));
        if (!Probes.IsAdmin())
            actions.Children.Add(U.Btn(Tr.T("Run as administrator (for BitLocker)", "تشغيل كمسؤول (لقراءة BitLocker)"), () =>
            {
                try { Process.Start(new ProcessStartInfo(Environment.ProcessPath!, "--tool healthcheck") { UseShellExecute = true, Verb = "runas" }); Close(); } catch { }
            }));
        s.Children.Add(actions);
        return U.Scroll(s);
    }
}
