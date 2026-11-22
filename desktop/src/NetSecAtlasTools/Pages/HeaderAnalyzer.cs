using System.Windows;
using System.Windows.Controls;
using NetSecAtlas.Core;
using NetSecAtlas.Ui;
using NetSecAtlasTools;

namespace HeaderAnalyzer;

public sealed class HeaderAnalyzerPage : ToolPage
{
    string _raw = "";
    HeaderAnalysis? _a;

    public const string Sample = """
Return-Path: <bounce@mailer-example.net>
Received: from mail.mailer-example.net (mail.mailer-example.net [203.0.113.25])
        by mx.example.com with ESMTPS id abc123; Thu, 19 Nov 2026 09:14:07 +0000
Received: from [198.51.100.7] (unknown [198.51.100.7])
        by mail.mailer-example.net with ESMTPA id 77f; Thu, 19 Nov 2026 09:13:58 +0000
Authentication-Results: mx.example.com; spf=pass smtp.mailfrom=mailer-example.net; dkim=none; dmarc=fail (p=reject) header.from=example-bank.com
From: "Example Bank Support <support@example-bank.com>" <alerts@mailer-example.net>
Reply-To: <billing@secure-payments-example.org>
Subject: Action required: confirm your account
Date: Thu, 19 Nov 2026 09:13:55 +0000
Message-ID: <20261119091355.1@mailer-example.net>
""";

    public HeaderAnalyzerPage() : base("HeaderAnalyzer", "Email Header Analyzer", "محلل رؤوس البريد",
        "Paste the full headers of a suspicious email. Everything is analysed on this PC.", "الصق الرؤوس الكاملة لرسالة مشبوهة. يتم التحليل بالكامل على جهازك.", "email-header-analyzer", 1080, 780) { }

    protected override Task OnDemoAsync() { _raw = Sample; _a = EmailHeaderAnalyzer.Analyze(_raw); Rebuild(); return Task.CompletedTask; }

    protected override UIElement BuildBody()
    {
        var box = U.Input(_raw, multiline: true, height: 170, mono: true).Aid("input"); box.TextChanged += (_, _) => _raw = box.Text;
        var s = U.Stack(U.Card(U.Stack(
            U.P(Tr.T("Outlook: File → Properties → Internet headers. Gmail: ⋮ → Show original. Copy everything above the message body.",
                     "Outlook: ملف ← خصائص ← رؤوس الإنترنت. Gmail: ⋮ ← عرض الأصل. انسخ كل ما فوق نص الرسالة.")),
            box,
            U.Row(U.Btn(Tr.T("Analyze", "حلّل"), () => { _a = EmailHeaderAnalyzer.Analyze(_raw); Rebuild(); }, true).Aid("run"),
                  U.Btn(Tr.T("Load sample", "تحميل مثال"), () => { _raw = Sample; _a = EmailHeaderAnalyzer.Analyze(_raw); Rebuild(); }),
                  U.Btn(Tr.T("Clear", "مسح"), () => { _raw = ""; _a = null; Rebuild(); })))));
        if (_a != null)
        {
            var f = new StackPanel();
            f.Children.Add(U.H(Tr.T("Findings", "النتائج")));
            foreach (var x in _a.Findings.OrderBy(x => x.Level switch { Level.Bad => 0, Level.Warn => 1, Level.Info => 2, _ => 3 })) f.Children.Add(U.FindingRow(x.Level, x.Text, ""));
            s.Children.Add(U.Card(f));
            s.Children.Add(U.Card(U.Stack(U.H(Tr.T("Sender identity", "هوية المرسل")), U.Table(new[] { Tr.T("Field", "الحقل"), Tr.T("Value", "القيمة") }, new[]
            {
                new[] { "From", _a.From }, new[] { Tr.T("Real address", "العنوان الحقيقي"), _a.FromAddress }, new[] { "Reply-To", _a.ReplyTo },
                new[] { "Return-Path", _a.ReturnPath }, new[] { "Subject", _a.Subject }, new[] { "Date", _a.Date }, new[] { "Message-ID", _a.MessageId },
                new[] { "SPF / DKIM / DMARC", _a.Auth is null ? "—" : $"{_a.Auth.Spf} / {_a.Auth.Dkim} / {_a.Auth.Dmarc}" },
            }))));
            s.Children.Add(U.Card(U.Stack(U.H(Tr.T("Delivery path (first hop at the top)", "مسار التسليم (أول قفزة في الأعلى)")),
                U.Table(new[] { "#", Tr.T("From", "من"), Tr.T("By", "بواسطة"), Tr.T("With", "البروتوكول"), Tr.T("Time (UTC)", "الوقت (UTC)"), Tr.T("Delay", "التأخير") },
                    _a.Hops.Select(h => new[] { h.Index.ToString(), h.From, h.By, h.With, h.Date?.UtcDateTime.ToString("yyyy-MM-dd HH:mm:ss") ?? "", h.Delay is { } d ? $"{d.TotalSeconds:N0} s" : "" })))));
            s.Children.Add(U.Row(U.Link(Tr.T("Step-by-step guide to reading headers", "دليل قراءة الرؤوس خطوة بخطوة"), Links.Article("email-header-analysis-phishing"))));
        }
        return U.Scroll(s);
    }
}
