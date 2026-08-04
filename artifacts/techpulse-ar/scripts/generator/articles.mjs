/**
 * Article generator — UNIQUE body per topic + content-aware hero + valid taxonomy.
 */
import { assertSubcategory, inferTaxonomy } from './categories.mjs';
import { distributedDate } from './dates.mjs';
import { resolveArticleHero } from './images.mjs';
import { bi } from './localization.mjs';
import { uniqueSlug } from './slugs.mjs';

const DEFAULT_AUTHOR = {
  name: { ar: 'فريق رؤى تقنية', en: 'Technical Insights Team' },
  avatar: 'https://i.pravatar.cc/150?img=11',
};

/** Each topic must define its own titles + bodies. Extend TOPIC_CONTENT only. */
export const TOPIC_CONTENT = [
  {
    slug: "2fa-practical-guide",
    titleAr: "المصادقة الثنائية (2FA): دليل عملي لحماية حساباتك",
    titleEn: "Two-Factor Authentication (2FA): A Practical Guide",
    excerptAr: "الفرق بين تطبيق المصادقة وSMS، وكيفية تفعيل 2FA وحفظ رموز الاسترداد.",
    excerptEn: "Authenticator apps vs SMS, how to enable 2FA, and store recovery codes safely.",
    bodyAr: "## ما هي المصادقة الثنائية؟\n\nالمصادقة الثنائية تضيف طبقة ثانية بعد كلمة المرور: رمز من تطبيق، SMS، أو مفتاح أمان. حتى لو انكشفت كلمة المرور، يبقى الدخول أصعب بكثير.\n\n## أفضل خيار: تطبيق مصادقة\n\n1. ثبّت Google Authenticator أو Authy أو Microsoft Authenticator.\n2. من إعدادات الأمان اختر **تطبيق المصادقة**.\n3. امسح رمز QR واحفظ **رموز الاسترداد** في مكان آمن.\n4. سجّل خروجًا ثم دخولًا للتأكد أن الرمز يعمل.\n\n## SMS مقابل التطبيق\n\n- SMS أسهل لكنه أضعف (تحويل أرقام).\n- التطبيق أقوى ويعمل دون الاعتماد على الشريحة.\n- مفتاح أمان (YubiKey) للحسابات الحساسة جدًا.\n\n## الخلاصة\n\nفعّل 2FA على البريد والبنك والسوشيال. التطبيق أفضل من SMS.",
    bodyEn: "## What is 2FA?\n\nA second step after the password: authenticator app, SMS, or security key.\n\n## Best option: authenticator app\n\nInstall an app, scan the QR, store recovery codes, verify login.\n\n## SMS vs app\n\nSMS is weaker; apps are stronger and work offline.\n\n## Bottom line\n\nEnable 2FA on email, banking, and social. Prefer app over SMS.",
    cat: "cybersecurity",
    sub: "guides-tips",
    tags: ["2fa", "security", "mfa"],
    readTime: 5,
    theme: "security",
  },
  {
    slug: "phishing-spot-before-click",
    titleAr: "التصيد الاحتيالي: كيف تكتشفه قبل ما تضغط",
    titleEn: "Phishing: Spot It Before You Click",
    excerptAr: "علامات الرسالة المزيفة، روابط ملغومة، وماذا تفعل لو ضغطت بالخطأ.",
    excerptEn: "Signs of fake messages, malicious links, and what to do after a bad click.",
    bodyAr: "## ما هو التصيد؟\n\nمحاولة لإقناعك بإدخال كلمة مرور أو فتح ملف خبيث عبر رسالة تبدو رسمية.\n\n## علامات شائعة\n\n- استعجال مبالغ فيه.\n- أخطاء إملائية.\n- رابط يشبه النطاق الحقيقي لكنه مختلف.\n- طلب كلمة مرور أو رمز 2FA داخل الرسالة.\n\n## قبل ما تضغط\n\nعاين الرابط، افتح الموقع من التطبيق الرسمي، ولا ترسل رموز التحقق لأي شخص.\n\n## الخلاصة\n\nالتحقق من المرسل والرابط دقيقة واحدة قد يمنع سرقة حساب كامل.",
    bodyEn: "## What is phishing?\n\nMessages that look official but steal credentials or deliver malware.\n\n## Common signs\n\nUrgency, typos, lookalike domains, requests for passwords or 2FA codes.\n\n## Bottom line\n\nOne careful check of sender and URL can stop account takeover.",
    cat: "cybersecurity",
    sub: "guides-tips",
    tags: ["phishing", "email", "security"],
    readTime: 4,
    theme: "security",
  },
  {
    slug: "palo-alto-security-policy-basics",
    titleAr: "أساسيات Security Policy في Palo Alto — من أين تبدأ؟",
    titleEn: "Palo Alto Security Policy Basics — Where to Start",
    excerptAr: "ترتيب عملي لبناء السياسات: Zones وApp-ID وأشهر الأخطاء.",
    excerptEn: "Practical order for building policies: zones, App-ID, and common mistakes.",
    bodyAr: "## ليه ترتيب السياسة مهم؟\n\nفي Palo Alto الترتيب وZones وApplication-ID بيحددوا إذا الشبكة سهلة الإدارة.\n\n## الترتيب المقترح\n\n1. حدد Zones (Trust / Untrust / DMZ / VPN).\n2. ضع Cleanup rule في الآخر (Deny any مع log).\n3. ابدأ بأضيق نطاق: Source Zone + Destination Zone + Application.\n4. أضف User-ID لما يكون متاحًا.\n5. اربط Security Profiles على حركة الإنترنت.\n\n## أشهر الأخطاء\n\nAllow any any بدون profiles، الاعتماد على Port فقط، نسيان Commit.\n\n## الخلاصة\n\nZones → قواعد App ضيقة → Users → Profiles → Deny مع Log.",
    bodyEn: "## Why order matters\n\nZones, rule order, and Application-ID keep Palo Alto manageable.\n\n## Build order\n\nDefine zones, cleanup deny with logs, narrow zone+app rules, User-ID, security profiles.\n\n## Bottom line\n\nZones → narrow apps → users → profiles → logged deny.",
    cat: "cybersecurity",
    sub: "network-security",
    tags: ["palo-alto", "ngfw", "security-policy"],
    readTime: 6,
    theme: "firewall",
  },
  {
    slug: "forcepoint-ssl-vpn-radius",
    titleAr: "إعداد Forcepoint SSL VPN مع RADIUS — خطوات وأشهر الأخطاء",
    titleEn: "Forcepoint SSL VPN with RADIUS — Setup and Common Errors",
    excerptAr: "دليل عملي لربط Forcepoint NGFW SSL VPN مع RADIUS من SMC.",
    excerptEn: "Practical guide to connect Forcepoint NGFW SSL VPN with RADIUS from SMC.",
    bodyAr: "## الفكرة\n\nتربط SSL VPN بخادم RADIUS (NPS أو FreeRADIUS) للمصادقة المركزية.\n\n## الخطوات في SMC\n\n1. Servers → RADIUS Authentication Server: IP + Shared Secret + UDP 1812.\n2. أنشئ Authentication Method يشير لـ RADIUS.\n3. اربط الـ Method بـ SSL VPN Portal/Gateway.\n4. راجع Firewall Policy من النفق للشبكة الداخلية.\n\n## أشهر الأخطاء\n\nShared Secret مختلف، المنفذ 1812 محجوب، Group filter يمنع المستخدم.\n\n## الخلاصة\n\nRADIUS → Method → VPN → Policy ضيقة → اختبار باللوجات.",
    bodyEn: "## Idea\n\nBind SSL VPN to RADIUS for centralized authentication.\n\n## Core steps\n\nAdd RADIUS server, create method, attach to VPN, review tunnel policy.\n\n## Bottom line\n\nRADIUS → Method → VPN → narrow policy → validate with logs.",
    cat: "cybersecurity",
    sub: "vpn-remote",
    tags: ["forcepoint", "ssl-vpn", "radius"],
    readTime: 7,
    theme: "vpn",
  },
  {
    slug: "fortigate-ssl-vpn-checklist",
    titleAr: "إعداد FortiGate SSL VPN بسرعة — checklist عملي",
    titleEn: "FortiGate SSL VPN Quick Setup — Practical Checklist",
    excerptAr: "خطوات مختصرة: portal وpolicy وusers وأشهر أسباب فشل الاتصال.",
    excerptEn: "Short checklist: portal, policy, users, and common connection failures.",
    bodyAr: "## Checklist\n\n1. User / Group (محلي أو LDAP/RADIUS).\n2. SSL-VPN Portal.\n3. SSL-VPN Settings (Interface + Port + IP range).\n4. Firewall Policy من tunnel إلى LAN.\n5. ربط Group بالـ Portal.\n\n## أعطال شائعة\n\nPolicy ناقصة من ssl.root، Group مش مربوط، DNS داخلي لا يعمل بعد الاتصال.\n\n## الخلاصة\n\nUser → Portal → Settings → Policy → اختبار من شبكة خارجية.",
    bodyEn: "## Checklist\n\nUser/Group, portal, settings, tunnel-to-LAN policy, map group to portal.\n\n## Common failures\n\nMissing ssl.root policy, unmapped group, broken internal DNS.\n\n## Bottom line\n\nUser → Portal → Settings → Policy → external test.",
    cat: "cybersecurity",
    sub: "vpn-remote",
    tags: ["fortinet", "fortigate", "ssl-vpn"],
    readTime: 5,
    theme: "vpn",
  },
  {
    slug: "password-manager-start",
    titleAr: "مدير كلمات المرور: ليه تحتاجه وإزاي تبدأ",
    titleEn: "Password Managers: Why You Need One and How to Start",
    excerptAr: "بديل آمن لتكرار نفس كلمة المرور، مع خطة نقل تدريجية.",
    excerptEn: "A safer alternative to password reuse, with a gradual migration plan.",
    bodyAr: "## المشكلة\n\nإعادة استخدام نفس كلمة المرور تعني أن تسريب موقع واحد قد يفتح باقي حساباتك.\n\n## ماذا يفعل؟\n\nيحفظ كلمات مرور طويلة وفريدة ويملأها تلقائيًا، محمية بكلمة رئيسية + 2FA.\n\n## البداية\n\n1. اختر Bitwarden أو 1Password أو Google Password Manager.\n2. غيّر البريد والبنك والسوشيال أولًا.\n3. فعّل 2FA على مدير كلمات المرور نفسه.\n\n## الخلاصة\n\nمدير كلمات المرور يقلل التوتر ويزيد الأمان.",
    bodyEn: "## Problem\n\nPassword reuse means one breach can open many accounts.\n\n## Start\n\nPick a manager, migrate critical accounts first, enable vault 2FA.\n\n## Bottom line\n\nSafer and less stressful than memorizing weak variants.",
    cat: "cybersecurity",
    sub: "guides-tips",
    tags: ["passwords", "security", "tools"],
    readTime: 4,
    theme: "security",
  },
  {
    slug: "ad-powershell-daily-tasks",
    titleAr: "مهام Active Directory اليومية بـ PowerShell",
    titleEn: "Daily Active Directory Tasks with PowerShell",
    excerptAr: "أوامر عملية: إنشاء مستخدم، إضافة لمجموعة، Unlock، وDisable.",
    excerptEn: "Practical commands: create user, add to group, unlock, disable.",
    bodyAr: "## أوامر يومية\n\n```powershell\nGet-ADUser -Identity \"ahmed.ali\" -Properties DisplayName,Enabled,LastLogonDate\nNew-ADUser -Name \"Ahmed Ali\" -SamAccountName \"ahmed.ali\" -Enabled $true\nAdd-ADGroupMember -Identity \"VPN-Users\" -Members \"ahmed.ali\"\nUnlock-ADAccount -Identity \"ahmed.ali\"\nDisable-ADAccount -Identity \"ahmed.ali\"\n```\n\n## نصائح\n\nثبّت RSAT، اختبر على حساب تجريبي، استخدم -WhatIf مع السكربتات الجماعية.\n\n## الخلاصة\n\nGet / New / Add-ADGroupMember / Unlock / Disable تغطي أغلب الشغل اليومي.",
    bodyEn: "## Daily commands\n\nGet-ADUser, New-ADUser, Add-ADGroupMember, Unlock-ADAccount, Disable-ADAccount.\n\n## Tips\n\nUse RSAT, test first, use -WhatIf for bulk scripts.\n\n## Bottom line\n\nThese five cmdlets cover most daily AD work.",
    cat: "cybersecurity",
    sub: "identity",
    tags: ["active-directory", "powershell"],
    readTime: 5,
    theme: "identity",
  },
  {
    slug: "home-router-security-basics",
    titleAr: "تأمين راوتر البيت: خطوات أساسية تفرق",
    titleEn: "Home Router Security: Basics That Matter",
    excerptAr: "تغيير كلمة المرور الافتراضية، تحديث الفرموير، وعزل شبكة الضيوف.",
    excerptEn: "Change default passwords, update firmware, and isolate guest Wi-Fi.",
    bodyAr: "## خطوات سريعة\n\n1. ادخل لوحة التحكم (غالبًا 192.168.1.1).\n2. غيّر كلمة مرور الأدمن الافتراضية.\n3. حدّث الفرموير.\n4. استخدم كلمة مرور واي فاي قوية.\n5. افصل شبكة الضيوف عن شبكتك الأساسية.\n\n## الخلاصة\n\nتغيير كلمتَي المرور + التحديث يحلان جزءًا كبيرًا من المخاطر.",
    bodyEn: "## Quick steps\n\nChange default admin password, update firmware, strong Wi-Fi passphrase, separate guest network.\n\n## Bottom line\n\nPassword changes and firmware updates fix a large share of common risks.",
    cat: "cybersecurity",
    sub: "guides-tips",
    tags: ["router", "wifi", "security"],
    readTime: 4,
    theme: "network",
  },
  {
    slug: "vpn-basics-what-it-does",
    titleAr: "VPN للمبتدئين: ماذا يفعل وماذا لا يفعل؟",
    titleEn: "VPN Basics: What It Does and Doesn't Do",
    excerptAr: "تشفير الاتصال، تغيير الظاهر من العنوان، وحدود الحماية.",
    excerptEn: "Encryption, IP appearance, and the limits of protection.",
    bodyAr: "## ماذا يفعل\n\nيشفر الاتصال بين جهازك وخادم الـ VPN ويغيّر مظهر عنوان الشبكة.\n\n## ماذا لا يفعل\n\nمش درع كامل ضد التصيد، مش بديل عن التحديث و2FA.\n\n## الخلاصة\n\nVPN طبقة حماية واحدة — مش سحر.",
    bodyEn: "## What it does\n\nEncrypts traffic and changes apparent network location.\n\n## What it doesn't\n\nNot full anti-phishing; not a substitute for patching and 2FA.\n\n## Bottom line\n\nOne useful layer, not magic.",
    cat: "cybersecurity",
    sub: "vpn-remote",
    tags: ["vpn", "privacy"],
    readTime: 4,
    theme: "vpn",
  },
  {
    slug: "windows-disk-cleanup-safe",
    titleAr: "تنظيف مساحة القرص في Windows بأمان",
    titleEn: "Safe Disk Cleanup on Windows",
    excerptAr: "خطوات بسيطة لتفريغ مساحة من غير ما تمسح ملفات مهمة.",
    excerptEn: "Simple steps to free space without deleting important files.",
    bodyAr: "## ابدأ بالأدوات الرسمية\n\nStorage Sense ثم Disk Cleanup كمسؤول. راجع Downloads وRecycle Bin.\n\n## آمن يتشال\n\nTemporary files وWindows Update cleanup.\n\n## الخلاصة\n\nالأدوات الرسمية أولًا؛ انقل الوسائط قبل الحذف الكبير.",
    bodyEn: "## Built-in tools first\n\nStorage Sense and Disk Cleanup as admin.\n\n## Safe to remove\n\nTemp files and update leftovers.\n\n## Bottom line\n\nOfficial cleanup first.",
    cat: "windows",
    sub: "guides-tips",
    tags: ["windows", "disk-cleanup"],
    readTime: 4,
    theme: "windows",
  },
  {
    slug: "student-laptop-specs",
    titleAr: "مواصفات لابتوب للطالب: ماذا يكفي فعلًا؟",
    titleEn: "Student Laptop Specs: What Actually Matters?",
    excerptAr: "RAM والتخزين والشاشة والبطارية بدون مبالغة في السعر.",
    excerptEn: "RAM, storage, display, and battery without overspending.",
    bodyAr: "## الحد الأدنى المنطقي\n\n16 جيجا RAM، SSD 512 إن أمكن، معالج حديث، شاشة Full HD.\n\n## الخلاصة\n\n16GB RAM + SSD + شاشة واضحة تغطي أغلب الطلاب.",
    bodyEn: "## Sensible baseline\n\n16GB RAM, 512GB SSD when possible, recent CPU, Full HD.\n\n## Bottom line\n\nRAM + SSD + clear screen beat brand prestige alone.",
    cat: "laptops",
    sub: "guides-tips",
    tags: ["laptop", "students"],
    readTime: 4,
    theme: "laptop",
  },
  {
    slug: "chatgpt-study-without-harm",
    titleAr: "استخدام ChatGPT في المذاكرة بدون ما يضر فهمك",
    titleEn: "Using ChatGPT for Studying Without Hurting Understanding",
    excerptAr: "كيف تطلب شرحًا وتختبر نفسك بدل نسخ الإجابات.",
    excerptEn: "How to request explanations and self-tests instead of copied answers.",
    bodyAr: "## استخدام مفيد\n\nاشرح لي كأني مبتدئ، أعطني مثالًا، اطرح أسئلة لاختبار فهمي.\n\n## استخدام ضار\n\nنسخ واجب كامل بدون محاولة.\n\n## الخلاصة\n\nخلّيه مدرّسًا خاصًا، مش بديلًا عن التفكير.",
    bodyEn: "## Useful uses\n\nExplain like I am new, give examples, quiz me after I try.\n\n## Harmful uses\n\nPasting full assignments with no attempt.\n\n## Bottom line\n\nTutor, not substitute for thinking.",
    cat: "ai",
    sub: "guides-tips",
    tags: ["chatgpt", "study", "ai"],
    readTime: 3,
    theme: "ai",
  },
];

export function generateArticles({ count = TOPIC_CONTENT.length, category, startIndex = 0 } = {}) {
  let pool = TOPIC_CONTENT;
  if (category) pool = pool.filter((t) => t.cat === category);
  if (!pool.length) {
    console.warn('[articles] TOPIC_CONTENT is empty — refusing generic filler.');
    return [];
  }
  const safeCount = Math.min(count, pool.length - startIndex);
  if (count > pool.length - startIndex) {
    console.warn(`[articles] Requested ${count}, but only ${pool.length} real articles exist — capping at ${Math.max(safeCount, 0)} instead of duplicating with (2)/(3) suffixes.`);
  }
  const items = [];
  for (let i = 0; i < safeCount; i++) {
    const abs = startIndex + i;
    const t = pool[abs % pool.length];
    const cycle = Math.floor(abs / pool.length) + 1;

    const inferred = inferTaxonomy(
      [t.slug, t.titleEn, t.titleAr, ...(t.tags || []), t.cat, t.sub].filter(Boolean).join(' '),
    );
    const categoryId = t.cat || inferred.categoryId;
    const subcategoryId = assertSubcategory(
      categoryId,
      t.sub || inferred.subcategoryId,
    );

    const titleAr = cycle > 1 ? `${t.titleAr} (${cycle})` : t.titleAr;
    const titleEn = cycle > 1 ? `${t.titleEn} (${cycle})` : t.titleEn;
    const slug = uniqueSlug(cycle > 1 ? `${t.slug}-${cycle}` : t.slug);
    const tags = t.tags || [categoryId];

    items.push({
      id: `art-gen-${String(abs + 1).padStart(4, '0')}`,
      slug,
      title: bi(titleAr, titleEn),
      excerpt: bi(t.excerptAr, t.excerptEn),
      body: bi(t.bodyAr, t.bodyEn),
      categoryId,
      subcategoryId,
      author: t.author || DEFAULT_AUTHOR,
      date: distributedDate(abs, Math.max(count + startIndex, 1)),
      readTime: t.readTime || 4,
      heroImage: resolveArticleHero({
        categoryId,
        subcategoryId,
        tags,
        title: { ar: titleAr, en: titleEn },
        slug,
        theme: t.theme || inferred.theme,
      }),
      tags,
      isFeatured: abs < 3,
      isTrending: abs >= 3 && abs < 6,
    });
  }
  return items;
}
