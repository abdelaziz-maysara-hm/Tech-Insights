using System.Net.Http;
using System.Security.Cryptography;
using System.Text;

namespace NetSecAtlas.Core;

public sealed record PasswordReport(int Length, int CharsetSize, double EntropyBits, int Score, IReadOnlyList<string> Issues, string OfflineCrackTime, string OnlineCrackTime)
{
    public string ScoreLabel => Score switch
    {
        0 => Tr.T("Very weak", "ضعيفة جدًا"), 1 => Tr.T("Weak", "ضعيفة"), 2 => Tr.T("Fair", "مقبولة"),
        3 => Tr.T("Strong", "قوية"), _ => Tr.T("Very strong", "قوية جدًا"),
    };
}

/// <summary>Offline password strength estimate. Nothing is stored or sent anywhere.</summary>
public static class PasswordAnalyzer
{
    // A short list of passwords that appear at the top of every public breach-frequency list.
    static readonly HashSet<string> Common = new(StringComparer.OrdinalIgnoreCase)
    {
        "123456","123456789","12345678","12345","1234567","1234567890","111111","000000","123123","654321","666666","121212",
        "password","password1","password123","passw0rd","p@ssw0rd","p@ssword","qwerty","qwerty123","qwertyuiop","1q2w3e4r","1qaz2wsx",
        "abc123","admin","admin123","administrator","welcome","welcome1","letmein","iloveyou","monkey","dragon","football","baseball",
        "sunshine","princess","master","shadow","superman","trustno1","login","starwars","whatever","freedom","azerty","zaq12wsx",
        "changeme","default","root","toor","test","test123","guest","secret","hello","hello123","computer","internet","michael",
    };

    const string Rows = "qwertyuiop|asdfghjkl|zxcvbnm|1234567890";

    public static PasswordReport Analyze(string pw)
    {
        var issues = new List<string>();
        if (string.IsNullOrEmpty(pw)) return new(0, 0, 0, 0, new[] { Tr.T("Enter a password to test.", "اكتب كلمة مرور لاختبارها.") }, "-", "-");

        int charset = 0;
        if (pw.Any(char.IsLower)) charset += 26;
        if (pw.Any(char.IsUpper)) charset += 26;
        if (pw.Any(char.IsDigit)) charset += 10;
        if (pw.Any(c => !char.IsLetterOrDigit(c) && c < 128)) charset += 33;
        if (pw.Any(c => c >= 128)) charset += 100;

        double bits = pw.Length * Math.Log2(Math.Max(charset, 1));
        var lower = pw.ToLowerInvariant();
        var deLeet = new string(lower.Select(c => c switch { '@' => 'a', '4' => 'a', '3' => 'e', '1' => 'i', '!' => 'i', '0' => 'o', '$' => 's', '5' => 's', '7' => 't', _ => c }).ToArray());

        bool common = Common.Contains(pw) || Common.Contains(deLeet) || Common.Contains(deLeet.TrimEnd('0','1','2','3','4','5','6','7','8','9','!'));
        if (common) { issues.Add(Tr.T("This is one of the most common passwords; attackers try it first.", "هذه من أشهر كلمات المرور، ويجربها المهاجمون أولًا.")); bits = Math.Min(bits, 10); }

        int seq = LongestSequence(lower);
        if (seq >= 4) { issues.Add(Tr.T($"Contains a predictable sequence ({seq} characters in a row).", $"تحتوي على تسلسل متوقع ({seq} أحرف متتالية).")); bits -= seq * 2.5; }

        int rep = LongestRepeat(pw);
        if (rep >= 3) { issues.Add(Tr.T("Repeats the same character several times.", "تكرر الحرف نفسه عدة مرات.")); bits -= rep * 2; }

        if (System.Text.RegularExpressions.Regex.IsMatch(pw, @"(19|20)\d{2}")) { issues.Add(Tr.T("Contains a year, which is easy to guess.", "تحتوي على سنة، وهذا سهل التخمين.")); bits -= 6; }
        if (pw.All(char.IsDigit)) issues.Add(Tr.T("Digits only: add letters or use a passphrase.", "أرقام فقط: أضف حروفًا أو استخدم عبارة مرور."));
        if (pw.Length < 12) issues.Add(Tr.T("Shorter than 12 characters. Length matters more than symbols.", "أقصر من 12 حرفًا. الطول أهم من الرموز."));

        bits = Math.Max(0, Math.Round(bits, 1));
        int score = common ? 0 : bits switch { < 28 => 0, < 40 => 1, < 60 => 2, < 80 => 3, _ => 4 };
        if (pw.Length < 8) score = Math.Min(score, 1);
        if (issues.Count == 0) issues.Add(Tr.T("No obvious weaknesses found. Use it for one account only.", "لم تظهر نقاط ضعف واضحة. استخدمها لحساب واحد فقط."));

        // Average guesses = half the space. Offline: fast hash on a GPU rig (1e10/s). Online: rate-limited login (10/s).
        double guesses = Math.Pow(2, bits) / 2;
        return new(pw.Length, charset, bits, score, issues, Duration(guesses / 1e10), Duration(guesses / 10));
    }

    static int LongestSequence(string s)
    {
        int best = 1, run = 1;
        for (int i = 1; i < s.Length; i++)
        {
            bool step = Math.Abs(s[i] - s[i - 1]) == 1 || Adjacent(s[i - 1], s[i]);
            run = step ? run + 1 : 1;
            best = Math.Max(best, run);
        }
        return best;
    }

    static bool Adjacent(char a, char b)
    {
        foreach (var row in Rows.Split('|'))
        {
            int i = row.IndexOf(a), j = row.IndexOf(b);
            if (i >= 0 && j >= 0 && Math.Abs(i - j) == 1) return true;
        }
        return false;
    }

    static int LongestRepeat(string s)
    {
        int best = 1, run = 1;
        for (int i = 1; i < s.Length; i++) { run = s[i] == s[i - 1] ? run + 1 : 1; best = Math.Max(best, run); }
        return best;
    }

    public static string Duration(double seconds)
    {
        if (seconds < 1) return Tr.T("instantly", "فورًا");
        (double v, string en, string ar)[] units =
        {
            (31_536_000d * 100, "centuries", "قرون"), (31_536_000d, "years", "سنوات"), (2_592_000d, "months", "أشهر"),
            (86_400d, "days", "أيام"), (3_600d, "hours", "ساعات"), (60d, "minutes", "دقائق"), (1d, "seconds", "ثوانٍ"),
        };
        foreach (var (v, en, ar) in units)
            if (seconds >= v)
            {
                if (v == 31_536_000d * 100) return Tr.T("centuries", "قرون");
                var n = Math.Floor(seconds / v);
                return n > 1_000_000 ? Tr.T("millions of years", "ملايين السنين") : $"{n:N0} {Tr.T(en, ar)}";
            }
        return Tr.T("instantly", "فورًا");
    }
}

/// <summary>Have I Been Pwned "Pwned Passwords" range API (k-anonymity): only the first 5 hex chars of the SHA-1 leave the PC.</summary>
public static class PwnedPasswords
{
    public const string Endpoint = "https://api.pwnedpasswords.com/range/";

    public static string Sha1Hex(string password) => Convert.ToHexString(SHA1.HashData(Encoding.UTF8.GetBytes(password)));

    /// <summary>Returns how many times the suffix appears in a range response (0 when absent or padded).</summary>
    public static long CountInRange(string responseBody, string suffix)
    {
        foreach (var raw in responseBody.Split('\n'))
        {
            var line = raw.Trim();
            int colon = line.IndexOf(':');
            if (colon != 35) continue;
            if (string.Equals(line[..colon], suffix, StringComparison.OrdinalIgnoreCase) && long.TryParse(line[(colon + 1)..], out var n)) return n;
        }
        return 0;
    }

    public static async Task<long> CheckAsync(HttpClient http, string password, CancellationToken ct = default)
    {
        var hash = Sha1Hex(password);
        using var req = new HttpRequestMessage(HttpMethod.Get, Endpoint + hash[..5]);
        req.Headers.TryAddWithoutValidation("Add-Padding", "true");
        req.Headers.UserAgent.ParseAdd("NetSecAtlas-PasswordCheck/0.1");
        using var res = await http.SendAsync(req, ct).ConfigureAwait(false);
        res.EnsureSuccessStatusCode();
        return CountInRange(await res.Content.ReadAsStringAsync(ct).ConfigureAwait(false), hash[5..]);
    }
}
