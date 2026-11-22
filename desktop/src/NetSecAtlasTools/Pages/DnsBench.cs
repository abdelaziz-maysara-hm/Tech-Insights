using System.Net;
using System.Net.NetworkInformation;
using System.Windows;
using System.Windows.Controls;
using NetSecAtlas.Core;
using NetSecAtlas.Ui;
using NetSecAtlasTools;

namespace DnsBench;

public sealed class DnsBenchPage : ToolPage
{
    string _custom = "";
    string _rounds = "10";
    List<ResolverResult> _results = new();

    public DnsBenchPage() : base("DnsBench", "DNS Benchmark", "مقارنة خوادم DNS",
        "Measures how fast DNS servers answer from your own connection, cached and uncached.", "يقيس سرعة استجابة خوادم DNS من اتصالك أنت، للأسماء المخزنة وغير المخزنة.", "dns-benchmark", 1060, 740) { }

    protected override async Task OnDemoAsync() { _rounds = "5"; Rebuild(); await RunAsync(); }

    static IEnumerable<Resolver> SystemResolvers() => NetworkInterface.GetAllNetworkInterfaces()
        .Where(n => n.OperationalStatus == OperationalStatus.Up && n.NetworkInterfaceType != NetworkInterfaceType.Loopback)
        .SelectMany(n => n.GetIPProperties().DnsAddresses).Where(a => a.AddressFamily == System.Net.Sockets.AddressFamily.InterNetwork)
        .Select(a => a.ToString()).Distinct().Select(a => new Resolver(Tr.T("Current (system)", "الحالي (النظام)"), a));

    protected override UIElement BuildBody()
    {
        var custom = U.Input(_custom); custom.Width = 260; custom.TextChanged += (_, _) => _custom = custom.Text;
        var rounds = U.Input(_rounds); rounds.Width = 60; rounds.TextChanged += (_, _) => _rounds = rounds.Text;
        var s = U.Stack(U.Card(U.Stack(
            U.P(Tr.T("Tests your current DNS servers plus well-known public resolvers. Sends ordinary DNS queries over UDP port 53 only.",
                     "يختبر خوادم DNS الحالية مع خوادم عامة معروفة. يرسل استعلامات DNS عادية عبر منفذ UDP 53 فقط.")),
            U.Row(new TextBlock { Text = Tr.T("Extra servers (comma-separated IPs):", "خوادم إضافية (عناوين مفصولة بفواصل):"), VerticalAlignment = VerticalAlignment.Center, Margin = new Thickness(0, 0, 8, 8) }, custom,
                  new TextBlock { Text = Tr.T("Rounds:", "الجولات:"), VerticalAlignment = VerticalAlignment.Center, Margin = new Thickness(0, 0, 8, 8) }, rounds,
                  U.AsyncBtn(Tr.T("Start benchmark", "ابدأ المقارنة"), RunAsync, true).Aid("run")))));
        if (_results.Count > 0)
        {
            var ranked = DnsBenchmark.Rank(_results).ToList();
            var best = ranked[0];
            s.Children.Add(U.FindingRow(Level.Ok, Tr.T($"Fastest reliable for you: {best.Resolver.Name} ({best.Resolver.Address})", $"الأسرع والأكثر ثباتًا لك: {best.Resolver.Name} ({best.Resolver.Address})"),
                Tr.T("Speed is only one factor: also consider privacy policy and filtering features. Change DNS in your router to cover every device.", "السرعة عامل واحد فقط: راعِ أيضًا سياسة الخصوصية وميزات الفلترة. غيّر DNS في الراوتر ليشمل كل الأجهزة.")));
            s.Children.Add(U.Table(new[] { "#", Tr.T("Resolver", "الخادم"), "IP", Tr.T("Cached median", "الوسيط (مخزن)"), Tr.T("Uncached median", "الوسيط (غير مخزن)"), Tr.T("Max", "الأقصى"), Tr.T("Loss", "الفقد") },
                ranked.Select((r, i) => new[] { (i + 1).ToString(), r.Resolver.Name, r.Resolver.Address, Ms(r.Cached.Median), Ms(r.Uncached.Median), Ms(r.Cached.Max), $"{(r.Cached.LossPercent + r.Uncached.LossPercent) / 2:N0}%" })));
            s.Children.Add(U.Row(U.Btn(Tr.T("Export CSV…", "تصدير CSV…"), () => U.SaveText(this, Csv.Build(new[] { "resolver", "ip", "cached_median_ms", "uncached_median_ms", "cached_max_ms", "loss_pct" },
                    ranked.Select(r => new[] { r.Resolver.Name, r.Resolver.Address, Ms(r.Cached.Median), Ms(r.Uncached.Median), Ms(r.Cached.Max), ((r.Cached.LossPercent + r.Uncached.LossPercent) / 2).ToString("N0") })),
                    $"dns-benchmark-{DateTime.Now:yyyyMMdd-HHmm}.csv", "CSV (*.csv)|*.csv")),
                U.Link(Tr.T("DNS troubleshooting with nslookup and dig", "تشخيص DNS باستخدام nslookup وdig"), Links.Article("dns-troubleshooting-nslookup-dig"))));
        }
        return U.Scroll(s);
    }

    static string Ms(double? v) => v is null ? "—" : $"{v:N1} ms";

    async Task RunAsync()
    {
        int rounds = int.TryParse(_rounds, out var r) ? Math.Clamp(r, 3, 50) : 10;
        var list = SystemResolvers().Concat(DnsBenchmark.PublicResolvers).ToList();
        foreach (var c in _custom.Split(',', ';', ' ').Select(x => x.Trim()).Where(x => IPAddress.TryParse(x, out _))) list.Add(new(Tr.T("Custom", "مخصص"), c));
        list = list.GroupBy(x => x.Address).Select(g => g.First()).ToList();
        _results.Clear();
        int done = 0;
        foreach (var res in list)
        {
            SetStatus(Tr.T($"Testing {res.Name} ({res.Address})… {done}/{list.Count}", $"اختبار {res.Name} ({res.Address})… {done}/{list.Count}"));
            _results.Add(await DnsBenchmark.RunAsync(res, rounds));
            done++; Rebuild();
        }
        SetStatus(Tr.T($"Finished {list.Count} resolvers.", $"انتهى اختبار {list.Count} خادمًا."));
    }
}
