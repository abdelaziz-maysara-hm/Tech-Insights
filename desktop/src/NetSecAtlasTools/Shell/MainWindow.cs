using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Threading;
using NetSecAtlas.Core;
using NetSecAtlas.Ui;

namespace NetSecAtlasTools;

/// <summary>The single window: category navigation on the side, the selected tool on the right, status bar at the bottom.</summary>
public sealed class MainWindow : Window
{
    public static MainWindow? Current { get; private set; }
    public const string RepoUrl = "https://github.com/abdelaziz-maysara-hm/Tech-Insights";

    readonly List<ToolPage> _pages;
    ToolPage _current;
    readonly TextBlock _status = new TextBlock { Margin = new Thickness(12, 6, 12, 6), Foreground = U.Muted, TextTrimming = TextTrimming.CharacterEllipsis }.Aid("status");
    readonly TextBlock _state = new TextBlock { Margin = new Thickness(12, 6, 12, 6), Foreground = U.Line, FontSize = 11, Text = "idle" }.Aid("state");

    public MainWindow()
    {
        Current = this;
        _pages = ToolRegistry.Create();
        Width = 1180; Height = 800; MinWidth = 820; MinHeight = 560;
        WindowStartupLocation = WindowStartupLocation.CenterScreen;
        FontFamily = new FontFamily("Segoe UI"); FontSize = 14;
        Background = U.Bg;
        this.Aid("main-window");
        try { Icon = BitmapFrame.Create(new Uri("pack://application:,,,/NetSecAtlasTools;component/atlas.png")); } catch { }

        var start = AtlasApp.Arg("--tool")?.ToLowerInvariant();
        if (start is null && AtlasApp.Args.Any(a => !a.StartsWith("--") && File.Exists(a))) start = "hashchecker";
        _current = _pages.FirstOrDefault(p => p.Id == start) ?? _pages[0];
        AllowDrop = true;
        Drop += (_, e) =>
        {
            // Files dropped anywhere outside the hash page open it.
            if (_current.Id != "hashchecker" && e.Data.GetData(DataFormats.FileDrop) is string[] { Length: > 0 } files)
            {
                var hash = _pages.OfType<HashChecker.HashCheckerPage>().First();
                Navigate(hash);
                _ = hash.OpenFileAsync(files[0]);
            }
        };
        Rebuild();
        Loaded += async (_, _) =>
        {
            _current.Activate();
            if (AtlasApp.ScreenshotPath != null)
            {
                await RunSampleAsync();
                await Task.Delay(TimeSpan.FromSeconds(double.TryParse(AtlasApp.Arg("--delay"), out var d) ? d : 2));
                try { Screenshot.Save(this, AtlasApp.ScreenshotPath); } finally { Application.Current.Shutdown(); }
            }
            else if (AtlasApp.Args.Contains("--demo") && !AtlasApp.Test) await RunSampleAsync();
        };
        Closed += (_, _) => Environment.Exit(0); // stop background monitors (ping) immediately
    }

    public IReadOnlyList<ToolPage> Pages => _pages;

    public void SetStatus(string text) => Dispatcher.Invoke(() => _status.Text = text);
    public void SetState(string text) => Dispatcher.Invoke(() => _state.Text = text);

    public void Navigate(ToolPage page)
    {
        _current = page;
        Rebuild();
        page.Activate();
    }

    public void Navigate(string id) { var p = _pages.FirstOrDefault(x => x.Id == id); if (p != null) Navigate(p); }

    /// <summary>Runs the current tool's sample: fills example input and runs the main action. Used by "Try a sample", --demo and UI tests.</summary>
    public async Task RunSampleAsync()
    {
        var page = _current;
        SetState("busy");
        try
        {
            await page.RunSampleAsync();
            await Task.Delay(300);
            if (!_state.Text.StartsWith("error")) SetState("done");
        }
        catch (Exception ex) { U.ReportError(ex); }
        if (AtlasApp.ScreenshotDir != null)
        {
            await Dispatcher.InvokeAsync(() => { }, DispatcherPriority.ApplicationIdle);
            try { Screenshot.Save(this, Path.Combine(AtlasApp.ScreenshotDir, $"{page.Id}-{Tr.Lang}.png")); } catch (Exception ex) { AtlasApp.Log("screenshot: " + ex.Message); }
        }
    }

    void Rebuild()
    {
        Title = $"{_current.PageTitle} — NetSec Atlas Tools";
        FlowDirection = Tr.Ar ? FlowDirection.RightToLeft : FlowDirection.LeftToRight;
        var root = new DockPanel();

        // Header: product name, current tool, actions.
        var header = new Border { Background = U.Brand, Padding = new Thickness(18, 10, 18, 10) };
        var hg = new Grid();
        hg.ColumnDefinitions.Add(new ColumnDefinition());
        hg.ColumnDefinitions.Add(new ColumnDefinition { Width = GridLength.Auto });
        var titles = new StackPanel();
        titles.Children.Add(new TextBlock { Text = _current.PageTitle, FontSize = 21, FontWeight = FontWeights.SemiBold, Foreground = Brushes.White }.Aid("tool-title"));
        titles.Children.Add(new TextBlock { Text = _current.Tagline, Foreground = new SolidColorBrush(Color.FromRgb(0xCF, 0xE3, 0xF2)), TextWrapping = TextWrapping.Wrap });
        hg.Children.Add(titles);
        var actions = new StackPanel { Orientation = Orientation.Horizontal, VerticalAlignment = VerticalAlignment.Center };
        if (_current.HasSample)
            actions.Children.Add(U.HeaderButton(Tr.T("Try a sample", "جرّب مثالًا"), async () => await RunSampleAsync()).Aid("sample"));
        actions.Children.Add(U.HeaderButton(Tr.T("Website", "الموقع"), () => U.Open(Links.Program())).Aid("website"));
        actions.Children.Add(U.HeaderButton(Tr.Ar ? "English" : "عربي", () =>
        {
            Tr.Ar = !Tr.Ar; new Settings { Lang = Tr.Lang }.Save();
            foreach (var p in _pages.Where(p => p.IsActivated)) p.Rebuild();
            Rebuild();
        }).Aid("lang"));
        actions.Children.Add(U.HeaderButton(Tr.T("About", "حول"), ShowAbout).Aid("about"));
        Grid.SetColumn(actions, 1);
        hg.Children.Add(actions);
        header.Child = hg;
        DockPanel.SetDock(header, Dock.Top);
        root.Children.Add(header);

        // Status bar.
        var sg = new DockPanel();
        if (_state.Parent is Panel op) op.Children.Remove(_state);
        if (_status.Parent is Panel os) os.Children.Remove(_status);
        DockPanel.SetDock(_state, Dock.Right);
        sg.Children.Add(_state); sg.Children.Add(_status);
        var footer = new Border { BorderBrush = U.Line, BorderThickness = new Thickness(0, 1, 0, 0), Background = Brushes.White, Child = sg };
        DockPanel.SetDock(footer, Dock.Bottom);
        root.Children.Add(footer);

        // Navigation.
        var nav = new ListBox { Width = 250, BorderThickness = new Thickness(0), Background = Brushes.White, Padding = new Thickness(0, 6, 0, 6) }.Aid("nav");
        ScrollViewer.SetHorizontalScrollBarVisibility(nav, ScrollBarVisibility.Disabled);
        foreach (var group in _pages.GroupBy(p => p.Category))
        {
            if (group.Key.Length > 0)
                nav.Items.Add(new ListBoxItem { Content = ToolRegistry.CategoryName(group.Key), IsEnabled = false, Focusable = false, FontSize = 12, FontWeight = FontWeights.SemiBold, Foreground = U.Muted, Margin = new Thickness(8, 10, 0, 2) });
            foreach (var p in group)
            {
                var item = new ListBoxItem { Content = p.PageTitle, Tag = p, Padding = new Thickness(16, 6, 8, 6), Cursor = Cursors.Hand }.Aid("nav-" + p.Id);
                nav.Items.Add(item);
                if (p == _current) nav.SelectedItem = item;
            }
        }
        nav.SelectionChanged += (_, e) =>
        {
            if (nav.SelectedItem is ListBoxItem { Tag: ToolPage p } && p != _current) Dispatcher.BeginInvoke(() => Navigate(p));
        };
        var navBorder = new Border { BorderBrush = U.Line, BorderThickness = Tr.Ar ? new Thickness(0) : new Thickness(0, 0, 1, 0), Child = nav };
        DockPanel.SetDock(navBorder, Dock.Left);
        root.Children.Add(navBorder);

        if (_current.Parent is Border oldBorder) oldBorder.Child = null;
        root.Children.Add(new Border { Padding = new Thickness(16), Child = _current });
        Content = root;
        if (string.IsNullOrEmpty(_status.Text))
            _status.Text = Tr.T("Ready. No telemetry; nothing leaves this PC unless a tool says so.", "جاهز. لا توجد أي قياسات استخدام؛ لا يخرج شيء من جهازك إلا إذا ذكرت الأداة ذلك.");
    }

    void ShowAbout()
    {
        var v = typeof(MainWindow).Assembly.GetName().Version?.ToString(3);
        var text = Tr.T(
            $"NetSec Atlas Tools {v}\n{_pages.Count - 1} free network and security tools in one program.\nFree and open source (MIT). No telemetry, no ads, no accounts.\n\nWebsite: {Links.Site}\nSource: {RepoUrl}",
            $"NetSec Atlas Tools {v}\n{_pages.Count - 1} أداة مجانية للشبكات والأمان في برنامج واحد.\nمجاني ومفتوح المصدر (MIT). بدون قياسات استخدام أو إعلانات أو حسابات.\n\nالموقع: {Links.Site}\nالمصدر: {RepoUrl}");
        if (AtlasApp.Test) { SetStatus(text.Split('\n')[0]); return; }
        MessageBox.Show(this, text, Tr.T("About", "حول"), MessageBoxButton.OK, MessageBoxImage.Information);
    }
}
