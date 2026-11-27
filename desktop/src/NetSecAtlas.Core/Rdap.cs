using System.Net;
using System.Text;
using System.Text.Json;

namespace NetSecAtlas.Core;

public sealed record RdapField(string Name, string Value);

public sealed record RdapResult(bool Ok, string Error, string Query, string Kind, IReadOnlyList<RdapField> Fields, string Text)
{
    public static RdapResult Fail(string query, string error) => new(false, error, query, "", Array.Empty<RdapField>(), error);
}

public static class Rdap
{
    public const string Bootstrap = "https://rdap.org/";

    public static bool IsIp(string query) => IPAddress.TryParse((query ?? "").Trim(), out _);

    /// <summary>Public RDAP bootstrap URL (rdap.org). No API key.</summary>
    public static string RequestUrl(string query)
    {
        var q = (query ?? "").Trim().TrimEnd('.');
        if (q.Length == 0) throw new ArgumentException(Tr.T("Enter a domain or an IP address.", "أدخل اسم نطاق أو عنوان IP."));
        if (q.StartsWith("http://", StringComparison.OrdinalIgnoreCase) || q.StartsWith("https://", StringComparison.OrdinalIgnoreCase))
        {
            if (Uri.TryCreate(q, UriKind.Absolute, out var u) && !string.IsNullOrEmpty(u.Host)) q = u.Host;
        }
        if (q.StartsWith("www.", StringComparison.OrdinalIgnoreCase) && !IsIp(q)) q = q[4..];
        return IsIp(q)
            ? Bootstrap + "ip/" + Uri.EscapeDataString(q)
            : Bootstrap + "domain/" + Uri.EscapeDataString(q.ToLowerInvariant());
    }

    public static RdapResult Parse(string query, string json)
    {
        if (string.IsNullOrWhiteSpace(json)) return RdapResult.Fail(query, Tr.T("Empty response.", "رد فارغ."));
        try
        {
            using var doc = JsonDocument.Parse(json);
            var root = doc.RootElement;
            if (root.ValueKind == JsonValueKind.Object && root.TryGetProperty("errorCode", out var err))
                return RdapResult.Fail(query, $"{err.GetRawText()} {Str(root, "title")} {Str(root, "description")}".Trim());

            var fields = new List<RdapField>();
            var kind = Str(root, "objectClassName");
            Add(fields, Tr.T("Handle", "المعرّف"), Str(root, "handle"));
            Add(fields, Tr.T("Name / LDH", "الاسم"), First(Str(root, "ldhName"), Str(root, "unicodeName"), Str(root, "name")));
            Add(fields, Tr.T("Type", "النوع"), kind);
            if (root.TryGetProperty("status", out var status) && status.ValueKind == JsonValueKind.Array)
                Add(fields, Tr.T("Status", "الحالة"), string.Join(", ", status.EnumerateArray().Select(StringOf)));
            if (root.TryGetProperty("events", out var events) && events.ValueKind == JsonValueKind.Array)
            {
                foreach (var ev in events.EnumerateArray())
                    Add(fields, EventLabel(Str(ev, "eventAction")), Str(ev, "eventDate"));
            }
            if (root.TryGetProperty("nameservers", out var ns) && ns.ValueKind == JsonValueKind.Array)
                Add(fields, Tr.T("Name servers", "خوادم الأسماء"), string.Join(", ", ns.EnumerateArray().Select(n => First(Str(n, "ldhName"), Str(n, "unicodeName"))).Where(s => s.Length > 0)));
            if (root.TryGetProperty("entities", out var ents) && ents.ValueKind == JsonValueKind.Array)
            {
                foreach (var e in ents.EnumerateArray())
                {
                    var roles = e.TryGetProperty("roles", out var r) && r.ValueKind == JsonValueKind.Array
                        ? string.Join(", ", r.EnumerateArray().Select(StringOf)) : Tr.T("entity", "جهة");
                    var name = EntityName(e);
                    if (name.Length > 0) Add(fields, roles, name);
                }
            }
            if (root.TryGetProperty("startAddress", out _) || root.TryGetProperty("endAddress", out _))
            {
                Add(fields, Tr.T("Start address", "عنوان البداية"), Str(root, "startAddress"));
                Add(fields, Tr.T("End address", "عنوان النهاية"), Str(root, "endAddress"));
                Add(fields, "CIDR", Str(root, "cidr0_cidrs").Length > 0 ? Str(root, "cidr0_cidrs") : IpNetwork(root));
                Add(fields, Tr.T("Country", "البلد"), Str(root, "country"));
                Add(fields, Tr.T("Type", "النوع"), Str(root, "type"));
            }
            if (fields.Count == 0) return RdapResult.Fail(query, Tr.T("The response had no recognised RDAP fields.", "الرد لا يحتوي حقول RDAP معروفة."));
            var text = ToText(query, fields);
            return new RdapResult(true, "", query, kind, fields, text);
        }
        catch (Exception ex) { return RdapResult.Fail(query, Tr.T("Could not parse RDAP JSON: ", "تعذّر قراءة JSON من RDAP: ") + ex.Message); }
    }

    static void Add(List<RdapField> fields, string name, string value)
    {
        if (string.IsNullOrWhiteSpace(name) || string.IsNullOrWhiteSpace(value)) return;
        fields.Add(new RdapField(name, value.Trim()));
    }

    static string EventLabel(string action) => action.ToLowerInvariant() switch
    {
        "registration" => Tr.T("Registered", "التسجيل"),
        "expiration" => Tr.T("Expires", "الانتهاء"),
        "last changed" or "last changed date" => Tr.T("Last changed", "آخر تعديل"),
        "last update of rdap database" => Tr.T("RDAP database update", "تحديث قاعدة RDAP"),
        _ => string.IsNullOrEmpty(action) ? Tr.T("Event", "حدث") : action,
    };

    static string EntityName(JsonElement e)
    {
        var vcard = e.TryGetProperty("vcardArray", out var va) ? va : default;
        if (vcard.ValueKind == JsonValueKind.Array && vcard.GetArrayLength() >= 2 && vcard[1].ValueKind == JsonValueKind.Array)
        {
            foreach (var row in vcard[1].EnumerateArray())
            {
                if (row.ValueKind != JsonValueKind.Array || row.GetArrayLength() < 4) continue;
                if (StringOf(row[0]) == "fn") return StringOf(row[3]);
            }
        }
        return First(Str(e, "handle"), Str(e, "fn"));
    }

    static string IpNetwork(JsonElement root)
    {
        if (!root.TryGetProperty("cidr0_cidrs", out var arr) || arr.ValueKind != JsonValueKind.Array) return "";
        return string.Join(", ", arr.EnumerateArray().Select(c =>
        {
            var prefix = First(Str(c, "v4prefix"), Str(c, "v6prefix"));
            var len = Str(c, "length");
            return prefix.Length == 0 ? "" : prefix + "/" + len;
        }).Where(s => s.Length > 0));
    }

    static string Str(JsonElement e, string name)
    {
        if (!e.TryGetProperty(name, out var v)) return "";
        return StringOf(v);
    }

    static string StringOf(JsonElement v) => v.ValueKind switch
    {
        JsonValueKind.String => v.GetString() ?? "",
        JsonValueKind.Number => v.GetRawText(),
        JsonValueKind.Array => string.Join(" ", v.EnumerateArray().Select(StringOf).Where(s => s.Length > 0)),
        JsonValueKind.True => "true",
        JsonValueKind.False => "false",
        _ => "",
    };

    static string First(params string[] values) => values.FirstOrDefault(v => !string.IsNullOrWhiteSpace(v)) ?? "";

    static string ToText(string query, IReadOnlyList<RdapField> fields)
    {
        var sb = new StringBuilder();
        sb.AppendLine($"{Tr.T("Query", "الاستعلام")}: {query}");
        foreach (var f in fields) sb.AppendLine($"{f.Name}: {f.Value}");
        return sb.ToString().TrimEnd();
    }
}
