using Xunit.Abstractions;
using Xunit.Sdk;

namespace NetSecAtlasTools.UiTests;

/// <summary>Runs tests in name order (T00, T10, … T99) so the final checks see the whole session.</summary>
public sealed class NameOrderer : ITestCaseOrderer
{
    public IEnumerable<TTestCase> OrderTestCases<TTestCase>(IEnumerable<TTestCase> testCases) where TTestCase : ITestCase
        => testCases.OrderBy(t => t.TestMethod.Method.Name, StringComparer.Ordinal).ToList(); // theory rows keep their declared order (stable sort)
}
