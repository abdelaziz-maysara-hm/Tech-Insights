using System.Globalization;
using System.Text.RegularExpressions;

namespace NetSecAtlas.Core;

public enum Level { Ok, Info, Warn, Bad, Unknown }

public sealed record Finding(Level Level, string Text);
public sealed record Hop(int Index, string From, string By, string With, DateTimeOffset? Date, TimeSpan? Delay);
public sealed record AuthResults(string Spf, string Dkim, string Dmarc, string Raw);

public sealed record HeaderAnalysis(
    IReadOnlyList<KeyValuePair<string, string>> Headers,
    string From, string FromAddress, string FromDomain, string DisplayName,
    string ReplyTo, string ReturnPath, string Subject, string MessageId, string Date,
    IReadOnlyList<Hop> Hops, AuthResults? Auth, IReadOnlyList<Finding> Findings);

/// <summary>Parses raw message headers entirely offline (RFC 5322 unfolding, Received chain, RFC 8601 Authentication-Results).</summary>
public static partial class EmailHeaderAnalyzer
{
    [GeneratedRegex(@"<([^<>@\s]+@[^<>\s]+)>|([^\s<>""]+@[^\s<>"",;]+)")] private static partial Regex AddrRx();
    [GeneratedRegex(@"\b(spf|dkim|dmarc)\s*=\s*([a-z]+)", RegexOptions.IgnoreCase)] private static partial Regex AuthRx();
    [GeneratedRegex(@"\bfrom\s+(.+?)(?=\s+by\s|\s+with\s|;|$)", RegexOptions.IgnoreCase | RegexOptions.Singleline)] private static partial Regex RxFrom();
    [GeneratedRegex(@"\bby\s+(\S+)", RegexOptions.IgnoreCase)] private static partial Regex RxBy();
    [GeneratedRegex(@"\bwith\s+(\S+)", RegexOptions.IgnoreCase)] private static partial Regex RxWith();
    [GeneratedRegex(@"(\d{1,2})\s+([A-Za-z]{3})\w*\s+(\d{2,4})\s+(\d{1,2}):(\d{2})(?::(\d{2}))?(?:\.\d+)?\s*([+-]\d{4}|GMT|UTC|UT|Z)?", RegexOptions.IgnoreCase)] private static partial Regex DateRx();

    public static List<KeyValuePair<string, string>> ParseHeaders(string raw)
    {
        var list = new List<KeyValuePair<string, string>>();
        var lines = raw.Replace("\r\n", "\n").Split('\n');
        string? name = null; var value = new System.Text.StringBuilder();
        void Flush() { if (name != null) list.Add(new(name, Regex.Replace(value.ToString(), @"\s+", " ").Trim())); name = null; value.Clear(); }
        foreach (var line in lines)
        {
            if (line.Length == 0) { if (list.Count > 0 || name != null) { Flush(); break; } continue; } // blank line ends the header block
            if ((line[0] == ' ' || line[0] == '\t') && name != null) { value.Append(' ').Append(line.Trim()); continue; }
            int colon = line.IndexOf(':');
            if (colon <= 0 || line[..colon].Contains(' ')) { if (name != null) value.Append(' ').Append(line.Trim()); continue; }
            Flush();
            name = line[..colon].Trim(); value.Append(line[(colon + 1)..].Trim());
        }
        Flush();
        return list;
    }

    public static string ExtractAddress(string headerValue)
    {
        // The real mailbox is the last <angle-addr>; anything before it (even an address) is display text.
        var ms = AddrRx().Matches(headerValue ?? "");
        var angle = ms.LastOrDefault(m => m.Groups[1].Success);
        var m = angle ?? ms.FirstOrDefault();
        return m is null ? "" : (m.Groups[1].Success ? m.Groups[1].Value : m.Groups[2].Value).Trim().ToLowerInvariant();
    }

    public static string Domain(string address) { int at = address.LastIndexOf('@'); return at < 0 ? "" : address[(at + 1)..].TrimEnd('>', '.').ToLowerInvariant(); }

    /// <summary>Organisational-domain approximation: last two labels (three for common two-level public suffixes).</summary>
    public static string OrgDomain(string domain)
    {
        var labels = domain.Split('.', StringSplitOptions.RemoveEmptyEntries);
        if (labels.Length <= 2) return domain;
        var two = labels[^2] + "." + labels[^1];
        bool sld = labels[^1].Length == 2 && labels[^2] is "co" or "com" or "org" or "net" or "gov" or "edu" or "ac";
        return sld ? labels[^3] + "." + two : two;
    }

    public static DateTimeOffset? ParseDate(string s)
    {
        var m = DateRx().Match(s ?? "");
        if (!m.Success) return null;
        int day = int.Parse(m.Groups[1].Value);
        int month = Array.IndexOf(new[] { "jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec" }, m.Groups[2].Value[..3].ToLowerInvariant()) + 1;
        int year = int.Parse(m.Groups[3].Value); if (year < 100) year += 2000;
        if (month == 0) return null;
        int sec = m.Groups[6].Success ? int.Parse(m.Groups[6].Value) : 0;
        var zone = m.Groups[7].Success ? m.Groups[7].Value.ToUpperInvariant() : "+0000";
        var offset = zone.StartsWith('+') || zone.StartsWith('-')
            ? new TimeSpan(int.Parse(zone[1..3]), int.Parse(zone[3..5]), 0) * (zone[0] == '-' ? -1 : 1) : TimeSpan.Zero;
        try { return new DateTimeOffset(year, month, day, int.Parse(m.Groups[4].Value), int.Parse(m.Groups[5].Value), sec, offset); }
        catch (ArgumentOutOfRangeException) { return null; }
    }

    public static AuthResults? ParseAuth(IEnumerable<KeyValuePair<string, string>> headers)
    {
        var ar = headers.FirstOrDefault(h => h.Key.Equals("Authentication-Results", StringComparison.OrdinalIgnoreCase)).Value;
        if (string.IsNullOrEmpty(ar)) return null;
        string Get(string mech) => AuthRx().Matches(ar).Where(m => m.Groups[1].Value.Equals(mech, StringComparison.OrdinalIgnoreCase)).Select(m => m.Groups[2].Value.ToLowerInvariant()).FirstOrDefault() ?? "none";
        return new(Get("spf"), Get("dkim"), Get("dmarc"), ar);
    }

    public static HeaderAnalysis Analyze(string raw)
    {
        var h = ParseHeaders(raw);
        string First(string n) => h.FirstOrDefault(x => x.Key.Equals(n, StringComparison.OrdinalIgnoreCase)).Value ?? "";

        var from = First("From");
        var fromAddr = ExtractAddress(from);
        var lt = from.LastIndexOf('<');
        var display = lt > 0 ? from[..lt].Trim().Trim('"') : "";
        var replyTo = ExtractAddress(First("Reply-To"));
        var returnPath = ExtractAddress(First("Return-Path"));

        // Received headers are prepended by each server, so the bottom one is the first hop.
        var received = h.Where(x => x.Key.Equals("Received", StringComparison.OrdinalIgnoreCase)).Select(x => x.Value).Reverse().ToList();
        var hops = new List<Hop>();
        DateTimeOffset? prev = null;
        for (int i = 0; i < received.Count; i++)
        {
            var r = received[i];
            int semi = r.LastIndexOf(';');
            var date = semi >= 0 ? ParseDate(r[(semi + 1)..]) : null;
            var body = semi >= 0 ? r[..semi] : r;
            TimeSpan? delay = date.HasValue && prev.HasValue ? date - prev : null;
            hops.Add(new(i + 1, RxFrom().Match(body) is { Success: true } f ? f.Groups[1].Value.Trim() : "", RxBy().Match(body) is { Success: true } b ? b.Groups[1].Value : "",
                RxWith().Match(body) is { Success: true } w ? w.Groups[1].Value : "", date, delay));
            if (date.HasValue) prev = date;
        }

        var auth = ParseAuth(h);
        var findings = new List<Finding>();
        var fromDomain = Domain(fromAddr);
        if (fromAddr == "") findings.Add(new(Level.Warn, Tr.T("No usable From address was found.", "لم يُعثر على عنوان From صالح.")));
        if (auth is null) findings.Add(new(Level.Info, Tr.T("No Authentication-Results header. Copy the full headers from the receiving mailbox.", "لا يوجد رأس Authentication-Results. انسخ الرؤوس كاملة من صندوق المستلم.")));
        else
        {
            findings.Add(Verdict("SPF", auth.Spf)); findings.Add(Verdict("DKIM", auth.Dkim)); findings.Add(Verdict("DMARC", auth.Dmarc));
        }
        if (replyTo != "" && fromDomain != "" && OrgDomain(Domain(replyTo)) != OrgDomain(fromDomain))
            findings.Add(new(Level.Warn, Tr.T($"Replies go to a different domain ({Domain(replyTo)}) than the sender ({fromDomain}). Common in phishing and invoice fraud.",
                $"الردود تذهب إلى نطاق مختلف ({Domain(replyTo)}) عن نطاق المرسل ({fromDomain}). شائع في التصيد واحتيال الفواتير.")));
        if (returnPath != "" && fromDomain != "" && OrgDomain(Domain(returnPath)) != OrgDomain(fromDomain))
            findings.Add(new(Level.Info, Tr.T($"Return-Path domain ({Domain(returnPath)}) differs from From. Normal for mailing services, suspicious if DMARC also fails.",
                $"نطاق Return-Path ({Domain(returnPath)}) يختلف عن From. طبيعي مع خدمات الإرسال، ومريب إذا فشل DMARC أيضًا.")));
        var displayAddr = ExtractAddress(display);
        if (displayAddr != "" && displayAddr != fromAddr)
            findings.Add(new(Level.Bad, Tr.T($"The display name shows an address ({displayAddr}) that is not the real sender ({fromAddr}).",
                $"اسم العرض يُظهر عنوانًا ({displayAddr}) ليس هو المرسل الحقيقي ({fromAddr}).")));
        var negative = hops.Where(x => x.Delay is { TotalMinutes: < -5 }).ToList();
        if (negative.Count > 0) findings.Add(new(Level.Info, Tr.T("Some hops have timestamps earlier than the previous hop: server clocks differ or headers were edited.", "بعض القفزات لها توقيت أقدم من القفزة السابقة: ساعات الخوادم مختلفة أو تم تعديل الرؤوس.")));
        var slow = hops.Where(x => x.Delay is { TotalMinutes: > 30 }).ToList();
        if (slow.Count > 0) findings.Add(new(Level.Info, Tr.T($"Largest delay: {slow.Max(x => x.Delay!.Value.TotalMinutes):N0} minutes at hop {slow.MaxBy(x => x.Delay)!.Index}.", $"أكبر تأخير: {slow.Max(x => x.Delay!.Value.TotalMinutes):N0} دقيقة عند القفزة {slow.MaxBy(x => x.Delay)!.Index}.")));

        return new(h, from, fromAddr, fromDomain, display, replyTo, returnPath, First("Subject"), First("Message-ID"), First("Date"), hops, auth, findings);
    }

    static Finding Verdict(string mech, string result) => result switch
    {
        "pass" => new(Level.Ok, Tr.T($"{mech}: pass", $"{mech}: نجاح")),
        "fail" or "permerror" => new(Level.Bad, Tr.T($"{mech}: {result}. The message failed this check.", $"{mech}: {result}. فشلت الرسالة في هذا الفحص.")),
        "softfail" or "temperror" or "neutral" => new(Level.Warn, Tr.T($"{mech}: {result}", $"{mech}: {result}")),
        _ => new(Level.Info, Tr.T($"{mech}: not reported", $"{mech}: غير مذكور")),
    };
}
