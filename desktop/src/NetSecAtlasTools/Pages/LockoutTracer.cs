using System.Diagnostics.Eventing.Reader;
using System.DirectoryServices.ActiveDirectory;
using System.Windows;
using System.Windows.Controls;
using NetSecAtlas.Core;
using NetSecAtlas.Ui;
using NetSecAtlasTools;

namespace LockoutTracer;

public sealed class LockoutTracerPage : ToolPage
{
    string _user = "", _hours = "24", _dcs = "";
    string? _pdc;
    List<AuthEvent> _events = new();
    List<string> _errors = new();
    bool _sample;

    public LockoutTracerPage() : base("LockoutTracer", "AD Lockout Tracer", "متتبع قفل حسابات AD",
        "Finds which device keeps locking an account, using events 4740, 4625, 4771 and 4776 on your domain controllers.",
        "يحدد الجهاز الذي يقفل الحساب باستخدام الأحداث 4740 و4625 و4771 و4776 على وحدات التحكم بالمجال.", "ad-lockout-tracer", 1080, 760) { }

    protected override Task OnDemoAsync()
    {
        _sample = true; _user = "j.smith"; _dcs = "DC01\nDC02"; _pdc = "DC01";
        string Ev(int id, string time, params (string k, string v)[] d) =>
            $"<Event xmlns='http://schemas.microsoft.com/win/2004/08/events/event'><System><EventID>{id}</EventID><TimeCreated SystemTime='{time}'/></System><EventData>{string.Concat(d.Select(x => $"<Data Name='{x.k}'>{x.v}</Data>"))}</EventData></Event>";
        _events = new()
        {
            LockoutAnalyzer.Parse(Ev(4740, "2026-11-19T08:14:03Z", ("TargetUserName", "j.smith"), ("TargetDomainName", "LAPTOP-HR07")), "DC01"),
            LockoutAnalyzer.Parse(Ev(4771, "2026-11-19T08:13:58Z", ("TargetUserName", "j.smith"), ("Status", "0x18"), ("IpAddress", "::ffff:10.20.4.57")), "DC02"),
            LockoutAnalyzer.Parse(Ev(4771, "2026-11-19T08:13:41Z", ("TargetUserName", "j.smith"), ("Status", "0x18"), ("IpAddress", "::ffff:10.20.4.57")), "DC02"),
            LockoutAnalyzer.Parse(Ev(4625, "2026-11-19T08:12:10Z", ("TargetUserName", "j.smith"), ("Status", "0xc000006d"), ("SubStatus", "0xc000006a"), ("WorkstationName", "LAPTOP-HR07"), ("IpAddress", "10.20.4.57")), "DC01"),
            LockoutAnalyzer.Parse(Ev(4776, "2026-11-19T07:55:00Z", ("TargetUserName", "j.smith"), ("Workstation", "PRINT-SRV02"), ("Status", "0xc000006a")), "DC01"),
        };
        Rebuild();
        SetStatus(Tr.T("Sample data shown.", "بيانات تجريبية معروضة."));
        return Task.CompletedTask;
    }

    protected override UIElement BuildBody()
    {
        var user = U.Input(_user); user.Width = 200; user.TextChanged += (_, _) => _user = user.Text;
        var hours = U.Input(_hours); hours.Width = 60; hours.TextChanged += (_, _) => _hours = hours.Text;
        var dcs = U.Input(_dcs, multiline: true, height: 70, mono: true); dcs.Width = 260; dcs.TextChanged += (_, _) => _dcs = dcs.Text;
        var form = new Grid();
        form.ColumnDefinitions.Add(new ColumnDefinition { Width = GridLength.Auto });
        form.ColumnDefinitions.Add(new ColumnDefinition { Width = GridLength.Auto });
        var left = U.Stack(U.P(Tr.T("Username (blank = all users):", "اسم المستخدم (فارغ = كل المستخدمين):")), user,
                           U.P(Tr.T("Look back (hours):", "الفترة (بالساعات):")), hours);
        var right = U.Stack(U.P(Tr.T("Domain controllers (one per line):", "وحدات التحكم بالمجال (واحدة في كل سطر):")), dcs,
                            _pdc != null ? U.P(Tr.T($"PDC emulator: {_pdc} (lockouts always reach it)", $"محاكي PDC: {_pdc} (يصل إليه كل قفل)"), U.Muted) : new TextBlock());
        right.Margin = new Thickness(24, 0, 0, 0);
        form.Children.Add(left); Grid.SetColumn(right, 1); form.Children.Add(right);

        var s = U.Stack(U.Card(U.Stack(form,
            U.Row(U.AsyncBtn(Tr.T("Find domain controllers", "اكتشف وحدات التحكم"), FindDcsAsync), U.AsyncBtn(Tr.T("Search events", "ابحث في الأحداث"), SearchAsync, true).Aid("run")),
            U.P(Tr.T("Needs a domain-joined PC and an account allowed to read the Security log on DCs (for example Event Log Readers). Read-only.",
                     "يحتاج جهازًا منضمًا للمجال وحسابًا مسموحًا له بقراءة سجل Security على وحدات التحكم (مثل مجموعة Event Log Readers). للقراءة فقط."), U.Muted))));

        if (_sample) s.Children.Add(U.FindingRow(Level.Info, Tr.T("Sample data", "بيانات تجريبية"), Tr.T("These rows are illustrative, from \"Try a sample\".", "هذه الصفوف توضيحية من «جرّب مثالًا».")));
        foreach (var e in _errors) s.Children.Add(U.FindingRow(Level.Warn, Tr.T("Could not read a DC", "تعذرت قراءة وحدة تحكم"), e));

        if (_events.Count > 0)
        {
            var ranked = LockoutAnalyzer.RankSources(_events);
            var top = ranked.FirstOrDefault();
            if (top.Source != null)
                s.Children.Add(U.Card(U.Stack(U.H(Tr.T($"Most likely source: {top.Source}", $"المصدر الأرجح: {top.Source}")),
                    U.P(Tr.T("Check that device for saved credentials, mapped drives, services or scheduled tasks using the old password, and phones syncing mail.",
                             "افحص هذا الجهاز بحثًا عن كلمات مرور محفوظة أو محركات معيّنة أو خدمات أو مهام مجدولة تستخدم كلمة المرور القديمة، والهواتف التي تزامن البريد.")),
                    U.Table(new[] { Tr.T("Source", "المصدر"), Tr.T("Failures", "مرات الفشل"), Tr.T("Named in a lockout (4740)", "مذكور في حدث قفل (4740)") },
                        ranked.Select(r => new[] { r.Source, r.Failures.ToString(), r.LockoutCaller ? Tr.T("Yes", "نعم") : "" })))));
            s.Children.Add(U.Card(U.Stack(U.H(Tr.T($"Events ({_events.Count})", $"الأحداث ({_events.Count})")),
                U.Table(new[] { Tr.T("Time", "الوقت"), "ID", "DC", Tr.T("User", "المستخدم"), Tr.T("Source", "المصدر"), Tr.T("Code", "الكود"), Tr.T("Meaning", "المعنى") },
                    _events.OrderByDescending(e => e.Time).Select(e => new[] { e.Time?.ToLocalTime().ToString("yyyy-MM-dd HH:mm:ss") ?? "", e.EventId.ToString(), e.Dc, e.User, e.Source, e.Code, e.Meaning }), 300),
                U.Row(U.Btn(Tr.T("Export CSV…", "تصدير CSV…"), () => U.SaveText(this, LockoutAnalyzer.ToCsv(_events), $"lockout-events-{DateTime.Now:yyyyMMdd-HHmm}.csv", "CSV (*.csv)|*.csv")),
                      U.Link(Tr.T("How to read these events", "كيف تقرأ هذه الأحداث"), Links.Article("ad-account-lockout-source-event-4740"))))));
        }
        return U.Scroll(s);
    }

    async Task FindDcsAsync()
    {
        SetStatus(Tr.T("Querying the domain…", "الاستعلام من المجال…"));
        try
        {
            var (dcs, pdc) = await Task.Run(() =>
            {
                using var d = Domain.GetCurrentDomain();
                return (d.DomainControllers.Cast<DomainController>().Select(x => x.Name).ToList(), d.PdcRoleOwner.Name);
            });
            _dcs = string.Join(Environment.NewLine, dcs.OrderBy(x => x == pdc ? 0 : 1)); _pdc = pdc;
            SetStatus(Tr.T($"{dcs.Count} domain controller(s) found.", $"تم العثور على {dcs.Count} وحدة تحكم."));
        }
        catch (Exception ex) { SetStatus(Tr.T("This PC is not in a domain or the domain is unreachable: ", "الجهاز غير منضم لمجال أو المجال غير متاح: ") + ex.Message); }
        Rebuild();
    }

    async Task SearchAsync()
    {
        _sample = false; _errors.Clear(); _events.Clear();
        var dcs = _dcs.Split('\n').Select(x => x.Trim()).Where(x => x.Length > 0).Distinct().ToList();
        if (dcs.Count == 0) { await FindDcsAsync(); dcs = _dcs.Split('\n').Select(x => x.Trim()).Where(x => x.Length > 0).ToList(); }
        if (dcs.Count == 0) return;
        int hours = int.TryParse(_hours, out var h) ? h : 24;
        var xpath = LockoutAnalyzer.BuildXPath(_user, hours);
        SetStatus(Tr.T($"Reading Security logs on {dcs.Count} DC(s)…", $"قراءة سجلات Security على {dcs.Count} وحدة تحكم…"));
        var tasks = dcs.Select(dc => Task.Run(() =>
        {
            var found = new List<AuthEvent>();
            try
            {
                using var session = new EventLogSession(dc);
                var q = new EventLogQuery("Security", PathType.LogName, xpath) { Session = session, ReverseDirection = true };
                using var reader = new EventLogReader(q);
                for (EventRecord? r = reader.ReadEvent(); r != null && found.Count < 5000; r = reader.ReadEvent())
                    using (r) found.Add(LockoutAnalyzer.Parse(r.ToXml(), dc));
                return (found, (string?)null);
            }
            catch (Exception ex) { return (found, $"{dc}: {ex.Message}"); }
        })).ToList();
        foreach (var (found, err) in await Task.WhenAll(tasks)) { _events.AddRange(found); if (err != null) _errors.Add(err); }
        Rebuild();
        SetStatus(Tr.T($"{_events.Count} event(s) found.", $"تم العثور على {_events.Count} حدث."));
    }
}
