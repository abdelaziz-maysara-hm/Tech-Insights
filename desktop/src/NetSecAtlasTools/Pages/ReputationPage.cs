using System.Windows;
using System.Windows.Controls;
using Microsoft.Win32;
using NetSecAtlas.Core;
using NetSecAtlas.Ui;

namespace NetSecAtlasTools.Pages;

public sealed class ReputationPage : ToolPage
{
    string _hashOrUrl = "", _output = "";
    string? _file;

    public ReputationPage() : base("reputation", "File / URL Reputation", "سمعة ملف أو رابط",
        "Hash a file on this PC, then open public VirusTotal or urlscan pages in your browser. Nothing is uploaded from this program, and no API key is used.",
        "احسب بصمة الملف على جهازك، ثم افتح صفحات VirusTotal أو urlscan في المتصفح. لا يُرفع شيء من البرنامج ولا يُستخدم مفتاح API.", "") { }

    protected override async Task OnDemoAsync()
    {
        _hashOrUrl = "https://example.com/";
        if (Environment.ProcessPath is { } self && File.Exists(self))
        {
            await HashFileAsync(self);
            return;
        }
        _output = Reputation.ToText(null, _hashOrUrl);
        Rebuild();
    }

    protected override UIElement BuildBody()
    {
        var path = U.Input(_file ?? Tr.T("Optional: choose a file to hash locally…", "اختياري: اختر ملفًا لحساب بصمته محليًا…")); path.IsReadOnly = true; path.Width = 520;
        var input = U.Input(_hashOrUrl, mono: true).Aid("input"); input.Width = 520;
        input.TextChanged += (_, _) => _hashOrUrl = input.Text;
        return U.Scroll(U.Stack(
            U.Card(U.Stack(
                U.P(Tr.T("The file never leaves this PC. Links open the vendor's public page in your browser. Use only on files and URLs you are allowed to look up.",
                         "الملف لا يغادر جهازك. الروابط تفتح الصفحة العامة للخدمة في متصفحك. استخدمه فقط لملفات وروابط مسموح لك بفحصها."), U.Muted),
                U.Row(path, U.AsyncBtn(Tr.T("Browse…", "استعراض…"), BrowseAsync, true)),
                U.P(Tr.T("Or paste a hash (MD5 / SHA-1 / SHA-256) or a URL", "أو الصق بصمة (MD5 / SHA-1 / SHA-256) أو رابطًا"), U.Muted),
                input,
                U.Row(U.Btn(Tr.T("Build links", "إنشاء الروابط"), Build, true).Aid("run"),
                      U.Btn(Tr.T("Open VirusTotal", "فتح VirusTotal"), OpenVt).Aid("open-vt")))),
            U.Card(U.Stack(U.H(Tr.T("Result", "النتيجة")), U.Output(_output, 240)))));
    }

    async Task BrowseAsync()
    {
        var d = new OpenFileDialog();
        if (d.ShowDialog(this) == true) await HashFileAsync(d.FileName);
    }

    async Task HashFileAsync(string file)
    {
        _file = file;
        SetStatus(Tr.T("Hashing locally…", "حساب البصمة محليًا…"));
        await using var stream = File.OpenRead(file);
        var hashes = await Hashing.ComputeAsync(stream, new[] { HashKind.SHA256, HashKind.SHA1, HashKind.MD5 });
        _hashOrUrl = hashes[HashKind.SHA256];
        _output = Reputation.ToText(_hashOrUrl, null) + Environment.NewLine + Environment.NewLine
            + "SHA-1: " + hashes[HashKind.SHA1] + Environment.NewLine
            + "MD5: " + hashes[HashKind.MD5] + Environment.NewLine
            + Tr.T("File: ", "الملف: ") + file;
        SetStatus(Tr.T("Hash computed locally. Open a link to look it up.", "حُسبت البصمة محليًا. افتح رابطًا للبحث عنها."));
        Rebuild();
    }

    void Build()
    {
        var text = _hashOrUrl.Trim();
        if (text.Length == 0) { _output = Reputation.ToText(null, null); SetStatus(Tr.T("Paste a hash or URL, or choose a file.", "الصق بصمة أو رابطًا، أو اختر ملفًا.")); Rebuild(); return; }
        if (Reputation.LooksLikeUrl(text)) _output = Reputation.ToText(null, text);
        else _output = Reputation.ToText(Reputation.NormalizeHash(text), null);
        SetStatus(Tr.T("Links ready.", "الروابط جاهزة."));
        Rebuild();
    }

    void OpenVt()
    {
        Build();
        var text = _hashOrUrl.Trim();
        var url = Reputation.LooksLikeUrl(text)
            ? Reputation.VirusTotalSearchUrl(text.Contains("://") ? text : "https://" + text)
            : Reputation.VirusTotalFileUrl(Reputation.NormalizeHash(text));
        if (!AtlasApp.Test) U.Open(url);
    }
}
