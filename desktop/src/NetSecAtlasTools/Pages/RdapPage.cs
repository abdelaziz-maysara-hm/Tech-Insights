using System.Windows;
using System.Windows.Controls;
using NetSecAtlas.Core;
using NetSecAtlas.Ui;

namespace NetSecAtlasTools.Pages;

public sealed class RdapPage : ToolPage
{
    string _query = "example.com", _output = "";

    public RdapPage() : base("rdap", "RDAP Lookup", "بحث RDAP",
        "Look up a domain or IP in the public RDAP directories (the modern replacement for WHOIS). No API key.",
        "ابحث عن نطاق أو عنوان IP في أدلة RDAP العامة (البديل الحديث لـ WHOIS). بدون مفتاح API.", "") { }

    protected override async Task OnDemoAsync()
    {
        _query = "example.com";
        await LookupAsync();
    }

    protected override UIElement BuildBody()
    {
        var box = U.Input(_query, mono: true).Aid("input"); box.Width = 360;
        box.TextChanged += (_, _) => _query = box.Text;
        box.KeyDown += (_, e) => { if (e.Key == System.Windows.Input.Key.Enter) _ = LookupAsync(); };
        return U.Scroll(U.Stack(
            U.Card(U.Stack(
                U.P(Tr.T("Uses https://rdap.org/ (which redirects to the registry that owns the name or address). Nothing is stored by this program.",
                         "يستخدم https://rdap.org/ (ويحوّل إلى السجل المسؤول عن الاسم أو العنوان). لا يحفظ هذا البرنامج شيئًا."), U.Muted),
                U.Row(box, U.AsyncBtn(Tr.T("Look up", "ابحث"), LookupAsync, true).Aid("run"),
                      U.Btn(Tr.T("Copy result", "نسخ النتيجة"), () => U.Copy(_output))))),
            U.Card(U.Stack(U.H(Tr.T("Result", "النتيجة")), U.Output(_output, 320)))));
    }

    async Task LookupAsync()
    {
        try
        {
            var url = Rdap.RequestUrl(_query);
            SetStatus(Tr.T("Querying RDAP…", "جارٍ الاستعلام من RDAP…"));
            string body;
            try { body = await NetHttp.GetStringAsync(url); }
            catch (Exception ex) when (IsSampleFallback(_query))
            {
                body = SampleExampleCom;
                SetStatus(Tr.T("Live RDAP was unavailable; showing a built-in example.com record so the tool can still be tried.",
                    "تعذّر الوصول إلى RDAP؛ يُعرض سجل example.com مدمج لتجربة الأداة."));
                var parsed = Rdap.Parse(_query, body);
                _output = parsed.Text + Environment.NewLine + Environment.NewLine + Tr.T($"(offline sample; {ex.GetBaseException().Message})", $"(مثال دون اتصال؛ {ex.GetBaseException().Message})");
                Rebuild();
                return;
            }
            var r = Rdap.Parse(_query, body);
            _output = r.Ok ? r.Text : r.Error;
            SetStatus(r.Ok ? Tr.T("Done.", "تم.") : r.Error);
        }
        catch (Exception ex)
        {
            _output = "⚠ " + ex.GetBaseException().Message;
            SetStatus(ex.GetBaseException().Message);
        }
        Rebuild();
    }

    static bool IsSampleFallback(string q) => q.Trim().Equals("example.com", StringComparison.OrdinalIgnoreCase);

    const string SampleExampleCom = """
{"objectClassName":"domain","ldhName":"example.com","handle":"EXAMPLE-COM","status":["active"],
 "events":[{"eventAction":"registration","eventDate":"1995-08-14T04:00:00Z"},{"eventAction":"expiration","eventDate":"2027-08-13T04:00:00Z"}],
 "nameservers":[{"ldhName":"a.iana-servers.net"},{"ldhName":"b.iana-servers.net"}],
 "entities":[{"roles":["registrar"],"vcardArray":["vcard",[["version",{},"text","4.0"],["fn",{},"text","RESERVED-Internet Assigned Numbers Authority"]]]}]}
""";
}
