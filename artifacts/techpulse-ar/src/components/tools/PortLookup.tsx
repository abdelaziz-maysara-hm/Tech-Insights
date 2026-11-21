import { useMemo, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { inputClass, labelClass } from './shared';

const PORTS: { port: number; proto: string; name: string; desc_ar: string; desc_en: string }[] = [
  { port: 20, proto: 'TCP', name: 'FTP-data', desc_ar: 'نقل بيانات FTP', desc_en: 'FTP data transfer' },
  { port: 21, proto: 'TCP', name: 'FTP', desc_ar: 'أوامر FTP', desc_en: 'FTP control' },
  { port: 22, proto: 'TCP', name: 'SSH', desc_ar: 'الدخول الآمن عن بعد', desc_en: 'Secure Shell' },
  { port: 23, proto: 'TCP', name: 'Telnet', desc_ar: 'دخول غير مشفر (غير موصى به)', desc_en: 'Unencrypted remote login (avoid)' },
  { port: 25, proto: 'TCP', name: 'SMTP', desc_ar: 'إرسال البريد', desc_en: 'Mail submission/transfer' },
  { port: 53, proto: 'UDP/TCP', name: 'DNS', desc_ar: 'تحليل الأسماء', desc_en: 'Domain Name System' },
  { port: 67, proto: 'UDP', name: 'DHCP', desc_ar: 'خادم DHCP', desc_en: 'DHCP server' },
  { port: 68, proto: 'UDP', name: 'DHCP', desc_ar: 'عميل DHCP', desc_en: 'DHCP client' },
  { port: 80, proto: 'TCP', name: 'HTTP', desc_ar: 'الويب غير المشفر', desc_en: 'Web (unencrypted)' },
  { port: 88, proto: 'TCP/UDP', name: 'Kerberos', desc_ar: 'المصادقة في Active Directory', desc_en: 'Kerberos authentication' },
  { port: 110, proto: 'TCP', name: 'POP3', desc_ar: 'استقبال البريد', desc_en: 'Mail retrieval' },
  { port: 123, proto: 'UDP', name: 'NTP', desc_ar: 'مزامنة الوقت', desc_en: 'Network Time Protocol' },
  { port: 135, proto: 'TCP', name: 'RPC', desc_ar: 'النقاب البعيد في ويندوز', desc_en: 'Windows RPC endpoint mapper' },
  { port: 139, proto: 'TCP', name: 'NetBIOS', desc_ar: 'مشاركة ملفات قديمة', desc_en: 'Legacy file sharing' },
  { port: 143, proto: 'TCP', name: 'IMAP', desc_ar: 'استقبال البريد', desc_en: 'Mail retrieval' },
  { port: 161, proto: 'UDP', name: 'SNMP', desc_ar: 'إدارة الشبكة', desc_en: 'Network management' },
  { port: 389, proto: 'TCP', name: 'LDAP', desc_ar: 'الدليل', desc_en: 'Directory services' },
  { port: 443, proto: 'TCP', name: 'HTTPS', desc_ar: 'الويب المشفر', desc_en: 'Secure web' },
  { port: 445, proto: 'TCP', name: 'SMB', desc_ar: 'مشاركة ملفات ويندوز', desc_en: 'Windows file sharing' },
  { port: 465, proto: 'TCP', name: 'SMTPS', desc_ar: 'إرسال بريد مشفر', desc_en: 'Secure mail submission' },
  { port: 500, proto: 'UDP', name: 'IKE', desc_ar: 'تفاوض IPsec', desc_en: 'IPsec key exchange' },
  { port: 514, proto: 'UDP', name: 'Syslog', desc_ar: 'السجلات', desc_en: 'Syslog' },
  { port: 587, proto: 'TCP', name: 'SMTP', desc_ar: 'إرسال البريد (مع المصادقة)', desc_en: 'Authenticated mail submission' },
  { port: 636, proto: 'TCP', name: 'LDAPS', desc_ar: 'الدليل المشفر', desc_en: 'Secure LDAP' },
  { port: 993, proto: 'TCP', name: 'IMAPS', desc_ar: 'استقبال بريد مشفر', desc_en: 'Secure IMAP' },
  { port: 995, proto: 'TCP', name: 'POP3S', desc_ar: 'استقبال بريد مشفر', desc_en: 'Secure POP3' },
  { port: 1433, proto: 'TCP', name: 'SQL Server', desc_ar: 'قاعدة بيانات مايكروسوفت', desc_en: 'Microsoft SQL Server' },
  { port: 1521, proto: 'TCP', name: 'Oracle', desc_ar: 'قاعدة بيانات أوراكل', desc_en: 'Oracle Database' },
  { port: 3306, proto: 'TCP', name: 'MySQL', desc_ar: 'قاعدة بيانات MySQL', desc_en: 'MySQL / MariaDB' },
  { port: 3389, proto: 'TCP', name: 'RDP', desc_ar: 'سطح المكتب البعيد', desc_en: 'Remote Desktop' },
  { port: 5432, proto: 'TCP', name: 'PostgreSQL', desc_ar: 'قاعدة بيانات PostgreSQL', desc_en: 'PostgreSQL' },
  { port: 5900, proto: 'TCP', name: 'VNC', desc_ar: 'سطح مكتب بعيد', desc_en: 'Virtual Network Computing' },
  { port: 8080, proto: 'TCP', name: 'HTTP-alt', desc_ar: 'ويب بديل', desc_en: 'Alternate HTTP / proxies' },
  { port: 8443, proto: 'TCP', name: 'HTTPS-alt', desc_ar: 'ويب مشفر بديل', desc_en: 'Alternate HTTPS' },
];

export default function PortLookup() {
  const { language } = useLanguage();
  const ar = language === 'ar';
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return PORTS;
    return PORTS.filter(
      (p) =>
        String(p.port).includes(q) ||
        p.name.toLowerCase().includes(q) ||
        p.desc_ar.includes(q) ||
        p.desc_en.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <div className="space-y-4">
      <div>
        <label className={labelClass} htmlFor="port-q">
          {ar ? 'ابحث بالرقم أو الاسم' : 'Search by number or name'}
        </label>
        <input
          id="port-q"
          className={inputClass}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={ar ? 'مثال: 443 أو ssh أو rdp' : 'e.g. 443, ssh, rdp'}
        />
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-3 py-2 text-start font-semibold">{ar ? 'المنفذ' : 'Port'}</th>
              <th className="px-3 py-2 text-start font-semibold">{ar ? 'البروتوكول' : 'Protocol'}</th>
              <th className="px-3 py-2 text-start font-semibold">{ar ? 'الاسم' : 'Name'}</th>
              <th className="px-3 py-2 text-start font-semibold">{ar ? 'الوصف' : 'Description'}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.port} className="border-t border-border">
                <td className="px-3 py-2 font-mono">{p.port}</td>
                <td className="px-3 py-2 font-mono text-xs">{p.proto}</td>
                <td className="px-3 py-2 font-medium">{p.name}</td>
                <td className="px-3 py-2 text-muted-foreground">{ar ? p.desc_ar : p.desc_en}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="px-3 py-6 text-center text-muted-foreground">
                  {ar ? 'لا توجد نتائج' : 'No matches'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
