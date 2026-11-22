namespace NetSecAtlas.Core;

public sealed record WifiNetwork(string Ssid, string Bssid, int Rssi, int Quality, int FrequencyMHz, string Auth, string Cipher, bool Connected)
{
    public int Channel => WifiAnalyzer.Channel(FrequencyMHz);
    public string Band => WifiAnalyzer.Band(FrequencyMHz);
}

public static class WifiAnalyzer
{
    public static int Channel(int mhz) => mhz switch
    {
        2484 => 14,
        >= 2412 and <= 2472 => (mhz - 2407) / 5,
        >= 5955 and <= 7115 => (mhz - 5950) / 5,
        >= 5160 and <= 5885 => (mhz - 5000) / 5,
        _ => 0,
    };

    public static string Band(int mhz) => mhz switch { < 3000 => "2.4 GHz", < 5925 => "5 GHz", _ => "6 GHz" };

    public static (Level level, string text) RateSecurity(string auth, string cipher)
    {
        var a = auth.ToUpperInvariant();
        if (a.Contains("WPA3")) return (Level.Ok, "WPA3");
        if (a.Contains("OWE")) return (Level.Ok, Tr.T("Enhanced Open (OWE)", "شبكة مفتوحة مشفرة (OWE)"));
        if (a.Contains("WPA2") || a.Contains("RSNA")) return cipher.ToUpperInvariant().Contains("TKIP") ? (Level.Warn, Tr.T("WPA2 with TKIP: switch to AES", "WPA2 مع TKIP: غيّره إلى AES")) : (Level.Ok, "WPA2 (AES)");
        if (a.Contains("WPA")) return (Level.Bad, Tr.T("WPA (outdated)", "WPA (قديم)"));
        if (cipher.ToUpperInvariant().Contains("WEP")) return (Level.Bad, Tr.T("WEP: broken, replace now", "WEP: مكسور، استبدله فورًا"));
        if (a.Contains("OPEN") || a.Length == 0) return (Level.Bad, Tr.T("Open: no encryption", "مفتوحة: بدون تشفير"));
        return (Level.Unknown, auth);
    }

    public static string SignalText(int rssi) => rssi switch
    {
        >= -55 => Tr.T("Excellent", "ممتازة"), >= -67 => Tr.T("Good", "جيدة"), >= -75 => Tr.T("Fair", "متوسطة"), _ => Tr.T("Weak", "ضعيفة"),
    };

    /// <summary>For 2.4 GHz, counts networks overlapping each of the non-overlapping channels 1, 6 and 11 (±4 channels), weighted by signal.</summary>
    public static Dictionary<int, double> Congestion24(IEnumerable<WifiNetwork> nets)
    {
        var res = new Dictionary<int, double> { [1] = 0, [6] = 0, [11] = 0 };
        foreach (var n in nets.Where(n => n.Band == "2.4 GHz" && n.Channel > 0))
            foreach (var ch in res.Keys.ToList())
                if (Math.Abs(n.Channel - ch) <= 4) res[ch] += Math.Max(0.1, (n.Rssi + 100) / 50.0);
        return res;
    }

    public static int BestChannel24(IEnumerable<WifiNetwork> nets) => Congestion24(nets).OrderBy(p => p.Value).ThenBy(p => p.Key).First().Key;

    public static Dictionary<int, int> CountByChannel(IEnumerable<WifiNetwork> nets, string band) =>
        nets.Where(n => n.Band == band).GroupBy(n => n.Channel).OrderBy(g => g.Key).ToDictionary(g => g.Key, g => g.Count());
}

public static class WifiIe
{
    /// <summary>Derives security from 802.11 information elements: RSN (48) and the WPA vendor IE (221, 00:50:F2 type 1).</summary>
    public static (string Auth, string Cipher) ParseSecurity(ReadOnlySpan<byte> ies, bool privacyBit)
    {
        bool wpa1 = false; var akms = new HashSet<int>(); var ciphers = new HashSet<int>();
        int i = 0;
        while (i + 2 <= ies.Length)
        {
            int id = ies[i], len = ies[i + 1];
            if (i + 2 + len > ies.Length) break;
            var body = ies.Slice(i + 2, len);
            if (id == 48 && len >= 8)
            {
                int p = 2; // version
                if (p + 4 <= len) { ciphers.Add(body[p + 3]); p += 4; }
                if (p + 2 <= len) { int n = body[p] | body[p + 1] << 8; p += 2; for (int k = 0; k < n && p + 4 <= len; k++, p += 4) ciphers.Add(body[p + 3]); }
                if (p + 2 <= len) { int n = body[p] | body[p + 1] << 8; p += 2; for (int k = 0; k < n && p + 4 <= len; k++, p += 4) akms.Add(body[p + 3]); }
            }
            else if (id == 221 && len >= 4 && body[0] == 0x00 && body[1] == 0x50 && body[2] == 0xF2 && body[3] == 1) wpa1 = true;
            i += 2 + len;
        }
        string cipher = ciphers.Contains(9) || ciphers.Contains(8) ? "GCMP" : ciphers.Contains(4) ? (ciphers.Contains(2) ? "CCMP+TKIP" : "CCMP (AES)") : ciphers.Contains(2) ? "TKIP" : "";
        if (akms.Count > 0)
        {
            bool sae = akms.Contains(8) || akms.Contains(24) || akms.Contains(25), psk = akms.Contains(2) || akms.Contains(6);
            bool ent = akms.Contains(1) || akms.Contains(5), suiteB = akms.Contains(12), owe = akms.Contains(18);
            string auth = suiteB ? "WPA3-Enterprise 192-bit" : sae && psk ? "WPA2/WPA3-Personal" : sae ? "WPA3-Personal" : owe ? "OWE" : ent ? "WPA2-Enterprise" : psk ? "WPA2-Personal" : "RSNA";
            return (auth, cipher);
        }
        if (wpa1) return ("WPA", cipher.Length > 0 ? cipher : "TKIP");
        return privacyBit ? ("WEP", "WEP") : ("Open", "");
    }
}
