namespace NetSecAtlasTools;

public static class TimestampTool
{
    public static string Convert(string input)
    {
        input = input.Trim();
        if (string.IsNullOrEmpty(input)) return "Enter a Unix timestamp or date.";

        if (long.TryParse(input, out var unix))
        {
            var dt = DateTimeOffset.FromUnixTimeSeconds(unix).LocalDateTime;
            return $"Local: {dt:yyyy-MM-dd HH:mm:ss}\nUTC:   {DateTimeOffset.FromUnixTimeSeconds(unix).UtcDateTime:yyyy-MM-dd HH:mm:ss}";
        }

        if (DateTime.TryParse(input, out var date))
        {
            var offset = new DateTimeOffset(date);
            return $"Unix: {offset.ToUnixTimeSeconds()}";
        }

        return "Invalid input.";
    }
}
