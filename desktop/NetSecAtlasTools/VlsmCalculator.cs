namespace NetSecAtlasTools;

public static class VlsmCalculator
{
    public static string Calculate(string baseCidr, List<(string Name, int Hosts)> requests)
    {
        if (requests.Count == 0) return "Add at least one segment.";

        var baseInfo = SubnetCalculator.Calculate(baseCidr);
        uint baseNetwork = Parse(baseInfo.Network.Split('/')[0]);
        int basePrefix = int.Parse(baseInfo.Network.Split('/')[1]);
        uint baseEnd = baseNetwork + (1u << (32 - basePrefix));

        var sized = requests
            .Select((r, i) => (r.Name, r.Hosts, Prefix: PrefixForHosts(r.Hosts), Index: i))
            .OrderBy(x => x.Prefix)
            .ThenBy(x => x.Index)
            .ToList();

        var lines = new List<string>();
        uint cursor = baseNetwork;

        foreach (var item in sized)
        {
            if (item.Prefix < basePrefix || cursor + (1u << (32 - item.Prefix)) > baseEnd)
                return $"Does not fit at '{item.Name}'. Use a larger parent block.";

            uint size = 1u << (32 - item.Prefix);
            uint net = cursor;
            uint bc = net + size - 1;
            lines.Add($"{item.Name,-12} {Format(net)}/{item.Prefix,-3}  {Format(net + 1)} - {Format(bc - 1)}");
            cursor += size;
        }

        return string.Join("\n", lines);
    }

    static int PrefixForHosts(int hosts)
    {
        for (int p = 30; p >= 0; p--)
            if ((1 << (32 - p)) - 2 >= hosts) return p;
        throw new ArgumentException("Too many hosts");
    }

    static uint Parse(string s)
    {
        var o = s.Split('.').Select(int.Parse).ToArray();
        return (uint)((o[0] << 24) | (o[1] << 16) | (o[2] << 8) | o[3]);
    }

    static string Format(uint v) =>
        $"{(v >> 24) & 255}.{(v >> 16) & 255}.{(v >> 8) & 255}.{v & 255}";
}
