namespace NetSecAtlasTools;

public static class IpConverter
{
    public static string Convert(string input)
    {
        input = input.Trim();
        if (string.IsNullOrEmpty(input)) return "Enter an IP.";

        if (input.Contains('.'))
        {
            var o = input.Split('.').Select(int.Parse).ToArray();
            if (o.Length != 4 || o.Any(x => x < 0 || x > 255)) return "Invalid IP.";
            uint v = (uint)((o[0] << 24) | (o[1] << 16) | (o[2] << 8) | o[3]);
            return $"Decimal: {v}\nHex:     0x{v:X8}\nBinary:  {Convert.ToString(v, 2).PadLeft(32, '0')}";
        }

        if (uint.TryParse(input, out var dec))
            return Format(dec);

        if (input.StartsWith("0x") && uint.TryParse(input[2..], System.Globalization.NumberStyles.HexNumber, null, out var hex))
            return Format(hex);

        return "Use dotted IP, decimal, or 0x hex.";
    }

    static string Format(uint v) =>
        $"IP:      {(v >> 24) & 255}.{(v >> 16) & 255}.{(v >> 8) & 255}.{v & 255}\nDecimal: {v}\nHex:     0x{v:X8}";
}
