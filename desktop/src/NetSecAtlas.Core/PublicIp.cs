using System.Net;
using System.Text;
using System.Text.Json;

namespace NetSecAtlas.Core;

public sealed record PublicIpInfo(string Ip, string City, string Region, string Country, string CountryCode, string Org, string Timezone, string Source, string Text);

public static class PublicIp
{
    /// <summary>HTTPS endpoints that return the caller's public IP with no API key. Tried in order.</summary>
    public static readonly string[] IpEndpoints = { "https://api64.ipify.org", "https://api.ipify.org", "https://ifconfig.me/ip" };

    /// <summary>Free HTTPS geo lookup (no key). Used only after the IP is known. Attribution: ipwho.is.</summary>
    public static string GeoUrl(string ip) => "https://ipwho.is/" + Uri.EscapeDataString(ip);

    public static bool TryParseIp(string text, out string ip)
    {
        ip = (text ?? "").Trim();
        // Cloudflare / ifconfig sometimes wrap with whitespace or a tiny body.
        if (ip.Contains('\n')) ip = ip.Split('\n')[0].Trim();
        return IPAddress.TryParse(ip, out _);
    }

    public static PublicIpInfo ParseGeo(string ip, string json, string source)
    {
        string city = "", region = "", country = "", code = "", org = "", tz = "";
        try
        {
            using var doc = JsonDocument.Parse(json);
            var r = doc.RootElement;
            if (r.ValueKind == JsonValueKind.Object)
            {
                // ipwho.is uses success=false on errors
                if (r.TryGetProperty("success", out var ok) && ok.ValueKind == JsonValueKind.False)
                    return new PublicIpInfo(ip, "", "", "", "", "", "", source, Format(ip, "", "", "", "", "", "", source) + "\n" + (r.TryGetProperty("message", out var m) ? m.GetString() : Tr.T("No geolocation for this address.", "لا موقع جغرافي لهذا العنوان.")));
                city = Get(r, "city");
                region = First(Get(r, "region"), Get(r, "regionName"));
                country = Get(r, "country");
                code = First(Get(r, "country_code"), Get(r, "countryCode"));
                org = First(Get(r, "org"), Get(r, "isp"), Get(r, "connection", "isp"), Get(r, "connection", "org"));
                tz = First(Get(r, "timezone"), Get(r, "timezone", "id"));
            }
        }
        catch { /* geo is optional */ }
        return new PublicIpInfo(ip, city, region, country, code, org, tz, source, Format(ip, city, region, country, code, org, tz, source));
    }

    public static string Format(string ip, string city, string region, string country, string code, string org, string tz, string source)
    {
        var sb = new StringBuilder();
        sb.AppendLine($"{Tr.T("Public IP", "عنوان IP العام")}: {ip}");
        var place = string.Join(", ", new[] { city, region, string.IsNullOrEmpty(code) ? country : $"{country} ({code})" }.Where(s => !string.IsNullOrWhiteSpace(s)));
        if (place.Length > 0) sb.AppendLine($"{Tr.T("Location", "الموقع")}: {place}");
        if (!string.IsNullOrWhiteSpace(org)) sb.AppendLine($"{Tr.T("Network / org", "الشبكة / الجهة")}: {org}");
        if (!string.IsNullOrWhiteSpace(tz)) sb.AppendLine($"{Tr.T("Time zone", "المنطقة الزمنية")}: {tz}");
        if (!string.IsNullOrWhiteSpace(source)) sb.AppendLine($"{Tr.T("Source", "المصدر")}: {source}");
        return sb.ToString().TrimEnd();
    }

    static string Get(JsonElement r, string name)
    {
        if (!r.TryGetProperty(name, out var v)) return "";
        return v.ValueKind == JsonValueKind.String ? v.GetString() ?? "" : v.ValueKind == JsonValueKind.Number ? v.GetRawText() : "";
    }

    static string Get(JsonElement r, string obj, string name)
    {
        if (!r.TryGetProperty(obj, out var o) || o.ValueKind != JsonValueKind.Object) return "";
        return Get(o, name);
    }

    static string First(params string[] values) => values.FirstOrDefault(v => !string.IsNullOrWhiteSpace(v)) ?? "";
}
