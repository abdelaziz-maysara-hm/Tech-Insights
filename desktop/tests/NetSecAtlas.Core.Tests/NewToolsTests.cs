using System.Security.Cryptography;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using NetSecAtlas.Core;

namespace NetSecAtlas.Core.Tests;

public class NewToolsTests
{
    public NewToolsTests() { Tr.Ar = false; }

    static string Jwt(object header, object payload, string sig = "sig")
    {
        string B64(string s) => JwtTool.ToBase64Url(Encoding.UTF8.GetBytes(s));
        var h = System.Text.Json.JsonSerializer.Serialize(header);
        var p = System.Text.Json.JsonSerializer.Serialize(payload);
        return $"{B64(h)}.{B64(p)}.{sig}";
    }

    static (string certPem, string csrPem) MakeCertAndCsr()
    {
        using var rsa = RSA.Create(2048);
        var san = new SubjectAlternativeNameBuilder();
        san.AddDnsName("example.test");
        san.AddDnsName("www.example.test");
        var req = new CertificateRequest("CN=example.test, O=NetSec Atlas, C=EG", rsa, HashAlgorithmName.SHA256, RSASignaturePadding.Pkcs1);
        req.CertificateExtensions.Add(new X509BasicConstraintsExtension(true, false, 0, true));
        req.CertificateExtensions.Add(san.Build());
        using var cert = req.CreateSelfSigned(DateTimeOffset.UtcNow.AddDays(-1), DateTimeOffset.UtcNow.AddYears(10));
        return (cert.ExportCertificatePem(), req.CreateSigningRequestPem());
    }

    [Fact]
    public void JwtDecodesHeaderAndPayloadAndExpiry()
    {
        var now = DateTimeOffset.Parse("2026-11-27T12:00:00Z");
        var token = Jwt(new { alg = "HS256", typ = "JWT" }, new { sub = "ada", iat = now.AddHours(-1).ToUnixTimeSeconds(), exp = now.AddHours(2).ToUnixTimeSeconds(), name = "Ada" });
        var r = JwtTool.Decode(token, now);
        Assert.True(r.Ok, r.Error);
        Assert.Equal("HS256", r.Algorithm);
        Assert.False(r.AlgNone);
        Assert.False(r.Expired);
        Assert.Equal("ada", r.Payload!.Claims.First(c => c.Name == "sub").Value);
        Assert.Contains("Ada", r.Text);
        Assert.Contains("not verified", r.Text, StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public void JwtFlagsExpiredAndAlgNoneAndStripsBearer()
    {
        var now = DateTimeOffset.Parse("2026-11-27T12:00:00Z");
        var r = JwtTool.Decode("Bearer " + Jwt(new { alg = "none" }, new { exp = now.AddHours(-1).ToUnixTimeSeconds() }, ""), now);
        Assert.True(r.Ok);
        Assert.True(r.AlgNone);
        Assert.True(r.Expired);
        Assert.Contains("none", r.Text, StringComparison.OrdinalIgnoreCase);
        Assert.Contains("Expired", r.Text);
    }

    [Fact]
    public void JwtRejectsJweAndBadShape()
    {
        Assert.False(JwtTool.Decode("a.b.c.d.e").Ok);
        Assert.False(JwtTool.Decode("only-one-part").Ok);
        Assert.False(JwtTool.Decode("").Ok);
    }

    [Fact]
    public void CertDecoderReadsSelfSignedPemAndCsr()
    {
        var (certPem, csrPem) = MakeCertAndCsr();
        var cert = CertDecoder.Parse(certPem);
        Assert.True(cert.Ok, cert.Error);
        Assert.Equal("certificate", cert.Kind);
        Assert.Contains("example.test", cert.Text);
        Assert.Contains("NetSec Atlas", cert.Text);
        Assert.Contains("SHA-256", cert.Text);
        Assert.Contains("www.example.test", cert.Text);

        var csr = CertDecoder.Parse(csrPem);
        Assert.True(csr.Ok, csr.Error);
        Assert.Equal("csr", csr.Kind);
        Assert.Contains("example.test", csr.Text);
        Assert.Contains("CSR", csr.Text);
    }

    [Fact]
    public void CertDecoderRejectsEmptyAndGarbage()
    {
        Assert.False(CertDecoder.Parse("").Ok);
        Assert.False(CertDecoder.Parse("not-a-cert").Ok);
    }

    [Fact]
    public void WifiQrBuildsStandardPayloadAndEscapes()
    {
        Assert.Equal("WIFI:T:WPA;S:Office;P:secret;;", WifiQr.Payload("Office", "secret", "WPA2", false));
        Assert.Equal("WIFI:T:nopass;S:Guest;;", WifiQr.Payload("Guest", "", "nopass", false));
        Assert.Equal("WIFI:T:WPA;S:A\\;B;P:x\\:y;H:true;;", WifiQr.Payload("A;B", "x:y", "WPA", true));
        Assert.Throws<ArgumentException>(() => WifiQr.Payload("", "x", "WPA", false));
        Assert.Throws<ArgumentException>(() => WifiQr.Payload("Net", "", "WPA", false));
    }

    [Fact]
    public void ReputationBuildsPublicLinksWithoutUploading()
    {
        var sha = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
        Assert.Equal("SHA-256", Reputation.HashKindName(sha));
        Assert.Equal("https://www.virustotal.com/gui/file/" + sha, Reputation.VirusTotalFileUrl("E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855"));
        var text = Reputation.ToText(sha, "https://example.com/download.exe");
        Assert.Contains("virustotal.com/gui/file/" + sha, text);
        Assert.Contains("urlscan.io/search/#", text);
        Assert.Contains("example.com/download.exe", text);
        Assert.Contains("No API key", text);
        Assert.DoesNotContain("api-key", text, StringComparison.OrdinalIgnoreCase);
        Assert.True(Reputation.LooksLikeUrl("https://example.com"));
        Assert.False(Reputation.LooksLikeUrl("just text"));
    }

    [Fact]
    public void RegexTesterFindsNamedGroupsAndRejectsBadPattern()
    {
        var r = RegexTool.Run(@"\b(?<ip>\d{1,3}(?:\.\d{1,3}){3})\b", "router 192.168.1.1 and 10.0.0.5", ignoreCase: true);
        Assert.True(r.Ok, r.Error);
        Assert.Equal(2, r.Count);
        Assert.Equal("192.168.1.1", r.Hits[0].Value);
        Assert.Contains(r.Hits[0].Groups, g => g.Name == "ip" && g.Value == "192.168.1.1");
        Assert.Contains("2 match", r.Text);
        Assert.False(RegexTool.Run("[unterminated", "abc").Ok);
        Assert.False(RegexTool.Run("", "abc").Ok);
        Assert.Equal(0, RegexTool.Run("zzz", "abc").Count);
    }

    [Fact]
    public void RdapBuildsUrlAndParsesDomainJson()
    {
        Assert.Equal("https://rdap.org/domain/example.com", Rdap.RequestUrl("www.example.com"));
        Assert.Equal("https://rdap.org/ip/8.8.8.8", Rdap.RequestUrl("8.8.8.8"));
        Assert.True(Rdap.IsIp("2001:4860:4860::8888"));
        const string json = """
        {"objectClassName":"domain","ldhName":"example.com","handle":"EXAMPLE-COM",
         "status":["active"],
         "events":[{"eventAction":"registration","eventDate":"1995-08-14T04:00:00Z"},{"eventAction":"expiration","eventDate":"2027-08-13T04:00:00Z"}],
         "nameservers":[{"ldhName":"a.iana-servers.net"},{"ldhName":"b.iana-servers.net"}],
         "entities":[{"roles":["registrar"],"vcardArray":["vcard",[["version",{},"text","4.0"],["fn",{},"text","RESERVED-Internet Assigned Numbers Authority"]]]}]}
        """;
        var r = Rdap.Parse("example.com", json);
        Assert.True(r.Ok, r.Error);
        Assert.Contains("example.com", r.Text);
        Assert.Contains("1995-08-14", r.Text);
        Assert.Contains("a.iana-servers.net", r.Text);
        Assert.Contains("RESERVED-Internet Assigned Numbers Authority", r.Text);
        Assert.Contains("Registered", r.Text);
        Assert.False(Rdap.Parse("x", "{\"errorCode\":404,\"title\":\"Not Found\"}").Ok);
    }

    [Fact]
    public void PublicIpParsesGeoJson()
    {
        Assert.True(PublicIp.TryParseIp("  1.1.1.1\n", out var ip) && ip == "1.1.1.1");
        const string json = """
        {"success":true,"ip":"1.1.1.1","city":"Los Angeles","region":"California","country":"United States","country_code":"US",
         "connection":{"isp":"Cloudflare","org":"Cloudflare, Inc."},"timezone":{"id":"America/Los_Angeles"}}
        """;
        var info = PublicIp.ParseGeo("1.1.1.1", json, "ipwho.is");
        Assert.Equal("1.1.1.1", info.Ip);
        Assert.Equal("Los Angeles", info.City);
        Assert.Contains("United States (US)", info.Text);
        Assert.Contains("Cloudflare", info.Text);
        Assert.Contains("America/Los_Angeles", info.Text);
    }

    [Fact]
    public void PersistenceFormatsEntriesAndIsSafeOnLinux()
    {
        var rows = new[]
        {
            new PersistenceEntry("Current user Run", "OneDrive", "C:\\Users\\a\\OneDrive.exe", @"HKCU\...\Run"),
            new PersistenceEntry("User Startup folder", "Notes.lnk", "C:\\Users\\a\\Startup\\Notes.lnk", "Startup"),
        };
        var text = Persistence.ToText(rows);
        Assert.Contains("OneDrive", text);
        Assert.Contains("Notes.lnk", text);
        Assert.Contains("2", text);
        if (!OperatingSystem.IsWindows())
            Assert.Empty(Persistence.Read());
    }

    [Fact]
    public void TraceHopFormatting()
    {
        var hops = new[]
        {
            new NetDoctor.TraceHop(1, "192.168.1.1", 2, "hop", false),
            new NetDoctor.TraceHop(2, "1.1.1.1", 12, "reached", true),
        };
        var text = NetDoctor.FormatHops(hops);
        Assert.Contains("192.168.1.1", text);
        Assert.Contains("1.1.1.1", text);
        Assert.Contains("Reached the target", text);
        Assert.DoesNotContain("Did not reach", text);
        var incomplete = NetDoctor.FormatHops(new[] { new NetDoctor.TraceHop(1, "*", null, "timeout", false) });
        Assert.Contains("Did not reach", incomplete);
        Assert.Equal(" 1  192.168.1.1                              2 ms", hops[0].Line);
    }
}
