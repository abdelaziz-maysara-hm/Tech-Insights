import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;
if (!ACCESS_KEY) throw new Error('UNSPLASH_ACCESS_KEY not set');

const path = fileURLToPath(new URL('../artifacts/techpulse-ar/src/content/articles.json', import.meta.url));
const articles = JSON.parse(readFileSync(path, 'utf8'));

// Map each article's most distinctive tag(s) to a good, specific search query.
function queryFor(article) {
  const tags = article.tags || [];
  const slug = article.slug;
  const map = {
    '2fa': 'two factor authentication phone',
    phishing: 'phishing email warning',
    'palo-alto': 'firewall network security',
    forcepoint: 'network security firewall',
    fortinet: 'network firewall server',
    passwords: 'password security lock',
    'active-directory': 'server room data center',
    router: 'wifi router home network',
    vpn: 'vpn privacy network',
    'windows-server': 'server rack data center',
    laptop: 'laptop computer student',
    chatgpt: 'artificial intelligence chatbot',
    kaspersky: 'antivirus endpoint security',
    rdp: 'remote desktop computer screen',
    dns: 'network domain server',
    'group-policy': 'windows server it admin',
    backup: 'backup data storage disk',
    'zero-trust': 'cybersecurity network shield',
    'email-security': 'email inbox security',
    ransomware: 'ransomware cyber attack warning',
    cloud: 'cloud computing data center',
    printers: 'office printer scanner',
    'browser-isolation': 'web browser laptop',
    'shadow-it': 'office team laptop work',
    usb: 'usb flash drive computer',
    ssl: 'ssl certificate padlock website',
    vlan: 'network switch cables',
    snmp: 'network monitoring dashboard',
    '802.1x': 'network authentication server',
    siem: 'security operations center monitor',
    'patch-management': 'software update computer',
    dhcp: 'network server room',
    syslog: 'server logs terminal screen',
    compliance: 'audit documents office',
    'sql-injection': 'code programming database',
    'task-scheduler': 'windows computer clock',
    'insider-threat': 'office employee computer',
    'sd-wan': 'network cables data center',
    'remote-work': 'laptop home office work',
    laps: 'password security windows',
    vmware: 'server virtualization data center',
    pfsense: 'firewall network router',
    zabbix: 'monitoring dashboard analytics',
    ansible: 'code terminal programming',
    veeam: 'backup server data',
    qualys: 'security scan vulnerability',
    'google-workspace': 'cloud office productivity',
    tailscale: 'vpn network laptop',
    'audio-security': 'headphones microphone',
    kaspersky2: 'antivirus shield computer',
    'mfa-fatigue': 'phone notification alert',
    'nist-password': 'password keyboard security',
    nac: 'network access control server',
    'health-check': 'server dashboard monitor',
  };
  for (const tag of tags) {
    const key = tag.toLowerCase();
    if (map[key]) return map[key];
  }
  return 'cybersecurity technology network';
}

async function searchPhoto(query, usedIds) {
  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=10&orientation=landscape&content_filter=high`;
  const res = await fetch(url, {
    headers: { Authorization: `Client-ID ${ACCESS_KEY}` },
  });
  if (!res.ok) {
    console.error('API error', res.status, await res.text());
    return null;
  }
  const data = await res.json();
  for (const photo of data.results || []) {
    if (!usedIds.has(photo.id)) {
      usedIds.add(photo.id);
      return photo;
    }
  }
  return data.results?.[0] || null;
}

const usedIds = new Set();
let updated = 0;

for (const article of articles) {
  const query = queryFor(article);
  const photo = await searchPhoto(query, usedIds);
  if (photo) {
    const base = photo.urls.raw;
    article.heroImage = `${base}&auto=format&fit=crop&w=800&h=450&q=80`;
    updated++;
    console.log(article.slug, '->', query, '->', photo.id);
  } else {
    console.log(article.slug, '-> NO RESULT for', query);
  }
  // Be polite / respect rate limits
  await new Promise((r) => setTimeout(r, 150));
}

writeFileSync(path, JSON.stringify(articles, null, 2) + '\n', 'utf8');
console.log(`\nDone. Updated ${updated}/${articles.length} articles.`);
console.log('Unique photo IDs used:', usedIds.size);
