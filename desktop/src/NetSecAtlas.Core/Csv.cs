using System.Text;

namespace NetSecAtlas.Core;

public static class Csv
{
    public static string Escape(string? value)
    {
        value ??= "";
        // Neutralise spreadsheet formula injection, then quote when needed.
        if (value.Length > 0 && "=+-@\t\r".Contains(value[0])) value = "'" + value;
        return value.IndexOfAny(new[] { ',', '"', '\n', '\r' }) >= 0 ? "\"" + value.Replace("\"", "\"\"") + "\"" : value;
    }

    public static string Build(IEnumerable<string> headers, IEnumerable<IEnumerable<string?>> rows)
    {
        var sb = new StringBuilder();
        sb.AppendLine(string.Join(",", headers.Select(Escape)));
        foreach (var r in rows) sb.AppendLine(string.Join(",", r.Select(Escape)));
        return sb.ToString();
    }
}
