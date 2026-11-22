using System.Windows;
using System.Windows.Controls;
using NetSecAtlas.Core;
using NetSecAtlas.Ui;
using NetSecAtlasTools;

namespace WifiCheck;

public sealed class WifiCheckPage : ToolPage
{
    List<WifiNetwork> _nets = new();
    string? _error;
    bool _sample;

    public WifiCheckPage() : base("WifiCheck", "Wi-Fi Checker", "فاحص Wi-Fi",
        "See nearby networks, channels, signal strength and how well each one is secured.", "اعرض الشبكات القريبة وقنواتها وقوة الإشارة ومستوى حماية كل منها.", "wifi-checker", 1100, 760)
    {
        Loaded += async (_, _) => { if (!AtlasApp.Demo) await ScanAsync(); };
    }

    protected override Task OnDemoAsync()
    {
        _sample = true;
        _nets = new()
        {
            new("HomeNet", "a4:2b:b0:11:22:33", -48, 96, 5180, "WPA2/WPA3-Personal", "CCMP (AES)", true),
            new("HomeNet", "a4:2b:b0:11:22:34", -52, 90, 2437, "WPA2/WPA3-Personal", "CCMP (AES)", false),
            new("Neighbour-2G", "10:7b:44:aa:bb:cc", -63, 74, 2437, "WPA2-Personal", "CCMP (AES)", false),
            new("Cafe Free WiFi", "c8:3a:35:01:02:03", -71, 58, 2412, "Open", "", false),
            new("OldRouter", "00:14:6c:0a:0b:0c", -78, 44, 2462, "WPA", "TKIP", false),
            new("Office-5G", "f0:9f:c2:10:20:30", -66, 70, 5745, "WPA2-Enterprise", "CCMP (AES)", false),
        };
        Rebuild();
        SetStatus(Tr.T("Sample data shown.", "بيانات تجريبية معروضة."));
        return Task.CompletedTask;
    }

    async Task ScanAsync()
    {
        _sample = false; _error = null;
        SetStatus(Tr.T("Scanning (about 4 seconds)…", "جارٍ البحث (حوالي 4 ثوانٍ)…"));
        try { _nets = await Native.ScanAsync(); SetStatus(Tr.T($"{_nets.Count} access points found.", $"تم العثور على {_nets.Count} نقطة وصول.")); }
        catch (Native.AccessDeniedException)
        {
            _error = Tr.T("Windows blocked the scan. Turn on Settings → Privacy & security → Location → \"Location services\" and \"Let desktop apps access your location\", then scan again. This app never reads or stores your location.",
                          "منع ويندوز البحث. فعّل الإعدادات ← الخصوصية والأمان ← الموقع ← «خدمات الموقع» و«السماح لتطبيقات سطح المكتب بالوصول إلى موقعك» ثم أعد البحث. هذا البرنامج لا يقرأ موقعك ولا يحفظه.");
        }
        catch (Exception ex) { _error = ex.Message; }
        Rebuild();
    }

    protected override UIElement BuildBody()
    {
        var s = U.Stack(U.Row(U.AsyncBtn(Tr.T("Scan", "ابحث"), ScanAsync, true).Aid("run")));
        if (_error != null) s.Children.Add(U.FindingRow(Level.Warn, Tr.T("Scan not available", "البحث غير متاح"), _error));
        if (_sample) s.Children.Add(U.FindingRow(Level.Info, Tr.T("Sample data", "بيانات تجريبية"), Tr.T("Illustrative networks from \"Try a sample\". Press Scan to see the real ones around you.", "شبكات توضيحية من «جرّب مثالًا». اضغط «ابحث» لرؤية الشبكات الحقيقية حولك.")));
        if (_nets.Count > 0)
        {
            var mine = _nets.FirstOrDefault(n => n.Connected);
            if (mine != null)
            {
                var (lvl, sec) = WifiAnalyzer.RateSecurity(mine.Auth, mine.Cipher);
                s.Children.Add(U.Card(U.Stack(U.H(Tr.T($"Your network: {mine.Ssid}", $"شبكتك: {mine.Ssid}")),
                    U.FindingRow(lvl, Tr.T("Security", "الحماية"), sec),
                    U.FindingRow(mine.Rssi >= -67 ? Level.Ok : Level.Warn, Tr.T("Signal", "الإشارة"), $"{mine.Rssi} dBm — {WifiAnalyzer.SignalText(mine.Rssi)} ({mine.Band}, {Tr.T("channel", "القناة")} {mine.Channel})"))));
            }
            var cong = WifiAnalyzer.Congestion24(_nets);
            s.Children.Add(U.Card(U.Stack(U.H(Tr.T("2.4 GHz channel advice", "نصيحة قنوات 2.4 GHz")),
                U.P(Tr.T($"Least crowded of the non-overlapping channels 1, 6 and 11: channel {WifiAnalyzer.BestChannel24(_nets)}. Load: ", $"أقل القنوات غير المتداخلة (1 و6 و11) ازدحامًا: القناة {WifiAnalyzer.BestChannel24(_nets)}. الحمل: ")
                    + string.Join(" · ", cong.Select(c => $"{c.Key}: {c.Value:N1}"))),
                U.P(Tr.T("Prefer 5 GHz or 6 GHz when the device is close to the router: more channels and less interference.", "فضّل 5 أو 6 GHz عندما يكون الجهاز قريبًا من الراوتر: قنوات أكثر وتداخل أقل."), U.Muted))));
            s.Children.Add(U.Table(new[] { "SSID", "BSSID", Tr.T("Signal", "الإشارة"), Tr.T("Band", "النطاق"), Tr.T("Channel", "القناة"), Tr.T("Security", "الحماية"), Tr.T("Rating", "التقييم") },
                _nets.OrderByDescending(n => n.Rssi).Select(n => new[] { (n.Connected ? "★ " : "") + n.Ssid, n.Bssid, $"{n.Rssi} dBm ({WifiAnalyzer.SignalText(n.Rssi)})", n.Band, n.Channel.ToString(),
                    $"{n.Auth} {n.Cipher}".Trim(), WifiAnalyzer.RateSecurity(n.Auth, n.Cipher).text })));
            s.Children.Add(U.Row(U.Link(Tr.T("Wi-Fi 6 vs Wi-Fi 5 in practice", "Wi-Fi 6 مقابل Wi-Fi 5 عمليًا"), Links.Article("wifi-6-vs-wifi-5-practical")), new TextBlock { Width = 20 },
                U.Link(Tr.T("Secure your home router", "أمّن راوتر المنزل"), Links.Article("home-router-security-basics"))));
        }
        return U.Scroll(s);
    }
}
