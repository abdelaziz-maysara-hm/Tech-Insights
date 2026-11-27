using System.Text;
using System.Text.RegularExpressions;

namespace NetSecAtlas.Core;

/// <summary>Builds public lookup links for a file hash or URL. Never sends the file and never embeds an API key.</summary>
public static class Reputation
{
    public const string VirusTotalFile = "https://www.virustotal.com/gui/file/";
    public const string VirusTotalSearch = "https://www.virustotal.com/gui/search/";
    public const string Urlscan = "https://urlscan.io/search/#";

    public static string NormalizeHash(string text)
    {
        var s = string.Concat((text ?? "").Where(Uri.IsHexDigit)).ToLowerInvariant();
        return s;
    }

    public static string? HashKindName(string hex) => hex.Length switch
    {
        32 => "MD5",
        40 => "SHA-1",
        64 => "SHA-256",
        96 => "SHA-384",
        128 => "SHA-512",
        _ => null,
    };

    public static bool LooksLikeUrl(string text)
    {
        var s = (text ?? "").Trim();
        return s.StartsWith("http://", StringComparison.OrdinalIgnoreCase)
            || s.StartsWith("https://", StringComparison.OrdinalIgnoreCase)
            || Regex.IsMatch(s, @"^[a-z0-9.-]+\.[a-z]{2,}([/:?].*)?$", RegexOptions.IgnoreCase);
    }

    public static string VirusTotalFileUrl(string hex) => VirusTotalFile + NormalizeHash(hex);
    public static string VirusTotalSearchUrl(string query) => VirusTotalSearch + Uri.EscapeDataString(query.Trim());
    public static string UrlscanSearchUrl(string query) => Urlscan + Uri.EscapeDataString(query.Trim());

    /// <summary>VirusTotal's URL identifier is the SHA-256 of the canonical URL, but the search page accepts the raw URL without an API key.</summary>
    public static string ToText(string? hashHex, string? url)
    {
        var sb = new StringBuilder();
        sb.AppendLine(Tr.T(
            "Nothing is uploaded from this program. The links open in your browser on the vendor's public page. No API key is used.",
            "لا يُرفع شيء من هذا البرنامج. الروابط تُفتح في متصفحك على الصفحة العامة للخدمة. لا يُستخدم مفتاح API."));
        if (!string.IsNullOrWhiteSpace(hashHex))
        {
            var hex = NormalizeHash(hashHex);
            var kind = HashKindName(hex) ?? Tr.T("hash", "بصمة");
            sb.AppendLine().AppendLine($"{kind}: {hex}");
            sb.AppendLine($"VirusTotal: {VirusTotalFileUrl(hex)}");
            sb.AppendLine($"VirusTotal {Tr.T("search", "بحث")}: {VirusTotalSearchUrl(hex)}");
        }
        if (!string.IsNullOrWhiteSpace(url))
        {
            var u = url.Trim();
            if (!u.Contains("://", StringComparison.Ordinal)) u = "https://" + u;
            sb.AppendLine().AppendLine($"URL: {u}");
            sb.AppendLine($"VirusTotal: {VirusTotalSearchUrl(u)}");
            sb.AppendLine($"urlscan.io: {UrlscanSearchUrl(u)}");
        }
        return sb.ToString().TrimEnd();
    }
}
