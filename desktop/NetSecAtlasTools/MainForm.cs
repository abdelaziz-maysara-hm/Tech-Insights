using System.Drawing;
using System.Windows.Forms;

namespace NetSecAtlasTools;

public class MainForm : Form
{
    public MainForm()
    {
        Text = "NetSec Atlas Tools";
        Size = new Size(960, 720);
        StartPosition = FormStartPosition.CenterScreen;
        Font = new Font("Segoe UI", 10);

        var tabs = new TabControl { Dock = DockStyle.Fill };

        tabs.TabPages.Add(MakeSubnetTab());
        tabs.TabPages.Add(MakeVlsmTab());
        tabs.TabPages.Add(MakeRangeTab());
        tabs.TabPages.Add(MakePortsTab());
        tabs.TabPages.Add(MakeHashTab());
        tabs.TabPages.Add(MakeEncodingTab());
        tabs.TabPages.Add(MakePasswordTab());
        tabs.TabPages.Add(MakeIpTab());
        tabs.TabPages.Add(MakeAboutTab());

        Controls.Add(tabs);
    }

    static TabPage MakeSubnetTab()
    {
        var page = new TabPage("Subnet");
        var panel = new TableLayoutPanel { Dock = DockStyle.Fill, ColumnCount = 2, Padding = new Padding(12) };
        panel.ColumnStyles.Add(new ColumnStyle(SizeType.Absolute, 140));
        panel.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 100));

        var input = new TextBox { Dock = DockStyle.Fill, Text = "192.168.1.0/24" };
        var result = new TextBox { Dock = DockStyle.Fill, Multiline = true, ReadOnly = true, ScrollBars = ScrollBars.Vertical, Font = new Font("Consolas", 10) };

        void Calculate() { try { result.Text = SubnetCalculator.Calculate(input.Text.Trim()).ToString(); } catch (Exception ex) { result.Text = "Error: " + ex.Message; } }
        input.TextChanged += (_, _) => Calculate();

        panel.Controls.Add(new Label { Text = "Network (CIDR):", AutoSize = true, Anchor = AnchorStyles.Left }, 0, 0);
        panel.Controls.Add(input, 1, 0);
        panel.Controls.Add(result, 0, 1);
        panel.SetColumnSpan(result, 2);
        panel.RowStyles.Add(new RowStyle(SizeType.Absolute, 36));
        panel.RowStyles.Add(new RowStyle(SizeType.Percent, 100));

        page.Controls.Add(panel);
        Calculate();
        return page;
    }

    static TabPage MakeVlsmTab()
    {
        var page = new TabPage("VLSM");
        var panel = new TableLayoutPanel { Dock = DockStyle.Fill, ColumnCount = 2, Padding = new Padding(12) };
        panel.ColumnStyles.Add(new ColumnStyle(SizeType.Absolute, 140));
        panel.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 100));

        var baseBox = new TextBox { Dock = DockStyle.Fill, Text = "192.168.1.0/24" };
        var segments = new TextBox { Dock = DockStyle.Fill, Multiline = true, Font = new Font("Consolas", 10), Text = "Users 100\nServers 50\nManagement 10\nWAN 2" };
        var result = new TextBox { Dock = DockStyle.Fill, Multiline = true, ReadOnly = true, ScrollBars = ScrollBars.Vertical, Font = new Font("Consolas", 10) };

        void Calculate()
        {
            try
            {
                var reqs = new List<(string, int)>();
                foreach (var line in segments.Lines)
                {
                    var parts = line.Trim().Split(' ', StringSplitOptions.RemoveEmptyEntries);
                    if (parts.Length >= 2 && int.TryParse(parts[^1], out var hosts))
                        reqs.Add((string.Join(" ", parts[..^1]), hosts));
                }
                result.Text = VlsmCalculator.Calculate(baseBox.Text.Trim(), reqs);
            }
            catch (Exception ex) { result.Text = "Error: " + ex.Message; }
        }

        baseBox.TextChanged += (_, _) => Calculate();
        segments.TextChanged += (_, _) => Calculate();

        panel.Controls.Add(new Label { Text = "Parent:", AutoSize = true, Anchor = AnchorStyles.Left }, 0, 0);
        panel.Controls.Add(baseBox, 1, 0);
        panel.Controls.Add(new Label { Text = "Segments:", AutoSize = true, Anchor = AnchorStyles.Left }, 0, 1);
        panel.Controls.Add(segments, 1, 1);
        panel.Controls.Add(result, 0, 2);
        panel.SetColumnSpan(result, 2);

        panel.RowStyles.Add(new RowStyle(SizeType.Absolute, 32));
        panel.RowStyles.Add(new RowStyle(SizeType.Absolute, 120));
        panel.RowStyles.Add(new RowStyle(SizeType.Percent, 100));

        page.Controls.Add(panel);
        Calculate();
        return page;
    }

    static TabPage MakeRangeTab()
    {
        var page = new TabPage("Range");
        var panel = new TableLayoutPanel { Dock = DockStyle.Fill, ColumnCount = 2, Padding = new Padding(12) };
        panel.ColumnStyles.Add(new ColumnStyle(SizeType.Absolute, 140));
        panel.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 100));

        var input = new TextBox { Dock = DockStyle.Fill, Text = "192.168.1.10 - 192.168.1.50" };
        var result = new TextBox { Dock = DockStyle.Fill, Multiline = true, ReadOnly = true, ScrollBars = ScrollBars.Vertical, Font = new Font("Consolas", 10) };

        void Calculate() { try { result.Text = RangeToCidr.Convert(input.Text); } catch (Exception ex) { result.Text = "Error: " + ex.Message; } }
        input.TextChanged += (_, _) => Calculate();

        panel.Controls.Add(new Label { Text = "Range or CIDR:", AutoSize = true, Anchor = AnchorStyles.Left }, 0, 0);
        panel.Controls.Add(input, 1, 0);
        panel.Controls.Add(result, 0, 1);
        panel.SetColumnSpan(result, 2);
        panel.RowStyles.Add(new RowStyle(SizeType.Absolute, 36));
        panel.RowStyles.Add(new RowStyle(SizeType.Percent, 100));

        page.Controls.Add(panel);
        Calculate();
        return page;
    }

    static TabPage MakePortsTab()
    {
        var page = new TabPage("Ports");
        var search = new TextBox { Dock = DockStyle.Top, PlaceholderText = "Search (443, ssh, rdp...)" };
        var list = new ListView { Dock = DockStyle.Fill, View = View.Details, FullRowSelect = true };
        list.Columns.Add("Port", 70);
        list.Columns.Add("Protocol", 80);
        list.Columns.Add("Name", 120);
        list.Columns.Add("Description", 380);

        void Refresh()
        {
            list.Items.Clear();
            var q = search.Text.Trim().ToLowerInvariant();
            foreach (var p in CommonPorts.All)
            {
                if (q.Length == 0 || p.Port.ToString().Contains(q) || p.Name.ToLowerInvariant().Contains(q) || p.Description.ToLowerInvariant().Contains(q))
                    list.Items.Add(new ListViewItem(new[] { p.Port.ToString(), p.Protocol, p.Name, p.Description }));
            }
        }

        search.TextChanged += (_, _) => Refresh();
        page.Controls.Add(list);
        page.Controls.Add(search);
        Refresh();
        return page;
    }

    static TabPage MakeHashTab()
    {
        var page = new TabPage("Hash");
        var panel = new TableLayoutPanel { Dock = DockStyle.Fill, ColumnCount = 1, Padding = new Padding(12) };

        var input = new TextBox { Dock = DockStyle.Fill, Multiline = true, Font = new Font("Consolas", 10), Text = "hello" };
        var result = new TextBox { Dock = DockStyle.Fill, Multiline = true, ReadOnly = true, Font = new Font("Consolas", 10) };

        void Calculate() { result.Text = HashTool.Compute(input.Text); }
        input.TextChanged += (_, _) => Calculate();

        panel.Controls.Add(new Label { Text = "Text:", AutoSize = true }, 0, 0);
        panel.Controls.Add(input, 0, 1);
        panel.Controls.Add(result, 0, 2);
        panel.RowStyles.Add(new RowStyle(SizeType.Absolute, 24));
        panel.RowStyles.Add(new RowStyle(SizeType.Absolute, 100));
        panel.RowStyles.Add(new RowStyle(SizeType.Percent, 100));

        page.Controls.Add(panel);
        Calculate();
        return page;
    }

    static TabPage MakeEncodingTab()
    {
        var page = new TabPage("Encode");
        var panel = new TableLayoutPanel { Dock = DockStyle.Fill, ColumnCount = 2, Padding = new Padding(12) };
        panel.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 50));
        panel.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 50));

        var input = new TextBox { Dock = DockStyle.Fill, Multiline = true, Font = new Font("Consolas", 10), Text = "hello" };
        var result = new TextBox { Dock = DockStyle.Fill, Multiline = true, Font = new Font("Consolas", 10) };

        var mode = new ComboBox { Dock = DockStyle.Top, DropDownStyle = ComboBoxStyle.DropDownList };
        mode.Items.AddRange(new object[] { "Text → Base64", "Base64 → Text", "Text → Hex", "Hex → Text" });
        mode.SelectedIndex = 0;

        void Convert()
        {
            var text = input.Text;
            result.Text = mode.SelectedIndex switch
            {
                0 => EncodingTool.ToBase64(text),
                1 => EncodingTool.FromBase64(text),
                2 => EncodingTool.ToHex(text),
                3 => EncodingTool.FromHex(text),
                _ => ""
            };
        }

        mode.SelectedIndexChanged += (_, _) => Convert();
        input.TextChanged += (_, _) => Convert();

        panel.Controls.Add(mode, 0, 0);
        panel.SetColumnSpan(mode, 2);
        panel.Controls.Add(input, 0, 1);
        panel.Controls.Add(result, 1, 1);
        panel.RowStyles.Add(new RowStyle(SizeType.Absolute, 32));
        panel.RowStyles.Add(new RowStyle(SizeType.Percent, 100));

        page.Controls.Add(panel);
        Convert();
        return page;
    }

    static TabPage MakeAboutTab()
    {
        var page = new TabPage("About");
        var label = new Label
        {
            Dock = DockStyle.Fill,
            TextAlign = ContentAlignment.MiddleCenter,
            Text = "NetSec Atlas Tools\n\nSubnet, VLSM, Range, Ports, Hash, Encoding, Password, IP.\nNothing leaves your machine.\n\nnetsecatlas.com"
        };
        page.Controls.Add(label);
        return page;
    }
    
    static TabPage MakePasswordTab()
    {
        var page = new TabPage("Password");
        var panel = new TableLayoutPanel { Dock = DockStyle.Fill, ColumnCount = 2, Padding = new Padding(12) };
        panel.ColumnStyles.Add(new ColumnStyle(SizeType.Absolute, 100));
        panel.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 100));

        var length = new NumericUpDown { Minimum = 4, Maximum = 128, Value = 16, Dock = DockStyle.Left, Width = 80 };
        var lower = new CheckBox { Text = "a-z", Checked = true, AutoSize = true };
        var upper = new CheckBox { Text = "A-Z", Checked = true, AutoSize = true };
        var digits = new CheckBox { Text = "0-9", Checked = true, AutoSize = true };
        var symbols = new CheckBox { Text = "!@#", Checked = true, AutoSize = true };
        var result = new TextBox { Dock = DockStyle.Fill, Font = new Font("Consolas", 12), ReadOnly = true };
        var gen = new Button { Text = "Generate", AutoSize = true };

        var checks = new FlowLayoutPanel { Dock = DockStyle.Fill };
        checks.Controls.AddRange(new Control[] { lower, upper, digits, symbols });

        void Generate() { result.Text = PasswordTool.Generate((int)length.Value, lower.Checked, upper.Checked, digits.Checked, symbols.Checked); }
        gen.Click += (_, _) => Generate();

        panel.Controls.Add(new Label { Text = "Length:", AutoSize = true, Anchor = AnchorStyles.Left }, 0, 0);
        panel.Controls.Add(length, 1, 0);
        panel.Controls.Add(new Label { Text = "Include:", AutoSize = true, Anchor = AnchorStyles.Left }, 0, 1);
        panel.Controls.Add(checks, 1, 1);
        panel.Controls.Add(gen, 0, 2);
        panel.Controls.Add(result, 1, 2);

        panel.RowStyles.Add(new RowStyle(SizeType.Absolute, 36));
        panel.RowStyles.Add(new RowStyle(SizeType.Absolute, 36));
        panel.RowStyles.Add(new RowStyle(SizeType.Absolute, 40));

        page.Controls.Add(panel);
        Generate();
        return page;
    }

    static TabPage MakeIpTab()
    {
        var page = new TabPage("IP");
        var panel = new TableLayoutPanel { Dock = DockStyle.Fill, ColumnCount = 2, Padding = new Padding(12) };
        panel.ColumnStyles.Add(new ColumnStyle(SizeType.Absolute, 100));
        panel.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 100));

        var input = new TextBox { Dock = DockStyle.Fill, Text = "192.168.1.1" };
        var result = new TextBox { Dock = DockStyle.Fill, Multiline = true, ReadOnly = true, Font = new Font("Consolas", 11) };

        void Convert() { result.Text = IpConverter.Convert(input.Text); }
        input.TextChanged += (_, _) => Convert();

        panel.Controls.Add(new Label { Text = "IP / Dec / Hex:", AutoSize = true, Anchor = AnchorStyles.Left }, 0, 0);
        panel.Controls.Add(input, 1, 0);
        panel.Controls.Add(result, 0, 1);
        panel.SetColumnSpan(result, 2);
        panel.RowStyles.Add(new RowStyle(SizeType.Absolute, 36));
        panel.RowStyles.Add(new RowStyle(SizeType.Percent, 100));

        page.Controls.Add(panel);
        Convert();
        return page;
    }

}
}
