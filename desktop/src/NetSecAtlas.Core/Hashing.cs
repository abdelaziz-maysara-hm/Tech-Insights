using System.Security.Cryptography;
using System.Text.RegularExpressions;

namespace NetSecAtlas.Core;

public enum HashKind { MD5, SHA1, SHA256, SHA384, SHA512 }

public static partial class Hashing
{
    public static readonly HashKind[] All = { HashKind.MD5, HashKind.SHA1, HashKind.SHA256, HashKind.SHA384, HashKind.SHA512 };

    static HashAlgorithmName Name(HashKind k) => k switch
    {
        HashKind.MD5 => HashAlgorithmName.MD5,
        HashKind.SHA1 => HashAlgorithmName.SHA1,
        HashKind.SHA256 => HashAlgorithmName.SHA256,
        HashKind.SHA384 => HashAlgorithmName.SHA384,
        _ => HashAlgorithmName.SHA512,
    };

    /// <summary>Reads the stream once and feeds every requested algorithm.</summary>
    public static async Task<Dictionary<HashKind, string>> ComputeAsync(Stream stream, IEnumerable<HashKind> kinds,
        IProgress<double>? progress = null, CancellationToken ct = default)
    {
        var hashers = kinds.Distinct().ToDictionary(k => k, k => IncrementalHash.CreateHash(Name(k)));
        try
        {
            var buffer = new byte[1 << 20];
            long total = stream.CanSeek ? stream.Length : -1, done = 0;
            int read;
            while ((read = await stream.ReadAsync(buffer, ct).ConfigureAwait(false)) > 0)
            {
                foreach (var h in hashers.Values) h.AppendData(buffer, 0, read);
                done += read;
                if (total > 0) progress?.Report((double)done / total);
            }
            progress?.Report(1);
            return hashers.ToDictionary(p => p.Key, p => Convert.ToHexStringLower(p.Value.GetHashAndReset()));
        }
        finally { foreach (var h in hashers.Values) h.Dispose(); }
    }

    public static async Task<Dictionary<HashKind, string>> ComputeFileAsync(string path, IEnumerable<HashKind> kinds,
        IProgress<double>? progress = null, CancellationToken ct = default)
    {
        await using var fs = new FileStream(path, FileMode.Open, FileAccess.Read, FileShare.Read, 1 << 16, FileOptions.SequentialScan | FileOptions.Asynchronous);
        return await ComputeAsync(fs, kinds, progress, ct).ConfigureAwait(false);
    }

    [GeneratedRegex("^[0-9a-f]+$")] private static partial Regex HexRx();

    /// <summary>Accepts "SHA256: AB CD..", "sha256:abcd", upper/lower case, spaces and dashes.</summary>
    public static string Normalize(string? input)
    {
        if (string.IsNullOrWhiteSpace(input)) return "";
        var s = input.Trim().ToLowerInvariant();
        var colon = s.LastIndexOf(':');
        if (colon >= 0 && colon < 10) s = s[(colon + 1)..];
        s = new string(s.Where(c => !char.IsWhiteSpace(c) && c != '-').ToArray());
        return HexRx().IsMatch(s) ? s : "";
    }

    public static HashKind? DetectKind(string normalizedHex) => normalizedHex.Length switch
    {
        32 => HashKind.MD5, 40 => HashKind.SHA1, 64 => HashKind.SHA256, 96 => HashKind.SHA384, 128 => HashKind.SHA512, _ => null,
    };

    /// <summary>Returns the algorithm whose result equals the expected hash, or null. Comparison is constant-time.</summary>
    public static HashKind? Match(string expected, IReadOnlyDictionary<HashKind, string> results)
    {
        var n = Normalize(expected);
        var kind = DetectKind(n);
        if (kind is null || !results.TryGetValue(kind.Value, out var actual)) return null;
        return CryptographicOperations.FixedTimeEquals(System.Text.Encoding.ASCII.GetBytes(n), System.Text.Encoding.ASCII.GetBytes(actual)) ? kind : null;
    }

    /// <summary>Finds the expected hash for a file name in SHA256SUMS-style text ("hash  name" or "hash *name").</summary>
    public static string? FindInSumsFile(string sumsText, string fileName)
    {
        foreach (var raw in sumsText.Split('\n'))
        {
            var line = raw.Trim();
            var parts = line.Split(new[] { ' ', '\t' }, 2, StringSplitOptions.RemoveEmptyEntries);
            if (parts.Length != 2) continue;
            var name = parts[1].Trim().TrimStart('*');
            if (string.Equals(Path.GetFileName(name), fileName, StringComparison.OrdinalIgnoreCase) && Normalize(parts[0]).Length > 0)
                return Normalize(parts[0]);
        }
        return null;
    }
}
