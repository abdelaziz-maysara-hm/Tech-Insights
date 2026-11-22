using NetSecAtlas.Core;

[assembly: Xunit.CollectionBehavior(DisableTestParallelization = true)]

namespace NetSecAtlas.Core.Tests;

/// <summary>Tests for the calculators carried over from NetSecAtlasTools 1.x (subnet, VLSM, range, IP, MAC, encoding, timestamp, password generator, text hash).</summary>
public class ClassicToolsTests
{
    public ClassicToolsTests() { Tr.Ar = false; }

    [Theory]
    [InlineData("192.168.1.10/24", "192.168.1.0/24", "255.255.255.0", "0.0.0.255", "192.168.1.255", "192.168.1.1", "192.168.1.254", 256, 254)]
    [InlineData("192.168.10.77/26", "192.168.10.64/26", "255.255.255.192", "0.0.0.63", "192.168.10.127", "192.168.10.65", "192.168.10.126", 64, 62)]
    [InlineData("10.0.0.5/255.255.0.0", "10.0.0.0/16", "255.255.0.0", "0.0.255.255", "10.0.255.255", "10.0.0.1", "10.0.255.254", 65536, 65534)]
    [InlineData("10.0.0.5 255.255.255.252", "10.0.0.4/30", "255.255.255.252", "0.0.0.3", "10.0.0.7", "10.0.0.5", "10.0.0.6", 4, 2)]
    [InlineData("10.0.0.4/31", "10.0.0.4/31", "255.255.255.254", "0.0.0.1", "10.0.0.5", "10.0.0.4", "10.0.0.5", 2, 2)]
    [InlineData("10.0.0.9/32", "10.0.0.9/32", "255.255.255.255", "0.0.0.0", "10.0.0.9", "10.0.0.9", "10.0.0.9", 1, 1)]
    [InlineData("8.8.8.8/0", "0.0.0.0/0", "0.0.0.0", "255.255.255.255", "255.255.255.255", "0.0.0.1", "255.255.255.254", 4294967296L, 4294967294L)]
    public void Subnet(string input, string net, string mask, string wildcard, string bc, string first, string last, long total, long usable)
    {
        var s = SubnetCalculator.Calculate(input);
        Assert.Equal(net, s.Network); Assert.Equal(mask, s.Netmask); Assert.Equal(wildcard, s.Wildcard); Assert.Equal(bc, s.Broadcast);
        Assert.Equal(first, s.FirstUsable); Assert.Equal(last, s.LastUsable); Assert.Equal(total, s.Total); Assert.Equal(usable, s.Usable);
    }

    [Theory]
    [InlineData("192.168.1.0")]
    [InlineData("192.168.1.300/24")]
    [InlineData("192.168.1.0/255.0.255.0")]
    [InlineData("")]
    public void SubnetRejectsBadInput(string input) => Assert.ThrowsAny<Exception>(() => SubnetCalculator.Calculate(input));

    [Fact]
    public void VlsmLargestFirstAndContiguous()
    {
        var rows = VlsmCalculator.Plan("10.10.0.0/22", VlsmCalculator.ParseRequests("Users 300\nServers 60\nVoIP 100\nLinks: 2"));
        Assert.Equal(new[] { "Users", "VoIP", "Servers", "Links" }, rows.Select(r => r.Name));
        Assert.Equal(("10.10.0.0", 23), (rows[0].Network, rows[0].Prefix));
        Assert.Equal(("10.10.2.0", 25), (rows[1].Network, rows[1].Prefix));
        Assert.Equal(("10.10.2.128", 26), (rows[2].Network, rows[2].Prefix));
        Assert.Equal(("10.10.2.192", 30), (rows[3].Network, rows[3].Prefix));
        Assert.Equal("10.10.2.195", rows[3].Broadcast);
    }

    [Fact]
    public void VlsmTooBig() => Assert.Throws<ArgumentException>(() => VlsmCalculator.Plan("192.168.1.0/24", new[] { ("A", 200), ("B", 100) }));

    [Fact]
    public void VlsmLegacyTextApiStillWorks() => Assert.Contains("192.168.1.0/25", VlsmCalculator.Calculate("192.168.1.0/24", new() { ("A", 100) }));

    [Theory]
    [InlineData(1, 30)] [InlineData(2, 30)] [InlineData(3, 29)] [InlineData(254, 24)] [InlineData(255, 23)]
    public void VlsmPrefixForHosts(int hosts, int prefix) => Assert.Equal(prefix, VlsmCalculator.PrefixForHosts(hosts));

    [Fact]
    public void RangeToCidrMinimalBlocks()
    {
        Assert.Equal("192.168.1.10/31\n192.168.1.12/30\n192.168.1.16/28\n192.168.1.32/27\n192.168.1.64/27\n192.168.1.96/30\n192.168.1.100/32",
            RangeToCidr.Convert("192.168.1.10 - 192.168.1.100"));
        Assert.Equal("10.0.0.0/8", RangeToCidr.Convert("10.0.0.0-10.255.255.255"));
    }

    [Fact]
    public void RangeToCidrFullSpaceTerminates()
    {
        Assert.Equal(new[] { "0.0.0.0/0" }, RangeToCidr.Blocks(0, uint.MaxValue));
        Assert.Equal(new[] { "255.255.255.254/31" }, RangeToCidr.Blocks(Ipv4.Parse("255.255.255.254"), uint.MaxValue));
    }

    [Fact]
    public void RangeRejectsReversed() => Assert.Throws<ArgumentException>(() => RangeToCidr.Convert("10.0.0.9 - 10.0.0.1"));

    [Fact]
    public void IpConverterRoundTrips()
    {
        Assert.Contains("Decimal: 3232235777", IpConverter.Convert("192.168.1.1"));
        Assert.Contains("0xC0A80101", IpConverter.Convert("192.168.1.1"));
        Assert.Contains("11000000.10101000.00000001.00000001", IpConverter.Convert("192.168.1.1"));
        Assert.Contains("IP:      192.168.1.1", IpConverter.Convert("3232235777"));
        Assert.Contains("IP:      192.168.1.1", IpConverter.Convert("0xC0A80101"));
        Assert.Equal("Invalid IP.", IpConverter.Convert("1.2.3.x"));
    }

    [Theory]
    [InlineData("00:50:56:C0:00:08", "VMware")]
    [InlineData("00-0c-29-aa-bb-cc", "VMware")]
    [InlineData("0800.27aa.bbcc", "Oracle VirtualBox")]
    [InlineData("00155D010203", "Microsoft Hyper-V")]
    public void MacVendor(string mac, string vendor) => Assert.Equal(vendor, MacLookup.Vendor(mac));

    [Fact]
    public void MacUnknownAndInvalid()
    {
        Assert.Null(MacLookup.Vendor("02:00:00:00:00:01"));
        Assert.Contains("Unknown vendor", MacLookup.Lookup("02:00:00:00:00:01"));
        Assert.Equal("Enter a MAC address.", MacLookup.Lookup("zz"));
        Assert.True(MacLookup.Count > 300);
    }

    [Fact]
    public void EncodingRoundTrips()
    {
        const string text = "NetSec Atlas — نت سك أطلس";
        Assert.Equal(text, EncodingTool.FromBase64(EncodingTool.ToBase64(text)));
        Assert.Equal(text, EncodingTool.FromHex(EncodingTool.ToHex(text)));
        Assert.Equal(text, EncodingTool.UrlDecode(EncodingTool.UrlEncode(text)));
        Assert.Equal("aGk", EncodingTool.ToBase64("hi").TrimEnd('='));
        Assert.Equal("hi", EncodingTool.FromBase64("aGk")); // missing padding accepted
        Assert.Equal("6869", EncodingTool.ToHex("hi"));
        Assert.Equal("hi", EncodingTool.FromHex("0x68 0x69"));
        Assert.Equal("Invalid Base64", EncodingTool.FromBase64("@@@"));
        Assert.Equal("Invalid hex", EncodingTool.FromHex("zz"));
    }

    [Fact]
    public void TimestampSecondsMillisAndDates()
    {
        Assert.Contains("UTC:   2025-11-21 16:00:00", TimestampTool.Convert("1763740800"));
        Assert.Contains("milliseconds", TimestampTool.Convert("1763740800000"));
        Assert.Contains("UTC:   2025-11-21 16:00:00", TimestampTool.Convert("1763740800000"));
        Assert.Contains("Unix:    1763740800", TimestampTool.Convert("2025-11-21T16:00:00Z"));
        Assert.Equal("Invalid input.", TimestampTool.Convert("not a date"));
    }

    [Fact]
    public void PasswordGeneratorIncludesEverySet()
    {
        for (int i = 0; i < 200; i++)
        {
            var p = PasswordTool.Generate(8, true, true, true, true);
            Assert.Equal(8, p.Length);
            Assert.Contains(p, char.IsLower); Assert.Contains(p, char.IsUpper); Assert.Contains(p, char.IsDigit); Assert.Contains(p, c => !char.IsLetterOrDigit(c));
        }
        Assert.Matches("^[0-9]{12}$", PasswordTool.Generate(12, false, false, true, false));
        Assert.Equal("Select at least one character set.", PasswordTool.Generate(12, false, false, false, false));
        Assert.Equal("Length must be 4-128.", PasswordTool.Generate(3, true, true, true, true));
        Assert.NotEqual(PasswordTool.Generate(32, true, true, true, true), PasswordTool.Generate(32, true, true, true, true));
    }

    [Fact]
    public void TextHashKnownVectors()
    {
        var h = HashTool.ComputeAll("abc").ToDictionary(x => x.Algorithm, x => x.Hash);
        Assert.Equal("900150983cd24fb0d6963f7d28e17f72", h["MD5"]);
        Assert.Equal("a9993e364706816aba3e25717850c26c9cd0d89d", h["SHA1"]);
        Assert.Equal("ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad", h["SHA256"]);
    }

    [Fact]
    public void CommonPortsSearch()
    {
        Assert.Equal("RDP", Assert.Single(CommonPorts.Search("3389")).Name);
        Assert.Contains(CommonPorts.Search("ssh"), p => p.Port == 22);
        Assert.Equal(CommonPorts.All.Length, CommonPorts.Search("").Count());
    }

    [Fact]
    public void ArabicLabels()
    {
        Tr.Ar = true;
        try { Assert.Contains("القناع", SubnetCalculator.Calculate("10.0.0.0/8").ToString()); }
        finally { Tr.Ar = false; }
    }
}
