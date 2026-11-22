using System.Globalization;

namespace NetSecAtlas.Core;

/// <summary>IPv4 helpers shared by the subnet, VLSM, range and converter tools. Uses 64-bit maths so /0 and 255.255.255.255 work.</summary>
public static class Ipv4
{
    public static uint Parse(string s)
    {
        var octets = (s ?? "").Trim().Split('.');
        if (octets.Length != 4) throw new FormatException(Tr.T("Invalid IPv4 address: ", "عنوان IPv4 غير صالح: ") + s);
        uint result = 0;
        foreach (var o in octets)
        {
            if (!int.TryParse(o, NumberStyles.None, CultureInfo.InvariantCulture, out var n) || n > 255)
                throw new FormatException(Tr.T("Invalid octet: ", "جزء غير صالح: ") + o);
            result = (result << 8) | (uint)n;
        }
        return result;
    }

    public static string Format(uint v) => $"{(v >> 24) & 255}.{(v >> 16) & 255}.{(v >> 8) & 255}.{v & 255}";
    public static ulong BlockSize(int prefix) => 1UL << (32 - prefix);
    public static uint MaskOf(int prefix) => prefix == 0 ? 0u : uint.MaxValue << (32 - prefix);

    public static int MaskToPrefix(uint mask)
    {
        for (int p = 0; p <= 32; p++) if (mask == MaskOf(p)) return p;
        throw new FormatException(Tr.T("Non-contiguous subnet mask", "قناع شبكة غير متصل"));
    }
}

public static class SubnetCalculator
{
    /// <summary>Accepts 192.168.1.10/24, 192.168.1.10/255.255.255.0 or "192.168.1.10 255.255.255.0".</summary>
    public static SubnetInfo Calculate(string input)
    {
        if (string.IsNullOrWhiteSpace(input)) throw new FormatException(Tr.T("Empty input", "المدخل فارغ"));
        var parts = input.Trim().Split(new[] { '/', ' ', '\t' }, StringSplitOptions.RemoveEmptyEntries);
        if (parts.Length != 2) throw new FormatException(Tr.T("Use CIDR form like 192.168.1.0/24", "استخدم صيغة CIDR مثل 192.168.1.0/24"));

        uint address = Ipv4.Parse(parts[0]);
        int prefix = int.TryParse(parts[1], out var p) && p is >= 0 and <= 32 ? p : Ipv4.MaskToPrefix(Ipv4.Parse(parts[1]));

        ulong size = Ipv4.BlockSize(prefix);
        uint mask = Ipv4.MaskOf(prefix);
        uint network = address & mask;
        uint broadcast = (uint)(network + size - 1);
        uint first = network + 1, last = broadcast - 1;
        long usable = (long)size - 2;
        if (prefix == 31) { first = network; last = broadcast; usable = 2; }
        else if (prefix == 32) { first = last = network; usable = 1; }

        return new SubnetInfo
        {
            Network = Ipv4.Format(network) + "/" + prefix,
            Netmask = Ipv4.Format(mask),
            Wildcard = Ipv4.Format(~mask),
            Broadcast = Ipv4.Format(broadcast),
            FirstUsable = Ipv4.Format(first),
            LastUsable = Ipv4.Format(last),
            Total = (long)size,
            Usable = usable,
            Prefix = prefix,
        };
    }
}

public class SubnetInfo
{
    public string Network { get; init; } = "";
    public string Netmask { get; init; } = "";
    public string Wildcard { get; init; } = "";
    public string Broadcast { get; init; } = "";
    public string FirstUsable { get; init; } = "";
    public string LastUsable { get; init; } = "";
    public long Total { get; init; }
    public long Usable { get; init; }
    public int Prefix { get; init; }

    public override string ToString() =>
        $"{Tr.T("Network", "الشبكة"),-12} {Network}\n" +
        $"{Tr.T("Netmask", "القناع"),-12} {Netmask}\n" +
        $"{Tr.T("Wildcard", "Wildcard"),-12} {Wildcard}\n" +
        $"{Tr.T("Broadcast", "البث"),-12} {Broadcast}\n" +
        $"{Tr.T("First", "أول عنوان"),-12} {FirstUsable}\n" +
        $"{Tr.T("Last", "آخر عنوان"),-12} {LastUsable}\n" +
        $"{Tr.T("Total", "الإجمالي"),-12} {Total:N0}\n" +
        $"{Tr.T("Usable", "القابل للاستخدام"),-12} {Usable:N0}";
}

public sealed record VlsmRow(string Name, int Hosts, string Network, int Prefix, string FirstUsable, string LastUsable, string Broadcast, long Capacity);

public static class VlsmCalculator
{
    /// <summary>Largest segment first; each gets the smallest block that holds its hosts (+network and broadcast).</summary>
    public static List<VlsmRow> Plan(string baseCidr, IReadOnlyList<(string Name, int Hosts)> requests)
    {
        if (requests.Count == 0) throw new ArgumentException(Tr.T("Add at least one segment.", "أضف شبكة فرعية واحدة على الأقل."));
        var baseInfo = SubnetCalculator.Calculate(baseCidr);
        uint baseNetwork = Ipv4.Parse(baseInfo.Network.Split('/')[0]);
        ulong baseEnd = baseNetwork + Ipv4.BlockSize(baseInfo.Prefix);

        var sized = requests.Select((r, i) => (r.Name, r.Hosts, Prefix: PrefixForHosts(r.Hosts), Index: i)).OrderBy(x => x.Prefix).ThenBy(x => x.Index).ToList();
        var rows = new List<VlsmRow>();
        ulong cursor = baseNetwork;
        foreach (var item in sized)
        {
            ulong size = Ipv4.BlockSize(item.Prefix);
            if (item.Prefix < baseInfo.Prefix || cursor + size > baseEnd)
                throw new ArgumentException(Tr.T($"Does not fit at '{item.Name}'. Use a larger parent block.", $"لا تتسع عند '{item.Name}'. استخدم شبكة أم أكبر."));
            uint net = (uint)cursor, bc = (uint)(cursor + size - 1);
            rows.Add(new VlsmRow(item.Name, item.Hosts, Ipv4.Format(net), item.Prefix, Ipv4.Format(net + 1), Ipv4.Format(bc - 1), Ipv4.Format(bc), (long)size - 2));
            cursor += size;
        }
        return rows;
    }

    /// <summary>Text form kept from NetSecAtlasTools 1.x.</summary>
    public static string Calculate(string baseCidr, List<(string Name, int Hosts)> requests)
    {
        try { return string.Join("\n", Plan(baseCidr, requests).Select(r => $"{r.Name,-12} {r.Network}/{r.Prefix,-3}  {r.FirstUsable} - {r.LastUsable}")); }
        catch (Exception ex) { return ex.Message; }
    }

    /// <summary>Parses "Sales 50" / "Sales: 50" / "Sales,50" lines.</summary>
    public static List<(string Name, int Hosts)> ParseRequests(string text)
    {
        var list = new List<(string, int)>();
        foreach (var raw in (text ?? "").Split('\n'))
        {
            var line = raw.Trim(); if (line.Length == 0 || line.StartsWith('#')) continue;
            var parts = line.Split(new[] { ' ', '\t', ':', ',', '=' }, StringSplitOptions.RemoveEmptyEntries);
            if (parts.Length == 1 && int.TryParse(parts[0], out var only)) { list.Add(($"Net{list.Count + 1}", only)); continue; }
            if (parts.Length < 2 || !int.TryParse(parts[^1], out var hosts) || hosts < 1)
                throw new FormatException(Tr.T($"Cannot read line: {line}", $"تعذّرت قراءة السطر: {line}"));
            list.Add((string.Join(' ', parts[..^1]), hosts));
        }
        return list;
    }

    public static int PrefixForHosts(int hosts)
    {
        if (hosts < 1) throw new ArgumentException(Tr.T("Hosts must be at least 1", "عدد الأجهزة يجب أن يكون 1 على الأقل"));
        for (int p = 30; p >= 1; p--)
            if ((1L << (32 - p)) - 2 >= hosts) return p;
        throw new ArgumentException(Tr.T("Too many hosts", "عدد الأجهزة كبير جدًا"));
    }
}

public static class RangeToCidr
{
    /// <summary>Smallest list of CIDR blocks covering start..end.</summary>
    public static List<string> Blocks(uint start, uint end)
    {
        if (start > end) throw new ArgumentException(Tr.T("Start must be <= end", "البداية يجب أن تكون أصغر من أو تساوي النهاية"));
        var blocks = new List<string>();
        ulong current = start;
        while (current <= end)
        {
            int prefix = 0;
            while (prefix < 32)
            {
                ulong size = Ipv4.BlockSize(prefix);
                if (current % size == 0 && current + size - 1 <= end) break;
                prefix++;
            }
            blocks.Add($"{Ipv4.Format((uint)current)}/{prefix}");
            current += Ipv4.BlockSize(prefix);
        }
        return blocks;
    }

    public static string Convert(string input)
    {
        input = (input ?? "").Trim();
        if (input.Contains('/'))
        {
            var info = SubnetCalculator.Calculate(input);
            return $"CIDR: {info.Network}\n{Tr.T("Mask", "القناع")}: {info.Netmask}\nWildcard: {info.Wildcard}\n{Tr.T("Range", "المدى")}: {Ipv4.Format(Ipv4.Parse(info.Network.Split('/')[0]))} - {info.Broadcast}";
        }
        var parts = input.Split(new[] { '-', '–', ' ' }, StringSplitOptions.RemoveEmptyEntries);
        if (parts.Length < 2) throw new FormatException(Tr.T("Use 'start - end' or a CIDR", "استخدم 'البداية - النهاية' أو CIDR"));
        return string.Join("\n", Blocks(Ipv4.Parse(parts[0]), Ipv4.Parse(parts[^1])));
    }
}

public static class IpConverter
{
    public static string Convert(string input)
    {
        input = (input ?? "").Trim();
        if (string.IsNullOrEmpty(input)) return Tr.T("Enter an IP.", "اكتب عنوان IP.");
        if (input.Contains('.'))
        {
            uint v;
            try { v = Ipv4.Parse(input); } catch { return Tr.T("Invalid IP.", "عنوان IP غير صالح."); }
            return $"{Tr.T("Decimal", "عشري")}: {v}\nHex:     0x{v:X8}\n{Tr.T("Binary", "ثنائي")}:  {Binary(v)}";
        }
        if (input.StartsWith("0x", StringComparison.OrdinalIgnoreCase) && uint.TryParse(input[2..], NumberStyles.HexNumber, null, out var hex)) return Format(hex);
        if (uint.TryParse(input, out var dec)) return Format(dec);
        return Tr.T("Use dotted IP, decimal, or 0x hex.", "استخدم IP منقوطًا أو رقمًا عشريًا أو 0x ست عشري.");
    }

    static string Binary(uint v) => string.Join(".", Enumerable.Range(0, 4).Select(i => System.Convert.ToString((v >> (24 - 8 * i)) & 255, 2).PadLeft(8, '0')));
    static string Format(uint v) => $"IP:      {Ipv4.Format(v)}\n{Tr.T("Decimal", "عشري")}: {v}\nHex:     0x{v:X8}\n{Tr.T("Binary", "ثنائي")}:  {Binary(v)}";
}
