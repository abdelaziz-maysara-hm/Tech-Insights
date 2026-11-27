using System.Windows;
using System.Windows.Controls;
using System.Windows.Media.Imaging;
using Microsoft.Win32;
using NetSecAtlas.Core;
using NetSecAtlas.Ui;
using QRCoder;

namespace NetSecAtlasTools.Pages;

public sealed class WifiQrPage : ToolPage
{
    string _ssid = "", _password = "", _security = WifiQr.Wpa, _payload = "";
    bool _hidden;
    byte[]? _png;

    public WifiQrPage() : base("wifiqr", "Wi-Fi QR Code", "رمز QR لشبكة Wi-Fi",
        "Make a QR code that phones can scan to join a Wi-Fi network. Built on this PC; the password is not sent anywhere.",
        "أنشئ رمز QR يمسحه الهاتف للانضمام إلى شبكة Wi-Fi. يُنشأ على جهازك ولا تُرسل كلمة المرور إلى أي مكان.", "") { }

    protected override Task OnDemoAsync()
    {
        _ssid = "Guest-Office"; _password = "Correct-Horse-Battery"; _security = WifiQr.Wpa; _hidden = false;
        Generate();
        return Task.CompletedTask;
    }

    void Generate()
    {
        try
        {
            _payload = WifiQr.Payload(_ssid, _password, _security, _hidden);
            using var gen = new QRCodeGenerator();
            using var data = gen.CreateQrCode(_payload, QRCodeGenerator.ECCLevel.Q);
            using var qr = new PngByteQRCode(data);
            _png = qr.GetGraphic(8);
            SetStatus(Tr.T("QR code ready. Scan it with a phone camera.", "رمز QR جاهز. امسحه بكاميرا الهاتف."));
        }
        catch (Exception ex)
        {
            _payload = "⚠ " + ex.Message;
            _png = null;
            SetStatus(ex.Message);
        }
        Rebuild();
    }

    protected override UIElement BuildBody()
    {
        var ssid = U.Input(_ssid).Aid("input"); ssid.Width = 320; ssid.TextChanged += (_, _) => _ssid = ssid.Text;
        var pw = U.Input(_password).Aid("input2"); pw.Width = 320; pw.TextChanged += (_, _) => _password = pw.Text;
        var sec = new ComboBox { Width = 160, Margin = new Thickness(0, 0, 8, 8) };
        foreach (var x in new[] { "WPA", "WEP", "nopass" }) sec.Items.Add(x);
        sec.SelectedItem = _security == WifiQr.Nopass ? "nopass" : _security;
        sec.SelectionChanged += (_, _) => _security = sec.SelectedItem?.ToString() ?? WifiQr.Wpa;
        var hid = new CheckBox { Content = Tr.T("Hidden network", "شبكة مخفية"), IsChecked = _hidden, Margin = new Thickness(0, 4, 16, 8), VerticalAlignment = VerticalAlignment.Center };
        hid.Checked += (_, _) => _hidden = true; hid.Unchecked += (_, _) => _hidden = false;

        UIElement image = new TextBlock { Text = Tr.T("Fill the network name and press Generate.", "أدخل اسم الشبكة واضغط إنشاء."), Foreground = U.Muted };
        if (_png != null)
        {
            var bmp = new BitmapImage();
            using var ms = new MemoryStream(_png);
            bmp.BeginInit(); bmp.CacheOption = BitmapCacheOption.OnLoad; bmp.StreamSource = ms; bmp.EndInit(); bmp.Freeze();
            image = new Image { Source = bmp, Width = 240, Height = 240, Stretch = System.Windows.Media.Stretch.Uniform, HorizontalAlignment = HorizontalAlignment.Left, Margin = new Thickness(0, 0, 0, 8) };
        }

        return U.Scroll(U.Stack(
            U.Card(U.Stack(
                U.P(Tr.T("Network name (SSID)", "اسم الشبكة (SSID)"), U.Muted), ssid,
                U.P(Tr.T("Password (leave empty for nopass)", "كلمة المرور (اتركها فارغة لـ nopass)"), U.Muted), pw,
                U.Row(sec, hid),
                U.Row(U.Btn(Tr.T("Generate", "إنشاء"), Generate, true).Aid("run"),
                      U.Btn(Tr.T("Copy payload", "نسخ النص"), () => U.Copy(_payload)),
                      U.Btn(Tr.T("Save PNG…", "حفظ PNG…"), Save)))),
            U.Card(U.Stack(U.H(Tr.T("QR code", "رمز QR")), image, U.Output(_payload, 80)))));
    }

    void Save()
    {
        if (_png is null) { Generate(); if (_png is null) return; }
        var d = new SaveFileDialog { FileName = "wifi-qr.png", Filter = "PNG (*.png)|*.png" };
        if (d.ShowDialog(this) == true) File.WriteAllBytes(d.FileName, _png);
    }
}
