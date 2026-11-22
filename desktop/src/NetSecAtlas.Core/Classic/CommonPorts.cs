namespace NetSecAtlas.Core;

public record PortRef(int Port, string Protocol, string Name, string Description);

public static class CommonPorts
{
    public static readonly PortRef[] All =
    [
        new(20, "TCP", "FTP-data", "FTP data transfer"),
        new(21, "TCP", "FTP", "FTP control"),
        new(22, "TCP", "SSH", "Secure Shell"),
        new(23, "TCP", "Telnet", "Unencrypted remote login (avoid)"),
        new(25, "TCP", "SMTP", "Mail transfer"),
        new(53, "UDP/TCP", "DNS", "Domain Name System"),
        new(67, "UDP", "DHCP", "DHCP server"),
        new(68, "UDP", "DHCP", "DHCP client"),
        new(80, "TCP", "HTTP", "Web (unencrypted)"),
        new(88, "TCP/UDP", "Kerberos", "Kerberos authentication"),
        new(110, "TCP", "POP3", "Mail retrieval"),
        new(123, "UDP", "NTP", "Network Time Protocol"),
        new(135, "TCP", "RPC", "Windows RPC endpoint mapper"),
        new(139, "TCP", "NetBIOS", "Legacy file sharing"),
        new(143, "TCP", "IMAP", "Mail retrieval"),
        new(161, "UDP", "SNMP", "Network management"),
        new(389, "TCP", "LDAP", "Directory services"),
        new(443, "TCP", "HTTPS", "Secure web"),
        new(445, "TCP", "SMB", "Windows file sharing"),
        new(465, "TCP", "SMTPS", "Secure mail submission"),
        new(500, "UDP", "IKE", "IPsec key exchange"),
        new(514, "UDP", "Syslog", "Syslog"),
        new(587, "TCP", "SMTP", "Authenticated mail submission"),
        new(636, "TCP", "LDAPS", "Secure LDAP"),
        new(993, "TCP", "IMAPS", "Secure IMAP"),
        new(995, "TCP", "POP3S", "Secure POP3"),
        new(1433, "TCP", "SQL Server", "Microsoft SQL Server"),
        new(1521, "TCP", "Oracle", "Oracle Database"),
        new(3306, "TCP", "MySQL", "MySQL / MariaDB"),
        new(3389, "TCP", "RDP", "Remote Desktop"),
        new(5432, "TCP", "PostgreSQL", "PostgreSQL"),
        new(5900, "TCP", "VNC", "Virtual Network Computing"),
        new(8080, "TCP", "HTTP-alt", "Alternate HTTP / proxies"),
        new(8443, "TCP", "HTTPS-alt", "Alternate HTTPS"),
    ];

    /// <summary>Finds ports by number ("443"), name ("rdp") or description words. Empty query returns everything.</summary>
    public static IEnumerable<PortRef> Search(string query)
    {
        query = (query ?? "").Trim();
        if (query.Length == 0) return All;
        if (int.TryParse(query, out var n)) return All.Where(p => p.Port == n);
        return All.Where(p => p.Name.Contains(query, StringComparison.OrdinalIgnoreCase) || p.Description.Contains(query, StringComparison.OrdinalIgnoreCase));
    }
}
