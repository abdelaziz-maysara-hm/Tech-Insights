using System.Windows;
using System.Windows.Controls;
using NetSecAtlas.Core;
using NetSecAtlas.Ui;
using NetSecAtlasTools;

namespace NetDoctor;

public sealed class NetDoctorPage : ToolPage
{
    string _target = "netsecatlas.com", _port = "443";
    bool _trace = true;
    NetReport? _report;

    public NetDoctorPage() : base("NetDoctor", "Network Troubleshooter", "مشخّص الشبكة",
        "Finds where the connection breaks: adapter, IP, gateway, DNS or the service.", "يحدد أين ينقطع الاتصال: الكرت أو العنوان أو البوابة أو DNS أو الخدمة.", "network-troubleshooter") { }

    protected override Task OnDemoAsync() => RunAsync();

    async Task RunAsync()
    {
        int port = int.TryParse(_port, out var p) && p is > 0 and < 65536 ? p : 443;
        _report = null; Rebuild();
        var prog = new Progress<string>(SetStatus);
        _report = await NetSecAtlas.Core.NetDoctor.RunAsync(_target.Trim(), port, _trace, prog);
        Rebuild();
        SetStatus(_report.Summary);
    }

    protected override UIElement BuildBody()
    {
        var target = U.Input(_target); target.Width = 300; target.TextChanged += (_, _) => _target = target.Text;
        var port = U.Input(_port); port.Width = 70; port.TextChanged += (_, _) => _port = port.Text;
        var trace = new CheckBox { Content = Tr.T("Trace route", "تتبع المسار"), IsChecked = _trace, VerticalAlignment = VerticalAlignment.Center, Margin = new Thickness(0, 0, 12, 8) };
        trace.Click += (_, _) => _trace = trace.IsChecked == true;
        var s = U.Stack(U.Card(U.Stack(
            U.P(Tr.T("Website or server to test (name or IP) and the TCP port of the service (443 for websites, 3389 for RDP, 445 for file shares):",
                     "الموقع أو الخادم المراد اختباره (اسم أو IP) ومنفذ TCP للخدمة (443 للمواقع، 3389 لـRDP، 445 لمشاركة الملفات):")),
            U.Row(target, port, trace, U.AsyncBtn(Tr.T("Diagnose", "شخّص"), RunAsync, true).Aid("run")))));
        if (_report != null)
        {
            var steps = new StackPanel();
            steps.Children.Add(U.H(_report.Summary, 16));
            foreach (var st in _report.Steps)
                steps.Children.Add(U.FindingRow(st.Level, st.Title, st.Detail + (st.Advice.Length > 0 ? "\n→ " + st.Advice : "")));
            s.Children.Add(U.Card(steps));
            s.Children.Add(U.Card(U.Stack(U.H(Tr.T("Adapters", "كروت الشبكة")), U.Table(
                new[] { Tr.T("Name", "الاسم"), "IPv4", Tr.T("Gateway", "البوابة"), "DNS", "DHCP", Tr.T("Speed", "السرعة") },
                _report.Adapters.Select(a => new[] { a.Name, string.Join(", ", a.IPv4), string.Join(", ", a.Gateways), string.Join(", ", a.Dns.Take(3)), a.Dhcp ? Tr.T("Yes", "نعم") : Tr.T("No", "لا"), $"{a.SpeedMbps} Mbps" })))));
            if (_report.Route.Count > 0)
            {
                var r = U.Input(string.Join(Environment.NewLine, _report.Route), multiline: true, height: 160, mono: true); r.IsReadOnly = true;
                s.Children.Add(U.Card(U.Stack(U.H(Tr.T("Route", "المسار")), r)));
            }
            s.Children.Add(U.Row(
                U.Btn(Tr.T("Save report…", "حفظ التقرير…"), () => U.SaveText(this, _report.ToText(), $"network-report-{DateTime.Now:yyyyMMdd-HHmm}.txt")),
                U.Btn(Tr.T("Copy report", "نسخ التقرير"), () => U.Copy(_report.ToText())),
                U.Link(Tr.T("PowerShell commands behind these checks", "أوامر PowerShell المقابلة لهذه الفحوص"), Links.Article("powershell-network-troubleshooting-commands"))));
        }
        return U.Scroll(s);
    }
}
