using System.Text;

namespace NetSecAtlasTools;

public static class EncodingTool
{
    public static string ToBase64(string text)
    {
        if (string.IsNullOrEmpty(text)) return "";
        return Convert.ToBase64String(Encoding.UTF8.GetBytes(text));
    }

    public static string FromBase64(string text)
    {
        if (string.IsNullOrEmpty(text)) return "";
        try { return Encoding.UTF8.GetString(Convert.FromBase64String(text.Trim())); }
        catch { return "Invalid Base64"; }
    }

    public static string ToHex(string text)
    {
        if (string.IsNullOrEmpty(text)) return "";
        return Convert.ToHexString(Encoding.UTF8.GetBytes(text)).ToLowerInvariant();
    }

    public static string FromHex(string text)
    {
        if (string.IsNullOrEmpty(text)) return "";
        try
        {
            text = text.Replace(" ", "").Replace("0x", "");
            return Encoding.UTF8.GetString(Convert.FromHexString(text));
        }
        catch { return "Invalid hex"; }
    }
}
