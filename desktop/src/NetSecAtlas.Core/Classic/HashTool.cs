using System.Security.Cryptography;
using System.Text;

namespace NetSecAtlas.Core;

/// <summary>Hashes of a text string (UTF-8).</summary>
public static class HashTool
{
    public static IReadOnlyList<(string Algorithm, string Hash)> ComputeAll(string text)
    {
        var bytes = Encoding.UTF8.GetBytes(text ?? "");
        return new[]
        {
            ("MD5", Hex(MD5.HashData(bytes))), ("SHA1", Hex(SHA1.HashData(bytes))), ("SHA256", Hex(SHA256.HashData(bytes))),
            ("SHA384", Hex(SHA384.HashData(bytes))), ("SHA512", Hex(SHA512.HashData(bytes))),
        };
    }

    public static string Compute(string text) => string.IsNullOrEmpty(text) ? Tr.T("Enter text.", "اكتب نصًا.") : string.Join("\n", ComputeAll(text).Select(h => $"{h.Algorithm + ":",-8}{h.Hash}"));

    static string Hex(byte[] data) => System.Convert.ToHexString(data).ToLowerInvariant();
}
