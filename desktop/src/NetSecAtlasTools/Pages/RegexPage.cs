using System.Windows;
using System.Windows.Controls;
using NetSecAtlas.Core;
using NetSecAtlas.Ui;

namespace NetSecAtlasTools.Pages;

public sealed class RegexPage : ToolPage
{
    string _pattern = "", _input = "", _output = "";
    bool _ignoreCase = true, _multiline, _singleline;

    public RegexPage() : base("regex", "Regex Tester", "مختبر التعبيرات المنتظمة",
        "Try a regular expression against text on this PC. Matching stops after two seconds if the pattern is too expensive.",
        "جرّب تعبيرًا منتظمًا على نص على جهازك. يتوقف البحث بعد ثانيتين إذا كان التعبير ثقيلًا.", "") { }

    protected override Task OnDemoAsync()
    {
        _pattern = @"\b(?<ip>(?:\d{1,3}\.){3}\d{1,3})\b";
        _input = "gateway 192.168.1.1 and DNS 10.0.0.5, plus not-an-ip 9999";
        _ignoreCase = true;
        Run();
        return Task.CompletedTask;
    }

    void Run()
    {
        var r = RegexTool.Run(_pattern, _input, _ignoreCase, _multiline, _singleline);
        _output = r.Text;
        SetStatus(r.Ok ? (r.Count == 0 ? Tr.T("No matches.", "لا تطابق.") : Tr.T($"{r.Count} match(es).", $"عدد التطابقات: {r.Count}.")) : r.Error);
        Rebuild();
    }

    protected override UIElement BuildBody()
    {
        var pat = U.Input(_pattern, mono: true).Aid("input"); pat.Width = 560;
        pat.TextChanged += (_, _) => _pattern = pat.Text;
        var body = U.Input(_input, multiline: true, height: 140, mono: true).Aid("input2");
        body.TextChanged += (_, _) => _input = body.Text;
        var ic = new CheckBox { Content = Tr.T("Ignore case", "تجاهل حالة الأحرف"), IsChecked = _ignoreCase, Margin = new Thickness(0, 0, 16, 8) };
        var ml = new CheckBox { Content = "Multiline (^ $)", IsChecked = _multiline, Margin = new Thickness(0, 0, 16, 8) };
        var sl = new CheckBox { Content = "Singleline (dot matches newline)", IsChecked = _singleline, Margin = new Thickness(0, 0, 16, 8) };
        ic.Checked += (_, _) => _ignoreCase = true; ic.Unchecked += (_, _) => _ignoreCase = false;
        ml.Checked += (_, _) => _multiline = true; ml.Unchecked += (_, _) => _multiline = false;
        sl.Checked += (_, _) => _singleline = true; sl.Unchecked += (_, _) => _singleline = false;
        return U.Scroll(U.Stack(
            U.Card(U.Stack(
                U.P(Tr.T("Pattern", "التعبير"), U.Muted), pat,
                U.P(Tr.T("Text", "النص"), U.Muted), body,
                U.Row(ic, ml, sl),
                U.Row(U.Btn(Tr.T("Test", "اختبر"), Run, true).Aid("run"),
                      U.Btn(Tr.T("Copy result", "نسخ النتيجة"), () => U.Copy(_output))))),
            U.Card(U.Stack(U.H(Tr.T("Result", "النتيجة")), U.Output(_output, 240)))));
    }
}
