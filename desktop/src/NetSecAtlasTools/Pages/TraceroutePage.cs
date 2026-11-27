using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;
using System.Windows.Shapes;
using NetSecAtlas.Core;
using NetSecAtlas.Ui;
using TraceHop = NetSecAtlas.Core.NetDoctor.TraceHop;

namespace NetSecAtlasTools.Pages;

public sealed class TraceroutePage : ToolPage
{
    string _host = "1.1.1.1", _output = "";
    int _maxHops = 20;
    List<TraceHop> _hops = new();

    public TraceroutePage() : base("traceroute", "Traceroute", "تتبع المسار",
        "See the hops a packet takes to a host, with times. Uses ICMP like the Windows tracert command.",
        "اعرض القفزات التي يسلكها الرزمة حتى المضيف، مع الأزمنة. يستخدم ICMP مثل أمر tracert في ويندوز.", "") { }

    protected override async Task OnDemoAsync()
    {
        _host = "1.1.1.1"; _maxHops = 15;
        await RunAsync();
    }

    protected override UIElement BuildBody()
    {
        var host = U.Input(_host, mono: true).Aid("input"); host.Width = 280;
        host.TextChanged += (_, _) => _host = host.Text;
        host.KeyDown += (_, e) => { if (e.Key == System.Windows.Input.Key.Enter) _ = RunAsync(); };
        var hopsBox = U.Input(_maxHops.ToString()); hopsBox.Width = 80;
        hopsBox.TextChanged += (_, _) => { if (int.TryParse(hopsBox.Text, out var n)) _maxHops = Math.Clamp(n, 1, 30); };

        var path = new WrapPanel { Margin = new Thickness(0, 0, 0, 8) };
        foreach (var h in _hops)
        {
            var color = h.Reached ? U.OkBrush : h.Address == "*" ? U.Muted : U.Accent;
            var cell = new Border
            {
                Background = Brushes.White, BorderBrush = color, BorderThickness = new Thickness(2), CornerRadius = new CornerRadius(8),
                Padding = new Thickness(10, 6, 10, 6), Margin = new Thickness(0, 0, 8, 8), MinWidth = 110,
            };
            cell.Child = new StackPanel
            {
                Children =
                {
                    new TextBlock { Text = $"#{h.Ttl}", FontWeight = FontWeights.SemiBold, Foreground = color, HorizontalAlignment = HorizontalAlignment.Center },
                    new TextBlock { Text = h.Address, FontFamily = new FontFamily("Cascadia Mono, Consolas"), HorizontalAlignment = HorizontalAlignment.Center },
                    new TextBlock { Text = h.RttMs is { } ms ? $"{ms} ms" : h.Status, Foreground = U.Muted, FontSize = 12, HorizontalAlignment = HorizontalAlignment.Center },
                },
            };
            path.Children.Add(cell);
        }

        return U.Scroll(U.Stack(
            U.Card(U.Stack(
                U.P(Tr.T("Some networks block ICMP, so hops may show as * or the trace may stop early. That is not a crash.",
                         "بعض الشبكات تحجب ICMP، فقد تظهر قفزات كـ * أو يتوقف التتبع مبكرًا. هذا ليس عطلًا."), U.Muted),
                U.Row(host, hopsBox, U.AsyncBtn(Tr.T("Trace", "تتبّع"), RunAsync, true).Aid("run"),
                      U.Btn(Tr.T("Copy result", "نسخ النتيجة"), () => U.Copy(_output))))),
            _hops.Count == 0 ? new TextBlock() : U.Card(U.Stack(U.H(Tr.T("Path", "المسار")), path)),
            U.Card(U.Stack(U.H(Tr.T("Result", "النتيجة")),
                _hops.Count == 0 ? U.Output(_output, 200)
                    : U.Table(new[] { "#", Tr.T("Address", "العنوان"), "ms", Tr.T("Status", "الحالة") },
                        _hops.Select(h => new[] { h.Ttl.ToString(), h.Address, h.RttMs?.ToString() ?? "", h.Status }), 260).Aid("result")))));
    }

    async Task RunAsync()
    {
        var host = _host.Trim();
        if (host.Length == 0) { _output = Tr.T("Enter a host or IP.", "أدخل مضيفًا أو عنوان IP."); SetStatus(_output); Rebuild(); return; }
        SetStatus(Tr.T("Tracing…", "جارٍ التتبع…"));
        try
        {
            _hops = await NetSecAtlas.Core.NetDoctor.TraceHopsAsync(host, _maxHops);
            _output = NetSecAtlas.Core.NetDoctor.FormatHops(_hops);
            SetStatus(_hops.Count == 0 ? Tr.T("No hops returned.", "لا قفزات.") : Tr.T($"Recorded {_hops.Count} hop(s).", $"سُجّلت {_hops.Count} قفزة."));
        }
        catch (Exception ex)
        {
            _hops = new();
            _output = "⚠ " + ex.GetBaseException().Message;
            SetStatus(ex.GetBaseException().Message);
        }
        Rebuild();
    }
}
