using System.Text;

namespace NetSecAtlas.Core;

public static class EncodingTool
{
    public static string ToBase64(string text) => string.IsNullOrEmpty(text) ? "" : System.Convert.ToBase64String(Encoding.UTF8.GetBytes(text));

    public static string FromBase64(string text)
    {
        if (string.IsNullOrEmpty(text)) return "";
        try
        {
            var t = text.Trim().Replace('-', '+').Replace('_', '/'); // also accept Base64URL
            t = t.PadRight(t.Length + (4 - t.Length % 4) % 4, '=');
            return Encoding.UTF8.GetString(System.Convert.FromBase64String(t));
        }
        catch { return Tr.T("Invalid Base64", "Base64 غير صالح"); }
    }

    public static string ToHex(string text) => string.IsNullOrEmpty(text) ? "" : System.Convert.ToHexString(Encoding.UTF8.GetBytes(text)).ToLowerInvariant();

    public static string FromHex(string text)
    {
        if (string.IsNullOrEmpty(text)) return "";
        try
        {
            text = text.Replace(" ", "").Replace("0x", "").Replace(":", "").Replace("-", "");
            return Encoding.UTF8.GetString(System.Convert.FromHexString(text));
        }
        catch { return Tr.T("Invalid hex", "Hex غير صالح"); }
    }

    public static string UrlEncode(string text) => Uri.EscapeDataString(text ?? "");
    public static string UrlDecode(string text) { try { return Uri.UnescapeDataString(text ?? ""); } catch { return Tr.T("Invalid URL encoding", "ترميز URL غير صالح"); } }
}
