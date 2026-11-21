namespace NetSecAtlasTools;

public static class SubnetCalculator
{
    public static SubnetInfo Calculate(string input)
    {
        if (string.IsNullOrWhiteSpace(input)) throw new ArgumentException("Empty input");

        var parts = input.Trim().Split('/');
        if (parts.Length != 2) throw new ArgumentException("Use CIDR form like 192.168.1.0/24");

        uint address = ParseIPv4(parts[0]);
        int prefix;

        if (int.TryParse(parts[1], out var p) && p is >= 0 and <= 32)
            prefix = p;
        else
        {
            uint mask = ParseIPv4(parts[1]);
            prefix = MaskToPrefix(mask);
        }

        uint size = 1u << (32 - prefix);
        uint network = address & ~(size - 1);
        uint broadcast = network + size - 1;

        uint first = network + 1;
        uint last = broadcast - 1;
        int usable = (int)(size - 2);

        if (prefix == 31)
        {
            first = network;
            last = broadcast;
            usable = 2;
        }
        else if (prefix == 32)
        {
            first = last = network;
            usable = 1;
        }

        return new SubnetInfo
        {
            Network = FormatIPv4(network) + "/" + prefix,
            Netmask = FormatIPv4(~(size - 1)),
            Wildcard = FormatIPv4(size - 1),
            Broadcast = FormatIPv4(broadcast),
            FirstUsable = FormatIPv4(first),
            LastUsable = FormatIPv4(last),
            Total = (int)size,
            Usable = usable
        };
    }

    static uint ParseIPv4(string s)
    {
        var octets = s.Trim().Split('.');
        if (octets.Length != 4) throw new ArgumentException("Invalid IPv4: " + s);
        uint result = 0;
        foreach (var o in octets)
        {
            if (!int.TryParse(o, out var n) || n < 0 || n > 255)
                throw new ArgumentException("Invalid octet: " + o);
            result = (result << 8) | (uint)n;
        }
        return result;
    }

    static string FormatIPv4(uint v) =>
        $"{(v >> 24) & 255}.{(v >> 16) & 255}.{(v >> 8) & 255}.{v & 255}";

    static int MaskToPrefix(uint mask)
    {
        for (int p = 0; p <= 32; p++)
        {
            uint expected = p == 0 ? 0 : ~( (1u << (32 - p)) - 1 );
            if (mask == expected) return p;
        }
        throw new ArgumentException("Non-contiguous mask");
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
    public int Total { get; init; }
    public int Usable { get; init; }

    public override string ToString() =>
        $"Network:     {Network}\n" +
        $"Netmask:     {Netmask}\n" +
        $"Wildcard:    {Wildcard}\n" +
        $"Broadcast:   {Broadcast}\n" +
        $"First:       {FirstUsable}\n" +
        $"Last:        {LastUsable}\n" +
        $"Total:       {Total}\n" +
        $"Usable:      {Usable}";
}
