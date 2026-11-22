using System.Windows;
using System.Windows.Controls;
using Microsoft.Win32;
using NetSecAtlas.Core;
using NetSecAtlas.Ui;
using NetSecAtlasTools;

namespace CertExpiry;

public sealed class CertExpiryPage : ToolPage
{
    string _targets = "netsecatlas.com\ngithub.com\nlearn.microsoft.com\nexpired.badssl.com\nwrong.host.badssl.com";
    List<CertResult> _results = new();

    public CertExpiryPage() : base("CertExpiry", "TLS Certificate Expiry Checker", "فاحص انتهاء شهادات TLS",
        "Check many HTTPS/TLS endpoints at once: days left, name match, chain and protocol.", "افحص عدة خوادم HTTPS/TLS دفعة واحدة: الأيام المتبقية ومطابقة الاسم والسلسلة والبروتوكول.", "tls-cert-expiry-checker", 1100, 740) { }

    protected override Task OnDemoAsync() => RunAsync();

    protected override UIElement BuildBody()
    {
        var box = U.Input(_targets, multiline: true, height: 120, mono: true); box.TextChanged += (_, _) => _targets = box.Text;
        var s = U.Stack(U.Card(U.Stack(
            U.P(Tr.T("One target per line: host, host:port or a URL. Lines starting with # are ignored. Only a TLS handshake is made; no data is sent.",
                     "هدف في كل سطر: اسم أو اسم:منفذ أو رابط. الأسطر التي تبدأ بـ # تُتجاهل. يتم فقط إجراء مصافحة TLS دون إرسال بيانات.")),
            box,
            U.Row(U.AsyncBtn(Tr.T("Check all", "افحص الكل"), RunAsync, true).Aid("run"),
                  U.Btn(Tr.T("Import list…", "استيراد قائمة…"), () => { var d = new OpenFileDialog { Filter = "Text/CSV|*.txt;*.csv|All|*.*" }; if (d.ShowDialog(this) == true) { _targets = File.ReadAllText(d.FileName); Rebuild(); } }),
                  U.Btn(Tr.T("Export CSV…", "تصدير CSV…"), () => U.SaveText(this, CertChecker.ToCsv(_results), $"certificates-{DateTime.Now:yyyyMMdd}.csv", "CSV (*.csv)|*.csv"))))));
        if (_results.Count > 0)
        {
            int bad = _results.Count(r => r.Status == Level.Bad), warn = _results.Count(r => r.Status == Level.Warn);
            s.Children.Add(U.Row(U.Badge(Level.Bad, Tr.T($"{bad} problem(s)", $"{bad} مشكلة")), U.Badge(Level.Warn, Tr.T($"{warn} expiring ≤30 days", $"{warn} تنتهي خلال 30 يومًا")),
                U.Badge(Level.Ok, Tr.T($"{_results.Count(r => r.Status == Level.Ok)} OK", $"{_results.Count(r => r.Status == Level.Ok)} سليمة"))));
            s.Children.Add(U.Table(new[] { Tr.T("Status", "الحالة"), Tr.T("Target", "الهدف"), Tr.T("Days left", "الأيام المتبقية"), Tr.T("Expires (UTC)", "ينتهي (UTC)"),
                    Tr.T("Name OK", "الاسم مطابق"), Tr.T("Chain", "السلسلة"), Tr.T("Issuer", "المُصدر"), Tr.T("Protocol / error", "البروتوكول / الخطأ") },
                _results.OrderBy(r => r.Status switch { Level.Bad => 0, Level.Unknown => 1, Level.Warn => 2, _ => 3 }).ThenBy(r => r.DaysLeft ?? -9999)
                    .Select(r => new[] { U.LevelText(r.Status), r.Target.ToString(), r.DaysLeft?.ToString() ?? "", r.NotAfter?.ToString("yyyy-MM-dd") ?? "",
                        r.Connected ? (r.NameMatches ? "✔" : "✘") : "", r.ChainStatus, r.Issuer, r.Connected ? r.Protocol : r.Error })));
            s.Children.Add(U.Row(U.Link(Tr.T("Fixing certificate errors", "إصلاح أخطاء الشهادات"), Links.Article("tls-certificate-errors-troubleshooting")), new TextBlock { Width = 20 },
                U.Link(Tr.T("Setting up expiry monitoring", "إعداد مراقبة انتهاء الشهادات"), Links.Article("certificate-expiry-monitoring"))));
        }
        return U.Scroll(s);
    }

    async Task RunAsync()
    {
        var targets = CertChecker.ParseTargets(_targets);
        SetStatus(Tr.T($"Checking {targets.Count} target(s)…", $"فحص {targets.Count} هدف…"));
        using var gate = new SemaphoreSlim(8);
        var tasks = targets.Select(async t => { await gate.WaitAsync(); try { return await CertChecker.CheckAsync(t, TimeSpan.FromSeconds(10)); } finally { gate.Release(); } });
        _results = (await Task.WhenAll(tasks)).ToList();
        Rebuild();
        SetStatus(Tr.T($"Done: {_results.Count} checked at {DateTime.Now:HH:mm}.", $"تم: فُحص {_results.Count} الساعة {DateTime.Now:HH:mm}."));
    }
}
