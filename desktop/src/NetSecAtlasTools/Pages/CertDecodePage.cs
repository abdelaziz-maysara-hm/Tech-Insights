using System.Windows;
using System.Windows.Controls;
using NetSecAtlas.Core;
using NetSecAtlas.Ui;

namespace NetSecAtlasTools.Pages;

public sealed class CertDecodePage : ToolPage
{
    string _input = "", _output = "";

    public CertDecodePage() : base("certdecode", "Certificate / CSR Decoder", "فك الشهادة وطلب CSR",
        "Paste a PEM certificate or a certificate signing request. Parsed on this PC, no network.",
        "الصق شهادة PEM أو طلب توقيع شهادة. التحليل على جهازك وبدون شبكة.", "") { }

    protected override Task OnDemoAsync()
    {
        _input = SampleCert;
        Run();
        return Task.CompletedTask;
    }

    void Run()
    {
        var r = CertDecoder.Parse(_input);
        _output = r.Text;
        SetStatus(r.Ok ? (r.Kind == "csr" ? Tr.T("CSR parsed.", "تم قراءة الطلب.") : Tr.T("Certificate parsed.", "تم قراءة الشهادة.")) : r.Error);
        Rebuild();
    }

    protected override UIElement BuildBody()
    {
        var box = U.Input(_input, multiline: true, height: 180, mono: true).Aid("input");
        box.TextChanged += (_, _) => _input = box.Text;
        return U.Scroll(U.Stack(
            U.Card(U.Stack(
                U.P(Tr.T("Accepts -----BEGIN CERTIFICATE----- or -----BEGIN CERTIFICATE REQUEST-----, or Base64 DER. Complements the TLS checker, which talks to a live host.",
                         "يقبل -----BEGIN CERTIFICATE----- أو -----BEGIN CERTIFICATE REQUEST----- أو DER بـ Base64. يكمل فاحص TLS الذي يتصل بالمضيف."), U.Muted),
                box,
                U.Row(U.Btn(Tr.T("Decode", "فك"), Run, true).Aid("run"),
                      U.Btn(Tr.T("Copy result", "نسخ النتيجة"), () => U.Copy(_output))))),
            U.Card(U.Stack(U.H(Tr.T("Result", "النتيجة")), U.Output(_output, 280)))));
    }

    // Self-signed CN=example.test, valid 2026–2036, generated for the sample only.
    public const string SampleCert = """
-----BEGIN CERTIFICATE-----
MIIDgjCCAmqgAwIBAgIUNejctG04A+71d7sL6zGk5qiINn0wDQYJKoZIhvcNAQEL
BQAwOzEVMBMGA1UEAwwMZXhhbXBsZS50ZXN0MRUwEwYDVQQKDAxOZXRTZWMgQXRs
YXMxCzAJBgNVBAYTAkVHMB4XDTI2MTEyNzE2NTU0OVoXDTM2MTEyNDE2NTU0OVow
OzEVMBMGA1UEAwwMZXhhbXBsZS50ZXN0MRUwEwYDVQQKDAxOZXRTZWMgQXRsYXMx
CzAJBgNVBAYTAkVHMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwHfj
nm8wunAco6u6h3jzLKvt1oabD0+3lEcBgouEowQTzLzrfIRV9FW68O+8h1JIb65T
/W6YMYZ+Ef07qKY5prNp/lia9r+2dNECNPMQkUDwULo789pAMrMZbfDdkwILkb7P
pBpuxynJUFAvwsE6pSKok8GBodxu5nGSB/5ByKUaYEJTxGgejQ15qVyPFVtbXHx2
REnSypvl/hyCNzXjD3ih9/8yGqq0wLMcBta4TDR/R7qiOl8fOS62WOLcCpScerUW
pzzWNBhsPDA5lMG+F6R1KaczOLA4kHvwLvy/2uIVYxwLEpPZtBBy7d67kzAkcIiA
pEojzxfYr3p+jYPlTQIDAQABo34wfDAdBgNVHQ4EFgQU75LyR5kgYWRplmTy04xX
Lj5c8+8wHwYDVR0jBBgwFoAU75LyR5kgYWRplmTy04xXLj5c8+8wDwYDVR0TAQH/
BAUwAwEB/zApBgNVHREEIjAgggxleGFtcGxlLnRlc3SCEHd3dy5leGFtcGxlLnRl
c3QwDQYJKoZIhvcNAQELBQADggEBABZ37/Mw/G3wgJzgu0+eE7DIg9ZdyraRtzoD
QHD/88pkiO52jtWKdcVC3MfgyAfXbEc/oCFCEhpXCpO0OWNwt22rytAj202oEI16
aFtPn7Tu7A6elGEbc5UnHE9oDDgH9qZqj4lTcmyH0AxiKr3MCf7YHXuQqOGNVca6
XdHUsqoFHNlzUPGyDKQ7LUDi8sSQZ7ihxgH3sFdUknrqb/UN3BBY4gJ2tpIG6M8T
npJd9bk6YeSuOH6fZc3xCSjVO791uUkDTw1U61rP4vcLw2V61VLUSs1RycoIE1ty
U1tVrF5PcPTvm1/Dk2TN3SX0DLzdcIsJT5Y1qen2x19fLDUg2TE=
-----END CERTIFICATE-----
""";
}
