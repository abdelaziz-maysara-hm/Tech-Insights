import { body } from '../md.mjs';
export default {
  slug: "powershell-network-troubleshooting-commands",
  heroFrom: "powershell-sysadmin-complete-guide",
  categoryId: "windows", subcategoryId: "guides-tips",
  tags: ["powershell", "test-netconnection", "networking", "troubleshooting", "windows"],
  domainIds: ["networking", "troubleshooting"], topicIds: ["network-troubleshooting", "windows-server"],
  contentType: "reference", vendorIds: ["microsoft"], productIds: [],
  title: { ar: "أوامر PowerShell لتشخيص الشبكة: Test-NetConnection وما بعده", en: "PowerShell Network Troubleshooting Commands Every Admin Should Know" },
  excerpt: {
    ar: "أهم أوامر PowerShell لتشخيص الشبكة مرتبة حسب السؤال: الإعدادات، الوصول للمنفذ، DNS، المنافذ المستمعة، الجدار الناري، وسكربت فحص سريع.",
    en: "The PowerShell cmdlets that answer real network questions: configuration, port reachability, DNS, listening ports, firewall state, and a one-screen health check.",
  },
  body: body("powershell-network-troubleshooting-commands"),
};
