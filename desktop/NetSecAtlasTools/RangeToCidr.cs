namespace NetSecAtlasTools;

public static class RangeToCidr
{
    public static string Convert(string input)
    {
        input = input.Trim();
        if (input.Contains('/'))
        {
            var info = SubnetCalculator.Calculate(input);
            return $"CIDR: {info.Network}\nMask: {info.Netmask}\nWildcard: {info.Wildcard}\nRange: {info.FirstUsable} - {info.LastUsable}";
        }

        var parts = input.Split(new[] { '-', '–', ' ' }, StringSplitOptions.RemoveEmptyEntries);
        if (parts.Length < 2) throw new ArgumentException("Use 'start - end' or a CIDR");

        uint start = Parse(parts[0]);
        uint end = Parse(parts[^1]);
        if (start > end) throw new ArgumentException("Start must be <= end");

        var blocks = new List<string>();
        uint current = start;
        while (current <= end)
        {
            int prefix = 0;
            while (prefix < 32)
            {
                uint size = 1u << (32 - prefix);
                if (current % size == 0 && current + size - 1 <= end) break;
                prefix++;
            }
            blocks.Add($"{Format(current)}/{prefix}");
            current += 1u << (32 - prefix);
        }

        return string.Join("\n", blocks);
    }

    static uint Parse(string s)
    {
        var o = s.Split('.').Select(int.Parse).ToArray();
        if (o.Length != 4 || o.Any(x => x < 0 || x > 255)) throw new ArgumentException("Invalid IP: " + s);
        return (uint)((o[0] << 24) | (o[1] << 16) | (o[2] << 8) | o[3]);
    }

    static string Format(uint v) =>
        $"{(v >> 24) & 255}.{(v >> 16) & 255}.{(v >> 8) & 255}.{v & 255}";
}
