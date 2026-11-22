using System.Windows;
using System.Windows.Controls;
using Microsoft.Win32;
using NetSecAtlas.Core;
using NetSecAtlas.Ui;
using NetSecAtlasTools;

namespace HashChecker;

public sealed class HashCheckerPage : ToolPage
{
    string? _file;
    Dictionary<HashKind, string>? _results;
    string _expected = "";
    string? _compareNote;
    double _progress;
    CancellationTokenSource? _cts;
    string _text = "", _textHashes = "";

    public Task OpenFileAsync(string file) => ComputeAsync(file);

    public HashCheckerPage() : base("HashChecker", "Hash Checker", "فاحص البصمة (Hash)",
        "Verify a download really is the file the publisher released.", "تحقق أن الملف الذي نزّلته هو نفسه الذي نشره المطوّر.", "hash-checker")
    {
        AllowDrop = true;
        Drop += async (_, e) =>
        {
            if (e.Data.GetData(DataFormats.FileDrop) is string[] { Length: > 0 } f) await ComputeAsync(f[0]);
        };
        Loaded += async (_, _) =>
        {
            var arg = AtlasApp.Args.FirstOrDefault(a => !a.StartsWith("--") && File.Exists(a));
            if (arg != null) await ComputeAsync(arg);
        };
    }

    protected override async Task OnDemoAsync()
    {
        _text = "NetSec Atlas"; _textHashes = HashTool.Compute(_text);
        if (Environment.ProcessPath is { } self)
        {
            await ComputeAsync(self);
            if (_results != null) { _expected = _results[HashKind.SHA256].ToUpperInvariant(); Rebuild(); }
        }
    }

    protected override UIElement BuildBody()
    {
        var path = U.Input(_file ?? Tr.T("Drop a file here or click Browse…", "اسحب ملفًا إلى هنا أو اضغط استعراض…")); path.IsReadOnly = true; path.Width = 560;
        var expected = U.Input(_expected, mono: true); expected.Width = 560;
        expected.TextChanged += (_, _) => { _expected = expected.Text; };

        var stack = U.Stack(
            U.Card(U.Stack(
                U.H(Tr.T("1. Choose a file", "1. اختر الملف")),
                U.Row(path, U.AsyncBtn(Tr.T("Browse…", "استعراض…"), async () =>
                {
                    var d = new OpenFileDialog();
                    if (d.ShowDialog(this) == true) await ComputeAsync(d.FileName);
                }, true)),
                new ProgressBar { Height = 6, Value = _progress * 100, Maximum = 100, Foreground = U.Accent, Margin = new Thickness(0, 0, 0, 4) })),
            U.Card(U.Stack(
                U.H(Tr.T("2. Paste the expected hash (from the publisher's site)", "2. الصق البصمة المتوقعة (من موقع الناشر)")),
                U.Row(expected, U.Btn(Tr.T("Check", "تحقق"), () => { _expected = expected.Text; Rebuild(); }, true),
                    U.Btn(Tr.T("Load SHA256SUMS…", "تحميل ملف SHA256SUMS…"), LoadSums)),
                Verdict())),
            U.Card(U.Stack(U.H(Tr.T("Results", "النتائج")), ResultsTable(),
                U.Row(U.Btn(Tr.T("Copy SHA-256", "نسخ SHA-256"), () => { if (_results != null) U.Copy(_results[HashKind.SHA256]); }),
                      U.Btn(Tr.T("Copy all", "نسخ الكل"), () => { if (_results != null) U.Copy(string.Join(Environment.NewLine, _results.Select(r => $"{r.Key}: {r.Value}"))); }),
                      U.AsyncBtn(Tr.T("Compare with another file…", "قارن بملف آخر…"), CompareAsync)),
                _compareNote is null ? new TextBlock() : U.P(_compareNote))),
            TextCard(),
            U.Card(U.Stack(
                U.H(Tr.T("Explorer right-click menu (optional)", "قائمة الزر الأيمن في المستكشف (اختياري)")),
                U.P(Tr.T("Adds \"Check hash (NetSec Atlas)\" for your user account only. No admin rights needed; remove it any time.",
                         "يضيف «فحص البصمة (NetSec Atlas)» لحسابك فقط. لا يحتاج صلاحيات مدير، ويمكن إزالته في أي وقت."), U.Muted),
                U.Row(U.Btn(Tr.T("Add to menu", "إضافة للقائمة"), () => ContextMenuReg(true)), U.Btn(Tr.T("Remove", "إزالة"), () => ContextMenuReg(false))))));
        return U.Scroll(stack);
    }

    UIElement TextCard()
    {
        var input = U.Input(_text).Aid("text-input"); input.Width = 560; input.FlowDirection = FlowDirection.LeftToRight;
        input.TextChanged += (_, _) => _text = input.Text;
        return U.Card(U.Stack(
            U.H(Tr.T("Hash a piece of text", "بصمة نص")),
            U.P(Tr.T("MD5, SHA-1, SHA-256, SHA-384 and SHA-512 of the text as UTF-8. Computed on this PC.", "MD5 وSHA-1 وSHA-256 وSHA-384 وSHA-512 للنص بترميز UTF-8. تُحسب على جهازك."), U.Muted),
            U.Row(input, U.Btn(Tr.T("Hash text", "احسب بصمة النص"), () => { _textHashes = HashTool.Compute(_text); Rebuild(); }, true).Aid("text-run")),
            _textHashes.Length == 0 ? new TextBlock() : U.Output(_textHashes, 120).Aid("text-result")));
    }

    UIElement Verdict()
    {
        if (_results is null || string.IsNullOrWhiteSpace(_expected)) return U.P(Tr.T("Tip: the algorithm is detected from the hash length.", "تلميح: يُكتشف نوع الخوارزمية تلقائيًا من طول البصمة."), U.Muted);
        var n = Hashing.Normalize(_expected);
        var kind = Hashing.DetectKind(n);
        if (kind is null) return U.FindingRow(Level.Warn, Tr.T("Not a valid hash", "ليست بصمة صالحة"), Tr.T("Expected 32, 40, 64, 96 or 128 hex characters.", "المتوقع 32 أو 40 أو 64 أو 96 أو 128 حرفًا ست عشريًا."));
        var m = Hashing.Match(_expected, _results);
        return m != null
            ? U.FindingRow(Level.Ok, Tr.T($"MATCH ({m})", $"مطابقة ({m})"), Tr.T("The file is identical to the one the hash was made from.", "الملف مطابق تمامًا للملف الذي أُخذت منه البصمة."))
            : U.FindingRow(Level.Bad, Tr.T($"DOES NOT MATCH ({kind})", $"غير مطابقة ({kind})"), Tr.T("Do not run this file. Download it again from the official site, and compare once more.", "لا تشغّل هذا الملف. نزّله من جديد من الموقع الرسمي وقارن مرة أخرى."));
    }

    UIElement ResultsTable() => _results is null
        ? U.P(Tr.T("No file hashed yet.", "لم يُحسب أي ملف بعد."), U.Muted)
        : U.Table(new[] { Tr.T("Algorithm", "الخوارزمية"), Tr.T("Hash", "البصمة") }, _results.Select(r => new[] { r.Key.ToString(), r.Value }));

    async Task ComputeAsync(string file)
    {
        _cts?.Cancel(); _cts = new CancellationTokenSource();
        _file = file; _results = null; _compareNote = null; _progress = 0; Rebuild();
        var len = new FileInfo(file).Length;
        SetStatus(Tr.T($"Hashing {Path.GetFileName(file)} ({len / 1048576.0:N1} MB)…", $"جارٍ حساب بصمة {Path.GetFileName(file)} ({len / 1048576.0:N1} ميجابايت)…"));
        var last = DateTime.MinValue;
        var progress = new Progress<double>(p => { _progress = p; if ((DateTime.Now - last).TotalMilliseconds > 200) { last = DateTime.Now; SetStatus($"{p:P0}"); } });
        var sw = System.Diagnostics.Stopwatch.StartNew();
        _results = await Task.Run(() => Hashing.ComputeFileAsync(file, Hashing.All, progress, _cts.Token));
        _progress = 1; Rebuild();
        SetStatus(Tr.T($"Done in {sw.Elapsed.TotalSeconds:N1} s: {file}", $"تم خلال {sw.Elapsed.TotalSeconds:N1} ثانية: {file}"));
    }

    void LoadSums()
    {
        if (_file is null) { SetStatus(Tr.T("Choose the file first.", "اختر الملف أولًا.")); return; }
        var d = new OpenFileDialog { Filter = "Checksums|*.txt;*.sha256;*.sha256sum;SHA256SUMS*;*.sum|All files|*.*" };
        if (d.ShowDialog(this) != true) return;
        var found = Hashing.FindInSumsFile(File.ReadAllText(d.FileName), Path.GetFileName(_file));
        if (found is null) SetStatus(Tr.T("This file name is not listed in that checksum file.", "اسم هذا الملف غير موجود في ملف البصمات."));
        else { _expected = found; Rebuild(); }
    }

    async Task CompareAsync()
    {
        if (_results is null) { SetStatus(Tr.T("Choose the first file first.", "اختر الملف الأول أولًا.")); return; }
        var d = new OpenFileDialog();
        if (d.ShowDialog(this) != true) return;
        var other = await Task.Run(() => Hashing.ComputeFileAsync(d.FileName, new[] { HashKind.SHA256 }));
        bool same = other[HashKind.SHA256] == _results[HashKind.SHA256];
        _compareNote = same ? Tr.T($"✔ Identical to {Path.GetFileName(d.FileName)} (SHA-256).", $"✔ مطابق للملف {Path.GetFileName(d.FileName)} (SHA-256).")
                            : Tr.T($"✘ Different from {Path.GetFileName(d.FileName)}.", $"✘ مختلف عن الملف {Path.GetFileName(d.FileName)}.");
        Rebuild();
    }

    void ContextMenuReg(bool add)
    {
        const string key = @"Software\Classes\*\shell\NetSecAtlas.HashChecker";
        try
        {
            if (!add) { Registry.CurrentUser.DeleteSubKeyTree(key, false); SetStatus(Tr.T("Removed from the right-click menu.", "أُزيل من قائمة الزر الأيمن.")); return; }
            var exe = Environment.ProcessPath!;
            using var k = Registry.CurrentUser.CreateSubKey(key);
            k.SetValue("MUIVerb", Tr.T("Check hash (NetSec Atlas)", "فحص البصمة (NetSec Atlas)"));
            k.SetValue("Icon", $"\"{exe}\",0");
            using var c = k.CreateSubKey("command");
            c.SetValue("", $"\"{exe}\" \"%1\"");
            SetStatus(Tr.T("Added. On Windows 11 it appears under \"Show more options\".", "تمت الإضافة. في ويندوز 11 تظهر تحت «إظهار المزيد من الخيارات»."));
        }
        catch (Exception ex) { SetStatus(ex.Message); }
    }
}
