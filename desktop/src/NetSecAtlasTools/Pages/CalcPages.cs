using System.Windows;
using System.Windows.Controls;
using NetSecAtlas.Core;
using NetSecAtlas.Ui;

namespace NetSecAtlasTools.Pages;

/// <summary>Base for the quick offline calculators that came from NetSecAtlasTools 1.x: input → button → text result.</summary>
public abstract class CalcPage : ToolPage
{
    protected string Input1 = "", Input2 = "", Output = "";
    protected readonly string Sample1, Sample2;

    protected CalcPage(string id, string titleEn, string titleAr, string tagEn, string tagAr, string sample1, string sample2 = "")
        : base(id, titleEn, titleAr, tagEn, tagAr, "") { Sample1 = sample1; Sample2 = sample2; }

    protected abstract string Label1 { get; }
    protected virtual string? Label2 => null;
    protected virtual bool Multiline2 => false;
    protected virtual string RunText => Tr.T("Calculate", "احسب");
    protected abstract string Compute(string a, string b);
    protected virtual IEnumerable<UIElement> ExtraButtons() => Array.Empty<UIElement>();
    protected virtual UIElement? Notes() => null;

    protected override Task OnDemoAsync() { Input1 = Sample1; Input2 = Sample2; Run(); return Task.CompletedTask; }

    protected void Run() => Run(Compute);

    protected void Run(Func<string, string, string> f)
    {
        try { Output = f(Input1, Input2); SetStatus(Tr.T("Done.", "تم.")); }
        catch (Exception ex) when (ex is FormatException or ArgumentException or OverflowException) { Output = "⚠ " + ex.Message; SetStatus(ex.Message); }
        Rebuild();
    }

    protected override UIElement BuildBody()
    {
        var in1 = U.Input(Input1, mono: true).Aid("input"); in1.Width = 420; in1.HorizontalAlignment = HorizontalAlignment.Left;
        in1.TextChanged += (_, _) => Input1 = in1.Text;
        in1.KeyDown += (_, e) => { if (e.Key == System.Windows.Input.Key.Enter && Label2 is null) Run(); };
        var form = U.Stack(U.P(Label1, U.Muted), in1);
        if (Label2 is { } l2)
        {
            var in2 = U.Input(Input2, multiline: Multiline2, height: 130, mono: true).Aid("input2"); in2.Width = 420; in2.HorizontalAlignment = HorizontalAlignment.Left;
            in2.TextChanged += (_, _) => Input2 = in2.Text;
            form.Children.Add(U.P(l2, U.Muted)); form.Children.Add(in2);
        }
        var buttons = U.Row(U.Btn(RunText, Run, true).Aid("run"));
        foreach (var b in ExtraButtons()) buttons.Children.Add(b);
        buttons.Children.Add(U.Btn(Tr.T("Copy result", "نسخ النتيجة"), () => U.Copy(Output)).Aid("copy"));
        form.Children.Add(buttons);
        var s = U.Stack(U.Card(form), U.Card(U.Stack(U.H(Tr.T("Result", "النتيجة")), U.Output(Output, 220))));
        if (Notes() is { } n) s.Children.Add(n);
        return U.Scroll(s);
    }
}

public sealed class SubnetPage : CalcPage
{
    public SubnetPage() : base("subnet", "Subnet Calculator", "حاسبة الشبكات الفرعية",
        "Network, mask, wildcard, broadcast and usable range for any IPv4 CIDR.", "الشبكة والقناع وWildcard والبث ونطاق العناوين لأي CIDR.", "192.168.10.77/26") { }
    protected override string Label1 => Tr.T("IPv4 address with prefix or mask (192.168.1.10/24 or 192.168.1.10/255.255.255.0)", "عنوان IPv4 مع البادئة أو القناع (192.168.1.10/24 أو 192.168.1.10/255.255.255.0)");
    protected override string Compute(string a, string b) => SubnetCalculator.Calculate(a).ToString();
}

public sealed class VlsmPage : CalcPage
{
    public VlsmPage() : base("vlsm", "VLSM Planner", "مخطط VLSM",
        "Split one block into right-sized subnets, largest first.", "قسّم شبكة واحدة إلى شبكات فرعية بالحجم المناسب، الأكبر أولًا.", "10.10.0.0/22", "Users 300\nServers 60\nVoIP 100\nWi-Fi guests 50\nLinks 2") { }
    protected override string Label1 => Tr.T("Parent block (CIDR)", "الشبكة الأم (CIDR)");
    protected override string? Label2 => Tr.T("One segment per line: name and number of hosts", "شبكة في كل سطر: الاسم وعدد الأجهزة");
    protected override bool Multiline2 => true;
    protected override string Compute(string a, string b)
    {
        var rows = VlsmCalculator.Plan(a, VlsmCalculator.ParseRequests(b));
        var lines = rows.Select(r => $"{r.Name,-14} {r.Network + "/" + r.Prefix,-19} {r.FirstUsable + " - " + r.LastUsable,-34} {Tr.T("bcast", "بث")} {r.Broadcast,-16} {Tr.T("hosts", "أجهزة")} {r.Hosts}/{r.Capacity}");
        return string.Join("\n", lines);
    }
}

public sealed class RangePage : CalcPage
{
    public RangePage() : base("range", "Range → CIDR", "تحويل المدى إلى CIDR",
        "Turn an IP range into the fewest CIDR blocks (for firewall rules and ACLs).", "حوّل مدى عناوين إلى أقل عدد من كتل CIDR (لقواعد الجدار الناري وACL).", "192.168.1.10 - 192.168.1.100") { }
    protected override string Label1 => Tr.T("Range (start - end) or a CIDR", "المدى (البداية - النهاية) أو CIDR");
    protected override string RunText => Tr.T("Convert", "حوّل");
    protected override string Compute(string a, string b) => RangeToCidr.Convert(a);
}

public sealed class IpConvertPage : CalcPage
{
    public IpConvertPage() : base("ipconvert", "IP Converter", "محوّل عناوين IP",
        "Dotted IPv4 ⇄ decimal, hex and binary.", "تحويل IPv4 بين الصيغة المنقوطة والعشري والست عشري والثنائي.", "10.20.30.40") { }
    protected override string Label1 => Tr.T("Dotted IP, decimal or 0x hex", "IP منقوط أو رقم عشري أو 0x ست عشري");
    protected override string RunText => Tr.T("Convert", "حوّل");
    protected override string Compute(string a, string b) => IpConverter.Convert(a);
}

public sealed class MacPage : CalcPage
{
    public MacPage() : base("mac", "MAC Vendor Lookup", "معرفة مصنّع MAC",
        "Which company made a network card, from its MAC address. Works offline.", "معرفة الشركة المصنّعة لكارت الشبكة من عنوان MAC. يعمل بدون إنترنت.", "00:50:56:C0:00:08") { }
    protected override string Label1 => Tr.T("MAC address (any format: 00-14-22-.., 0014.22aa.bbcc, 001422AABBCC)", "عنوان MAC (بأي صيغة: 00-14-22-.. أو 0014.22aa.bbcc أو 001422AABBCC)");
    protected override string RunText => Tr.T("Look up", "ابحث");
    protected override string Compute(string a, string b) => MacLookup.Lookup(a);
    protected override UIElement? Notes() => U.P(Tr.T($"Built-in list of {MacLookup.Count} common vendor prefixes (OUI). Randomised (private) MAC addresses on phones and laptops will show as unknown.",
        $"قائمة مدمجة من {MacLookup.Count} بادئة شائعة (OUI). عناوين MAC العشوائية (الخاصة) في الهواتف والحواسيب تظهر كمصنّع غير معروف."), U.Muted);
}

public sealed class TimestampPage : CalcPage
{
    public TimestampPage() : base("timestamp", "Timestamp Converter", "محوّل الطوابع الزمنية",
        "Unix time (seconds or milliseconds) ⇄ readable date, for logs.", "تحويل وقت Unix (ثوانٍ أو ميلي ثانية) إلى تاريخ مقروء والعكس، لقراءة السجلات.", "1763740800") { }
    protected override string Label1 => Tr.T("Unix timestamp, or a date like 2026-11-22 14:00", "طابع Unix أو تاريخ مثل 2026-11-22 14:00");
    protected override string RunText => Tr.T("Convert", "حوّل");
    protected override string Compute(string a, string b) => TimestampTool.Convert(a);
    protected override IEnumerable<UIElement> ExtraButtons() => new[] { U.Btn(Tr.T("Now", "الآن"), () => { Input1 = DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString(); Run(); }).Aid("now") };
}

public sealed class EncodingPage : CalcPage
{
    public EncodingPage() : base("encoding", "Encode / Decode", "ترميز وفك ترميز",
        "Base64, Hex and URL encoding for text (UTF-8).", "ترميز Base64 وHex وURL للنصوص (UTF-8).", "NetSec Atlas — نت سك أطلس") { }
    protected override string Label1 => Tr.T("Text", "النص");
    protected override string RunText => Tr.T("Base64 encode", "ترميز Base64");
    protected override string Compute(string a, string b) => EncodingTool.ToBase64(a);
    protected override IEnumerable<UIElement> ExtraButtons() => new UIElement[]
    {
        U.Btn(Tr.T("Base64 decode", "فك Base64"), () => Run((a, _) => EncodingTool.FromBase64(a))).Aid("b64-decode"),
        U.Btn(Tr.T("Hex encode", "ترميز Hex"), () => Run((a, _) => EncodingTool.ToHex(a))).Aid("hex-encode"),
        U.Btn(Tr.T("Hex decode", "فك Hex"), () => Run((a, _) => EncodingTool.FromHex(a))).Aid("hex-decode"),
        U.Btn(Tr.T("URL encode", "ترميز URL"), () => Run((a, _) => EncodingTool.UrlEncode(a))).Aid("url-encode"),
        U.Btn(Tr.T("URL decode", "فك URL"), () => Run((a, _) => EncodingTool.UrlDecode(a))).Aid("url-decode"),
        U.Btn(Tr.T("Use result as input", "استخدم النتيجة كمدخل"), () => { Input1 = Output; Rebuild(); }).Aid("swap"),
    };
}

/// <summary>Start page: every tool grouped by category.</summary>
public sealed class HomePage : ToolPage
{
    public HomePage() : base("home", "All tools", "كل الأدوات",
        "Free network and security tools for Windows in one program. No install, no telemetry.", "أدوات مجانية للشبكات والأمان على ويندوز في برنامج واحد. بدون تثبيت وبدون قياسات استخدام.", "") { }

    protected override UIElement BuildBody()
    {
        var s = new StackPanel();
        var pages = MainWindow.Current?.Pages ?? Array.Empty<ToolPage>();
        foreach (var g in pages.Where(p => p.Category.Length > 0).GroupBy(p => p.Category))
        {
            s.Children.Add(U.H(ToolRegistry.CategoryName(g.Key), 15));
            var wrap = new WrapPanel { Margin = new Thickness(0, 0, 0, 10) };
            foreach (var p in g)
            {
                var page = p;
                var card = new Button
                {
                    Width = 250, MinHeight = 92, Margin = new Thickness(0, 0, 10, 10), Padding = new Thickness(12, 8, 12, 8), Background = System.Windows.Media.Brushes.White,
                    BorderBrush = U.Line, HorizontalContentAlignment = HorizontalAlignment.Stretch, VerticalContentAlignment = VerticalAlignment.Top, Cursor = System.Windows.Input.Cursors.Hand,
                    Content = U.Stack(new TextBlock { Text = page.PageTitle, FontWeight = FontWeights.SemiBold, Foreground = U.Brand, TextWrapping = TextWrapping.Wrap },
                                      new TextBlock { Text = page.Tagline, Foreground = U.Muted, FontSize = 12.5, TextWrapping = TextWrapping.Wrap, Margin = new Thickness(0, 4, 0, 0) }),
                }.Aid("open-" + page.Id);
                card.Click += (_, _) => MainWindow.Current?.Navigate(page);
                wrap.Children.Add(card);
            }
            s.Children.Add(wrap);
        }
        s.Children.Add(U.Link(Tr.T("Guides and articles on netsecatlas.com", "الأدلة والمقالات على netsecatlas.com"), $"{Links.Site}/{Tr.Lang}/tools"));
        return U.Scroll(s);
    }
}
