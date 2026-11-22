using System.Globalization;

namespace NetSecAtlas.Core;

public static class TimestampTool
{
    public static string Convert(string input)
    {
        input = (input ?? "").Trim();
        if (string.IsNullOrEmpty(input)) return Tr.T("Enter a Unix timestamp or date.", "اكتب طابعًا زمنيًا (Unix) أو تاريخًا.");

        if (long.TryParse(input, out var unix))
        {
            // 13 digits or more = milliseconds (JavaScript, Java, many logs).
            bool ms = Math.Abs(unix) >= 100_000_000_000;
            DateTimeOffset t;
            try { t = ms ? DateTimeOffset.FromUnixTimeMilliseconds(unix) : DateTimeOffset.FromUnixTimeSeconds(unix); }
            catch (ArgumentOutOfRangeException) { return Tr.T("Out of range.", "خارج النطاق."); }
            return $"{Tr.T("Unit", "الوحدة")}:  {(ms ? Tr.T("milliseconds", "ميلي ثانية") : Tr.T("seconds", "ثوانٍ"))}\n" +
                   $"UTC:   {t.UtcDateTime:yyyy-MM-dd HH:mm:ss}\n" +
                   $"{Tr.T("Local", "المحلي")}: {t.ToLocalTime():yyyy-MM-dd HH:mm:ss zzz}\n" +
                   $"ISO:   {t.UtcDateTime:yyyy-MM-ddTHH:mm:ssZ}";
        }

        if (DateTimeOffset.TryParse(input, CultureInfo.InvariantCulture, DateTimeStyles.AssumeLocal, out var date))
            return $"Unix:    {date.ToUnixTimeSeconds()}\nUnix ms: {date.ToUnixTimeMilliseconds()}\nUTC:     {date.UtcDateTime:yyyy-MM-dd HH:mm:ss}";

        return Tr.T("Invalid input.", "مدخل غير صالح.");
    }
}
