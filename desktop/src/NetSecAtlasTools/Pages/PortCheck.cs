using System.Windows;
using System.Windows.Controls;
using NetSecAtlas.Core;
using NetSecAtlas.Ui;
using NetSecAtlasTools;

namespace PortCheck;

public sealed class PortCheckPage : ToolPage
{
    List<PortEntry> _all = new();
    string _filter = "";
    int _view; // 0 listening, 1 established
    string _remoteHost = "netsecatlas.com", _remotePorts = "80, 443, 22, 3389";
    List<string[]> _remote = new();
    string _lookup = "";

    protected override async Task OnDemoAsync()
    {
        _remoteHost = "netsecatlas.com"; _remotePorts = "443, 80"; _lookup = "rdp";
        Refresh();
        await TestRemoteAsync();
    }

    UIElement ReferenceCard()
    {
        var q = U.Input(_lookup).Aid("lookup-input"); q.Width = 220;
        q.TextChanged += (_, _) => _lookup = q.Text;
        q.KeyDown += (_, e) => { if (e.Key == System.Windows.Input.Key.Enter) Rebuild(); };
        var rows = CommonPorts.Search(_lookup).Select(p => new[] { p.Port.ToString(), p.Protocol, p.Name, p.Description, KnownPorts.IsRisky(p.Port) ? Tr.T("limit exposure", "قلّل التعرّض") : "" });
        return U.Card(U.Stack(U.H(Tr.T("Common ports reference", "مرجع المنافذ الشائعة")),
            U.Row(q, U.Btn(Tr.T("Search", "ابحث"), Rebuild).Aid("lookup-run")),
            U.Table(new[] { Tr.T("Port", "المنفذ"), Tr.T("Protocol", "البروتوكول"), Tr.T("Service", "الخدمة"), Tr.T("Description", "الوصف"), Tr.T("Note", "ملاحظة") }, rows, 220).Aid("lookup-result")));
    }

    public PortCheckPage() : base("PortCheck", "Ports & Services", "المنافذ والخدمات",
        "What is listening on this PC, which program owns it, and can you reach ports on another host.", "ما الذي يستمع على جهازك، وأي برنامج يملكه، وهل تصل إلى منافذ جهاز آخر.", "port-checker", 1100, 760)
    {
        Loaded += (_, _) => Refresh();
    }

    void Refresh()
    {
        try { _all = Native.Read(); SetStatus(Tr.T($"{_all.Count} sockets read at {DateTime.Now:HH:mm:ss}.", $"تمت قراءة {_all.Count} منفذ الساعة {DateTime.Now:HH:mm:ss}.")); }
        catch (Exception ex) { SetStatus(ex.Message); }
        Rebuild();
    }

    protected override UIElement BuildBody()
    {
        var filter = U.Input(_filter); filter.Width = 220;
        filter.TextChanged += (_, _) => { _filter = filter.Text; };
        var view = new ComboBox { Width = 200, Margin = new Thickness(0, 0, 8, 8), SelectedIndex = _view };
        view.Items.Add(Tr.T("Listening (TCP + UDP)", "المستمعة (TCP + UDP)")); view.Items.Add(Tr.T("Established connections", "الاتصالات القائمة"));
        view.SelectionChanged += (_, _) => { _view = view.SelectedIndex; Rebuild(); };

        IEnumerable<PortEntry> rows = _view == 0 ? _all.Where(p => p.State == "LISTEN" || p.Protocol.StartsWith("UDP")) : _all.Where(p => p.State == "ESTABLISHED");
        if (_filter.Length > 0) rows = rows.Where(p => p.Process.Contains(_filter, StringComparison.OrdinalIgnoreCase) || p.LocalPort.ToString() == _filter || p.RemoteAddress.Contains(_filter) || p.Service.Contains(_filter, StringComparison.OrdinalIgnoreCase));
        var list = rows.OrderBy(p => p.LocalPort).ToList();
        var risky = list.Where(p => p.State == "LISTEN" && p.ExposedToAll && KnownPorts.IsRisky(p.LocalPort)).Select(p => $"{p.LocalPort} ({p.Service})").Distinct().ToList();

        var host = U.Input(_remoteHost); host.Width = 220; host.TextChanged += (_, _) => _remoteHost = host.Text;
        var ports = U.Input(_remotePorts); ports.Width = 220; ports.TextChanged += (_, _) => _remotePorts = ports.Text;

        var s = U.Stack(
            U.Card(U.Stack(
                U.Row(view, filter, U.Btn(Tr.T("Filter", "تصفية"), Rebuild), U.Btn(Tr.T("Refresh", "تحديث"), Refresh, true),
                      U.Btn(Tr.T("Export CSV…", "تصدير CSV…"), () => U.SaveText(this, KnownPorts.ToCsv(list), $"ports-{Environment.MachineName}-{DateTime.Now:yyyyMMdd-HHmm}.csv", "CSV (*.csv)|*.csv"))),
                risky.Count > 0 ? U.FindingRow(Level.Warn, Tr.T("Sensitive services listening on all interfaces", "خدمات حساسة تستمع على كل الواجهات"), string.Join(", ", risky) + Tr.T(" — make sure the firewall limits who can reach them.", " — تأكد أن الجدار الناري يحدد من يصل إليها.")) : new TextBlock(),
                U.Table(new[] { Tr.T("Protocol", "البروتوكول"), Tr.T("Local address", "العنوان المحلي"), Tr.T("Port", "المنفذ"), Tr.T("Remote", "البعيد"), Tr.T("State", "الحالة"), "PID", Tr.T("Process", "العملية"), Tr.T("Service", "الخدمة") },
                    list.Select(p => new[] { p.Protocol, p.LocalAddress, p.LocalPort.ToString(), p.RemotePort == 0 ? "" : $"{p.RemoteAddress}:{p.RemotePort}", p.State, p.Pid.ToString(), p.Process, p.Service }), 330))),
            U.Card(U.Stack(U.H(Tr.T("Test ports on another host", "اختبر منافذ جهاز آخر")),
                U.Row(host, ports, U.AsyncBtn(Tr.T("Test", "اختبر"), TestRemoteAsync, true).Aid("run")),
                U.P(Tr.T("Ports: comma-separated or a range like 8000-8010 (max 1024). Use only on systems you are allowed to test.", "المنافذ: مفصولة بفواصل أو مدى مثل 8000-8010 (بحد أقصى 1024). استخدمه فقط على أنظمة مسموح لك باختبارها."), U.Muted),
                _remote.Count == 0 ? new TextBlock() : U.Table(new[] { Tr.T("Host", "الجهاز"), Tr.T("Port", "المنفذ"), Tr.T("Result", "النتيجة"), Tr.T("Service", "الخدمة") }, _remote).Aid("result"))),
            ReferenceCard(),
            U.Row(U.Link(Tr.T("Common ports cheat sheet", "مرجع المنافذ الشائعة"), Links.Article("common-network-ports-cheat-sheet"))));
        return U.Scroll(s);
    }

    async Task TestRemoteAsync()
    {
        var targets = KnownPorts.ParseTargets(_remotePorts, _remoteHost.Trim());
        using var gate = new SemaphoreSlim(32);
        var res = await Task.WhenAll(targets.Select(async t =>
        {
            await gate.WaitAsync();
            try { var r = await NetSecAtlas.Core.NetDoctor.TcpAsync(t.host, t.port, 3000); return new[] { t.host, t.port.ToString(), r.ok ? Tr.T($"open ({r.ms:N0} ms)", $"مفتوح ({r.ms:N0} ms)") : r.error, KnownPorts.Describe(t.port) }; }
            finally { gate.Release(); }
        }));
        _remote = res.ToList(); Rebuild();
    }
}
