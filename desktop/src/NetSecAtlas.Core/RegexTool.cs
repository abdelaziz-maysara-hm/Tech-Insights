using System.Text;
using System.Text.RegularExpressions;

namespace NetSecAtlas.Core;

public sealed record RegexGroup(string Name, string Value, int Index, int Length);
public sealed record RegexHit(int Number, int Index, int Length, string Value, IReadOnlyList<RegexGroup> Groups);
public sealed record RegexTestResult(bool Ok, string Error, bool IsMatch, int Count, IReadOnlyList<RegexHit> Hits, string Text);

public static class RegexTool
{
    public static readonly TimeSpan DefaultTimeout = TimeSpan.FromSeconds(2);

    public static RegexTestResult Run(string pattern, string input, bool ignoreCase = false, bool multiline = false, bool singleline = false, TimeSpan? timeout = null)
    {
        if (string.IsNullOrEmpty(pattern))
            return Fail(Tr.T("Enter a regular expression.", "أدخل تعبيرًا منتظمًا."));
        var options = RegexOptions.CultureInvariant | RegexOptions.ExplicitCapture;
        // Named and numbered groups still work with ExplicitCapture if they are named; we want numbered groups too.
        options = RegexOptions.CultureInvariant;
        if (ignoreCase) options |= RegexOptions.IgnoreCase;
        if (multiline) options |= RegexOptions.Multiline;
        if (singleline) options |= RegexOptions.Singleline;
        try
        {
            var re = new Regex(pattern, options, timeout ?? DefaultTimeout);
            var hits = new List<RegexHit>();
            int n = 0;
            foreach (Match m in re.Matches(input ?? ""))
            {
                if (!m.Success) continue;
                n++;
                var groups = new List<RegexGroup>();
                for (int i = 0; i < m.Groups.Count; i++)
                {
                    var g = m.Groups[i];
                    var name = re.GroupNameFromNumber(i);
                    if (i == 0 && (string.IsNullOrEmpty(name) || name == "0")) continue;
                    if (!g.Success) continue;
                    if (name == i.ToString() && i == 0) continue;
                    groups.Add(new RegexGroup(string.IsNullOrEmpty(name) ? i.ToString() : name, g.Value, g.Index, g.Length));
                }
                hits.Add(new RegexHit(n, m.Index, m.Length, m.Value, groups));
                if (hits.Count >= 500) break;
            }
            return new RegexTestResult(true, "", hits.Count > 0, hits.Count, hits, ToText(pattern, hits));
        }
        catch (RegexMatchTimeoutException)
        {
            return Fail(Tr.T("The match was stopped after 2 seconds (the pattern may be too expensive). Tighten the expression and try again.",
                "أُوقف البحث بعد ثانيتين (التعبير قد يكون ثقيلًا جدًا). بسّط التعبير ثم أعد المحاولة."));
        }
        catch (ArgumentException ex)
        {
            return Fail(Tr.T("Invalid regular expression: ", "تعبير منتظم غير صالح: ") + ex.Message);
        }
    }

    static RegexTestResult Fail(string error) => new(false, error, false, 0, Array.Empty<RegexHit>(), error);

    static string ToText(string pattern, IReadOnlyList<RegexHit> hits)
    {
        var sb = new StringBuilder();
        sb.AppendLine($"{Tr.T("Pattern", "التعبير")}: {pattern}");
        sb.AppendLine(hits.Count == 0
            ? Tr.T("No matches.", "لا تطابق.")
            : Tr.T($"{hits.Count} match(es).", $"عدد التطابقات: {hits.Count}."));
        foreach (var h in hits)
        {
            sb.AppendLine($"  #{h.Number} @{h.Index}+{h.Length}: {h.Value}");
            foreach (var g in h.Groups)
                sb.AppendLine($"      {g.Name}: {g.Value}");
        }
        return sb.ToString().TrimEnd();
    }
}
