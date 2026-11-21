using System.Security.Cryptography;
using System.Text;

namespace NetSecAtlasTools;

public static class HashTool
{
    public static string Compute(string text)
    {
        if (string.IsNullOrEmpty(text)) return "Enter text.";
        var bytes = Encoding.UTF8.GetBytes(text);
        return $"MD5:    {Hex(MD5.HashData(bytes))}\nSHA1:   {Hex(SHA1.HashData(bytes))}\nSHA256: {Hex(SHA256.HashData(bytes))}\nSHA512: {Hex(SHA512.HashData(bytes))}";
    }

    static string Hex(byte[] data) => Convert.ToHexString(data).ToLowerInvariant();
}
