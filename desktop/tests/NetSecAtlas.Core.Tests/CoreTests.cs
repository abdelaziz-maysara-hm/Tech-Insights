using System.Text;
using NetSecAtlas.Core;

namespace NetSecAtlas.Core.Tests;

public class HashingTests
{
    [Fact]
    public async Task KnownVectorsForAbc()
    {
        var r = await Hashing.ComputeAsync(new MemoryStream(Encoding.ASCII.GetBytes("abc")), Hashing.All);
        Assert.Equal("900150983cd24fb0d6963f7d28e17f72", r[HashKind.MD5]);
        Assert.Equal("a9993e364706816aba3e25717850c26c9cd0d89d", r[HashKind.SHA1]);
        Assert.Equal("ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad", r[HashKind.SHA256]);
    }

    [Theory]
    [InlineData("SHA256: BA7816BF 8F01CFEA414140DE5DAE2223B00361A396177A9CB410FF61F20015AD", "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad")]
    [InlineData("  not-a-hash ", "")]
    public void Normalize(string input, string expected) => Assert.Equal(expected, Hashing.Normalize(input));

    [Fact]
    public async Task MatchDetectsAlgorithmAndRejectsWrongHash()
    {
        var r = await Hashing.ComputeAsync(new MemoryStream(Encoding.ASCII.GetBytes("abc")), Hashing.All);
        Assert.Equal(HashKind.SHA1, Hashing.Match("A9993E364706816ABA3E25717850C26C9CD0D89D", r));
        Assert.Null(Hashing.Match(new string('0', 64), r));
        Assert.Null(Hashing.Match("1234", r));
    }

    [Fact]
    public void FindsHashInSumsFile()
    {
        var sums = "aaaa  other.exe\nba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad *NetSecAtlas.HashChecker-win-x64.exe\n";
        Assert.Equal("ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad", Hashing.FindInSumsFile(sums, "netsecatlas.hashchecker-win-x64.exe"));
        Assert.Null(Hashing.FindInSumsFile(sums, "missing.exe"));
    }
}

public class PasswordTests
{
    [Fact]
    public void CommonPasswordIsVeryWeak()
    {
        var r = PasswordAnalyzer.Analyze("P@ssw0rd");
        Assert.Equal(0, r.Score);
    }

    [Fact]
    public void LongPassphraseIsStrong() => Assert.True(PasswordAnalyzer.Analyze("correct-horse-battery-staple-river").Score >= 3);

    [Fact]
    public void SequencesAndYearsArePenalised()
    {
        var r = PasswordAnalyzer.Analyze("abcd2026");
        Assert.True(r.Score <= 1);
        Assert.True(r.Issues.Count >= 2);
    }

    [Fact]
    public void Sha1PrefixAndRangeParsing()
    {
        var h = PwnedPasswords.Sha1Hex("password");
        Assert.Equal("5BAA61E4C9B93F3F0682250B6CF8331B7EE68FD8", h);
        var body = "1E4C9B93F3F0682250B6CF8331B7EE68FD8:9659365\r\n0018A45C4D1DEF81644B54AB7F969B88D65:0\r\n";
        Assert.Equal(9659365, PwnedPasswords.CountInRange(body, h[5..]));
        Assert.Equal(0, PwnedPasswords.CountInRange(body, "0000000000000000000000000000000000A"));
    }
}

public class EmailHeaderTests
{
    const string Raw = "Return-Path: <bounce@mailer-example.net>\r\n" +
        "Received: from b.example by mx.example.com with ESMTPS id 1; Thu, 19 Nov 2026 09:14:07 +0000\r\n" +
        "Received: from a.example\r\n\tby b.example with ESMTP id 2; Thu, 19 Nov 2026 11:13:58 +0200\r\n" +
        "Authentication-Results: mx.example.com; spf=pass smtp.mailfrom=mailer-example.net;\r\n dkim=none; dmarc=fail header.from=example-bank.com\r\n" +
        "From: \"Support <support@example-bank.com>\" <alerts@mailer-example.net>\r\n" +
        "Reply-To: billing@other-example.org\r\nSubject: Hi\r\n\r\nBody: not a header\r\n";

    [Fact]
    public void ParsesAndFlagsPhishingSignals()
    {
        var a = EmailHeaderAnalyzer.Analyze(Raw);
        Assert.Equal("alerts@mailer-example.net", a.FromAddress);
        Assert.Equal("fail", a.Auth!.Dmarc);
        Assert.Equal("pass", a.Auth.Spf);
        Assert.Equal(2, a.Hops.Count);
        Assert.Equal("a.example", a.Hops[0].From);
        Assert.Equal(TimeSpan.FromSeconds(9), a.Hops[1].Delay);
        Assert.Contains(a.Findings, f => f.Level == Level.Bad && f.Text.Contains("DMARC"));
        Assert.Contains(a.Findings, f => f.Level == Level.Bad && f.Text.Contains("support@example-bank.com"));
        Assert.Contains(a.Findings, f => f.Level == Level.Warn && f.Text.Contains("other-example.org"));
        Assert.DoesNotContain(a.Headers, h => h.Key == "Body");
    }

    [Theory]
    [InlineData("mail.example.co.uk", "example.co.uk")]
    [InlineData("a.b.example.com", "example.com")]
    public void OrgDomain(string d, string expected) => Assert.Equal(expected, EmailHeaderAnalyzer.OrgDomain(d));

    [Fact]
    public void ParsesRfc5322DateWithComment()
    {
        var d = EmailHeaderAnalyzer.ParseDate(" Thu, 9 Nov 2026 07:05:01 -0500 (EST)");
        Assert.Equal(new DateTimeOffset(2026, 11, 9, 12, 5, 1, TimeSpan.Zero), d!.Value.ToUniversalTime());
    }
}

public class CertTests
{
    [Fact]
    public void ParsesTargets()
    {
        var t = CertChecker.ParseTargets("# comment\nexample.com\nhttps://Example.org:8443/path\nmail.example.net:993, example.com");
        Assert.Equal(3, t.Count);
        Assert.Equal(new CertTarget("example.org", 8443), t[1]);
        Assert.Equal(993, t[2].Port);
    }

    [Fact]
    public void DaysLeftAndStatus()
    {
        var now = new DateTimeOffset(2026, 11, 19, 0, 0, 0, TimeSpan.Zero);
        Assert.Equal(10, CertChecker.DaysLeft(now.AddDays(10.5), now));
        var r = new CertResult(new("x", 443), true, "", "x", "ca", now, now.AddDays(20), 20, true, "OK", "Tls13", "x");
        Assert.Equal(Level.Warn, r.Status);
        Assert.Equal(Level.Bad, (r with { NameMatches = false, DaysLeft = 200 }).Status);
    }

    [Fact]
    public void CsvEscapesAndBlocksFormulas()
    {
        Assert.Equal("\"a,b\"", Csv.Escape("a,b"));
        Assert.Equal("'=cmd", Csv.Escape("=cmd"));
    }
}

public class LockoutTests
{
    static string Ev(int id, params (string k, string v)[] d) =>
        $"<Event xmlns='http://schemas.microsoft.com/win/2004/08/events/event'><System><EventID>{id}</EventID><TimeCreated SystemTime='2026-11-19T08:00:00.0000000Z'/></System><EventData>{string.Concat(d.Select(x => $"<Data Name='{x.k}'>{x.v}</Data>"))}</EventData></Event>";

    [Fact]
    public void Parses4740CallerComputer()
    {
        var e = LockoutAnalyzer.Parse(Ev(4740, ("TargetUserName", "bob"), ("TargetDomainName", "PC-17")), "DC1");
        Assert.Equal("PC-17", e.Source);
        Assert.Equal("bob", e.User);
    }

    [Fact]
    public void Parses4771And4625Codes()
    {
        var k = LockoutAnalyzer.Parse(Ev(4771, ("TargetUserName", "bob"), ("Status", "0x18"), ("IpAddress", "::ffff:10.0.0.5")), "DC1");
        Assert.Equal("10.0.0.5", k.Source);
        Assert.Contains("Bad password", k.Meaning);
        var n = LockoutAnalyzer.Parse(Ev(4625, ("TargetUserName", "bob"), ("Status", "0xc000006d"), ("SubStatus", "0xC000006A"), ("WorkstationName", "PC-17"), ("IpAddress", "-")), "DC1");
        Assert.Equal("PC-17", n.Source);
        Assert.Equal("Wrong password", n.Meaning);
    }

    [Fact]
    public void RanksLockoutCallerFirstAndBuildsXPath()
    {
        var events = new[]
        {
            new AuthEvent(4625, null, "DC1", "bob", "SRV-1", "0xc000006a", ""), new AuthEvent(4625, null, "DC1", "bob", "SRV-1", "0xc000006a", ""),
            new AuthEvent(4740, null, "DC1", "bob", "PC-17", "", ""), new AuthEvent(4771, null, "DC2", "bob", "PC-17", "0x18", ""),
        };
        Assert.Equal("PC-17", LockoutAnalyzer.RankSources(events)[0].Source);
        var x = LockoutAnalyzer.BuildXPath("CORP\\bob", 2);
        Assert.Contains("EventID=4740", x);
        Assert.Contains("<= 7200000", x);
        Assert.Contains("='bob'", x);
    }
}

public class NetTests
{
    static AdapterInfo Ad(string ip, params string[] gw) => new("Ethernet", "x", "Ethernet", "Up", new[] { ip }, gw, new[] { "192.168.1.1" }, true, 1000);

    [Fact]
    public void ApipaIsFlagged()
    {
        var s = NetDoctor.Diagnose(new[] { Ad("169.254.10.2/16") }, null, null, "fail", null, (false, 0, "x"), "example.com", 443);
        Assert.Contains(s, x => x.Id == "ip" && x.Level == Level.Bad);
    }

    [Fact]
    public void DnsFailureIsReported()
    {
        var s = NetDoctor.Diagnose(new[] { Ad("192.168.1.20/24", "192.168.1.1") }, 2, null, "No such host", null, (false, 0, ""), "example.com", 443);
        Assert.Contains(s, x => x.Id == "dns" && x.Level == Level.Bad);
        Assert.Contains(s, x => x.Id == "gateway" && x.Level == Level.Ok);
    }

    [Fact]
    public void LatencyStats()
    {
        var st = Core.LatencyStats.From(new double?[] { 10, 20, null, 30 });
        Assert.Equal(25, st.LossPercent);
        Assert.Equal(20, st.Median);
        Assert.Equal(10, st.Jitter);
    }

    [Fact]
    public void DnsWireRoundTrip()
    {
        var q = DnsWire.BuildQuery(0x1234, "example.com");
        Assert.Equal(12 + 13 + 4, q.Length);
        Assert.Equal(7, q[12]);
        q[2] |= 0x80; q[3] = 0x83; q[7] = 1; // make it a response with NXDOMAIN
        var a = DnsWire.ParseHeader(q)!;
        Assert.Equal(0x1234, a.Id);
        Assert.Equal(3, a.Rcode);
    }

    [Fact]
    public void PortTargets()
    {
        var t = KnownPorts.ParseTargets("server1:443\n8000-8002\n[2001:db8::1]:22", "h");
        Assert.Contains(("server1", 443), t);
        Assert.Contains(("h", 8001), t);
        Assert.Contains(("2001:db8::1", 22), t);
        Assert.Equal("RDP", KnownPorts.Describe(3389));
    }
}

public class WifiAndHealthTests
{
    [Theory]
    [InlineData(2412, 1)] [InlineData(2437, 6)] [InlineData(2484, 14)] [InlineData(5180, 36)] [InlineData(5745, 149)] [InlineData(5955, 1)]
    public void Channels(int f, int ch) => Assert.Equal(ch, WifiAnalyzer.Channel(f));

    [Fact]
    public void ParsesRsnIe()
    {
        // RSN: ver 1, group CCMP, 1 pairwise CCMP, 2 AKM: PSK(2) + SAE(8)
        byte[] rsn = { 48, 24, 1, 0, 0, 0x0F, 0xAC, 4, 1, 0, 0, 0x0F, 0xAC, 4, 2, 0, 0, 0x0F, 0xAC, 2, 0, 0x0F, 0xAC, 8, 0, 0 };
        var (auth, cipher) = WifiIe.ParseSecurity(rsn, true);
        Assert.Equal("WPA2/WPA3-Personal", auth);
        Assert.Equal("CCMP (AES)", cipher);
        Assert.Equal(("WEP", "WEP"), WifiIe.ParseSecurity(Array.Empty<byte>(), true));
        Assert.Equal(Level.Bad, WifiAnalyzer.RateSecurity("Open", "").level);
    }

    [Fact]
    public void BestChannelAvoidsCrowding()
    {
        var nets = new[] { new WifiNetwork("a", "1", -40, 90, 2412, "WPA2", "", false), new WifiNetwork("b", "2", -45, 90, 2437, "WPA2", "", false) };
        Assert.Equal(11, WifiAnalyzer.BestChannel24(nets));
    }

    [Fact]
    public void HealthScoreIgnoresUnknownAndHalvesWarnings()
    {
        var items = new[]
        {
            new HealthItem("av", "", Level.Ok, "", "", ""), new HealthItem("firewall", "", Level.Warn, "", "", ""),
            new HealthItem("bitlocker", "", Level.Unknown, "", "", ""), new HealthItem("startup", "", Level.Info, "", "", ""),
        };
        Assert.Equal((int)Math.Round(100 * (20 + 7.5) / 35.0), HealthScore.Compute(items));
        Assert.Equal(Level.Bad, HealthScore.RateUpdateAge(new DateTime(2026, 8, 1), new DateTime(2026, 11, 19)).Item1);
    }
}
