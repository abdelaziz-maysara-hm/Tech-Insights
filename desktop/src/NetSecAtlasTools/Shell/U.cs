using System.Diagnostics;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using Microsoft.Win32;
using NetSecAtlas.Core;

namespace NetSecAtlas.Ui;

/// <summary>Small code-only UI toolkit so every app looks consistent without XAML.</summary>
public static class U
{
    public static readonly SolidColorBrush Brand = new(Color.FromRgb(0x0E, 0x3A, 0x60));
    public static readonly SolidColorBrush Accent = new(Color.FromRgb(0x20, 0xA0, 0x8C));
    public static readonly SolidColorBrush Bg = new(Color.FromRgb(0xF4, 0xF7, 0xFA));
    public static readonly SolidColorBrush Line = new(Color.FromRgb(0xD9, 0xE2, 0xEA));
    public static readonly SolidColorBrush Muted = new(Color.FromRgb(0x5B, 0x6B, 0x7B));
    public static readonly SolidColorBrush OkBrush = new(Color.FromRgb(0x1E, 0x8E, 0x3E));
    public static readonly SolidColorBrush WarnBrush = new(Color.FromRgb(0xB2, 0x6B, 0x00));
    public static readonly SolidColorBrush BadBrush = new(Color.FromRgb(0xC6, 0x28, 0x28));
    public static readonly SolidColorBrush InfoBrush = new(Color.FromRgb(0x2F, 0x6F, 0xB3));

    public static SolidColorBrush LevelBrush(Level l) => l switch { Level.Ok => OkBrush, Level.Warn => WarnBrush, Level.Bad => BadBrush, Level.Info => InfoBrush, _ => Muted };
    public static string LevelText(Level l) => l switch
    {
        Level.Ok => Tr.T("OK", "سليم"), Level.Warn => Tr.T("Warning", "تحذير"), Level.Bad => Tr.T("Problem", "مشكلة"), Level.Info => Tr.T("Info", "معلومة"), _ => Tr.T("Unknown", "غير معروف"),
    };

    public static void Open(string url)
    {
        try { Process.Start(new ProcessStartInfo(url) { UseShellExecute = true }); } catch { }
    }

    public static Button HeaderButton(string text, Action click)
    {
        var b = new Button { Content = text, Margin = new Thickness(6, 0, 0, 0), Padding = new Thickness(12, 5, 12, 5), Foreground = Brushes.White,
            Background = new SolidColorBrush(Color.FromArgb(0x33, 0xFF, 0xFF, 0xFF)), BorderBrush = new SolidColorBrush(Color.FromArgb(0x66, 0xFF, 0xFF, 0xFF)), Cursor = Cursors.Hand };
        b.Click += (_, _) => click();
        return b;
    }

    public static Button Btn(string text, Action click, bool primary = false)
    {
        var b = new Button { Content = text, Padding = new Thickness(14, 6, 14, 6), Margin = new Thickness(0, 0, 8, 0), Cursor = Cursors.Hand, MinHeight = 32 };
        if (primary) { b.Background = Accent; b.Foreground = Brushes.White; b.BorderBrush = Accent; b.FontWeight = FontWeights.SemiBold; }
        b.Click += (_, _) => click();
        return b;
    }

    public static Button AsyncBtn(string text, Func<Task> click, bool primary = false)
    {
        Button? b = null;
        b = Btn(text, async () =>
        {
            b!.IsEnabled = false;
            try { await click(); }
            catch (Exception ex) { ReportError(ex); }
            finally { b.IsEnabled = true; }
        }, primary);
        return b;
    }

    public static TextBlock H(string text, double size = 17) => new() { Text = text, FontSize = size, FontWeight = FontWeights.SemiBold, Margin = new Thickness(0, 4, 0, 6), Foreground = Brand, TextWrapping = TextWrapping.Wrap };
    public static TextBlock P(string text, Brush? color = null) => new() { Text = text, TextWrapping = TextWrapping.Wrap, Margin = new Thickness(0, 0, 0, 8), Foreground = color ?? Brushes.Black };

    public static TextBox Input(string text = "", bool multiline = false, double height = double.NaN, bool mono = false)
    {
        var t = new TextBox { Text = text, Padding = new Thickness(6, 4, 6, 4), Margin = new Thickness(0, 0, 8, 8), VerticalContentAlignment = VerticalAlignment.Center };
        if (multiline) { t.AcceptsReturn = true; t.TextWrapping = TextWrapping.NoWrap; t.VerticalScrollBarVisibility = ScrollBarVisibility.Auto; t.HorizontalScrollBarVisibility = ScrollBarVisibility.Auto; t.Height = double.IsNaN(height) ? 140 : height; t.VerticalContentAlignment = VerticalAlignment.Top; }
        if (mono) { t.FontFamily = new FontFamily("Cascadia Mono, Consolas"); t.FlowDirection = FlowDirection.LeftToRight; }
        return t;
    }

    public static StackPanel Row(params UIElement[] children)
    {
        var s = new StackPanel { Orientation = Orientation.Horizontal, Margin = new Thickness(0, 0, 0, 8) };
        foreach (var c in children) s.Children.Add(c);
        return s;
    }

    public static StackPanel Stack(params UIElement[] children)
    {
        var s = new StackPanel();
        foreach (var c in children) s.Children.Add(c);
        return s;
    }

    public static Border Card(UIElement child, double margin = 10) => new()
    {
        Background = Brushes.White, BorderBrush = Line, BorderThickness = new Thickness(1), CornerRadius = new CornerRadius(8), Padding = new Thickness(14), Margin = new Thickness(0, 0, 0, margin), Child = child,
    };

    public static Border Badge(Level l, string? text = null) => new()
    {
        Background = LevelBrush(l), CornerRadius = new CornerRadius(10), Padding = new Thickness(9, 2, 9, 2), Margin = new Thickness(0, 0, 8, 0), VerticalAlignment = VerticalAlignment.Center,
        Child = new TextBlock { Text = text ?? LevelText(l), Foreground = Brushes.White, FontSize = 12, FontWeight = FontWeights.SemiBold },
    };

    public static TextBlock Link(string text, string url)
    {
        var h = new Hyperlink(new Run(text)) { NavigateUri = new Uri(url) };
        h.RequestNavigate += (_, e) => Open(e.Uri.ToString());
        return new TextBlock(h) { Margin = new Thickness(0, 2, 0, 2) };
    }

    /// <summary>Finding row: badge + title + detail (+ optional link).</summary>
    public static UIElement FindingRow(Level level, string title, string detail, string? linkText = null, string? url = null, string? automationId = null)
    {
        var g = new Grid { Margin = new Thickness(0, 0, 0, 8) };
        g.ColumnDefinitions.Add(new ColumnDefinition { Width = new GridLength(100) });
        g.ColumnDefinitions.Add(new ColumnDefinition());
        var badge = Badge(level); badge.HorizontalAlignment = HorizontalAlignment.Left; badge.VerticalAlignment = VerticalAlignment.Top;
        g.Children.Add(badge);
        var s = new StackPanel();
        var t = new TextBlock { Text = title, FontWeight = FontWeights.SemiBold, TextWrapping = TextWrapping.Wrap };
        if (automationId != null) t.Aid(automationId);
        s.Children.Add(t);
        if (detail.Length > 0) s.Children.Add(new TextBlock { Text = detail, TextWrapping = TextWrapping.Wrap, Foreground = Muted });
        if (url != null) s.Children.Add(Link(linkText ?? url, url));
        Grid.SetColumn(s, 1); g.Children.Add(s);
        return g;
    }

    /// <summary>Read-only table bound to string arrays.</summary>
    public static DataGrid Table(string[] headers, IEnumerable<string[]> rows, double height = double.NaN)
    {
        var dg = new DataGrid
        {
            AutoGenerateColumns = false, IsReadOnly = true, CanUserAddRows = false, HeadersVisibility = DataGridHeadersVisibility.Column,
            GridLinesVisibility = DataGridGridLinesVisibility.Horizontal, HorizontalGridLinesBrush = Line, Background = Brushes.White,
            RowBackground = Brushes.White, AlternatingRowBackground = new SolidColorBrush(Color.FromRgb(0xF8, 0xFA, 0xFC)), BorderBrush = Line,
            SelectionMode = DataGridSelectionMode.Extended, ClipboardCopyMode = DataGridClipboardCopyMode.IncludeHeader, Margin = new Thickness(0, 0, 0, 8),
        };
        if (!double.IsNaN(height)) dg.Height = height;
        for (int i = 0; i < headers.Length; i++)
            dg.Columns.Add(new DataGridTextColumn { Header = headers[i], Binding = new Binding($"[{i}]"), Width = i == headers.Length - 1 ? new DataGridLength(1, DataGridLengthUnitType.Star) : DataGridLength.Auto });
        dg.ItemsSource = rows.ToList();
        return dg;
    }

    public static ScrollViewer Scroll(UIElement content) => new() { Content = content, VerticalScrollBarVisibility = ScrollBarVisibility.Auto, HorizontalScrollBarVisibility = ScrollBarVisibility.Disabled };

    public static void SaveText(Window owner, string content, string defaultName, string filter = "Text (*.txt)|*.txt|All files (*.*)|*.*")
    {
        var d = new SaveFileDialog { FileName = defaultName, Filter = filter };
        if (d.ShowDialog(owner) == true) { File.WriteAllText(d.FileName, content, new System.Text.UTF8Encoding(true)); }
    }

    /// <summary>Shows an error. In --test mode it goes to the status bar and the automation "state" field instead of a blocking dialog.</summary>
    public static void ReportError(Exception ex)
    {
        var msg = ex.GetBaseException().Message;
        if (AtlasApp.Test) { AtlasApp.Log("error: " + ex); NetSecAtlasTools.MainWindow.Current?.SetState("error: " + msg); NetSecAtlasTools.MainWindow.Current?.SetStatus(msg); return; }
        MessageBox.Show(msg, "NetSec Atlas Tools", MessageBoxButton.OK, MessageBoxImage.Warning);
    }

    public static T Aid<T>(this T e, string automationId) where T : DependencyObject { System.Windows.Automation.AutomationProperties.SetAutomationId(e, automationId); return e; }

    /// <summary>Read-only monospace output box (selectable, copyable).</summary>
    public static TextBox Output(string text, double height = 200)
    {
        var t = Input(text, multiline: true, height: height, mono: true);
        t.IsReadOnly = true; t.Background = new SolidColorBrush(Color.FromRgb(0xFB, 0xFC, 0xFD));
        return t.Aid("result");
    }

    public static void Copy(string text) { try { Clipboard.SetText(text); } catch { } }
}
