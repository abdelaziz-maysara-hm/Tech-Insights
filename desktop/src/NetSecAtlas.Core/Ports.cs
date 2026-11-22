namespace NetSecAtlas.Core;

public sealed record PortEntry(string Protocol, string LocalAddress, int LocalPort, string RemoteAddress, int RemotePort, string State, int Pid, string Process)
{
    public string Service => KnownPorts.Describe(LocalPort, Protocol);
    public bool ExposedToAll => LocalAddress is "0.0.0.0" or "::" or "[::]";
}

public static class KnownPorts
{
    static readonly Dictionary<int, string> Map = new()
    {
        [20] = "FTP data", [21] = "FTP", [22] = "SSH", [23] = "Telnet", [25] = "SMTP", [53] = "DNS", [67] = "DHCP server", [68] = "DHCP client",
        [69] = "TFTP", [80] = "HTTP", [88] = "Kerberos", [110] = "POP3", [123] = "NTP", [135] = "RPC endpoint mapper", [137] = "NetBIOS name",
        [138] = "NetBIOS datagram", [139] = "NetBIOS session", [143] = "IMAP", [161] = "SNMP", [162] = "SNMP trap", [389] = "LDAP", [443] = "HTTPS",
        [445] = "SMB", [464] = "Kerberos password", [465] = "SMTPS", [500] = "IKE (IPsec)", [514] = "Syslog", [587] = "SMTP submission",
        [636] = "LDAPS", [993] = "IMAPS", [995] = "POP3S", [1433] = "SQL Server", [1434] = "SQL Browser", [1521] = "Oracle", [1723] = "PPTP",
        [1900] = "SSDP/UPnP", [3268] = "Global Catalog", [3269] = "Global Catalog SSL", [3306] = "MySQL", [3389] = "RDP", [4500] = "IPsec NAT-T",
        [5353] = "mDNS", [5355] = "LLMNR", [5432] = "PostgreSQL", [5900] = "VNC", [5985] = "WinRM HTTP", [5986] = "WinRM HTTPS",
        [6379] = "Redis", [8080] = "HTTP alt", [8443] = "HTTPS alt", [9389] = "AD Web Services", [27017] = "MongoDB",
    };

    static readonly HashSet<int> Risky = new() { 21, 23, 135, 137, 139, 445, 1433, 3306, 3389, 5432, 5900, 6379, 27017 };

    public static string Describe(int port, string protocol = "TCP") => Map.TryGetValue(port, out var s) ? s : port >= 49152 ? Tr.T("dynamic/ephemeral", "منفذ ديناميكي") : "";
    public static bool IsRisky(int port) => Risky.Contains(port);

    public static string ToCsv(IEnumerable<PortEntry> e) => Csv.Build(new[] { "protocol", "local_address", "local_port", "remote_address", "remote_port", "state", "pid", "process", "service" },
        e.Select(p => new[] { p.Protocol, p.LocalAddress, p.LocalPort.ToString(), p.RemoteAddress, p.RemotePort == 0 ? "" : p.RemotePort.ToString(), p.State, p.Pid.ToString(), p.Process, p.Service }));

    /// <summary>Parses "host:port" / "host port" / "port" lines for remote tests.</summary>
    public static List<(string host, int port)> ParseTargets(string text, string defaultHost)
    {
        var list = new List<(string, int)>();
        foreach (var raw in text.Split('\n', ',', ';'))
        {
            var s = raw.Trim(); if (s.Length == 0 || s.StartsWith('#')) continue;
            string host = defaultHost; string portPart = s;
            int idx = s.LastIndexOfAny(new[] { ':', ' ' });
            if (idx > 0 && !s.StartsWith('[') && s.Count(c => c == ':') <= 1) { host = s[..idx].Trim(); portPart = s[(idx + 1)..]; }
            else if (s.StartsWith('[') && s.Contains("]:")) { host = s[1..s.IndexOf(']')]; portPart = s[(s.IndexOf("]:") + 2)..]; }
            foreach (var p in ExpandPorts(portPart)) list.Add((host, p));
        }
        return list.Distinct().Take(1024).ToList();
    }

    public static IEnumerable<int> ExpandPorts(string spec)
    {
        spec = spec.Trim();
        var dash = spec.IndexOf('-');
        if (dash > 0 && int.TryParse(spec[..dash], out var a) && int.TryParse(spec[(dash + 1)..], out var b) && a is > 0 and <= 65535 && b >= a && b <= 65535 && b - a < 1024)
            return Enumerable.Range(a, b - a + 1);
        return int.TryParse(spec, out var p) && p is > 0 and <= 65535 ? new[] { p } : Array.Empty<int>();
    }
}
