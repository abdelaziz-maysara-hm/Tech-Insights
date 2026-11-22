using System.Net.NetworkInformation;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;
using System.Windows.Shapes;
using NetSecAtlas.Core;
using NetSecAtlas.Ui;
using NetSecAtlasTools;

namespace PingMonitor;

public sealed class PingMonitorPage : ToolPage
{
    string _hosts = "gateway, 1.1.1.1, netsecatlas.com";
    string _interval = "1";
    readonly Dictionary<string, List<(DateTime t, double? ms)>> _data = new();
    CancellationTokenSource? _cts;

    public PingMonitorPage() : base("PingMonitor", "Ping Monitor", "مراقب Ping",
        "Watch latency, jitter and packet loss over time to prove where a connection drops.", "راقب زمن الاستجابة والتذبذب وفقد الحزم مع الوقت لتثبت أين ينقطع الاتصال.", "ping-monitor", 1100, 780) { }

    protected override async Task OnDemoAsync() { Start(); await Task.Delay(TimeSpan.FromSeconds(10)); _cts?.Cancel(); Rebuild(); }

    static string Gateway() => NetSecAtlas.Core.NetDoctor.GetAdapters().SelectMany(a => a.Gateways).FirstOrDefault() ?? "";

    void Start()
    {
        _cts?.Cancel(); _cts = new CancellationTokenSource(); var ct = _cts.Token;
        _data.Clear();
        var hosts = _hosts.Split(',', ';', '\n').Select(h => h.Trim()).Where(h => h.Length > 0).Select(h => h.Equals("gateway", StringComparison.OrdinalIgnoreCase) ? Gateway() : h).Where(h => h.Length > 0).Distinct().Take(8).ToList();
        foreach (var h in hosts) _data[h] = new();
        double sec = double.TryParse(_interval, out var s) ? Math.Clamp(s, 0.5, 60) : 1;
        foreach (var h in hosts) _ = Loop(h, sec, ct);
        _ = Redraw(ct);
        SetStatus(Tr.T("Monitoring… press Stop to end.", "جارٍ المراقبة… اضغط إيقاف للإنهاء."));
    }

    async Task Loop(string host, double sec, CancellationToken ct)
    {
        using var p = new Ping();
        while (!ct.IsCancellationRequested)
        {
            var started = DateTime.Now;
            double? ms = null;
            try { var r = await p.SendPingAsync(host, 2000); if (r.Status == IPStatus.Success) ms = r.RoundtripTime; } catch { }
            lock (_data) { if (_data.TryGetValue(host, out var l)) { l.Add((started, ms)); if (l.Count > 7200) l.RemoveAt(0); } }
            var wait = TimeSpan.FromSeconds(sec) - (DateTime.Now - started);
            if (wait > TimeSpan.Zero) try { await Task.Delay(wait, ct); } catch (OperationCanceledException) { }
        }
    }

    async Task Redraw(CancellationToken ct)
    {
        while (!ct.IsCancellationRequested) { if (_live != null) _live.Content = LiveView(); try { await Task.Delay(1000, ct); } catch (OperationCanceledException) { } }
    }

    static readonly Brush[] Colors = { U.Accent, U.InfoBrush, U.WarnBrush, U.BadBrush, Brushes.MediumPurple, Brushes.SaddleBrown, Brushes.DeepPink, Brushes.Teal };

    protected override UIElement BuildBody()
    {
        var hosts = U.Input(_hosts); hosts.Width = 380; hosts.TextChanged += (_, _) => _hosts = hosts.Text;
        var iv = U.Input(_interval); iv.Width = 50; iv.TextChanged += (_, _) => _interval = iv.Text;
        var s = U.Stack(U.Card(U.Stack(
            U.P(Tr.T("Hosts (comma-separated, \"gateway\" = your router):", "الأجهزة (مفصولة بفواصل، «gateway» = الراوتر):")),
            U.Row(hosts, new TextBlock { Text = Tr.T("Interval (s):", "الفاصل (ث):"), VerticalAlignment = VerticalAlignment.Center, Margin = new Thickness(0, 0, 6, 8) }, iv,
                U.Btn(Tr.T("Start", "ابدأ"), Start, true).Aid("run"), U.Btn(Tr.T("Stop", "إيقاف"), () => { _cts?.Cancel(); SetStatus(Tr.T("Stopped.", "توقفت المراقبة.")); }),
                U.Btn(Tr.T("Export CSV…", "تصدير CSV…"), Export)))));
        _live = new ContentControl { Content = LiveView() };
        s.Children.Add(_live);
        return U.Scroll(s);
    }

    ContentControl? _live;

    UIElement LiveView()
    {
        var s = new StackPanel();
        List<(string host, List<(DateTime t, double? ms)> l)> snap;
        lock (_data) snap = _data.Select(k => (k.Key, k.Value.ToList())).ToList();
        if (snap.Count > 0)
        {
            s.Children.Add(U.Card(Chart(snap)));
            s.Children.Add(U.Table(new[] { Tr.T("Host", "الجهاز"), Tr.T("Sent", "المرسل"), Tr.T("Loss", "الفقد"), Tr.T("Min", "الأدنى"), Tr.T("Avg", "المتوسط"), "P95", Tr.T("Max", "الأقصى"), Tr.T("Jitter", "التذبذب") },
                snap.Select(x => { var st = LatencyStats.From(x.l.Select(v => v.ms).ToList());
                    return new[] { x.host, st.Sent.ToString(), $"{st.LossPercent:N1}%", Ms(st.Min), Ms(st.Avg), Ms(st.P95), Ms(st.Max), Ms(st.Jitter) }; })));
            s.Children.Add(U.Row(U.Link(Tr.T("Network troubleshooting commands (PowerShell)", "أوامر تشخيص الشبكة (PowerShell)"), Links.Article("powershell-network-troubleshooting-commands"))));
        }
        return s;
    }

    static string Ms(double? v) => v is null ? "—" : $"{v:N0} ms";

    UIElement Chart(List<(string host, List<(DateTime t, double? ms)> l)> snap)
    {
        const double W = 1000, H = 220; const int N = 120;
        var c = new Canvas { Width = W, Height = H, Background = Brushes.White, ClipToBounds = true, FlowDirection = FlowDirection.LeftToRight };
        double max = Math.Max(20, snap.SelectMany(x => x.l.TakeLast(N)).Where(v => v.ms.HasValue).Select(v => v.ms!.Value).DefaultIfEmpty(20).Max() * 1.2);
        for (int g = 0; g <= 4; g++)
        {
            double y = H - g * H / 4;
            c.Children.Add(new Line { X1 = 0, X2 = W, Y1 = y, Y2 = y, Stroke = U.Line, StrokeThickness = 1 });
            var lbl = new TextBlock { Text = $"{max * g / 4:N0} ms", FontSize = 10, Foreground = U.Muted }; Canvas.SetLeft(lbl, 2); Canvas.SetTop(lbl, Math.Max(0, y - 14)); c.Children.Add(lbl);
        }
        var legend = new StackPanel { Orientation = Orientation.Horizontal, Margin = new Thickness(0, 6, 0, 0) };
        for (int k = 0; k < snap.Count; k++)
        {
            var pts = snap[k].l.TakeLast(N).ToList();
            var line = new Polyline { Stroke = Colors[k % Colors.Length], StrokeThickness = 2 };
            for (int i = 0; i < pts.Count; i++)
            {
                double x = W - (pts.Count - 1 - i) * (W / (N - 1));
                if (pts[i].ms is { } ms) line.Points.Add(new Point(x, H - ms / max * H));
                else
                {
                    c.Children.Add(new Line { X1 = x, X2 = x, Y1 = 0, Y2 = H, Stroke = U.BadBrush, StrokeThickness = 1, Opacity = 0.5 });
                    if (line.Points.Count > 0) { c.Children.Add(line); line = new Polyline { Stroke = Colors[k % Colors.Length], StrokeThickness = 2 }; }
                }
            }
            c.Children.Add(line);
            legend.Children.Add(new Rectangle { Width = 12, Height = 12, Fill = Colors[k % Colors.Length], Margin = new Thickness(0, 0, 4, 0) });
            legend.Children.Add(new TextBlock { Text = snap[k].host, Margin = new Thickness(0, 0, 14, 0) });
        }
        legend.Children.Add(new TextBlock { Text = Tr.T("red line = lost packet", "الخط الأحمر = حزمة مفقودة"), Foreground = U.BadBrush });
        return U.Stack(new Viewbox { Child = c, Stretch = Stretch.Uniform, MaxHeight = 260 }, legend);
    }

    void Export()
    {
        List<string[]> rows;
        lock (_data) rows = _data.SelectMany(k => k.Value.Select(v => new[] { v.t.ToString("yyyy-MM-dd HH:mm:ss.fff"), k.Key, v.ms?.ToString() ?? "" })).OrderBy(r => r[0]).ToList();
        U.SaveText(this, Csv.Build(new[] { "time_local", "host", "rtt_ms" }, rows), $"ping-monitor-{DateTime.Now:yyyyMMdd-HHmm}.csv", "CSV (*.csv)|*.csv");
    }
}
