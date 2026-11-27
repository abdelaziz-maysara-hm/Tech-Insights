using System.Windows;
using System.Windows.Controls;
using NetSecAtlas.Core;
using NetSecAtlas.Ui;

namespace NetSecAtlasTools.Pages;

public sealed class JwtPage : ToolPage
{
    string _input = "", _output = "";
    JwtDecodeResult? _r;

    // Issued in 2026, expires in 2099; signature is a placeholder — the tool never verifies it.
    public const string Sample = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZGEiLCJuYW1lIjoiTmV0U2VjIEF0bGFzIiwiaWF0IjoxNzY0MjQwMDAwLCJleHAiOjQwNzA5MTg4MDB9.c2ln";

    public JwtPage() : base("jwt", "JWT Decoder", "فك رمز JWT",
        "Decode a JSON Web Token on this PC. The signature is shown but never verified (no keys are used).",
        "فك رمز JWT على جهازك. يظهر التوقيع لكن لا يُتحقق منه (لا تُستخدم أي مفاتيح).", "") { }

    protected override Task OnDemoAsync()
    {
        _input = Sample;
        _r = JwtTool.Decode(_input);
        _output = _r.Text;
        Rebuild();
        return Task.CompletedTask;
    }

    protected override UIElement BuildBody()
    {
        var box = U.Input(_input, multiline: true, height: 120, mono: true).Aid("input");
        box.TextChanged += (_, _) => _input = box.Text;
        var s = U.Stack(
            U.Card(U.Stack(
                U.P(Tr.T("Paste a compact JWT (header.payload.signature). Encrypted tokens (JWE) are not decrypted. Nothing is sent anywhere.",
                         "الصق رمز JWT المضغوط (رأس.حمولة.توقيع). الرموز المشفّرة (JWE) لا تُفك. لا يُرسل شيء إلى أي مكان."), U.Muted),
                box,
                U.Row(U.Btn(Tr.T("Decode", "فك"), Decode, true).Aid("run"),
                      U.Btn(Tr.T("Copy result", "نسخ النتيجة"), () => U.Copy(_output)).Aid("copy")))),
            U.Card(U.Stack(U.H(Tr.T("Result", "النتيجة")), U.Output(_output, 280))));
        return U.Scroll(s);
    }

    void Decode()
    {
        _r = JwtTool.Decode(_input);
        _output = _r.Text;
        SetStatus(_r.Ok ? Tr.T("Decoded.", "تم الفك.") : _r.Error);
        Rebuild();
    }
}
