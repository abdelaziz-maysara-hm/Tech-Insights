using NetSecAtlas.Core;
using NetSecAtlas.Ui;
using NetSecAtlasTools.Pages;

namespace NetSecAtlasTools;

/// <summary>The tool list, in navigation order. Ids are stable: they are used by --tool, UI tests and screenshots.</summary>
public static class ToolRegistry
{
    public const string Everyday = "everyday", Network = "network", Admin = "admin", Utils = "utils";

    public static string CategoryName(string key) => key switch
    {
        Everyday => Tr.T("EVERYDAY SECURITY", "الأمان اليومي"),
        Network => Tr.T("NETWORKING", "الشبكات"),
        Admin => Tr.T("ADMIN & EMAIL", "الإدارة والبريد"),
        Utils => Tr.T("UTILITIES", "أدوات مساعدة"),
        _ => key,
    };

    public static List<ToolPage> Create()
    {
        var list = new List<(string cat, ToolPage page)>
        {
            ("", new HomePage()),
            (Everyday, new HealthCheck.HealthCheckPage()),
            (Everyday, new HashChecker.HashCheckerPage()),
            (Everyday, new PasswordCheck.PasswordCheckPage()),
            (Everyday, new WifiCheck.WifiCheckPage()),
            (Everyday, new ReputationPage()),
            (Everyday, new StartupPage()),
            (Everyday, new WifiQrPage()),
            (Network, new NetDoctor.NetDoctorPage()),
            (Network, new PingMonitor.PingMonitorPage()),
            (Network, new DnsBench.DnsBenchPage()),
            (Network, new PortCheck.PortCheckPage()),
            (Network, new SubnetPage()),
            (Network, new VlsmPage()),
            (Network, new RangePage()),
            (Network, new IpConvertPage()),
            (Network, new MacPage()),
            (Network, new RdapPage()),
            (Network, new PublicIpPage()),
            (Network, new TraceroutePage()),
            (Admin, new LockoutTracer.LockoutTracerPage()),
            (Admin, new CertExpiry.CertExpiryPage()),
            (Admin, new HeaderAnalyzer.HeaderAnalyzerPage()),
            (Admin, new CertDecodePage()),
            (Utils, new EncodingPage()),
            (Utils, new TimestampPage()),
            (Utils, new JwtPage()),
            (Utils, new RegexPage()),
        };
        foreach (var (cat, page) in list) page.Category = cat;
        return list.Select(x => x.page).ToList();
    }
}
