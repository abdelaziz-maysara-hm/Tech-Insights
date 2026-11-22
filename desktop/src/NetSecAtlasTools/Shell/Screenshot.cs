using System.Windows;
using System.Windows.Media;
using System.Windows.Media.Imaging;

namespace NetSecAtlas.Ui;

public static class Screenshot
{
    /// <summary>Renders the real window content to PNG (used by CI to publish genuine screenshots).</summary>
    public static void Save(Window w, string path)
    {
        if (w.Content is not FrameworkElement root) return;
        root.UpdateLayout();
        int width = (int)Math.Ceiling(root.ActualWidth), height = (int)Math.Ceiling(root.ActualHeight);
        if (width == 0 || height == 0) return;
        var rtb = new RenderTargetBitmap(width, height, 96, 96, PixelFormats.Pbgra32);
        var dv = new DrawingVisual();
        using (var ctx = dv.RenderOpen())
        {
            ctx.DrawRectangle(Brushes.White, null, new Rect(0, 0, width, height));
            ctx.DrawRectangle(new VisualBrush(root), null, new Rect(0, 0, width, height));
        }
        rtb.Render(dv);
        var enc = new PngBitmapEncoder();
        enc.Frames.Add(BitmapFrame.Create(rtb));
        Directory.CreateDirectory(Path.GetDirectoryName(Path.GetFullPath(path))!);
        using var fs = File.Create(path);
        enc.Save(fs);
    }
}
