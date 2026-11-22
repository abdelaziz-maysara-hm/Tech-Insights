using System.Buffers.Binary;
using System.Diagnostics;
using System.Net;
using System.Net.Sockets;
using System.Text;

namespace NetSecAtlas.Core;

public sealed record DnsAnswer(ushort Id, int Rcode, int AnswerCount, bool Truncated);
public sealed record Resolver(string Name, string Address);
public sealed record ResolverResult(Resolver Resolver, LatencyStats Cached, LatencyStats Uncached, int Errors);

/// <summary>Minimal DNS wire-format query builder and response header parser (RFC 1035) for latency benchmarking.</summary>
public static class DnsWire
{
    public static byte[] BuildQuery(ushort id, string name, ushort qtype = 1)
    {
        var ms = new MemoryStream();
        Span<byte> h = stackalloc byte[12];
        BinaryPrimitives.WriteUInt16BigEndian(h, id);
        BinaryPrimitives.WriteUInt16BigEndian(h[2..], 0x0100); // standard query, recursion desired
        BinaryPrimitives.WriteUInt16BigEndian(h[4..], 1);
        ms.Write(h);
        foreach (var label in name.TrimEnd('.').Split('.'))
        {
            var b = Encoding.ASCII.GetBytes(label);
            if (b.Length is 0 or > 63) throw new ArgumentException("bad label", nameof(name));
            ms.WriteByte((byte)b.Length); ms.Write(b);
        }
        ms.WriteByte(0);
        Span<byte> q = stackalloc byte[4];
        BinaryPrimitives.WriteUInt16BigEndian(q, qtype);
        BinaryPrimitives.WriteUInt16BigEndian(q[2..], 1);
        ms.Write(q);
        return ms.ToArray();
    }

    public static DnsAnswer? ParseHeader(ReadOnlySpan<byte> msg)
    {
        if (msg.Length < 12) return null;
        ushort flags = BinaryPrimitives.ReadUInt16BigEndian(msg[2..]);
        if ((flags & 0x8000) == 0) return null; // not a response
        return new(BinaryPrimitives.ReadUInt16BigEndian(msg), flags & 0x000F, BinaryPrimitives.ReadUInt16BigEndian(msg[6..]), (flags & 0x0200) != 0);
    }

    public static async Task<double?> QueryAsync(IPAddress server, string name, int timeoutMs = 2000, CancellationToken ct = default)
    {
        using var udp = new UdpClient(server.AddressFamily);
        var id = (ushort)Random.Shared.Next(1, 65535);
        var pkt = BuildQuery(id, name);
        var sw = Stopwatch.StartNew();
        await udp.SendAsync(pkt, new IPEndPoint(server, 53), ct).ConfigureAwait(false);
        using var cts = CancellationTokenSource.CreateLinkedTokenSource(ct);
        cts.CancelAfter(timeoutMs);
        try
        {
            while (true)
            {
                var r = await udp.ReceiveAsync(cts.Token).ConfigureAwait(false);
                var a = ParseHeader(r.Buffer);
                if (a?.Id == id) return a.Rcode is 0 or 3 ? Math.Round(sw.Elapsed.TotalMilliseconds, 1) : null; // NOERROR or NXDOMAIN are valid answers
            }
        }
        catch (OperationCanceledException) when (!ct.IsCancellationRequested) { return null; }
    }
}

public static class DnsBenchmark
{
    public static readonly Resolver[] PublicResolvers =
    {
        new("Cloudflare", "1.1.1.1"), new("Cloudflare (2)", "1.0.0.1"),
        new("Google Public DNS", "8.8.8.8"), new("Google Public DNS (2)", "8.8.4.4"),
        new("Quad9", "9.9.9.9"), new("OpenDNS", "208.67.222.222"),
        new("AdGuard DNS", "94.140.14.14"), new("CleanBrowsing (Family)", "185.228.168.168"),
    };

    public static readonly string[] PopularNames = { "google.com", "microsoft.com", "youtube.com", "facebook.com", "wikipedia.org", "amazon.com", "apple.com", "cloudflare.com" };

    public static async Task<ResolverResult> RunAsync(Resolver r, int rounds, CancellationToken ct = default)
    {
        var ip = IPAddress.Parse(r.Address);
        var cached = new List<double?>(); var uncached = new List<double?>();
        // Warm-up so the "cached" names are in the resolver's cache.
        foreach (var n in PopularNames) await DnsWire.QueryAsync(ip, n, 2000, ct).ConfigureAwait(false);
        for (int i = 0; i < rounds && !ct.IsCancellationRequested; i++)
        {
            cached.Add(await DnsWire.QueryAsync(ip, PopularNames[i % PopularNames.Length], 2000, ct).ConfigureAwait(false));
            // A random label under a real domain forces a full recursive lookup (answered NXDOMAIN).
            uncached.Add(await DnsWire.QueryAsync(ip, $"nsa-{Guid.NewGuid():N}"[..20] + ".example.com", 3000, ct).ConfigureAwait(false));
        }
        var c = LatencyStats.From(cached); var u = LatencyStats.From(uncached);
        return new(r, c, u, (c.Sent - c.Received) + (u.Sent - u.Received));
    }

    public static IEnumerable<ResolverResult> Rank(IEnumerable<ResolverResult> results) =>
        results.OrderBy(r => r.Cached.Received == 0 ? 1 : 0).ThenBy(r => r.Cached.LossPercent + r.Uncached.LossPercent)
               .ThenBy(r => (r.Cached.Median ?? 9999) * 0.6 + (r.Uncached.Median ?? 9999) * 0.4);
}
