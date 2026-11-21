using System.Drawing;
using System.Windows.Forms;

namespace NetSecAtlasTools;

public class MainForm : Form
{
    public MainForm()
    {
        Text = "NetSec Atlas Tools";
        Size = new Size(920, 680);
        StartPosition = FormStartPosition.CenterScreen;
        Font = new Font("Segoe UI", 10);

        var tabs = new TabControl { Dock = DockStyle.Fill };

        tabs.TabPages.Add(MakeSubnetTab());
        tabs.TabPages.Add(MakeVlsmTab());
        tabs.TabPages.Add(MakePortsTab());
        tabs.TabPages.Add(MakeAboutTab());

        Controls.Add(tabs);
    }

    static TabPage MakeSubnetTab()
    {
        var page = new TabPage("Subnet");
        var panel = new TableLayoutPanel { Dock = DockStyle.Fill, ColumnCount = 2, Padding = new Padding(12) };
        panel.ColumnStyles.Add(new ColumnStyle(SizeType.Absolute, 160));
        panel.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 100));

        var input = new TextBox { Dock = DockStyle.Fill, Text = "192.168.1.0/24" };
        var result = new TextBox { Dock = DockStyle.Fill, Multiline = true, ReadOnly = true, ScrollBars = ScrollBars.Vertical, Font = new Font("Consolas", 10) };

        void Calculate()
        {
            try { result.Text = SubnetCalculator.Calculate(input.Text.Trim()).ToString(); }
            catch (Exception ex) { result.Text = "Error: " + ex.Message; }
        }

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
        panel.ColumnStyles.Add(new ColumnStyle(SizeType.Absolute, 160));
        panel.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 100));

        var baseBox = new TextBox { Dock = DockStyle.Fill, Text = "192.168.1.0/24" };
        var segments = new TextBox
        {
            Dock = DockStyle.Fill,
            Multiline = true,
            Font = new Font("Consolas", 10),
            Text = "Users 100\nServers 50\nManagement 10\nWAN 2"
        };
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

        panel.Controls.Add(new Label { Text = "Parent network:", AutoSize = true, Anchor = AnchorStyles.Left }, 0, 0);
        panel.Controls.Add(baseBox, 1, 0);
        panel.Controls.Add(new Label { Text = "Segments (name hosts):", AutoSize = true, Anchor = AnchorStyles.Left }, 0, 1);
        panel.Controls.Add(segments, 1, 1);
        panel.Controls.Add(result, 0, 2);
        panel.SetColumnSpan(result, 2);

        panel.RowStyles.Add(new RowStyle(SizeType.Absolute, 32));
        panel.RowStyles.Add(new RowStyle(SizeType.Absolute, 140));
        panel.RowStyles.Add(new RowStyle(SizeType.Percent, 100));

        page.Controls.Add(panel);
        Calculate();
        return page;
    }

    static TabPage MakePortsTab()
    {
        var page = new TabPage("Ports");
        var search = new TextBox { Dock = DockStyle.Top, PlaceholderText = "Search port or name (443, ssh, rdp...)" };
        var list = new ListView { Dock = DockStyle.Fill, View = View.Details, FullRowSelect = true };
        list.Columns.Add("Port", 70);
        list.Columns.Add("Protocol", 90);
        list.Columns.Add("Name", 140);
        list.Columns.Add("Description", 400);

        var ports = CommonPorts.All;

        void Refresh()
        {
            list.Items.Clear();
            var q = search.Text.Trim().ToLowerInvariant();
            foreach (var p in ports)
            {
                if (q.Length == 0 ||
                    p.Port.ToString().Contains(q) ||
                    p.Name.ToLowerInvariant().Contains(q) ||
                    p.Description.ToLowerInvariant().Contains(q))
                {
                    list.Items.Add(new ListViewItem(new[] { p.Port.ToString(), p.Protocol, p.Name, p.Description }));
                }
            }
        }

        search.TextChanged += (_, _) => Refresh();
        page.Controls.Add(list);
        page.Controls.Add(search);
        Refresh();
        return page;
    }

    static TabPage MakeAboutTab()
    {
        var page = new TabPage("About");
        var label = new Label
        {
            Dock = DockStyle.Fill,
            TextAlign = ContentAlignment.MiddleCenter,
            Text = "NetSec Atlas Tools\n\n" +
                   "Local desktop utilities for network and security work.\n" +
                   "Nothing leaves your machine.\n\n" +
                   "netsecatlas.com"
        };
        page.Controls.Add(label);
        return page;
    }
}
