using System.Diagnostics;
using System.Net;
using System.Net.NetworkInformation;
using System.Net.Sockets;
using System.Text;

namespace NetSecAtlas.Core;

public sealed record AdapterInfo(string Name, string Description, string Type, string Status, IReadOnlyList<string> IPv4, IReadOnlyList<string> Gateways, IReadOnlyList<string> Dns, bool Dhcp, long SpeedMbps);
public sealed record StepResult(string Id, string Title, Level Level, string Detail, string Advice);

public sealed record NetReport(DateTimeOffset Time, string Target, int Port, IReadOnlyList<AdapterInfo> Adapters, IReadOnlyList<StepResult> Steps, IReadOnlyList<string> Route)
{
    public string Summary => Steps.FirstOrDefault(s => s.Level == Level.Bad) is { } b
        ? Tr.T($"Likely problem: {b.Title}. {b.Advice}", $"المشكلة المرجحة: {b.Title}. {b.Advice}")
        : Steps.Any(s => s.Level == Level.Warn) ? Tr.T("Connectivity works, with warnings below.", "الاتصال يعمل، مع تحذيرات أدناه.")
        : Tr.T("All checks passed.", "نجحت جميع الفحوص.");

    public string ToText()
    {
        var sb = new StringBuilder();
        sb.AppendLine($"NetSec Atlas Network Troubleshooter 0.1 — {Time:yyyy-MM-dd HH:mm zzz}");
        sb.AppendLine($"{Tr.T("Target", "الهدف")}: {Target}:{Port}");
        sb.AppendLine(Summary).AppendLine();
        foreach (var a in Adapters)
            sb.AppendLine($"[{a.Name}] {a.Description} | {a.Status} | IPv4 {string.Join(", ", a.IPv4)} | GW {string.Join(", ", a.Gateways)} | DNS {string.Join(", ", a.Dns)} | DHCP {a.Dhcp} | {a.SpeedMbps} Mbps");
        sb.AppendLine();
        foreach (var s in Steps) sb.AppendLine($"{s.Level,-7} {s.Title}: {s.Detail}{(s.Advice.Length > 0 ? " → " + s.Advice : "")}");
        if (Route.Count > 0) { sb.AppendLine().AppendLine(Tr.T("Route:", "المسار:")); foreach (var r in Route) sb.AppendLine("  " + r); }
        return sb.ToString();
    }
}

public static class NetDoctor
{
    public static bool IsApipa(string ip) => ip.StartsWith("169.254.");

    public static List<AdapterInfo> GetAdapters() => NetworkInterface.GetAllNetworkInterfaces()
        .Where(n => n.NetworkInterfaceType is not NetworkInterfaceType.Loopback and not NetworkInterfaceType.Tunnel && n.OperationalStatus == OperationalStatus.Up)
        .Select(n =>
        {
            var p = n.GetIPProperties();
            bool dhcp = false; try { if (OperatingSystem.IsWindows()) dhcp = p.GetIPv4Properties()?.IsDhcpEnabled ?? false; } catch { }
            return new AdapterInfo(n.Name, n.Description, n.NetworkInterfaceType.ToString(), n.OperationalStatus.ToString(),
                p.UnicastAddresses.Where(u => u.Address.AddressFamily == AddressFamily.InterNetwork).Select(u => $"{u.Address}/{u.PrefixLength}").ToList(),
                p.GatewayAddresses.Where(g => g.Address.AddressFamily == AddressFamily.InterNetwork && !g.Address.Equals(IPAddress.Any)).Select(g => g.Address.ToString()).ToList(),
                p.DnsAddresses.Select(d => d.ToString()).ToList(), dhcp, n.Speed > 0 ? n.Speed / 1_000_000 : 0);
        }).ToList();

    public static async Task<double?> PingAsync(string host, int timeoutMs = 2000)
    {
        try { using var p = new Ping(); var r = await p.SendPingAsync(host, timeoutMs).ConfigureAwait(false); return r.Status == IPStatus.Success ? r.RoundtripTime : null; }
        catch { return null; }
    }

    public static async Task<(bool ok, double ms, string error)> TcpAsync(string host, int port, int timeoutMs = 4000)
    {
        var sw = Stopwatch.StartNew();
        try
        {
            using var c = new TcpClient();
            using var cts = new CancellationTokenSource(timeoutMs);
            await c.ConnectAsync(host, port, cts.Token).ConfigureAwait(false);
            return (true, sw.Elapsed.TotalMilliseconds, "");
        }
        catch (OperationCanceledException) { return (false, 0, Tr.T("timed out (silently dropped)", "انتهت المهلة (إسقاط صامت)")); }
        catch (SocketException ex) when (ex.SocketErrorCode == SocketError.ConnectionRefused) { return (false, 0, Tr.T("refused (host up, port closed)", "مرفوض (الجهاز يعمل والمنفذ مغلق)")); }
        catch (Exception ex) { return (false, 0, ex.GetBaseException().Message); }
    }

    public static async Task<List<string>> TraceAsync(string host, int maxHops = 20, int timeoutMs = 1500, CancellationToken ct = default)
    {
        var hops = new List<string>();
        using var p = new Ping();
        var data = new byte[32];
        for (int ttl = 1; ttl <= maxHops && !ct.IsCancellationRequested; ttl++)
        {
            var sw = Stopwatch.StartNew();
            PingReply r;
            try { r = await p.SendPingAsync(host, timeoutMs, data, new PingOptions(ttl, true)).ConfigureAwait(false); }
            catch { hops.Add($"{ttl,2}  *"); break; }
            var addr = r.Status is IPStatus.TtlExpired or IPStatus.Success ? r.Address?.ToString() ?? "*" : "*";
            hops.Add($"{ttl,2}  {addr,-40} {(addr == "*" ? "" : $"{sw.ElapsedMilliseconds} ms")}");
            if (r.Status == IPStatus.Success) break;
        }
        return hops;
    }

    /// <summary>Turns raw observations into ordered findings. Pure function, unit tested.</summary>
    public static List<StepResult> Diagnose(IReadOnlyList<AdapterInfo> adapters, double? gatewayPing, IPAddress[]? resolved, string? dnsError,
        double? targetPing, (bool ok, double ms, string error) tcp, string target, int port)
    {
        var s = new List<StepResult>();
        if (adapters.Count == 0)
        {
            s.Add(new("adapter", Tr.T("Network adapter", "كرت الشبكة"), Level.Bad, Tr.T("No connected adapter", "لا يوجد كرت متصل"),
                Tr.T("Check the cable or Wi-Fi switch, and that the adapter is enabled.", "تحقق من الكابل أو مفتاح Wi-Fi وأن الكرت مفعّل.")));
            return s;
        }
        var main = adapters.FirstOrDefault(a => a.Gateways.Count > 0) ?? adapters[0];
        s.Add(new("adapter", Tr.T("Network adapter", "كرت الشبكة"), Level.Ok, $"{main.Name} ({main.Type}, {main.SpeedMbps} Mbps)", ""));
        if (main.IPv4.Count == 0 || main.IPv4.All(IsApipa))
            s.Add(new("ip", Tr.T("IP address", "عنوان IP"), Level.Bad, string.Join(", ", main.IPv4.DefaultIfEmpty("-")),
                Tr.T("169.254.x.x means DHCP failed: restart the router or check the DHCP server.", "العنوان 169.254 يعني فشل DHCP: أعد تشغيل الراوتر أو افحص خادم DHCP.")));
        else s.Add(new("ip", Tr.T("IP address", "عنوان IP"), Level.Ok, string.Join(", ", main.IPv4), ""));
        if (main.Gateways.Count == 0)
            s.Add(new("gateway", Tr.T("Default gateway", "البوابة الافتراضية"), Level.Bad, Tr.T("missing", "غير موجودة"), Tr.T("Without a gateway nothing outside the local network is reachable.", "بدون بوابة لا يمكن الوصول لأي شيء خارج الشبكة المحلية.")));
        else if (gatewayPing is null)
            s.Add(new("gateway", Tr.T("Default gateway", "البوابة الافتراضية"), Level.Warn, Tr.T($"{main.Gateways[0]} did not answer ping", $"{main.Gateways[0]} لم يرد على ping"),
                Tr.T("Some routers ignore ping; if later steps fail too, restart the router.", "بعض الراوترات تتجاهل ping؛ إذا فشلت الخطوات التالية أيضًا أعد تشغيل الراوتر.")));
        else s.Add(new("gateway", Tr.T("Default gateway", "البوابة الافتراضية"), gatewayPing > 50 ? Level.Warn : Level.Ok, $"{main.Gateways[0]} — {gatewayPing:N0} ms",
            gatewayPing > 50 ? Tr.T("High latency to your own router: Wi-Fi signal or local congestion.", "زمن استجابة عالٍ للراوتر نفسه: ضعف إشارة Wi-Fi أو ازدحام محلي.") : ""));
        if (resolved is null || resolved.Length == 0)
            s.Add(new("dns", "DNS", Level.Bad, dnsError ?? Tr.T("no answer", "لا رد"), Tr.T($"Name resolution failed. Try another DNS server ({string.Join(", ", main.Dns.Take(2))} configured).", $"فشل تحليل الأسماء. جرّب خادم DNS آخر (المضبوط حاليًا: {string.Join(", ", main.Dns.Take(2))}).")));
        else s.Add(new("dns", "DNS", Level.Ok, $"{target} → {string.Join(", ", resolved.Take(3).Select(a => a.ToString()))}", ""));
        if (targetPing is null) s.Add(new("ping", "Ping", Level.Info, Tr.T("no reply (ICMP often blocked)", "لا رد (ICMP محجوب غالبًا)"), ""));
        else s.Add(new("ping", "Ping", targetPing > 150 ? Level.Warn : Level.Ok, $"{targetPing:N0} ms", targetPing > 150 ? Tr.T("High latency.", "زمن استجابة مرتفع.") : ""));
        s.Add(tcp.ok
            ? new("tcp", Tr.T($"TCP port {port}", $"منفذ TCP {port}"), Level.Ok, $"{tcp.ms:N0} ms", "")
            : new("tcp", Tr.T($"TCP port {port}", $"منفذ TCP {port}"), resolved is { Length: > 0 } ? Level.Bad : Level.Warn, tcp.error,
                Tr.T("A firewall, proxy or the service itself is blocking the connection.", "جدار ناري أو بروكسي أو الخدمة نفسها تمنع الاتصال.")));
        return s;
    }

    public static async Task<NetReport> RunAsync(string target, int port, bool trace, IProgress<string>? progress = null, CancellationToken ct = default)
    {
        progress?.Report(Tr.T("Reading adapters…", "قراءة كروت الشبكة…"));
        var adapters = GetAdapters();
        var gw = adapters.SelectMany(a => a.Gateways).FirstOrDefault();
        progress?.Report(Tr.T("Pinging gateway…", "اختبار البوابة…"));
        double? gwPing = gw is null ? null : await PingAsync(gw).ConfigureAwait(false);
        progress?.Report(Tr.T("Resolving name…", "تحليل الاسم…"));
        IPAddress[]? ips = null; string? dnsErr = null;
        try { ips = IPAddress.TryParse(target, out var ip) ? new[] { ip } : await Dns.GetHostAddressesAsync(target, ct).ConfigureAwait(false); }
        catch (Exception ex) { dnsErr = ex.GetBaseException().Message; }
        progress?.Report(Tr.T("Testing reachability…", "اختبار الوصول…"));
        var tPing = ips is { Length: > 0 } ? await PingAsync(ips[0].ToString()).ConfigureAwait(false) : null;
        var tcp = ips is { Length: > 0 } ? await TcpAsync(ips[0].ToString(), port).ConfigureAwait(false) : (false, 0, dnsErr ?? "");
        var route = new List<string>();
        if (trace && ips is { Length: > 0 }) { progress?.Report(Tr.T("Tracing route…", "تتبع المسار…")); route = await TraceAsync(ips[0].ToString(), ct: ct).ConfigureAwait(false); }
        return new(DateTimeOffset.Now, target, port, adapters, Diagnose(adapters, gwPing, ips, dnsErr, tPing, tcp, target, port), route);
    }
}
