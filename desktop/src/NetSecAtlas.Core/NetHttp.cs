namespace NetSecAtlas.Core;

/// <summary>Shared HTTP GET for the few tools that call a public endpoint. No API keys. Caller must handle failures.</summary>
public static class NetHttp
{
    static readonly HttpClient Client = Create();

    static HttpClient Create()
    {
        var c = new HttpClient(new HttpClientHandler { AllowAutoRedirect = true }) { Timeout = TimeSpan.FromSeconds(15) };
        c.DefaultRequestHeaders.UserAgent.ParseAdd("NetSecAtlasTools/2.1 (+https://netsecatlas.com)");
        c.DefaultRequestHeaders.Accept.ParseAdd("application/json, text/plain, */*");
        return c;
    }

    public static async Task<string> GetStringAsync(string url, TimeSpan? timeout = null, CancellationToken ct = default)
    {
        using var cts = CancellationTokenSource.CreateLinkedTokenSource(ct);
        cts.CancelAfter(timeout ?? TimeSpan.FromSeconds(15));
        using var resp = await Client.GetAsync(url, cts.Token).ConfigureAwait(false);
        var body = await resp.Content.ReadAsStringAsync(cts.Token).ConfigureAwait(false);
        if (!resp.IsSuccessStatusCode)
            throw new HttpRequestException($"{(int)resp.StatusCode} {resp.ReasonPhrase}".Trim());
        return body;
    }
}
