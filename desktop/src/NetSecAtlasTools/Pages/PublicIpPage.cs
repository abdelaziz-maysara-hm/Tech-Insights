using System.Windows;
using System.Windows.Controls;
using NetSecAtlas.Core;
using NetSecAtlas.Ui;

namespace NetSecAtlasTools.Pages;

public sealed class PublicIpPage : ToolPage
{
    string _output = "";

    public PublicIpPage() : base("publicip", "Public IP & Location", "عنوان IP العام والموقع",
        "See the public IP this PC uses to reach the internet, and a rough location from a public lookup. No API key.",
        "اعرض عنوان IP العام الذي يخرج به هذا الجهاز إلى الإنترنت، وموقعًا تقريبيًا من خدمة عامة. بدون مفتاح API.", "") { }

    protected override Task OnDemoAsync() => LookupAsync();

    protected override UIElement BuildBody()
    {
        return U.Scroll(U.Stack(
            U.Card(U.Stack(
                U.P(Tr.T("The IP is read from a public HTTPS service (ipify, with fallbacks). Geolocation comes from ipwho.is and can be approximate or unavailable. No account and no API key.",
                         "يُقرأ العنوان من خدمة HTTPS عامة (ipify مع بدائل). الموقع الجغرافي من ipwho.is وقد يكون تقريبيًا أو غير متاح. بلا حساب وبلا مفتاح API."), U.Muted),
                U.Row(U.AsyncBtn(Tr.T("Look up", "استعلام"), LookupAsync, true).Aid("run"),
                      U.Btn(Tr.T("Copy result", "نسخ النتيجة"), () => U.Copy(_output))))),
            U.Card(U.Stack(U.H(Tr.T("Result", "النتيجة")), U.Output(_output, 220)))));
    }

    async Task LookupAsync()
    {
        string? ip = null, ipSource = "", error = null;
        foreach (var url in PublicIp.IpEndpoints)
        {
            try
            {
                var body = (await NetHttp.GetStringAsync(url)).Trim();
                if (PublicIp.TryParseIp(body, out var parsed)) { ip = parsed; ipSource = url; break; }
            }
            catch (Exception ex) { error = ex.GetBaseException().Message; }
        }
        if (ip is null)
        {
            _output = "⚠ " + (error ?? Tr.T("Could not reach a public-IP service.", "تعذّر الوصول إلى خدمة عنوان IP العام."));
            SetStatus(_output.TrimStart('⚠', ' ').Trim());
            Rebuild();
            return;
        }
        try
        {
            var geo = await NetHttp.GetStringAsync(PublicIp.GeoUrl(ip));
            var info = PublicIp.ParseGeo(ip, geo, ipSource + " + ipwho.is");
            _output = info.Text;
        }
        catch (Exception ex)
        {
            _output = PublicIp.Format(ip, "", "", "", "", "", "", ipSource)
                + Environment.NewLine + Tr.T("Geolocation was unavailable: ", "تعذّر الموقع الجغرافي: ") + ex.GetBaseException().Message;
        }
        SetStatus(Tr.T("Done.", "تم."));
        Rebuild();
    }
}
