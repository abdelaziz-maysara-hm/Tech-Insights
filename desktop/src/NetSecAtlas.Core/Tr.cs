namespace NetSecAtlas.Core;

/// <summary>Tiny bilingual string helper. Every user-facing string is written in both languages inline.</summary>
public static class Tr
{
    public static bool Ar { get; set; }
    public static string Lang => Ar ? "ar" : "en";
    public static string T(string en, string ar) => Ar ? ar : en;
}

public static class Links
{
    public const string Site = "https://netsecatlas.com";
    public static string Article(string slug) => $"{Site}/{Tr.Lang}/article/{slug}";
    /// <summary>The program page on the site (one page for the whole unified program).</summary>
    public static string Program(string slug = "") => $"{Site}/{Tr.Lang}/tools";
}
