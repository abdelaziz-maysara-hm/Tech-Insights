using FlaUI.Core.AutomationElements;
using FlaUI.Core.Definitions;

namespace NetSecAtlasTools.UiTests;

[Collection("app")]
[TestCaseOrderer("NetSecAtlasTools.UiTests.NameOrderer", "NetSecAtlasTools.UiTests")]
public class UiTests(AppFixture f)
{
    // id, sample timeout (s). Order = navigation order.
    public static TheoryData<string, int> Tools => new()
    {
        { "healthcheck", 90 }, { "hashchecker", 120 }, { "passwordcheck", 60 }, { "wificheck", 30 },
        { "netdoctor", 180 }, { "pingmonitor", 60 }, { "dnsbench", 240 }, { "portcheck", 90 },
        { "subnet", 20 }, { "vlsm", 20 }, { "range", 20 }, { "ipconvert", 20 }, { "mac", 20 },
        { "lockouttracer", 30 }, { "certexpiry", 120 }, { "headeranalyzer", 20 }, { "encoding", 20 }, { "timestamp", 20 },
    };

    [Fact]
    public void T00_LaunchesWithAllToolsInNavigation()
    {
        Assert.True(f.Alive);
        Assert.Contains("NetSec Atlas Tools", f.Main.Title);
        foreach (var id in Tools.Select(t => (string)t[0])) Assert.NotNull(f.Find("nav-" + id));
        Assert.NotNull(f.Find("open-subnet")); // home page cards
        f.Capture("home-en");
    }

    [Theory]
    [MemberData(nameof(Tools))]
    public void T10_EachToolRunsItsSample(string id, int timeout)
    {
        f.Open(id);
        var state = f.RunSample(timeout);
        Assert.True(f.Alive, $"{id}: app exited");
        Assert.True(state == "done", $"{id}: state '{state}', status '{f.Status}'");
        var page = f.Find("page-" + id)!;
        // Every tool must show an output: a result element or a filled table.
        var result = f.Find("result", page);
        var grids = page.FindAllDescendants(f.Cf.ByControlType(ControlType.DataGrid));
        bool hasRows = grids.Any(g => g.AsGrid().RowCount > 0);
        Assert.True(result != null || hasRows, $"{id}: no result element or table rows after the sample. Status: {f.Status}");
        f.Capture(id + "-en");
    }

    [Theory]
    [InlineData("subnet", "172.16.5.4/20", null, new[] { "172.16.0.0/20", "255.255.240.0", "172.16.15.255", "4,094" })]
    [InlineData("vlsm", "192.168.0.0/24", "A 100\nB 50\nC 2", new[] { "192.168.0.0/25", "192.168.0.128/26", "192.168.0.192/30" })]
    [InlineData("range", "10.0.0.0 - 10.0.1.255", null, new[] { "10.0.0.0/23" })]
    [InlineData("ipconvert", "192.168.1.1", null, new[] { "3232235777", "0xC0A80101" })]
    [InlineData("mac", "08-00-27-11-22-33", null, new[] { "Oracle VirtualBox" })]
    [InlineData("encoding", "hello", null, new[] { "aGVsbG8=" })]
    [InlineData("timestamp", "0", null, new[] { "1970-01-01 00:00:00" })]
    public void T20_CalculatorsGiveCorrectAnswers(string id, string input, string? input2, string[] expected)
    {
        f.Open(id);
        f.SetText("input", input);
        if (input2 != null) f.SetText("input2", input2);
        f.Click("run");
        var text = "";
        FlaUI.Core.Tools.Retry.WhileFalse(() => expected.All((text = f.ResultText()).Contains), TimeSpan.FromSeconds(10));
        foreach (var e in expected) Assert.Contains(e, text);
    }

    [Fact]
    public void T21_EncodingDecodesBack()
    {
        f.Open("encoding");
        f.SetText("input", "aGVsbG8gd29ybGQ=");
        f.Click("b64-decode");
        Assert.Equal("hello world", f.ResultText());
        f.SetText("input", "68 69");
        f.Click("hex-decode");
        FlaUI.Core.Tools.Retry.WhileFalse(() => f.ResultText() == "hi", TimeSpan.FromSeconds(5));
        Assert.Equal("hi", f.ResultText());
    }

    [Fact]
    public void T22_TextHashAndPasswordGenerator()
    {
        f.Open("hashchecker");
        f.SetText("text-input", "abc");
        f.Click("text-run");
        Assert.Contains("ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad", f.ResultText("text-result"));

        f.Open("passwordcheck");
        f.SetText("gen-length", "24");
        f.Click("gen-run");
        var pw = f.ResultText("gen-result");
        Assert.Equal(24, pw.Length);
    }

    [Fact]
    public void T23_HeaderAnalyzerFlagsSpoofedSample()
    {
        f.Open("headeranalyzer");
        f.RunSample(20);
        var page = f.Find("page-headeranalyzer")!;
        Assert.True(page.FindAllDescendants(f.Cf.ByControlType(ControlType.DataGrid)).Length >= 2);
    }

    [Fact]
    public void T24_RealWifiScanFailsGracefully()
    {
        // CI runners have no Wi-Fi adapter: the scan must show a message, not crash.
        f.Open("wificheck");
        f.Click("run");
        Thread.Sleep(6000);
        Assert.True(f.Alive);
        Assert.DoesNotContain("unhandled", ReadLog());
    }

    [Fact]
    public void T30_ArabicInterface()
    {
        f.Open("subnet");
        f.Click("lang");
        FlaUI.Core.Tools.Retry.WhileFalse(() => f.ToolTitle == "حاسبة الشبكات الفرعية", TimeSpan.FromSeconds(10));
        Assert.Equal("حاسبة الشبكات الفرعية", f.ToolTitle);
        foreach (var id in new[] { "subnet", "healthcheck", "passwordcheck", "portcheck", "headeranalyzer", "lockouttracer", "hashchecker", "home" })
        {
            f.Open(id);
            if (id != "home") Assert.Equal("done", f.RunSample(120));
            f.Capture(id + "-ar");
        }
        f.Click("lang");
        FlaUI.Core.Tools.Retry.WhileFalse(() => f.ToolTitle == "All tools", TimeSpan.FromSeconds(10));
        Assert.Equal("All tools", f.ToolTitle);
    }

    [Fact]
    public void T99_NoUnhandledErrorsAndStillRunning()
    {
        Assert.True(f.Alive);
        var log = ReadLog();
        Assert.DoesNotContain("unhandled", log);
        Assert.DoesNotContain("unobserved", log);
    }

    static string ReadLog()
    {
        var p = Path.Combine(Path.GetTempPath(), "NetSecAtlasTools.log");
        return File.Exists(p) ? File.ReadAllText(p) : "";
    }
}
