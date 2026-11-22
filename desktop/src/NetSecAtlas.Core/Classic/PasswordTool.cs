using System.Security.Cryptography;

namespace NetSecAtlas.Core;

/// <summary>Random password generator (cryptographic RNG). Every selected character set is guaranteed to appear.</summary>
public static class PasswordTool
{
    const string Lower = "abcdefghijklmnopqrstuvwxyz";
    const string Upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const string Digits = "0123456789";
    const string Symbols = "!@#$%^&*()-_=+[]{};:,.<>?";

    public static string Generate(int length, bool lower, bool upper, bool digits, bool symbols)
    {
        var sets = new List<string>();
        if (lower) sets.Add(Lower);
        if (upper) sets.Add(Upper);
        if (digits) sets.Add(Digits);
        if (symbols) sets.Add(Symbols);
        if (sets.Count == 0) return Tr.T("Select at least one character set.", "اختر نوعًا واحدًا من الأحرف على الأقل.");
        if (length < 4 || length > 128) return Tr.T("Length must be 4-128.", "الطول يجب أن يكون بين 4 و128.");

        var pool = string.Concat(sets);
        var result = new char[length];
        for (int i = 0; i < length; i++) result[i] = pool[RandomNumberGenerator.GetInt32(pool.Length)];
        // Guarantee one character from each chosen set, at distinct random positions.
        var positions = Enumerable.Range(0, length).OrderBy(_ => RandomNumberGenerator.GetInt32(int.MaxValue)).Take(sets.Count).ToArray();
        for (int i = 0; i < sets.Count; i++) result[positions[i]] = sets[i][RandomNumberGenerator.GetInt32(sets[i].Length)];
        return new string(result);
    }
}
