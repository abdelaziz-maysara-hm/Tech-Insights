using System.Windows;
using NetSecAtlas.Ui;

namespace NetSecAtlasTools;

static class Program
{
    [STAThread]
    static int Main(string[] args)
    {
        AtlasApp.Init(args);
        var app = new Application { ShutdownMode = ShutdownMode.OnMainWindowClose };
        app.DispatcherUnhandledException += (_, e) =>
        {
            AtlasApp.Log("unhandled: " + e.Exception);
            if (AtlasApp.ScreenshotPath != null) { Console.Error.WriteLine(e.Exception); Environment.Exit(3); }
            U.ReportError(e.Exception);
            e.Handled = true;
        };
        TaskScheduler.UnobservedTaskException += (_, e) => { AtlasApp.Log("unobserved: " + e.Exception); e.SetObserved(); };
        return app.Run(new MainWindow());
    }
}
