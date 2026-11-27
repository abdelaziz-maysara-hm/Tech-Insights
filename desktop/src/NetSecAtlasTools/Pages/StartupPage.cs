using System.Windows;
using System.Windows.Controls;
using NetSecAtlas.Core;
using NetSecAtlas.Ui;

namespace NetSecAtlasTools.Pages;

public sealed class StartupPage : ToolPage
{
    List<PersistenceEntry> _rows = new();
    string _output = "";

    public StartupPage() : base("startup", "Startup & Persistence", "بدء التشغيل والثبات",
        "Read-only list of programs that start with Windows (Run keys and Startup folders). Nothing is added, changed or deleted.",
        "قائمة للقراءة فقط بالبرامج التي تبدأ مع ويندوز (مفاتيح Run ومجلدات بدء التشغيل). لا يُضاف أو يُغيّر أو يُحذف شيء.", "") { }

    protected override Task OnDemoAsync()
    {
        Refresh();
        return Task.CompletedTask;
    }

    void Refresh()
    {
        try
        {
            _rows = Persistence.Read();
            _output = Persistence.ToText(_rows);
            SetStatus(Tr.T($"Read {_rows.Count} entr(y/ies).", $"قُرئت {_rows.Count} عنصرًا."));
        }
        catch (Exception ex)
        {
            _rows = new();
            _output = "⚠ " + ex.GetBaseException().Message;
            SetStatus(ex.GetBaseException().Message);
        }
        Rebuild();
    }

    protected override UIElement BuildBody()
    {
        UIElement table = _rows.Count == 0
            ? U.Output(_output.Length > 0 ? _output : Tr.T("No entries yet. Press Refresh.", "لا عناصر بعد. اضغط تحديث."), 160)
            : U.Table(new[] { Tr.T("Source", "المصدر"), Tr.T("Name", "الاسم"), Tr.T("Command / path", "الأمر / المسار") },
                _rows.Select(r => new[] { r.Source, r.Name, r.Command }), 360).Aid("result");
        return U.Scroll(U.Stack(
            U.Card(U.Stack(
                U.P(Tr.T("Covers HKCU/HKLM Run and RunOnce (including the 32-bit hive) and the current-user and all-users Startup folders. Services and scheduled tasks are not listed. This is a viewer, not a cleaner.",
                         "يغطي مفاتيح Run وRunOnce للمستخدم والجهاز (بما فيها خلية 32-بت) ومجلدي بدء تشغيل المستخدم وكل المستخدمين. لا تُعرض الخدمات ولا المهام المجدولة. هذا عارض وليس أداة تنظيف."), U.Muted),
                U.Row(U.Btn(Tr.T("Refresh", "تحديث"), Refresh, true).Aid("run"),
                      U.Btn(Tr.T("Copy list", "نسخ القائمة"), () => U.Copy(_output)),
                      U.Btn(Tr.T("Export…", "تصدير…"), () => U.SaveText(this, _output, $"startup-{Environment.MachineName}-{DateTime.Now:yyyyMMdd-HHmm}.txt"))))),
            U.Card(U.Stack(U.H(Tr.T("Result", "النتيجة")), table))));
    }
}
