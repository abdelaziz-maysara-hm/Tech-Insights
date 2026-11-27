namespace NetSecAtlas.Core;

/// <summary>Builds the standard WIFI: QR payload used by phone cameras to join a network. Does not generate the QR image itself.</summary>
public static class WifiQr
{
    public const string Wpa = "WPA", Wep = "WEP", Nopass = "nopass";

    /// <summary>WIFI:T:WPA;S:ssid;P:password;H:true;; — special characters in SSID and password are escaped.</summary>
    public static string Payload(string ssid, string password, string security, bool hidden)
    {
        if (string.IsNullOrWhiteSpace(ssid)) throw new ArgumentException(Tr.T("SSID is required.", "اسم الشبكة مطلوب."));
        var t = string.IsNullOrWhiteSpace(security) ? Wpa : security.Trim();
        if (t.Equals("WPA2", StringComparison.OrdinalIgnoreCase) || t.Equals("WPA3", StringComparison.OrdinalIgnoreCase) || t.Equals("WPA/WPA2", StringComparison.OrdinalIgnoreCase))
            t = Wpa;
        if (!t.Equals(Wpa, StringComparison.OrdinalIgnoreCase) && !t.Equals(Wep, StringComparison.OrdinalIgnoreCase) && !t.Equals(Nopass, StringComparison.OrdinalIgnoreCase))
            throw new ArgumentException(Tr.T("Security must be WPA, WEP or nopass.", "نوع الحماية يجب أن يكون WPA أو WEP أو nopass."));
        t = t.Equals(Nopass, StringComparison.OrdinalIgnoreCase) ? Nopass : t.ToUpperInvariant();
        if (t != Nopass && string.IsNullOrEmpty(password))
            throw new ArgumentException(Tr.T("A password is required for WPA/WEP. Use nopass for an open network.", "كلمة المرور مطلوبة لـ WPA/WEP. استخدم nopass لشبكة مفتوحة."));
        var s = "WIFI:T:" + t + ";S:" + Escape(ssid.Trim()) + ";";
        if (t != Nopass) s += "P:" + Escape(password) + ";";
        if (hidden) s += "H:true;";
        return s + ";";
    }

    public static string Escape(string value)
    {
        // WPA QR (ZXing / Android) escapes \, ;, ,, : and " in SSID and password.
        return value.Replace("\\", "\\\\").Replace(";", "\\;").Replace(",", "\\,").Replace(":", "\\:").Replace("\"", "\\\"");
    }
}
