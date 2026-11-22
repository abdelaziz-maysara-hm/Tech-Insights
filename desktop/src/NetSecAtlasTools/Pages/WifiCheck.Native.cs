using System.Runtime.InteropServices;
using NetSecAtlas.Core;

namespace WifiCheck;

/// <summary>Native Wifi API (wlanapi.dll): scan and read the BSS list. Windows 11 24H2+ requires Location access for desktop apps.</summary>
static class Native
{
    [DllImport("wlanapi.dll")] static extern uint WlanOpenHandle(uint ver, IntPtr r, out uint neg, out IntPtr h);
    [DllImport("wlanapi.dll")] static extern uint WlanCloseHandle(IntPtr h, IntPtr r);
    [DllImport("wlanapi.dll")] static extern uint WlanEnumInterfaces(IntPtr h, IntPtr r, out IntPtr list);
    [DllImport("wlanapi.dll")] static extern uint WlanScan(IntPtr h, ref Guid g, IntPtr ssid, IntPtr ie, IntPtr r);
    [DllImport("wlanapi.dll")] static extern uint WlanGetNetworkBssList(IntPtr h, ref Guid g, IntPtr ssid, int bssType, bool sec, IntPtr r, out IntPtr list);
    [DllImport("wlanapi.dll")] static extern uint WlanQueryInterface(IntPtr h, ref Guid g, int op, IntPtr r, out int size, out IntPtr data, out int type);
    [DllImport("wlanapi.dll")] static extern void WlanFreeMemory(IntPtr p);

    public sealed class AccessDeniedException : Exception { }

    public static async Task<List<WifiNetwork>> ScanAsync()
    {
        var rc = WlanOpenHandle(2, IntPtr.Zero, out _, out var h);
        if (rc != 0) throw new InvalidOperationException(Tr.T("The WLAN service is not running or there is no Wi-Fi adapter.", "خدمة WLAN لا تعمل أو لا يوجد كرت Wi-Fi.") + $" ({rc})");
        try
        {
            if (WlanEnumInterfaces(h, IntPtr.Zero, out var ifl) != 0) return new();
            var guids = new List<Guid>();
            try
            {
                int n = Marshal.ReadInt32(ifl);
                for (int i = 0; i < n; i++) guids.Add(Marshal.PtrToStructure<Guid>(ifl + 8 + i * 532));
            }
            finally { WlanFreeMemory(ifl); }
            if (guids.Count == 0) throw new InvalidOperationException(Tr.T("No Wi-Fi adapter found.", "لم يُعثر على كرت Wi-Fi."));
            foreach (var g0 in guids) { var g = g0; uint s = WlanScan(h, ref g, IntPtr.Zero, IntPtr.Zero, IntPtr.Zero); if (s == 5) throw new AccessDeniedException(); }
            await Task.Delay(4000);
            var nets = new List<WifiNetwork>();
            foreach (var g0 in guids)
            {
                var g = g0;
                string connected = "";
                if (WlanQueryInterface(h, ref g, 7, IntPtr.Zero, out _, out var ca, out _) == 0)
                {
                    try { var b = new byte[6]; Marshal.Copy(ca + 560, b, 0, 6); connected = Mac(b); } finally { WlanFreeMemory(ca); }
                }
                uint r = WlanGetNetworkBssList(h, ref g, IntPtr.Zero, 3, false, IntPtr.Zero, out var bl);
                if (r == 5) throw new AccessDeniedException();
                if (r != 0) continue;
                try
                {
                    int count = Marshal.ReadInt32(bl + 4);
                    for (int i = 0; i < count; i++)
                    {
                        IntPtr e = bl + 8 + i * 360;
                        int ssidLen = Math.Min(32, Marshal.ReadInt32(e));
                        var ssidBytes = new byte[ssidLen]; Marshal.Copy(e + 4, ssidBytes, 0, ssidLen);
                        var bssid = new byte[6]; Marshal.Copy(e + 40, bssid, 0, 6);
                        int rssi = Marshal.ReadInt32(e + 56), quality = Marshal.ReadInt32(e + 60);
                        ushort cap = (ushort)Marshal.ReadInt16(e + 88);
                        int freqKhz = Marshal.ReadInt32(e + 92);
                        int ieOff = Marshal.ReadInt32(e + 352), ieSize = Marshal.ReadInt32(e + 356);
                        var ies = new byte[Math.Max(0, ieSize)]; if (ieSize > 0) Marshal.Copy(e + ieOff, ies, 0, ieSize);
                        var (auth, cipher) = WifiIe.ParseSecurity(ies, (cap & 0x10) != 0);
                        var mac = Mac(bssid);
                        var ssid = System.Text.Encoding.UTF8.GetString(ssidBytes);
                        nets.Add(new(ssid.Length == 0 ? Tr.T("(hidden)", "(مخفية)") : ssid, mac, rssi, quality, freqKhz / 1000, auth, cipher, mac == connected));
                    }
                }
                finally { WlanFreeMemory(bl); }
            }
            return nets;
        }
        finally { WlanCloseHandle(h, IntPtr.Zero); }
    }

    static string Mac(byte[] b) => string.Join(":", b.Select(x => x.ToString("x2")));
}
