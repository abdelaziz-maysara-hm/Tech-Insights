using System.Net;
using System.Runtime.InteropServices;
using NetSecAtlas.Core;

namespace PortCheck;

/// <summary>GetExtendedTcpTable / GetExtendedUdpTable (iphlpapi) for ports with owning PIDs.</summary>
static class Native
{
    const int AF_INET = 2, AF_INET6 = 23;
    const int TCP_TABLE_OWNER_PID_ALL = 5, UDP_TABLE_OWNER_PID = 1;

    [DllImport("iphlpapi.dll", SetLastError = true)]
    static extern uint GetExtendedTcpTable(IntPtr table, ref int size, bool order, int af, int tableClass, uint reserved);
    [DllImport("iphlpapi.dll", SetLastError = true)]
    static extern uint GetExtendedUdpTable(IntPtr table, ref int size, bool order, int af, int tableClass, uint reserved);

    static readonly string[] States = { "", "CLOSED", "LISTEN", "SYN_SENT", "SYN_RCVD", "ESTABLISHED", "FIN_WAIT1", "FIN_WAIT2", "CLOSE_WAIT", "CLOSING", "LAST_ACK", "TIME_WAIT", "DELETE_TCB" };

    static int Port(uint raw) => (int)(((raw & 0xFF) << 8) | ((raw >> 8) & 0xFF));

    static IntPtr Fetch(Func<IntPtr, int, (uint rc, int size)> call, out int size)
    {
        size = 0; var (_, need) = call(IntPtr.Zero, 0); size = need;
        for (int attempt = 0; attempt < 4; attempt++)
        {
            var buf = Marshal.AllocHGlobal(size);
            var (rc, s2) = call(buf, size);
            if (rc == 0) return buf;
            Marshal.FreeHGlobal(buf); size = s2 + 4096;
        }
        throw new InvalidOperationException("iphlpapi table query failed");
    }

    public static List<PortEntry> Read()
    {
        var names = System.Diagnostics.Process.GetProcesses().ToDictionary(p => p.Id, p => p.ProcessName);
        string Name(int pid) => pid == 0 ? "System Idle" : pid == 4 ? "System" : names.TryGetValue(pid, out var n) ? n : "?";
        var list = new List<PortEntry>();

        foreach (var af in new[] { AF_INET, AF_INET6 })
        {
            var buf = Fetch((b, s) => { int sz = s; var rc = GetExtendedTcpTable(b, ref sz, true, af, TCP_TABLE_OWNER_PID_ALL, 0); return (rc, sz); }, out _);
            try
            {
                int n = Marshal.ReadInt32(buf); IntPtr row = buf + 4;
                for (int i = 0; i < n; i++)
                {
                    if (af == AF_INET)
                    {
                        // MIB_TCPROW_OWNER_PID: state, localAddr, localPort, remoteAddr, remotePort, pid (6 x uint32)
                        uint state = (uint)Marshal.ReadInt32(row), la = (uint)Marshal.ReadInt32(row + 4), lp = (uint)Marshal.ReadInt32(row + 8),
                             ra = (uint)Marshal.ReadInt32(row + 12), rp = (uint)Marshal.ReadInt32(row + 16); int pid = Marshal.ReadInt32(row + 20);
                        list.Add(new("TCP", new IPAddress(la).ToString(), Port(lp), new IPAddress(ra).ToString(), state == 2 ? 0 : Port(rp), States[Math.Min(state, 12)], pid, Name(pid)));
                        row += 24;
                    }
                    else
                    {
                        // MIB_TCP6ROW_OWNER_PID: localAddr[16], localScope, localPort, remoteAddr[16], remoteScope, remotePort, state, pid
                        var la = new byte[16]; Marshal.Copy(row, la, 0, 16); uint lp = (uint)Marshal.ReadInt32(row + 20);
                        var ra = new byte[16]; Marshal.Copy(row + 24, ra, 0, 16); uint rp = (uint)Marshal.ReadInt32(row + 44);
                        uint state = (uint)Marshal.ReadInt32(row + 48); int pid = Marshal.ReadInt32(row + 52);
                        list.Add(new("TCPv6", new IPAddress(la).ToString(), Port(lp), new IPAddress(ra).ToString(), state == 2 ? 0 : Port(rp), States[Math.Min(state, 12)], pid, Name(pid)));
                        row += 56;
                    }
                }
            }
            finally { Marshal.FreeHGlobal(buf); }

            var ubuf = Fetch((b, s) => { int sz = s; var rc = GetExtendedUdpTable(b, ref sz, true, af, UDP_TABLE_OWNER_PID, 0); return (rc, sz); }, out _);
            try
            {
                int n = Marshal.ReadInt32(ubuf); IntPtr row = ubuf + 4;
                for (int i = 0; i < n; i++)
                {
                    if (af == AF_INET)
                    {
                        uint la = (uint)Marshal.ReadInt32(row), lp = (uint)Marshal.ReadInt32(row + 4); int pid = Marshal.ReadInt32(row + 8);
                        list.Add(new("UDP", new IPAddress(la).ToString(), Port(lp), "", 0, "", pid, Name(pid))); row += 12;
                    }
                    else
                    {
                        var la = new byte[16]; Marshal.Copy(row, la, 0, 16); uint lp = (uint)Marshal.ReadInt32(row + 20); int pid = Marshal.ReadInt32(row + 24);
                        list.Add(new("UDPv6", new IPAddress(la).ToString(), Port(lp), "", 0, "", pid, Name(pid))); row += 28;
                    }
                }
            }
            finally { Marshal.FreeHGlobal(ubuf); }
        }
        return list;
    }
}
