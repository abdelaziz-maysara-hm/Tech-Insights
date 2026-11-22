using System.Text;

namespace NetSecAtlas.Core;

public sealed record HealthItem(string Id, string Title, Level Level, string Detail, string Advice, string ArticleSlug);

public static class HealthScore
{
    static readonly Dictionary<string, int> Weights = new()
    {
        ["av"] = 20, ["av-sig"] = 10, ["firewall"] = 15, ["updates"] = 15, ["uac"] = 10, ["bitlocker"] = 10,
        ["smb1"] = 5, ["rdp"] = 5, ["secureboot"] = 5, ["os"] = 5,
    };

    /// <summary>0-100. Unknown items are excluded from the denominator; warnings count half.</summary>
    public static int Compute(IEnumerable<HealthItem> items)
    {
        double got = 0, max = 0;
        foreach (var i in items)
        {
            if (!Weights.TryGetValue(i.Id, out var w) || i.Level is Level.Unknown or Level.Info) continue;
            max += w;
            got += i.Level switch { Level.Ok => w, Level.Warn => w / 2.0, _ => 0 };
        }
        return max == 0 ? 0 : (int)Math.Round(100 * got / max);
    }

    public static (Level level, string label) Grade(int score) => score switch
    {
        >= 85 => (Level.Ok, Tr.T("Good", "جيد")), >= 60 => (Level.Warn, Tr.T("Needs attention", "يحتاج انتباهًا")), _ => (Level.Bad, Tr.T("At risk", "في خطر")),
    };

    public static string ToText(IEnumerable<HealthItem> items, string machine)
    {
        var list = items.ToList();
        var score = Compute(list);
        var sb = new StringBuilder();
        sb.AppendLine($"NetSec Atlas Security Health Check 0.1 — {machine} — {DateTimeOffset.Now:yyyy-MM-dd HH:mm zzz}");
        sb.AppendLine($"{Tr.T("Score", "النتيجة")}: {score}/100 ({Grade(score).label})").AppendLine();
        foreach (var i in list)
            sb.AppendLine($"[{i.Level}] {i.Title}: {i.Detail}{(i.Advice.Length > 0 ? " → " + i.Advice : "")}{(i.ArticleSlug.Length > 0 ? " (" + Links.Article(i.ArticleSlug) + ")" : "")}");
        return sb.ToString();
    }

    /// <summary>Days since the newest installed update; null when unknown.</summary>
    public static (Level, string) RateUpdateAge(DateTime? lastInstalled, DateTime now)
    {
        if (lastInstalled is null) return (Level.Unknown, Tr.T("Could not read update history", "تعذرت قراءة سجل التحديثات"));
        var days = (int)(now - lastInstalled.Value).TotalDays;
        var text = Tr.T($"Last update installed {days} days ago ({lastInstalled:yyyy-MM-dd})", $"آخر تحديث مثبت منذ {days} يومًا ({lastInstalled:yyyy-MM-dd})");
        return (days <= 35 ? Level.Ok : days <= 70 ? Level.Warn : Level.Bad, text);
    }
}
