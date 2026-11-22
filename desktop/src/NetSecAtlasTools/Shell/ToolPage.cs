using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;
using NetSecAtlas.Core;
using NetSecAtlasTools;

namespace NetSecAtlas.Ui;

/// <summary>
/// One tool inside the main window. Mirrors the old per-app AtlasWindow API (BuildBody, OnDemoAsync, Rebuild, SetStatus)
/// so each former app moved over almost unchanged. A page converts to its owner Window for dialogs.
/// </summary>
public abstract class ToolPage : UserControl
{
    public string Id { get; }
    public string Slug { get; }
    public string Category { get; set; } = "";
    readonly string _titleEn, _titleAr, _taglineEn, _taglineAr;
    bool _activated;

    public string PageTitle => Tr.T(_titleEn, _titleAr);
    public string TitleEn => _titleEn;
    public string Tagline => Tr.T(_taglineEn, _taglineAr);
    public bool IsActivated => _activated;
    /// <summary>False for pages whose sample needs nothing (they still get a "Try a sample" button when OnDemoAsync is overridden).</summary>
    public virtual bool HasSample => GetType().GetMethod(nameof(OnDemoAsync), System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.NonPublic)!.DeclaringType != typeof(ToolPage);

    /// <summary>Raised once, the first time the page is shown (replaces Window.Loaded from the stand-alone apps).</summary>
    public new event EventHandler? Loaded;

    protected ToolPage(string id, string titleEn, string titleAr, string taglineEn, string taglineAr, string slug, double width = 0, double height = 0)
    {
        Id = id.ToLowerInvariant(); _titleEn = titleEn; _titleAr = titleAr; _taglineEn = taglineEn; _taglineAr = taglineAr; Slug = slug;
        Background = Brushes.Transparent;
        this.Aid("page-" + Id);
    }

    protected abstract UIElement BuildBody();
    protected virtual Task OnDemoAsync() => Task.CompletedTask;
    public Task RunSampleAsync() => OnDemoAsync();

    public void SetStatus(string text) => MainWindow.Current?.SetStatus(text);
    public void Close() => MainWindow.Current?.Close();

    public void Rebuild()
    {
        FlowDirection = Tr.Ar ? FlowDirection.RightToLeft : FlowDirection.LeftToRight;
        Content = BuildBody();
    }

    internal void Activate()
    {
        if (_activated) return;
        _activated = true;
        Rebuild();
        Loaded?.Invoke(this, EventArgs.Empty);
    }

    public static implicit operator Window(ToolPage p) => MainWindow.Current ?? Application.Current.MainWindow;
}
