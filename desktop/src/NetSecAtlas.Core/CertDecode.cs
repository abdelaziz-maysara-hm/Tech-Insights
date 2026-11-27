using System.Security.Cryptography;
using System.Security.Cryptography.X509Certificates;
using System.Text;

namespace NetSecAtlas.Core;

public sealed record CertField(string Name, string Value);

/// <summary>Offline parse of a PEM/Base64 certificate or certificate signing request (CSR).</summary>
public sealed record CertDecodeResult(bool Ok, string Kind, string Error, IReadOnlyList<CertField> Fields, string Text)
{
    public static CertDecodeResult Fail(string error) => new(false, "", error, Array.Empty<CertField>(), error);
}

public static class CertDecoder
{
    public static CertDecodeResult Parse(string input)
    {
        var raw = (input ?? "").Trim();
        if (raw.Length == 0) return CertDecodeResult.Fail(Tr.T("Paste a PEM certificate or CSR, or Base64 DER.", "الصق شهادة أو طلب CSR بصيغة PEM، أو DER بـ Base64."));
        try
        {
            if (raw.Contains("BEGIN CERTIFICATE REQUEST", StringComparison.OrdinalIgnoreCase)
                || raw.Contains("BEGIN NEW CERTIFICATE REQUEST", StringComparison.OrdinalIgnoreCase))
                return FromCsr(raw);
            if (raw.Contains("BEGIN CERTIFICATE", StringComparison.OrdinalIgnoreCase))
                return FromCertPem(raw);
            // Bare Base64: try certificate first, then CSR.
            try { return FromCertPem(Wrap("CERTIFICATE", raw)); }
            catch { return FromCsr(Wrap("CERTIFICATE REQUEST", raw)); }
        }
        catch (Exception ex) { return CertDecodeResult.Fail(Tr.T("Could not parse this as a certificate or CSR: ", "تعذّر تفسير هذا كشهادة أو CSR: ") + ex.GetBaseException().Message); }
    }

    static string Wrap(string kind, string body)
    {
        var b = string.Concat(body.Where(c => !char.IsWhiteSpace(c)));
        return $"-----BEGIN {kind}-----\n{b}\n-----END {kind}-----";
    }

    static CertDecodeResult FromCertPem(string pem)
    {
        using var cert = X509Certificate2.CreateFromPem(pem);
        var sans = new List<string>();
        foreach (var ext in cert.Extensions.OfType<X509SubjectAlternativeNameExtension>())
        {
            try { sans.AddRange(ext.EnumerateDnsNames()); } catch { }
            try { foreach (var ip in ext.EnumerateIPAddresses()) sans.Add(ip.ToString()); } catch { }
        }
        var sha256 = Convert.ToHexString(cert.GetCertHash(HashAlgorithmName.SHA256));
        var sha1 = Convert.ToHexString(cert.GetCertHash(HashAlgorithmName.SHA1));
        var notBefore = new DateTimeOffset(DateTime.SpecifyKind(cert.NotBefore, DateTimeKind.Local)).ToUniversalTime();
        var notAfter = new DateTimeOffset(DateTime.SpecifyKind(cert.NotAfter, DateTimeKind.Local)).ToUniversalTime();
        var days = CertChecker.DaysLeft(notAfter, DateTimeOffset.UtcNow);
        var fields = new List<CertField>
        {
            new("Subject", cert.Subject),
            new("Issuer", cert.Issuer),
            new("Serial", cert.SerialNumber),
            new(Tr.T("Not before (UTC)", "ساري من (UTC)"), notBefore.ToString("yyyy-MM-dd HH:mm:ss")),
            new(Tr.T("Not after (UTC)", "ساري حتى (UTC)"), notAfter.ToString("yyyy-MM-dd HH:mm:ss")),
            new(Tr.T("Days left", "الأيام المتبقية"), days.ToString()),
            new("SANs", sans.Count == 0 ? "—" : string.Join(", ", sans)),
            new(Tr.T("Public key", "المفتاح العام"), KeyInfo(cert.PublicKey.Oid?.FriendlyName, cert.GetRSAPublicKey(), cert.GetECDsaPublicKey())),
            new("SHA-256", sha256),
            new("SHA-1", sha1),
            new(Tr.T("Version", "الإصدار"), $"v{cert.Version}"),
            new(Tr.T("Signature algorithm", "خوارزمية التوقيع"), cert.SignatureAlgorithm.FriendlyName ?? cert.SignatureAlgorithm.Value ?? ""),
        };
        return new(true, "certificate", "", fields, ToText(Tr.T("Certificate", "شهادة"), fields));
    }

    static CertDecodeResult FromCsr(string pem)
    {
        var csr = CertificateRequest.LoadSigningRequestPem(pem, HashAlgorithmName.SHA256, CertificateRequestLoadOptions.UnsafeLoadCertificateExtensions);
        var sans = new List<string>();
        foreach (var ext in csr.CertificateExtensions.OfType<X509SubjectAlternativeNameExtension>())
        {
            try { sans.AddRange(ext.EnumerateDnsNames()); } catch { }
        }
        var fields = new List<CertField>
        {
            new("Subject", csr.SubjectName.Name),
            new("SANs", sans.Count == 0 ? "—" : string.Join(", ", sans)),
            new(Tr.T("Public key", "المفتاح العام"), KeyInfo(csr.PublicKey.Oid?.FriendlyName, csr.PublicKey.GetRSAPublicKey(), csr.PublicKey.GetECDsaPublicKey())),
            new(Tr.T("Hash algorithm", "خوارزمية البصمة"), csr.HashAlgorithm.Name ?? ""),
        };
        return new(true, "csr", "", fields, ToText(Tr.T("Certificate signing request (CSR)", "طلب توقيع شهادة (CSR)"), fields));
    }

    static string KeyInfo(string? oid, RSA? rsa, ECDsa? ec)
    {
        if (rsa != null) return $"RSA {rsa.KeySize} bits";
        if (ec != null) return $"ECDSA {ec.KeySize} bits";
        return oid ?? "—";
    }

    static string ToText(string kind, IReadOnlyList<CertField> fields)
    {
        var sb = new StringBuilder();
        sb.AppendLine(kind);
        foreach (var f in fields) sb.AppendLine($"{f.Name}: {f.Value}");
        return sb.ToString().TrimEnd();
    }
}
