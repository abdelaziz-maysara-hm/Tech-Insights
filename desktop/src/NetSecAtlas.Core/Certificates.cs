using System.Net.Security;
using System.Net.Sockets;
using System.Security.Cryptography.X509Certificates;

namespace NetSecAtlas.Core;

public sealed record CertTarget(string Host, int Port)
{
    public override string ToString() => Port == 443 ? Host : $"{Host}:{Port}";
}

public sealed record CertResult(CertTarget Target, bool Connected, string Error, string Subject, string Issuer,
    DateTimeOffset? NotBefore, DateTimeOffset? NotAfter, int? DaysLeft, bool NameMatches, string ChainStatus, string Protocol, string Sans)
{
    public Level Status => !Connected ? Level.Unknown
        : DaysLeft is null or < 0 ? Level.Bad
        : !NameMatches || ChainStatus != "OK" ? Level.Bad
        : DaysLeft <= 14 ? Level.Bad : DaysLeft <= 30 ? Level.Warn : Level.Ok;
}

public static class CertChecker
{
    /// <summary>Parses one target per line: host, host:port, https://host/path, [v6]:port. Lines starting with # are ignored.</summary>
    public static List<CertTarget> ParseTargets(string text)
    {
        var list = new List<CertTarget>();
        foreach (var raw in text.Split('\n', ',', ';'))
        {
            var s = raw.Trim();
            if (s.Length == 0 || s.StartsWith('#')) continue;
            if (Uri.TryCreate(s.Contains("://") ? s : "https://" + s, UriKind.Absolute, out var u) && !string.IsNullOrEmpty(u.Host))
            {
                var host = u.Host.Trim('[', ']');
                var port = u.IsDefaultPort ? 443 : u.Port;
                var t = new CertTarget(host.ToLowerInvariant(), port);
                if (!list.Contains(t)) list.Add(t);
            }
        }
        return list;
    }

    public static int DaysLeft(DateTimeOffset notAfter, DateTimeOffset now) => (int)Math.Floor((notAfter - now).TotalDays);

    public static async Task<CertResult> CheckAsync(CertTarget t, TimeSpan timeout, CancellationToken ct = default)
    {
        X509Certificate2? cert = null; SslPolicyErrors errors = SslPolicyErrors.None; string chain = "OK";
        using var cts = CancellationTokenSource.CreateLinkedTokenSource(ct);
        cts.CancelAfter(timeout);
        try
        {
            using var tcp = new TcpClient();
            await tcp.ConnectAsync(t.Host, t.Port, cts.Token).ConfigureAwait(false);
            await using var ssl = new SslStream(tcp.GetStream(), false, (_, c, ch, e) =>
            {
                if (c != null) cert = new X509Certificate2(c);
                errors = e;
                if (ch != null && ch.ChainStatus.Length > 0)
                    chain = string.Join("; ", ch.ChainStatus.Where(s => s.Status != X509ChainStatusFlags.NoError).Select(s => s.Status.ToString()).Distinct());
                if (chain.Length == 0) chain = "OK";
                return true; // inspect, never trust: we only read the certificate
            });
            await ssl.AuthenticateAsClientAsync(new SslClientAuthenticationOptions { TargetHost = t.Host }, cts.Token).ConfigureAwait(false);
            if (cert is null) return Fail(t, Tr.T("No certificate returned", "لم يُرسل الخادم شهادة"));
            var notAfter = new DateTimeOffset(cert.NotAfter.ToUniversalTime(), TimeSpan.Zero);
            var sans = cert.Extensions.OfType<X509SubjectAlternativeNameExtension>().SelectMany(e => e.EnumerateDnsNames()).ToList();
            if ((errors & SslPolicyErrors.RemoteCertificateChainErrors) == 0) chain = "OK";
            return new(t, true, "", cert.GetNameInfo(X509NameType.SimpleName, false), cert.GetNameInfo(X509NameType.SimpleName, true),
                new DateTimeOffset(cert.NotBefore.ToUniversalTime(), TimeSpan.Zero), notAfter, DaysLeft(notAfter, DateTimeOffset.UtcNow),
                (errors & SslPolicyErrors.RemoteCertificateNameMismatch) == 0, chain, ssl.SslProtocol.ToString(), string.Join(" ", sans.Take(20)));
        }
        catch (OperationCanceledException) when (!ct.IsCancellationRequested) { return Fail(t, Tr.T("Timed out", "انتهت المهلة")); }
        catch (Exception ex) { return Fail(t, ex.GetBaseException().Message); }
        finally { cert?.Dispose(); }
    }

    static CertResult Fail(CertTarget t, string err) => new(t, false, err, "", "", null, null, null, false, "", "", "");

    public static string ToCsv(IEnumerable<CertResult> results) => Csv.Build(
        new[] { "host", "port", "status", "days_left", "not_after_utc", "subject", "issuer", "name_matches", "chain", "protocol", "sans", "error" },
        results.Select(r => new[] { r.Target.Host, r.Target.Port.ToString(), r.Status.ToString(), r.DaysLeft?.ToString() ?? "", r.NotAfter?.ToString("yyyy-MM-dd HH:mm") ?? "",
            r.Subject, r.Issuer, r.Connected ? r.NameMatches.ToString() : "", r.ChainStatus, r.Protocol, r.Sans, r.Error }));
}
