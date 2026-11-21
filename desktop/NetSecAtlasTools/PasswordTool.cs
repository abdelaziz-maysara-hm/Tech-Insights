using System.Security.Cryptography;

namespace NetSecAtlasTools;

public static class PasswordTool
{
    const string Lower = "abcdefghijklmnopqrstuvwxyz";
    const string Upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const string Digits = "0123456789";
    const string Symbols = "!@#$%^&*()-_=+[]{};:,.<>?";

    public static string Generate(int length, bool lower, bool upper, bool digits, bool symbols)
    {
        var pool = "";
        if (lower) pool += Lower;
        if (upper) pool += Upper;
        if (digits) pool += Digits;
        if (symbols) pool += Symbols;
        if (pool.Length == 0) return "Select at least one character set.";
        if (length < 4 || length > 128) return "Length must be 4-128.";

        var result = new char[length];
        for (int i = 0; i < length; i++)
            result[i] = pool[RandomNumberGenerator.GetInt32(pool.Length)];
        return new string(result);
    }
}
