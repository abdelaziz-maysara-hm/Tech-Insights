using System.Globalization;
using System.Text;
using System.Text.Json;

namespace NetSecAtlas.Core;

public sealed record JwtClaim(string Name, string Value);
public sealed record JwtPart(string Raw, string Json, IReadOnlyList<JwtClaim> Claims);

/// <summary>Decoded compact JWS (header.payload.signature). Signatures are not verified — this tool has no keys.</summary>
public sealed record JwtDecodeResult(
    bool Ok, string Error,
    JwtPart? Header, JwtPart? Payload, string Signature,
    string Algorithm, bool AlgNone,
    DateTimeOffset? Exp, DateTimeOffset? Iat, DateTimeOffset? Nbf,
    bool Expired, bool NotYetValid, string Text);

public static class JwtTool
{
    public static JwtDecodeResult Decode(string token, DateTimeOffset? now = null)
    {
        now ??= DateTimeOffset.UtcNow;
        var raw = (token ?? "").Trim();
        if (raw.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase)) raw = raw[7..].Trim();
        if (raw.Length == 0) return Fail(Tr.T("Paste a JWT (three Base64URL parts separated by dots).", "الصق رمز JWT (ثلاثة أجزاء Base64URL مفصولة بنقاط)."));
        var parts = raw.Split('.');
        if (parts.Length == 5) return Fail(Tr.T("This looks like an encrypted JWT (JWE, five parts). This tool only decodes signed tokens (JWS, three parts) and does not decrypt.", "هذا يبدو رمزًا مشفّرًا (JWE بخمسة أجزاء). الأداة تفك الرموز الموقّعة فقط (JWS بثلاثة أجزاء) ولا تفك التشفير."));
        if (parts.Length != 3) return Fail(Tr.T($"Expected three parts separated by dots, found {parts.Length}.", $"متوقع ثلاثة أجزاء مفصولة بنقاط، وُجد {parts.Length}."));

        JwtPart header, payload;
        try { header = ReadPart(parts[0]); }
        catch (Exception ex) { return Fail(Tr.T("Could not decode the header: ", "تعذّر فك الرأس: ") + ex.Message); }
        try { payload = ReadPart(parts[1]); }
        catch (Exception ex) { return Fail(Tr.T("Could not decode the payload: ", "تعذّر فك الحمولة: ") + ex.Message); }

        var alg = Claim(header, "alg");
        var algNone = alg.Equals("none", StringComparison.OrdinalIgnoreCase);
        var exp = Unix(Claim(payload, "exp"));
        var iat = Unix(Claim(payload, "iat"));
        var nbf = Unix(Claim(payload, "nbf"));
        var expired = exp is { } e && e < now;
        var notYet = nbf is { } n && n > now;
        var result = new JwtDecodeResult(true, "", header, payload, parts[2], alg, algNone, exp, iat, nbf, expired, notYet, "");
        return result with { Text = ToText(result, now.Value) };
    }

    public static string ToText(JwtDecodeResult r, DateTimeOffset now)
    {
        if (!r.Ok) return r.Error;
        var sb = new StringBuilder();
        sb.AppendLine(Tr.T("Signatures are not verified (no keys are used).", "التوقيع لا يُتحقق منه (لا تُستخدم أي مفاتيح)."));
        if (r.AlgNone) sb.AppendLine(Tr.T("Warning: alg is \"none\" — this token has no signature.", "تحذير: الخوارزمية none — هذا الرمز بلا توقيع."));
        if (r.Expired) sb.AppendLine(Tr.T($"Expired at {Fmt(r.Exp)} UTC.", $"انتهى في {Fmt(r.Exp)} UTC."));
        else if (r.Exp is { } exp) sb.AppendLine(Tr.T($"Expires {Fmt(exp)} UTC ({Describe(exp, now)}).", $"ينتهي {Fmt(exp)} UTC ({Describe(exp, now)})."));
        if (r.NotYetValid) sb.AppendLine(Tr.T($"Not valid before {Fmt(r.Nbf)} UTC.", $"لا يسري قبل {Fmt(r.Nbf)} UTC."));
        sb.AppendLine($"{Tr.T("Algorithm", "الخوارزمية")}: {(r.Algorithm.Length == 0 ? "—" : r.Algorithm)}");
        if (r.Iat is { } iat) sb.AppendLine($"{Tr.T("Issued at", "وقت الإصدار")}: {Fmt(iat)} UTC");
        sb.AppendLine().AppendLine(Tr.T("Header", "الرأس"));
        sb.AppendLine(r.Header!.Json);
        sb.AppendLine().AppendLine(Tr.T("Payload", "الحمولة"));
        sb.AppendLine(r.Payload!.Json);
        if (r.Signature.Length > 0) sb.AppendLine().AppendLine($"{Tr.T("Signature (Base64URL)", "التوقيع (Base64URL)")}: {r.Signature}");
        return sb.ToString().TrimEnd();
    }

    static JwtDecodeResult Fail(string error) => new(false, error, null, null, "", "", false, null, null, null, false, false, error);

    static JwtPart ReadPart(string b64)
    {
        var json = Encoding.UTF8.GetString(FromBase64Url(b64));
        using var doc = JsonDocument.Parse(json);
        var pretty = JsonSerializer.Serialize(doc.RootElement, new JsonSerializerOptions { WriteIndented = true });
        var claims = new List<JwtClaim>();
        if (doc.RootElement.ValueKind == JsonValueKind.Object)
        {
            foreach (var p in doc.RootElement.EnumerateObject())
                claims.Add(new JwtClaim(p.Name, p.Value.ValueKind is JsonValueKind.String or JsonValueKind.Number or JsonValueKind.True or JsonValueKind.False
                    ? p.Value.ToString() : p.Value.GetRawText()));
        }
        return new JwtPart(b64, pretty, claims);
    }

    static string Claim(JwtPart part, string name) =>
        part.Claims.FirstOrDefault(c => c.Name.Equals(name, StringComparison.OrdinalIgnoreCase))?.Value ?? "";

    static DateTimeOffset? Unix(string value)
    {
        if (!long.TryParse(value, NumberStyles.Integer, CultureInfo.InvariantCulture, out var n)) return null;
        // milliseconds if clearly larger than year 2286 in seconds
        if (n > 10_000_000_000) n /= 1000;
        try { return DateTimeOffset.FromUnixTimeSeconds(n); }
        catch { return null; }
    }

    static string Fmt(DateTimeOffset? t) => t?.UtcDateTime.ToString("yyyy-MM-dd HH:mm:ss") ?? "—";

    static string Describe(DateTimeOffset exp, DateTimeOffset now)
    {
        var d = exp - now;
        if (d.TotalSeconds < 0) return Tr.T("already expired", "منتهٍ");
        if (d.TotalDays >= 2) return Tr.T($"{d.TotalDays:N0} days left", $"متبقّى {d.TotalDays:N0} يومًا");
        if (d.TotalHours >= 2) return Tr.T($"{d.TotalHours:N0} hours left", $"متبقّى {d.TotalHours:N0} ساعة");
        return Tr.T($"{d.TotalMinutes:N0} minutes left", $"متبقّى {d.TotalMinutes:N0} دقيقة");
    }

    public static byte[] FromBase64Url(string text)
    {
        var s = (text ?? "").Trim().Replace('-', '+').Replace('_', '/');
        switch (s.Length % 4) { case 2: s += "=="; break; case 3: s += "="; break; case 1: throw new FormatException(Tr.T("Invalid Base64URL length.", "طول Base64URL غير صالح.")); }
        return Convert.FromBase64String(s);
    }

    public static string ToBase64Url(byte[] data) => Convert.ToBase64String(data).TrimEnd('=').Replace('+', '-').Replace('/', '_');
}
