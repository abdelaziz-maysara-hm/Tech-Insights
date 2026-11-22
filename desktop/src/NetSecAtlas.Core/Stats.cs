namespace NetSecAtlas.Core;

public sealed record LatencyStats(int Sent, int Received, double LossPercent, double? Min, double? Avg, double? Median, double? P95, double? Max, double? Jitter)
{
    public static LatencyStats From(IReadOnlyList<double?> samples)
    {
        var ok = samples.Where(s => s.HasValue).Select(s => s!.Value).ToList();
        int sent = samples.Count, rec = ok.Count;
        double loss = sent == 0 ? 0 : Math.Round(100.0 * (sent - rec) / sent, 1);
        if (rec == 0) return new(sent, 0, loss, null, null, null, null, null, null);
        var sorted = ok.OrderBy(x => x).ToList();
        double Pct(double p) => sorted[Math.Clamp((int)Math.Ceiling(p * sorted.Count) - 1, 0, sorted.Count - 1)];
        double median = sorted.Count % 2 == 1 ? sorted[sorted.Count / 2] : (sorted[sorted.Count / 2 - 1] + sorted[sorted.Count / 2]) / 2;
        // Jitter: mean absolute difference between consecutive successful samples (RFC 3550 style, unsmoothed).
        double? jitter = ok.Count < 2 ? 0 : ok.Zip(ok.Skip(1), (a, b) => Math.Abs(b - a)).Average();
        return new(sent, rec, loss, sorted[0], Math.Round(ok.Average(), 1), median, Pct(0.95), sorted[^1], jitter is null ? null : Math.Round(jitter.Value, 1));
    }
}
