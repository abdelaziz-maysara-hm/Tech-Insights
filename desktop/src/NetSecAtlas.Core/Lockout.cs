using System.Xml.Linq;

namespace NetSecAtlas.Core;

public sealed record AuthEvent(int EventId, DateTimeOffset? Time, string Dc, string User, string Source, string Code, string Meaning);

/// <summary>Parsing and interpretation of Security events 4740, 4625, 4771 and 4776 (Microsoft documented fields).</summary>
public static class LockoutAnalyzer
{
    public static readonly int[] EventIds = { 4740, 4625, 4771, 4776 };

    public static string BuildXPath(string? user, int hours)
    {
        var ids = string.Join(" or ", EventIds.Select(i => $"EventID={i}"));
        var ms = (long)TimeSpan.FromHours(Math.Clamp(hours, 1, 24 * 30)).TotalMilliseconds;
        var q = $"*[System[({ids}) and TimeCreated[timediff(@SystemTime) &lt;= {ms}]]]";
        if (!string.IsNullOrWhiteSpace(user))
        {
            var u = user.Trim().Replace("'", "");
            if (u.Contains('\\')) u = u[(u.IndexOf('\\') + 1)..];
            q += $" and *[EventData[Data[@Name='TargetUserName']='{u}']]";
        }
        return q.Replace("&lt;", "<");
    }

    public static AuthEvent Parse(string xml, string dc)
    {
        var doc = XDocument.Parse(xml);
        XNamespace ns = doc.Root!.GetDefaultNamespace();
        var sys = doc.Root.Element(ns + "System");
        int id = int.Parse(sys?.Element(ns + "EventID")?.Value ?? "0");
        DateTimeOffset? time = DateTimeOffset.TryParse(sys?.Element(ns + "TimeCreated")?.Attribute("SystemTime")?.Value, out var t) ? t : null;
        var data = doc.Root.Element(ns + "EventData")?.Elements(ns + "Data").ToDictionary(e => (string?)e.Attribute("Name") ?? "", e => e.Value) ?? new();
        string D(string k) => data.TryGetValue(k, out var v) ? v.Trim() : "";
        string user = D("TargetUserName");
        string source, code = "";
        switch (id)
        {
            case 4740: source = D("TargetDomainName"); break; // "Caller Computer Name" is stored in TargetDomainName for 4740
            case 4625: source = Join(D("WorkstationName"), D("IpAddress")); code = D("SubStatus") is { Length: > 0 } ss && ss != "0x0" ? ss : D("Status"); break;
            case 4771: source = D("IpAddress").Replace("::ffff:", ""); code = D("Status"); user = D("TargetUserName"); break;
            case 4776: source = D("Workstation"); code = D("Status"); break;
            default: source = ""; break;
        }
        return new(id, time, dc, user, source, code, Describe(id, code));
    }

    static string Join(string a, string b) => string.Join(" / ", new[] { a, b }.Where(x => x.Length > 0 && x != "-"));

    public static string Describe(int id, string code)
    {
        if (id == 4740) return Tr.T("Account locked out", "تم قفل الحساب");
        var c = code.ToLowerInvariant();
        if (id == 4771) return c switch
        {
            "0x18" => Tr.T("Bad password (Kerberos pre-auth failed)", "كلمة مرور خاطئة (فشل المصادقة المسبقة)"),
            "0x12" => Tr.T("Account disabled, expired or locked", "الحساب معطل أو منتهٍ أو مقفل"),
            "0x17" => Tr.T("Password expired", "كلمة المرور منتهية"),
            "0x25" => Tr.T("Clock skew too great", "فرق كبير في الوقت"),
            "0x6" => Tr.T("Username not found", "اسم المستخدم غير موجود"),
            _ => Tr.T("Kerberos pre-auth failure", "فشل مصادقة Kerberos") + (c.Length > 0 ? $" ({code})" : ""),
        };
        return c switch
        {
            "0xc000006a" => Tr.T("Wrong password", "كلمة مرور خاطئة"),
            "0xc0000064" => Tr.T("Username does not exist", "اسم المستخدم غير موجود"),
            "0xc0000234" => Tr.T("Account is locked out", "الحساب مقفل"),
            "0xc0000072" => Tr.T("Account disabled", "الحساب معطل"),
            "0xc000006f" => Tr.T("Outside allowed logon hours", "خارج ساعات الدخول المسموحة"),
            "0xc0000070" => Tr.T("Workstation restriction", "قيد على الجهاز"),
            "0xc0000193" => Tr.T("Account expired", "الحساب منتهي الصلاحية"),
            "0xc0000071" => Tr.T("Password expired", "كلمة المرور منتهية"),
            "0xc0000224" => Tr.T("Password must be changed", "يجب تغيير كلمة المرور"),
            "0xc0000133" => Tr.T("Clock out of sync with DC", "الوقت غير متزامن مع وحدة التحكم"),
            "0xc000015b" => Tr.T("Logon type not granted", "نوع الدخول غير مسموح"),
            "0xc000006d" or "0xc000006e" => Tr.T("Bad username or credentials", "بيانات دخول خاطئة"),
            "0x0" or "" => id == 4776 ? Tr.T("NTLM validation", "تحقق NTLM") : Tr.T("Logon failure", "فشل تسجيل الدخول"),
            _ => Tr.T("Logon failure", "فشل تسجيل الدخول") + $" ({code})",
        };
    }

    /// <summary>Ranks sources by failures; a source seen in a 4740 caller field ranks first.</summary>
    public static List<(string Source, int Failures, bool LockoutCaller)> RankSources(IEnumerable<AuthEvent> events)
    {
        var list = events.Where(e => e.Source.Length > 0)
            .GroupBy(e => e.Source, StringComparer.OrdinalIgnoreCase)
            .Select(g => (Source: g.Key, Failures: g.Count(e => e.EventId != 4740 && !(e.EventId == 4776 && e.Code is "0x0" or "")), LockoutCaller: g.Any(e => e.EventId == 4740)))
            .OrderByDescending(x => x.LockoutCaller).ThenByDescending(x => x.Failures).ToList();
        return list;
    }

    public static string ToCsv(IEnumerable<AuthEvent> events) => Csv.Build(new[] { "time_utc", "event_id", "dc", "user", "source", "code", "meaning" },
        events.Select(e => new[] { e.Time?.UtcDateTime.ToString("yyyy-MM-dd HH:mm:ss") ?? "", e.EventId.ToString(), e.Dc, e.User, e.Source, e.Code, e.Meaning }));
}
